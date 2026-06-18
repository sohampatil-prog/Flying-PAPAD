// app/page.tsx
//
// Next.js Concept: This is the "/" route — the homepage.
// In App Router, every page.tsx file IS a route.
// This is a Server Component — data fetching here runs on the server.
// GameCanvas is a Client Component (imported below), which is fine —
// Server Components CAN render Client Components.

import GameCanvas from "../components/game/GameCanvas";
import Leaderboard from "../components/game/Leaderboard";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-10 px-4 gap-8">
      {/* Game header */}
      <div className="text-center">
        <h1 className="text-3xl font-black text-amber-300 tracking-tight">
          पापड़ उड़ 🫓
        </h1>
        <p className="text-amber-600 text-xs mt-1 font-mono uppercase tracking-widest">
          Papad Udd — A desi Flappy Bird
        </p>
      </div>

      {/* Main game canvas */}
      <GameCanvas />

      {/* Leaderboard (fetches from PHP backend) */}
      <div className="w-full max-w-sm">
        <Leaderboard />
      </div>
    </main>
  );
}
