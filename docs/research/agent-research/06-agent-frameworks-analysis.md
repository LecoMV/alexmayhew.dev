# Agent Frameworks Analysis — Actionable Intelligence

_Generated: 2026-04-04 | Source: YouTube transcripts (Julian Goldie, Leon van Zyl)_

---

## Executive Summary

Three videos reveal production-ready agent orchestration capabilities we can use RIGHT NOW:

1. **Claude Code Custom Agents** — Build specialized sub-agents for our product creation workflow
2. **Paperclip** — Full company simulation with autonomous teams (41K GitHub stars in weeks)
3. **n8n Integration** — Connect agent outputs to automated workflows

**Bottom line:** We can set up an AI-powered product creation pipeline where agents handle research, writing, review, and marketing — while we focus on strategy and quality control.

---

## Video 1: Claude Code Custom Agent System

### Key Capabilities (Already Available)

**Command:** `/arch agents` — Interactive wizard to create/edit/manage sub-agents

**Configuration options per agent:**
| Setting | Options | Use Case |
|---------|---------|----------|
| **Name/Description** | Free text | How Claude routes tasks — be specific |
| **Model** | Sonnet (fast), Opus (reasoning) | Match model to task complexity |
| **Tool Access** | Read, Grep, Glob, Write, Edit, Bash | Constrain for safety/focus |
| **Memory** | Persistent directory OR none | Cross-session learning vs fresh start |
| **Scope** | User (all projects) OR Project | Share across work or isolate |

**Storage:** Markdown files with YAML config in `.claude/arch-agents/`

### Unreleased Features Mentioned (From Leaked Code)

| Feature                | What It Does                                                                                      | Status                            |
| ---------------------- | ------------------------------------------------------------------------------------------------- | --------------------------------- |
| **Kairos**             | Background daemon that works while you're idle — consolidating memory, preparing for next session | In codebase, not shipped          |
| **Agent Teams**        | Multiple Claude sessions as coordinated team with shared task list and direct messaging           | Experimental (Opus 4.6, Feb 2026) |
| **Three-layer memory** | Hierarchical memory system                                                                        | In codebase                       |

### Practical Tips From Video

1. **Write specific descriptions** — "Analyzes Python files for code quality and suggests improvements" triggers correctly; "code reviewer" probably won't
2. **Use tool restrictions intentionally** — Read-only research agent is safer and more predictable
3. **Match model to task** — Sonnet for fast/frequent, Opus for complex reasoning
4. **Enable persistent memory** for agents you'll reuse — they get better over time
5. **Check awesome-claude-code-sub-agents repo** — Curated ready-made definitions

---

## Video 2: Claude Code 2.190 Updates

### Relevant for Our Workflow

| Fix/Feature                  | Why It Matters                                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------------------------------ |
| **`/powerup`**               | In-app learning system — animated demos of features. We should check this for agent creation tutorials |
| **Plugin offline mode**      | `CLAUDE_CODE_PLUGIN_KEEP_MARKETPLACE_ON_FAILURE` — plugins work without internet                       |
| **Husky hooks respected**    | Auto-accept mode no longer tramples git hooks — important for our git workflow                         |
| **Rate limit dialog fixed**  | No more infinite loop when hitting limits                                                              |
| **`--resume` cache fix**     | First request after resume now properly cached — important for long sessions                           |
| **Format-on-save fix**       | Was throwing "file content has changed" errors — now fixed                                             |
| **Pre-tool-use hooks**       | Exit code 2 now properly blocks actions — we can build safety guards                                   |
| **Transcript writes linear** | Was scaling quadratically — long sessions no longer grind to halt                                      |
| **Resume view parallelized** | Many saved sessions load simultaneously                                                                |

### Security Hardening (Windows PowerShell)

- Background job bypass fixed
- Debugger hang fixed
- TOCTOU vulnerability fixed
- Pass-fail degrading deny rules fixed

**Action:** Update to 2.190+ before heavy agent work.

---

## Video 3: Paperclip — Multi-Agent Company Framework

