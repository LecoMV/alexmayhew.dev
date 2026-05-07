# AGENTS.md — alexmayhew.dev

> Auto-discovered by Codex from project root. Authoritative project rules for any LLM operating on this repo.

## Project description

alexmayhew.dev — solo Technical Advisor / fractional-CTO portfolio + lead-generation engine. Hub-and-spoke content site (5 hub guides + 68 spoke posts as of 2026-05-03), 36 newsletter issues, programmatic-SEO surfaces (services / industries / integrations / migrations / technologies / comparisons). Zero-authority domain in active distribution-first sprint to reach Google entity-recognition threshold.

## Tech stack

- **Framework:** Next.js 15.5.x (App Router) + React 19 + TypeScript strict
- **Styling:** Tailwind 4 (`@theme` design tokens in `globals.css`) + Framer Motion (spring physics only)
- **Content:** MDX via Fumadocs, frontmatter-validated, hub-and-spoke architecture
- **Deploy:** OpenNext → Cloudflare Pages, GitHub Actions CI/CD (typecheck → lint → build → deploy → health → smoke)
- **Tests:** Vitest (unit, currently 1847 tests passing as of last green CI), Playwright (E2E)
- **Edge runtime:** Cloudflare Workers (`nodejs_compat`) — no `fs`/`path` in runtime code

## Build / test / lint commands

```bash
npm run dev                                # Local dev server (PORT=3001 — 3000 reserved for Memgraph)
SKIP_CF_DEV=1 PORT=3001 npm run dev       # Skip Cloudflare dev binding when iterating fast

npm run build                              # Full build (typecheck + lint + Next build)
npm run lint                               # ESLint only
npx vitest run                             # All Vitest unit tests
npm run test:coverage                      # Coverage report
npx playwright test                        # E2E suite
npm run validate                           # Full validation suite

curl -s https://alexmayhew.dev/api/health | jq    # Production health probe
```

## Coding standards (full detail in `.claude/CLAUDE.md`)

