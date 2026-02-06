---
issue: 4
title: "When NOT to Use Next.js"
subject: "The Next.js escape hatch nobody talks about"
sendDate: "2026-02-25"
status: "draft"
pillar: "contrarian"
---

Subject: The Next.js escape hatch nobody talks about

Hey {first_name},

Full disclosure: alexmayhew.dev runs on Next.js 15. Server Components for SEO, App Router for content-heavy pages, ISR for blog performance. For a public-facing content site, it's the right tool.

But I've advised 3 companies in the last 6 months to not use Next.js. Here's why.

---

## This Week's Decision

**The Situation:**
Your team assumes Next.js is the default for any new React project. But you're building an internal dashboard, an admin panel, or a real-time application where SEO doesn't matter.

**The Insight:**
Next.js trades simplicity for features. Server Components, streaming SSR, layered caching, middleware — each adds mental model complexity, build time, and deployment constraints. When you don't need them, you're paying the cost for nothing.

The numbers tell the story:

| Metric                        | Next.js 15             | Vite + React Router | Difference    |
| ----------------------------- | ---------------------- | ------------------- | ------------- |
| Dev server cold start         | 3-8s                   | 200-500ms           | 6-16x faster  |
| HMR update                    | 500ms-2s               | 50-150ms            | 3-13x faster  |
| Production build (medium app) | 45-90s                 | 8-15s               | 4-6x faster   |
| Bundle size (hello world)     | ~85KB                  | ~45KB               | 47% smaller   |
| Deployment target             | Node.js server or edge | Any static host     | More flexible |

Those build times compound. A team of 10 running 20 builds/day loses 5-10 hours weekly to overhead on an app that doesn't need SSR.

**The Decision Matrix — 4 criteria that determine if Next.js fits:**

1. **Do you need SEO?** If the app lives behind authentication, the answer is no. Internal tools, admin panels, dashboards — no search engine will ever index them.

2. **Do you need SSR?** For dynamic OG images or content page performance — yes. For SPAs with a loading spinner — no.

3. **Can your team reason about Server Components?** If your team is productive with client-side React and the app doesn't demand SSR, Server Components add complexity without payoff.

4. **Are you deploying to Vercel?** Next.js works best on Vercel. Self-hosting with App Router features requires non-trivial infrastructure.

```typescript
// For internal tools: Vite + React Router is all you need
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	server: { port: 3000 },
});

// No server components to debug
// No caching layers to reason about
// 200ms dev server start
// Deploy anywhere — it's static files + API calls
```

**If You've Already Invested in Next.js:**
This matrix applies to new projects. A team with 50K+ lines of Next.js shouldn't rewrite for faster dev server startup.

For existing apps: are Server Components and SSR actively helping your users? If yes, stay. If you're fighting the framework, the migration cost is typically 2-4 weeks.

**When to Apply This:**

- Internal dashboards, admin panels, or tools behind authentication — Vite + React Router or TanStack Router
- Real-time applications (WebSocket-heavy, collaborative editing) — Vite + your WebSocket library, no SSR overhead
- Teams under 5 engineers who know React but not Next.js — the learning curve isn't justified without SSR/SEO needs

---

## Worth Your Time

1. **[Remix vs Next.js — Remix Team](https://remix.run/blog/remix-vs-next)** — The key insight: Remix optimizes for web platform standards, Next.js for React-specific patterns. Different philosophies, different trade-offs.

2. **[TanStack Start](https://tanstack.com/start)** — Full-stack framework on Vite. Type-safe from database to UI, server functions without Server Components. Worth watching for SSR without Next.js lock-in.

3. **[Vite 6 Performance](https://vite.dev/blog/)** — Native ES modules and Rolldown bundler make it fundamentally faster. If dev experience matters to velocity, the benchmarks are worth reviewing.

---

## Tool of the Week

**[TanStack Router](https://tanstack.com/router)** — Type-safe routing for React SPAs. Full TypeScript inference for route params, search params, and loader data — DX that Next.js's file-based routing can't match for complex apps. Pairs with TanStack Query for data fetching.

---

That's it for this week.

Hit reply if you're evaluating Next.js for your next project. Tell me what you're building — I'll give you a straight answer.

– Alex

P.S. For a deeper look at modern frontend architecture decisions — including when React Server Components genuinely pay off: [Modern Frontend Architecture](https://alexmayhew.dev/blog/modern-frontend-architecture).
