# View Transitions API — Next.js 15 App Router + Cloudflare Pages (2026-02-17)

**Status:** CURRENT
**Session:** Research for alexmayhew.dev — evaluating View Transitions for page navigation animations alongside existing Framer Motion usage.

---

## Key Findings

- Browser support is **89.49% global** (Chrome 111+, Edge 111+, Safari 18+, Firefox 144+). Firefox added full support October 2025.
- Next.js 15.2+ has an **experimental** `viewTransition` flag that enables React's `<ViewTransition>` component integration. **Not recommended for production yet.**
- The stable path for Next.js App Router today is the **`next-view-transitions`** package (shuding/next-view-transitions).
- `next/link` does NOT natively support View Transitions — requires either the package's custom `<Link>` or React's experimental `<ViewTransition>` wrapper.
- The API **degrades gracefully**: unsupported browsers render DOM updates instantly with no animation — no JS errors, no broken layouts.
- **No Cloudflare-specific compatibility issues** — View Transitions is purely client-side browser API, invisible to edge runtimes.
- Framer Motion's layout animations and View Transitions solve **different problems** and can coexist, but combining them on the same element causes conflicts.

---

## 1. Browser Support (February 2026)

| Browser            | Supported Since | Notes                  |
| ------------------ | --------------- | ---------------------- |
| Chrome             | 111             | Full support           |
| Edge               | 111             | Full support           |
| Safari             | 18.0            | Desktop + iOS 18+      |
| Firefox            | 144             | Added October 14, 2025 |
| Samsung Internet   | 23+             | Full support           |
| Opera              | 97+             | Full support           |
| Chrome for Android | 144+            | Full support           |
| Firefox Android    | 147+            | Full support           |
| IE                 | Never           | Not supported          |
| Opera Mini         | Never           | Not supported          |

**Global coverage: ~89.49%** (caniuse.com, Feb 2026)

Firefox 143 had it behind a flag (`dom.viewTransitions.enabled`). Version 144 (Oct 2025) enabled it by default, which pushed global coverage past 89%.

Note: Firefox's initial implementation **excludes view transition types** — use the community `transitionHelper` for progressive enhancement if relying on that feature.

---

## 2. Next.js 15 App Router Implementation

### Option A: React's experimental `<ViewTransition>` (Next.js 15.2+)

Enable in `next.config.js`:

```js
const nextConfig = {
	experimental: {
		viewTransition: true,
	},
};
```

Then use React's component directly:

```tsx
import { ViewTransition } from "react";

// Wrap animating elements
<ViewTransition name="hero-image">
	<img src="..." />
</ViewTransition>;
```

**Status:** Experimental, in React Canary channel. Next.js docs explicitly say **"strongly advise against using this feature in production"** (as of Feb 2026). The `experimental.viewTransition` flag is required for deeper Next.js integration (e.g., auto-adding transition types), but those Next.js-specific types are not implemented yet.

**Key React behavior:**

- React calls `startViewTransition()` automatically at the optimal time — never call it yourself.
- React applies `view-transition-name` values "just in time" before the transition starts, avoiding performance issues from too many named elements.
- If multiple transitions queue, React batches them: A→B finishes, then B→D animates (not A→D).

### Option B: `next-view-transitions` package (stable today)

```bash
npm install next-view-transitions
```

**Setup in `app/layout.tsx`:**

```tsx
import { ViewTransitions } from "next-view-transitions";

export default function RootLayout({ children }) {
	return (
		<html>
			<body>
				<ViewTransitions>{children}</ViewTransitions>
			</body>
		</html>
	);
}
```

**Use the custom Link:**

```tsx
import { Link } from "next-view-transitions";

// Replaces next/link for routes that need transitions
<Link href="/about">About</Link>;
```

**Programmatic navigation:**

```tsx
import { useTransitionRouter } from "next-view-transitions";

const router = useTransitionRouter();
router.push("/about");
```