### What Paperclip Actually Is

**NOT** an AI agent itself — it's a **harness/framework** that orchestrates multiple agents (Claude Code, OpenClaw, Cursor, Codex, HTTP) as a coordinated team.

**GitHub:** 41,000 stars in a few weeks (viral)

### Architecture

```
Board (You)
    │
    ▼
CEO Agent (aligned with company vision)
    │
    ├── CTO
    │   └── Engineering Lead
    │       ├── Frontend Developer
    │       ├── Backend Developer
    │       ├── DevOps
    │       ├── QA Engineer
    │       ├── Security Specialist
    │       └── Full Stack Developer
    │
    ├── CMO (Marketing Lead)
    │   ├── SEO Specialist
    │   └── Copywriter
    │
    └── VP of Product
        └── Product Researcher
```

### Key Mechanics

| Concept                | How It Works                                                      |
| ---------------------- | ----------------------------------------------------------------- |
| **Task Assignment**    | Create issue → assign to CEO → CEO delegates to team              |
| **Blocking**           | Tasks can block waiting for approval (red circle indicator)       |
| **Comments**           | Leave comments on tickets to communicate with agents              |
| **Inbox**              | Agents assign tasks to each other OR to you for approval          |
| **Skills**             | Add skills from skills.sh to individual agents                    |
| **Budget Limits**      | Set spend limits per agent (if using API keys)                    |
| **GitHub Integration** | Agents commit/push to repo, create PRs, follow git best practices |

### Setup Options

1. **Local:** `npx @anthropic/paperclip` — runs while PC is on
2. **VPS (24/7):** Deploy to Hostinger/any VPS with Docker
   - Uses Docker container
   - Can authenticate with Claude Code subscription (not just API key)
   - Warning: Rumors of Anthropic banning accounts for OpenClaw — unclear if applies to Paperclip

### Authentication Methods

- **API Key:** Billed per usage, set in config
- **Claude Code Subscription:** `docker exec -it <container> claude login` — uses your subscription

### Skills System

- Browse skills at **skills.sh**
- Add via URL/command in Paperclip UI
- Assign skills to specific agents
- Example: "front-end-design" skill for Frontend Developer agent

### Practical Workflow Shown

1. Create company with vision/goal
2. CEO determines team structure and hires
3. Board (you) approves hires
4. Assign task to CEO via issue
5. CEO delegates to team leads
6. Team leads delegate to specialists
7. Work happens in parallel
8. Results committed to GitHub
9. Deploy via Vercel/Netlify/VPS

---

## Application to Our Gumroad Products

### Immediate Opportunities

#### 1. Product #3 Content Creation Team

```
CEO: "Create The AI Transcription Stack guide"
    │
    ├── Content Lead
    │   ├── Technical Writer (Chapter 3, 4, 5, 7)
    │   ├── Conceptual Writer (Chapter 1, 2, 8)
    │   └── Editor (consistency, voice, accuracy)
    │
    ├── Research Lead
    │   ├── Model Researcher (benchmarks, new releases)
    │   └── Competitor Researcher (pricing, features)
    │
    ├── Marketing Lead
    │   ├── Copywriter (sales page, email sequences)
    │   └── SEO Specialist (keywords, positioning)
    │
    └── QA Lead
        ├── Technical Reviewer (test all commands)
        └── Clarity Reviewer (beta reader simulation)
```

#### 2. Claude Code Custom Agents (Simpler, No Paperclip)

Create these agents via `/arch agents`:

