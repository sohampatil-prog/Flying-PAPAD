// app/layout.tsx
//
// Next.js Concept: Root Layout
// Every page in the App Router is wrapped by this layout.
// It renders ONCE and persists between navigations (no full-page reload).
// This is a Server Component — no "use client" directive = server by default.

import type { Metadata } from "next";
import "./globals.css";
import Providers from "../components/Providers";

export const metadata: Metadata = {
  title: "पापड़ उड़ — Papad Udd Game",
  description: "Fly your papad through obstacles. A desi Flappy Bird!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-amber-950 min-h-screen">
        {/* Providers wraps everything in the Redux store */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
