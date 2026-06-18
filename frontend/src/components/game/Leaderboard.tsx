// components/game/Leaderboard.tsx
//
// Next.js Concept: Data fetching in a Client Component using useEffect.
// This is the classic pattern for fetching data AFTER the component mounts.
// (For server-side fetching, Next.js has async Server Components — covered in README.)

"use client";

import { useEffect, useState } from "react";
import { fetchLeaderboard, LeaderboardEntry } from "../../lib/api";
import { PAPAD_CONFIGS } from "../../store/slices/gameSlice";

export default function Leaderboard() {
  const [entries, setEntries]   = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard(10)
      .then(setEntries)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []); // [] = run only once when component mounts

  if (loading) return <p className="text-amber-400 text-sm text-center py-4">Loading...</p>;
  if (error)   return <p className="text-red-400 text-sm text-center py-4">⚠️ {error}</p>;
  if (entries.length === 0)
    return <p className="text-amber-600 text-sm text-center py-4">Koi score nahi abhi tak! Be the first 🫓</p>;

  return (
    <div className="w-full max-w-sm mx-auto">
      <h3 className="text-amber-300 font-bold text-sm uppercase tracking-widest text-center mb-3">
        🏆 Leaderboard
      </h3>
      <div className="space-y-2">
        {entries.map((entry, i) => {
          // Type assertion — entry.papad_type is a key of PAPAD_CONFIGS
          const config = PAPAD_CONFIGS[entry.papad_type as keyof typeof PAPAD_CONFIGS];
          return (
            <div
              key={i}
              className="flex items-center gap-3 bg-amber-900/40 border border-amber-800/50 rounded-xl px-4 py-2.5 text-sm"
            >
              <span className="text-amber-500 font-black w-6 text-center">
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}
              </span>
              <span className="text-white flex-1 font-medium truncate">{entry.player_name}</span>
              <span className="text-amber-400">{config?.emoji ?? "🫓"}</span>
              <span className="text-white font-bold">{entry.score}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
