/**
 * SVG Sanitization Module
 * Prevents XSS attacks when rendering user-generated SVG content
 *
 * Uses DOMPurify with strict configuration for SVG files
 * @see https://github.com/cure53/DOMPurify
 */

import DOMPurify from "isomorphic-dompurify";

/**
 * Strict DOMPurify configuration for SVG sanitization
 * Removes all potentially dangerous elements while preserving valid SVG
 */
const SVG_SANITIZE_CONFIG = {
	USE_PROFILES: { svg: true, svgFilters: true },
	// Only allow safe SVG elements
	ALLOWED_TAGS: [
		"svg",
		"g",
		"path",
		"rect",
		"circle",
		"ellipse",
		"line",
		"polyline",
		"polygon",
		"text",
		"tspan",
		"textPath",
		"defs",
		"clipPath",
		"mask",
		"pattern",
		"linearGradient",
		"radialGradient",
		"stop",
		"use",
		"symbol",
		"title",
		"desc",
		"metadata",
		"filter",
		"feGaussianBlur",
		"feOffset",
		"feBlend",
		"feColorMatrix",
		"feComponentTransfer",
		"feComposite",
		"feConvolveMatrix",
		"feDiffuseLighting",
		"feDisplacementMap",
		"feFlood",
		"feImage",
		"feMerge",
		"feMergeNode",
		"feMorphology",
		"feSpecularLighting",
		"feTile",
		"feTurbulence",
		"image",
	],
	// Only allow safe attributes
	ALLOWED_ATTR: [
		// Common SVG attributes
		"id",
		"class",
		"style",
		"transform",
		"viewBox",
		"xmlns",
		"xmlns:xlink",
		"version",
		"preserveAspectRatio",
		// Geometry attributes
		"x",
		"y",
		"x1",
		"y1",
		"x2",
		"y2",
		"cx",
		"cy",
		"r",
		"rx",
		"ry",
		"width",
		"height",
		"d",
		"points",
		// Presentation attributes
		"fill",
		"fill-opacity",
		"fill-rule",
		"stroke",
		"stroke-width",
		"stroke-linecap",
		"stroke-linejoin",
		"stroke-dasharray",
		"stroke-dashoffset",
		"stroke-opacity",
		"stroke-miterlimit",
		"opacity",
		"color",
		"font-family",
		"font-size",
		"font-weight",
		"font-style",
		"text-anchor",
		"dominant-baseline",
		"alignment-baseline",
		"letter-spacing",
		"word-spacing",
		"text-decoration",
		"visibility",
		"display",
		"clip-path",
		"clip-rule",
		"mask",
		"filter",
		// Gradient attributes
		"gradientUnits",
		"gradientTransform",
		"spreadMethod",
		"offset",
		"stop-color",
		"stop-opacity",
		// Pattern attributes
		"patternUnits",
		"patternContentUnits",
		"patternTransform",
		// Reference attributes
		"href",
		"xlink:href",
		// Filter attributes
		"filterUnits",
		"primitiveUnits",
		"in",
		"in2",
		"result",
		"stdDeviation",
		"dx",
		"dy",
		"mode",
		"type",
		"values",
		"k1",
		"k2",
		"k3",
		"k4",
		// Image attributes (for embedded images)
		"xlink:href",
	],
	// Forbid dangerous patterns
	FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form", "input", "button"],
	FORBID_ATTR: [
		"onerror",
		"onload",
		"onclick",
		"onmouseover",
		"onmouseout",
		"onmousedown",
		"onmouseup",
		"onfocus",
		"onblur",
		"onchange",
		"onsubmit",
		"onreset",
		"onselect",
		"onkeydown",
		"onkeypress",
		"onkeyup",
		"oninput",
		"oncontextmenu",
		"ondblclick",
		"ondrag",
		"ondragend",
		"ondragenter",
		"ondragleave",
		"ondragover",
		"ondragstart",
		"ondrop",
	],
	// Don't allow data URIs except for safe image formats
	ALLOW_DATA_ATTR: false,
	// Return string (not DOM node)
	RETURN_DOM: false,
	RETURN_DOM_FRAGMENT: false,
};

/**
 * Sanitize SVG content to prevent XSS attacks
 *
 * @param svg - Raw SVG string from API
 * @returns Sanitized SVG safe for rendering with dangerouslySetInnerHTML
 *
 * @example
 * ```tsx
 * const safeSvg = sanitizeSvg(rawSvg);
 * return <div dangerouslySetInnerHTML={{ __html: safeSvg }} />;
 * ```
 */
export function sanitizeSvg(svg: string): string {
	if (!svg || typeof svg !== "string") {
		return "";
	}

	// Remove any script-like patterns before DOMPurify (defense in depth)
	const preFiltered = svg
		.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
		.replace(/javascript:/gi, "")
		.replace(/on\w+\s*=/gi, "data-removed=");

	// Apply DOMPurify sanitization
	const sanitized = DOMPurify.sanitize(preFiltered, SVG_SANITIZE_CONFIG);

	return sanitized;
}

/**
 * Check if a string contains potentially malicious SVG content
 * Useful for validation before processing
 *
 * @param svg - SVG string to check
 * @returns true if SVG appears safe, false if it contains suspicious patterns
 */
export function isSvgSafe(svg: string): boolean {
	if (!svg || typeof svg !== "string") {
		return false;
	}

	const dangerousPatterns = [
		/<script/i,
		/javascript:/i,
		/on\w+\s*=/i,
		/<iframe/i,
		/<object/i,
		/<embed/i,
		/data:text\/html/i,
		/data:application/i,
	];

	return !dangerousPatterns.some((pattern) => pattern.test(svg));
}
