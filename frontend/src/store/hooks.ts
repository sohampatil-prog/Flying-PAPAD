// store/hooks.ts
//
// Redux Concept: We create typed versions of useSelector and useDispatch
// so TypeScript knows the exact shape of our state everywhere.
// Import these instead of the raw react-redux hooks in components.

import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState } from "./slices/gameSlice";
import type { store } from "./index";

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
