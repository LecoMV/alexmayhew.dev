---
sequence: 5
title: "The Architecture Review That Saved 6 Months of Engineering"
subject: "The architecture review that saved a SaaS company 6 months of engineering"
delay: "21 days"
status: "draft"
---

Subject: The architecture review that saved a SaaS company 6 months of engineering

Hey {first_name},

I want to share a story that captures what I do as a Technical Advisor — and why architecture decisions at the right stage matter more than most founders realize.

---

## The Situation

A B2B SaaS company (Series A, $2.1M ARR, 12 engineers) had a problem. Their flagship product was a project management tool for construction firms. They were closing enterprise deals — but their architecture couldn't support the isolation and compliance requirements their new customers demanded.

Their CTO had a plan: migrate to a database-per-tenant architecture on Kubernetes, with a custom orchestration layer to manage tenant provisioning. The engineering team estimated 6 months. Leadership approved the project.

Before they started, the CTO asked me to review the plan.

## The Problem

The proposed architecture solved the isolation requirement — but at enormous cost:

- **6 months of feature freeze** while 12 engineers rebuilt infrastructure
- **$8K/month in additional cloud costs** for managing isolated databases
- **3x operational complexity** — monitoring, backups, migrations, and provisioning for every tenant
- **Hiring pressure** — they'd need a dedicated infrastructure engineer to maintain it

The enterprise contracts they were chasing were worth $180K/year. The migration would cost them $400K+ in engineering time before a single enterprise customer went live.

## The Decision Framework Applied

We mapped the actual requirements against the available options:

| Requirement      | Database-per-Tenant | Shared DB + RLS    | Shared DB + Schema  |
| ---------------- | ------------------- | ------------------ | ------------------- |
| Data isolation   | Physical            | Logical (enforced) | Logical (namespace) |
| Compliance audit | Pass                | Pass with pgAudit  | Pass with pgAudit   |
| Migration effort | 6 months            | 6 weeks            | 8 weeks             |
| Ongoing cost     | $8K/mo              | $0 incremental     | $200/mo             |
| Operational load | High                | Low                | Medium              |

PostgreSQL Row-Level Security with `pgAudit` for compliance logging met every stated requirement. The implementation took 6 weeks instead of 6 months.

## The Outcome

- **5 months of engineering time redirected to product** — they shipped three enterprise features in the time they would have spent on infrastructure
- **$96K/year in avoided cloud costs** — shared database vs. per-tenant instances
- **First enterprise contract closed 8 weeks after the review** — instead of 7+ months
- **Zero data isolation incidents** in the 10 months since — RLS enforces tenant boundaries at the database level, not application code

The architecture review cost less than one month of the avoided cloud spend.

---

## Why This Matters

The CTO's instinct wasn't wrong — database-per-tenant is the right choice in some scenarios. Physical isolation is necessary for certain compliance regimes (HIPAA with specific requirements, FedRAMP, some financial regulations). But for 80% of B2B SaaS companies, logical isolation with RLS and audit logging meets the bar.

The difference between the right architecture at the right stage and the right architecture at the wrong stage is often hundreds of thousands of dollars and months of lost velocity.

---

That's what advisory work looks like in practice. Not "move to microservices" or "adopt Kubernetes" — but finding the simplest architecture that meets your actual requirements at your current stage.

I take on a limited number of advisory engagements each quarter. If your team is facing architectural decisions like this — scaling strategy, multi-tenancy approach, infrastructure evaluation — reply to this email. Even if a formal engagement isn't the right fit, I'm happy to point you in the right direction.

– Alex

P.S. For the technical deep-dive on the RLS approach from this case study, see: [Multi-Tenancy with Prisma and Row-Level Security](https://alexmayhew.dev/blog/multi-tenancy-prisma-rls).
