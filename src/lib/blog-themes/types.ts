/**
 * Blog Theme System - Type Definitions
 *
 * Supports theme inheritance: child themes extend default and override specific values.
 */

export type ThemeId = "default" | "terminal" | "classified";

export type LayoutVariant = "cards" | "terminal-list" | "dossier";

export interface ThemeColors {
	accent: string;
	accentMuted: string;
	accentFaint: string;
	background: string;
	surface: string;
	text: string;
	textMuted: string;
	border: string;
	borderHover: string;
	codeBg: string;
}

export interface ThemeTypography {
	listMarker: string;
	headingPrefix: string;
	categoryFormat: (category: string) => string;
	dateFormat: Intl.DateTimeFormatOptions;
}

export interface ThemeAnimation {
	stiffness: number;
	damping: number;
	mass: number;
}

export interface ThemeLayout {
	variant: LayoutVariant;
	showImages: boolean;
	showTags: boolean;
	indexPrefix?: (index: number) => string;
}

export interface BlogTheme {
	id: ThemeId;
	name: string;
	description: string;
	colors: ThemeColors;
	typography: ThemeTypography;
	animation: ThemeAnimation;
	layout: ThemeLayout;
}

/**
 * Deep partial type for theme overrides.
 * Child themes only need to specify values they want to change.
 */
export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type ThemeOverride = DeepPartial<Omit<BlogTheme, "id" | "name" | "description">> & {
	id: ThemeId;
	name: string;
	description: string;
	extends?: "default";
};
