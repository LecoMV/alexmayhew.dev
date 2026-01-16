import type { ThemeOverride } from "../types";

/**
 * Terminal Theme
 *
 * Polished Linux terminal aesthetic (Warp/Hyper/iTerm2 level).
 * NOT cheesy green-on-black hacker vibes.
 *
 * - Soft green accent (#4ade80)
 * - Terminal-list layout with numbered entries
 * - ">" list markers, "$" heading prefix
 * - Snappier animations
 */
export const terminalTheme: ThemeOverride = {
	id: "terminal",
	name: "Terminal",
	description: "Polished terminal aesthetic inspired by Warp and Hyper",
	extends: "default",

	colors: {
		accent: "#4ade80",
		accentMuted: "rgba(74, 222, 128, 0.6)",
		accentFaint: "rgba(74, 222, 128, 0.08)",
		background: "#0c0c0c",
		surface: "rgba(24, 24, 27, 0.4)",
		text: "#e4e4e7",
		textMuted: "#71717a",
		border: "rgba(74, 222, 128, 0.15)",
		borderHover: "rgba(74, 222, 128, 0.4)",
		codeBg: "#18181b",
	},

	typography: {
		listMarker: ">",
		headingPrefix: "$",
		categoryFormat: (cat: string) => `[${cat.toUpperCase()}]`,
	},

	animation: {
		stiffness: 150,
		damping: 20,
		mass: 0.8,
	},

	layout: {
		variant: "terminal-list",
		showImages: false,
		showTags: true,
		indexPrefix: (i) => String(i + 1).padStart(3, "0"),
	},
};
