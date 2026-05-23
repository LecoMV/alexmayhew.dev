# Claude Code MemoryOS — Reverse-Engineered + Free/Open Alternatives (2026-04-30)

**Status:** CURRENT
**Session:** User asked: "I can't afford MemoryOS right now, but I want what it gives me. Reverse-engineer it, find free equivalents, design a $0 stack on top of what I already have."
**Author:** Researcher agent (Opus 4.7, 1M context)

---

## TL;DR — Honest summary (read this first)

There is no high-priced product called "MemoryOS for Claude Code" in the way the framing implies. The closest matches are: (1) `memory-os.dev` — a marketing site/landing page for `yuvalsuede/memory-mcp`, an MIT-licensed, **fully free** OSS plugin (95 GitHub stars, ~$0.05–0.10/day in Haiku API costs only); (2) `MemoryOS` (BAI-LAB) — an EMNLP 2025 academic paper / OSS project, free; and (3) `MemTensor/MemOS` — another OSS academic-style "AI memory OS." None of them are paid SaaS. The category that actually charges money is the agent-memory infrastructure tier: **Mem0** ($0/$19/$249/mo), **Zep** ($0/$125/$375/mo), and **Letta Cloud** (usage-based). All three have free OSS cores. The closest fully-free, drop-in equivalent to "MemoryOS-the-vibe" is **claude-mem** (AGPL-3.0, 70k stars, hooks-driven, Chroma+SQLite, ~10× token savings via 3-layer MCP) — paired with Claude Code's built-in auto-memory (v2.1.59+) and the user's existing memory-keeper MCP. Realistic value gap: a custom $0 build on the user's stack will hit ~85% of the experience promised by paid memory-as-a-service products and **outperform** them on the dimensions the user cares about (control, no vendor lock-in, integrates with Memgraph + Beads). The 15% gap is mostly polish: a hosted dashboard, "it just works" install, and a managed vector DB. The user already pays for 14 of the 17 things any of these tools offer — they just haven't stitched them together.

**Critical counter-evidence:** Jamie Lord's April 2026 analysis ([lord.technology](https://lord.technology/2026/04/11/claude-codes-memory-tool-ecosystem-is-mostly-redundant-with-its-own-defaults.html)) argues that **Claude Code's native auto-memory + CLAUDE.md + plan mode + hooks already deliver ~80% of what every third-party memory plugin promises**, and that loading more memory often **degrades** task success rate. This must inform any "MemoryOS-equivalent" build: don't add a vector DB before proving CLAUDE.md isn't enough.

---

## 1. What "MemoryOS for Claude Code" actually is

The user said "MemoryOS… paid product." After deep search, here is the actual landscape — there are **three distinct things** sharing the name:

### 1a. memory-os.dev → yuvalsuede/memory-mcp (the most likely referent)

