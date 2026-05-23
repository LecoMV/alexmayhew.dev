# Claude Code Power-User Integrations Survey (2026-04-30)

**Status:** CURRENT
**Session:** Daily Claude Code user (Opus 4.7, 1M context, 41 plugins, 17 MCP servers) wants to identify the highest-leverage additions that durably pay back. Targeting alexmayhew.dev development workflow + voice-clone (VoiceKeep) backend. April 2026 only.
**Sources:** 28 sources across WebSearch + Reddit MCP context. Cross-referenced against the user's existing tooling roster.

---

## Executive Summary — The Five Things That Matter Most

1. **Tool Search is already on (v2.1.7+).** The "too many MCP servers" problem is largely solved — Claude Code defers MCP tool definitions and uses a search index when they exceed 10% of context. Internal benchmarks: Opus 4.5 accuracy on MCP evals jumped 79.5% → 88.1% with Tool Search. The user's 17 servers are not as expensive as 2025-era articles suggest — but only if they're actually deferred (verify with `/context` and watch the MCP overhead line). [9][14][15]
2. **Sentry MCP (remote OAuth) is the single highest-ROI add** for this user. They use Sentry. They had a recent quota incident. The MCP gives Claude Code the stack trace, event tags, and Seer analysis without leaving the terminal. Read-only, OAuth, zero install. [3]
3. **Cloudflare's official MCP (`mcp.cloudflare.com`) replaces a lot of `wrangler` + `curl` workflows.** Workers, Pages, R2, KV, D1, DNS — 25 typed tools across product-specific endpoints, OAuth auth, no API keys to manage. This is a clear durable win for a Cloudflare-deployed site. [2][27]
4. **Drop `compound-engineering` from the disabled list and re-enable it for this codebase.** It's the dominant plan-and-review workflow in the Claude Code community in 2026 (Every Inc.'s plugin, used by Kieran Klaassen and Dan Shipper as primary plan mode). 12 subagents do parallel review from different perspectives — this is what the user already wants from their custom agent roster. [28]
5. **`claude-context` (Zilliz) for semantic code search is the single biggest unblocker** if the user finds themselves repeatedly grepping the same large codebases. ~40% token reduction by replacing "load entire directory" with vector search over BM25 + dense embeddings. Requires a Milvus/Zilliz Cloud DB though — friction is real. [25]

---

## Top 10 Recommendations — Ranked by ROI

Scoring: **Effort** (1=trivial, 5=hard) | **Durable Value** (1=marginal, 5=transformative) | **Pain Replaced** (1=none, 5=major existing friction)

### 1. Sentry MCP (remote OAuth)

**Effort 1 | Value 5 | Pain 5 | ROI: 13/15** [3][20]

```bash
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
# OAuth flow on first tool call
```

**Why:** User runs Sentry on alexmayhew.dev + voice-clone. Recent quota incident (memory note) means Claude could already have triaged it via this MCP. Read-only, so safe. Pulls full stack traces, event details, tags, Seer analysis. Replaces "open Sentry tab → copy URL → paste in chat" loop. Hosted by Sentry — nothing to install, no API keys.

### 2. Cloudflare MCP (official, remote)

**Effort 1 | Value 5 | Pain 4 | ROI: 12/15** [2][27]

```json
// Add to .mcp.json
{
	"mcpServers": {
		"cloudflare": { "type": "http", "url": "https://mcp.cloudflare.com/mcp" }
	}
}
```

**Why:** alexmayhew.dev is OpenNext → Cloudflare Pages. voice-clone uses Cloudflare. The user already does `wrangler` + `curl` for Workers/R2/KV inspection. The official MCP exposes 25 typed tools (worker*list/get/put/delete, kv*_, r2\__, D1, Hyperdrive) plus a Code Mode server for the full 2,500-endpoint Cloudflare API. OAuth scoped, no API token in env. **Note:** confirm it doesn't bloat context — defer test with `/context` after install.

### 3. compound-engineering plugin (re-enable)

**Effort 1 | Value 5 | Pain 3 | ROI: 12/15** [28]

```bash
# Re-enable in .claude/settings.local.json:
{ "enabledPlugins": { "compound-engineering@compound-engineering": true } }
```

