import type { ThemeOverride } from "../types";

/**
 * Classified Theme
 *
 * Sophisticated intelligence OS aesthetic (Bourne/Bond/Stark).
 * Subtle, classy, premium feel.
 *
 * - Amber/gold accent (#fbbf24)
 * - Dossier layout with document metaphor
 * - "—" list markers, "◆" heading prefix
 * - Deliberate, weighty animations
 */
export const classifiedTheme: ThemeOverride = {
	id: "classified",
	name: "Classified",
	description: "Sophisticated intelligence OS inspired by Bourne and Bond",
	extends: "default",

	colors: {
		accent: "#fbbf24",
		accentMuted: "rgba(251, 191, 36, 0.6)",
		accentFaint: "rgba(251, 191, 36, 0.08)",
		background: "#09090b",
		surface: "rgba(24, 24, 27, 0.5)",
		text: "#fafafa",
		textMuted: "#a1a1aa",
		border: "rgba(251, 191, 36, 0.12)",
		borderHover: "rgba(251, 191, 36, 0.35)",
		codeBg: "#18181b",
	},

	typography: {
		listMarker: "—",
		headingPrefix: "◆",
		categoryFormat: (cat: string) => `${cat.toUpperCase()} // EYES ONLY`,
	},

	animation: {
		stiffness: 80,
		damping: 28,
		mass: 1.2,
	},

	layout: {
		variant: "dossier",
		showImages: true,
		showTags: false,
		// File IDs generated from post dates in dossier-layout.tsx
	},
};
