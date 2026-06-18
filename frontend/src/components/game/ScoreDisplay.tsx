// components/game/ScoreDisplay.tsx
//
// React Concept: Props — data flows DOWN from parent to child.
// This component reads score from Redux via the parent GameCanvas.

interface Props {
  score: number;
  highScore: number;
}

export default function ScoreDisplay({ score, highScore }: Props) {
  return (
    <div className="absolute top-4 left-0 right-0 flex justify-between px-5 pointer-events-none">
      {/* Current score */}
      <div className="bg-black/50 text-white px-4 py-2 rounded-xl text-xl font-bold backdrop-blur-sm">
        🫓 {score}
      </div>

      {/* High score */}
      <div className="bg-black/50 text-amber-300 px-4 py-2 rounded-xl text-xl font-bold backdrop-blur-sm">
        🏆 {highScore}
      </div>
    </div>
  );
}
