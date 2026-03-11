import { TETROMINOES } from "../lib/domain/value-objects/tetromino";
import type { TetrominoType } from "../lib/domain/value-objects/tetromino";
import { TetrisCell } from "./TetrisCell";
import { Text } from "@fluentui/react-components";
import type { DisplayCellColor } from "../lib/client/usecase/tetris/selectors";

type Props = {
  nextType: TetrominoType;
};

const PREVIEW_SIZE = 4;

export function TetrisNextPiece({ nextType }: Props) {
  const tetromino = TETROMINOES[nextType];
  const shape = tetromino.shapes[0];

  const grid: DisplayCellColor[][] = Array.from({ length: PREVIEW_SIZE }, () =>
    Array(PREVIEW_SIZE).fill(null)
  );
  for (const [r, c] of shape) {
    if (r < PREVIEW_SIZE && c < PREVIEW_SIZE) {
      grid[r][c] = tetromino.color;
    }
  }

  return (
    <div>
      <Text size={200} weight="semibold" style={{ display: "block", marginBottom: 4, color: "#aaa" }}>
        NEXT
      </Text>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${PREVIEW_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${PREVIEW_SIZE}, 1fr)`,
          width: 80,
          height: 80,
          backgroundColor: "#111",
          border: "1px solid #444",
          borderRadius: 4,
        }}
      >
        {grid.flatMap((row, r) =>
          row.map((cell, c) => <TetrisCell key={`${r}-${c}`} color={cell} />)
        )}
      </div>
    </div>
  );
}
