---
sequence: 3
title: "The Multi-Tenancy Decision (and Why Per-Tenant Is Usually Wrong)"
subject: "The multi-tenancy decision most teams get expensive"
delay: "7 days"
status: "draft"
---

Subject: The multi-tenancy decision most teams get expensive

Hey {first_name},

Last email covered the monolith-first pattern. Today, a decision that sits right next to it and costs teams the most when they get it wrong: how to isolate tenant data.

The instinct, especially with an enterprise sales motion on the horizon, is database-per-tenant. Physical isolation feels safest. For most B2B SaaS, it's the expensive answer.

---

## The Options, Side by Side

| Requirement      | Database-per-Tenant | Shared DB + RLS    | Shared DB + Schema  |
| ---------------- | ------------------- | ------------------ | ------------------- |
| Data isolation   | Physical            | Logical (enforced) | Logical (namespace) |
| Compliance audit | Pass                | Pass with pgAudit  | Pass with pgAudit   |
| Migration effort | ~6 months           | ~6 weeks           | ~8 weeks            |
| Ongoing cost     | High (per-instance) | ~$0 incremental    | Low                 |
| Operational load | High                | Low                | Medium              |

PostgreSQL Row-Level Security with `pgAudit` for compliance logging meets the requirements most teams actually have. The database enforces tenant boundaries, not application code you have to get right on every query.

## When Per-Tenant Is Right

The instinct isn't always wrong. Physical isolation is genuinely necessary for some compliance regimes (certain HIPAA requirements, FedRAMP, some financial regulations) or when a contract mandates it. But for roughly 80% of B2B SaaS, logical isolation with RLS and audit logging clears the bar... at a fraction of the migration time and ongoing cost.

The difference between the right architecture at the right stage and the right architecture at the wrong stage is often hundreds of thousands of dollars and months of lost velocity.

---

If you're weighing this one, hit reply and tell me the constraints you're working under. I'm happy to point you at the tradeoffs even if it's just a quick back-and-forth.

– Alex

P.S. The full technical walkthrough of the RLS approach is here: [Multi-Tenancy with Prisma and Row-Level Security](https://alexmayhew.dev/blog/multi-tenancy-prisma-rls).
