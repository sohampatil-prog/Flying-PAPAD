// store/index.ts
//
// Redux Concept: configureStore wires all slices together.
// In a bigger app you'd add more slices (authSlice, settingsSlice, etc.)
// and they'd all go into the `reducer` object here.

import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./slices/gameSlice";
import type { RootState } from "./slices/gameSlice";
import type { AppDispatch } from "./hooks";

export const store = configureStore({
  reducer: {
    game: gameReducer,
    // add more slices here in the future:
    // settings: settingsReducer,
  },
});

export type { RootState };
export type { AppDispatch };
