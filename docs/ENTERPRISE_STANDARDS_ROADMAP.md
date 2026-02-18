# Enterprise Standards Roadmap

Items identified from auditing against `docs/standards/Enhancing AI Code to Enterprise Standards.md`. Organized by priority.

## Completed

- **Zod schema validation on chat API** (Section 2.3) -- replaced manual shotgun parsing with schema-first `safeParse()` at the edge
- **JSON parse error differentiation** (Section 2.2 Level 1) -- malformed JSON now returns 400, not 500
- **Structured logging + correlation IDs** (Section 7.1) -- hand-rolled `src/lib/logger.ts` with structured JSON output. All 7 `console.error` calls in API routes migrated. `crypto.randomUUID()` request IDs in all handlers. `x-request-id` response headers on errors.
- **Property-based testing** (Section 5.2) -- 28 property tests via `fast-check` + `@fast-check/vitest`. Covers `parseTags`, `parseFrontmatter`, `checkRateLimit`, `countWords`, `seoMetaSchema`, `budgetRangeSchema`, `validateSlugFormat`, `ChatMessageSchema`, `ChatRequestSchema`.
- **Mutation testing** (Section 5.1) -- Stryker v9.5.1 with Vitest runner + TypeScript checker. Scoped to 5 high-value files. Weekly CI workflow (`workflow_dispatch` + Monday schedule). `npm run test:mutation`.
- **Architecture Decision Records** (Section 8.2) -- `docs/decisions/` with MADR template. 6 backfilled ADRs: refs over state for canvas, CSS scroll-driven animations, prompt stuffing over RAG, sugar-high over shiki, next-view-transitions, react-markdown XSS safety.

## Not Planned (Rationale)

| Standard                        | Why Not Applicable                                                                                                     |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Circuit Breaker (4.1)           | Single downstream dependency (Cloudflare AI) with built-in platform resilience. Over-engineering for a portfolio site. |
| Saga Pattern (4.4)              | No distributed transactions. Single service architecture.                                                              |
| Multi-Tenant Isolation (6.3)    | Single-tenant portfolio site. No user data segregation needed.                                                         |
| Hexagonal Architecture (3.1)    | Frontend-heavy Next.js app. No service layer or domain logic complex enough to warrant ports/adapters.                 |
| Fuzz Testing (5.3)              | Low attack surface (one chat API endpoint with Zod validation). Cost/benefit doesn't justify AFL++/Jazzer setup.       |
| Rate Limiting/Bulkheading (4.5) | Rate limiting already implemented. No thread pools to bulkhead (serverless/edge runtime).                              |
