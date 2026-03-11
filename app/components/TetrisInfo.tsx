import { Text, Button } from "@fluentui/react-components";

type Props = {
  score: number;
  lines: number;
  level: number;
  isIdle: boolean;
  isGameOver: boolean;
  isPaused: boolean;
  isPlaying: boolean;
  onStart(): void;
  onPause(): void;
  onResume(): void;
};

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <Text size={100} style={{ display: "block", color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>
        {label}
      </Text>
      <Text size={500} weight="bold" style={{ color: "#fff" }}>
        {value.toLocaleString()}
      </Text>
    </div>
  );
}

export function TetrisInfo(props: Props) {
  const { score, lines, level, isIdle, isGameOver, isPaused, isPlaying, onStart, onPause, onResume } = props;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <StatItem label="Score" value={score} />
      <StatItem label="Lines" value={lines} />
      <StatItem label="Level" value={level} />

      <div style={{ marginTop: 8 }}>
        {(isIdle || isGameOver) && (
          <Button appearance="primary" onClick={onStart} style={{ width: "100%" }}>
            {isGameOver ? "Play Again" : "Start Game"}
          </Button>
        )}
        {isPlaying && (
          <Button appearance="secondary" onClick={onPause} style={{ width: "100%" }}>
            Pause
          </Button>
        )}
        {isPaused && (
          <Button appearance="primary" onClick={onResume} style={{ width: "100%" }}>
            Resume
          </Button>
        )}
      </div>

      {isGameOver && (
        <Text size={300} style={{ color: "#F00000", textAlign: "center", marginTop: 8 }}>
          Game Over
        </Text>
      )}
    </div>
  );
}
