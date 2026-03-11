import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import fs from "fs";

// Force all @fluentui/* packages (and their sub-path exports) to their ESM
// (lib/) builds so that Vite 7's SSR module runner (which defaults to the
// "node" CJS condition) doesn't pick up lib-commonjs and fail with
// "exports is not defined".
function fluentUiEsmAliases(): { find: RegExp; replacement: string }[] {
  const fluentDir = path.resolve("./node_modules/@fluentui");
  if (!fs.existsSync(fluentDir)) return [];

  return fs.readdirSync(fluentDir).flatMap((pkg) => {
    const pkgJson = path.join(fluentDir, pkg, "package.json");
    if (!fs.existsSync(pkgJson)) return [];
    const manifest = JSON.parse(fs.readFileSync(pkgJson, "utf-8")) as {
      module?: string;
      exports?: Record<
        string,
        { import?: string; node?: string; require?: string }
      >;
    };

    const aliases: { find: RegExp; replacement: string }[] = [];
    const pkgEscaped = pkg.replace(/[-/]/g, "\\$&");

    // Walk every export entry and prefer "import" over "node"
    for (const [exportPath, conds] of Object.entries(manifest.exports ?? {})) {
      const esmFile = conds.import;
      if (!esmFile) continue;
      if (exportPath === ".") {
        // Exact package name match
        aliases.push({
          find: new RegExp(`^@fluentui/${pkgEscaped}$`),
          replacement: path.join(fluentDir, pkg, esmFile),
        });
      } else if (exportPath.startsWith("./")) {
        // Sub-path: e.g. "./jsx-runtime" → "@fluentui/react-jsx-runtime/jsx-runtime"
        const subPath = exportPath.slice(2); // remove "./"
        const subPathEscaped = subPath.replace(/[-/]/g, "\\$&");
        aliases.push({
          find: new RegExp(
            `^@fluentui/${pkgEscaped}/${subPathEscaped}$`
          ),
          replacement: path.join(fluentDir, pkg, esmFile),
        });
      }
    }

    return aliases;
  });
}

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  resolve: {
    alias: fluentUiEsmAliases(),
  },
  optimizeDeps: {
    include: ["@fluentui/react-components", "@fluentui/react-icons"],
  },
  ssr: {
    noExternal: [/^@fluentui\//],
  },
});
