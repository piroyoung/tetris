import type { Board } from "../../../domain/entities/game-board";
import type { TetrominoType, TetrominoShape, TetrominoColor } from "../../../domain/value-objects/tetromino";
import {
  createEmptyBoard,
} from "../../../domain/entities/game-board";
import {
  randomTetrominoType,
} from "../../../domain/value-objects/tetromino";

export type ActivePiece = {
  type: TetrominoType;
  shape: TetrominoShape;
  color: TetrominoColor;
  rotation: number;
  row: number;
  col: number;
};

export type GamePhase = "idle" | "playing" | "paused" | "gameOver";

export type TetrisState = {
  board: Board;
  activePiece: ActivePiece | null;
  nextType: TetrominoType;
  score: number;
  lines: number;
  level: number;
  phase: GamePhase;
};

export function createInitialState(): TetrisState {
  return {
    board: createEmptyBoard(),
    activePiece: null,
    nextType: randomTetrominoType(),
    score: 0,
    lines: 0,
    level: 0,
    phase: "idle",
  };
}
