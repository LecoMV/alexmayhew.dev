# Blog Content Audit Results (2026-03-16)

**Status:** CURRENT
**Session:** Comprehensive audit of all 69 blog posts by 7 parallel agents
**Scope:** Technical accuracy, code correctness, cross-links, voice rules, factual claims

## Summary

69 posts audited across 5 series. 23 issues found (5 critical, 8 important, 10 minor).
All cross-links verified. All voice rules pass (after first-round fixes).

## Issues Found and Fixed

### Round 1 (Fixed)

| File                                  | Issue                          | Fix                                            |
| ------------------------------------- | ------------------------------ | ---------------------------------------------- |
| anatomy-of-high-precision-saas        | "Next.js 16" doesn't exist     | Changed to "Next.js 15"                        |
| ai-security-red-team-playbook         | "November 2026" future date    | Removed specific date                          |
| engineering-leadership-founder-to-cto | Double dashes in table         | Replaced with ellipsis                         |
| when-not-to-use-ai-coding             | "66%" unverified stat          | Changed to "majority" with Harness attribution |
| agentic-engineering                   | Stats missing attribution      | Added Pragmatic Engineer (n=906)               |
| agentic-engineering                   | "fastest ever" superlative     | Softened to "one of the fastest"               |
| 500k-architecture-mistake             | plan.price_cents on str type   | Fixed parameter type                           |
| ai-technical-debt-bomb                | Non-functional bash command    | Replaced with working command                  |
| production-mcp-servers                | Fictional @mcp/postgres-server | Changed to generic import                      |
| modern-frontend-architecture          | shadcn-ui CLI rename           | Updated to shadcn                              |
| tailwind-vs-component-libraries       | Same shadcn-ui rename          | Updated                                        |

### Round 2 (Fixed)

| File                                 | Issue                                         | Fix                                     |
| ------------------------------------ | --------------------------------------------- | --------------------------------------- |
| metr-paradox-ai-productivity         | Broken link /services/fractional-cto-services | → /services/fractional-cto-for-startups |
| senior-developer-paradox             | Queensland Health 16,000% wrong               | → 19,900%                               |
| atmospheric-animations-framer-motion | Fake presets API (presets.gentle)             | Remove/replace                          |
| multi-region-saas-architecture       | Speed of light 299,792 km/s in fiber          | → ~200,000 km/s                         |
| multi-region-saas-architecture       | Header comparison missing parseInt            | Add parseInt()                          |
| ai-code-review                       | "Amazon CodeWhisperer" outdated               | → "Amazon Q Developer"                  |
| ai-assisted-development-guide        | "GPT-3.5-turbo" deprecated                    | → "GPT-4o-mini"                         |
| tailwind-vs-component-libraries      | onFID outdated                                | → onINP                                 |
| rsc-edge-death-of-waterfall          | FID outdated                                  | → INP                                   |
| documentation-engineers-read         | Double dashes                                 | → ellipsis                              |
| multi-tenancy-prisma-rls             | "Tri-Color Algorithm" misnomer                | Rename section                          |
| database-query-optimization          | Supavisor "Rust-based" wrong                  | → "Elixir-based"                        |

## Cross-Post Consistency Issues (Verified Correct)

- **2.74x vs +322%**: Different sources (CodeRabbit vs separate study). Both correct.
- **"majority" vs specific %**: Standardized to "majority" (Harness source).
- **211M vs 150M+ GitClear lines**: Different report editions. Both used appropriately.
- **8x vs 8%**: 8x = code blocks duplicating adjacent code (narrow metric), 8% = overall copy-paste rate. Different metrics, correctly distinguished.

## Posts Verified Clean (No Issues Found)

- code-review-practices-scale
- first-engineering-team-playbook
- fractional-cto-vs-full-time
- ic-to-tech-lead
- technical-debt-strategy
- technical-hiring-framework
- incident-response-saas
- prompt-engineering-developers
- rag-architecture-saas
- vector-database-selection
- llm-cost-optimization-scale
- design-tokens-comprehensive
- optimistic-ui
- testing-react-server-components
- database-migration-patterns
- edge-computing-saas
- caching-strategies-production
- cdn-caching-strategy
- hidden-tax-supporting-both
- build-vs-buy
- component-api-design
- performance-engineering-playbook

## Known Minor Issues (Low Priority, Not Fixed)

- ESLint configs use legacy .eslintrc format (3 posts) — still functional
- Storybook configs use CJS format — still functional
- framer-motion package renamed to motion — import still works
- tailwind.config.js examples (site uses Tailwind 4 @theme) — readers may use Tailwind 3
- Some advisory claims lack external source attribution — correctly framed as experience
