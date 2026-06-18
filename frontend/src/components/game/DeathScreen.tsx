// components/game/DeathScreen.tsx
//
// Next.js Concept: This component calls our PHP backend via the lib/api.ts helper.
// useState manages LOCAL async state (loading, error) that doesn't need to be
// in Redux — it's only relevant to this one component's UI.

"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  startGame,
  selectScore,
  selectPlayerName,
  selectPapadType,
  selectScoreSaved,
  markScoreSaved,
  PAPAD_CONFIGS,
} from "../../store/slices/gameSlice";
import { saveScore } from "../../lib/api";

export default function DeathScreen() {
  const dispatch    = useAppDispatch();
  const score       = useAppSelector(selectScore);
  const playerName  = useAppSelector(selectPlayerName);
  const papadType   = useAppSelector(selectPapadType);
  const scoreSaved  = useAppSelector(selectScoreSaved);
  const config      = PAPAD_CONFIGS[papadType];

  // Local component state for the save API call
  const [saving, setSaving]   = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [saveErr, setSaveErr] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setSaveErr(null);
    try {
      const result = await saveScore({
        player_name: playerName || "Anon",
        score,
        papad_type: papadType,
      });
      setSaveMsg(result.message);
      dispatch(markScoreSaved()); // Redux: mark so we don't double-save
    } catch (err: unknown) {
      setSaveErr(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/90 backdrop-blur-sm z-20 px-6">
      <p className="text-6xl mb-2">💥</p>
      <h2 className="text-3xl font-black text-red-300 mb-1">Toot Gaya!</h2>
      <p className="text-red-400 text-sm mb-6">Your {config.label} crashed</p>

      <div className="bg-red-900/60 border border-red-700 rounded-2xl px-8 py-5 mb-6 text-center">
        <p className="text-red-300 text-xs uppercase tracking-widest mb-1">Final Score</p>
        <p className="text-white text-5xl font-black">{score}</p>
      </div>

      {/* Save score to PHP backend */}
      {!scoreSaved ? (
        <button
          onClick={handleSave}
          disabled={saving}
          className="mb-3 bg-amber-400 hover:bg-amber-300 disabled:bg-amber-700 text-amber-950 font-bold px-8 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95"
        >
          {saving ? "Saving..." : "💾 Save Score"}
        </button>
      ) : (
        <p className="text-green-400 text-sm mb-3 font-semibold">✅ {saveMsg}</p>
      )}

      {saveErr && (
        <p className="text-red-400 text-xs mb-3">⚠️ {saveErr}</p>
      )}

      <button
        onClick={() => dispatch(startGame())}
        className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-2.5 rounded-xl transition-all border border-white/20"
      >
        🔄 Phir Se Khelo
      </button>
    </div>
  );
}
