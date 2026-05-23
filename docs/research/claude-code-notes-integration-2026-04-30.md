# Claude Code + Notes Integration Research (2026-04-30)

**Status:** CURRENT
**Session:** Deep research into Obsidian + alternative note systems for Claude Code, with an opinionated recommendation for this user.

---

## TLDR

**Recommendation:** Adopt **kepano/obsidian-skills** + **@bitbonsai/mcpvault** for your existing `~/Documents/amdev-content-vault`. Skip Local REST API plugin. Keep file-based auto-memory and memory-keeper as-is — they serve different purposes.

**Why not the others:** Notion MCP is excellent but cloud-only and your content+drafts already live in Obsidian. Logseq's outliner doesn't match your existing markdown habit. The most-starred Obsidian MCP (Markus Pfundstein, 3.5k stars) is abandoned since Nov 2024. The "officially blessed" path is now Steph Ango's (Obsidian CEO) skills repo + a thin filesystem MCP — that's mcpvault.

### 3-step quickstart (15 min)

```bash
# 1. Drop Steph Ango's skills into the vault
cd /home/deploy/Documents/amdev-content-vault
mkdir -p .claude
git clone https://github.com/kepano/obsidian-skills.git .claude/skills-tmp
mv .claude/skills-tmp/skills .claude/skills
rm -rf .claude/skills-tmp

# 2. Register mcpvault MCP server with Claude Code (user scope = available everywhere)
claude mcp add-json obsidian --scope user '{
  "type": "stdio",
  "command": "npx",
  "args": ["@bitbonsai/mcpvault@latest", "/home/deploy/Documents/amdev-content-vault"]
}'

# 3. Start Claude Code FROM the vault (or any project), test it
cd /home/deploy/Documents/amdev-content-vault
claude
> /mcp     # confirm "obsidian" is connected
> List my pillars and summarize each
```

That's the minimum useful setup. Everything below justifies why and shows where to go from here.

---

## 1. Obsidian + Claude Code in 2026

### The 8-server landscape (chatforest review, April 2026)

| Server                              | Stars | Lang   | Architecture         | Status                             |
| ----------------------------------- | ----: | ------ | -------------------- | ---------------------------------- |
| MarkusPfundstein/mcp-obsidian       |  3.5k | Python | REST API plugin      | **Stale (Nov 2024) — avoid**       |
| **bitbonsai/mcpvault**              |  1.2k | TS     | Direct filesystem    | **Active — recommended**           |
| jacksteamdev/obsidian-mcp-tools     |   768 | TS     | REST API plugin      | Stale (Jul 2025)                   |
| StevenStavrakis/obsidian-mcp        |   695 | TS     | Direct filesystem    | Stale (Jun 2025)                   |
| cyanheads/obsidian-mcp-server       |   480 | TS     | REST API plugin      | Stale (Oct 2025)                   |
| newtype-01/obsidian-mcp             |   302 | JS     | REST API plugin      | Stale                              |
| **aaronsb/obsidian-mcp-plugin**     |   295 | TS     | Native plugin (BRAT) | Active — most powerful, beta       |
| iansinnott/obsidian-claude-code-mcp |   264 | TS     | Native plugin        | Active (Jun 2025) — IDE diff tools |

### The 3 architectures

