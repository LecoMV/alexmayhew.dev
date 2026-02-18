# CSS Scroll-Driven Animations Research (2026-02-17)

**Status:** CURRENT
**Session:** Research for production use of animation-timeline: scroll() and view-timeline on alexmayhew.dev

---

## Key Findings

- **Chrome/Edge 115+**: Full support (since July 2023). Production-ready for Chromium users.
- **Safari**: Added in Safari 26 (WWDC25 beta, public release expected mid-2026). NOT yet in current stable Safari.
- **Firefox**: Behind a flag as of early 2026. NOT enabled by default. Flag: `layout.css.scroll-driven-animations.enabled`.
- **Global coverage**: ~75-80% of users (Chromium-only). Requires progressive enhancement for remaining ~20-25%.
- **CSS-driven animations run off the main thread** — no jank, unlike JS scroll listeners.
- **`animation-timeline` must appear AFTER `animation` shorthand** in CSS — property order matters.
- **`animation-duration: 1ms`** workaround required for Firefox when flag is enabled.

---

## 1. Browser Support (February 2026)

| Browser           | Support   | Notes                                         |
| ----------------- | --------- | --------------------------------------------- |
| Chrome 115+       | Full      | Shipping since July 2023                      |
| Edge 115+         | Full      | Matching Chrome                               |
| Safari 26+        | Full      | Beta as of WWDC25; stable mid-2026            |
| Safari < 26       | None      | Current stable Safari has NO support          |
| Firefox           | Flag only | `layout.css.scroll-driven-animations.enabled` |
| Firefox (default) | None      | Not enabled by default                        |

**Practical verdict (Feb 2026):** Treat this as a Chromium-only feature with enhancement. The ~65% of traffic on Chromium gets it natively. Safari users (25%+) do not yet have stable support.

---

## 2. Core API Reference

### scroll() — Scroll Progress Timeline

Tracks how far the user has scrolled within a scroll container. Maps 0% (top) to 100% (bottom).

```css
/* Scroll progress bar */
#progress-indicator {
	animation: growWidth linear;
	animation-timeline: scroll(); /* tracks nearest scroll ancestor */
	animation-duration: auto; /* required: auto or 1ms for Firefox */
}

/* With explicit parameters */
animation-timeline: scroll(root block); /* root scroller, block axis */
animation-timeline: scroll(nearest inline); /* nearest ancestor, horizontal */

@keyframes growWidth {
	from {
		transform: scaleX(0);
	}
	to {
		transform: scaleX(1);
	}
}
```

### view() — View Progress Timeline

Triggers when an element enters/exits the viewport. Analogous to IntersectionObserver in CSS.

```css
/* Fade-in on scroll into view */
.section {
	animation: fadeUp linear both;
	animation-timeline: view();
	animation-range: entry 0% entry 40%; /* only animate during entry phase */
}

/* With inset to trigger earlier */
animation-timeline: view(20% block); /* 20% inset from block edges */

@keyframes fadeUp {
	from {
		opacity: 0;
		transform: translateY(2rem);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
```

### Named Timelines (for cross-element control)

```css
/* Parent defines the timeline */
.scroll-container {
	scroll-timeline: --myScroller block;
}

/* Sibling/distant child uses it via scope */
.common-ancestor {
	timeline-scope: --myScroller; /* promotes named timeline upward */
}

.animated-element {
	animation-timeline: --myScroller;
}
```

### animation-range Values

```css
/* Phase-based ranges */
animation-range: entry 0% entry 100%; /* while entering viewport */
animation-range: exit 0% exit 100%; /* while exiting viewport */
animation-range: contain 0% contain 100%; /* while fully in viewport */
animation-range: cover 0% cover 100%; /* full cover (default) */

/* Fine-grained percentage */
animation-range: 0% 50%; /* first half of view timeline */
```

---

## 3. Progressive Enhancement Patterns

### Pattern A: Pure CSS @supports (recommended)

No JavaScript. Simpler layout for unsupported browsers, enhanced layout for supported ones.

```css
/* Fallback: visible by default, no animation */
.card {
	opacity: 1;
	transform: none;
}

/* Enhancement: animate when supported AND motion allowed */
@media (prefers-reduced-motion: no-preference) {
	@supports (animation-timeline: view()) and (animation-range: 0% 100%) {
		.card {
			opacity: 0;
			transform: translateY(2rem);
			animation: revealCard linear both;
			animation-timeline: view();
			animation-range: entry 0% entry 50%;
		}
	}
}

@keyframes revealCard {
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
```

### Pattern B: JS Feature Detection + GSAP Fallback

