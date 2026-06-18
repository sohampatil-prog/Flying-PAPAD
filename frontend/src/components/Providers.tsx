// components/Providers.tsx
//
// Next.js Concept: The App Router uses React Server Components by default.
// Redux's <Provider> uses React Context, which only works in Client Components.
// So we wrap it in a "use client" component and import it into the server layout.
// This is the recommended pattern for Redux + Next.js App Router.

"use client";

import { Provider } from "react-redux";
import { store } from "../store";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