**Why:** User has it disabled globally per `disabled-plugins.md`. But in the Claude Code community in 2026, this is _the_ plan-and-review workflow. 12 subagents review code in parallel from different perspectives (security, performance, overbuild, etc.). Captures learnings to `docs/solutions/` so knowledge compounds. The user already has a custom 17-agent roster — compound-engineering is a more battle-tested take on the same idea. Test it for 1 week on a feature branch. If it duplicates the custom roster, disable again.

### 4. claude-context (Zilliz semantic code search)

**Effort 3 | Value 5 | Pain 4 | ROI: 11/15** [25]

```bash
# Requires Zilliz Cloud account (free tier OK) + OpenAI key
claude mcp add claude-context \
  -e OPENAI_API_KEY=sk-... \
  -e MILVUS_ADDRESS=your-zilliz-endpoint \
  -e MILVUS_TOKEN=your-zilliz-token \
  -- npx @zilliz/claude-context-mcp@latest
```

**Why:** User has voice-clone (large FastAPI + Next.js codebase) and 5 hub guides + 39 spoke posts in alexmayhew.dev. Repeated grep for "where is the X handler?" gets expensive. claude-context's hybrid BM25 + dense vector search shows ~40% token reduction in benchmarks. Friction: requires Milvus/Zilliz infrastructure (Zilliz Cloud has a generous free tier). Worth it if your codebase exceeds 50k LOC.

### 5. Re-enable `xhigh` effort + leverage `/ultrareview` (free, Opus 4.7)

**Effort 0 | Value 5 | Pain 3 | ROI: 13/15** [22][23]

**Why:** Opus 4.7 (live in Claude Code since 2026-04-16) defaults to xhigh effort and ships `/ultrareview`. The user's settings show effort=high. Bumping to xhigh is a 1-line change with no install cost — it makes Claude reason longer on hard problems. `/ultrareview` is the new official "review this PR/code with extreme rigor" command. Both are already paid for.

### 6. Linear MCP (only if migrating off Beads)

**Effort 1 | Value 4 (conditional) | Pain 2 | ROI: 7/15** [4]

```bash
claude mcp add --transport http linear-server https://mcp.linear.app/mcp
```

**Why conditional:** User runs Beads (good — file-based, free, no vendor). Linear MCP is excellent (official, 2025-launched, OAuth, full CRUD on issues/projects/comments) — but only if there's a _reason_ to migrate. **Recommendation: don't add yet.** Beads suits a solo operator. Revisit if onboarding teammates or if MARKETING_PLAN_2026 work needs cross-functional ticketing.

### 7. Beehiiv MCP (read-only v1)

**Effort 1 | Value 3 | Pain 2 | ROI: 6/15** [26]

```bash
# Per beehiiv docs (March 2026 launch — first newsletter MCP)
# Add to .mcp.json with API key from beehiiv dashboard
```

**Why:** User just migrated newsletter Listmonk → Beehiiv (per recent commit `1108678`). Beehiiv launched native MCP March 2026 — query subscriber data, revenue, churn, SEO via natural language. Currently read-only (v1). Useful for monthly newsletter analytics review, not daily work.

### 8. Resend MCP (official, stdio)

**Effort 1 | Value 3 | Pain 1 | ROI: 5/15** [16]

```bash
claude mcp add resend -e RESEND_API_KEY=re_... -- npx -y resend-mcp
```

**Why:** User uses Resend for transactional email. The MCP supports send/list/get/cancel/update/batch_send + inbound email reading + attachment download. ROI is low because daily dev work rarely needs to send an email — but if you ever need to dry-run a transactional template, it's faster than `curl` to the API.

### 9. ast-grep MCP (community)

**Effort 2 | Value 3 | Pain 2 | ROI: 7/15** [11]

```bash
# Community MCP — wraps ast-grep CLI for AST-aware structural search
# https://github.com/ast-grep/ast-grep-mcp
```

**Why:** AST pattern matching catches what regex misses (e.g., "find all `useEffect` calls without dependency arrays" or "find all `try/catch` that swallow errors"). The user's codebase has explicit anti-patterns in CLAUDE.md (no `any`, no fluff comments, lazy="raise" on SQLAlchemy). ast-grep enforces these structurally. **But:** the user already has the `code-simplifier` and `code-reviewer` plugins. Marginal addition. Install only if writing a lot of TypeScript refactors.

