// Types
export type {
	BlogTheme,
	LayoutVariant,
	ThemeAnimation,
	ThemeColors,
	ThemeId,
	ThemeLayout,
	ThemeOverride,
	ThemeTypography,
} from "./types";

// Theme definitions
export { defaultTheme } from "./themes/default";
export { terminalTheme } from "./themes/terminal";
export { classifiedTheme } from "./themes/classified";

// Config
export { ACTIVE_THEME_ID, getActiveTheme, getAllThemes, resolveTheme } from "./config";

// Context and hooks
export { BlogThemeProvider, useBlogTheme, useSpringTransition, useTheme } from "./context";

// Utilities
export { deepMerge, getSpringTransition, getThemeCSSVars } from "./utils";
