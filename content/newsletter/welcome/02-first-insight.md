---
sequence: 2
title: "The Architecture Mistake in Every Early-Stage SaaS"
subject: "The architecture mistake in every early-stage SaaS"
delay: "3 days"
status: "draft"
---

Subject: The architecture mistake in every early-stage SaaS

Hey {first_name},

There's one architecture mistake that shows up in early-stage SaaS again and again. The symptoms differ ... scaling worries, hiring bottlenecks, cloud costs ... but the root cause is usually the same.

They over-engineered their infrastructure before they had product-market fit.

---

## The Pattern

Here's what it looks like in practice. A founding team raises a seed round, hires 3-5 engineers, and the first big technical decision is architecture. They reach for microservices, Kubernetes, and a distributed event bus because "we need to build for scale."

Six months later, they have 200 users and 14 infrastructure services.

The math is brutal. Teams in this position spend 40-60% of their engineering time on infrastructure ... service mesh config, inter-service debugging, deployment pipeline maintenance. That's time not spent on the product their customers are paying for.

The teams that move fastest do the opposite. A well-structured monolith on a single managed service. PostgreSQL, not a polyglot persistence layer. Server-rendered pages, not a decoupled SPA with a separate API gateway.

## The Decision Framework

**If your ARR is under $500K:** Monolith on managed infrastructure. PostgreSQL. One deployment pipeline. Spend 90% of engineering time on product.

**If your ARR is $500K-$2M:** Identify the one component with genuinely different scaling needs (usually async processing or file handling). Extract that. Keep everything else together.

**If your ARR is $2M+:** Now you have the revenue to justify operational complexity. Extract services along domain boundaries ... but only when the monolith actively blocks team velocity.

The threshold isn't technical. It's economic. Microservices are an organizational scaling pattern, not a technical performance one. If your team fits in one room, a monolith is faster to ship, debug, and deploy.

---

Companies burn 6-12 months of runway on infrastructure they didn't need. The ones that ship fastest defer complexity until the business actually demands it.

Next email: the multi-tenancy decision, and why "database-per-tenant" is usually the expensive answer.

– Alex

P.S. If this resonated, the [SaaS Architecture Decision Framework](https://alexmayhew.dev/blog/saas-architecture-decision-framework) goes deeper into mapping architecture choices to revenue milestones.
