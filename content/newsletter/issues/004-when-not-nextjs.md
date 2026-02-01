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

Full disclosure: alexmayhew.dev runs on Next.js 15. I chose it deliberately — Server Components for SEO, App Router for content-heavy pages, ISR for blog post performance. For a public-facing content site with lead generation, it's the right tool.

But I've advised 3 companies in the last 6 months to not use Next.js. Here's why.

---

## This Week's Decision

**The Situation:**
Your team assumes Next.js is the default for any new React project. But you're building an internal dashboard, an admin panel, or a real-time application where SEO doesn't matter.

**The Insight:**
Next.js trades simplicity for features. Every one of those features — Server Components, streaming SSR, layered caching, middleware — has a cost: mental model complexity, build time, and deployment constraints. When you don't need the features, you're paying the cost for nothing.

The numbers tell the story:

| Metric                        | Next.js 15             | Vite + React Router | Difference    |
| ----------------------------- | ---------------------- | ------------------- | ------------- |
| Dev server cold start         | 3-8s                   | 200-500ms           | 6-16x faster  |
| HMR update                    | 500ms-2s               | 50-150ms            | 3-13x faster  |
| Production build (medium app) | 45-90s                 | 8-15s               | 4-6x faster   |
| Bundle size (hello world)     | ~85KB                  | ~45KB               | 47% smaller   |
| Deployment target             | Node.js server or edge | Any static host     | More flexible |

Those build times compound. A team of 10 engineers running 20 builds per day loses 5-10 hours weekly to unnecessary build overhead on an app that doesn't need SSR.

**The Decision Matrix — 4 criteria that determine if Next.js fits:**

1. **Do you need SEO?** If the app lives behind authentication, the answer is no. Internal tools, admin panels, dashboards — no search engine will ever index them.

2. **Do you need server-side rendering?** For dynamic OG images, initial load performance on content pages, or personalized server-rendered content — yes. For SPAs with a loading spinner — no.

3. **Can your team reason about Server Components?** The mental model is genuinely different. If your team is productive with client-side React and the app doesn't demand SSR, adding Server Components is complexity without payoff.

4. **Are you deploying to Vercel?** Next.js works best on Vercel. Self-hosting Next.js (especially with App Router features like ISR, middleware, and image optimization) requires non-trivial infrastructure. If you're on AWS, GCP, or self-hosted — factor in the deployment overhead.

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
Migration cost matters. A team with 50K+ lines of Next.js code shouldn't rewrite to Vite because dev server startup is faster. The decision matrix above applies to new projects. For existing Next.js apps, the question is: are Server Components and SSR actively helping your users? If yes, stay. If you're fighting the framework more than benefiting from it, evaluate the migration cost — typically 2-4 weeks for a medium-sized app to move to Vite + React Router.

**When to Apply This:**

- Internal dashboards, admin panels, or tools behind authentication — Vite + React Router or TanStack Router
- Real-time applications (WebSocket-heavy, collaborative editing) — Vite + your WebSocket library, no SSR overhead
- Teams under 5 engineers who know React but not Next.js — the learning curve isn't justified without SSR/SEO needs

---

## Worth Your Time

1. **[Remix vs Next.js — Remix Team](https://remix.run/blog/remix-vs-next)** — An honest comparison from the Remix perspective. The key insight: Remix optimizes for web platform standards, Next.js optimizes for React-specific patterns. Different philosophies, different trade-offs.

2. **[TanStack Start](https://tanstack.com/start)** — TanStack's full-stack framework built on Vite. Type-safe from database to UI, server functions without the Server Components model. Worth watching as an alternative for teams that want SSR without the Next.js ecosystem lock-in.

3. **[Vite 6 Performance](https://vite.dev/blog/)** — Vite's architecture (native ES modules, Rolldown bundler) makes it fundamentally faster for development. If dev experience matters to your team's velocity, the benchmarks are worth reviewing.

---

## Tool of the Week

**[TanStack Router](https://tanstack.com/router)** — Type-safe routing for React SPAs. If you decide Next.js isn't the right fit, this is what I recommend for client-side routing. Full TypeScript inference for route params, search params, and loader data — the kind of DX that Next.js's file-based routing can't match for complex apps. Pairs naturally with TanStack Query for data fetching.

---

That's it for this week.

Hit reply if you're evaluating whether Next.js is the right fit for your next project. Tell me what you're building and I'll give you a straight answer. I read every response.

– Alex

P.S. For a deeper look at modern frontend architecture decisions — including when React Server Components genuinely pay off: [Modern Frontend Architecture](https://alexmayhew.dev/blog/modern-frontend-architecture).
