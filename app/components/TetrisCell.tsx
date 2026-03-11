import type { DisplayCellColor } from "../lib/client/usecase/tetris/selectors";

type Props = {
  color: DisplayCellColor;
};

export function TetrisCell({ color }: Props) {
  const isGhost = color === "ghost";
  const style: React.CSSProperties = {
    width: "100%",
    aspectRatio: "1",
    borderRadius: 2,
    boxSizing: "border-box",
    border: isGhost
      ? "2px solid rgba(255,255,255,0.25)"
      : color
      ? "2px solid rgba(255,255,255,0.5)"
      : "1px solid rgba(255,255,255,0.05)",
    backgroundColor: isGhost
      ? "rgba(255,255,255,0.08)"
      : color ?? "rgba(0,0,0,0.3)",
  };
  return <div style={style} aria-hidden="true" />;
}
