import type { DisplayBoard } from "../lib/client/usecase/tetris/selectors";
import { BOARD_COLS, BOARD_ROWS } from "../lib/domain/entities/game-board";
import { TetrisCell } from "./TetrisCell";

type Props = {
  board: DisplayBoard;
};

export function TetrisBoard({ board }: Props) {
  return (
    <div
      role="grid"
      aria-label="Tetris board"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${BOARD_COLS}, 1fr)`,
        gridTemplateRows: `repeat(${BOARD_ROWS}, 1fr)`,
        width: "100%",
        aspectRatio: `${BOARD_COLS} / ${BOARD_ROWS}`,
        backgroundColor: "#111",
        border: "2px solid #444",
        borderRadius: 4,
      }}
    >
      {board.flatMap((row, r) =>
        row.map((cell, c) => (
          <TetrisCell key={`${r}-${c}`} color={cell} />
        ))
      )}
    </div>
  );
}
