---
issue: 3
title: "PostgreSQL RLS for Multi-Tenancy"
subject: "The Postgres feature replacing thousands of lines of code"
sendDate: "2026-02-18"
status: "draft"
pillar: "saas-patterns"
---

Subject: The Postgres feature replacing thousands of lines of code

Hey {first_name},

A client's security audit flagged 3 API endpoints last quarter. The issue: missing `WHERE tenant_id = ?` clauses. Three places across 200+ queries where a developer forgot the filter.

In a multi-tenant SaaS, that's 3 potential data breaches — caught in audit, not in production. They were lucky.

There's a way to make "forgetting" impossible.

---

## This Week's Decision

**The Situation:**
You're building a multi-tenant SaaS with a shared database. Every query needs tenant isolation. Miss one `WHERE tenant_id = ?`, and you've got a cross-tenant data leak.

**The Insight:**
PostgreSQL Row-Level Security (RLS) enforces tenant isolation at the database layer. The database itself refuses to return rows that don't belong to the current tenant. You can't forget a WHERE clause because the database won't let you see the wrong data — even if you try.

The performance overhead is small: 2-5% on typical queries, measured across 3 client deployments running 500K-2M rows per tenant. That's a rounding error compared to the cost of a single data breach.

Here's the setup, including how it integrates with Prisma:

```sql
-- 1. Enable RLS on every tenant-scoped table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- 2. Create the isolation policy
CREATE POLICY tenant_isolation ON projects
  USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- Apply same policy to all tenant-scoped tables
CREATE POLICY tenant_isolation ON tasks
  USING (tenant_id = current_setting('app.tenant_id')::uuid);

CREATE POLICY tenant_isolation ON invoices
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

```typescript
// 3. Prisma middleware — set tenant context on every query
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
	const tenantId = getTenantFromRequest();
	await prisma.$executeRawUnsafe(`SET LOCAL app.tenant_id = '${tenantId}'`);
	return next(params);
});

// Now every query is automatically filtered
const projects = await prisma.project.findMany();
// Returns ONLY current tenant's projects
```

No more `WHERE tenant_id = ?` scattered across your codebase. No more security audit findings. The database enforces isolation — your application code focuses on business logic.

**When NOT to Use RLS:**

- **FedRAMP or strict HIPAA requirements** — some compliance frameworks mandate physical database isolation, not logical. Check your specific certification requirements.
- **Wildly different tenant sizes** — if one tenant has 100M rows and others have 1K, query planning can suffer. Consider partitioning alongside RLS.
- **Cross-tenant analytics** — RLS makes tenant-spanning queries harder by design. If you need cross-tenant reporting, use a separate analytics database.

**When to Apply This:**

- Multi-tenant SaaS with a shared PostgreSQL database — implement from day one, even with a single tenant
- Any application handling regulated data (healthcare, fintech) where audit trail matters
- Teams that have had (or fear) cross-tenant data exposure in security audits

---

## Worth Your Time

1. **[Crunchy Data: Row-Level Security in PostgreSQL](https://www.crunchydata.com/blog/row-level-security-in-postgresql)** — The most thorough walkthrough I've found. Covers performance implications, policy composition, and edge cases around superuser bypass that catch teams off guard.

2. **[Supabase RLS Patterns](https://supabase.com/docs/guides/database/postgres/row-level-security)** — Supabase built their entire auth model on RLS. Their pattern library shows real-world policies beyond simple tenant isolation — row-level ownership, role-based access, and time-based policies.

3. **[AWS Multi-Tenant SaaS Architecture](https://docs.aws.amazon.com/whitepapers/latest/saas-tenant-isolation-strategies/saas-tenant-isolation-strategies.html)** — AWS's whitepaper on isolation strategies. Useful for understanding where RLS sits on the isolation spectrum and when you genuinely need physical separation.

---

## Tool of the Week

**[pgAudit](https://www.pgaudit.org/)** — Once you have RLS enforcing isolation, add pgAudit for compliance logging. It records who accessed what data, when, and through which policy. For SOC 2 and HIPAA audits, RLS for enforcement plus pgAudit for evidence is the most cost-effective approach I've implemented.

---

That's it for this week.

Hit reply if you're implementing multi-tenancy and unsure whether RLS fits your compliance requirements. I read every response.

– Alex

P.S. For the full guide on multi-tenancy patterns with Prisma, including migration strategies and testing approaches: [Multi-Tenancy with Prisma and Row-Level Security](https://alexmayhew.dev/blog/multi-tenancy-prisma-rls). And for how this fits into the broader SaaS architecture picture: [SaaS Architecture Decision Framework](https://alexmayhew.dev/blog/saas-architecture-decision-framework).
