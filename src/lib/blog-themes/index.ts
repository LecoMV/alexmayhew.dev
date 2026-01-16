// Types
export type {
	ThemeId,
	LayoutVariant,
	ThemeColors,
	ThemeTypography,
	ThemeAnimation,
	ThemeLayout,
	BlogTheme,
	ThemeOverride,
} from "./types";

// Theme definitions
export { defaultTheme } from "./themes/default";
export { terminalTheme } from "./themes/terminal";
export { classifiedTheme } from "./themes/classified";

// Config
export { ACTIVE_THEME_ID, resolveTheme, getActiveTheme, getAllThemes } from "./config";

// Context and hooks
export { BlogThemeProvider, useBlogTheme, useTheme, useSpringTransition } from "./context";

// Utilities
export { deepMerge, getThemeCSSVars, getSpringTransition } from "./utils";
