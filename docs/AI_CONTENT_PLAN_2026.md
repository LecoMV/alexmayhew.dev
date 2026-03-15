# AI Content Plan 2026

> **Created:** 2026-03-14
> **Status:** ACTIVE
> **Based on:** 4 parallel research agents — AI landscape, SEO/GEO/AEO audit, keyword research, existing content gap analysis

---

## Critical Finding: Site Not Indexed

**alexmayhew.dev returns ZERO results on Google.** `site:alexmayhew.dev` shows nothing. This is the #1 blocker.

### Immediate Actions (This Week)

1. **Verify Google Search Console** — confirm property is registered, sitemap submitted
2. **Request manual indexation** of 5 highest-value pages via URL Inspection tool
3. **Check Cloudflare headers** — confirm no `X-Robots-Tag: noindex` being emitted
4. **Fix `sameAs` inconsistency** — `article-json-ld.tsx` uses wrong GitHub/LinkedIn URLs
5. **Submit to Bing Webmaster Tools** — secondary index, feeds into some AI search
6. **Submit to IndexNow** — Cloudflare supports this, instant notification to Bing/Yandex

### Distribution Strategy (Parallel to Content)

Content quality is already competitive with what ranks. The gap is **authority signals** (backlinks, domain age, social proof).

| Action                                               | Impact    | Effort                  |
| ---------------------------------------------------- | --------- | ----------------------- |
| Dev.to cross-posting (canonical back to site)        | High      | Low                     |
| Hacker News submissions (RAG, LLM cost, vibe coding) | Very High | Low (but unpredictable) |
| LinkedIn long-form articles linking back             | Medium    | Low                     |
| Reddit answers in r/ExperiencedDevs, r/SaaS          | Medium    | Medium                  |
| Guest post on Cloudflare/Vercel/Stripe blog          | Very High | High                    |
| Podcast appearances (engineering leadership)         | High      | Medium                  |

---

## Content Plan: AI Development Series Expansion

### Existing Coverage (11 posts)

| Post                               | Topic                         | Quality                |
| ---------------------------------- | ----------------------------- | ---------------------- |
| Hub: AI-Assisted Development Guide | Overview, strategy            | Strong                 |
| Generative Debt Crisis             | AI code quality data          | Strong (GitClear data) |
| Stop Calling It Vibe Coding        | Contrarian take               | Strong (timely)        |
| AI Code Review                     | Human-AI review hybrid        | Good                   |
| AI Cost Optimization               | API vs self-host vs fine-tune | Good                   |
| Building AI Features Users Want    | Product strategy              | Good                   |
| LLM Integration Architecture       | RAG, fallbacks, caching       | Strong                 |
| Prompt Engineering for Developers  | 5-component framework         | Good                   |
| RAG Architecture for SaaS          | Chunking, hybrid search       | Strong                 |
| Vector Database Selection          | pgvector → dedicated          | Strong                 |
| LLM Cost Optimization at Scale     | Model routing, caching        | Strong                 |

### New Posts: Priority-Ordered

---

#### TIER 1: First-Mover Opportunities (Near-Zero Competition)

**Post 1: "Cognitive Debt: The Hidden Cost Your AI-Assisted Team Isn't Measuring"**

- **Keyword:** "cognitive debt AI" — near-zero competition, one academic post exists
- **Thesis:** Cognitive debt is distinct from technical debt. When engineers don't understand the code AI wrote, the team loses the ability to reason about the system. This compounds faster than technical debt because it erodes the capacity to make architectural decisions.
- **Data anchors:** METR trial (19% slower), GitClear (60% decline in refactoring), CodeRabbit (1.7x more bugs)
- **Cross-links:** → generative-debt, → technical-debt-strategy (engineering-leadership cluster)
- **SEO target:** Own "cognitive debt" before it saturates
- **AEO optimization:** Define the term in first 150 words with a falsifiable, citable definition

**Post 2: "The METR Paradox: Why AI Makes Your Best Engineers Think They're Faster (While Slowing Them Down)"**

