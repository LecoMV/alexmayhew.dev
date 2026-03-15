# AI-Assisted Development Keyword Research (2026-03-14)

**Status:** CURRENT
**Session:** Keyword research for AI-assisted development blog content targeting CTOs and senior engineers

---

## Executive Summary

The AI-assisted development keyword space is exploding in 2026. Claude Code rose from 4% developer adoption in May 2025 to 63% in February 2026, making it the #1 AI coding tool. The market is $4.7B in 2025, growing to $14.6B by 2033. 84% of developers use AI tools weekly. The content landscape is overwhelmingly dominated by shallow listicles and marketing copy — creating a significant opening for authoritative, data-backed, contrarian technical content targeting CTOs and senior engineers.

**alexmayhew.dev already covers:** ai-assisted-development-guide (hub), generative-debt, ai-code-review, ai-cost-optimization, building-ai-features, llm-cost-optimization, llm-integration-architecture, prompt-engineering-developers, rag-architecture-saas, vector-database-selection. Strong AI cluster foundation.

**Gaps identified:** Agentic coding/MCP, claude-code-vs-cursor deep comparison, AI hiring economics, "when NOT to use AI", AI TDD, multi-agent architecture for production, cognitive debt vs technical debt.

---

## Cluster 1: AI Coding Tools

### Core Keywords

| Keyword                              | Est. Volume               | Competition | Notes                                                           |
| ------------------------------------ | ------------------------- | ----------- | --------------------------------------------------------------- |
| ai assisted development              | High (growing ~30% YoY)   | Medium      | Already covered as hub post                                     |
| ai code generation                   | High                      | High        | Dominated by tool vendors                                       |
| ai pair programming                  | High (84% of devs use it) | Medium-High | Content is mostly surface-level stats                           |
| claude code vs cursor                | High (surging 2026)       | Low-Medium  | New keyword, 10+ comparison pieces already but mostly shallow   |
| agentic coding / agentic engineering | High (surging)            | Low         | Karpathy's reframe of vibe coding; very new                     |
| ai developer tools 2026              | High                      | High        | Saturated with listicles                                        |
| vibe coding                          | Very High                 | Low-Medium  | Karpathy coined early 2025, now mainstream; 78% orgs integrated |

### Competitive Landscape

**What exists:**

- "Claude Code vs Cursor": 10+ comparison articles (builder.io, sitepoint, northflank, dev.to). Most focus on surface differences (IDE vs CLI, pricing). Quality ranges from decent to thin.
- "Vibe coding": Enormous volume, most content either hype ("amazing revolution") or dismissal. Very little from a senior engineer's operational perspective.
- "AI pair programming": Dominated by GitHub Copilot marketing, stats compilations, generic productivity claims.
- "Agentic engineering/coding": Very new (Q1 2026). Content is sparse and mostly introductory.

**What's MISSING:**

- An honest TCO analysis of Claude Code vs Cursor for a team of 10+ engineers (licensing + token costs + workflow disruption)
- "Agentic engineering" as a management discipline: how do you structure a sprint when your junior devs are directing agents?
- The flip side of vibe coding: what breaks at 6 months when the original architect leaves and nobody understands the codebase
- Operational metrics for AI coding tools: how do you measure whether Claude Code is actually saving your team time?

**Content opportunities:**

- "Claude Code vs Cursor: A CTO's 90-Day Cost Analysis" — contrarian, data-driven, addresses the question nobody answers
- "Agentic Engineering: What Changes When Your Engineers Are Architects" — thought leadership with operational meat
- "The Vibe Coding Hangover: Six Months Later" — covers what happens to maintainability, knowledge transfer, onboarding

---

## Cluster 2: AI Architecture

### Core Keywords

