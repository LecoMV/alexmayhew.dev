import type { BlogTheme, DeepPartial } from "./types";

/**
 * Deep merge two objects, with source values overriding target.
 * Used to apply child theme overrides to the default theme.
 */
export function deepMerge<T extends Record<string, unknown>>(target: T, source: DeepPartial<T>): T {
	const result = { ...target };

	for (const key in source) {
		if (Object.prototype.hasOwnProperty.call(source, key)) {
			const sourceValue = source[key];
			const targetValue = target[key];

			if (
				sourceValue !== undefined &&
				typeof sourceValue === "object" &&
				sourceValue !== null &&
				!Array.isArray(sourceValue) &&
				typeof targetValue === "object" &&
				targetValue !== null &&
				!Array.isArray(targetValue)
			) {
				// Recursively merge nested objects
				(result as Record<string, unknown>)[key] = deepMerge(
					targetValue as Record<string, unknown>,
					sourceValue as DeepPartial<Record<string, unknown>>
				);
			} else if (sourceValue !== undefined) {
				// Direct assignment for primitives and arrays
				(result as Record<string, unknown>)[key] = sourceValue;
			}
		}
	}

	return result;
}

/**
 * Generate CSS custom properties from theme colors.
 * Returns an object suitable for inline styles.
 */
export function getThemeCSSVars(theme: BlogTheme): Record<string, string> {
	return {
		"--blog-accent": theme.colors.accent,
		"--blog-accent-muted": theme.colors.accentMuted,
		"--blog-accent-faint": theme.colors.accentFaint,
		"--blog-background": theme.colors.background,
		"--blog-surface": theme.colors.surface,
		"--blog-text": theme.colors.text,
		"--blog-text-muted": theme.colors.textMuted,
		"--blog-border": theme.colors.border,
		"--blog-border-hover": theme.colors.borderHover,
		"--blog-code-bg": theme.colors.codeBg,
	};
}

/**
 * Get spring transition config from theme animation settings.
 */
export function getSpringTransition(theme: BlogTheme) {
	return {
		type: "spring" as const,
		stiffness: theme.animation.stiffness,
		damping: theme.animation.damping,
		mass: theme.animation.mass,
	};
}
