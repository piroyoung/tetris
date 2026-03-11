import type { TetrisState, GamePhase } from "./state";
import type { CellColor } from "../../../domain/entities/game-board";
import { BOARD_ROWS, BOARD_COLS, dropIntervalMs } from "../../../domain/entities/game-board";
import type { TetrominoType } from "../../../domain/value-objects/tetromino";

export type DisplayCellColor = CellColor | "ghost";
export type DisplayBoard = DisplayCellColor[][];

export type TetrisViewModel = {
  displayBoard: DisplayBoard;
  ghostRow: number | null;
  nextType: TetrominoType;
  score: number;
  lines: number;
  level: number;
  phase: GamePhase;
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  isIdle: boolean;
  dropInterval: number;
};

export function selectViewModel(state: TetrisState): TetrisViewModel {
  const { board, activePiece, nextType, score, lines, level, phase } = state;

  let ghostRow: number | null = null;
  if (activePiece) {
    let r = activePiece.row;
    while (true) {
      const next = r + 1;
      let valid = true;
      for (const [dr, dc] of activePiece.shape) {
        const nr = next + dr;
        const nc = activePiece.col + dc;
        if (nr < 0 || nr >= BOARD_ROWS || nc < 0 || nc >= BOARD_COLS || board[nr][nc] !== null) {
          valid = false;
          break;
        }
      }
      if (!valid) break;
      r = next;
    }
    ghostRow = r;
  }

  const displayBoard: DisplayBoard = board.map((row) => [...row] as DisplayCellColor[]);
  if (activePiece) {
    if (ghostRow !== null && ghostRow !== activePiece.row) {
      for (const [dr, dc] of activePiece.shape) {
        const r = ghostRow + dr;
        const c = activePiece.col + dc;
        if (r >= 0 && r < BOARD_ROWS && c >= 0 && c < BOARD_COLS) {
          if (displayBoard[r][c] === null) {
            displayBoard[r][c] = "ghost";
          }
        }
      }
    }
    for (const [dr, dc] of activePiece.shape) {
      const r = activePiece.row + dr;
      const c = activePiece.col + dc;
      if (r >= 0 && r < BOARD_ROWS && c >= 0 && c < BOARD_COLS) {
        displayBoard[r][c] = activePiece.color;
      }
    }
  }

  return {
    displayBoard,
    ghostRow,
    nextType,
    score,
    lines,
    level,
    phase,
    isPlaying: phase === "playing",
    isPaused: phase === "paused",
    isGameOver: phase === "gameOver",
    isIdle: phase === "idle",
    dropInterval: dropIntervalMs(level),
  };
}