Use when visual parity across browsers matters more than code simplicity.

```typescript
// Load GSAP ScrollTrigger only for unsupported browsers
const supportsScrollDriven = CSS.supports("animation-timeline", "view()");

if (!supportsScrollDriven) {
	// Dynamically import GSAP only when needed
	const { gsap } = await import("gsap");
	const { ScrollTrigger } = await import("gsap/ScrollTrigger");
	gsap.registerPlugin(ScrollTrigger);
	// ... configure GSAP fallback
}
```

### Pattern C: CSS + IntersectionObserver Hybrid

Good middle ground — CSS handles supported browsers, IO handles the rest.

```typescript
// In a Client Component
"use client";
import { useEffect, useRef } from "react";

export function RevealSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (CSS.supports("animation-timeline", "view()")) return; // CSS handles it

    // IO fallback for non-supporting browsers
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className="reveal-section">{children}</div>;
}
```

```css
/* Default state (also IO fallback final state) */
.reveal-section {
	transition:
		opacity 0.5s,
		transform 0.5s;
	opacity: 0;
	transform: translateY(2rem);
}
.reveal-section.is-visible {
	opacity: 1;
	transform: none;
}

/* CSS scroll-driven override (no JS needed) */
@media (prefers-reduced-motion: no-preference) {
	@supports (animation-timeline: view()) {
		.reveal-section {
			animation: revealUp linear both;
			animation-timeline: view();
			animation-range: entry 0% entry 50%;
			transition: none; /* avoid conflict */
		}
		.reveal-section.is-visible {
			opacity: 0; /* prevent IO class from interfering */
		}
	}
}
```

---

## 4. Performance vs JavaScript Approaches

| Approach                 | Main Thread                | Jank Risk           | Browser Support      | Code Complexity |
| ------------------------ | -------------------------- | ------------------- | -------------------- | --------------- |
| CSS scroll-driven        | Off main thread            | None                | Chromium + Safari 26 | Low             |
| CSS + @supports fallback | Off main thread (CSS path) | None                | Universal            | Low             |
| IntersectionObserver     | Main thread but passive    | Very low            | Universal            | Medium          |
| scroll event listeners   | Main thread                | High                | Universal            | High            |
| GSAP ScrollTrigger       | Main thread                | Low (RAF-optimized) | Universal            | High            |

**Key insight:** CSS scroll-driven animations are the only approach that runs entirely off the main thread. JS scroll listeners block paint. GSAP and IO are good fallbacks but add bundle weight.

**When to choose CSS scroll-driven:**

- Simple parallax, opacity reveals, scale transforms
- Progress indicators (reading progress, sticky header shrink)
- You can tolerate the ~20-25% of users who see the fallback

**When to choose Framer Motion (useScroll / whileInView):**

- Complex multi-step sequences
- Spring physics required
- Need JS-side value access (driving non-CSS properties)
- Must match exact behavior across all browsers now

---

## 5. Combining with Framer Motion (Project-Specific)

The project uses Framer Motion's `whileInView` pattern extensively (e.g., `case-study-page.tsx`, `about-page.tsx`). CSS scroll-driven animations are not a replacement — they are complementary.

### Division of Responsibility

| Use Case                  | Use CSS Scroll-Driven  | Use Framer Motion      |
| ------------------------- | ---------------------- | ---------------------- |
| Reading progress bar      | Yes                    | No (overkill)          |
| Parallax background       | Yes                    | No (main thread)       |
| Section fade-in reveal    | Yes (with IO fallback) | Current approach works |
| Spring-physics card hover | No                     | Yes                    |
| Staggered list items      | Maybe                  | Yes (better control)   |
| Complex hero sequence     | No                     | Yes                    |
| Sticky header shrink      | Yes                    | No                     |

### Hybrid Pattern for Hero Sections

```tsx
// Server Component (no 'use client' needed for CSS-driven parts)
export function HeroSection() {
	return (
		<section className="hero">
			{/* CSS scroll-driven parallax on background — no JS */}
			<div className="hero__bg" aria-hidden="true" />

			{/* Framer Motion for the spring entrance animation */}
			<motion.div
				className="hero__content"
				initial={{ opacity: 0, y: 40 }}
				animate={{ opacity: 1, y: 0 }}
				transition={springTransition}
			>
				<h1>...</h1>
			</motion.div>
		</section>
	);
}
```

```css
@media (prefers-reduced-motion: no-preference) {
	@supports (animation-timeline: scroll()) {
		.hero__bg {
			animation: parallaxBg linear;
			animation-timeline: scroll(root block);
		}

		@keyframes parallaxBg {
			from {
				transform: translateY(0);
			}
			to {
				transform: translateY(-20%);
			}
		}
	}
}
```

