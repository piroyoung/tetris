import { Button } from "@fluentui/react-components";
import {
  ArrowLeft24Regular,
  ArrowRight24Regular,
  ArrowDown24Regular,
  ArrowUp24Regular,
  ArrowCircleDown24Regular,
} from "@fluentui/react-icons";

type Props = {
  onLeft(): void;
  onRight(): void;
  onDown(): void;
  onRotate(): void;
  onHardDrop(): void;
  disabled?: boolean;
};

const controlButtonStyle: React.CSSProperties = {
  minWidth: 56,
  minHeight: 56,
  fontSize: 24,
  touchAction: "manipulation",
};

export function TetrisControls({ onLeft, onRight, onDown, onRotate, onHardDrop, disabled }: Props) {
  return (
    <div
      aria-label="Game controls"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        userSelect: "none",
      }}
    >
      <div style={{ display: "flex", gap: 8 }}>
        <Button
          appearance="subtle"
          icon={<ArrowUp24Regular />}
          style={controlButtonStyle}
          onClick={onRotate}
          disabled={disabled}
          aria-label="Rotate"
        />
        <Button
          appearance="subtle"
          icon={<ArrowCircleDown24Regular />}
          style={controlButtonStyle}
          onClick={onHardDrop}
          disabled={disabled}
          aria-label="Hard drop"
        />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Button
          appearance="subtle"
          icon={<ArrowLeft24Regular />}
          style={controlButtonStyle}
          onClick={onLeft}
          disabled={disabled}
          aria-label="Move left"
        />
        <Button
          appearance="subtle"
          icon={<ArrowDown24Regular />}
          style={controlButtonStyle}
          onClick={onDown}
          disabled={disabled}
          aria-label="Move down"
        />
        <Button
          appearance="subtle"
          icon={<ArrowRight24Regular />}
          style={controlButtonStyle}
          onClick={onRight}
          disabled={disabled}
          aria-label="Move right"
        />
      </div>
    </div>
  );
}
