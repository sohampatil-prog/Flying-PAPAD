// store/slices/gameSlice.ts
//
// Redux Toolkit Concept:
//   createSlice = one place defines the state SHAPE, the REDUCERS, and auto-generates ACTION CREATORS
//   No more separate actionTypes.ts + reducer.ts files like old Redux.
//
// State design: everything the game needs at any moment lives here.

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PapadType = "raw" | "fried" | "baked";
export type GameStatus = "idle" | "running" | "paused" | "dead";

// Physics config differs per papad type — this is what makes the game interesting
export const PAPAD_CONFIGS: Record<PapadType, {
  gravity: number;       // px per frame² — how fast it falls
  flapPower: number;     // negative Y velocity on spacebar press
  color: string;        // tailwind class
  emoji: string;
  label: string;
  description: string;
}> = {
  raw: {
    gravity: 0.35,
    flapPower: -7,
    color: "bg-amber-100",
    emoji: "🫓",
    label: "Kacha Papad",
    description: "Light & floaty — easy to control",
  },
  fried: {
    gravity: 0.55,
    flapPower: -9,
    color: "bg-amber-500",
    emoji: "🟤",
    label: "Tala Papad",
    description: "Heavy & crispy — sinks fast, punchy flap",
  },
  baked: {
    gravity: 0.42,
    flapPower: -7.8,
    color: "bg-yellow-300",
    emoji: "🟡",
    label: "Seka Papad",
    description: "Balanced — medium weight, medium control",
  },
};

// Obstacle (the pipes / rolling belan)
export interface Obstacle {
  id: number;
  x: number;       // px from left
  gapTop: number;  // px from top where the gap starts
  gapSize: number; // height of the gap
  scored: boolean; // has the player already earned a point for passing this?
}

// ─── State Shape ──────────────────────────────────────────────────────────────

interface GameState {
  status: GameStatus;
  papadType: PapadType;
  papadY: number;          // vertical position (px from top of canvas)
  papadVelocity: number;   // current Y velocity
  obstacles: Obstacle[];
  score: number;
  highScore: number;
  frame: number;           // tick counter used for obstacle spawning
  playerName: string;
  scoreSaved: boolean;
}

const CANVAS_HEIGHT = 500;

const initialState: GameState = {
  status: "idle",
  papadType: "raw",
  papadY: CANVAS_HEIGHT / 2,
  papadVelocity: 0,
  obstacles: [],
  score: 0,
  highScore: 0,
  frame: 0,
  playerName: "",
  scoreSaved: false,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const gameSlice = createSlice({
  name: "game",
  initialState,

  // Redux Toolkit Concept:
  // Each key in `reducers` is a reducer function AND its action creator.
  // RTK uses Immer under the hood — you can "mutate" state directly here
  // and Immer produces a new immutable copy. No more spread operators!
  reducers: {
    // Player picks a papad type on the menu
    selectPapad(state, action: PayloadAction<PapadType>) {
      state.papadType = action.payload;
    },

    // Player types their name
    setPlayerName(state, action: PayloadAction<string>) {
      state.playerName = action.payload;
    },

    // Start / restart the game
    startGame(state) {
      state.status = "running";
      state.papadY = CANVAS_HEIGHT / 2;
      state.papadVelocity = 0;
      state.obstacles = [];
      state.score = 0;
      state.frame = 0;
      state.scoreSaved = false;
    },

    // Spacebar pressed — give the papad an upward kick
    flap(state) {
      if (state.status !== "running") return;
      const { flapPower } = PAPAD_CONFIGS[state.papadType];
      state.papadVelocity = flapPower;
    },

    // Called every animation frame — applies gravity, moves obstacles
    tick(state) {
      if (state.status !== "running") return;

      const { gravity } = PAPAD_CONFIGS[state.papadType];

      // Apply gravity
      state.papadVelocity += gravity;
      state.papadY += state.papadVelocity;

      // Clamp to canvas — hitting top counts as dying too
      if (state.papadY < 0) {
        state.papadY = 0;
        state.papadVelocity = 0;
      }

      // Move obstacles left
      const OBSTACLE_SPEED = 3;
      state.obstacles = state.obstacles
        .map((obs) => ({ ...obs, x: obs.x - OBSTACLE_SPEED }))
        .filter((obs) => obs.x > -80); // remove off-screen obstacles

      // Spawn a new obstacle every 100 frames
      state.frame += 1;
      if (state.frame % 100 === 0) {
        const gapSize = 160;
        const minTop = 60;
        const maxTop = CANVAS_HEIGHT - gapSize - 60;
        const gapTop = Math.floor(Math.random() * (maxTop - minTop) + minTop);

        state.obstacles.push({
          id: state.frame,
          x: 700,          // spawn just off the right edge
          gapTop,
          gapSize,
          scored: false,
        });
      }

      // Score: player passes an obstacle's center
      const PAPAD_X = 100;
      const PAPAD_RADIUS = 22;
      for (const obs of state.obstacles) {
        if (!obs.scored && obs.x + 30 < PAPAD_X) {
          obs.scored = true;
          state.score += 1;
          if (state.score > state.highScore) {
            state.highScore = state.score;
          }
        }
      }

      // Collision detection
      // 1) Hit the ground
      if (state.papadY + PAPAD_RADIUS * 2 >= CANVAS_HEIGHT) {
        state.status = "dead";
        return;
      }

      // 2) Hit an obstacle pipe
      const PIPE_WIDTH = 60;
      for (const obs of state.obstacles) {
        const inHorizontalRange =
          PAPAD_X + PAPAD_RADIUS > obs.x &&
          PAPAD_X - PAPAD_RADIUS < obs.x + PIPE_WIDTH;

        const inVerticalDanger =
          state.papadY < obs.gapTop ||
          state.papadY + PAPAD_RADIUS * 2 > obs.gapTop + obs.gapSize;

        if (inHorizontalRange && inVerticalDanger) {
          state.status = "dead";
          return;
        }
      }
    },

    markScoreSaved(state) {
      state.scoreSaved = true;
    },
  },
});

export const {
  selectPapad,
  setPlayerName,
  startGame,
  flap,
  tick,
  markScoreSaved,
} = gameSlice.actions;

export default gameSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────
// Redux Concept: selectors are functions that extract specific pieces of state.
// Using them keeps components decoupled from the exact state shape.

export type RootState = { game: GameState };

export const selectGameStatus = (state: RootState) => state.game.status;
export const selectPapadY     = (state: RootState) => state.game.papadY;
export const selectObstacles  = (state: RootState) => state.game.obstacles;
export const selectScore      = (state: RootState) => state.game.score;
export const selectHighScore  = (state: RootState) => state.game.highScore;
export const selectPapadType  = (state: RootState) => state.game.papadType;
export const selectPlayerName = (state: RootState) => state.game.playerName;
export const selectScoreSaved = (state: RootState) => state.game.scoreSaved;
