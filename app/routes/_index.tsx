import { useTetris } from "../lib/client/usecase/tetris/use-tetris";
import { TetrisBoard } from "../components/TetrisBoard";
import { TetrisNextPiece } from "../components/TetrisNextPiece";
import { TetrisInfo } from "../components/TetrisInfo";
import { TetrisControls } from "../components/TetrisControls";

export default function TetrisRoute() {
  const game = useTetris();

  return (
    <div
      style={{
        minHeight: "100dvh",
        backgroundColor: "#1a1a2e",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        boxSizing: "border-box",
        fontFamily: "sans-serif",
      }}
    >
      <h1
        style={{
          color: "#e0e0ff",
          fontSize: "clamp(1.2rem, 4vw, 2rem)",
          margin: "0 0 16px",
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        Tetris
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 16,
          width: "100%",
          maxWidth: 500,
        }}
      >
        <div style={{ flex: "1 1 auto", minWidth: 0 }}>
          <TetrisBoard board={game.displayBoard} />
        </div>

        <div
          style={{
            flex: "0 0 100px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <TetrisNextPiece nextType={game.nextType} />
          <TetrisInfo
            score={game.score}
            lines={game.lines}
            level={game.level}
            isIdle={game.isIdle}
            isGameOver={game.isGameOver}
            isPaused={game.isPaused}
            isPlaying={game.isPlaying}
            onStart={game.handleStart}
            onPause={game.handlePause}
            onResume={game.handleResume}
          />
        </div>
      </div>

      <div style={{ marginTop: 24, width: "100%", maxWidth: 320 }}>
        <TetrisControls
          onLeft={game.handleMoveLeft}
          onRight={game.handleMoveRight}
          onDown={game.handleMoveDown}
          onRotate={game.handleRotate}
          onHardDrop={game.handleHardDrop}
          disabled={!game.isPlaying}
        />
      </div>
    </div>
  );
}
