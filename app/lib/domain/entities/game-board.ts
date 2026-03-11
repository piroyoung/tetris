import type { TetrominoShape, TetrominoColor } from "../value-objects/tetromino";

export const BOARD_COLS = 10;
export const BOARD_ROWS = 20;

export type CellColor = TetrominoColor | null;
export type Board = CellColor[][];

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(null));
}

export function isValidPosition(
  board: Board,
  shape: TetrominoShape,
  row: number,
  col: number
): boolean {
  for (const [dr, dc] of shape) {
    const r = row + dr;
    const c = col + dc;
    if (r < 0 || r >= BOARD_ROWS || c < 0 || c >= BOARD_COLS) return false;
    if (board[r][c] !== null) return false;
  }
  return true;
}

export function lockPiece(
  board: Board,
  shape: TetrominoShape,
  color: TetrominoColor,
  row: number,
  col: number
): Board {
  const next = board.map((r) => [...r]);
  for (const [dr, dc] of shape) {
    const r = row + dr;
    const c = col + dc;
    if (r >= 0 && r < BOARD_ROWS && c >= 0 && c < BOARD_COLS) {
      next[r][c] = color;
    }
  }
  return next;
}

export type ClearResult = { board: Board; linesCleared: number };

export function clearLines(board: Board): ClearResult {
  const remaining = board.filter((row) => row.some((cell) => cell === null));
  const linesCleared = BOARD_ROWS - remaining.length;
  const emptyRows = Array.from({ length: linesCleared }, () =>
    Array<CellColor>(BOARD_COLS).fill(null)
  );
  return { board: [...emptyRows, ...remaining], linesCleared };
}

export function scoreForLines(linesCleared: number, level: number): number {
  const base = [0, 100, 300, 500, 800];
  return (base[linesCleared] ?? 0) * (level + 1);
}

export function levelForLines(totalLines: number): number {
  return Math.floor(totalLines / 10);
}

export function dropIntervalMs(level: number): number {
  return Math.max(100, 800 - level * 70);
}
