// components/game/GameCanvas.tsx
//
// This is the "smart" (container) component.
// It reads from Redux, owns the game loop hook, and renders all sub-components.
// Smart components connect to the store. Dumb components just render props.

"use client";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  selectGameStatus,
  selectPapadY,
  selectObstacles,
  selectScore,
  selectHighScore,
  selectPapadType,
  flap,
} from "../../store/slices/gameSlice";
import { useGameLoop } from "../../hooks/useGameLoop";
import PapadCharacter from "./PapadCharacter";
import ObstacleSet from "./ObstacleSet";
import ScoreDisplay from "./ScoreDisplay";
import MenuScreen from "./MenuScreen";
import DeathScreen from "./DeathScreen";

const CANVAS_WIDTH  = 700;
const CANVAS_HEIGHT = 500;

export default function GameCanvas() {
  const dispatch  = useAppDispatch();
  const status    = useAppSelector(selectGameStatus);
  const papadY    = useAppSelector(selectPapadY);
  const obstacles = useAppSelector(selectObstacles);
  const score     = useAppSelector(selectScore);
  const highScore = useAppSelector(selectHighScore);
  const papadType = useAppSelector(selectPapadType);

  // Wire up the game loop and keyboard listener (custom hook)
  useGameLoop();

  // Get papad velocity for tilt effect — we read it from the raw state via selector
  // We do this inline since velocity is only needed for the visual tilt
  const papadVelocity = useAppSelector((s) => s.game.papadVelocity);

  return (
    <div
      className="relative overflow-hidden rounded-2xl border-2 border-amber-800 shadow-2xl shadow-amber-900/50 cursor-pointer select-none"
      style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT, maxWidth: "100%" }}
      onClick={() => dispatch(flap())}  // tap to flap on mobile
      tabIndex={0}
      aria-label="Papad Udd Game canvas — press Space or tap to flap"
    >
      {/* Sky background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #1c0a00 0%, #7c2d12 50%, #431407 100%)",
        }}
      >
        {/* Stars */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-100 opacity-40"
            style={{
              width:  Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left:   `${(i * 37 + 11) % 100}%`,
              top:    `${(i * 53 + 7) % 60}%`,
            }}
          />
        ))}
      </div>

      {/* Ground */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: 30,
          background: "linear-gradient(180deg, #92400e 0%, #78350f 100%)",
          borderTop: "3px solid #451a03",
        }}
      />

      {/* Game objects */}
      <ObstacleSet obstacles={obstacles} canvasHeight={CANVAS_HEIGHT} />

      <PapadCharacter y={papadY} papadType={papadType} velocity={papadVelocity} />

      {/* HUD (only during active game) */}
      {status === "running" && (
        <ScoreDisplay score={score} highScore={highScore} />
      )}

      {/* Overlays */}
      {status === "idle" && <MenuScreen />}
      {status === "dead" && <DeathScreen />}

      {/* Hint text while running */}
      {status === "running" && (
        <p className="absolute bottom-8 left-0 right-0 text-center text-amber-700 text-xs pointer-events-none">
          SPACE / TAP to flap
        </p>
      )}
    </div>
  );
}
