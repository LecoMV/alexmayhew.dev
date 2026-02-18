# ADR-0002: CSS Scroll-Driven Animations Over JavaScript Scroll Listeners

**Status:** Accepted
**Date:** 2026-02-18

## Context

The blog reading progress indicator and scroll-based visual effects need to respond to scroll position. JavaScript `scroll` event listeners run on the main thread and can cause jank during rapid scrolling, especially when combined with canvas animations already running on the main thread. CSS `animation-timeline: scroll()` runs entirely off the main thread, composited by the browser.

Browser support as of February 2026: Chrome/Edge 115+ (full), Safari 26 (beta, stable mid-2026), Firefox (behind flag only). Global coverage is approximately 75-80% (Chromium-only in practice).

## Decision

Use CSS `animation-timeline: scroll()` for scroll-driven animations (reading progress bar, parallax effects), wrapped in `@supports (animation-timeline: view())` and `@media (prefers-reduced-motion: no-preference)` guards. Unsupported browsers get a static fallback -- the element renders in its final state with no animation. Framer Motion is retained for spring-physics interactions and component-level animations where it remains the right tool.

## Consequences

Zero main-thread JavaScript for scroll effects in supported browsers. Progressive enhancement means no breakage in Firefox or older Safari -- they simply see no animation. The limitation is that only CSS-expressible properties (transforms, opacity, clip-path) can be animated this way. Complex multi-step sequences or spring physics still require Framer Motion. CSS and Framer Motion must not both animate `transform` on the same element to avoid conflicts.
