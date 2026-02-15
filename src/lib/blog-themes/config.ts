import { classifiedTheme } from "./themes/classified";
import { defaultTheme } from "./themes/default";
import { terminalTheme } from "./themes/terminal";

import type { BlogTheme, ThemeId, ThemeOverride } from "./types";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ADMIN CONFIGURATION
 *
 * Change this value to switch the blog theme.
 * Options: "default" | "terminal" | "classified"
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const ACTIVE_THEME_ID: ThemeId = "default";

/**
 * Theme registry - maps IDs to theme definitions.
 */
const themeOverrides: Record<ThemeId, BlogTheme | ThemeOverride> = {
	default: defaultTheme,
	terminal: terminalTheme,
	classified: classifiedTheme,
};

/**
 * Resolve a theme by ID, applying inheritance if needed.
 */
export function resolveTheme(id: ThemeId): BlogTheme {
	const theme = themeOverrides[id];

	// Default theme is already complete
	if (id === "default") {
		return theme as BlogTheme;
	}

	// Child themes extend default - merge override into default
	const override = theme as ThemeOverride;
	if (override.extends === "default") {
		const merged: BlogTheme = {
			...defaultTheme,
			id: override.id,
			name: override.name,
			description: override.description,
			colors: {
				...defaultTheme.colors,
				...(override.colors as Partial<BlogTheme["colors"]>),
			},
			typography: {
				...defaultTheme.typography,
				...(override.typography as Partial<BlogTheme["typography"]>),
			},
			animation: {
				...defaultTheme.animation,
				...(override.animation as Partial<BlogTheme["animation"]>),
			},
			layout: {
				...defaultTheme.layout,
				...(override.layout as Partial<BlogTheme["layout"]>),
			},
		};
		return merged;
	}

	// Fallback (shouldn't happen)
	return defaultTheme;
}

/**
 * Get the currently active theme (resolved).
 */
export function getActiveTheme(): BlogTheme {
	return resolveTheme(ACTIVE_THEME_ID);
}

/**
 * Get all available themes (for admin UI if needed later).
 */
export function getAllThemes(): BlogTheme[] {
	return (["default", "terminal", "classified"] as ThemeId[]).map(resolveTheme);
}
