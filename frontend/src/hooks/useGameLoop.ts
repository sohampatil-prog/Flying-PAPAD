// hooks/useGameLoop.ts
//
// Next.js / React Concept: Custom Hook
// A custom hook is just a function that starts with "use" and can
// call other hooks inside it. We extract the game loop logic here
// so the component stays clean and readable.
//
// This hook wires up:
//  - requestAnimationFrame for the physics tick
//  - Keydown listener for spacebar flap

import { useEffect, useRef, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  tick,
  flap,
  selectGameStatus,
} from "../store/slices/gameSlice";

export function useGameLoop() {
  const dispatch      = useAppDispatch();
  const status        = useAppSelector(selectGameStatus);
  const rafRef        = useRef<number | null>(null);

  // Game tick — called every animation frame (~60fps)
  const gameLoop = useCallback(() => {
    dispatch(tick());
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [dispatch]);

  // Start / stop the loop based on game status
  useEffect(() => {
    if (status === "running") {
      rafRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [status, gameLoop]);

  // Keyboard listener — spacebar = flap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault(); // stop page scroll
        dispatch(flap());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);
}
