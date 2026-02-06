---
issue: 1
title: "Why Your SaaS Needs a Monolith First"
subject: "Why your SaaS needs a monolith (yes, really)"
sendDate: "2026-02-04"
status: "draft"
pillar: "architecture"
---

Subject: Why your SaaS needs a monolith (yes, really)

Hey {first_name},

Last month a seed-stage founder asked me to review their architecture plan. They had $400K in ARR, 4 engineers, and a 14-service microservices diagram. They'd spent the last 3 months building infrastructure instead of closing the features their first enterprise prospect was asking for.

This is the most expensive mistake I see in early-stage SaaS.

---

## This Week's Decision

**The Situation:**
You're building a new SaaS product. Your team debates: start with microservices for "scale" or build a monolith you'll "have to rewrite later."

**The Insight:**
The companies I advise that started with microservices spend 40-60% of their first year on infrastructure — service mesh configuration, distributed tracing, deployment pipelines for 8+ services — none of which ships a feature. Here's how that breaks down:

- **Infrastructure code:** 30-40% of total codebase (service discovery, health checks, inter-service auth)
- **Debugging overhead:** 2-3x longer sessions chasing requests across service boundaries
- **Deployment complexity:** CI/CD for one service takes a day. For 8, it takes a week — plus coordination
- **Hiring cost:** You need infrastructure engineers before you've validated product-market fit

The companies that ship fastest? A well-structured monolith with clear module boundaries. When they hit the scale threshold — and most won't for 18-24 months — they have natural seams for extraction.

```
src/
├── modules/
│   ├── auth/              # → future auth svc
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   └── auth.repository.ts
│   ├── billing/           # → future billing svc
│   │   ├── billing.service.ts
│   │   └── stripe.adapter.ts
│   └── notifications/     # → future notif svc
├── shared/
│   └── database/          # Single DB for now
└── main.ts
```

The key: design boundaries inside the monolith. When extraction becomes necessary, the seams are already there.

**The Red Flag:** If an engineer on your team argues for microservices but can't name the specific bottleneck a monolith can't handle — they're optimizing for resume, not product.

**When to Apply This:**

- Pre-Series A, under $500K ARR — monolith, no exceptions
- $500K-$2M ARR, under 50 engineers — monolith with 1-2 extracted services (async jobs, file processing)
- $2M+ ARR, 50+ engineers — now evaluate extraction along team ownership boundaries

---

## Worth Your Time

1. **[DHH: The Majestic Monolith](https://m.signalvnoise.com/the-majestic-monolith/)** — The original argument, and it's aged well. Basecamp and HEY run on a single Rails monolith serving millions. The insight isn't "monoliths are better" — it's that organizational complexity should match organizational scale.

2. **[Segment's Return to the Monolith](https://segment.com/blog/goodbye-microservices/)** — Segment went full microservices, hit catastrophic operational overhead, and came back. Their post-mortem is the most honest account of microservices failure costs I've read.

3. **[Martin Fowler: Monolith First](https://martinfowler.com/bliki/MonolithFirst.html)** — The canonical reference on why starting with a monolith and extracting later is lower-risk than starting distributed. His point about "you don't know where the boundaries are" early on is worth internalizing.

---

## Tool of the Week

**[Turborepo](https://turbo.build/repo)** — If you're going to split code early, at least keep it in a monorepo. Turborepo's remote caching cuts CI times by 40-65% on typical setups, and you avoid the coordination tax of multi-repo dependency management. I recommend this to any team over 5 engineers, even if they're running a monolith — the task orchestration alone pays for itself.

---

That's it for this week.

Hit reply if you're debating monolith vs. microservices right now — I'll give you a straight answer based on your stage. I read every response.

– Alex

P.S. If you want the full decision framework mapping architecture choices to revenue milestones, start here: [SaaS Architecture Decision Framework](https://alexmayhew.dev/blog/saas-architecture-decision-framework).