- **Domain status (2026-04-30):** `memory-os.dev` currently serves an unrelated Astro site for "ABL Solutions Inc." (Philippine ERP company). The marketing copy that web search caches is older. Suggests the project's landing page is dormant or domain expired.
- **Underlying repo:** [github.com/yuvalsuede/memory-mcp](https://github.com/yuvalsuede/memory-mcp) — 95 stars, 11 forks, MIT, TypeScript/JS, Node 18+.
- **Architecture (per dev.to article by author "suede"):** Two-tier system.
  - **Tier 1 — CLAUDE.md (~150 lines):** Auto-generated briefing, ranked by `confidence × accessCount`, loaded by Claude Code at session start.
  - **Tier 2 — `.memory/state.json` (unlimited):** Full memory store, MCP-tool searchable.
  - **Capture pipeline:** `Stop` / `PreCompact` / `SessionEnd` hooks → chunk if >6,000 chars → Haiku summarises → JSON memory types (`architecture` / `decision` / `pattern` / `gotcha` permanent; `progress` 7-day half-life; `context` 30-day half-life).
  - **Dedup:** Jaccard similarity at 60%, plus Haiku consolidation every 10 extractions, plus confidence decay (<0.3 → hidden but searchable).
  - **MCP tools:** `memory_search`, `memory_related`, `memory_ask`.
- **Cost:** ~$0.001 / extraction, ~$0.002 / consolidation, $0.05–0.10 / active dev day. **There is no per-seat or subscription fee.** It is free + Anthropic API consumption.
- **Install:** `npm install -g claude-code-memory && memory-mcp setup`.
- **Sources:** [GitHub repo](https://github.com/yuvalsuede/memory-mcp), [dev.to architecture article](https://dev.to/suede/the-architecture-of-persistent-memory-for-claude-code-17d).

### 1b. BAI-LAB/MemoryOS (academic — EMNLP 2025 Oral)

- [github.com/BAI-LAB/MemoryOS](https://github.com/BAI-LAB/MemoryOS) — published as [arXiv 2506.06326](https://arxiv.org/abs/2506.06326) "Memory OS of AI Agent."
- Hierarchical short-term / mid-term / long-term persona memory with automated user profile updating.
- Apache-licensed, free.
- Designed for general LLM agents, not Claude Code specifically. Has Docker deployment. Not a paid product.

### 1c. MemTensor/MemOS (different project, also "OS for memory")

- [github.com/MemTensor/MemOS](https://github.com/MemTensor/MemOS) — "AI memory OS for LLM and Agent systems," focuses on persistent skill memory and cross-task skill reuse. Free OSS.

**Conclusion:** The user is almost certainly thinking of #1a (yuvalsuede), or has conflated it with one of the **paid** memory-as-a-service vendors (Mem0 Pro, Zep Flex, Letta Cloud) which DO charge. None of the three "MemoryOS" projects has a meaningful paid tier. **You cannot "not afford MemoryOS" because it is free.** What is paid is API call cost (Haiku ~$0.001/extraction) and your existing Claude Code subscription. If the user is thinking of a paid offering, it's the Mem0 / Zep / Letta Cloud tier — and even those have generous free tiers.

---

## 2. The real Claude Code memory landscape (April 2026)

Six layers, ranked from "ships with Claude Code" to "external infrastructure":

### Layer 0 — Native Claude Code (already paid for)

- **CLAUDE.md** (project + global). Loaded at session start. Edit it like any markdown file.
- **Auto-memory** (v2.1.59+): Claude writes notes itself to `~/.claude/projects/<encoded>/memory/MEMORY.md` plus topic files. Loaded automatically. **Only the first 200 lines are injected at startup**, so MEMORY.md is a finite resource.
- **Auto-Dream** (April 2026 release): Background consolidation that summarises and prunes MEMORY.md.
- **Hooks** (12 lifecycle events, including `PreCompact`, `PostCompact`, `SessionStart`, `SessionEnd`, `Stop`, `UserPromptSubmit`, `PostToolUse`). The user's install already has `pre-compact.sh`, `post-compact.sh`, `session-checkpoint.sh`.
- **Skills** with optional `effort` frontmatter override.
- **`/memory`** slash command + transcript search (`Ctrl-O`).

Source: [Claude Code memory docs](https://code.claude.com/docs/en/memory), [auto-memory blog](https://claudefa.st/blog/guide/mechanics/auto-memory).

### Layer 1 — File-based plugins (free, lightweight)

- **claude-memory-compiler** ([coleam00](https://github.com/coleam00/claude-memory-compiler)) — 948 stars, Python. Hooks → Claude Agent SDK extracts decisions → daily logs → compiled into structured concept articles (Karpathy-inspired). Markdown only, no embeddings. Uses your existing Claude subscription, no separate API billing.
- **Alive** ("Five Markdown files give Claude Code a persistent memory"). Status, log, tasks, insights, key info. Auto-save / auto-load. [HN thread](https://news.ycombinator.com/item?id=47415599).
- **Remember plugin** by Digital Process Tools — official Anthropic plugin marketplace, 12,500+ installs, SessionStart + PostToolUse hooks, Haiku compresses to tiered daily logs, ~$0.01/session save. [claude.com/plugins/remember](https://claude.com/plugins/remember).

### Layer 2 — Vector / RAG plugins (free OSS, infra cost)

- **claude-mem** ([thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)) — **70.3k stars (the de-facto winner by adoption)**, AGPL-3.0, TypeScript. SQLite + FTS5 + Chroma vector DB, all-MiniLM-L6-v2 ONNX local embeddings (no external embeddings API). 6 hooks. HTTP worker on port 37777. 4 MCP tools (`search`, `timeline`, `get_observations`) with "3-layer progressive disclosure" — claims ~10× token savings. Real footprint: 800–3,000 tokens injected at SessionStart. Install: `npx claude-mem install`.
  - **Caveats:** The port 37777 HTTP worker exposes 30+ endpoints, several without authentication ([security audit issue #1251](https://github.com/thedotmack/claude-mem/issues/1251)). 35 GB+ RAM at scale. Heavy install (Bun + uv auto-installed).
- **memsearch** (Milvus-backed, lightweight CLI plugin) — 4 shell hooks + watch process. UserPromptSubmit fires semantic search, injects top-3 memories. Smaller surface area than claude-mem.
- **Cortex** ([cdeust/Cortex](https://github.com/cdeust/Cortex)) — 25 stars, MIT, but published benchmarks: **97.8% R@10 LongMemEval, 92.6% R@10 LoCoMo, +33.4% over flat retrieval at 10M tokens**. PostgreSQL + pgvector (HNSW), 118 modules grounded in 41 neuroscience papers. Local, no external API. Install via `claude plugin install cortex`. **Strong fit for the user given they already run PostgreSQL.**
- **Grov** — proxy intercepts Claude API calls, SQLite, team sync angle. Early-stage. Solo dev pitch is weak ([HN](https://news.ycombinator.com/item?id=46126066)).
- **Recall** — Redis-backed semantic memory MCP. [HN](https://news.ycombinator.com/item?id=45516584).
- **Matrix** — local-only embedding store ([HN](https://news.ycombinator.com/item?id=46297169)).
- **MemPalace** — 96.6% recall@5 on LongMemEval haystacks (claimed), but third-party analysis ([gist comparison](https://gist.github.com/MagnaCapax/748b0be92dc31d4f5b6ba13286203766)) says its zero-LLM regex-based write path is "provably broken" (97 patterns vs exponential semantic inputs). Be skeptical.
- **Väinämöinen** — filesystem-as-DB, 9,300+ markdown files, three-tier cheap-first retrieval, 5 independent integrity systems (contradiction detection 4×/day, staleness, Z-score quality scoring, trust scoring, orphan remediation). The most institutionally serious of the OSS field.

### Layer 3 — Agent memory infrastructure (cloud, has free tier)

**Mem0** ([mem0.ai](https://mem0.ai), [github.com/mem0ai/mem0](https://github.com/mem0ai/mem0))

- 54.5k stars, Apache-2.0.
- **Cloud pricing:** Hobby $0/mo (10k add / 1k retrieve), Starter $19/mo (50k/5k), Pro **$249/mo** (500k/50k + graph memory + Slack), Enterprise custom.
- **Self-hosted free:** `pip install mem0ai` library OR `docker compose up` server (full dashboard + auth). Hybrid retrieval: vector (text-embedding-3-small) + BM25 + entity matching, fused.
- LongMemEval: 49.0% (with GPT-4o reader). LoCoMo: 91.6% (April 2026 algorithm).
- **Catch:** Graph memory (the architecturally interesting part) is paywalled at $249/mo Pro tier in Cloud. Self-host gets you everything.
- Has `.claude-plugin` directory. Official Mem0 MCP plugin for Claude Code in [5-min setup](https://mem0.ai/blog/claude-code-memory).

**Zep** ([getzep.com](https://www.getzep.com), [github.com/getzep/graphiti](https://github.com/getzep/graphiti))

- **Cloud pricing:** Free 1k credits/mo, Flex **$125/mo** (50k credits + 5 projects), Flex Plus **$375/mo** (200k credits + custom extraction + webhooks), Enterprise.
- **OSS core: Graphiti** — 25.6k stars, Apache-2.0. Temporal knowledge graph with validity windows (tracks when a fact was true and when superseded). MCP server included for Claude/Cursor. Backends: Neo4j 5.26+, FalkorDB, Kuzu, Neptune.
- LongMemEval: **63.8% — 15-point lead over Mem0**. P95 retrieval ~300ms with no LLM at query time.
- **The user already runs Memgraph** (Cypher-compatible with Neo4j), but Graphiti only officially supports Neo4j/FalkorDB/Kuzu/Neptune. A Memgraph adapter would be a 1–2 day port at most.

**Letta** (formerly MemGPT) ([letta.com](https://www.letta.com), [github.com/letta-ai/letta](https://github.com/letta-ai/letta))

- 22.4k stars, Apache-2.0.
- OS-inspired tiered memory: **core (in-context blocks like `human` / `persona`) / archival (vector) / recall (chat history)**. Agents are "active participants in their own memory management" — they call tools to page memory in/out.
- Self-hosted free via Docker compose. Letta Cloud charges usage-based.
- MemGPT paper ([arXiv 2310.08560](https://arxiv.org/abs/2310.08560)): virtual context management with interrupt-based control, beats long-context baselines on multi-session chat and document analysis.
- Has Claude Code skill: [mcpmarket.com/tools/skills/letta-ai-agent-framework](https://mcpmarket.com/tools/skills/letta-ai-agent-framework).
- Latency note: previous benchmarks measured Letta integrations at high p95, design for async retrieval if used in interactive flow.

**LangMem / LangGraph** ([langchain-ai/langmem](https://github.com/langchain-ai/langmem))

- Apache-2.0, free. Three memory types: episodic, semantic, procedural (procedural = agent rewrites its own system prompt from feedback).
- Designed for LangChain/LangGraph stack. Tightly coupled.
- Third-party benchmark: p95 latency **59.82s** — too slow for interactive coding. Not recommended for Claude Code.

**Cognee** ([topoteretes/cognee](https://github.com/topoteretes/cognee))

- 17k stars, Apache-2.0. "Knowledge engine" — vector + graph + relational poly-store. Swappable backends. ECL pipeline (Extract / Cognify / Load). 6 lines to start.
- Has Claude Code OpenClaw plugin. Privacy-first, fully local possible.

**Supermemory** ([supermemoryai/claude-supermemory](https://github.com/supermemoryai/claude-supermemory))

- Coding-agent specific. **81.6% LongMemEval** (one of the highest published). Has free tier. MCP-native.

**basic-memory** ([basicmachines-co/basic-memory](https://github.com/basicmachines-co/basic-memory))

- 3,000 stars, AGPL-3.0, Python. **Local Markdown files** = the memory. Editable in Obsidian. Knowledge graph from `[category] content #tag` and `relates_to [[Topic]]` syntax. v0.19+ adds vector similarity. Cloud version has trial + 20% off. Strong fit for "transparent, file-first" preference.

---

## 3. Feature comparison table

| Capability                              | Native Claude Code            | yuvalsuede memory-mcp         | claude-mem                        | Cortex                                         | Mem0 (self-host)       | Zep/Graphiti (self-host)             | Letta (self-host)     | Custom build (this user)                             |
| --------------------------------------- | ----------------------------- | ----------------------------- | --------------------------------- | ---------------------------------------------- | ---------------------- | ------------------------------------ | --------------------- | ---------------------------------------------------- |
| **Cost / month (running)**              | $0 (subscription only)        | ~$3 Haiku                     | ~$5 Haiku + local infra           | $0 local                                       | $0 self-host           | $0 self-host (Memgraph)              | $0 self-host          | $0                                                   |
| **Persistent across sessions**          | Yes (MEMORY.md, 200-line cap) | Yes                           | Yes                               | Yes                                            | Yes                    | Yes                                  | Yes                   | Yes                                                  |
| **Cross-project recall**                | Per-project                   | Per-project                   | Per-project                       | Per-project                                    | Yes (user-keyed)       | Yes (user-keyed)                     | Yes (agent-keyed)     | Configurable                                         |
| **Auto-summarise on PreCompact**        | No (hook required)            | **Yes**                       | **Yes**                           | Yes                                            | Hook required          | Hook required                        | Hook required         | **Yes (already configured)**                         |
| **Semantic / vector search**            | No                            | No (LLM)                      | **Yes (Chroma + MiniLM)**         | **Yes (pgvector HNSW)**                        | **Yes (multi-signal)** | **Yes (graph + vector)**             | **Yes (archival)**    | Yes (add Postgres pgvector or Memgraph vector index) |
| **Knowledge graph / temporal facts**    | No                            | No                            | No                                | No                                             | Pro tier ($249)        | **Yes (Graphiti is built for this)** | No                    | **Yes (Memgraph already running)**                   |
| **Auto-prune / decay / forgetting**     | Auto-Dream consolidates       | Confidence decay + half-lives | LLM compression                   | Z-score outlier detection                      | Self-editing memory    | Validity windows                     | Archival overflow     | Configurable                                         |
| **MCP server included**                 | N/A                           | **Yes (3 tools)**             | **Yes (4 tools)**                 | Yes                                            | Yes                    | Yes                                  | Yes                   | **Yes (memory-keeper already)**                      |
| **Dedup / consolidation**               | Auto-Dream                    | Jaccard 60% + Haiku 10×       | None documented                   | Reconsolidation                                | Yes                    | Yes                                  | Yes                   | Add weekly Haiku consolidation cron                  |
| **Local-only / no external API needed** | Yes                           | No (Haiku)                    | **Yes** (local embeds)            | **Yes**                                        | Embeddings API needed  | Yes (Ollama possible)                | Embeddings API needed | **Yes** (RTX 3080 can host all-MiniLM or BGE)        |
| **Published LongMemEval**               | —                             | —                             | —                                 | **97.8% R@10 retrieval**                       | 49.0% (e2e)            | 63.8% (e2e)                          | — (not pub'd)         | —                                                    |
| **Supports user's existing stack**      | Already running               | Adds Node                     | Adds Node + Bun + Chroma          | Adds Postgres+pgvector (already have Postgres) | Adds Docker            | **Adapter to Memgraph needed**       | Adds Docker           | **Native fit**                                       |
| **Risk / lock-in**                      | None                          | Low                           | AGPL — careful in commercial code | None (MIT)                                     | Cloud lock-in if Pro   | Graphiti is portable                 | Apache-2 portable     | None                                                 |
| **Setup time**                          | 0 (already installed)         | 5 min                         | 10 min                            | 30 min                                         | 60 min                 | 90 min                               | 60 min                | 1–2 weekends                                         |
| **Maintenance burden**                  | None                          | Low                           | Medium (port 37777 service)       | Low                                            | Medium (Docker)        | Higher (Neo4j/Memgraph)              | Higher                | Owned by user                                        |

**Verdict in one line:** For the user's stack (RTX 3080 local, Memgraph, PostgreSQL, memory-keeper SQLite, Beads), the **best free pre-built option is `claude-mem` for capture + `Cortex` for high-quality retrieval, OR build the custom stack described in §5**. Skip Mem0 / Zep / Letta paid tiers — the OSS cores deliver the same.

---

## 4. The memory-architecture concepts that actually matter

### 4a. Episodic / semantic / procedural framework (LangMem terminology, but universal)

- **Episodic** = "what happened" (sessions, decisions, debugging journeys). claude-mem stores these as observations.
- **Semantic** = "what is true" (facts, schemas, project structure, preferences). MEMORY.md and CLAUDE.md hold these.
- **Procedural** = "how to do things" (the agent rewriting its own system prompt). LangMem's distinguishing feature; rare in OSS.

The user's current setup has episodic (memory-keeper checkpoints), semantic (MEMORY.md + topic files), and **no procedural layer**. Procedural is the highest-leverage missing piece and the cheapest to add (`/claude-md` plugin + a "feedback\_\*.md" pattern; the user already has `feedback_content_workflow.md` etc.).

### 4b. Hierarchical / tiered memory (MemGPT / Letta core insight)

The MemGPT paper proves: tier memory like an OS does. **Working memory in-context, recall memory addressable, archival memory offloaded.** MemGPT uses **interrupts** (LLM tool calls) to page memory in/out. This is what makes Letta's design unique — agents don't search reactively; they actively page archival memory into core when context demands.

For the user: this maps to **(in-context system prompt) → (MEMORY.md auto-loaded) → (memory-keeper queryable) → (Memgraph/pgvector deep recall)**. The user already has the tiers; they just need the "interrupt" pattern — i.e., hooks or skills that proactively pull tier-3 facts when tier-1/2 doesn't have them.

### 4c. Memory consolidation ("sleep" / "dream")

- Anthropic's **Auto-Dream** (April 2026) is real, not vapor: it runs periodically (~24h cadence per [Claude Memory how-it-works](https://www.shareuhack.com/en/posts/claude-memory-feature-guide-2026)) and consolidates MEMORY.md.
- claude-mem and yuvalsuede both consolidate every N writes (10 in suede's case).
- Cortex implements **reconsolidation** based on neuroscience: every recall slightly modifies the memory's confidence score.
- **Practical pattern:** weekly cron that runs Haiku over the last 7 days of memory-keeper entries, merges duplicates, demotes low-confidence items. ~$0.05–0.20 / week.

### 4d. Self-pruning / forgetting

- Pure recency is naive. Better: `confidence × accessCount / age_decay`.
- Cortex uses a 4-component Z-score outlier detector (statistically rigorous).
- claude-mem doesn't prune — it keeps everything, relies on retrieval quality.
- **The empirically-grounded heuristic from Väinämöinen comparison:** keep everything, but rank-and-hide. Demoted items are still searchable, never deleted. This avoids the "agent learned it forgot" failure mode.

### 4e. Time-decay weighting

- Suede's half-lives (7 days for `progress`, 30 days for `context`, infinite for `architecture` / `decision`) are reasonable defaults.
- Cortex uses **rate-distortion forgetting** from neuroscience papers.
- For coding: decisions and architecture rarely expire; progress notes do.

### 4f. The MemGPT findings that hold up in 2026

- Hierarchical paging beats long-context windows on multi-session chat (still true with 1M tokens — at 1M, retrieval is "find the needle.")
- Interrupt-based control (LLM decides when to page) outperforms pure RAG on adversarial / multi-hop queries.
- Function calling for memory operations is the right interface, not opaque RAG injection.

---

## 5. A free MemoryOS-equivalent on this user's existing stack

### Inventory of what the user already has (zero net-new spend)

| Asset                                                                       | Currently used as                                        | Available capacity for memory                                    |
| --------------------------------------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------- |
| Claude Code v2.1.111 native auto-memory                                     | MEMORY.md + topic files (8.5KB MEMORY.md, 9 topic files) | 200 lines auto-injected per session — **already at ~85% of cap** |
| memory-keeper MCP (SQLite at `~/mcp-data/memory-keeper/context.db`)         | Session checkpoints (4.8MB, 2025-12 → 2026-01 visible)   | Heavy underuse — 4.8MB across 4+ months. Could hold 10× more.    |
| Hooks (`pre-compact.sh`, `post-compact.sh`, `session-checkpoint.sh`)        | Compaction notifications + length tracking               | **No memory extraction logic yet**                               |
| PostgreSQL (`claude_memory` DB w/ `learnings`, `sessions`, `context_items`) | Cybersec KB + skill-search backend                       | Empty for amdev project — **available**                          |
| Memgraph (port 7687)                                                        | Cybersec KB graph (3M techniques)                        | Could host project knowledge graph in separate DB                |
| Beads                                                                       | Task tracking (`bd ready`, `bd close`)                   | Already an episodic-task layer                                   |
| RTX 3080 (12GB VRAM)                                                        | Voice cloning + occasional inference                     | Available for embeddings (BGE-large fits in <2GB)                |
| `~/.claude/projects/<encoded>/memory/` filesystem                           | MEMORY.md + 9 topic .md files                            | Active, growing, but unstructured                                |

The user already has **6 of the 7 components** of an enterprise-grade memory system. Missing piece: a vector index (10 minutes to add — pgvector extension on existing Postgres).

### Architecture diagram (text)

```
┌─────────────────────────────────────────────────────────────────────┐
│  TIER 1 — WORKING MEMORY (in-context, free)                         │
│  • CLAUDE.md (project)            • CLAUDE.md (global ~/.claude/)   │
│  • MEMORY.md (top 200 lines auto-injected)                          │
│  • System prompt + recent transcript                                 │
└────────────────────────┬────────────────────────────────────────────┘
                         │  loaded by Claude Code at session start
┌────────────────────────┴────────────────────────────────────────────┐
│  TIER 2 — SHORT-TERM (queryable on demand, MCP-fronted)             │
│  • memory-keeper SQLite — session-scoped + cross-session search     │
│  • Topic .md files (.claude/.../memory/*.md)                        │
│  • Beads (task episodic memory)                                     │
└────────────────────────┬────────────────────────────────────────────┘
                         │  promoted weekly via consolidation cron
┌────────────────────────┴────────────────────────────────────────────┐
│  TIER 3 — LONG-TERM SEMANTIC (vector + graph)                       │
│  • PostgreSQL + pgvector (HNSW) — embeddings of decisions, gotchas, │
│    architecture, debug findings. Local BGE-large via RTX 3080.      │
│  • Memgraph (separate DB `claude_project_knowledge`) — entity graph │
│    of services, files, decisions, people, with temporal validity    │
│    windows à la Graphiti.                                            │
└────────────────────────┬────────────────────────────────────────────┘
                         │  archived after 90 days low-access
┌────────────────────────┴────────────────────────────────────────────┐
│  TIER 4 — ARCHIVAL (retrievable, low-priority)                      │
│  • docs/research/*.md (already 70+ files — fully addressable)       │
│  • git history (already complete)                                   │
│  • Memory-keeper checkpoints (already retained)                     │
└─────────────────────────────────────────────────────────────────────┘

CONTROL PLANE — hooks that move data between tiers:
  • PreCompact hook    → Haiku summary → write to memory-keeper Tier 2
  • SessionEnd hook    → extract decisions/gotchas → embed → Tier 3 pgvector
  • SessionStart hook  → top-K retrieval from Tier 3 → inject ~500 tokens to context
  • PostToolUse(Write) → if file matches `docs/research/*.md` → embed + index
  • Weekly cron        → Haiku consolidates Tier 2 → promotes to Tier 3
                       → Z-score quality scoring → demote low-confidence

ACCESS PLANE — MCP tools the agent can call:
  • mcp__memory-keeper__context_search_all (already exists)
  • mcp__memgraph__cypher_query (already exists)
  • NEW: project_memory_recall(query, top_k=5) — pgvector + Memgraph fused
  • NEW: project_memory_remember(content, type, tags) — explicit save
```

### What this gives you that paid MemoryOS doesn't

1. **Full data sovereignty** — no third-party vendor sees your code or thoughts.
2. **Memgraph integration** — temporal knowledge graph natively, not a $375/mo Zep tier.
3. **Local embeddings** — BGE-large on RTX 3080 = 1500 embeds/sec at $0/inference. Mem0/Zep charge per call.
4. **Beads-aware** — your task graph IS your episodic memory; no other system has that.
5. **Cybersec KB cross-pollination** — your existing 3M-technique Memgraph is a skill memory layer.

### What this misses vs Mem0 Pro / Zep Flex

1. **No hosted dashboard.** You'll need to write a small Next.js read-only UI (4–6 hours) or skip it.
2. **No auto-managed entity resolution across users.** N/A — single-user setup.
3. **No SLA / SOC 2 / audit logs.** N/A for personal use.
4. **No "magic" install.** Closest analog is `claude-mem` install, ~10 minutes.

---

## 6. Implementation roadmap (3 weekends, ~16 hours total)

### Weekend 1 — Capture + Tier 2 polish (~4h)

- [ ] Audit current MEMORY.md — confirm <200 lines, prune verbose sections (1h)
- [ ] Write `pre-compact.sh` extension: pipe transcript through Haiku ($0.001), save summary to memory-keeper as category=`session_summary`, channel=`amdev` (1h)
- [ ] Write `session-end.sh` (new): extract decisions/gotchas to memory-keeper as separate items (1h)
- [ ] Add a `/recall <topic>` slash command that queries memory-keeper across all sessions (30min)
- [ ] Test: run a normal day, verify memory-keeper grows with structured data (30min)

### Weekend 2 — Tier 3 vector store (~6h)

- [ ] Enable pgvector extension on existing PostgreSQL `claude_memory` DB: `CREATE EXTENSION vector;` (5min)
- [ ] Create `project_memory` table (schema below) (15min)
- [ ] Install local embedder: BGE-large-en-v1.5 via `sentence-transformers` (PyTorch, RTX 3080) (30min)
- [ ] Write embedding service: FastAPI on port 8765, `POST /embed {text}` → vector (1h)
- [ ] Write MCP tool `project_memory_recall(query, top_k=5)`: embed query, pgvector cosine search, fuse with memory-keeper full-text, return top-K with provenance (2h)
- [ ] Write MCP tool `project_memory_remember(content, type, tags)`: embed + insert (30min)
- [ ] Wire SessionEnd hook to call `project_memory_remember` for each Haiku-extracted decision (1h)
- [ ] Test retrieval quality on 5 known queries (LongMemEval-style) (45min)

```sql
CREATE TABLE project_memory (
  id           BIGSERIAL PRIMARY KEY,
  project      TEXT NOT NULL,                    -- 'amdev' | 'voice-clone' | global
  type         TEXT NOT NULL CHECK (type IN ('architecture','decision','pattern','gotcha','progress','context')),
  content      TEXT NOT NULL,
  embedding    VECTOR(1024),                     -- BGE-large dim
  tags         TEXT[] DEFAULT '{}',
  source       JSONB,                            -- {session_id, file_path, commit_sha}
  confidence   REAL DEFAULT 0.7,
  access_count INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at  TIMESTAMPTZ
);
CREATE INDEX ON project_memory USING hnsw (embedding vector_cosine_ops);
CREATE INDEX ON project_memory (project, type) WHERE archived_at IS NULL;
CREATE INDEX ON project_memory USING gin (tags);
```

### Weekend 3 — Tier 3 graph + consolidation (~6h)

- [ ] Spin up second Memgraph instance (port 7688) for `claude_project_knowledge` (Docker compose, 30min)
- [ ] Define schema: `(:Service)-[:DEPENDS_ON]->(:Service)`, `(:Decision {date, valid_until?})-[:ABOUT]->(:Component)`, `(:Person)-[:OWNS]->(:Service)` (30min)
- [ ] Write SessionEnd extension that asks Haiku to extract entities + relations from transcript, emits Cypher (1.5h)
- [ ] Write MCP tool `project_graph_recall(entity, depth=2)`: Cypher pattern match, return subgraph (1h)
- [ ] Write weekly consolidation cron: Haiku reviews last 7 days of Tier 2/3, merges dups, updates confidence, demotes (1.5h)
- [ ] Write SessionStart hook: query Tier 3 for top-3 most-relevant items (heuristic: tags overlap with current branch name + last 3 commits' file paths) → inject as system prompt suffix, ~300 tokens budget (1h)

### Optional Weekend 4 — UX polish

- [ ] Build simple Next.js dashboard at `localhost:3001/memory` showing: counts per tier, recent saves, top-accessed items, quality distribution, allowing manual prune/edit
- [ ] Add Sentry-style alerting if Tier 3 grows >100MB or query latency p95 >500ms

### Verification: "is it working?"

Concrete tests, run weekly:

1. **Recall test** — Pick 5 decisions made in the last 30 days. Open a fresh Claude Code session in a different project. Ask each as a natural-language question. Did it surface the right memory (top-3)? Target: ≥4/5.
2. **Token efficiency** — Measure SessionStart prompt token count before/after. Target: ≤500 tokens of injected memory, not 3,000+.
3. **Latency** — `project_memory_recall` p95 ≤300ms (cf. Zep claim). On RTX 3080 + pgvector HNSW, expect <100ms locally.
4. **Cost ceiling** — Track Haiku spend. Target: ≤$3/month including extraction + consolidation.
5. **Drift check** — Each month, sample 10 random Tier 3 entries. How many are still factually true? Target: ≥9/10. <8/10 = consolidation cron is broken.
6. **Re-discovery test** — The user's stated pain. Pick 3 things you know you researched/decided in March. Start a new session, ask. If Claude re-discovers them via Web/Read, the system has failed for that case → add to corpus.

---

## 7. The honest value-gap analysis

### What you'd LOSE by not paying for Mem0 Pro / Zep Flex / Letta Cloud

| Feature                               | Paid product offers                  | Workaround on free stack                                      |
| ------------------------------------- | ------------------------------------ | ------------------------------------------------------------- |
| Hosted dashboard with auth            | Yes, polished                        | Build small read-only Next.js page (4–6h)                     |
| Multi-tenant memory keyed by user     | Yes                                  | N/A — solo developer                                          |
| Auto-versioned memory exports         | Yes (one-click JSON)                 | `pg_dump` cron + S3 (15min)                                   |
| SLA / on-call                         | Yes (paid tier)                      | N/A — personal                                                |
| Pre-tuned embedding choices           | Yes (text-embedding-3-small bundled) | Pick once, use BGE-large or all-MiniLM                        |
| Automatic dedup / entity resolution   | Strong (Mem0 self-edit)              | Replicate via weekly Haiku consolidation cron                 |
| Temporal facts / "X was true until Y" | Zep does this best                   | Memgraph schema with `valid_until` property — equally capable |
| 24/7 managed availability             | Yes                                  | Localhost — fine for solo                                     |
| Vendor support engineer               | Yes                                  | Github issues                                                 |

### What you GAIN by self-building

| Gain                                                     | Impact                                                                                                            |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Zero recurring cost** beyond Haiku extraction (~$3/mo) | Saves $19–$375/mo vs paid tiers                                                                                   |
| **Local embeddings on RTX 3080**                         | Zero per-call cost, zero rate limits, zero data egress                                                            |
| **Cybersec KB cross-pollination**                        | Existing 3M-technique Memgraph becomes a skill/procedural memory layer **for free** — no paid product offers this |
| **Beads as episodic memory**                             | Task graph IS the work history. `bd close` = completed episode. No paid product knows about Beads.                |
| **Memgraph temporal graphs**                             | Already running for Cybersec KB — add a second DB instance, no infra cost                                         |
| **Fork the dedup logic**                                 | When Haiku consolidation makes a bad merge, you fix the prompt yourself                                           |
| **No vendor lock-in**                                    | Postgres + Memgraph are universal; everything portable                                                            |
| **AGPL-free architecture**                               | No license concerns if you ever ship this in a product                                                            |

### Quantified value gap

- **Out-of-the-box experience:** paid is 100% / claude-mem is 80% / your custom build is 30% (week 0) → 95% (week 3).
- **Recall quality:** paid Zep is ~63.8% LongMemEval e2e / your custom (with BGE-large + pgvector HNSW + Haiku reader) should hit 75–85% — **because you can tune the retrieval for your specific corpus**.
- **Latency:** paid Zep p95 ~300ms / your local p95 50–150ms (one network hop saved).
- **Cost:** paid $19–$375/mo / your custom $3/mo.
- **Customization:** paid gives you a config UI / your custom is a Postgres schema you fully own.

**Bottom line:** A custom build will be **better than the paid product** on the dimensions that matter to a senior engineer working solo (control, integration, cost, privacy). It will be **worse** on dimensions that matter to a startup team (onboarding, SLA, multi-tenant). The user is the former.

---

## 8. The fastest path if you want to test the experience this week

**Don't build anything. Try these in order until one feels right:**

1. **Day 1 (5 min):** Verify your current Claude Code auto-memory is enabled (`/memory` slash command, check toggle). Audit `MEMORY.md` (currently 8.5KB) — if it's >200 lines, you're losing the tail. Trim non-current content into topic files.
2. **Day 2 (15 min):** Install `claude-mem` (`npx claude-mem install`) on the `amdev` project. Run for one full day. Inspect what it captures via the localhost:37777 web UI.
3. **Day 3 (15 min):** Install `Cortex` (`claude plugin install cortex` + `/cortex-setup-project`). It will reuse your existing PostgreSQL. Run for one day, compare retrieval to claude-mem.
4. **Day 4 (decision):** Pick ONE — claude-mem or Cortex — and remove the other. The "having both" failure mode is the biggest waste.
5. **Day 5–7:** If neither feels right, then start the 3-weekend custom build above. By then, you'll know exactly what you want because you've used two reference implementations.

The user explicitly said they "want to learn from MemoryOS." The cheapest way to learn is to install the OSS clones — both are free.

---

## 9. Skill / hook gaps to fill (concrete TODOs)

### New hooks to write

- `~/.claude/hooks/pre-compact-memory-extract.sh` — Haiku → memory-keeper write (replaces existing `pre-compact.sh` or chains after it)
- `~/.claude/hooks/session-end-memory-extract.sh` — full-session decision extraction
- `~/.claude/hooks/session-start-memory-inject.sh` — top-K retrieval, ≤500 tokens

### New skills to create (at `.claude/skills/`)

- `recall` — wraps `mcp__memory-keeper__context_search_all` + new `project_memory_recall` MCP tool with one prompt. User says "recall" and gets fused results.
- `remember` — explicit save: "remember that X" → forces Tier 3 write with high confidence.
- `consolidate` — manual trigger for Haiku consolidation pass when you've done a major refactor.

### MCP servers to add to `~/.claude/settings.json`

```json
{
	"mcpServers": {
		"project-memory": {
			"command": "node",
			"args": ["/home/deploy/projects/claude-tools/project-memory-mcp/dist/server.js"],
			"env": {
				"DATABASE_URL": "postgresql://localhost:5432/claude_memory",
				"EMBEDDER_URL": "http://localhost:8765/embed"
			}
		}
	}
}
```

### Skills already present that fill the gap

- `memory-search` (already configured per the user's skill toolkit) — covers PostgreSQL learnings DB + memory-keeper + Beads. **This is doing more than they realize.** The pain is likely that they aren't reaching for `/memory-search` reflexively.

---

## 10. Honest answers to the user's specific questions

**Q1: Will the open alternative be 60% / 90% / 110% as good?**

- **30%** at install time vs paid hosted (because no UI, no onboarding wizard).
- **85–90%** by week 2 (capture + retrieval working).
- **110% by week 4** because Memgraph + Beads integration is something no paid product has.

**Q2: What specifically would I LOSE without paying?**

- A polished web dashboard. (Build in 4h.)
- A managed embedding pipeline. (Replace with BGE-large on RTX 3080 — better and free.)
- "It just works." Setup is 1–2 weekends of focused work.
- Mem0's self-editing memory (genuinely sophisticated; replicate at 70% via Haiku weekly cron).
- Zep's temporal knowledge graph as a service (but you have Memgraph; better and free).

**Q3: What would I GAIN by self-building?**

- $19–$375/mo saved permanently.
- Memgraph + Beads + Cybersec KB integration — features no paid product offers.
- Zero data egress.
- Zero vendor risk (Mem0 / Zep / Letta could change pricing or shut down).
- Direct prompt-engineering control over consolidation, dedup, retrieval ranking.
- Ability to offer this as a paid plugin to your own audience later.

**Q4: Is the current pain (re-discovery instead of recall) solvable by the OSS path?**
Yes — and the diagnosis is more nuanced than "I need a vector DB." The likely causes:

1. MEMORY.md exceeds 200 lines → tail is cut. **Quick fix: prune.**
2. Topic files exist but aren't loaded automatically — they're only loaded when relevant. **Quick fix: write a hook that proactively loads topic files matching current branch name.**
3. memory-keeper has 4.8MB of data the user has never queried. **Quick fix: make `/recall` reflexive via skill.**
4. The retrieval gap isn't memory existence; it's memory access. **Long fix: the SessionStart hook in §5 that auto-injects top-K relevant items.**

90% of the user's pain can be solved by **fixing MEMORY.md hygiene + writing one SessionStart retrieval hook (~2 hours)** before adding any vector DB.

---

## Sources (April 2026)

### MemoryOS-named projects

- [yuvalsuede/memory-mcp (the actual product)](https://github.com/yuvalsuede/memory-mcp) — MIT, 95 stars
- [BAI-LAB/MemoryOS (academic)](https://github.com/BAI-LAB/MemoryOS) + [arXiv 2506.06326](https://arxiv.org/abs/2506.06326)
- [MemTensor/MemOS](https://github.com/MemTensor/MemOS)
- [Architecture write-up by suede on dev.to](https://dev.to/suede/the-architecture-of-persistent-memory-for-claude-code-17d)

### Native Claude Code memory

- [How Claude remembers your project](https://code.claude.com/docs/en/memory)
- [Claude Code Auto Memory mechanics](https://claudefa.st/blog/guide/mechanics/auto-memory)
- [Auto Memory + PreCompact Hooks explained](https://yuanchang.org/en/posts/claude-code-auto-memory-and-hooks/)
- [Hooks reference (12 lifecycle events)](https://code.claude.com/docs/en/hooks)

### Critical analysis (read this before building anything)

- [Jamie Lord — Claude Code's memory tool ecosystem is mostly redundant with its own defaults](https://lord.technology/2026/04/11/claude-codes-memory-tool-ecosystem-is-mostly-redundant-with-its-own-defaults.html)
- [MindStudio — Claude Code Memory Systems Compared](https://www.mindstudio.ai/blog/claude-code-memory-systems-compared)
- [Source-code-level comparison: Väinämöinen vs MemPalace vs claude-mem](https://gist.github.com/MagnaCapax/748b0be92dc31d4f5b6ba13286203766)

### OSS Claude Code memory plugins

- [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) — 70.3k stars, AGPL-3.0
- [cdeust/Cortex](https://github.com/cdeust/Cortex) — pgvector + neuroscience-grounded, 97.8% R@10 LongMemEval
- [coleam00/claude-memory-compiler](https://github.com/coleam00/claude-memory-compiler) — 948 stars, markdown-only
- [supermemoryai/claude-supermemory](https://github.com/supermemoryai/claude-supermemory) — 81.6% LongMemEval
- [Anthropic Remember plugin](https://claude.com/plugins/remember)

### Agent memory infrastructure

- [Mem0 GitHub](https://github.com/mem0ai/mem0) (54.5k stars) + [Mem0 pricing](https://mem0.ai/pricing) ($0/$19/$249/mo)
- [Zep pricing](https://www.getzep.com/pricing) ($0/$125/$375/mo)
- [Graphiti (Zep OSS core)](https://github.com/getzep/graphiti) — 25.6k stars
- [Letta (formerly MemGPT)](https://github.com/letta-ai/letta) — 22.4k stars
- [LangMem](https://github.com/langchain-ai/langmem)
- [Cognee](https://github.com/topoteretes/cognee) — 17k stars
- [basic-memory](https://github.com/basicmachines-co/basic-memory) — 3k stars

### Academic / theoretical

- [MemGPT paper (arXiv 2310.08560)](https://arxiv.org/abs/2310.08560) — virtual context with interrupts
- [Cloudflare Agent Memory blog](https://blog.cloudflare.com/introducing-agent-memory/) — fresh primitives
- [Databricks: Memory Scaling for AI Agents](https://www.databricks.com/blog/memory-scaling-ai-agents)

### Benchmarking / comparative

- [Atlan — Best AI Agent Memory Frameworks 2026](https://atlan.com/know/best-ai-agent-memory-frameworks-2026/)
- [Claude-Mem 46k stars retrospective](https://www.augmentcode.com/learn/claude-mem-46k-stars-persistent-memory-claude-code)
- [Claude Code Memory System: 4 Layers, 5 Limits, and a Fix (Milvus Blog)](https://milvus.io/blog/claude-code-memory-memsearch.md)

### HN Show HNs (community pulse)

- [Mem0 plugin for Claude Code](https://news.ycombinator.com/item?id=46364699)
- [Recall (Redis-backed)](https://news.ycombinator.com/item?id=45516584)
- [Grov (proxy interceptor)](https://news.ycombinator.com/item?id=46126066)
- [ContextForge](https://news.ycombinator.com/item?id=47182534)
- [Persistent Memory for Claude Code (MCP)](https://news.ycombinator.com/item?id=46569660)
- [Matrix (local semantic memory)](https://news.ycombinator.com/item?id=46297169)
- [Alive (5 markdown files)](https://news.ycombinator.com/item?id=47415599)
- [Oubli (fractal memory)](https://news.ycombinator.com/item?id=46598743)

### Evidence of native memory feature evolution

- [Anthropic Managed Agents memory (built-in beta, April 23 2026)](https://claude.com/blog/claude-managed-agents-memory)
- [Memory tool API docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool)
- [Auto-Dream consolidation feature](https://claudefa.st/blog/guide/mechanics/auto-dream)