### Do NOT mix on the same element

Applying both `animation` (CSS scroll-driven) and Framer Motion's `style` transforms to the same element causes conflicts. CSS `animation` and the Web Animations API / inline styles compete. If Framer Motion controls an element's `transform`, CSS scroll-driven animation should not also control `transform` on that element.

---

## 6. Common Hero Section Patterns

### A: Parallax Background

```css
.hero {
	overflow: clip; /* prevents scroll extending from parallax */
}

@media (prefers-reduced-motion: no-preference) {
	@supports (animation-timeline: scroll()) {
		.hero__bg-image {
			animation: parallax linear;
			animation-timeline: scroll(root block);
			will-change: transform;
		}

		@keyframes parallax {
			from {
				transform: translateY(0);
			}
			to {
				transform: translateY(30%);
			} /* moves slower than scroll */
		}
	}
}
```

**Gotcha:** Use `overflow: clip` (not `hidden`) on the container — `hidden` creates a new scroll context that breaks `scroll(root)`.

### B: Text Reveal on Scroll

```css
.hero__headline {
	/* Visible by default (fallback) */
}

@media (prefers-reduced-motion: no-preference) {
	@supports (animation-timeline: view()) {
		.hero__headline {
			animation: textReveal linear both;
			animation-timeline: view();
			animation-range: entry 0% entry 60%;
		}

		@keyframes textReveal {
			from {
				opacity: 0;
				clip-path: inset(0 100% 0 0);
			}
			to {
				opacity: 1;
				clip-path: inset(0 0% 0 0);
			}
		}
	}
}
```

### C: Sticky Section with Progress

```css
.sticky-section {
	position: sticky;
	top: 0;
}

@media (prefers-reduced-motion: no-preference) {
	@supports (animation-timeline: scroll()) {
		.sticky-progress-bar {
			transform-origin: left;
			transform: scaleX(0);
			animation: expandBar linear;
			animation-timeline: scroll(nearest block);
		}

		@keyframes expandBar {
			to {
				transform: scaleX(1);
			}
		}
	}
}
```

### D: Scroll-Linked Opacity Fade

```css
/* Elements fade in as they enter, fade out as they exit */
.fade-element {
	opacity: 1; /* fallback */
}

@media (prefers-reduced-motion: no-preference) {
	@supports (animation-timeline: view()) {
		.fade-element {
			animation: fadeInOut linear both;
			animation-timeline: view();
			animation-range:
				entry 20% entry 60%,
				exit 60% exit 100%;
		}

		@keyframes fadeInOut {
			0% {
				opacity: 0;
			}
			50% {
				opacity: 1;
			}
			100% {
				opacity: 0;
			}
		}
	}
}
```

---

## 7. Accessibility: prefers-reduced-motion

Always wrap scroll-driven animations in `@media (prefers-reduced-motion: no-preference)`. Parallax and large-viewport animations are among the most likely to cause vestibular distress.

### The Golden Pattern (double guard)

```css
@media (prefers-reduced-motion: no-preference) {
	@supports (animation-timeline: view()) and (animation-range: 0% 100%) {
		/* ALL scroll-driven animation styles go here */
	}
}
```

### React / TypeScript Hook for JS-side detection

```typescript
// src/hooks/useReducedMotion.ts
"use client";
import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
	const [reducedMotion, setReducedMotion] = useState(true); // default safe

	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		setReducedMotion(mq.matches);
		const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, []);

	return reducedMotion;
}
```

Note: Default to `true` (reduced motion) on the server and initial render to avoid hydration mismatches. The `useEffect` will correct it on the client.

---

## 8. Next.js SSR / Hydration Considerations

CSS scroll-driven animations are **pure CSS** — they have NO server/client mismatch issues by themselves. The `animation-timeline` property is just CSS that the browser applies at render time. There is no hydration risk from the CSS itself.

### Where issues CAN arise

**1. JS feature detection before hydration**

```typescript
// WRONG: runs on server, `CSS` is undefined
const supported = CSS.supports("animation-timeline", "view()"); // ReferenceError

// CORRECT: guard with typeof
const supported = typeof CSS !== "undefined" && CSS.supports("animation-timeline", "view()");
```

**2. `useReducedMotion` hook with SSR**
Default to the conservative value (`true` = reduced motion) on the server. The `useEffect` correction happens client-side only.

**3. JS fallback components with SSR**
If loading GSAP or IO-based fallbacks conditionally, use Next.js `dynamic()` with `ssr: false` to prevent them running on the server:

```typescript
import dynamic from "next/dynamic";

const ScrollReveal = dynamic(() => import("@/components/ScrollRevealFallback"), { ssr: false });
```

**4. No issues with pure CSS**
Server Components can render the CSS classes that contain `animation-timeline` rules without any problem. The browser applies or ignores them based on `@supports`.

---

## 9. Known Issues and Gotchas

1. **Property order**: `animation-timeline` MUST come after `animation` shorthand, not before.
2. **`overflow: clip` vs `overflow: hidden`**: `overflow: hidden` creates a scroll container, which breaks `scroll(root)`. Use `clip` for parallax containers.
3. **Firefox `animation-duration: 1ms`**: Firefox (when flag enabled) requires a non-zero duration. Add `animation-duration: 1ms` as a guard.
4. **`animation-fill-mode: both`**: Required to prevent flash-back to initial state after animation completes.
5. **View timeline flash**: Without `animation-fill-mode: both`, elements flash back to initial state when scrolling back up.
6. **Polyfill trade-off**: The `scroll-timeline` polyfill (github.com/flackr/scroll-timeline) restores behavior but runs on the main thread, eliminating the performance advantage.
7. **Conflicting transforms**: Do not apply CSS scroll-driven `transform` animations AND Framer Motion `transform` to the same element — they conflict. Isolate the parallax to a child wrapper.
8. **`will-change: transform`**: Add to parallax elements for compositor promotion, but remove from non-scrolling elements to save memory.

---

## 10. Decision Framework for This Project

Given alexmayhew.dev's stack (Next.js 15, Framer Motion, Cloudflare Pages):

**Use CSS scroll-driven animations for:**

- Reading progress indicators
- Subtle parallax backgrounds in hero sections
- Scroll-linked header opacity/size changes
- Any purely decorative layer effect

**Keep Framer Motion for:**

- All existing `whileInView` entrance animations (they work, don't replace)
- Spring-physics interactions
- Staggered child animations
- Anything requiring JS-side value access

**Implementation approach:**

1. Add CSS scroll-driven animations as an _additional layer_ on top of existing Framer Motion setup
2. Always use the double guard: `@media (prefers-reduced-motion: no-preference)` + `@supports`
3. No JS feature detection needed for pure CSS enhancements
4. Test in Chrome (Chromium path) and disable the `@supports` block to verify fallback

---

## Sources

- [MDN: CSS scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)
- [MDN: animation-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline)
- [MDN: scroll()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline/scroll)
- [MDN: view()](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline/view)
- [WebKit: A guide to Scroll-driven Animations with just CSS](https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/)
- [Smashing Magazine: Introduction to CSS Scroll-Driven Animations (Dec 2024)](https://www.smashingmagazine.com/2024/12/introduction-css-scroll-driven-animations/)
- [CSS-Tricks: Bringing Back Parallax with Scroll-Driven CSS Animations](https://css-tricks.com/bringing-back-parallax-with-scroll-driven-css-animations/)
- [CSS-Tricks: Unleash the Power of Scroll-Driven Animations](https://css-tricks.com/unleash-the-power-of-scroll-driven-animations/)
- [Cyd Stumpel: Two approaches to fallback CSS scroll-driven animations](https://cydstumpel.nl/two-approaches-to-fallback-css-scroll-driven-animations/)
- [Cyd Stumpel: Start using Scroll-driven animations today](https://cydstumpel.nl/start-using-scroll-driven-animations-today/)
- [Chrome for Developers: CSS scroll-triggered animations](https://developer.chrome.com/blog/scroll-triggered-animations)
- [Can I Use: animation-timeline scroll()](https://caniuse.com/mdn-css_properties_animation-timeline_scroll)
- [Can I Use: animation-timeline view()](https://caniuse.com/mdn-css_properties_animation-timeline_view)
- [Josh W Comeau: Accessible Animations in React](https://www.joshwcomeau.com/react/prefers-reduced-motion/)
- [design.dev: CSS Scroll-Driven Animations Guide](https://design.dev/guides/scroll-timeline/)
- [LogRocket: How to use scroll-linked animations the right way](https://blog.logrocket.com/use-scroll-linked-animations-right-way/)
- [Apple WWDC25: What's new in Safari and WebKit](https://developer.apple.com/videos/play/wwdc2025/233/)
- [Mozilla Connect: Why doesn't Firefox support animation-timeline?](https://connect.mozilla.org/t5/discussions/why-doesn-t-firefox-support-the-css-animation-timeline/td-p/60742)
