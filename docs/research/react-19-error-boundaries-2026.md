# React 19 Error Boundary Best Practices (2026-02-15)

**Status:** CURRENT
**Session:** ChatWidget ErrorBoundary implementation + route-level error.tsx analysis

## Executive Summary

React 19 **still requires class components** for error boundaries—no hooks-based API exists. However, React 19 introduced powerful **error hooks at the root level** (`onUncaughtError`, `onCaughtError`, `onRecoverableError`) that work alongside Error Boundaries for enterprise-grade error handling.

**Recommendation:** Use `react-error-boundary` library (4.x+) over custom class components for production apps. It's lightweight, TypeScript-native, and provides reset/retry functionality that custom implementations lack.

---

## Key Findings

### 1. React 19 Error Boundary Status (Class Components Still Required)

**Class components remain the only way to create error boundaries.** You must implement:

- `static getDerivedStateFromError()` — captures error state
- `componentDidCatch()` — logs error info + component stack

**No functional component alternative exists.** Hooks like `useErrorHandler` (from `react-error-boundary`) work _inside_ error boundaries, not as replacements.

**Source:** [React Error Boundaries (Official Docs)](https://legacy.reactjs.org/docs/error-boundaries.html)

---

### 2. React 19 Root-Level Error Hooks (New Feature)

React 19 introduced **error hooks** that capture errors at the root of your React tree:

```tsx
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";

const root = createRoot(document.getElementById("root")!, {
	onUncaughtError: Sentry.reactErrorHandler(),
	onCaughtError: Sentry.reactErrorHandler(),
	onRecoverableError: Sentry.reactErrorHandler(),
});
```

**Behavior changes:**

- **Uncaught errors** (not caught by ErrorBoundary) → `window.reportError` (was `console.error`)
- **Caught errors** (inside ErrorBoundary) → `console.error` (was duplicated to global handler)
- **No more duplicate logs** in production builds

**Best practice:** Use `onUncaughtError` + `onRecoverableError` for global monitoring. Only use `onCaughtError` if you _don't_ have granular ErrorBoundary components (otherwise it duplicates logging).

**Sources:**

- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [Sentry React Error Boundary Docs](https://docs.sentry.io/platforms/javascript/guides/react/features/error-boundary/)

---

### 3. react-error-boundary Library (Recommended)

**Version:** 4.x+ (React 19 compatible)

**Why use it over custom class components:**

1. **Zero boilerplate** — Drop-in `<ErrorBoundary>` component
2. **Reset functionality** — `resetErrorBoundary()` prop for retry logic
3. **TypeScript-native** — Built-in type definitions
4. **Hook support** — `useErrorHandler()` for programmatic error throwing
5. **Actively maintained** — React 19 compatibility guaranteed

**Installation:**

```bash
npm install react-error-boundary
```

**Basic usage:**

```tsx
import { ErrorBoundary } from "react-error-boundary";

<ErrorBoundary fallback={<div>Something went wrong</div>}>
	<ChatWidget />
</ErrorBoundary>;
```

**With reset + Sentry:**

```tsx
import { ErrorBoundary } from "react-error-boundary";
import * as Sentry from "@sentry/nextjs";

function ErrorFallback({ error, resetErrorBoundary }) {
	return (
		<div role="alert">
			<p>Error: {error.message}</p>
			<button onClick={resetErrorBoundary}>Try again</button>
		</div>
	);
}

<ErrorBoundary
	FallbackComponent={ErrorFallback}
	onError={(error, info) => {
		Sentry.captureException(error, { contexts: { react: info } });
	}}
	onReset={() => {
		// Reset app state here
	}}
>
	<ChatWidget />
</ErrorBoundary>;
```

**Sources:**

- [react-error-boundary npm](https://www.npmjs.com/package/react-error-boundary)
- [GitHub: bvaughn/react-error-boundary](https://github.com/bvaughn/react-error-boundary)

---

### 4. Lightweight Pattern for Non-Critical Widgets

**For our use case (wrapping ChatWidget with `fallback: null`):**

The current custom ErrorBoundary is **appropriate**. It's 37 lines, has zero dependencies, and does exactly what's needed.

**When to use lightweight custom class:**

- Fallback is static (null, simple JSX)
- No reset/retry logic needed
- No external error reporting (or handled at root level)
- Performance-critical paths where library overhead matters

**When to switch to react-error-boundary:**

- Need reset/retry functionality
- Multiple error boundaries with different fallback UIs
- Integration with error monitoring services
- Team prefers functional-style APIs

**Performance comparison:** Both approaches are **identical at runtime**—`react-error-boundary` uses the same `getDerivedStateFromError` + `componentDidCatch` under the hood. The difference is DX (developer experience), not performance.

**Sources:**

- [Error Boundaries in React - Refine](https://refine.dev/blog/react-error-boundaries/)
- [react-error-boundary vs custom class - Medium](https://medium.com/@vnkelkar11/using-error-boundary-in-react-a29ded725eee)

---

### 5. Sentry Integration Best Practices

**Architecture:** Sentry provides both root-level hooks _and_ ErrorBoundary integration.

**Recommended setup for React 19 + Next.js 15:**

1. **Root-level error capture** (`app/layout.tsx` or `_app.tsx`):

```tsx
import * as Sentry from "@sentry/nextjs";

Sentry.init({
	dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
	tracesSampleRate: 0.1,
	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1.0,
});

// If using React 19 createRoot (not typical in Next.js, but for reference):
const root = createRoot(el, {
	onUncaughtError: Sentry.reactErrorHandler(),
	onRecoverableError: Sentry.reactErrorHandler(),
	// Don't use onCaughtError if you have ErrorBoundary components
});
```

2. **Component-level boundaries** (for granular fallbacks):

```tsx
import { ErrorBoundary } from "react-error-boundary";
import * as Sentry from "@sentry/nextjs";

<ErrorBoundary
	fallback={<ChatWidgetError />}
	onError={(error, info) => {
		Sentry.captureException(error, {
			contexts: { react: { componentStack: info.componentStack } },
		});
	}}
>
	<ChatWidget />
</ErrorBoundary>;
```

**Component stack included:** Sentry automatically attaches React component stacks when errors are caught by ErrorBoundary, making debugging significantly easier.

**Development mode gotcha:** In dev mode, React rethrows caught errors to the global handler, causing **duplicate reports**. Test with production build (`npm run build && npm start`) to verify.

**Sources:**

- [Sentry React Error Boundary](https://docs.sentry.io/platforms/javascript/guides/react/features/error-boundary/)
- [Guide to Error Handling in React - Sentry Blog](https://blog.sentry.io/guide-to-error-and-exception-handling-in-react/)

---

### 6. Next.js 15 error.tsx vs React ErrorBoundary

**Next.js error.tsx:**

- **File-based routing convention** — place `error.tsx` next to `page.tsx`
- **Wraps route segments** — automatically creates ErrorBoundary for that route + children
- **Must be client component** (`'use client'` directive required)
- **Server Component limitation:** Cannot catch errors from Server Components in the _same_ segment (only children)

**React ErrorBoundary (custom or library):**

- **Component-level granularity** — wrap specific widgets/sections
- **Works in layouts** — can wrap non-route UI (ChatWidget, modals, etc.)
- **Not file-based** — explicit component composition

**When they're redundant:**

- `error.tsx` at `/demo` route + custom ErrorBoundary wrapping ChatWidget = **not redundant**
- `error.tsx` provides route-level fallback UI (whole page)
- ErrorBoundary provides widget-level isolation (ChatWidget fails → null, rest of page works)

**Critical limitation:** Server Components throw errors _before_ client-side ErrorBoundary can catch them. For Server Component errors, you **must** use `error.tsx` at the same level or above.

**Sources:**

- [Next.js error.js File Convention](https://nextjs.org/docs/app/api-reference/file-conventions/error)
- [Next.js Error Handling Guide](https://nextjs.org/docs/app/getting-started/error-handling)
- [Next.js Error Boundary Best Practices - DhiWise](https://www.dhiwise.com/post/nextjs-error-boundary-best-practices)

---

### 7. React 19 `use()` Hook Interaction

**The `use()` API** (React 19 feature):

- Accepts a promise, returns resolved value
- **Suspends** (not throws) while promise is pending
- **Throws error** if promise rejects

**Error handling flow:**

```tsx
import { use, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

function DataComponent({ dataPromise }) {
	const data = use(dataPromise); // Suspends or throws error
	return <div>{data.title}</div>;
}

// Correct nesting:
<ErrorBoundary fallback={<ErrorUI />}>
	<Suspense fallback={<Loading />}>
		<DataComponent dataPromise={fetchData()} />
	</Suspense>
</ErrorBoundary>;
```

**Key points:**

- **ErrorBoundary wraps Suspense** (not the other way around)
- If promise rejects → ErrorBoundary catches it
- If promise pending → Suspense shows fallback
- React 19 tightened Suspense + ErrorBoundary coordination (no duplicate error logs)

**Sources:**

- [Modern React Data Fetching: Suspense, use(), ErrorBoundary - freeCodeCamp](https://www.freecodecamp.org/news/the-modern-react-data-fetching-handbook-suspense-use-and-errorboundary-explained/)
- [React 19 Resilience: Retry, Suspense & Error Boundaries - Medium](https://medium.com/@connect.hashblock/react-19-resilience-retry-suspense-error-boundaries-40ea504b09ed)
- [React Suspense Official Docs](https://react.dev/reference/react/Suspense)

---

## Recommendations for Our Codebase

### Current Implementation Analysis

**File:** `src/components/ui/error-boundary.tsx`
**Usage:** Wraps `<ChatWidget />` in `app/layout.tsx` with `fallback: null`

**Verdict:** ✅ **Appropriate for current use case.**

**Reasoning:**

- 37 lines, zero dependencies
- Static fallback (null)
- No reset/retry needed
- ChatWidget is non-critical (fail silently = correct UX)

### When to Migrate to react-error-boundary

**Trigger conditions:**

1. Need reset/retry UI for ChatWidget
2. Adding Sentry integration for error monitoring
3. Implementing multiple error boundaries (3+ instances)
4. Team preference for functional-style APIs

**Migration example:**

```bash
npm install react-error-boundary
```

```tsx
// app/layout.tsx
import { ErrorBoundary } from "react-error-boundary";

<ErrorBoundary fallback={null}>
	<ChatWidget />
</ErrorBoundary>;
```

**Benefits of migration:**

- Delete 30 lines of custom code
- Get TypeScript types for free
- Access to `useErrorHandler()` hook for programmatic errors
- Future-proof (library handles React API changes)

### Sentry Integration Pattern

**If we add @sentry/nextjs:**

1. **Initialize in `instrumentation.ts`** (Next.js 15 pattern):

```tsx
export async function register() {
	if (process.env.NEXT_RUNTIME === "nodejs") {
		await import("./instrumentation.node");
	}
	if (process.env.NEXT_RUNTIME === "edge") {
		await import("./instrumentation.edge");
	}
}
```

2. **Wrap ErrorBoundary with Sentry:**

```tsx
import { ErrorBoundary } from "react-error-boundary";
import * as Sentry from "@sentry/nextjs";

<ErrorBoundary
	fallback={null}
	onError={(error, info) => {
		Sentry.captureException(error, {
			contexts: { react: { componentStack: info.componentStack } },
		});
	}}
>
	<ChatWidget />
</ErrorBoundary>;
```

3. **Use root-level hooks for uncaught errors:**
   Sentry's Next.js SDK automatically hooks into Next.js error handling—no manual `createRoot` needed.

---

## Lessons Learned

1. **React 19 did NOT introduce hooks-based error boundaries** — class components still required.
2. **react-error-boundary is production-ready** — same performance, better DX.
3. **Next.js error.tsx ≠ React ErrorBoundary** — they solve different problems (route vs component granularity).
4. **Sentry integration is trivial** with `react-error-boundary` (onError prop).
5. **For simple fallback: null cases, custom class is fine** — no need to over-engineer.
6. **React 19's use() hook requires ErrorBoundary wrapping Suspense** — new async pattern to internalize.

---

## References

### Official React Documentation

- [Error Boundaries (Legacy Docs)](https://legacy.reactjs.org/docs/error-boundaries.html)
- [React 19 Release](https://react.dev/blog/2024/12/05/react-19)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [Suspense API](https://react.dev/reference/react/Suspense)

### Next.js Documentation

- [error.js File Convention](https://nextjs.org/docs/app/api-reference/file-conventions/error)
- [Error Handling Guide](https://nextjs.org/docs/app/getting-started/error-handling)

### Libraries

- [react-error-boundary (npm)](https://www.npmjs.com/package/react-error-boundary)
- [react-error-boundary (GitHub)](https://github.com/bvaughn/react-error-boundary)

### Sentry Integration

- [Sentry React Error Boundary](https://docs.sentry.io/platforms/javascript/guides/react/features/error-boundary/)
- [Guide to Error Handling in React - Sentry](https://blog.sentry.io/guide-to-error-and-exception-handling-in-react/)

### Guides & Best Practices

- [Modern React Data Fetching: Suspense, use(), ErrorBoundary - freeCodeCamp](https://www.freecodecamp.org/news/the-modern-react-data-fetching-handbook-suspense-use-and-errorboundary-explained/)
- [React 19 Resilience: Retry, Suspense & Error Boundaries - Medium](https://medium.com/@connect.hashblock/react-19-resilience-retry-suspense-error-boundaries-40ea504b09ed)
- [Error Boundaries in React - Refine](https://refine.dev/blog/react-error-boundaries/)
- [Next.js Error Boundary Best Practices - DhiWise](https://www.dhiwise.com/post/nextjs-error-boundary-best-practices)
- [Next.js 15 Error Handling Best Practices - Dev and Deliver](https://devanddeliver.com/blog/frontend/next-js-15-error-handling-best-practices-for-code-and-routes)
