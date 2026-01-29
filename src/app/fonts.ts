import localFont from "next/font/local";

/**
 * Font Loading Strategy: Self-hosted with "optional" display
 *
 * Fonts are served from /public/fonts/ to eliminate network dependency
 * on Google Fonts API during builds. This prevents ETIMEDOUT failures
 * in CI environments (GitHub Actions) where the Google Fonts API
 * request can timeout during `npm run build`.
 *
 * Display "optional":
 * - Prevents layout shift (CLS = 0)
 * - Uses custom font if loaded within 100ms block period
 * - Falls back to system fonts seamlessly if font takes longer
 * - Optimal for LCP and Core Web Vitals
 */
export const inter = localFont({
	src: "../../public/fonts/inter-latin-var.woff2",
	variable: "--font-sans",
	display: "optional",
	preload: true,
	weight: "100 900",
});

export const jetbrainsMono = localFont({
	src: "../../public/fonts/jetbrains-mono-latin-var.woff2",
	variable: "--font-mono",
	display: "optional",
	preload: true,
	weight: "100 800",
});