| Keyword                        | Est. Volume      | Competition | Notes                                                            |
| ------------------------------ | ---------------- | ----------- | ---------------------------------------------------------------- |
| RAG architecture               | High             | High        | Already covered in rag-architecture-saas.mdx                     |
| vector database comparison     | High             | High        | Already covered in vector-database-selection.mdx                 |
| LLM integration patterns       | Medium           | Medium      | Already covered in llm-integration-architecture.mdx              |
| AI feature development         | Medium           | Medium      | Already covered in building-ai-features-users-want.mdx           |
| embedding models comparison    | Medium           | Medium      | Already covered in llm-integration-architecture.mdx              |
| AI agent architecture patterns | Medium-High      | Low-Medium  | Emerging; content exists but is largely theoretical/shallow      |
| MCP server development         | Medium (surging) | Very Low    | 8,600+ community servers exist; minimal quality technical guides |

### Competitive Landscape

**What exists:**

- RAG / vector DB: Saturated. Pinecone, Weaviate, Redis, Medium, Dev.to — hundreds of pieces.
- AI agent architecture: Google Cloud, Microsoft Azure, Anthropic (Building Effective Agents), Redis have decent reference material. Community content is thin and theoretical.
- MCP server development: Official docs (modelcontextprotocol.io), Composio, a few step-by-step tutorials. OWASP has a security guide. Most tutorials are "hello world" level.

**What's MISSING:**

- Production-grade MCP server guide: authentication, rate limiting, error handling, observability — written by someone who has shipped one
- "When to use multi-agent vs single agent" — decision framework with real cost/complexity tradeoffs
- MCP server security: the OWASP guide exists but is not developer-friendly; a practical "MCP server security checklist for engineers" would rank
- AI agent architecture for SaaS startups: the academic papers exist, the enterprise guides exist (Google, Microsoft), but nothing for a 10-person team deciding whether to build agents at all

**Content opportunities:**

- "Building Your First Production MCP Server" — depth that the tutorials lack: error handling, auth, testing, deployment
- "AI Agent Architecture Patterns: When Simple Beats Complex" — contrarian decision framework
- "MCP vs REST for Tool Integration: The Honest Engineering Tradeoffs" — fills a clear gap

---

## Cluster 3: AI for CTOs

### Core Keywords

| Keyword                       | Est. Volume      | Competition | Notes                                                                                   |
| ----------------------------- | ---------------- | ----------- | --------------------------------------------------------------------------------------- |
| AI development costs          | Medium-High      | Medium      | Content exists but is mostly vendor estimates                                           |
| when to use AI in development | Medium           | Low-Medium  | Mostly puff pieces                                                                      |
| AI technical debt             | Medium (surging) | Low         | Stack Overflow blog post ("AI can 10x tech debt"), academic paper, few practical guides |
| AI code quality               | Medium           | Medium      | CodeRabbit report, academic papers, vendor tools                                        |
| hiring AI engineers           | Medium           | Medium      | Salary guides, recruiter posts — thin on decision frameworks                            |
| fractional CTO AI strategy    | Low-Medium       | Very Low    | KD ~2/100; high intent, minimal competition                                             |
| cognitive debt                | Low              | Very Low    | One academic/blog post (Margaret Storey, Feb 2026); massive opportunity                 |

### Competitive Landscape

**What exists:**

- "AI technical debt": Stack Overflow (01/2026) — excellent data but general audience. BayTech consulting post. Academic ScienceDirect review. Most CTO-level content is thin.
- "AI development costs": Multiple vendor pages (elsner.com, aisuperior.com, azumo.com) quoting ranges. Almost all are marketing pages, not analytical frameworks.
- "hiring AI engineers": Salary comparison guides (9cv9.com, ocr-extraction.com by region). Zero content on what skills actually matter vs. what sounds good.
- "cognitive debt": ONE article (margaretstorey.com, Feb 2026). This is a wide-open topic.
- "fractional CTO AI strategy": Very sparse. KD is essentially zero.

**What's MISSING:**

- A CTO-level decision framework for AI technical debt: how do you audit an AI-assisted codebase, what metrics signal danger, what's the remediation process
- "Cognitive debt" operationalized for engineering teams: what practices prevent it, how do you detect it, what does a team health check look like
- AI hiring: not "what do AI engineers cost" but "how do you evaluate if a candidate's AI skills are real vs. resume fluff"
- AI development cost calculator with honest assumptions: not a marketing estimate but a model you can plug your own numbers into

