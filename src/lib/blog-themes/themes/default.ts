import type { BlogTheme } from "../types";

/**
 * Default Theme - Neo-Brutalist
 *
 * The current alexmayhew.dev aesthetic:
 * - Cyber-lime accent (#CCF381)
 * - Cards layout with featured images
 * - "//" list markers
 * - Sharp corners, monospace headers
 */
export const defaultTheme: BlogTheme = {
	id: "default",
	name: "Default",
	description: "Neo-brutalist aesthetic with cyber-lime accents",

	colors: {
		accent: "#ccf381",
		accentMuted: "rgba(204, 243, 129, 0.6)",
		accentFaint: "rgba(204, 243, 129, 0.1)",
		background: "#0b0e14",
		surface: "rgba(30, 41, 59, 0.1)",
		text: "#e2e8f0",
		textMuted: "#94a3b8",
		border: "rgba(255, 255, 255, 0.1)",
		borderHover: "rgba(204, 243, 129, 0.5)",
		codeBg: "rgba(30, 41, 59, 0.3)",
	},

	typography: {
		listMarker: "//",
		headingPrefix: "●",
		categoryFormat: (cat) => cat,
		dateFormat: {
			year: "numeric",
			month: "short",
			day: "numeric",
		},
	},

	animation: {
		stiffness: 100,
		damping: 20,
		mass: 1,
	},

	layout: {
		variant: "cards",
		showImages: true,
		showTags: true,
	},
};