- **Keyword:** Latent — METR study has limited awareness, will grow
- **Thesis:** A rigorous randomized controlled trial showed experienced devs were 19% slower with AI while believing they were 24% faster. The perception gap is the real danger — it means teams can't self-correct.
- **Data anchors:** METR trial (n=16, 246 tasks), Pragmatic Engineer survey (95% weekly adoption, 56% do 70%+ with AI), "89% of CTOs reported production disasters"
- **Cross-links:** → vibe-coding, → generative-debt, → code-review-practices-scale
- **SEO target:** "AI developer productivity study", "AI slower developers"
- **AEO optimization:** Lead with the paradox data, not the narrative

**Post 3: "Building Production MCP Servers: What the 8,600 Community Servers Got Wrong"**

- **Keyword:** "MCP server development" — very low competition, 97M+ SDK downloads
- **Thesis:** MCP won the integration standard war. 8,600 community servers exist. Most will fail in production because they skip auth, rate limiting, error handling, observability, and security. Here's the production engineering they skipped.
- **Data anchors:** 97M monthly SDK downloads, OWASP MCP security guide, tool poisoning incidents, Invariant Labs GitHub exploit
- **Cross-links:** → llm-integration-architecture, → ai-code-review
- **SEO target:** "MCP server tutorial production", "model context protocol guide"
- **AEO optimization:** Step-by-step with code examples, citable security checklist

**Post 4: "When NOT to Use AI for Coding: The Decision Framework"**

- **Keyword:** "when not to use AI for coding" — low competition, high intent
- **Thesis:** 7 task categories where AI assistance produces net-negative outcomes. Not "AI is bad" — "AI is a tool with specific failure modes, and using it on the wrong task creates more work than it saves."
- **Data anchors:** 66% spend more time fixing AI code than expected, task-type ROI breakdown
- **Cross-links:** → vibe-coding, → generative-debt, → building-ai-features-users-want
- **SEO target:** "when to use AI coding", "AI coding limitations"
- **AEO optimization:** Decision tree in first 200 words, 7 clear categories

---

#### TIER 2: High-Value with First-Mover Advantage

**Post 5: "The AI Technical Debt Bomb: A CTO's Accounting Framework"**

- **Keyword:** "AI technical debt" — low competition, surging search
- **Thesis:** $1.5T projected AI-generated tech debt by 2027. GitClear shows 60% decline in refactoring, 8x increase in copy-paste code. Year 2 of unmanaged AI code costs 4x traditional. Here's the audit checklist and remediation playbook.
- **Data anchors:** GitClear 211M lines, Stack Overflow "AI can 10x tech debt", $1.5T projection
- **Cross-links:** → generative-debt, → technical-debt-strategy, → cognitive-debt (new)
- **SEO target:** "AI technical debt audit", "AI code quality measurement"

**Post 6: "Agentic Engineering: What Changes When Developers Become Orchestrators"**

- **Keyword:** "agentic engineering" — brand new term, near-zero content
- **Thesis:** The shift from writing code to directing AI agents changes sprint structure, code ownership, review process, and hiring criteria. This is a management discipline, not a technology choice.
- **Data anchors:** Staff+ engineers lead adoption at 63.5%, Claude Code #1 in 8 months, PR review time increased 91%
- **Cross-links:** → vibe-coding, → code-review-practices-scale, → ic-to-tech-lead
- **SEO target:** "agentic engineering practices", "AI developer workflow"

**Post 7: "AI TDD: Writing Tests First When Your Code Is Non-Deterministic"**

- **Keyword:** "AI test driven development" — very low competition
- **Thesis:** TDD discipline matters MORE with AI, not less. Human writes failing test → AI implements → human reviews. Evals as test suites, golden datasets, prompt regression testing. The pattern that produces measurably better AI-assisted code.
- **Data anchors:** "AI-generated tests tend to test implementation, not intent" (World Quality Report), TDD Guard as real-world example
- **Cross-links:** → ai-code-review, → prompt-engineering, → testing-react-server-components
- **SEO target:** "TDD with AI", "testing AI generated code"

