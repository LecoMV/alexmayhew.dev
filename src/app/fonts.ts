import { Inter, JetBrains_Mono } from "next/font/google";

/**
 * Font Loading Strategy: "optional"
 * - Prevents layout shift (CLS = 0)
 * - Uses custom font if loaded within 100ms block period
 * - Falls back to system fonts seamlessly if font takes longer
 * - Optimal for LCP and Core Web Vitals
 *
 * Alternative: "swap" shows custom font eventually but may cause CLS
 */
export const inter = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
	display: "optional",
	preload: true,
});

export const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
	display: "optional",
	preload: true,
});