1. **Direct filesystem** (mcpvault, Steven's obsidian-mcp): MCP server reads/writes `.md` files directly. Works whether Obsidian is open or closed. No plugins needed. Simplest, safest, fastest. **Trade-off:** can't see Obsidian-internal stuff like Dataview query results, graph data, or live workspace state.

2. **Local REST API plugin bridge** (Markus, jacksteamdev, cyanheads): MCP server calls Obsidian's REST API plugin running on `localhost:27124`. Requires Obsidian to be open. Has access to Obsidian internals (commands, search). **Open data-loss bug** in Local REST API v3.6.x (issue #237) — POST endpoint can silently overwrite files when metadata cache misses. Not theoretical; reported in production.

3. **Native MCP plugin** (aaronsb, iansinnott): MCP server runs _inside_ Obsidian as a community plugin, exposing the full Obsidian API including graph, Dataview, Bases. Most capable. Requires Obsidian open + plugin install (often via BRAT for beta).

### What mcpvault exposes (14 tools)

`read_note`, `write_note`, `patch_note`, `delete_note`, `move_note`, `move_file`, `list_directory`, `read_multiple_notes` (batch), `search_notes` (BM25 + reranking), `get_frontmatter`, `update_frontmatter`, `get_notes_info`, `get_vault_stats`, `manage_tags`. Whitelist: `.md`, `.markdown`, `.txt`, `.base`, `.canvas`. Excludes `.obsidian`, `.git`, `node_modules`. Path-traversal protected (cannot escape vault). npm package confirmed: `@bitbonsai/mcpvault@0.11.0`, last published 2026-03-22.

**Key install detail:** `npx @bitbonsai/mcpvault@latest /path/to/vault` — vault path is positional. No env vars, no API key, no plugin. Stdio transport (no network exposure).

### What aaronsb's plugin adds (when you outgrow mcpvault)

Same file ops, but adds: `Graph` (link traversal), `Dataview` (run DQL queries from Claude), `Bases` (database-view operations), `Workflow` (contextual action suggestions). HTTP transport on port 3001 with bearer token. Use this when you want Claude to answer "what notes link to this concept?" graph-traversal questions. For your current 75-note content vault, this is overkill — but if you ever build a research/PKM vault with 1000+ interconnected notes, switch to it.

### Local REST API plugin — when do you need it?

Only if you specifically want Claude to: (a) execute Obsidian commands (open files in your live editor, trigger templates), (b) see "active file" in your workspace, or (c) work with the cyanheads or Markus servers. **You don't need it for content workflows.** And the data-loss bug is a real concern as of v3.6.x.

### Multi-vault support

mcpvault and Steven's obsidian-mcp both take vault path as a CLI arg. To use multiple vaults, register multiple MCP servers (`obsidian-content`, `obsidian-personal`). aaronsb's plugin runs _per-vault_ (one Obsidian process per vault, one port per vault).

### Permissions / safety

- **mcpvault**: full read+write within vault, path-traversal protected. The README itself says: "Only grant vault access to trusted AI conversations." There is no read-only mode. Mitigation: `git init` your vault, commit, and Claude's destructive moves become recoverable. Eleanor Konik (12M-word vault) does exactly this — Claude broke ~10min of links during folder reorgs and `git restore` fixed it instantly.
- **Steven's obsidian-mcp**: README warning is blunt — "PLEASE backup your Obsidian vault prior to using obsidian-mcp."
- **Local REST API**: HTTPS with API key, but the v3.6.x POST data-loss bug means even the secure path can corrupt notes silently.

### Vault-size scaling (real reports from Obsidian forum, 2026)

- **75 notes (you):** zero issues, fits in context easily
- **~1k notes:** still fits in token budget for most operations; search is fast
- **~4k notes:** reported token-budget pressure, "RAG-based approaches superior for summarization" — i.e., you start needing vector search
- **~20k notes:** semantic search becomes weak, need real vector DB (Qdrant, etc.)
- **12M words / ~10k+ notes (Eleanor Konik):** still works but she relies on Claude to _write scripts_ against the vault rather than reading everything; she also abandoned strict deduplication

Translation: mcpvault BM25 + rerank is plenty for you for the foreseeable future. Don't pre-optimize for vector search.

### What "summarize my notes on X" actually looks like

Real workflow from haihai.ai (writing 2,000 words in 90 min):

1. Create `interview-questions.md` in vault
2. In Claude Code: `> Read interview-questions.md, then ask me each question one at a time. Update the doc with my answers as we go.`
3. Dictate answers (SuperWhisper or just type), Claude calls `patch_note` after each
4. `> Now create interview-edited.md — keep my voice, tighten language, no rewrite.`
5. Manual final pass in Obsidian

That's the pattern. File-as-shared-state, Claude reads/writes, you steer.

---

## 2. Alternative note systems

### Notion (official Anthropic-affiliated MCP)

- **Status:** Notion ships an official hosted MCP server. OAuth, no API key needed. One-click install in Claude Desktop. Self-hosted version also available (open-source).
- **Capabilities:** Read/write any page or database the user has access to. Search workspace. Create databases. Generate PRDs, tech specs, meeting notes.
- **Strengths vs Obsidian:** Cleanest auth flow in the entire MCP ecosystem. Real database queries (not just markdown). Multi-user/team-ready. Mobile sync free out of the box. Cloud backup automatic.
- **Weaknesses vs Obsidian:** Cloud-only (your data leaves your machine). Block-based editor — markdown export is lossy. No git. AI dependency on Notion's uptime. Slower iteration than local files. Cannot easily ingest existing markdown.
- **Verdict for you:** If you were starting from zero with no existing system, Notion MCP would be the _fastest_ path. But you have an existing 75-note Obsidian vault and a content-creation workflow built on markdown. Migrating to Notion is net-negative.

### Logseq

- **MCP servers exist:** ergut/mcp-logseq (Python, REST API), griederer/logseq-mcp-tools v4.0 (TS, full feature), muckers/mcp-logseq-rust (Rust). All require Logseq's Local HTTP API enabled (Settings → Features → HTTP APIs server → generate token).
- **Tools:** list pages, read page, create/update page, search graph.
- **Strengths:** Outliner is great for thinking-in-bullets. Block-level references make granular linking trivial. Local-first like Obsidian.
- **Weaknesses:** Outliner forces bullet-tree structure — bad fit for blog drafts and long-form content. Graph DB mode is still experimental in 2026. Smaller community than Obsidian. **Not a fit for content/blog workflows.**

### Anytype

- MCP server exists (anytype-mcp via mcp.harishgarg.com). E2E encrypted, local-first, P2P sync. Object-oriented model (every note is a typed object).
- **Why not for you:** It's a niche power-user system; the model is closer to a personal Notion than to Obsidian. Steeper learning curve. Smaller MCP ecosystem.

### Roam Research

- No active well-known MCP server as of April 2026. Older community efforts exist but are dormant. Cloud-only, expensive ($165/yr), declining mindshare since Logseq forked the model.
- **Skip.**

### Foam (VS Code extension)

- Just markdown files in a folder. No special MCP server needed — point any filesystem-MCP (Desktop Commander, mcpvault, or Anthropic's official `@modelcontextprotocol/server-filesystem`) at the folder.
- **When this makes sense:** if you want zero ceremony and live entirely in VS Code. But you already use Obsidian, so no upside.

### Joplin

- Two MCP servers: dweigend/joplin-mcp-server (Python) and alondmnt/joplin-mcp (with bundled skills). Requires Joplin's Web Clipper service running locally for API.
- **Strengths:** E2E encrypted sync. Cross-platform (mobile included). Open source.
- **Weaknesses:** Notes stored in SQLite (not flat markdown), so version control is awkward. Plugin ecosystem nowhere near Obsidian's.
- **Skip unless** you specifically need E2E-encrypted multi-device sync and Obsidian Sync ($96/yr) is a dealbreaker.

### Standard Notes

- E2E encrypted. No public production-grade MCP server. Skip.

### Plain markdown directory + filesystem MCP

- Anthropic's `@modelcontextprotocol/server-filesystem` works against any folder. Plus Desktop Commander for shell ops.
- **When this makes sense:** if you don't care about UI for reading notes (you only edit in vim/VS Code) and don't want app dependencies.
- **For you:** you already have Obsidian and use it. mcpvault gives you BM25 search + frontmatter + tag tools that raw filesystem-mcp doesn't.

### Day One / journaling apps

- No production MCP servers as of April 2026. iCloud-locked. Skip.

---

## 3. The "second brain for AI agents" pattern in 2026

### Dominant pattern (synthesized across 8+ guides)

**Three layers**, recommended by multiple sources (pixelnthings, mibii dev.to, codewithseb):

1. **Layer 1 — Identity/conventions** (`CLAUDE.md` at vault root): under 100 lines. Naming conventions, voice rules, vault structure, what to ignore. _Stable, slow-changing._
2. **Layer 2 — Curated notes** (Obsidian vault): your actual thinking, drafts, decisions, research. _Human-authored, AI-edited._
3. **Layer 3 — Vector recall** (Pinecone, Qdrant, Cognee — only when needed): for vaults > ~5k notes where context loading is expensive.

Most users never reach layer 3. You won't either at 75 notes.

### Note ingestion — what actually wins

Surveying current setups: **note tree traversal + BM25 search + explicit context loading** beats embedding/vector for vaults under ~5k notes. Reasons: (a) markdown files are already the unit of recall, (b) BM25 + rerank in mcpvault is fast and deterministic, (c) Claude's 1M context can hold _a lot_ of notes — you can `read_multiple_notes(["a.md","b.md","c.md"])` and let context handle synthesis.

Vector search is necessary at scale but adds infrastructure (embeddings, vector DB, sync pipeline). Defer it.

### Source-of-truth question

The cleanest model that's emerging:

- **Obsidian vault = source of truth for human knowledge** (decisions, research notes, drafts)
- **File-based auto-memory** (`.claude/projects/*/memory/MEMORY.md`) **= source of truth for AI session state** (how I work, what's broken, what I learned this week)
- **Memory-keeper MCP = ephemeral session-context buffer** (in-flight progress, pre-compaction snapshots)

These don't overlap. Obsidian holds _what you think_. Memory files hold _how Claude should behave with you_. Memory-keeper holds _what's happening right now_.

### "Daily standup with Claude" workflows (real, documented)

Eugeniu Ghelbur's `obsidian-second-brain` skill (31 commands) and the dev.to "second brain that actually thinks" piece both converge on:

```
Morning: > /daily-start
  → Claude reads yesterday's daily note + active project notes
  → Drafts today's daily note with carry-over tasks + open questions
  → You review and edit

Evening: > /daily-end
  → Claude summarizes what changed in vault today
  → Asks 2-3 reflection questions
  → Appends to daily note

Friday: > /weekly-review
  → Claude reads all 5 daily notes + project notes touched this week
  → Outputs 1-page summary: decisions made, open loops, next week priorities
```

This works. The dev.to author specifically replaced a 30-minute manual weekly-review with a Claude run.

### "What was I working on last Tuesday?" — does it work?

Yes, _if_ you write daily notes. Claude calls `search_notes("project foo Tuesday")` or reads `daily/2026-04-22.md` and answers. The discipline is the daily-note habit, not the tooling. If you don't write daily notes, no MCP server can recover what you didn't capture.

### The contrarian view (Limited Edition Jonathan)

Jonathan argues "markdown isn't memory, it's notes" — markdown can't replace databases (no real querying, no relationships, no schemas, no concurrent access). His system uses SQLite + a graph DB (Kuzu) with 955 structured records.

**He's right at extreme scale and wrong for you.** For a 75-note content vault and a single human user, markdown + BM25 + frontmatter is the right tool. The moment you start needing relationship traversal across thousands of entities (people, papers, claims, books) — switch to SQLite or a graph DB. Until then, markdown wins on simplicity and durability.

---

## 4. Note-taking + memory hybrid (the real architecture for you)

You already have:

- **File-based auto-memory** at `~/.claude/projects/<project>/memory/` (`MEMORY.md` + topic files like `wave-k-audit-2026-04-17.md`, `feedback_*.md`)
- **memory-keeper MCP** (SQLite at `~/mcp-data/memory-keeper/context.db`, cross-session search)
- **Beads** for issues (`bd ready`, `bd close`)

Adding Obsidian via mcpvault gives you:

- **Curated, human-authored knowledge layer** (your existing content vault, blog drafts, ideas, pillars)
- **Cross-project knowledge** (Obsidian doesn't care which project you're in; it's _yours_)

How they interact:

| Concern                                                          | Lives in                | Why                                                     |
| ---------------------------------------------------------------- | ----------------------- | ------------------------------------------------------- |
| "How does Claude work with me?" (voice rules, TDD, deploy gates) | `MEMORY.md` topic files | Auto-loaded every session. Behavioral, not factual.     |
| "What did Claude and I do last Tuesday?" (in-flight)             | memory-keeper           | Cross-session search, fast.                             |
| "What did I decide about the AEO architecture?" (long-term)      | Obsidian vault          | Human-curated, durable, indexable, surveyable visually. |
| "What's the next task to work on?"                               | Beads                   | Issue tracker, workflow-focused.                        |
| "What's my brand voice / pillar / draft?"                        | Obsidian vault          | Already there.                                          |

**Promote-a-memory pattern:** when memory-keeper accumulates an interesting decision worth keeping, manually copy it into a vault note. Don't automate this — the act of writing it permanently _is_ the curation. Auto-promotion creates landfills.

**Anti-pattern to avoid:** don't move `MEMORY.md` topic files into the vault. They're behavioral instructions for Claude, not knowledge for humans. Keep them where the memory hook expects them.

---

## 5. Documented power-user setups (April 2026)

### A. AgriciDaniel/claude-obsidian — "LLM Wiki" pattern

Inspired by Karpathy's LLM Wiki tweet. Persistent compounding wiki with 6 "wiki modes" (`/wiki`, `/save`, `/autoresearch`). Templater templates per note type. Custom callouts (`[!contradiction]`, `[!gap]`, `[!key-insight]`). Optional MCP via Local REST API. **Stars: niche.** **What's good:** concrete CLAUDE.md templates and skill files you can copy. **What he regrets:** Local REST API + `NODE_TLS_REJECT_UNAUTHORIZED=0` workaround — recommends Obsidian CLI (Option D) as the secure alternative.

### B. eugeniughelbur/obsidian-second-brain — 31-command skill pack

Drop-in skill for Claude Code that adds 31 commands to Obsidian. Vault-first research (Claude searches your notes before searching the web). Scheduled agents for daily/weekly review. Pure skills, no MCP server required (uses filesystem).

### C. Eleanor Konik — 12M-word vault, decade-old

Largest documented vault using Claude+MCP. Uses MCP for: semantic search when keyword recall fails, bulk script generation (rename folders, fix broken links after reorgs), data-format migrations (Dataview → Bases). **What worked:** treating Claude as a vault-script-writer, not as a memory layer. **What she abandoned:** strict deduplication — duplicate filenames _help_ search.

### D. mibii (dev.to) — daily-note-driven workflow

3-method comparison: filesystem direct, MCP bridge, sidebar embed. Recommends MCP bridge (iansinnott's plugin) for power users, filesystem for everyone else. Vault structure: `daily/`, `projects/`, `areas/`, `resources/`, `_inbox/`. Flat, no nesting. **Key insight:** organization of existing notes matters more than tool sophistication. An afternoon cleaning the vault > installing every plugin.

### E. haihai.ai — 2,000-word interview workflow

Already detailed in §1. The pattern: file-as-shared-state, dictate answers, Claude patches the file. This is the most practical "writing" workflow documented in 2026.

---

## 6. Recommended architecture for THIS user

You have:

- 75-note content vault at `/home/deploy/Documents/amdev-content-vault` already structured (Pillars/, Blog-Posts/, Ideas/, Repurposed/, Services/, Templates/, Analytics/)
- Existing file-based auto-memory + memory-keeper + Beads working well
- Strong voice rules, content cadence, brand discipline already encoded
- Linux box with capacity for self-hosted services
- 1M-token Opus 4.7 — context isn't the bottleneck

**Recommendation: Option A, with a specific stack.**

### The stack

1. **Obsidian** (already installed) — UI for human note-curation
2. **kepano/obsidian-skills** at `vault/.claude/skills/` — teaches Claude wikilinks, Bases, Canvas, Defuddle
3. **@bitbonsai/mcpvault** as MCP server — filesystem access, BM25 search, frontmatter, tags. No Obsidian plugins. No REST API. No data-loss bug exposure.
4. **`vault/CLAUDE.md`** — voice rules, vault structure, "search vault before web", under 100 lines
5. **`git init` the vault** — Claude's destructive operations become reversible
6. **Keep file-memory + memory-keeper + Beads as-is** — they serve different purposes
7. **Defer:** aaronsb's native plugin (graph/Dataview) until vault > 1k notes. Defer vector search until vault > 5k notes.

### Why not the alternatives

| Option                                     | Why not                                                                                                     |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| (B) Just expand file-based memory          | File-memory is for _Claude's behavior_, not _your knowledge_. Obsidian gives you a real reading/editing UI. |
| (C) Notion + Notion MCP                    | Cloud-only. Your content vault is markdown. Migration is net-negative for your existing workflow.           |
| (D) Logseq                                 | Outliner forces bullet-tree structure. Bad fit for blog drafts.                                             |
| (E) Foam / plain markdown + filesystem-MCP | You'd lose Obsidian's reading UX for zero engineering gain.                                                 |

### Workflows: user does X → Claude does Y

| User says                                                                | Claude does                                                                                                                  |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| "Read my Pillars folder, draft a blog post on AEO that fits Pillar 3"    | `list_directory("Pillars")` → `read_multiple_notes` → `write_note("Blog-Posts/aeo-pillar-3-draft.md", ...)` with frontmatter |
| "What have I written about AEO before this month?"                       | `search_notes("AEO")` → ranks by BM25 → reads top 5 → summarizes with file-link citations                                    |
| "Update the analytics dashboard note with this week's GA4 numbers"       | `read_note("Analytics/dashboard.md")` → `patch_note` with new section, preserving rest                                       |
| "I'm stuck on X — read my notes on it and ask me 3 sharpening questions" | `search_notes("X")` → reads matches → returns Socratic questions, doesn't write yet                                          |
| "Promote this memory-keeper decision to a permanent note"                | `write_note("Decisions/2026-04-30-decision-name.md", ...)` with structured frontmatter                                       |
| "Reorganize my Ideas folder by topic cluster"                            | Plans the moves first, asks confirmation, then `move_note` in batch. Vault is git-committed → reversible.                    |
| "Friday weekly review"                                                   | Reads daily notes for the week + recent Blog-Posts changes → outputs 1-page summary in `Analytics/weekly-2026-W18.md`        |

### What this WON'T do

- Will not auto-sync to mobile (that's Obsidian Sync $96/yr, or self-host with Syncthing/git)
- Will not give you graph traversal queries ("which notes link to this?") — switch to aaronsb's plugin if you need that
- Will not embed/semantic-search across the vault — defer until you're at 5k+ notes
- Will not replace your file-memory or memory-keeper — those are still doing their jobs

### Honest risks

1. **Destructive ops without git:** `git init` the vault BEFORE first MCP run. Non-negotiable.
2. **Voice contamination:** Claude editing your drafts can drift toward AI-isms. Always keep `Templates/voice-guide.md` in the vault and reference it explicitly in CLAUDE.md.
3. **Vault-as-context bloat:** if Claude reads 20 notes every prompt, you'll burn tokens. Use explicit `read_note` rather than letting Claude wander.
4. **mcpvault is not Anthropic-blessed:** it's community-maintained. The blessed path is _kepano's skills_ (which mcpvault works with). If mcpvault stalls, switch to Steven's obsidian-mcp or aaronsb's plugin — same vault, different door.

---

## Install commands (copy-paste ready, your environment)

```bash
# Step 1 — Clone Steph Ango's official Obsidian skills
cd /home/deploy/Documents/amdev-content-vault
mkdir -p .claude
git clone https://github.com/kepano/obsidian-skills.git /tmp/obsidian-skills
cp -r /tmp/obsidian-skills/skills .claude/skills
rm -rf /tmp/obsidian-skills

# Step 2 — Initialize git for safety (if not already)
git init
git add -A && git commit -m "vault: initial commit before AI ops"

# Step 3 — Add mcpvault MCP server (user scope = available in every project)
claude mcp add-json obsidian --scope user '{
  "type": "stdio",
  "command": "npx",
  "args": ["@bitbonsai/mcpvault@latest", "/home/deploy/Documents/amdev-content-vault"]
}'

# Step 4 — Confirm it's connected
claude
> /mcp
# Should show: obsidian (connected, 14 tools)

# Step 5 — Create vault CLAUDE.md (replace with your conventions)
cat > /home/deploy/Documents/amdev-content-vault/CLAUDE.md << 'EOF'
# amdev-content-vault — Claude conventions

## Vault structure
- Pillars/        → 6 brand voice pillars (read-mostly)
- Blog-Posts/     → blog drafts and published
- Ideas/          → idea inbox, low-discipline capture
- Repurposed/     → cross-platform content (LinkedIn, X, Dev.to)
- Services/       → service-page copy
- Templates/      → note templates
- Analytics/      → traffic + content performance

## Rules
- Voice: 6 pillars (Technical Precision, Direct & Authoritative, Business Context First,
  Experienced Perspective, Dense Information, Contrarian When Warranted)
- Never: emojis, em dashes, exclamation points, hedging, "game-changer", "perhaps", "just"
- Use ellipsis (...) not em dashes
- Search vault BEFORE searching web for any content question
- All blog drafts go to Blog-Posts/ with kebab-case filename + frontmatter
  (date, status: draft|review|published, pillars: [...], series: ...)
- Never delete notes without explicit confirmation; always move to /tmp first

## Frontmatter contract
- Required: date, status
- Blog-Posts: pillars (array), series (string), targetWordCount (int)
- Ideas: source (string), maturity (raw|developing|ready)
EOF

# Step 6 — Test the loop
cd /home/deploy/Documents/amdev-content-vault
claude
> List the files in Pillars/ and tell me what each one is about in one sentence.
```

### Optional next step (if you want graph traversal)

```bash
# Install BRAT in Obsidian first (Settings → Community Plugins → search "BRAT" → install)
# Then in BRAT: Add Beta Plugin → aaronsb/obsidian-mcp-plugin
# Plugin runs HTTP MCP on localhost:3001
# Add to Claude Code:
claude mcp add-json obsidian-graph --scope user '{
  "type": "http",
  "url": "http://localhost:3001/mcp",
  "headers": {"Authorization": "Bearer YOUR_KEY_FROM_PLUGIN"}
}'
```

### Optional next step (if you want Notion alongside Obsidian)

```bash
# Notion's hosted MCP — OAuth flow, no API key
claude mcp add notion --transport sse https://mcp.notion.com/sse
# Authenticate via browser when prompted
# Useful if you have any team docs/databases in Notion you want Claude to read
```

---

## Sources (April 2026)

### Primary research

- [chatforest.com — Obsidian MCP Servers landscape (8 servers, 3 architectures)](https://chatforest.com/reviews/obsidian-mcp-servers/)
- [pixelnthings.com — Connect Obsidian to Claude Code + memory architecture](https://pixelnthings.com/connect-obsidian-to-claude-code/)
- [dev.to/mibii — Second Brain That Actually Thinks](https://dev.to/mibii/claude-code-obsidian-build-a-second-brain-that-actually-thinks-d61)
- [codewithseb.com — Claude Code + Obsidian guide](https://codewithseb.com/blog/claude-code-obsidian-second-brain-guide)
- [haihai.ai — 2,000 words in 90 minutes workflow](https://www.haihai.ai/obsidian-mcp/)
- [eleanorkonik.com — 12M-word vault real workflows](https://www.eleanorkonik.com/p/how-claude-obsidian-mcp-solved-my)
- [Obsidian Forum — community MCP recommendations + scale issues](https://forum.obsidian.md/t/obsidian-mcp-servers-experiences-and-recommendations/99936)
- [limitededitionjonathan — contrarian view on markdown-as-memory](https://limitededitionjonathan.substack.com/p/stop-calling-it-memory-the-problem)
- [desktopcommander.app — knowledge-base MCP comparison 2026](https://desktopcommander.app/blog/best-mcp-servers-for-knowledge-bases-in-2026/)

### Repos referenced

- [kepano/obsidian-skills (27.8k stars, official Obsidian CEO)](https://github.com/kepano/obsidian-skills)
- [bitbonsai/mcpvault (1.2k stars, recommended)](https://github.com/bitbonsai/mcpvault)
- [aaronsb/obsidian-mcp-plugin (295 stars, native plugin)](https://github.com/aaronsb/obsidian-mcp-plugin)
- [iansinnott/obsidian-claude-code-mcp (264 stars)](https://github.com/iansinnott/obsidian-claude-code-mcp)
- [cyanheads/obsidian-mcp-server (480 stars)](https://github.com/cyanheads/obsidian-mcp-server)
- [StevenStavrakis/obsidian-mcp (695 stars, stale)](https://github.com/StevenStavrakis/obsidian-mcp)
- [MarkusPfundstein/mcp-obsidian (3.5k stars, abandoned Nov 2024)](https://github.com/MarkusPfundstein/mcp-obsidian)
- [eugeniughelbur/obsidian-second-brain (31-command skill)](https://github.com/eugeniughelbur/obsidian-second-brain)
- [AgriciDaniel/claude-obsidian (LLM Wiki pattern)](https://github.com/AgriciDaniel/claude-obsidian)
- [coddingtonbear/obsidian-local-rest-api (issue #237 data loss)](https://github.com/coddingtonbear/obsidian-local-rest-api)

### Alternatives surveyed

- [Notion MCP official docs](https://www.notion.com/help/notion-mcp)
- [ergut/mcp-logseq](https://github.com/ergut/mcp-logseq)
- [dweigend/joplin-mcp-server](https://github.com/dweigend/joplin-mcp-server)
- [Anytype MCP setup guide](https://mcp.harishgarg.com/use/anytype/mcp-server/with/claude-code)

### Verified package versions (2026-04-30)

- `@bitbonsai/mcpvault@0.11.0` — published 2026-03-22 (npm verified)
- `kepano/obsidian-skills` — 27.8k stars, active in 2026
- `iansinnott/obsidian-claude-code-mcp` — 1.1.8 (Jun 2025)