### 10. Skill: `using-git-worktrees` + agent-teams workflow refresh

**Effort 1 | Value 4 | Pain 3 | ROI: 8/15** [21][24]

**Why:** User has `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` enabled but the memory file doesn't show heavy use. The Claude Code v2.1.50+ first-class worktree support + agent teams is a real productivity win for parallel work. The pattern from 2026 best practices: **3-4 active worktrees, 3-5 teammates, with a dedicated validator agent**. Use cases that justify it: multi-perspective debugging, cross-layer features, batched migrations (e.g., updating 50 files from old to new API pattern). The user already had a 15-agent audit and 20 commits worth of Wave K shipping — this is the natural next step.

---

## Per-Category Survey

### A. Code Intelligence / Search

| Tool                          | Verdict                                                                                            |
| ----------------------------- | -------------------------------------------------------------------------------------------------- |
| **`claude-context` (Zilliz)** | **WINNER for >50k LOC repos.** Hybrid semantic + BM25, ~40% token reduction. Needs Milvus DB. [25] |
| ast-grep MCP                  | Runner-up. Excellent AST pattern matching for refactors. Lower ROI given existing plugins. [11]    |
| Semgrep MCP                   | Security-focused. Overlap with security-guidance plugin. Skip. [11]                                |
| Code Pathfinder MCP           | Niche; CodePathfinder.dev — solid for graph-based code analysis but enterprise-y. Skip.            |
| Grep MCP (mcp.directory)      | Just `grep` over MCP — no value over native Bash. Skip.                                            |

### B. Cloud + Infrastructure

| Tool                          | Verdict                                                                                                  |
| ----------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Cloudflare MCP (official)** | **WINNER.** Replaces wrangler+curl. OAuth, 25 typed tools, full 2500-endpoint API via Code Mode. [2][27] |
| Vercel MCP (official)         | Skip — user is on Cloudflare Pages, not Vercel. [17]                                                     |
| Datadog MCP                   | Skip — user uses Sentry (free tier), not Datadog. [13]                                                   |
| Grafana MCP                   | Skip — not running Grafana. Worth knowing if dashboards get added. [13]                                  |
| Honeycomb MCP                 | Skip — same reason.                                                                                      |
| Kubernetes MCPs               | N/A — user not on K8s.                                                                                   |
| Terraform MCPs                | N/A — user not using Terraform.                                                                          |

### C. Database

| Tool                                     | Verdict                                                                                                                                                                                |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Neon Postgres MCP (remote OAuth)**     | **WINNER if voice-clone uses Neon.** 20 tools, branch-based migrations, query tuning. Replaces `psql` + manual EXPLAIN. Note: stdio version deprecated Feb 2026, use remote only. [12] |
| Postgres MCP (official MCP servers repo) | Generic Postgres alternative if not Neon. Plain SQL only.                                                                                                                              |
| Redis MCP                                | Skip unless heavy Redis work. User uses Redis (port 6379/6380) but not for daily Claude work.                                                                                          |
| MongoDB / MySQL / SQLite MCPs            | N/A.                                                                                                                                                                                   |
| pgvector MCPs                            | Niche — overlaps with vector memory research. Skip.                                                                                                                                    |

### D. Browser Automation

| Tool                 | Verdict                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Already optimal.** | User has Playwright MCP + claude-in-chrome. That covers ~95% of needs. [18]                                    |
| Browserbase MCP      | Only if user needs cloud-parallel browser sessions (e.g., testing 5 browsers concurrently). Skip for now. [18] |
| Selenium MCP         | Skip — Playwright supersedes.                                                                                  |
| Puppeteer MCP        | Skip — Playwright wraps Puppeteer's better successor.                                                          |

### E. Issue Tracking / PM