**Post 8: "The AI Security Red Team Playbook: What to Test Before You Ship"**

- **Keyword:** "AI security checklist", "MCP security"
- **Thesis:** 7 confirmed production attack vectors: prompt injection, tool poisoning, indirect injection, memory poisoning, supply chain compromise, vulnerable code generation, agentic insider threat. Here's the CTO's checklist before shipping any AI-augmented system.
- **Data anchors:** OWASP LLM Top 10, Invariant Labs MCP exploit, 45% of AI code has security issues, +322% more vulnerabilities, IBM X-Force 2026
- **Cross-links:** → ai-code-review, → MCP-servers (new), → soc2-compliance
- **SEO target:** "AI security audit", "LLM security checklist"

---

#### TIER 3: Strong Differentiation Required

**Post 9: "Claude Code vs Cursor: A CTO's 90-Day Cost Analysis"**

- **Keyword:** "claude code vs cursor" — high volume, low-medium competition
- **Thesis:** Not a feature matrix — a total cost analysis. Licensing + tokens + workflow adoption + training time + productivity delta. Real numbers from a 10-person team.
- **Data anchors:** Claude Code 4% → 63% adoption, Cursor Pro $20-40/seat, Claude Max $100-200, API costs for heavy agentic use $2000+/month
- **Cross-links:** → ai-cost-optimization, → llm-cost-optimization-scale, → agentic-engineering (new)

**Post 10: "The Vibe Coding Hangover: A Recovery Playbook for CTOs"**

- **Keyword:** "vibe coding problems", "AI code cleanup"
- **Thesis:** You shipped a product built with AI assistance. 6 months later, nobody on the team understands how it works. Here's the triage, audit, and remediation process.
- **Data anchors:** 89% of CTOs reported production disasters, Year 2 maintenance costs 4x, "cognitive debt" framework
- **Cross-links:** → vibe-coding, → cognitive-debt (new), → technical-debt-strategy

**Post 11: "Hiring for AI Engineering: Separating Real Competence from Resume Fluff"**

- **Keyword:** "hiring AI engineers" — medium competition but salary guides dominate
- **Thesis:** The AI Engineer role is real but most job descriptions are wrong. Specific interview questions, code challenges, and red flags. What to look for vs what sounds impressive but indicates nothing.
- **Data anchors:** AI engineer salary $206K average, entry-level contraction, senior-only model emerging
- **Cross-links:** → hiring-first-staff-engineer, → technical-hiring-framework, → agentic-engineering (new)

**Post 12: "The Enterprise AI-SDLC Integration Blueprint"**

- **Keyword:** "enterprise AI development process"
- **Thesis:** Going from "we let people use Copilot" to a coherent AI development practice with governance, quality gates, and measurable outcomes. The 5 evaluation gates: security, legal, compliance, architecture, procurement.
- **Data anchors:** 30%+ POC-to-production failure rate, 46% distrust AI accuracy, only 3.1% highly trust
- **Cross-links:** → ai-code-review, → ai-security (new), → soc2-compliance

---

## Publishing Schedule

**Cadence:** 2 posts/month (bi-weekly), alternating AI series with other clusters

| Target Date | Post                               | Tier |
| ----------- | ---------------------------------- | ---- |
| Apr 2026    | Cognitive Debt                     | 1    |
| Apr 2026    | The METR Paradox                   | 1    |
| May 2026    | Building Production MCP Servers    | 1    |
| May 2026    | When NOT to Use AI for Coding      | 1    |
| Jun 2026    | AI Technical Debt Bomb             | 2    |
| Jun 2026    | Agentic Engineering                | 2    |
| Jul 2026    | AI TDD                             | 2    |
| Jul 2026    | AI Security Red Team Playbook      | 2    |
| Aug 2026    | Claude Code vs Cursor CTO Analysis | 3    |
| Aug 2026    | Vibe Coding Hangover Recovery      | 3    |
| Sep 2026    | Hiring for AI Engineering          | 3    |
| Sep 2026    | Enterprise AI-SDLC Blueprint       | 3    |

