"use client";

import { createContext, type ReactNode, useContext, useMemo } from "react";

import { getActiveTheme } from "./config";
import { getSpringTransition, getThemeCSSVars } from "./utils";

import type { BlogTheme } from "./types";

interface BlogThemeContextValue {
	theme: BlogTheme;
	cssVars: Record<string, string>;
	springTransition: {
		type: "spring";
		stiffness: number;
		damping: number;
		mass: number;
	};
}

const BlogThemeContext = createContext<BlogThemeContextValue | null>(null);

interface BlogThemeProviderProps {
	children: ReactNode;
	/** Override the config theme (useful for previews) */
	themeOverride?: BlogTheme;
}

/**
 * Provides blog theme context to child components.
 * Wrap blog pages with this provider.
 */
export function BlogThemeProvider({ children, themeOverride }: BlogThemeProviderProps) {
	const value = useMemo(() => {
		const theme = themeOverride ?? getActiveTheme();
		return {
			theme,
			cssVars: getThemeCSSVars(theme),
			springTransition: getSpringTransition(theme),
		};
	}, [themeOverride]);

	return (
		<BlogThemeContext.Provider value={value}>
			<div style={value.cssVars as React.CSSProperties}>{children}</div>
		</BlogThemeContext.Provider>
	);
}

/**
 * Hook to access the current blog theme.
 * Must be used within a BlogThemeProvider.
 */
export function useBlogTheme(): BlogThemeContextValue {
	const context = useContext(BlogThemeContext);

	if (!context) {
		throw new Error("useBlogTheme must be used within a BlogThemeProvider");
	}

	return context;
}

/**
 * Hook to get just the theme object.
 */
export function useTheme(): BlogTheme {
	return useBlogTheme().theme;
}

/**
 * Hook to get the spring transition for animations.
 */
export function useSpringTransition() {
	return useBlogTheme().springTransition;
}