| Agent                        | Description                                                                                              | Model  | Tools                       | Memory     |
| ---------------------------- | -------------------------------------------------------------------------------------------------------- | ------ | --------------------------- | ---------- |
| **transcription-researcher** | "Researches transcription models, benchmarks, and best practices. Reports findings in markdown."         | Sonnet | Read, Grep, Glob, WebSearch | Persistent |
| **guide-writer**             | "Writes technical documentation in clear, copy-paste-ready format. Follows Product #3 voice guidelines." | Opus   | Read, Write, Edit           | Persistent |
| **command-tester**           | "Tests all commands and code snippets in documentation. Reports pass/fail with error details."           | Sonnet | Read, Bash                  | None       |
| **sales-copywriter**         | "Writes conversion-focused sales copy. Follows Product #3 brand guide."                                  | Opus   | Read, Write                 | Persistent |
| **email-sequence-writer**    | "Creates email sequences for Instantly.ai campaigns."                                                    | Sonnet | Read, Write                 | Persistent |

#### 3. n8n Integration Points

Connect Paperclip/agent outputs to n8n workflows:

| Trigger                | n8n Workflow                                   |
| ---------------------- | ---------------------------------------------- |
| Chapter completed      | → Format check → Git commit → Notify Slack     |
| Email sequence drafted | → Load to Instantly.ai → Schedule warmup       |
| Sales copy approved    | → Update Gumroad listing via API               |
| Research complete      | → Save to docs/research/ → Update memory files |
| QA test fails          | → Create GitHub issue → Notify for review      |

### Workflow for Building Products

**Phase 1: Research (Parallel Agents)**

- Model researcher gathers latest benchmarks
- Competitor researcher analyzes market
- Both output to docs/research/

**Phase 2: Content (Sequential with Parallel Review)**

- Technical writer drafts chapters
- Editor reviews each chapter
- Command tester verifies all code
- Iterate until passing

**Phase 3: Marketing (Parallel)**

- Copywriter creates sales page, emails
- SEO specialist optimizes keywords
- Both reviewed by marketing lead

**Phase 4: Launch Prep (Automated via n8n)**

- Compile final PDF/markdown
- Generate VHS demos for video tier
- Generate VoiceKeep audiobook
- Upload to Gumroad
- Load email sequences to Instantly
- Schedule social posts

---

## Risk Considerations

### Anthropic Account Bans

> "There are rumors that Anthropic has been banning accounts for using things like OpenClaw and I'm not sure if that will apply to Paperclip as well"

**Mitigation:**

- Use API keys instead of subscription for risky usage
- Monitor Anthropic's ToS updates
- Have backup approach (direct Claude Code, not Paperclip)

### Quality Control

The video creator notes:

> "Even though I developed something that can build an entire application on autopilot, I still think it's a really good idea to keep an eye on what these agents are doing and checking and verifying the code yourself before deploying"

**Our approach:**

- Agents draft, humans approve
- All customer-facing content gets manual review
- Technical content verified by running commands

---

## Next Steps

### Immediate (Today)

1. [ ] Update Claude Code to 2.190+
2. [ ] Run `/powerup` to explore in-app learning
3. [ ] Create first custom agent via `/arch agents` — start with transcription-researcher
4. [ ] Test agent on one research task

### This Week

5. [ ] Create full agent roster for Product #3
6. [ ] Evaluate Paperclip for larger orchestration
7. [ ] Design n8n workflows for automation points
8. [ ] Draft integration between agent outputs and Instantly.ai

### Before Product Launch

9. [ ] Agent-assisted content creation for remaining chapters
10. [ ] Automated QA testing of all commands
11. [ ] Agent-generated social proof collection workflow

---

## Resources

- **Paperclip GitHub:** github.com/... (41K stars)
- **skills.sh:** Browse agent skills
- **awesome-claude-code-sub-agents:** Curated agent definitions
- **Claude Code 2.190 changelog:** (in-app or GitHub releases)
- **Auto Forge (Leon's project):** Similar orchestration with Kanban view

---

## Key Quotes

> "The people who learn to build and direct these agents well are going to be significantly more productive than those who don't. That's just where things are going." — Julian Goldie

> "Paperclip is not an AI agent within itself — it's basically a framework or a harness that allows you to bring your very own agents and then build a team around it." — Leon van Zyl

> "Instead of doing everything myself, I set up an AI-powered software company... you simply create a new issue... and the CEO agent will pick up on this ticket and assign the tasks to the team." — Leon van Zyl