- **Strict TypeScript** — no `any`, explicit types/interfaces for props + DTOs
- **Server Components default** — only `'use client'` when browser API / state / event handler is genuinely needed
- **Server Actions for mutations** (React 19) — avoid `useEffect` for fetching, prefer async Server Components
- **External API responses** typed via Zod, no untyped `fetch`
- **Semantic HTML** (`<main>`, `<section>`, `<article>`, `<nav>`) — not div soup
- **Function length:** refactor at 50 lines
- **No fluff comments** — comment WHY, not WHAT
- **Design tokens only** — no Tailwind arbitrary values (`w-[350px]` etc.); use `@theme` tokens
- **Spring physics for motion** — never linear transitions
- **No shadows** — `border border-white/10` instead. Max `rounded-md` (neo-brutalist aesthetic)
- **Typography:** JetBrains Mono headers/data, Inter body
- **Accent color:** `text-cyber-lime` (#CCF381) for CTAs / focus / interactive
- **Background:** `bg-void-navy` (#0B0E14) — never pure black

## Content rules (MDX)

- **Frontmatter `category`:** one of `engineering`, `architecture`, `business`, `frontend`, `infrastructure`
- **Hub posts** require `isHub: true`. Spoke posts require `series: "<cluster-key>"` in kebab-case.
- **Featured image** required: `public/images/blog/{slug}-featured.webp`. Verify before pushing.
- **Voice (alex-voice skill):** technical precision, direct/authoritative, dense, contrarian when warranted. Never: emojis, hedging, exclamation points, "game-changer", "perhaps/maybe", "just/simply", em dashes (use ellipsis instead).

## Critical safety (the Red Line)

- **Deployment:** NEVER deploy manually. Push to GitHub triggers CI which deploys. Run `npm run build` locally first.
- **Database:** No DROP / TRUNCATE / DELETE-without-WHERE without backup confirmation.
- **Branch hygiene (DORA — locked 2026-05-01):** branches >20 commits ahead of main get a CI warning. Don't sit on a branch for 25 days again — that's how `audit-sprint-1-p0-fixes` got 86 commits deep before merge.
- **Secrets:** No hardcoded tokens. `pass show claude/<service>/key` for everything. Never commit `.env` files.
- **Postiz / Listmonk are GONE** (purged 2026-04-30). Newsletter is on Beehiiv (commit `1108678`). Do not call Postiz `/api/integrations` or restart `postiz-*` services — they don't exist.

## Codex-specific rules (Pro x20, GPT-5.5, xhigh)

**Source of truth:** `~/.claude/rules/codex-best-practices.md`. Read before non-trivial Codex use.

1. **Default model + reasoning:** `gpt-5.5` + `xhigh` + `service_tier=fast` (set in `~/.codex/config.toml`). Don't down-tier on Pro x20 — quota is ample (375-2000 messages / 5h).
2. **Long prompts via stdin only.** `cat prompt.md | codex exec --profile audit-review` works. `"$(cat prompt.md)"` HANGS at >2KB.
3. **The 4-ingredient prompt** (every Codex invocation): **Goal** / **Context** / **Constraints** / **Done when**. Skipping any of the four = wrong-problem solutions, invented verifications, premature "done."
4. **Profiles in `~/.codex/config.toml`:** `audit-review` (xhigh + fast + workspace-write) for spec/plan/audit/full-diff. `code-review` (xhigh + fast + read-only) for per-commit review. `brainstorm` (xhigh + fast + read-only) for exploration.
5. **Use `codex review` over `codex exec` for local code review** — purpose-built, structured output, separate quota counter.
6. **`codex cloud exec --attempts 3`** for hard architectural decisions — best-of-N parallel candidates, no summary-trust problem.
7. **Test-First Verification** for implementation: tests first → fail → commit → implement → re-run.
8. **NO subagents on either side by default** (Pattern A — locked 2026-05-03). Single-thread inline by Claude controller + Codex review at every gate. Subagents banned for write work; allowed only as POST-OTC read-only experiment with primary-source verification.

### Trigger patterns — when Codex review is mandatory before "done"

- Edits in `src/auth/**`, `src/billing/**`, `**/migrations/**`, `**/.env*`, `**/secrets/**`, `infra/**`, `**/deploy/**`, `**/policy/**`
- Schema changes (anything in `src/data/pseo/types.ts`, `JsonLd*` components, sitemap generators)
- CSP/security headers in `src/middleware.ts` or `custom-worker.js`
- Any change to `.github/workflows/*` that affects deploy, secret handling, or CI gates
- Any merge of >20 commits to main

For these: `git diff origin/main..HEAD | codex exec --profile audit-review` BEFORE saying "done."

## The 4-ingredient prompt — keep this on hand

Every Codex invocation must include:

1. **Goal** — outcome statement, not steps. Bad: "open file, change line." Good: "ensure rate limiter blocks 11th request from same IP in 60s window."
2. **Context** — files, errors, examples. Use `@file` mentions or absolute paths.
3. **Constraints** — what NOT to do. Architectural rules. Existing conventions. Safety requirements.
4. **Done when** — the verifiable end state. Tests pass. Behavior observable. Specific checklist met. Never implicit.

## Issue tracking

Beads (`bd` CLI + `mcp__beads__*` MCP). Project DB at `.beads/beads.db`. Workflow:
- `bd ready` — top of queue at session start
- `bd show <id>` / `bd update <id>` to claim → `in_progress`
- `bd close <id> --reason "<file:line or commit SHA + verification evidence>"` per `~/.claude/rules/beads-closure-discipline.md`. No "done" reasons.

## Multi-LLM content pipeline (route by strength) — for Tier 1/4 assets

Per `docs/research/multi-llm-content-workflow-2026-05-01.md`:

1. **Gemini 3.1 Pro Deep Research** — research input gathering (browser agentic mode)
2. **Human evidence brief** — Alex compiles evidence ledger (irreducible, 1-2 hrs)
3. **Claude Opus 4.7** — first draft (long-form prose lead, EQ-Bench Creative 2216 vs GPT-5.5 2024)
4. **Codex (GPT-5.5 xhigh)** — voice audit against `alex-voice-review-checklist.md` (cross-model catches drift)
5. **Claude** — incorporate Codex feedback
6. **Codex** — fact-check pass (catches hallucinations)
7. **Human POV rewrite** — claims, examples, caveats — don't let models invent authority
8. **Schema + structure pass** — `DefinedTermSet` (taxonomies), `Dataset` (benchmarks), claim blocks, comparison tables. **Drop FAQ schema as primary** (Google limits FAQ rich results to gov/health 2026).

Time targets (multi-LLM stack): hub 6-9 hrs, service page 1.5-2 hrs, original-research 12-16 hrs.

## Active sprint — Distribution-First (epic `vk-5ufs`)

13 sub-tasks. Codex-validated `Path C` order (locked 2026-05-01):

1. **Trust PR first** — D9 (branch-staleness CI guard) + D10 (Lighthouse CI + CSP Evaluator + Schema Validator gates) ship as a tiny PR. Validates the regression battery on a clean main BEFORE the big merge.
2. **D1 — merge `audit-sprint-1-p0-fixes` to main** — 86 commits / 421 files / 29K insertions / 3.6K deletions. PR + squash + CI gate.
3. **D11 + D12 + D13** in parallel (rails: codify content framework, split alex-voice, evidence-ledger + distribution-checklist templates) with **D2 + D3 + D4** (production hygiene: TOPIC_CLUSTERS slug bug fix, expand 5 thin pSEO pages to 800-1,200 words, priority sitemap Tier 1).
4. **D5** — expand existing `/ai-assisted-development-generative-debt` URL into "AI Technical Debt: A Working Taxonomy" — pilots multi-LLM pipeline. Layered model (code → codebase → people → parent), NOT 4-peer model. Original evidence required.
5. **D7** — distribution sprint runs in parallel from here (MentionMatch / Featured.com / Modern CTO Podcast / quotable benchmark asset). Dev.to deprioritized (Google ignores canonical when DA gap is large).

## Repository hygiene

- **Always trust:** add this repo to `~/.codex/config.toml` `[projects."/home/deploy/projects/amdev/alexmayhew-dev"] trust_level = "trusted"` so Codex doesn't repeatedly prompt for approval.
- **AGENTS.md changes** require thinking about which other LLMs read it (Codex auto-discovers; Claude Code reads `.claude/CLAUDE.md`). Keep both authoritative for their tool surface.
- **MEMORY.md** at `~/.claude/projects/-home-deploy-projects-amdev-alexmayhew-dev/memory/MEMORY.md` is auto-loaded into Claude Code sessions. Keep it current.

## When in doubt

Three reflexes per `~/.claude/rules/codex-best-practices.md` section "When in doubt":

1. argv expansion of large prompt → switch to stdin
2. wrong reasoning_effort → bump to xhigh
3. underspecified prompt → add the missing of the 4 ingredients

Don't blame Codex. Verify these first.
