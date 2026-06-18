// lib/api.ts
//
// Next.js Concept: We keep all fetch() calls in a single lib file.
// Components never call fetch directly — they call these functions.
// This mirrors the Repository pattern from PHP — one place to change
// if the API URL or headers change.

const API_BASE = process.env.NEXT_PUBLIC_PHP_API_URL ?? "http://localhost:8000";

export interface ScorePayload {
  player_name: string;
  score: number;
  papad_type: "raw" | "fried" | "baked";
}

export interface LeaderboardEntry {
  player_name: string;
  score: number;
  papad_type: string;
  played_at: string;
}

/**
 * POST /api/scores — save a score to the PHP backend
 */
export async function saveScore(payload: ScorePayload): Promise<{ id: number; message: string }> {
  const res = await fetch(`${API_BASE}/api/scores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to save score");
  }

  return res.json();
}

/**
 * GET /api/scores — fetch leaderboard
 */
export async function fetchLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  const res = await fetch(`${API_BASE}/api/scores?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  const data = await res.json();
  return data.scores as LeaderboardEntry[];
}
