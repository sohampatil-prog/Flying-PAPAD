// components/game/PapadCharacter.tsx
//
// React Concept: Presentational (dumb) component.
// This component has NO state and NO logic — it just renders what it receives.
// Position and type come from Redux via the parent.

import { PAPAD_CONFIGS, PapadType } from "../../store/slices/gameSlice";

interface Props {
  y: number;
  papadType: PapadType;
  velocity: number;
}

export default function PapadCharacter({ y, papadType, velocity }: Props) {
  const config = PAPAD_CONFIGS[papadType];

  // Tilt the papad based on velocity — feels physical
  const rotation = Math.min(Math.max(velocity * 4, -25), 45);

  return (
    <div
      className="absolute select-none"
      style={{
        left: 78,           // fixed horizontal position
        top: y,
        width: 44,
        height: 44,
        transform: `rotate(${rotation}deg)`,
        transition: "transform 0.05s linear",
        fontSize: 36,
        lineHeight: 1,
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
      }}
      aria-label={config.label}
    >
      {config.emoji}
    </div>
  );
}
