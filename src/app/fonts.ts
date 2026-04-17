import localFont from "next/font/local";

/**
 * Font Loading Strategy: Self-hosted with "swap" display
 *
 * Fonts are served from /public/fonts/ to eliminate network dependency
 * on Google Fonts API during builds. This prevents ETIMEDOUT failures
 * in CI environments (GitHub Actions) where the Google Fonts API
 * request can timeout during `npm run build`.
 *
 * Display "swap" (switched from "optional" 2026-04-17):
 * - "optional" has a 100ms block budget: if the font file hasn't finished
 *   loading, the browser uses system fallback for the entire session.
 *   On slow 3G / first-visit the brand typography was being lost.
 * - "swap" shows system fallback immediately, then swaps when the web
 *   font finishes downloading. CLS risk is mitigated because Next.js
 *   computes metric-matched fallback sizing for local fonts (auto
 *   size-adjust + ascent-override + descent-override).
 */
export const inter = localFont({
	src: "../../public/fonts/inter-latin-var.woff2",
	variable: "--font-sans",
	display: "swap",
	preload: true,
	weight: "100 900",
});

export const jetbrainsMono = localFont({
	src: "../../public/fonts/jetbrains-mono-latin-var.woff2",
	variable: "--font-mono",
	display: "swap",
	preload: true,
	weight: "100 800",
});
