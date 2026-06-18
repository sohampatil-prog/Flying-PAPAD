// components/game/MenuScreen.tsx
//
// React Concept: Controlled input — the input's value is driven by React state (playerName in Redux).
// Every keystroke dispatches an action, Redux updates, component re-renders.
// React owns the truth, not the DOM.

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectPapad,
  setPlayerName,
  startGame,
  selectPapadType,
  selectPlayerName,
  selectHighScore,
  PAPAD_CONFIGS,
  PapadType,
} from "../../store/slices/gameSlice";

const PAPAD_TYPES: PapadType[] = ["raw", "fried", "baked"];

export default function MenuScreen() {
  const dispatch    = useAppDispatch();
  const papadType   = useAppSelector(selectPapadType);
  const playerName  = useAppSelector(selectPlayerName);
  const highScore   = useAppSelector(selectHighScore);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-amber-950/90 backdrop-blur-sm z-20 px-6">
      <h1 className="text-5xl font-black text-amber-300 mb-1 tracking-tight drop-shadow-lg">
        पापड़ उड़ 🫓
      </h1>
      <p className="text-amber-400 text-sm mb-6 font-mono">PAPAD UDD GAME</p>

      {highScore > 0 && (
        <p className="text-amber-200 mb-4 text-sm">
          🏆 Best so far: <span className="font-bold text-white">{highScore}</span>
        </p>
      )}

      {/* Player name — controlled input */}
      <div className="w-full max-w-xs mb-5">
        <label className="text-amber-300 text-xs font-semibold block mb-1 uppercase tracking-wider">
          Your Name
        </label>
        <input
          type="text"
          value={playerName}
          maxLength={50}
          onChange={(e) => dispatch(setPlayerName(e.target.value))}
          placeholder="e.g. Soham"
          className="w-full bg-amber-900/60 border border-amber-600 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-amber-600"
        />
      </div>

      {/* Papad type selector */}
      <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
        Choose Your Papad
      </p>
      <div className="flex gap-3 mb-7 w-full max-w-sm">
        {PAPAD_TYPES.map((type) => {
          const config = PAPAD_CONFIGS[type];
          const active = papadType === type;
          return (
            <button
              key={type}
              onClick={() => dispatch(selectPapad(type))}
              className={`flex-1 flex flex-col items-center py-3 px-2 rounded-xl border-2 transition-all text-sm font-semibold
                ${active
                  ? "border-amber-400 bg-amber-700/60 text-white scale-105 shadow-lg shadow-amber-500/30"
                  : "border-amber-800 bg-amber-900/40 text-amber-400 hover:border-amber-600"
                }`}
            >
              <span className="text-2xl mb-1">{config.emoji}</span>
              <span>{config.label}</span>
              <span className="text-xs font-normal mt-1 opacity-70">{config.description}</span>
            </button>
          );
        })}
      </div>

      {/* Start button */}
      <button
        onClick={() => {
          if (!playerName.trim()) {
            alert("Naam toh batao! 😄 (Enter your name)");
            return;
          }
          dispatch(startGame());
        }}
        className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-lg px-10 py-3 rounded-2xl shadow-lg shadow-amber-500/40 transition-all hover:scale-105 active:scale-95"
      >
        Uda Do! 🚀
      </button>

      <p className="text-amber-600 text-xs mt-4">Spacebar ya screen tap = flap</p>
    </div>
  );
}
