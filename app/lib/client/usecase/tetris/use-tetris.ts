import { useReducer, useEffect, useCallback } from "react";
import { createInitialState } from "./state";
import { tetrisReducer } from "./reducer";
import { selectViewModel } from "./selectors";
import type { TetrisViewModel } from "./selectors";

export type TetrisHandlers = {
  handleStart(): void;
  handlePause(): void;
  handleResume(): void;
  handleMoveLeft(): void;
  handleMoveRight(): void;
  handleMoveDown(): void;
  handleHardDrop(): void;
  handleRotate(): void;
};

export function useTetris(): TetrisViewModel & TetrisHandlers {
  const [state, dispatch] = useReducer(tetrisReducer, undefined, createInitialState);
  const vm = selectViewModel(state);

  // Restart the interval whenever isPlaying or dropInterval changes so the
  // speed update takes effect immediately on each new level.
  useEffect(() => {
    if (!vm.isPlaying) return;
    const id = setInterval(() => {
      dispatch({ type: "tick" });
    }, vm.dropInterval);
    return () => clearInterval(id);
  }, [vm.isPlaying, vm.dropInterval]);

  useEffect(() => {
    if (!vm.isPlaying) return;

    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          dispatch({ type: "moveLeft" });
          break;
        case "ArrowRight":
          e.preventDefault();
          dispatch({ type: "moveRight" });
          break;
        case "ArrowDown":
          e.preventDefault();
          dispatch({ type: "moveDown" });
          break;
        case "ArrowUp":
        case "x":
        case "X":
          e.preventDefault();
          dispatch({ type: "rotate" });
          break;
        case " ":
          e.preventDefault();
          dispatch({ type: "hardDrop" });
          break;
        case "p":
        case "P":
        case "Escape":
          e.preventDefault();
          dispatch({ type: "pauseGame" });
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [vm.isPlaying]);

  const handleStart = useCallback(() => dispatch({ type: "startGame" }), []);
  const handlePause = useCallback(() => dispatch({ type: "pauseGame" }), []);
  const handleResume = useCallback(() => dispatch({ type: "resumeGame" }), []);
  const handleMoveLeft = useCallback(() => dispatch({ type: "moveLeft" }), []);
  const handleMoveRight = useCallback(() => dispatch({ type: "moveRight" }), []);
  const handleMoveDown = useCallback(() => dispatch({ type: "moveDown" }), []);
  const handleHardDrop = useCallback(() => dispatch({ type: "hardDrop" }), []);
  const handleRotate = useCallback(() => dispatch({ type: "rotate" }), []);

  return {
    ...vm,
    handleStart,
    handlePause,
    handleResume,
    handleMoveLeft,
    handleMoveRight,
    handleMoveDown,
    handleHardDrop,
    handleRotate,
  };
}