---

## SEO/GEO/AEO Optimization Requirements

### Every New Post Must Include

1. **First 150 words:** Direct answer to the post's core question. No preamble.
2. **TL;DR block:** Specific data points, falsifiable claims, citable numbers
3. **FAQ section:** 3-5 questions with 2-4 sentence answers containing specific data
4. **Hub cross-link:** "Part of the AI-Assisted Development Guide" callout
5. **Schema:** ArticleJsonLd + FaqJsonLd + BreadcrumbJsonLd
6. **Meta description:** 150-160 chars with primary keyword
7. **H2s every 300-500 words** with keywords where natural
8. **"When to Apply" / "When NOT to Apply"** sections (decision framework format)
9. **Code examples** with real variable names (never foo/bar)
10. **Cross-cluster links** to related posts in other series

### Structural Optimization for AI Citation

- Define key terms explicitly ("Cognitive debt is...")
- Use comparison tables with specific numbers
- Include decision trees / flowcharts
- Make definitive statements (not "you might consider")
- Cite sources with specific dates and numbers
- Structure content so any H2 section can stand alone as an answer

---

## Technical SEO Fixes (Do Now)

| Fix                                       | File                                     | Effort    |
| ----------------------------------------- | ---------------------------------------- | --------- |
| Fix `sameAs` URLs in ArticleJsonLd        | `src/components/seo/article-json-ld.tsx` | 10 min    |
| Wire FaqJsonLd to service pages           | 4 page.tsx files                         | 30 min    |
| Add FAQ entries for 8 high-value posts    | `src/data/hub-faqs.ts`                   | 2-3 hours |
| Enable technology hub pages               | `src/data/pseo/technologies.ts`          | 1 hour    |
| Add `SpeakableSpecification` schema       | `src/components/seo/`                    | 1 hour    |
| Update stale `siteLastUpdated` in sitemap | `src/app/sitemap.ts`                     | 15 min    |

---

## Tracking & Metrics (Set Up After Content Plan)

### Search Visibility

- Google Search Console: impressions, clicks, avg position per keyword
- Bing Webmaster Tools: same
- Ahrefs/Semrush (free tier): domain authority, keyword rankings, backlink count

### AI Search Visibility

- Weekly manual check: ask ChatGPT, Perplexity, Gemini the target questions
- Track whether alexmayhew.dev is cited in AI answers
- Monitor `llms.txt` access in Cloudflare analytics

### Content Performance

- GA4: pageviews, time on page, scroll depth per post
- Newsletter signups attributed to specific posts
- Contact form submissions attributed to blog referrals

---

## Key Data Points to Anchor ALL AI Content

These verified statistics should be referenced across posts (with proper attribution):

- METR trial: experienced devs **19% slower** with AI, believed **24% faster** (n=16, 246 tasks)
- Claude Code: **4% → 63%** developer adoption in 8 months (Pragmatic Engineer, Feb 2026)
- CodeRabbit: AI code has **1.7x more bugs** than human code (Dec 2025 PR analysis)
- GitClear: **60% decline** in refactoring, **8x increase** in copy-paste code (211M lines)
- **96%** of devs don't fully trust AI, but **50%+** don't review carefully
- **89%** of CTOs reported production disasters from AI code
- **$1.5T** projected accumulated AI technical debt by 2027
- Staff+ engineers lead AI adoption at **63.5%** vs 49.7% for regular engineers
- PR review time **increased 91%** with AI tools (human approval bottleneck)
- **45%** of AI-generated code contains security vulnerabilities (+322% vs human)
- **30%+** of enterprise AI projects abandoned after POC
- Only **3.1%** of developers highly trust AI-generated code
- AI engineer salary: **$206K** average (2025, $50K YoY increase)

---

_This plan is based on research from: Pragmatic Engineer survey (n=906), GitClear (211M lines), METR randomized trial, IBM X-Force 2026, CodeRabbit Dec 2025, Harness SoSD 2025, World Quality Report 2025-26, OWASP LLM Top 10, Invariant Labs, Cisco AI Security 2026._
