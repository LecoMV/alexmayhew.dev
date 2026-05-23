# Claude Code + Vector DB for Persistent Semantic Memory (2026-04-30)

**Status:** CURRENT
**Session:** Should we integrate Pinecone (or another vector DB) into Claude Code for persistent semantic recall across sessions/projects? User has 1M context, memory-keeper SQLite, file-based memory, Memgraph, Beads, RTX 3080, cost-sensitive.

---

## TLDR

**Recommendation: Option D — local Qdrant + local BGE-M3 embeddings via the official `mcp-server-qdrant` MCP, scoped to one collection per project.**

Skip Pinecone. Skip claude-mem (security audit failed). Don't repurpose Memgraph as a vector store for this — its MCP server only exposes `run_query()` and `get_schema()`, no native vector tools, so you'd be writing Cypher by hand from inside Claude. Instead, add a 1.4K-star, officially-maintained Qdrant MCP that gives Claude two clean tools (`qdrant-store`, `qdrant-find`), keeps everything on the box, costs $0, runs in Docker on the RTX 3080 (or even CPU), and uses BGE-M3 embeddings locally via FastEmbed. The user's existing memory-keeper + file-based memory stay as they are — Qdrant fills the **cross-session semantic recall** gap they don't cover.

### 3-step quickstart

```bash
# 1. Run Qdrant locally (Docker, persistent volume)
docker run -d --name qdrant --restart unless-stopped \
  -p 6333:6333 -p 6334:6334 \
  -v /home/deploy/.claude/qdrant-data:/qdrant/storage \
  qdrant/qdrant:latest

# 2. Add the Qdrant MCP server to Claude Code (uvx auto-installs)
claude mcp add-json qdrant-memory '{
  "type": "stdio",
  "command": "uvx",
  "args": ["mcp-server-qdrant"],
  "env": {
    "QDRANT_URL": "http://localhost:6333",
    "COLLECTION_NAME": "claude-mem-default",
    "EMBEDDING_MODEL": "BAAI/bge-small-en-v1.5",
    "EMBEDDING_PROVIDER": "fastembed"
  }
}'

# 3. Add a "use it" hint to ~/.claude/CLAUDE.md so Claude actually invokes it
# (See "MCP config snippet" section below for exact prose.)
```

Restart Claude Code, run `/mcp`, confirm `qdrant-memory` is connected, then say "remember that we use Cloudflare Pages for alexmayhew.dev deploys" and verify with `/mcp__qdrant-memory__qdrant-find` "where do we deploy alexmayhew.dev". Total setup time: ~10 min. Total cost: $0.

---

## 1. Pinecone for Claude Code in 2026

### Does an MCP server exist?

Yes — **two**, both from Pinecone directly:

| Path                           | What it is                                | Stars | Last release                | Source                                                                         |
| ------------------------------ | ----------------------------------------- | ----- | --------------------------- | ------------------------------------------------------------------------------ |
| `@pinecone-database/mcp` (npm) | Official stdio MCP server                 | 65    | v0.2.1, **2026-02-05**      | [pinecone-io/pinecone-mcp](https://github.com/pinecone-io/pinecone-mcp)        |
| `pinecone-claude-code-plugin`  | Official Claude Code Plugin (marketplace) | n/a   | **2026-02-11** announcement | [Pinecone blog](https://www.pinecone.io/blog/pinecone-plugin-for-claude-code/) |

Install via Claude Code:

```bash
claude mcp add-json pinecone-mcp '{"type":"stdio","command":"npx","args":["-y","@pinecone-database/mcp"],"env":{"PINECONE_API_KEY":"YOUR_KEY"}}'
```

Or as a plugin: `claude plugin install pinecone`. Source: [Pinecone Docs — MCP Server](https://docs.pinecone.io/guides/operations/mcp-server).

### Tools exposed (9)

`search-docs`, `list-indexes`, `describe-index`, `describe-index-stats`, `create-index-for-model`, `upsert-records`, `search-records`, `cascading-search`, `rerank-documents`. Plus 5 Assistant commands (`/pinecone:assistant-{create,upload,sync,chat,context}`).

### Critical limitation (this is the deal-breaker)

> "The Pinecone MCP supports only indexes with **integrated embedding**. External embedding models are incompatible."
> — [Pinecone MCP docs](https://docs.pinecone.io/guides/operations/mcp-server)

You **cannot** use a local BGE-M3 to embed and shove the vectors into Pinecone via this MCP. You're forced into Pinecone's hosted models: `llama-text-embed-v2`, `multilingual-e5-large`, or `pinecone-sparse-english-v0`. That hosted inference is metered against your Starter quota.

### Free tier (verified 2026-04-30)

Source: [pinecone.io/pricing](https://www.pinecone.io/pricing/) (read 2026-04-30)

| Resource                 | Starter (free)                  |
| ------------------------ | ------------------------------- |
| Storage                  | 2 GB                            |
| Indexes                  | 5                               |
| Namespaces per index     | 100                             |
| Read units / month       | 1M                              |
| Write units / month      | 2M                              |
| Embedding tokens / month | **5M** (this is the bottleneck) |
| Reranking calls / month  | 500                             |
| Region                   | us-east-1 only (AWS)            |
| Region (paid)            | n/a — must upgrade to Standard  |

Standard plan: **$50/month minimum**. Read units bill at $16/1M (Standard).

### Cost / latency reality for "personal memory"

- 5M embedding tokens/month sounds like a lot, but coding sessions with continuous capture (claude-mem-style) blow through it in days. You'll either rate-limit yourself or hit $50/mo minimum.
- **Cold start latency** for the hosted `llama-text-embed-v2` is ~80–200 ms p50 from us-east-1 (one transatlantic hop from a US-East-1 perspective; from rtx01 in the EU/UK it'll be higher).
- Auth: **API key only**, scoped to a project, not org-bound by default.

### Verdict on Pinecone

**Skip it.** Three reasons:

1. The integrated-embedding requirement means you can't use your RTX 3080 to embed — defeats the purpose of having local hardware.
2. Free tier embedding quota will run out fast on continuous capture.
3. Hosted-only — round-trip latency to us-east-1 from a UK box is 80–200 ms minimum, vs. <5 ms for a localhost Qdrant.

The Pinecone Claude Code plugin is built for **users who already have Pinecone in production** and want their AI to manage indexes. It's a DevOps tool, not a personal memory backend.

---

## 2. Alternatives: Qdrant, Chroma, Weaviate, Milvus, pgvector, LanceDB, Turbopuffer

| DB              | MCP server?                                                                                                           | Free tier                             | Local install                | Best for                                              |
| --------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ---------------------------- | ----------------------------------------------------- |
| **Qdrant**      | [qdrant/mcp-server-qdrant](https://github.com/qdrant/mcp-server-qdrant) — **1.4K stars, official, v0.8.1 2025-12-10** | Self-hosted free, Cloud has free tier | Docker one-liner             | **Solo dev (RECOMMENDED)**                            |
| **Chroma**      | Multiple community servers (~540 stars combined). Used inside `claude-mem`.                                           | Self-hosted free                      | `pip install chromadb`       | Embedded use inside other plugins                     |
| **Weaviate**    | `weave-mcp` (small), official server in beta                                                                          | New pricing 2025-10-27: $25/1M dim/mo | Docker                       | Production teams                                      |
| **Milvus**      | Used inside `memsearch` (Zilliz's plugin); no standalone "memory" MCP                                                 | Milvus Lite is a single file, free    | `pip install pymilvus[lite]` | Larger scale, hybrid search                           |
| **pgvector**    | No first-class memory MCP. Generic Postgres MCP works but you write SQL                                               | Free if you have Postgres             | `CREATE EXTENSION vector`    | If you already have Postgres + want one fewer service |
| **LanceDB**     | No popular MCP server                                                                                                 | Free, file-based                      | `pip install lancedb`        | Embedded analytics, columnar                          |
| **Turbopuffer** | None — hosted only, focus on search not agents                                                                        | Free tier exists                      | Cloud-only                   | Skip                                                  |

### Drop-in best for solo developer use → Qdrant

- Official MCP: 1.4K stars, last commit Dec 2025, active maintenance
- Two clean tools: `qdrant-store(content, metadata)` and `qdrant-find(query, limit)` — that's the entire surface
- Docker one-liner + persistent volume = trivial backup
- Embeddings via **FastEmbed** (default `all-MiniLM-L6-v2`, 384-dim, ~90 MB on disk, 100% local, zero API calls)
- Configurable to BGE-M3 (1024-dim, ~2GB, runs on RTX 3080) or any FastEmbed model

Source: [Qdrant MCP server README](https://github.com/qdrant/mcp-server-qdrant)

### pgvector + Postgres via MCP — the curiosity case

There's no widely-adopted "Postgres-as-Claude-memory" MCP. The official `postgres` MCP is a generic SQL runner — you'd be hand-writing `INSERT INTO memories ... embedding('...')` and `SELECT ... ORDER BY embedding <=> $1` from inside the agent. It works, but the UX is awful compared to `qdrant-find`. Skip unless you specifically want to keep services to a minimum and you already do everything in Postgres.

### Best for team use

**Weaviate Cloud** ($25/1M dimensions/month, [pricing 2025-10-27](https://weaviate.io/pricing)) or **Qdrant Cloud Hybrid** ($0.014/hr starting). Both have official MCPs, both support multi-tenancy. Solo developer doesn't need this.

### Drop-in best for "I have an RTX 3080 and want zero cloud" → Qdrant + BGE-small-en-v1.5

BGE-M3 is overkill for English-only personal memory and OOMs on 8GB GPUs ([HF discussion](https://huggingface.co/BAAI/bge-m3/discussions/2)) — your RTX 3080 has 10GB so it'd work, but it's slower and bigger. **BGE-small-en-v1.5** (384-dim) gives 95% of the quality at 30% of the size and is the pragmatic choice for a personal knowledge base under 100K docs.

---

## 3. Local-first vector stores — performance comparison

Source: [michelabboud/claude-code-helper RAG-MCP guide](https://github.com/michelabboud/claude-code-helper/blob/main/guides/RAG-MCP-GUIDE.md), 2,000-file Python project, **87,000 vectors**:

| Backend            | Index time | Search p50 | Search p95 |
| ------------------ | ---------- | ---------- | ---------- |
| Redis (RediSearch) | 142 s      | **4 ms**   | 8 ms       |
| Qdrant             | 167 s      | 19 ms      | 31 ms      |
| ChromaDB           | 189 s      | 20 ms      | 38 ms      |

For personal-memory scale (1K–100K docs), **all three are well under 50 ms** — so latency isn't the deciding factor. Qdrant wins on **MCP ergonomics** (purpose-built memory tools) and operational simplicity.

### Embedding models on RTX 3080 (10GB VRAM)

| Model                     | Dims | Size              | RTX 3080 latency (single query)                                            | Code+prose quality             |
| ------------------------- | ---- | ----------------- | -------------------------------------------------------------------------- | ------------------------------ |
| all-MiniLM-L6-v2          | 384  | 90 MB             | ~5 ms                                                                      | Good baseline                  |
| BGE-small-en-v1.5         | 384  | 130 MB            | ~6 ms                                                                      | **Sweet spot**                 |
| BGE-base-en-v1.5          | 768  | 440 MB            | ~10 ms                                                                     | Better, +20% recall            |
| BGE-M3 (FP16)             | 1024 | ~2.2 GB           | ~55 ms ([Superlinked](https://superlinked.com/models/baai-bge-m3--score/)) | Best, multilingual, 8K context |
| Nomic Embed Text v2 (MoE) | 768  | ~600 MB           | ~8 ms (only 305M of 475M active)                                           | Comparable to BGE-base         |
| EmbeddingGemma-300M       | 768  | <200 MB quantized | ~4 ms                                                                      | Fast, edge-optimized           |

For mixed code+prose at this scale, **BGE-small-en-v1.5** is the recommendation. It's the FastEmbed default ecosystem variant, runs CPU-comfortably (so you don't tie up the GPU when doing voice-clone work), and the quality gap to BGE-base is small at <100K docs.

Sources:

- [BentoML's 2026 open-source embedding guide](https://www.bentoml.com/blog/a-guide-to-open-source-embedding-models)
- [Best Embedding Models 2026 — pecollective](https://pecollective.com/tools/best-embedding-models/)

---

## 4. Memgraph node-vectors — can we use what we already have?

### What Memgraph supports

- `CREATE VECTOR INDEX index_name ON :Label(property) WITH CONFIG {dimension: 384, capacity: 100000}` — supported since v3.x, USearch-backed (same library as `pgvector`/`Qdrant` use)
- Metrics: `cos`, `ip`, `l2sq`, plus 7 more
- Memory-efficient single-store index (66–76% RAM reduction in v3.8)
- Query: `CALL vector_search.search("name", limit, [vec])` returns `(distance, node, similarity)`

Source: [Memgraph vector search docs](https://memgraph.com/docs/querying/vector-search), [Memgraph 3.8 release](https://memgraph.com/blog/memgraph-3-8-release-atomic-graphrag-vector-single-store-parallel-runtime) (2026-02).

### What Memgraph's MCP server exposes

Source: [Memgraph MCP intro blog](https://memgraph.com/blog/introducing-memgraph-mcp-server) (2025-04-03)

> "As we just started building the server, currently it offers: `run_query()`, `get_schema()`."

That's it. **No vector-search-specific tool** is exposed via MCP. To use Memgraph for memory you'd:

1. Write a hook that generates an embedding (so you still need a separate embedding service)
2. Call `run_query("CREATE (m:Memory {content: $c, embedding: $e})", ...)` from the agent
3. To recall, call `run_query("CALL vector_search.search('mem_idx', 5, $vec) YIELD node RETURN node.content")`

Claude has to hand-write Cypher every single time. The cognitive load is the opposite of what you want from a memory system. **Has anyone documented "Memgraph as Claude Code memory backend"?** No — I searched and found zero blog posts, README sections, or community discussions doing this. The closest is [memory-graph/memory-graph](https://github.com/memory-graph/memory-graph) (194 stars), which **supports** Memgraph as a backend along with Neo4j/FalkorDB/SQLite, but it's a Python pipx install giving you graph-relationship memory (CAUSES, SOLVES, BUILDS_ON, etc.) — different from semantic recall.

### Verdict on Memgraph

**Don't use it as a vector store for this.** The MCP surface is too thin, you'd be writing Cypher from inside the agent for every store/recall, and you still need a separate embedding pipeline. Keep Memgraph for what it's good at — graph queries via your cybersec KB and any future relationship-tracking work. If you later want **graph-based memory** (i.e., "this fix caused that bug, which was solved by X"), look at [`memory-graph/memory-graph`](https://github.com/memory-graph/memory-graph) which can use Memgraph as a backend, but that's a different feature and an additional pipx install.

---

## 5. Integration patterns developers actually use in 2026

### Pattern A — `claude-mem` (the popular one, but be aware)

- **Stars:** 68,843 [GStars.dev](https://www.gstars.dev/repo/thedotmack/claude-mem) | active April 2026
- **Stack:** Chroma + SQLite FTS5 + agent-sdk for compression + custom worker on **port 37777**
- **Hooks:** SessionStart, UserPromptSubmit, PostToolUse, Stop, SessionEnd, PreCompact (smart install)
- **What works:** Continuous per-tool-call capture, hybrid retrieval, ~10x token savings claimed, costs <$1/mo on Haiku for compression
- **What's broken** (DataCamp guide April 2026, paraphrased):
  - **Security: HIGH risk** per [Issue #1251 audit, opened 2026-02-26](https://github.com/thedotmack/claude-mem/issues/1251)
    - C-1: Path traversal in `smart_unfold` / `smart_outline` MCP tools — can read SSH keys, .env files
    - C-2: 30+ HTTP endpoints on port 37777 with **zero authentication** — any local process can dump all your captured coding observations + cleartext API keys via `/api/settings`
    - C-3: Default `0.0.0.0` bind — if you misconfigure or run on a multi-tenant box, the entire LAN can read your memory
    - C-4: API keys returned in plaintext from `/api/settings`
  - **Reliability:** Chroma subprocess leaks (one user reported 184 orphaned processes consuming 16 GB in 19 hours), empty parameter schemas on `search`/`timeline`, cold-start timeouts on Apple Silicon
  - **Context flood:** First week of a new project floods context with discoveries

  Source: [DataCamp claude-mem guide, April 2026](https://www.datacamp.com/tutorial/claude-mem-guide). Verdict from that guide: _"Run this on a personal dev machine only."_ The user's rtx01 is a personal dev machine, but it also runs production VoiceKeep services on the same box. **The unauthenticated 37777 listening locally on a box that also serves prod traffic is a real failure mode.**

### Pattern B — `memsearch` (Zilliz, the cleaner alternative)

- **Stars:** 1,500 — recent (v0.4.1 **2026-04-30**, today!) | open-sourced March 2026
- **Stack:** Milvus Lite (single file, embedded) + ONNX BGE-M3 (CPU) + Markdown source-of-truth files
- **Hooks:** Stop hook captures conversation turns; LLM auto-invokes memory tools contextually
- **Install:** `/plugin marketplace add zilliztech/memsearch && /plugin install memsearch`
- **What's distinctive:** Markdown is the source of truth, Milvus is a _rebuildable shadow index_. Human-readable, version-controllable. No background worker on a network port.
- **Trade-off:** Milvus Lite is single-process — can't share between multiple Claude instances cleanly. But you don't run multiple Claude instances anyway.

### Pattern C — `mem0` (cloud-managed or self-hosted)

- Cloud free tier: 10K memories, 1K retrievals/month
- Pro plan for graph memory: **$249/month**
- Self-hosted: Qdrant + Ollama (`bge-m3`) + optional Neo4j → 11 MCP tools, 15-min setup
- Source: [DEV.to self-hosted mem0 guide](https://dev.to/n3rdh4ck3r/how-to-give-claude-code-persistent-memory-with-a-self-hosted-mem0-mcp-server-h68) (Feb 2025 — note: 14 mo old, may be slightly stale)
- Marketing claims: "90% lower token usage, 91% faster, +26% accuracy on LOCOMO" (Mem0 internal benchmark)

### Pattern D — direct Qdrant MCP (the recommended path)

- Two tools: `qdrant-store`, `qdrant-find`
- Hooks: **none required** — Claude calls the tools when prompted by `CLAUDE.md` instructions
- This is intentionally simpler than claude-mem. **You** decide when to remember; Claude calls `qdrant-find` based on a `CLAUDE.md` hint.
- Trade-off: no automatic capture. Pro: no security exposure, no subprocess leaks, you stay in control.

### Pattern E — anthropic/server-memory (key-value, no vectors)

The official `@modelcontextprotocol/server-memory` (v2026.1.26, latest npm) is **knowledge-graph based, not vector-based** — it's entity/relation/observation triples stored in a JSON file. Useful for "remember Alex's preferences" but not for semantic search across thousands of docs. You're already doing this via your file-based MEMORY.md system — adding the official memory MCP duplicates that work.

### Failure modes to watch for (across all patterns)

1. **Memory drift**: stored embeddings stale when you change embedding models — must re-embed everything. Mitigation: pick a model, commit to it for 12+ months.
2. **Recall noise**: top-3 vector hits often include 1 irrelevant result. Mitigation: filter by metadata (project, date), use hybrid (vector + BM25) when DB supports it.
3. **Embedding mismatch**: storing with one model, querying with another. Mitigation: pin model in MCP env vars, fail loudly if changed.
4. **Capture explosion**: claude-mem-style continuous capture eats disk fast. ~50–200 MB/month per active project. Mitigation: TTL (30 days) on memories with no recall, or scope to "decisions/learnings only" not raw tool output.
5. **"Remembered the wrong thing"**: agent confidently recalls an outdated decision. Mitigation: always include `created_at` in metadata, surface it in the tool response, and let Claude reason about staleness.
6. **Security exposure** (claude-mem-specific but watch all of them): unauthenticated local APIs on well-known ports.

---

## 6. Real-world testimonials — what's the steady-state value?

| Source                                                                                                                             | Tool                        | Verdict                                                                                                                                                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [DataCamp claude-mem guide, April 2026](https://www.datacamp.com/tutorial/claude-mem-guide)                                        | claude-mem                  | "Solves a genuine problem... but security gaps make it unsuitable for shared machines, cloud VMs, or sensitive environments. For isolated personal development workflows, the tradeoffs are manageable."         |
| [XDA Developers, 2026-04-24](https://www.xda-developers.com/gave-claude-code-persistent-memory-and-now-its-unstoppable/)           | **Beads (NOT a vector DB)** | Author found _Beads_ solved most of their memory problem — structured task tracking outside the LLM. Worth noting because the user already runs Beads.                                                           |
| [Milvus blog, March 2026](https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md) | memsearch                   | "Markdown source of truth, semantic shadow index" — claimed zero token overhead, claimed semantic recall actually works                                                                                          |
| [Mem0 blog](https://mem0.ai/blog/claude-code-memory)                                                                               | Mem0 cloud                  | Marketing claims 90% token reduction, 91% faster, +26% LOCOMO accuracy — internal benchmark, not third-party verified                                                                                            |
| [HN #45439997](https://news.ycombinator.com/item?id=45439997) "RAG Obituary"                                                       | n/a                         | Loud minority view: "long context killed RAG, just use big context windows." User has 1M context already, so this is partly true — vector DBs are now for **cross-session continuity**, not in-session retrieval |

**Cost reports across the field:**

- claude-mem: <$1/mo (Haiku compression) or $0 (Gemini/OpenRouter free tier)
- memsearch: $0 self-hosted
- Qdrant local: $0 (Docker on existing hardware)
- Pinecone Starter: $0 until 5M embedding tokens, then $50/mo
- Mem0 cloud free: $0 until 1K retrievals, then $249/mo for graph
- Mem0 self-hosted: $0 + Ollama runtime cost

---

## 7. Recommended architecture for THIS user

### What's already covered

- **memory-keeper SQLite (4.8 MB)** → cross-session decisions/progress, search by category, checkpoints. Strong for "what did we decide last session." Weak for "find every place I've discussed CSP in any project."
- **File-based MEMORY.md per project (332 .md files, 2.1 GB)** → human-readable, version-controllable, agent-loaded on session start. Strong for project-specific facts. Weak for cross-project semantic search.
- **Memgraph (port 7687)** → graph queries, cybersec KB. Currently no vectors stored, MCP is run_query/get_schema only.
- **Beads** → issue tracking. Already great. Don't touch.
- **agent-memory directory (24KB)** → small, agent-specific.

### The gap

**Cross-session, cross-project semantic recall.** Specifically:

- "Where have I implemented CSP nonce systems before?" — answer should hit voice-clone, alexmayhew-dev, and TraceForge memory simultaneously
- "What was that BGE embedding latency benchmark I read?" — answer in this very doc, semantically searchable
- "Have I seen this Cloudflare error before?" — answers across all 14 projects' memories

memory-keeper's `context_search_all` does cross-session text search but it's keyword, not semantic. File-based memory requires you to know which file to grep.

### Why local Qdrant + BGE-small wins for this user

1. **Zero cloud cost, zero egress** (the user just got bitten by Sentry quota — sensitivity is real)
2. **RTX 3080 already there** — embeddings are <10 ms even on CPU at this model size, GPU not needed
3. **No new MCP security surface** like claude-mem's 37777 port (Qdrant's 6333 is bound to Docker localhost by default and serves binary protocol, not an unauth HTTP API)
4. **Two clean MCP tools**: `qdrant-store(content, metadata)` and `qdrant-find(query, limit)` — no Cypher to hand-write like Memgraph
5. **Per-project collections**: scope memories cleanly via `COLLECTION_NAME` in env, or pass metadata `{"project": "alexmayhew-dev"}` for cross-project recall
6. **Coexists with everything else** — memory-keeper, file memory, Memgraph all unchanged. This is additive, not replacement.

### Why NOT the alternatives (terse)

- **(A) Keep current stack** — leaves the cross-project semantic recall gap. The user explicitly wants this.
- **(B) Pinecone free tier** — embedding token quota will run out, integrated-embedding lock-in defeats the RTX 3080.
- **(C) Memgraph node-vectors** — MCP exposes only run_query, agent has to write Cypher every recall. Painful UX.
- **(E) claude-mem** — popular but security audit is ugly (port 37777 unauth, path traversal). Same box runs prod VoiceKeep services. Not worth the risk.

### Why not LanceDB / Chroma standalone

Both work. Both have weaker MCP ecosystems. Qdrant's MCP is the only one with 1.4K stars + official maintainer, which matters for "will this work in 6 months."

### What about adding `memsearch` LATER?

memsearch is genuinely interesting (Markdown source-of-truth + Milvus shadow index, just released v0.4.1 on 2026-04-30). It's a stronger automation story than raw Qdrant. Recommendation: **start with raw Qdrant for 30 days**, see how often Claude actually calls it, what kinds of queries land. Then decide whether to layer memsearch's auto-capture on top, or stay manual.

---

## 8. Cost projection — 5 architectures

Assumes one moderately active developer, ~30K queries/year, ~100K stored memories at 768-dim, 12-month horizon.

| Option                                                   | Storage              | Query            | Embedding                                   | Total Y1                                                 |
| -------------------------------------------------------- | -------------------- | ---------------- | ------------------------------------------- | -------------------------------------------------------- |
| **(A) Status quo** (memory-keeper + files)               | $0                   | $0               | $0                                          | **$0** but gap unfilled                                  |
| **(B) Pinecone Starter** (until quota)                   | $0 (until 2 GB)      | $0 (until 1M RU) | $0 (until 5M tokens)                        | **$0** for ~2 months, then **$600/yr** ($50/mo Standard) |
| **(C) Memgraph existing**                                | $0 (already running) | $0               | ~$30 if using OpenAI text-embedding-3-small | **$30/yr** + huge agent-UX cost (Cypher hand-coding)     |
| **(D) Local Qdrant + BGE-small (FastEmbed CPU)**         | $0 (disk on rtx01)   | $0               | $0 (local)                                  | **$0**                                                   |
| **(E1) claude-mem (default Chroma + Haiku compression)** | $0                   | $0               | $0 (local Chroma)                           | **$12/yr** Haiku — but security risk                     |
| **(E2) Self-hosted mem0 (Qdrant + Ollama)**              | $0                   | $0               | $0 (Ollama local)                           | **$0** + 3-service ops overhead                          |

**Winner on cost AND security AND simplicity: (D).**

---

## 9. MCP config snippet — drop into `~/.claude/settings.json`

```jsonc
{
	"mcpServers": {
		// ... existing servers ...
		"qdrant-memory": {
			"type": "stdio",
			"command": "uvx",
			"args": ["mcp-server-qdrant"],
			"env": {
				"QDRANT_URL": "http://localhost:6333",
				"COLLECTION_NAME": "claude-mem-default",
				"EMBEDDING_PROVIDER": "fastembed",
				"EMBEDDING_MODEL": "BAAI/bge-small-en-v1.5",
				// Optional: scope tool prompt so Claude knows when to use it
				"TOOL_STORE_DESCRIPTION": "Store a learning, decision, or pattern for cross-session recall. Use proactively when the user makes a decision, you discover a non-obvious fact, or you debug a tricky issue.",
				"TOOL_FIND_DESCRIPTION": "Search prior sessions across all projects for relevant memories. Use BEFORE asking the user about anything that might already be documented.",
			},
		},
	},
}
```

### Per-project collection trick

If you want stricter project isolation, override `COLLECTION_NAME` per-project via `.claude/settings.local.json`:

```jsonc
{
	"mcpServers": {
		"qdrant-memory": {
			"env": { "COLLECTION_NAME": "alexmayhew-dev" },
		},
	},
}
```

But **the better default** is one global collection (`claude-mem-default`) with `{project: "..."}` metadata — that lets you do cross-project semantic search ("find every CSP discussion across my projects") which is the killer feature.

### CLAUDE.md hint to make Claude actually use it

Add to `~/.claude/CLAUDE.md` under a new "Semantic Memory" section:

```md
## Semantic Memory (qdrant-memory MCP)

Persistent vector recall across all sessions and projects via local Qdrant.

- BEFORE answering complex questions or starting non-trivial work, call
  `qdrant-find` with a paraphrase of the user's question. If hits are
  relevant, cite them.
- AFTER making a decision, debugging a non-obvious issue, or learning a
  project-specific fact: call `qdrant-store` with a self-contained summary
  (≥40 words, includes the WHY and any version/dates). Add metadata
  `{project: "<dirname>", category: "decision|learning|pattern|gotcha"}`.
- DO NOT store credentials, secrets, .env contents, or anything wrapped
  in `<private>` tags.
```

### Docker compose alternative (cleaner than `docker run`)

```yaml
# /home/deploy/qdrant/docker-compose.yml
services:
  qdrant:
    image: qdrant/qdrant:latest
    container_name: qdrant
    restart: unless-stopped
    ports:
      - "127.0.0.1:6333:6333" # bind localhost only — no LAN exposure
      - "127.0.0.1:6334:6334"
    volumes:
      - /home/deploy/.claude/qdrant-data:/qdrant/storage
```

`docker compose up -d` and you're done.

---

## 10. Failure modes to watch for + how to test before committing

### Pre-commit checklist (run all of these BEFORE adding to daily workflow)

```bash
# 1. Confirm Qdrant is up and persistence works
curl -s http://localhost:6333/collections | jq .

# 2. Confirm MCP server starts cleanly
uvx mcp-server-qdrant --help

# 3. From Claude Code: store and recall a known fact
# In Claude: "Store this: alexmayhew.dev deploys via OpenNext to Cloudflare Pages"
# Restart Claude. New session: "Where does alexmayhew.dev deploy?" — should hit memory
```

### Failure modes specific to this setup

1. **Embedding model swap breaks recall.** If you change `EMBEDDING_MODEL` later, all prior vectors become unreachable. **Mitigation:** pin to BGE-small-en-v1.5, write that in CLAUDE.md, don't change for 12 mo. If you must change, re-embed from raw text (which is why metadata `original_text` matters — don't compress before embedding).

2. **Qdrant container forgets data on `docker rm`.** Always use the named volume `/home/deploy/.claude/qdrant-data`. Add it to your backup rotation.

3. **Claude doesn't call `qdrant-find` proactively.** If hints in CLAUDE.md aren't strong enough, Claude will skip it. Test by asking ambiguous questions you've previously answered. If hit rate <50%, sharpen the CLAUDE.md prose ("ALWAYS call qdrant-find before...").

4. **Stale memories.** A memory from 6 months ago says "we use Listmonk" but yesterday you migrated to Beehiiv. Mitigation: **always include `created_at` in metadata** and instruct Claude to surface it in responses. Better: when discovering a contradiction, store the new memory AND mark the old one with `superseded_by: <id>`.

5. **Memory pollution from junk turns.** If you accidentally store "the user asked me to print hello world", recall results get noisy. Mitigation: short, structured CLAUDE.md prompt that emphasizes WHEN not to store ("only when... 40+ word self-contained...").

6. **Multiple Claude instances corrupting Qdrant.** Qdrant handles concurrent writes fine. But if you ever scale to multiple machines, you'll need to migrate from Docker localhost to a real network bind + auth — at which point the simplicity argument starts breaking and you'd reconsider.

7. **Disk creep.** Embeddings are small (3 KB per 384-dim float32 vector + metadata) but at 100 stored/day = ~50 MB/year. Trivially small. But if you adopt continuous capture (claude-mem-style) on top, that's 100 MB/month per project. Plan accordingly.

### Trip-wires (alarms that mean rip it out)

- **Recall hit rate <30%** after 30 days of use → MCP isn't being called enough; either fix CLAUDE.md or this just isn't useful for your workflow
- **>5 false-confident wrong recalls per week** → memories aren't surfacing dates/staleness; rip out and rethink
- **Docker container OOM or CPU spike** → unlikely at this scale, but if so move to scalar quantization or smaller model

### When to revisit / migrate up

- **Have a real team using it** → migrate to Qdrant Cloud Hybrid ($0.014/hr) or Weaviate Cloud ($25/1M dim)
- **Need >1M memories** → Qdrant local handles this fine; only revisit if performance degrades
- **Want graph relationships** ("this fix caused that bug, solved by X") → layer [memory-graph/memory-graph](https://github.com/memory-graph/memory-graph) on top, using your existing Memgraph as the backend
- **Want auto-capture without writing prompts** → swap to `memsearch` (Milvus + Markdown source-of-truth) once it hits v1.0 stability

---

## Sources (verification dates)

| Source                                  | URL                                                                                                        | Date verified | Notes                                                           |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------- | --------------------------------------------------------------- |
| Pinecone MCP repo                       | https://github.com/pinecone-io/pinecone-mcp                                                                | 2026-04-30    | 65 stars, v0.2.1 (2026-02-05)                                   |
| Pinecone MCP docs                       | https://docs.pinecone.io/guides/operations/mcp-server                                                      | 2026-04-30    | Integrated-embedding-only constraint                            |
| Pinecone Plugin blog                    | https://www.pinecone.io/blog/pinecone-plugin-for-claude-code/                                              | 2026-04-30    | Published 2026-02-11                                            |
| Pinecone pricing                        | https://www.pinecone.io/pricing/                                                                           | 2026-04-30    | Starter free tier limits                                        |
| Qdrant MCP repo                         | https://github.com/qdrant/mcp-server-qdrant                                                                | 2026-04-30    | 1.4K stars, v0.8.1 (2025-12-10)                                 |
| Qdrant MCP setup                        | https://www.claudedirectory.org/mcp-servers/qdrant                                                         | 2026-04-30    | Install commands                                                |
| Memgraph vector docs                    | https://memgraph.com/docs/querying/vector-search                                                           | 2026-04-30    | Syntax, USearch backend                                         |
| Memgraph 3.8 release                    | https://memgraph.com/blog/memgraph-3-8-release-atomic-graphrag-vector-single-store-parallel-runtime        | 2026-04-30    | Released Feb 2026                                               |
| Memgraph MCP intro                      | https://memgraph.com/blog/introducing-memgraph-mcp-server                                                  | 2026-04-30    | **Stale (April 2025)**, only 2 tools — likely no updates since  |
| claude-mem repo                         | https://github.com/thedotmack/claude-mem                                                                   | 2026-04-30    | 68K+ stars, latest v6.5.0 / v12.4.9                             |
| claude-mem security audit (Issue #1251) | https://github.com/thedotmack/claude-mem/issues/1251                                                       | 2026-04-30    | Opened 2026-02-26, 4 critical, 6 medium                         |
| DataCamp claude-mem guide               | https://www.datacamp.com/tutorial/claude-mem-guide                                                         | 2026-04-30    | April 2026, balanced verdict                                    |
| memsearch repo                          | https://github.com/zilliztech/memsearch                                                                    | 2026-04-30    | 1.5K stars, v0.4.1 (2026-04-30 — TODAY)                         |
| Milvus blog (memsearch)                 | https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md    | 2026-04-30    | March 2026                                                      |
| Mem0 Claude Code                        | https://mem0.ai/blog/claude-code-memory                                                                    | 2026-04-30    | Cloud + self-host options                                       |
| Self-hosted mem0 guide                  | https://dev.to/n3rdh4ck3r/how-to-give-claude-code-persistent-memory-with-a-self-hosted-mem0-mcp-server-h68 | 2026-04-30    | **Stale (Feb 2025, 14 mo old)** but architecturally still valid |
| RAG MCP guide                           | https://github.com/michelabboud/claude-code-helper/blob/main/guides/RAG-MCP-GUIDE.md                       | 2026-04-30    | Redis/Qdrant/Chroma benchmark                                   |
| memory-graph repo                       | https://github.com/memory-graph/memory-graph                                                               | 2026-04-30    | 194 stars, v0.12.4 Feb 2026                                     |
| BentoML embeddings 2026                 | https://www.bentoml.com/blog/a-guide-to-open-source-embedding-models                                       | 2026-04-30    | Best models inventory                                           |
| Best embeddings 2026                    | https://pecollective.com/tools/best-embedding-models/                                                      | 2026-04-30    | MTEB scores + pricing                                           |
| BGE-M3 latency                          | https://superlinked.com/models/baai-bge-m3--score/                                                         | 2026-04-30    | 55.2 ms p50                                                     |
| Existing project research               | docs/research/rag-vector-db-embedding-models-2026.md                                                       | 2026-03-14    | Cross-checked Pinecone pricing                                  |
| Existing project research               | docs/research/cloudflare-vectorize-rag-blog-chat-2026.md                                                   | 2026-02-17    | Vectorize as comparison point                                   |

**Sources older than 12 months flagged:** Memgraph MCP intro (April 2025), self-hosted mem0 guide (Feb 2025). Both are architectural and remain valid; verify current install commands against repos before using.

---

## Final answer

Run **Option D**: local Qdrant in Docker + `mcp-server-qdrant` + BGE-small-en-v1.5 via FastEmbed. $0/year. ~10-min install. Layered on top of (not replacing) your existing memory-keeper, file-based MEMORY.md, Memgraph, and Beads. Test for 30 days. If recall hit-rate >50% and Claude actually surfaces past decisions, keep it. If not, `docker rm qdrant` and you're back where you started with zero collateral damage.