**Limitation:** The package is "aimed at basic use cases." Complex apps with concurrent rendering, Suspense, and streaming need deeper React/Next.js primitives that aren't ready yet.

---

## 3. Does `next/link` Support View Transitions Natively?

**No.** Standard `next/link` does not trigger View Transitions. You need:

- The `<Link>` component from `next-view-transitions` (stable option), OR
- React's `<ViewTransition>` wrapper with `experimental.viewTransition: true` (experimental option)

---

## 4. Progressive Enhancement

View Transitions is **pure progressive enhancement**:

```js
// Feature detection (if doing manual implementation)
if (document.startViewTransition) {
	document.startViewTransition(() => updateDOM());
} else {
	updateDOM(); // instant swap, no animation
}
```

CSS approach for unsupported browsers — no-op fallback:

```css
@supports (view-transition-name: none) {
	::view-transition-old(root) {
		animation: fade-out 0.3s;
	}
	::view-transition-new(root) {
		animation: fade-in 0.3s;
	}
}
```

**`prefers-reduced-motion` handling:**

```css
@media (prefers-reduced-motion: reduce) {
	::view-transition-old(*),
	::view-transition-new(*) {
		animation-duration: 0.01s;
	}
}
```

Both the `next-view-transitions` package and React's `<ViewTransition>` handle graceful degradation automatically — unsupported browsers simply skip the animation.

---

## 5. Cloudflare Workers/Pages Compatibility

**No known compatibility issues.** View Transitions is 100% client-side browser API:

- Not affected by `nodejs_compat` Workers flag
- Not affected by edge runtime restrictions
- No `fs`, `path`, or Node.js globals involved
- No CSP issues (no eval, no external scripts)
- Works identically on Cloudflare Pages as on any other CDN

The only Cloudflare consideration: if you set aggressive CSP headers in `_headers`, ensure `style-src 'self'` includes whatever styles the transition pseudo-elements need — but the default cross-fade uses no external resources.

---

## 6. Framer Motion + View Transitions: Coexistence Strategy

These solve **different problems** and should be used on **different elements**:

| Use Case                            | Right Tool           |
| ----------------------------------- | -------------------- |
| Micro-interactions (hover, tap)     | Framer Motion        |
| Component-level animations          | Framer Motion        |
| Spring physics animations           | Framer Motion        |
| Interruptible animations            | Framer Motion        |
| Scroll-position-aware transitions   | Framer Motion layout |
| Full-page fade/slide between routes | View Transitions API |
| Shared hero element morphing        | View Transitions API |
| Full-screen wipe effects            | View Transitions API |

**Why they conflict when combined on the same element:**

1. View Transitions takes a bitmap snapshot of the element pre-navigation and crossfades it — Framer Motion's exit animations compete with this snapshot mechanism.
2. View Transitions is not interruptible — mid-animation, it snaps to end before starting next. Framer Motion is interruptible.
3. If scroll position changes during a View Transition, every element with a `view-transition-name` animates across the viewport by the scroll delta. Framer Motion layout animations account for scroll.
4. View Transitions locks the rendering pipeline during the snapshot phase — Framer Motion animations in progress during this window may stutter.

**Recommended pattern for this site (alexmayhew.dev):**

Keep Framer Motion for all existing component-level spring animations. Add View Transitions only for route-level page morphing — specifically on elements that conceptually "travel" between pages (e.g., a blog card expanding into the full post page).

```tsx
// Framer Motion: component springs (keep existing)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ type: 'spring', stiffness: 100, damping: 20 }}
>

// View Transitions: shared element morphing across routes
// In blog card:
<div style={{ viewTransitionName: `blog-image-${slug}` }}>
  <img src={featuredImage} />
</div>

// In blog post page (same name):
<div style={{ viewTransitionName: `blog-image-${slug}` }}>
  <img src={featuredImage} />
</div>
```