**Content opportunities:**

- "Cognitive Debt: The Risk Nobody Is Measuring in AI-Assisted Teams" — near-zero competition, high importance, aligns with existing technical debt post
- "AI Technical Debt Audit: A CTO's Checklist" — data-driven, practical, directly monetizable (advisory hook)
- "Hiring for AI Engineering: What Actually Matters vs. What Sounds Good" — contrarian, specific, actionable

---

## Cluster 4: AI Engineering Practice

### Core Keywords

| Keyword                           | Est. Volume | Competition | Notes                                               |
| --------------------------------- | ----------- | ----------- | --------------------------------------------------- |
| AI test driven development        | Low-Medium  | Very Low    | Almost no quality content exists                    |
| AI code review                    | Medium      | Medium      | Already covered in ai-code-review.mdx               |
| prompt engineering best practices | High        | High        | Saturated; IBM, Lakera, OpenAI, every tutorial site |
| AI development workflow           | Medium      | Medium      | Generic content dominates                           |
| multi-agent development           | Medium      | Low-Medium  | Mostly frameworks/tooling content, not practices    |

### Competitive Landscape

**What exists:**

- "Prompt engineering best practices": Completely saturated. IBM, Lakera, OpenAI, Anthropic all have comprehensive guides. Not a viable target for a new post unless highly differentiated.
- "AI development workflow": Generic "here are tools" articles. No process engineering depth.
- "AI test driven development": The TDD + AI intersection is almost entirely unaddressed. Promptfoo gets a mention in some pieces; no one has written the authoritative "TDD for AI features" guide.
- "Multi-agent development": Framework docs (LangChain, CrewAI, AutoGen) dominate. Practical production guidance is thin.

**What's MISSING:**

- "TDD for AI Features": How do you write tests first when your feature is non-deterministic? Evals as tests, golden datasets, prompt regression testing — this has not been synthesized into a developer-facing guide
- AI development workflow for teams (not solo): how does code review change, how does PR process change, how do you prevent context collapse when 5 engineers are using agents on the same codebase
- Multi-agent development practices: not "here are the frameworks" but "here is the operational discipline for running agents in production"

**Content opportunities:**

- "Test-Driven Development for AI Features: Evals Are Your Test Suite" — fills an obvious gap, high value for senior engineers
- "AI Development Workflow for Teams: Preventing Context Collapse" — no one has written this
- "Running Multi-Agent Systems in Production: The Operational Playbook" — complements existing architecture content

---

## Cluster 5: Long-Tail Opportunities

### High-Value Long-Tail Keywords

| Keyword                             | Est. Volume   | Competition | Gap Assessment                                                                  |
| ----------------------------------- | ------------- | ----------- | ------------------------------------------------------------------------------- |
| "how to evaluate AI generated code" | Low-Medium    | Low         | Academic papers and tool vendor posts exist; no practitioner decision framework |
| "AI development cost calculator"    | Low           | Very Low    | Nobody has built/published an honest model                                      |
| "when not to use AI for coding"     | Low-Medium    | Low         | "70% problem" Substack post is the only quality piece; massive gap              |
| "AI agent architecture patterns"    | Low-Medium    | Low         | Theoretical content exists; production-oriented is missing                      |
| "MCP server development guide"      | Low (surging) | Very Low    | Official docs + hello-world tutorials; no production depth                      |
| "cognitive debt AI"                 | Very Low      | Near Zero   | One academic post from Feb 2026; massive first-mover opportunity                |
| "AI code review checklist"          | Low           | Low         | Generic checklists exist; none specific to AI-generated code pathologies        |
| "agentic engineering practices"     | Low           | Very Low    | Brand new term; first-mover advantage available                                 |

### Competitive Analysis for Key Long-Tails

