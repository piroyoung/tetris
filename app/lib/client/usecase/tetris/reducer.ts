import type { TetrisState, ActivePiece } from "./state";
import { createInitialState } from "./state";
import type { TetrominoType } from "../../../domain/value-objects/tetromino";
import { TETROMINOES, randomTetrominoType } from "../../../domain/value-objects/tetromino";
import {
  BOARD_COLS,
  isValidPosition,
  lockPiece,
  clearLines,
  scoreForLines,
  levelForLines,
} from "../../../domain/entities/game-board";

export type TetrisAction =
  | { type: "startGame" }
  | { type: "pauseGame" }
  | { type: "resumeGame" }
  | { type: "moveLeft" }
  | { type: "moveRight" }
  | { type: "moveDown" }
  | { type: "hardDrop" }
  | { type: "rotate" }
  | { type: "tick" };

function spawnPiece(type: TetrominoType, row = 0, col = Math.floor((BOARD_COLS - 4) / 2)): ActivePiece {
  const tetromino = TETROMINOES[type];
  return {
    type,
    shape: tetromino.shapes[0],
    color: tetromino.color,
    rotation: 0,
    row,
    col,
  };
}

function rotatePiece(piece: ActivePiece): ActivePiece {
  const tetromino = TETROMINOES[piece.type];
  const nextRotation = (piece.rotation + 1) % 4;
  return {
    ...piece,
    rotation: nextRotation,
    shape: tetromino.shapes[nextRotation],
  };
}

function lockAndSpawn(state: TetrisState): TetrisState {
  const { board, activePiece, nextType } = state;
  if (!activePiece) return state;

  const locked = lockPiece(board, activePiece.shape, activePiece.color, activePiece.row, activePiece.col);
  const { board: clearedBoard, linesCleared } = clearLines(locked);
  const newLines = state.lines + linesCleared;
  const newLevel = levelForLines(newLines);
  const newScore = state.score + scoreForLines(linesCleared, state.level);
  const newNextType = randomTetrominoType();
  const newPiece = spawnPiece(nextType);

  if (!isValidPosition(clearedBoard, newPiece.shape, newPiece.row, newPiece.col)) {
    return {
      ...state,
      board: clearedBoard,
      activePiece: null,
      lines: newLines,
      level: newLevel,
      score: newScore,
      phase: "gameOver",
    };
  }

  return {
    ...state,
    board: clearedBoard,
    activePiece: newPiece,
    nextType: newNextType,
    lines: newLines,
    level: newLevel,
    score: newScore,
  };
}

export function tetrisReducer(state: TetrisState, action: TetrisAction): TetrisState {
  switch (action.type) {
    case "startGame": {
      const newNextType = randomTetrominoType();
      const firstType = randomTetrominoType();
      const firstPiece = spawnPiece(firstType);
      return {
        ...createInitialState(),
        activePiece: firstPiece,
        nextType: newNextType,
        phase: "playing",
      };
    }

    case "pauseGame": {
      if (state.phase !== "playing") return state;
      return { ...state, phase: "paused" };
    }

    case "resumeGame": {
      if (state.phase !== "paused") return state;
      return { ...state, phase: "playing" };
    }

    case "moveLeft": {
      if (state.phase !== "playing" || !state.activePiece) return state;
      const moved = { ...state.activePiece, col: state.activePiece.col - 1 };
      if (!isValidPosition(state.board, moved.shape, moved.row, moved.col)) return state;
      return { ...state, activePiece: moved };
    }

    case "moveRight": {
      if (state.phase !== "playing" || !state.activePiece) return state;
      const moved = { ...state.activePiece, col: state.activePiece.col + 1 };
      if (!isValidPosition(state.board, moved.shape, moved.row, moved.col)) return state;
      return { ...state, activePiece: moved };
    }

    case "moveDown": {
      if (state.phase !== "playing" || !state.activePiece) return state;
      const moved = { ...state.activePiece, row: state.activePiece.row + 1 };
      if (!isValidPosition(state.board, moved.shape, moved.row, moved.col)) {
        return lockAndSpawn(state);
      }
      return { ...state, activePiece: moved };
    }

    case "hardDrop": {
      if (state.phase !== "playing" || !state.activePiece) return state;
      let piece = state.activePiece;
      while (isValidPosition(state.board, piece.shape, piece.row + 1, piece.col)) {
        piece = { ...piece, row: piece.row + 1 };
      }
      return lockAndSpawn({ ...state, activePiece: piece });
    }

    case "rotate": {
      if (state.phase !== "playing" || !state.activePiece) return state;
      const rotated = rotatePiece(state.activePiece);
      for (const offset of [0, -1, 1, -2, 2]) {
        const kicked = { ...rotated, col: rotated.col + offset };
        if (isValidPosition(state.board, kicked.shape, kicked.row, kicked.col)) {
          return { ...state, activePiece: kicked };
        }
      }
      return state;
    }

    case "tick": {
      if (state.phase !== "playing" || !state.activePiece) return state;
      const moved = { ...state.activePiece, row: state.activePiece.row + 1 };
      if (!isValidPosition(state.board, moved.shape, moved.row, moved.col)) {
        return lockAndSpawn(state);
      }
      return { ...state, activePiece: moved };
    }

    default:
      return state;
  }
}
