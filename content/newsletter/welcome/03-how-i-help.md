---
sequence: 3
title: "How I Help CTOs Make Better Architecture Decisions"
subject: "How I help CTOs make better architecture decisions"
delay: "7 days"
status: "draft"
---

Subject: How I help CTOs make better architecture decisions

Hey {first_name},

Last email I shared the most common architecture mistake I see in early-stage SaaS. Today I want to briefly explain how I work with companies on these decisions — because the newsletter is a distilled version of what I do as a Technical Advisor.

---

## What a Typical Engagement Looks Like

A Series A SaaS company ($1.2M ARR, 8 engineers) reached out last year. They were preparing for a growth phase and their CTO had three decisions to make:

1. Whether to extract their billing module into a separate service
2. How to implement multi-tenancy for an enterprise sales motion
3. Whether to migrate from Heroku to Kubernetes

We spent two weeks on an architecture review. The outcome:

- **Billing extraction: No.** Their billing logic was tightly coupled to their core domain model. Extracting it would require 3-4 months of engineering time with no user-facing benefit. We restructured the module boundaries within the monolith instead — 2 weeks of work.

- **Multi-tenancy: Row-Level Security from day one.** I recommended PostgreSQL RLS with a shared database rather than the database-per-tenant approach they were considering. Saved them from managing hundreds of database instances as they scaled. Implementation cost: 3 weeks vs. the 3+ months for database-per-tenant.

- **Kubernetes migration: Deferred.** Their Heroku setup handled their current traffic with room to grow. We identified the actual threshold ($3M ARR, 50K concurrent users) where migration would become necessary and documented the migration path so they could execute it when the time came.

Total advisory cost was a fraction of what they would have spent on even one of the over-engineered alternatives. More importantly, their engineering team spent Q2 shipping features — not configuring infrastructure.

---

## The Advisory Model

I work with a limited number of companies each quarter. Engagements range from focused architecture reviews (2-4 weeks) to ongoing advisory relationships (monthly check-ins, async access for decisions as they come up).

The goal is always the same: make the right technical decision for your current stage, not the decision that looks impressive on a conference slide.

If you're facing a similar decision — architecture review, scaling strategy, tech stack evaluation — hit reply. I'm happy to point you in the right direction, even if a formal engagement isn't the right fit.

– Alex

P.S. For a deeper look at how I think about the multi-tenancy decision specifically, here's the full guide: [Multi-Tenancy with Prisma and Row-Level Security](https://alexmayhew.dev/blog/multi-tenancy-prisma-rls).