**"when not to use AI for coding"**
Top results: allthingsopen.org (limitations piece), graphite.com (capabilities guide), dev.to (why AI can't replace devs), addyo.substack.com ("The 70% Problem" — best piece by far, honest and specific). The substack post is the gold standard but stops at "here's the problem." A CTO-focused decision framework ("these 7 categories of work should NOT be AI-assisted, and here's why and how to enforce it") doesn't exist.

**"how to evaluate AI generated code"**
Top results: runloop.ai (10 dimensions), arxiv.org (2 academic papers), gocodeo.com (metrics/benchmarks), coderabbit.ai (data report), MDPI (empirical study). All are either academic/research or vendor tools selling the evaluation solution. No practitioner decision framework for "here's the process a CTO sets up in 2 weeks."

**"MCP server development guide"**
Top results: official modelcontextprotocol.io, composio.dev tutorial, leanware.co how-to, OWASP security guide. Quality is low except for official docs. Production-grade content with auth, error handling, observability, testing is completely absent.

**"cognitive debt" (AI context)**
ONE quality piece exists: margaretstorey.com (Feb 2026, "How Generative and Agentic AI Shift Concern from Technical Debt to Cognitive Debt"). This is an academic researcher's blog. No practitioner guide exists. High opportunity for alexmayhew.dev to own this term.

---

## Existing Content Coverage Analysis

### ai-development cluster (already published)

| Post                                        | Keywords Covered                                             | Ranking Potential                                                              |
| ------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| ai-assisted-development-guide.mdx (hub)     | AI-assisted development, LLM integration, prompt engineering | Strong hub — needs internal link building                                      |
| ai-assisted-development-generative-debt.mdx | AI technical debt, code quality, vibe coding critique        | Good; could rank for "ai technical debt" with more data                        |
| ai-assisted-development-reality.mdx         | Vibe coding, agentic development                             | Excellent take; "stop calling it vibe coding" angle is contrarian              |
| ai-code-review.mdx                          | AI code review, evaluate AI code                             | Good coverage; "how to evaluate AI generated code" is a gap it partially fills |
| ai-cost-optimization.mdx                    | AI development costs, self-hosting vs API                    | Covers this cluster well                                                       |
| llm-cost-optimization-scale.mdx             | LLM cost, model routing, semantic caching                    | Strong; $90K/year hook is memorable                                            |
| llm-integration-architecture.mdx            | LLM architecture, vector DB, RAG                             | Comprehensive                                                                  |
| prompt-engineering-developers.mdx           | Prompt engineering best practices                            | Decent but saturated category                                                  |
| rag-architecture-saas.mdx                   | RAG architecture, hybrid search                              | Strong piece; 82-90% retrieval accuracy hook is specific                       |
| vector-database-selection.mdx               | Vector database comparison, pgvector                         | Strong decision framework                                                      |

**Assessment:** The hub and core spoke posts are solid. The cluster is dense. What's missing from the cluster: agentic engineering practices, MCP development, cognitive debt, AI TDD, team workflow, and the "when NOT to" angle.

---

## Prioritized Content Recommendations

### Tier 1: Near-Zero Competition, High CTO Intent (build these first)

1. **"Cognitive Debt: The Risk Your AI-Assisted Team Isn't Measuring"**
   - Keywords: cognitive debt AI, AI technical debt, agentic engineering risks
   - Competition: Near zero (one academic post exists)
   - Angle: Frame cognitive debt as distinct from technical debt; give a measurable team health checklist; connect to business risk (key person dependencies, knowledge loss)
   - Series fit: ai-development spoke
   - First-mover advantage: High. Own this term before everyone else discovers it.

2. **"When NOT to Use AI for Coding: A Decision Framework"**
   - Keywords: when not to use AI coding, AI coding limitations, AI development decisions
   - Competition: Low ("70% problem" Substack is best existing piece)
   - Angle: Not "AI has limitations" (everyone says that) but a specific, opinionated decision tree: these 7 task categories should NOT be AI-assisted, with enforcement mechanisms
   - Series fit: ai-development spoke
   - Hook: "82% of developers use AI. 66% spend more time fixing AI code than expected. Here's the 7-category decision framework for knowing when to reach for the tool and when to put it down."

3. **"Building a Production MCP Server: What the Tutorials Don't Cover"**
   - Keywords: MCP server development, MCP server guide, model context protocol tutorial
   - Competition: Very low (official docs + hello-world tutorials only)
   - Angle: Post-hello-world: authentication, rate limiting, error handling, observability, testing, deployment. Written from production experience.
   - Series fit: ai-development spoke (or new mcp/agentic cluster)
   - Hook: "There are 8,600 community MCP servers. Most of them will fail in production. Here's the engineering they skipped."

### Tier 2: Emerging Terms, First-Mover Advantage

4. **"Agentic Engineering: What Changes for CTOs When Developers Become Architects"**
   - Keywords: agentic engineering, agentic coding, AI development workflow teams
   - Competition: Low (term is new, content is sparse)
   - Angle: Not technical but operational — sprint structure, code ownership, review process, hiring criteria when the paradigm shifts
   - Series fit: ai-development or engineering-leadership

5. **"AI TDD: Writing Tests First When Your Code Is Non-Deterministic"**
   - Keywords: AI test driven development, AI feature testing, prompt regression testing, evals as tests
   - Competition: Very low
   - Angle: Evals ARE your test suite for AI features. Golden datasets, determinism strategies, regression testing prompts. Concrete implementation guide.
   - Series fit: ai-development spoke

6. **"AI Technical Debt Audit: The CTO's Checklist for AI-Assisted Codebases"**
   - Keywords: AI technical debt, AI code quality audit, evaluate AI generated code
   - Competition: Low (mostly academic papers and vendor tools)
   - Angle: Process-level: how to run a 2-week audit, what metrics to gather, what the thresholds are, what remediation looks like
   - Series fit: ai-development spoke; builds on existing generative-debt post

### Tier 3: Higher Competition, Differentiation Required

7. **"Claude Code vs Cursor: A CTO's 90-Day Cost Analysis for a 10-Person Team"**
   - Keywords: claude code vs cursor, AI coding tools comparison, AI developer tools cost
   - Competition: Medium (10+ comparison pieces exist but all surface-level)
   - Angle: Not "which is better" (everyone does that). Total cost analysis: licensing + token consumption + workflow adoption time + maintenance. Real numbers for a hypothetical 10-person team.
   - Series fit: ai-development spoke

8. **"Hiring for AI Engineering: Separating Real Competence from Resume Fluff"**
   - Keywords: hiring AI engineers, AI engineering skills, AI developer evaluation
   - Competition: Medium (salary guides dominate; decision-frameworks are absent)
   - Angle: Specific interview questions + code challenges + portfolio signals that reveal real AI engineering ability vs. prompt-jockeying
   - Series fit: engineering-leadership spoke

---

## Search Volume & Competition Summary

### High Volume / Lower Competition Opportunities

- "cognitive debt AI" — Near zero competition; emerging term
- "when not to use AI coding" — Low competition; high intent
- "MCP server development" / "build MCP server" — Surging, minimal quality content
- "agentic engineering" — Brand new term; first-mover advantage
- "AI test driven development" — Almost no content exists
- "fractional CTO AI strategy" — KD ~2/100; extremely low competition

### High Volume / Higher Competition (differentiation required)

- "vibe coding" — High volume; contrarian angle required (existing post covers this)
- "RAG architecture" — High volume; already covered well
- "claude code vs cursor" — Surging; needs cost/data angle to differentiate
- "prompt engineering best practices" — Saturated; not worth pursuing without unique frame

### Key Data Points for Content Strategy

- 84% of developers use AI tools (weekly), but only 33% fully trust AI-generated code
- AI creates 1.7x more code issues than human-written code (CodeRabbit report)
- 66% of developers spend more time fixing AI code than expected
- Claude Code: 4% adoption May 2025 → 63% February 2026 (fastest growth in tool history)
- AI coding tools market: $4.7B (2025) → $14.6B (2033)
- 78% of organizations have integrated agentic AI into primary development workflows
- AI technical debt: Stack Overflow ("AI can 10x developers in creating tech debt", Jan 2026) — this headline is quotable

---

## Sources

- [Claude Code vs Cursor comparison - builder.io](https://www.builder.io/blog/cursor-vs-claude-code)
- [Claude Code vs Cursor - emergent.sh](https://emergent.sh/learn/claude-code-vs-cursor)
- [AI Coding Assistant Statistics 2026 - getpanto.ai](https://www.getpanto.ai/blog/ai-coding-assistant-statistics)
- [Claude AI Statistics 2026 - getpanto.ai](https://www.getpanto.ai/blog/claude-ai-statistics)
- [AI can 10x developers in creating tech debt - Stack Overflow](https://stackoverflow.blog/2026/01/23/ai-can-10x-developers-in-creating-tech-debt/)
- [Cognitive Debt - margaretstorey.com](https://margaretstorey.com/blog/2026/02/09/cognitive-debt/)
- [AI Technical Debt / Vibe Coding TCO - baytechconsulting.com](https://www.baytechconsulting.com/blog/ai-technical-debt-how-vibe-coding-increases-tco-and-how-to-fix-it)
- [The 70% Problem: Hard truths about AI-assisted coding - addyo.substack.com](https://addyo.substack.com/p/the-70-problem-hard-truths-about)
- [Vibe Coding to Agentic Engineering - thenewstack.io](https://thenewstack.io/vibe-coding-agentic-engineering/)
- [Agentic Engineering trend - thenews.com.pk](https://www.thenews.com.pk/latest/1391645-agentic-engineering-next-big-ai-trend-after-vibe-coding-in-2026)
- [10 RAG Architectures 2026 - rakeshgohel.com](https://www.rakeshgohel.com/blog/10-types-of-rag-architectures-and-their-use-cases-in-2026)
- [Top MCP Servers 2026 - index.dev](https://www.index.dev/blog/top-mcp-servers-for-ai-development)
- [MCP vs A2A Guide - dev.to](https://dev.to/pockit_tools/mcp-vs-a2a-the-complete-guide-to-ai-agent-protocols-in-2026-30li)
- [Build MCP Server - modelcontextprotocol.io](https://modelcontextprotocol.io/docs/develop/build-server)
- [OWASP MCP Security Guide](https://genai.owasp.org/resource/a-practical-guide-for-secure-mcp-server-development/)
- [AI Agent Architecture - Redis](https://redis.io/blog/ai-agent-architecture/)
- [Google Multi-Agent Design Patterns - InfoQ](https://www.infoq.com/news/2026/01/multi-agent-design-patterns/)
- [Assessing AI Code Quality - runloop.ai](https://runloop.ai/blog/assessing-ai-code-quality-10-critical-dimensions-for-evaluation)
- [AI vs Human Code Report - coderabbit.ai](https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report)
- [AI Pair Programming Statistics - index.dev](https://www.index.dev/blog/ai-pair-programming-statistics)
- [AI Development Cost 2026 - elsner.com](https://www.elsner.com/ai-development-cost/)
- [Cost to Hire AI Engineers 2026 - blog.9cv9.com](https://blog.9cv9.com/cost-to-hire-ai-engineers-in-2026-complete-breakdown-by-region/)
- [Embedding Models Comparison 2026 - reintech.io](https://reintech.io/blog/embedding-models-comparison-2026-openai-cohere-voyage-bge)
- [Fractional CTO AI Strategy - tech42consulting.com](https://www.tech42consulting.com/ai-strategy)
- [AI Native Development 2026 - IBM](https://www.ibm.com/think/news/ai-tech-trends-predictions-2026)
- [AI Agent Trends 2026 - Google Cloud](https://cloud.google.com/resources/content/ai-agent-trends-2026)
