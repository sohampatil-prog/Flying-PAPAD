// components/game/ObstacleSet.tsx
//
// React Concept: Rendering a list with .map() — each item needs a unique `key`.
// The key helps React track which DOM nodes to update/remove efficiently.

import { Obstacle } from "../../store/slices/gameSlice";

interface Props {
  obstacles: Obstacle[];
  canvasHeight: number;
}

const PIPE_WIDTH = 60;

export default function ObstacleSet({ obstacles, canvasHeight }: Props) {
  return (
    <>
      {obstacles.map((obs) => {
        const topPipeHeight   = obs.gapTop;
        const bottomPipeTop   = obs.gapTop + obs.gapSize;
        const bottomPipeHeight = canvasHeight - bottomPipeTop;

        return (
          // React Concept: Fragment shorthand <> — groups elements without a div wrapper
          <div key={obs.id}>
            {/* Top pipe (belan rolling down) */}
            <div
              className="absolute rounded-b-lg"
              style={{
                left: obs.x,
                top: 0,
                width: PIPE_WIDTH,
                height: topPipeHeight,
                background: "linear-gradient(180deg, #92400e 0%, #78350f 100%)",
                borderBottom: "4px solid #451a03",
                boxShadow: "inset -4px 0 8px rgba(0,0,0,0.3), 2px 0 6px rgba(0,0,0,0.2)",
              }}
            >
              {/* Pipe cap */}
              <div
                className="absolute bottom-0 rounded-b-md"
                style={{
                  left: -6, width: PIPE_WIDTH + 12, height: 20,
                  background: "#92400e",
                  borderBottom: "4px solid #451a03",
                }}
              />
            </div>

            {/* Bottom pipe */}
            <div
              className="absolute rounded-t-lg"
              style={{
                left: obs.x,
                top: bottomPipeTop,
                width: PIPE_WIDTH,
                height: bottomPipeHeight,
                background: "linear-gradient(180deg, #78350f 0%, #92400e 100%)",
                borderTop: "4px solid #451a03",
                boxShadow: "inset -4px 0 8px rgba(0,0,0,0.3), 2px 0 6px rgba(0,0,0,0.2)",
              }}
            >
              {/* Pipe cap */}
              <div
                className="absolute top-0 rounded-t-md"
                style={{
                  left: -6, width: PIPE_WIDTH + 12, height: 20,
                  background: "#78350f",
                  borderTop: "4px solid #451a03",
                }}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}