| Tool                     | Verdict                                                             |
| ------------------------ | ------------------------------------------------------------------- |
| **Beads (current)**      | Keep. Solo-operator-friendly, file-based, free. [4]                 |
| Linear MCP               | Add only if migrating from Beads. Official server is excellent. [4] |
| Notion MCP (official)    | Add only if Notion is a primary doc system (it isn't here). [4]     |
| Jira MCP                 | N/A — user not on Jira.                                             |
| ClickUp / Asana / Monday | N/A.                                                                |

### F. Communication

| Tool                      | Verdict                                                 |
| ------------------------- | ------------------------------------------------------- |
| **Resend MCP (official)** | **Add but low priority.** Already in user's stack. [16] |
| Gmail MCP                 | Skip unless email is a daily dev tool (it isn't).       |
| Slack MCP (official)      | Skip unless user is on Slack — currently not in stack.  |
| Discord / Teams MCPs      | N/A.                                                    |

### G. AI/ML Augmentation

| Tool                            | Verdict                                                                                                                                                                                                                                                                            |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **HuggingFace MCP**             | **Already installed.** Good.                                                                                                                                                                                                                                                       |
| Ollama MCP (delegation pattern) | **Interesting — defer.** "OllamaClaude" pattern lets Claude delegate grunt work to local Gemma3/Mistral, ~98% token savings on file-aware tasks. User has the hardware (i9-12900K + RTX 3080). But: adds workflow complexity. Try only if API costs become a real constraint. [19] |
| Replicate MCP                   | Skip — narrow use case (image/audio gen models).                                                                                                                                                                                                                                   |
| LangChain/LangGraph MCPs        | Skip — Claude Code is the orchestration layer; LangChain duplicates that role.                                                                                                                                                                                                     |

### H. Knowledge / Research

| Tool                             | Verdict                                                                                                            |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Context7 (already installed)** | **Keep — auto-loaded for library docs.** Good.                                                                     |
| Wolfram Alpha MCP                | Skip unless doing math-heavy work. [29]                                                                            |
| arXiv / paper-search MCP         | Add if doing AI/ML research. User does some — install as a _skill_ (not MCP) so it's only loaded when needed. [29] |
| Wikipedia / Wikidata MCPs        | Skip — WebSearch covers this.                                                                                      |

### I. Productivity

| Tool                               | Verdict                                                                                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Google Calendar MCP                | **Skip.** Calendar work is rarely interleaved with Claude Code. The "schedule a meeting from a chat" workflow doesn't pay back daily. [30] |
| Time tracking / Toggl / RescueTime | Skip — not the kind of friction Claude solves.                                                                                             |

### J. Specialized Dev Tools

| Tool                      | Verdict                                                                                                                                                    |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Stripe MCP (official)** | **Add if VoiceKeep monetization is active.** 133 actions including create/update customers, manage subscriptions, refunds. OAuth + API key options. [4][8] |
| **Sentry MCP**            | **#1 add — see top 10.** [3]                                                                                                                               |
| **Cloudflare MCP**        | **#2 add — see top 10.** [2][27]                                                                                                                           |
| Vercel MCP                | Skip — wrong platform.                                                                                                                                     |
| Railway / Fly.io MCPs     | Skip — wrong platform.                                                                                                                                     |

---

## Power-User Techniques (Not Integrations)

### 1. Hooks That Pay Back

The user's `pre-bash-guard.sh`, `format-file.sh`, and `tdd-guard` setup is already strong. Additions worth making:

- **SessionStart hook to dump `bd ready` + `git status` + last 3 commits** automatically into context. Eliminates the manual "remind me what's open" step. Pattern from disler/claude-code-hooks-mastery and Anthropic's blog. [5][6]
- **PreCompact hook with `async: true`** (released Jan 2026) to snapshot session state to memory-keeper before compaction without blocking Claude. The `async: true` flag is critical — it prevents the hook from slowing Claude down. [5][6]
- **Stop hook that updates `MEMORY.md` if the conversation produced a new feedback memory.** This is what the agent persistent memory system _already_ enables — make it semi-automatic.
- **Conditional hooks (`if` field, v2.1.85+)** filter when hooks run by file pattern. Use this to make `format-file.sh` ONLY run on `*.ts`/`*.tsx`, not on every Edit. [22]

### 2. Skills Marketplaces Beyond What's Installed

- **`hesreallyhim/awesome-claude-code`** — the canonical curated list. New entries since user last looked: `cc-tools` (Go-based hooks utility for high-perf linting/testing/statusline), Panaversity's agent teams exercises. [24]
- **`anthropics/skills`** — official public repo of agent skills. Worth `git pull`-ing periodically. [10]
- **EveryInc's `compound-engineering` repo** — ships with 29 specialized agents, 24 commands, 21 skills as a complete plug-in. [28]

### 3. Agent Teams Workflow (User Has the Flag)

Best practices from 2026: [21]

- **Team size: 3–5 teammates.** Below 3 = sequential is faster. Above 5 = coordination overhead dominates.
- **Token cost scales 3–4x** vs sequential. Worth it when a 3-hour sequential job becomes a 1-hour parallel job.
- **Strongest use cases:** competing-hypothesis debugging, cross-layer features (frontend+backend+tests), batched migrations.
- **Always include a validator agent.** Either a dedicated review agent before merge OR explicit integration tests after all parallel work completes. Without this, you ship interface mismatches.
- **Don't use for sequential or same-file work.** A single session beats a team there.

### 4. Worktrees + Parallel Agents

v2.1.50 ships first-class worktree support. [24]

- 3–4 active worktrees max — beyond that, memory bloat and focus loss kick in.
- One worktree per feature branch. Different subagents in different worktrees (e.g., one on architecture, one on testing).
- The killer pattern: **batched migrations.** Update 50 files from old API pattern to new — spawn 5 agents, 10 files each, in parallel worktrees. Time: hours → minutes.

### 5. /loop and Cron Patterns

The user's hardware can run agents 24/7. From 2026 patterns: [7][20]

- **Short intervals (10–30 min):** monitoring tasks (health checks, error detection, build status).
- **Long intervals (hours/days):** retry workflows after deps update, weekly content audits, monthly schema drift checks.
- **Hard limits:** 50 scheduled tasks per session, 3-day auto-delete, only fires while Claude Code idle. **Don't trust it for SLA-critical work.**
- **Headless workflows** with `--dangerously-skip-permissions` (use carefully): event-triggered, fully autonomous until stop condition. Pattern from Ralph autonomous loops.

### 6. 1M Context Workflows (Opus 4.7 Specific)

Workflows that ONLY work with 1M context: [22][23]

- **Whole-codebase refactors** without compaction (small-to-medium repos, ~200k LOC fits comfortably).
- **Multi-file analysis sessions** that span an entire feature area without forgetting earlier context.
- **Long agent runs** (4–8 hours) where compaction would lose architectural decisions made in hour 1.
- The user has `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=80` — keep it. Don't manually compact before 70%.

---

## Anti-Patterns and Waste

### Anti-Pattern 1: "More MCP servers = more capability"

**Reality (2026):** With Tool Search auto-active, the marginal cost of an unused MCP server is low — but when actively used, each adds friction in tool selection. Each new server must justify itself with **at least weekly use**. [9][14][15]

**Servers to scrutinize on the user's current 17-server list:**

- **`tavily`** — plan exceeded since 2026-03-12 per env. **Remove or replace.**
- **`nimble-mcp-server`** — currently disconnected per task brief. **Reconnect or remove.**
- **`flights-mcp`** — TEST MODE only, almost certainly unused. **Remove.**
- **`linkedapi`** — does the user actually call it? If not weekly, **remove**.
- **`apollo`, `instantly`** — sales/CRM tools. If alexmayhew.dev's lead-gen isn't active, **remove until it is**.

Estimated savings if 3-5 servers removed: lower friction in `/mcp` listings, less surface area for drift/auth issues, no token impact (Tool Search handles that).

### Anti-Pattern 2: 41 plugins is borderline

**41 plugins enabled.** Reality: [10]

- The 33 Anthropic-built ones are essentially free (auto-active when relevant).
- Knowledge-work plugins (finance, legal, sales, etc.) are activated by slash commands — zero idle cost.
- The voltagent suites (data-ai, biz, meta) are _already disabled_ per user's `disabled-plugins.md`.
- 41 is fine _as long as_ the user doesn't enable everything in `compound-engineering`'s 27 agents on top. Per the user's disabled list, that's already off.

**Recommendation:** keep 41. The bottleneck isn't plugin count — it's whether each one's invocation surface (slash commands, auto-activation) clutters the `/help` output.

### Anti-Pattern 3: Re-enabling `compound-engineering` AND running 17 custom agents

User's custom agent roster (9 audit + 8 implementation, all Opus, all persistent memory) overlaps with compound-engineering's 27 agents. **Don't run both simultaneously without auditing for duplication.** Test compound-engineering on one feature branch, decide which to keep.

### Anti-Pattern 4: Sequential thinking MCP overhead

The MCP forces structured "thinking blocks" — useful for hard problems, **but** Opus 4.7 already has `xhigh` and `max` effort tiers built-in. Sequential thinking duplicates this. With 4.7 + xhigh, the user can probably **remove `sequential-thinking` MCP** entirely. [22]

### Anti-Pattern 5: Don't install Wolfram/Cal/calendar if you don't already use them

Calendar MCPs sound great in theory. In practice the workflow "Claude, schedule a meeting" rarely happens during dev sessions. ROI is near-zero unless calendar IS your daily tool. Skip. [30]

### Anti-Pattern 6: Don't install MCPs duplicated by Claude Code internals

- `Filesystem MCP` — Claude Code already has Read/Write/Edit/Glob built in. Don't add a second filesystem layer. [1]
- `Grep MCP` — same. Native Bash + Grep tool covers it.

---

## Month-by-Month Rollout Plan

### Month 1 (May 2026) — High-ROI, Zero-Risk Adds

**Week 1:**

- [ ] Install **Sentry MCP** (`claude mcp add --transport http sentry https://mcp.sentry.dev/mcp`). Use it on next Sentry-flagged issue end-to-end.
- [ ] Install **Cloudflare MCP** (`mcp.cloudflare.com` in `.mcp.json`). Use it for next Pages/Workers task.
- [ ] Run `/context` — verify Tool Search is active and MCP overhead is <10%.

**Week 2:**

- [ ] **Re-enable `compound-engineering`** for one feature branch. Compare against custom agent roster on a real PR. Decide which workflow wins.
- [ ] Bump effort to `xhigh` in settings, try `/ultrareview` on 2-3 PRs.

**Week 3:**

- [ ] **Audit and prune MCP servers.** Remove `tavily` (plan exceeded), `flights-mcp` (test mode), `nimble-mcp-server` (disconnected). Decide on `linkedapi`/`apollo`/`instantly`.
- [ ] Test **conditional hooks** (`if` field) on `format-file.sh` to scope it to TS files only.

**Week 4:**

- [ ] Implement **SessionStart hook** that dumps `bd ready` + `git status` to context.
- [ ] Implement **PreCompact hook with `async: true`** snapshotting state to memory-keeper.

**Expected outcome end of month 1:** Sentry/Cloudflare workflows feel native. compound-engineering integrated or rejected. Server roster trimmed. Hooks reduce repetitive prompting.

### Month 2 (June 2026) — Workflow Upgrades

**Week 1-2:**

- [ ] Pilot **agent teams** on a real cross-layer feature (e.g., a VoiceKeep backend+frontend+test feature). Team of 3 + a validator agent. Track time vs single-agent baseline.
- [ ] Adopt **`using-git-worktrees` skill** + run a batched migration (e.g., the ~500 em dash violations from Plan 3 of the 15-agent audit) across 5 worktrees.

**Week 3:**

- [ ] If alexmayhew.dev/voice-clone code volume justifies it: install **`claude-context`** (Zilliz). Set up free tier Milvus, index voice-clone backend. Compare grep ROI before/after.

**Week 4:**

- [ ] Evaluate **Stripe MCP** if VoiceKeep monetization is active. Otherwise skip until it is.
- [ ] Evaluate **Beehiiv MCP** for monthly newsletter analytics review.

**Expected outcome end of month 2:** Parallel workflows for migrations and cross-layer features are routine. Code search moves from grep to semantic where it matters.

### Month 3 (July 2026) — Optimization & Audit

**Week 1:**

- [ ] **Custom audit:** which MCP servers/plugins added in months 1-2 are actually being used weekly? Remove the rest.
- [ ] Custom skills audit — does `compound-engineering` still pay back, or is custom roster better? Pick one.

**Week 2:**

- [ ] Implement **/loop or Cron-scheduled** weekly tasks (e.g., schema drift check, weekly Sentry digest review, content audit).
- [ ] Try **Ollama delegation pattern** if API costs are a real concern. Otherwise skip.

**Week 3-4:**

- [ ] Capture all learnings into `docs/research/claude-code-power-user-integrations-2026-04-30.md` (this doc) as updates.
- [ ] Update `MEMORY.md` with new feedback memories from the rollout.

**Expected outcome end of month 3:** A lean, high-leverage Claude Code setup. Documented lessons on what worked and what didn't.

---

## Conflicting Information Notes

- **Token bloat severity:** 2025-era articles cite 60–77k tokens of MCP overhead — this is **outdated post-Tool Search** (Jan 2026). Current reality is ~8k tokens with deferred loading. Some 2026 articles still recycle the old numbers — verify with `/context` on your own setup. [9][14][15]
- **Disabled MCP servers and context:** GitHub issue #11370 claims disabled servers still load schemas. Anthropic's response (per scottspence.com): they don't anymore, since Tool Search shipped. **Verify on your install.** [14][15]
- **"Best of 2026" listicles** (claudefa.st, codeagentswarm.com, apidog.com, etc.) heavily overlap and recycle each other. They're consensus-low, marketing-high. Treat as discovery starting points, not authoritative. [1]

## Gaps / What I Couldn't Verify

- Exact context overhead of _each_ MCP server in 2026 with Tool Search active — would require live `/context` measurement on the user's specific install.
- Whether `compound-engineering` and the user's custom 17-agent roster _truly_ duplicate functionality — only a side-by-side trial on a real PR will tell.
- Reddit-specific power-user opinions (search returned no results for tight 2026 queries) — could fill via Reddit MCP if needed.
- Whether VoiceKeep is actively billing customers (would gate Stripe MCP recommendation).

---

## Sources

1. [50+ Best MCP Servers for Claude Code in 2026 — claudefa.st](https://claudefa.st/blog/tools/mcp-extensions/best-addons) — Comprehensive listicle covering GitHub, Sequential Thinking, Playwright, Postgres, Filesystem, Apidog, Notion. Recycled material but useful as discovery.
2. [Cloudflare's own MCP servers — Cloudflare Agents docs](https://developers.cloudflare.com/agents/model-context-protocol/mcp-servers-for-cloudflare/) — Official documentation of Cloudflare's API MCP and product-specific servers (mcp.cloudflare.com + \*.mcp.cloudflare.com).
3. [Sentry MCP Server — Sentry Docs](https://docs.sentry.io/ai/mcp/) — Official Sentry MCP install and capability docs. Read-only, OAuth, hosted at https://mcp.sentry.dev/mcp.
4. [Connect Claude Code to tools via MCP — Claude Code Docs](https://code.claude.com/docs/en/mcp) — Official Anthropic docs on MCP integration. Linear, Slack, Notion config examples.
5. [Claude Code Hooks: Complete Guide to All 12 Lifecycle Events — claudefa.st](https://claudefa.st/blog/tools/hooks/hooks-guide) — Hooks lifecycle reference. async: true patterns for PreCompact.
6. [Claude Code power user customization: How to configure hooks — Anthropic blog](https://claude.com/blog/how-to-configure-hooks) — Anthropic-authored hooks guide.
7. [Run prompts on a schedule — Claude Code Docs](https://code.claude.com/docs/en/scheduled-tasks) — Official /loop and Cron docs. 50-task limit, 3-day auto-delete.
8. [Stripe MCP Integration with Claude Code — Composio](https://composio.dev/toolkits/stripe/framework/claude-code) — Stripe MCP capabilities (133 actions: customers, subscriptions, refunds).
9. [Claude Code Just Cut MCP Context Bloat by 46.9% — Joe Njenga, Medium](https://medium.com/@joe.njenga/claude-code-just-cut-mcp-context-bloat-by-46-9-51k-tokens-down-to-8-5k-with-new-tool-search-ddf9e905f734) — Measured 51k → 8.5k token reduction with Tool Search.
10. [anthropics/claude-plugins-official — GitHub](https://github.com/anthropics/claude-plugins-official) — 101 plugins, 33 Anthropic-built + 68 partner. Includes feature-dev, code-review, security-guidance, frontend-design.
11. [Best MCP Servers for Claude Code — Toolradar](https://toolradar.com/blog/best-mcp-servers-claude-code) — ast-grep MCP, Semgrep MCP details. Also Sentry, Datadog.
12. [Get started with Claude Code and Neon Postgres MCP Server — Neon docs](https://neon.com/guides/claude-code-mcp-neon) — 20-tool Neon Postgres MCP. Stdio deprecated Feb 2026, remote OAuth recommended.
13. [MCP server for Grafana — grafana/mcp-grafana GitHub](https://github.com/grafana/mcp-grafana) — Grafana MCP capabilities (dashboards, Loki, Prometheus, Tempo).
14. [Optimising MCP Server Context Usage in Claude Code — Scott Spence](https://scottspence.com/posts/optimising-mcp-server-context-usage-in-claude-code) — Per-server context measurement guidance.
15. [Claude Code MCP Tool Search: Save 95% Context — claudefa.st](https://claudefa.st/blog/tools/mcp-extensions/mcp-tool-search) — Tool Search detailed docs. 10% threshold, accuracy improvements (49% → 74% Opus 4; 79.5% → 88.1% Opus 4.5).
16. [resend/resend-mcp — GitHub](https://github.com/resend/resend-mcp) — Official Resend MCP. Supports send/list/get/cancel/update/batch + inbound + attachments.
17. [Introducing Vercel MCP — Vercel blog](https://vercel.com/blog/introducing-vercel-mcp-connect-vercel-to-your-ai-tools) — Vercel official MCP at mcp.vercel.com. Not relevant to user.
18. [Using Playwright MCP with Claude Code — Simon Willison's TILs](https://til.simonwillison.net/claude-code/playwright-mcp-claude-code) — Playwright MCP best practices. User already has it.
19. [Jadael/OllamaClaude — GitHub](https://github.com/Jadael/OllamaClaude) — Local Ollama delegation pattern. ~98% token reduction on file-aware tasks.
20. [Claude Code Autonomous Mode — Pasquale Pillitteri](https://pasqualepillitteri.it/en/news/141/claude-code-dangerously-skip-permissions-guide-autonomous-mode) — /loop, /schedule, --dangerously-skip-permissions patterns.
21. [Orchestrate teams of Claude Code sessions — Claude Code Docs](https://code.claude.com/docs/en/agent-teams) — Official agent teams docs. 3-5 teammate guidance, validator pattern.
22. [Claude Code 2.1.0 — VentureBeat](https://venturebeat.com/orchestration/claude-code-2-1-0-arrives-with-smoother-workflows-and-smarter-agents) — 2.1 features overview. Conditional hooks, hot reload, transcript search.
23. [What's new in Claude Opus 4.7 — Claude API Docs](https://platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-7) — Opus 4.7 features (xhigh default, 1M context, /ultrareview). Live in Claude Code 2026-04-16.
24. [hesreallyhim/awesome-claude-code — GitHub](https://github.com/hesreallyhim/awesome-claude-code) — Canonical curated list. Hooks/skills/agents/templates.
25. [zilliztech/claude-context — GitHub](https://github.com/zilliztech/claude-context) — Semantic code search MCP. Hybrid BM25 + dense vector. ~40% token reduction.
26. [beehiiv MCP — beehiiv product](https://product.beehiiv.com/p/beehiiv-mcp) — First newsletter platform with native MCP. Read-only v1, March 2026.
27. [cloudflare/mcp-server-cloudflare — GitHub](https://github.com/cloudflare/mcp-server-cloudflare) — Official Cloudflare MCP repo. Workers Bindings server with 25 tools.
28. [EveryInc/compound-engineering-plugin — GitHub](https://github.com/EveryInc/compound-engineering-plugin) — 29 agents, 24 commands, 21 skills. The dominant 2026 plan-and-review workflow per Kieran Klaassen and Dan Shipper.
29. [Wolfram/arXiv MCP servers — multiple sources](https://github.com/openags/paper-search-mcp) — arXiv/PubMed/bioRxiv paper search MCP. Niche.
30. [Google Calendar MCP — nspady/google-calendar-mcp](https://github.com/nspady/google-calendar-mcp) — Calendar integration. Low ROI for daily dev.