**Do NOT use both on the same element simultaneously.**

---

## 7. Known Gotchas & Performance Concerns

### Performance

- Browser captures **two bitmap screenshots** (old + new state) per transition. For large viewports, this is GPU memory intensive.
- Having too many elements with `view-transition-name` simultaneously causes choppy animations. React's "just in time" naming (via `<ViewTransition>`) mitigates this.
- Chrome 137+ introduces `view-transition-name: match-element` to auto-name large lists without performance penalty — but this is cutting-edge (Chrome only as of Feb 2026).
- Keep transitions scoped to meaningful hero elements, not entire page grids.
- Overhead is typically 1-5ms for simple transitions — acceptable.

### State management gotcha

- Changing `view-transition-name` dynamically between renders can cause elements to animate that you didn't intend to. React's `<ViewTransition>` handles this correctly; manual implementations require care.

### Suspense/streaming incompatibility

- Neither approach handles streaming SSR transitions cleanly yet. If a route uses Suspense boundaries with streaming, transitions may fire before all content has loaded.
- Next.js 15 App Router heavily uses Suspense. This is the main reason `next-view-transitions` calls itself "basic use cases only."

### Cross-document transitions (MPA)

- Cross-document View Transitions (navigating between separate HTML pages) require `@view-transition { navigation: auto; }` in CSS. This is Chrome 126+/Edge 126+ only — Safari and Firefox don't support it yet.
- Next.js App Router is SPA-mode by default, so this is not relevant unless you're navigating to external pages.

### React flushSync gotcha (manual approach)

- Manual `document.startViewTransition()` + React setState requires `flushSync` to synchronize. This is a known performance anti-pattern. React's `<ViewTransition>` component eliminates this requirement — it handles the coordination internally.

### Next.js-specific transition types: NOT implemented

- The Next.js docs note that "Next.js specific transition types are not implemented yet" — meaning you can't automatically get different animations for forward/back navigation or route types without custom logic.

---

## Recommendation for alexmayhew.dev

**Do not use View Transitions in production yet.** The recommended path:

1. **Monitor React's `<ViewTransition>` stability** — it's in Canary, the API design is "close to final" but the Next.js docs explicitly warn against production use as of Feb 2026.
2. **If you want to ship something now:** Use `next-view-transitions` package for basic page-level crossfades. It's stable for simple SPA navigation.
3. **Architecture:** Keep Framer Motion for all existing spring animations. Apply `view-transition-name` only to hero elements (blog featured images, page headings) that conceptually morph between routes.
4. **Revisit in ~Q3 2026** when React's ViewTransition API exits experimental status and Next.js ships the full integration.

---

## Sources

- [Can I Use: View Transitions API](https://caniuse.com/view-transitions)
- [Next.js docs: viewTransition config](https://nextjs.org/docs/app/api-reference/config/next-config-js/viewTransition)
- [React docs: `<ViewTransition>`](https://react.dev/reference/react/ViewTransition)
- [React Labs blog: View Transitions announcement](https://react.dev/blog/2025/04/23/react-labs-view-transitions-activity-and-more)
- [GitHub: shuding/next-view-transitions](https://github.com/shuding/next-view-transitions)
- [Chrome for Developers: What's new in view transitions 2025](https://developer.chrome.com/blog/view-transitions-in-2025)
- [Motion blog: Do you still need Framer Motion?](https://motion.dev/blog/do-you-still-need-framer-motion)
- [Motion blog: React's experimental View Transition API](https://motion.dev/blog/reacts-experimental-view-transition-api)
- [Chrome for Developers: View Transitions misconceptions](https://developer.chrome.com/blog/view-transitions-misconceptions)
- [View Transitions in React, Next.js, and Multi-Page Apps — Rebecca Deprey](https://rebeccamdeprey.com/blog/view-transition-api)
- [Next.js 15.2 release notes](https://nextjs.org/blog/next-15-2)
