# Multi-LLM Content Workflow Research (2026-05-01)

**Status:** CURRENT
**Session:** Decide division of labor across Claude Opus 4.7 + Codex (GPT-5.5) + Gemini 2.5/3.1 Pro for citation-worthy long-form content (4-8k word hubs, 800-1.2k service pages, 2-4k research releases) on alexmayhew.dev.
**Sources:** 22 sources across 4 search tools (WebSearch, NimbleWay deep, NimbleWay extract, targeted follow-ups).

---

## Key Findings

1. **Claude Opus 4.7 wins at long-form prose by a clear margin.** EQ-Bench Creative Writing v3 (April 2026): Opus 4.7 = **2216 Elo**, GPT-5.5 = 2024, Sonnet 4.6 = 1991, Gemini 3.1 Pro lower. Claude Opus 4.7 also leads the EQ-Bench _Longform_ leaderboard. Practitioners on LinkedIn/Substack converge: "most consistent over extended context, doesn't drift" (Opus); "tool-chaining and execution" (GPT-5.5); "long-context retrieval and Workspace integration" (Gemini). [1][2][3]
2. **Google does NOT penalize AI content per se.** It penalizes _unhelpful_ content — duplicate/near-duplicate phrasing, low differentiation, no original data, no expert review. 86% of 175 sites deindexed in 2024-2025 had some AI content; the common factor was _scale + zero oversight_, not the model that wrote it. Casual.com (~1,800 AI articles, no editor) was fully deindexed. Sites that survived added human review, original data, and personal angles. [4][5][6]
3. **Original research is the highest-leverage citation asset.** AI Overviews cite pages with **3+ unique data points** at 4× the rate of pages without. Pages with semantic completeness ≥8.5/10 are 4.2× more likely to be cited. **53% of all AI Overview citations go to pages under 1,000 words** that answer a specific question in 134-167 word self-contained chunks. The 4-8k hub format is for _training Google's understanding of your domain_; the 800-1.2k service page is what actually gets cited. [7][8][9]
4. **Voice drift is real and avoidable.** Three techniques work: (a) **few-shot anchor passages** in the system prompt (1-3 of your own paragraphs as exemplars, beats one-shot when style is non-obvious), (b) **negative constraint lists** (vocab bans, structural rules — Ryan Stax calls this "Rule of Three destroyer," eliminates ~70% of AI fingerprints before generation), (c) **post-pass voice forensics** by a _different_ model (Codex critiques Claude's draft against the style sheet, catches what Claude missed because Claude wrote it). [10][11][12]
5. **Time math with the multi-LLM stack converges around 6-8 hours per 4k hub, 1.5-2 hours per 1k service page, 12-16 hours per 3k research release.** Full-manual long-form is 8-13 hours per 4k article (capitalizemytitle, samwell.ai). Stax claims "tripled writing speed" with Gemini Deep Research alone, suggesting ~3-4× compression on research phase only. [13][14][15]

---

## Details

### A. Division of labor — what each model is actually best at

**Claude Opus 4.7 — DRAFTER + VOICE KEEPER**

- EQ-Bench Creative Writing Elo 2216 (April 2026), top of leaderboard.
- 1M context window (Anthropic 1M tier) handles full reference material + outline + voice anchor passages in one prompt.
- Known for "doesn't drift over extended context" — the LinkedIn Awais post and the MindStudio review both flag this independently.
- xhigh effort tier (new in 4.7) is built for slower, more deliberate prose.
- Honest weakness: regression on Terminal-Bench 2.0 vs GPT-5.4, slight softening on BrowseComp. Not the right tool for "go fetch live data from 12 URLs and synthesize." [1][2][16]

**GPT-5.5 (Codex CLI) — CRITIC + FACT-CHECKER + TOOL-EXECUTOR**

- Wins at instruction persistence over long agentic runs (the GPT-5.4 failure mode of "constraints ignored by step 8" is largely fixed in 5.5).
- 82.7% on Terminal-Bench (vs Opus 4.7 at 69.4%) — better at "run this command, parse this output, check this URL."
- Tool selection and error recovery are materially better than 5.4. Fewer redundant calls; reads structured errors and adjusts.
- Faster, cheaper per-task in agentic loops.
- Honest weakness: prose is terser, less warm. Not where you go for the lead paragraph. The MindStudio review explicitly notes "Claude tends to produce more careful, annotated output that's easier to review" — i.e. Claude reviews better than Codex on natural language; Codex reviews better than Claude on facts/code. [3][16][17]

**Gemini 3.1 Pro (CLI + Deep Research) — RESEARCHER**

- Deep Research is _agentic_: one request triggers an autonomous loop of planning, searching, reading, reasoning. Native MCP support, native chart/infographic generation, Workspace integration.
- 2M context (largest of the three) — feed it 50 PDFs, an entire codebase, a year of newsletters; it actually retains them.
- Pulls contrarian/niche sources that standard Google can't surface in 90 seconds (Stax's stated value prop).
- Honest weakness: agentic _reasoning_ still maturing; doesn't lead any creative writing benchmark; default voice is the most generic of the three. Use it as a research instrument, not a drafter. [18][19][13]

### B. Recommended division for alexmayhew.dev

| Stage                                  | Model                                                                         | Why                                                                                                     |
| -------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **1. Topic ideation + angle**          | You + Claude (alex-voice skill)                                               | Claude's instruction-following + your editorial judgment. Don't outsource opinion.                      |
| **2. Deep research**                   | Gemini 3.1 Deep Research                                                      | Agentic web traversal, contrarian sources, structured citation list with URLs                           |
| **3. Outline + thesis**                | Claude Opus 4.7 (xhigh)                                                       | Long context, structured reasoning, voice already locked                                                |
| **4. First draft**                     | Claude Opus 4.7 (xhigh, alex-voice skill, 3 anchor passages in system prompt) | EQ-Bench leader, doesn't drift, 1M ctx fits the full brief                                              |
| **5. Fact-check + technical accuracy** | Codex (GPT-5.5)                                                               | Run as adversarial reviewer with web fetch — checks every claim against live sources                    |
| **6. Voice consistency pass**          | Codex (GPT-5.5) with negative-constraint prompt                               | A _different_ model reading against the style sheet catches drift Claude misses because Claude wrote it |
| **7. AI-fingerprint forensic pass**    | Claude Opus 4.7 (Stax-style 5-step audit)                                     | Strips Rule of Three, hedge stacks, generic transitions, em-dash patterns                               |
| **8. Final polish + commit**           | You                                                                           | Non-negotiable. The human in the loop is what survives Helpful Content.                                 |

This matches what Awais Yusaf reports doing publicly: "We route specific agent tasks to different models inside the same pipeline. Each model handles what it's strongest at." [16] It also matches the Sociolatte-style "AI as staff" pattern for one-person companies. [20]

### C. Google Helpful Content System — what 2026 actually looks for

The Helpful Content system was folded into core ranking in March 2024 and is now permanent. By 2026 it operates on a site-wide signal — one section of low-effort AI content drags the whole domain.

**What gets sites deindexed (verified across 3 case-study sources):** [4][5][6]

- Scale without oversight (1,000+ AI articles, no editor)
- Duplicate phrasing and structural clusters across the web — if 10,000 sites used the same "It's worth noting that..." opener for the same topic, all 10,000 lose
- No original data, no first-person observations, no expert review
- Generic transitions: "furthermore," "moreover," "in conclusion," "it's important to note"
- Surface-level coverage that doesn't answer the implicit question
- Boilerplate Yoast-style intros ("In today's fast-paced digital world...")

**What survives:**

- Original data points (≥3 per page → 4× citation rate in AI Overviews)
- Personal experience markers ("I shipped X in Y weeks and here's what broke")
- First-person methodology disclosure
- Expert byline + credentials visible
- Content updates (Google rewards freshness; 66.3% of marketers cite updates as second-highest impact activity)

**Perplexity/burstiness specifically:** Pangram Labs and CXL both note Google does _not_ run articles through perplexity scoring — the academic metric doesn't survive contact with real-world editing. What Google's systems detect is _pattern repetition across the web_, not statistical surprise within one document. The implication: don't optimize for "burstier sentences." Optimize for _non-overlap with the rest of the AI-generated web_. [21][22]

### D. Voice consistency — concrete techniques

**Technique 1 — Few-shot anchor passages (validated by Anthropic docs + research papers).** Drop 2-3 of your own paragraphs into the system prompt before the task. Anthropic's multishot prompting docs: "examples are not always necessary, but they shine when explaining concepts or demonstrating specific formats." For voice, one-shot beats zero-shot; few-shot beats one-shot. ICLR 2026 paper on long-text style transfer (ZeroStylus) confirms hierarchical template extraction beats raw few-shot for paragraph-level structure. [10][23][12]

**Technique 2 — Negative constraint lists (Stax "Prompt 1: Before You Write").** Hard bans up front. For alex-voice this already exists ("no em dashes, no emojis, no hedging, no 'game-changer'"). Stax's addition worth stealing: the **Rule of Three destroyer**. AI loves to write triplets ("clear, concise, and compelling"). Banning structural patterns, not just words, eliminates ~70% of AI fingerprints before generation. [11]

**Technique 3 — Cross-model voice audit (the killer move).** Have GPT-5.5 audit Claude's draft against the alex-voice spec sheet. A model that _didn't_ write the draft will catch drift the original model is blind to. This is the single most underrated technique in the Stax + Awais workflows. Reframe alex-voice as a checklist Codex can run, not just a drafting prompt for Claude.

**Technique 4 — Post-pass forensic audit (Stax "Prompt 3").**

- Structural scan (paragraph length variance, sentence rhythm)
- Vocabulary purge (ban list)
- Voice testing (read aloud, does it sound like the author's other work?)
- Em-dash and ellipsis audit (alex-voice already addresses this)

### E. Concrete workflows to model

**Workflow 1 — Ryan Stax (The AI Handbook / readaihandbook.com).** [11][13][14]

- Stage 1: Gemini Deep Research with custom prompts for "recent data, counterarguments, historical analogies, surprising connections, all with direct URLs" — claims 3× speed-up on research phase alone.
- Stage 2: Manual outline + thesis (refuses to outsource).
- Stage 3: AI-assisted draft (Claude or Gemini for prose).
- Stage 4: Four-prompt voice scrub (before/during/after/rescue).
- Stage 5: Human edit. Publishes 2+ issues per week solo.

**Workflow 2 — Awais Yusaf "route by strength" (LinkedIn, public).** [16]

- Pipelines that combine all three models per task. Claude for "complex reasoning, long pipelines, strict instruction-following." GPT for "end-to-end execution and tool-chaining." Gemini for "massive context and Workspace depth."
- His commenter Lukas Hillbricht's architectural take: "split tasks into narrow-job agents, use Pydantic schemas for output, default to smallest model that handles each subtask reliably." This is the right mental model for solo ops too.

**Workflow 3 — Lenny Rachitsky / Ben Thompson archetype (solo creator).** [24]

- Less publicly documented per-model, but the pattern is consistent: AI as _researcher and first-pass critic_, never as final voice. Lenny explicitly covers AI tools in his newsletter (his "AI glossary" lists Claude, Gemini, GPT, Llama, Grok, DeepSeek, Mistral). Both creators ship weekly solo with strong personal voice — implying their AI use is heavy on research/structure, light on prose.

### F. Capacity math (with the proposed multi-LLM stack)

Baseline (full manual, no AI): 4,000 words = 8-13 hours including research, draft, edit. [15][25]

| Asset tier        | Words    | Manual hrs | Multi-LLM hrs | Compression source                                                                                  |
| ----------------- | -------- | ---------- | ------------- | --------------------------------------------------------------------------------------------------- |
| Hub post          | 4-8k     | 13-25      | **6-9**       | Gemini DR cuts research 3-4×; Claude draft cuts initial prose ~2×; you stay full-time on edit/voice |
| Service page      | 800-1.2k | 3-5        | **1.5-2**     | Less research, more positioning. Claude single-pass + Codex audit + you                             |
| Original research | 2-4k     | 12-20      | **12-16**     | Original data collection is irreducibly human; AI helps draft + visualize, not collect              |

The "research releases" tier compresses _least_ because the high-leverage activity (collecting original data) doesn't get faster with AI. That's also why it has the highest citation value — it's the asset competitors can't replicate.

### G. The Codex (GPT-5.5) caveat for content work

GPT-5.5 in Codex CLI is **strongest at agentic execution and code, weakest at warm prose**. The MindStudio review and Simon Willison's coverage both note: it's an agent, not a writer. For alexmayhew.dev's stack:

- **Yes:** use Codex as critic, fact-checker, voice-auditor, link-validator
- **No:** don't use Codex as primary drafter for hub posts
- **Maybe:** Codex for service pages where terse, technical, action-oriented prose matches its native register

GPT-5.5 in Codex is currently only available via ChatGPT sign-in (not API key). This matches the user's existing CLI setup. [17][26]

---

## Conflicting Information

- **Long-form benchmarks vs. user reports.** EQ-Bench has Claude Opus 4.7 at 2216 vs GPT-5.5 at 2024 — a ~9% gap. But practitioner reports on LinkedIn/Reddit are noisier; some teams report GPT-5.5 outputs they prefer for technical tutorials. The synthesis: Opus wins on _literary_ prose and emotional resonance; GPT can match or beat it on _terse technical_ prose under 1,500 words. For alexmayhew.dev's mix of 4k narrative hubs + 1k service pages, that maps to: Opus for hubs, either for service pages.
- **AI detection signals.** Pangram Labs argues perplexity/burstiness "fail to detect AI" — but Originality.ai and GPTZero still sell these metrics. Google specifically does NOT use them per multiple sources. Resolution: ignore detector tools; optimize for original content + expert review + non-overlap with the AI-generated web.
- **Word count for AI Overview citation.** ALM Corp data shows 53% of citations go to <1,000 word pages. Other sources (Stridec, Demand Local) recommend "comprehensive 2,000-3,000 word pillars." Resolution: both are right for _different surfaces_. AI Overview answer-extraction wants concise self-contained 134-167 word chunks; the surrounding pillar context demonstrates topical authority for ranking. Build long pillars _with_ short answer-block sections inside them.

---

## Gaps

- **Stratechery / Lenny specific stacks.** Neither publicly documents per-model assignments. Inference only.
- **EQ-Bench Longform exact rankings as of May 2026.** EQ-Bench updates daily; report cites April 2026 snapshot.
- **Real benchmarks for "AI Overview citation rate by content style."** No public dataset isolates voice/style as a variable.
- **Gemini 3.1 Pro CLI vs browser Deep Research output format differences.** Anthropic-style structured output is mature; Gemini Deep Research output formatting is less standardized in 2026 reports.

---

## Sources

1. [Claude Opus 4.7 vs Gemini 3.1 Pro: Which Model Is Better?](https://www.datacamp.com/blog/claude-opus-4-7-vs-gemini-3-1-pro) — DataCamp benchmark synthesis April 2026 (SWE-bench, ARC-AGI, OSWorld)
2. [EQ-Bench Creative Writing v3 Leaderboard](https://eqbench.com/creative_writing.html) — Live leaderboard, Opus 4.7 = 2216 Elo
3. [Best LLMs for Writing in 2026 — Aggregated Benchmarks](https://evy.so/compare/best-llms-for-writing/) — Confirms EQ-Bench rankings, voice consistency claims
4. [How to Recover from a Google Helpful Content Update — Case Study (2025)](https://seo.ai/blog/how-to-recover-from-a-google-helpful-content-update) — Recovery patterns, what changed
5. [Does Google Penalize AI Content? Case Study (2025) | Rankability](https://www.gotchseo.com/does-google-penalize-ai-content/) — 175-site deindex study, Casual.com case
6. [AI Content SEO Drop Case Study](https://hastewire.com/blog/ai-content-seo-drop-case-study-real-penalties-and-pitfalls) — Specific failure-mode signals
7. [Where Google AI Overviews pull their answers from (CXL)](https://cxl.com/blog/google-ai-overview-citation-sources/) — 100-citation analysis
8. [What Makes Content Citable by AI Engines in 2026](https://alyssanavarrosa.medium.com/what-makes-content-citable-by-ai-engines-in-2026-3eeca6a0b319) — 134-167 word self-contained units, 4.2× citation lift at 8.5/10 semantic completeness
9. [Google AI Overview Citations from Top-10 Pages Dropped 76%→38% (ALM Corp)](https://almcorp.com/blog/google-ai-overview-citations-drop-top-ranking-pages-2026/) — 53% citation share goes to <1,000 word pages
10. [Anthropic — Use examples (multishot prompting)](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/multishot-prompting) — One-shot / few-shot ladder
11. [Four Prompts to Make AI Writing Sound Human — Ryan Stax](https://ryanstax.substack.com/p/four-prompts-to-make-ai-writing-sound) — Before/during/after/rescue prompt structure, "Rule of Three destroyer"
12. [Implementing Long Text Style Transfer with LLMs (ZeroStylus, ICLR 2026)](https://arxiv.org/html/2505.07888v1) — Hierarchical template extraction for paragraph-level voice preservation
13. [I Built a Gemini Workflow That Tripled My Writing Speed — Ryan Stax](https://ryanstax.substack.com/p/i-built-a-gemini-workflow-that-killed) — Concrete Deep Research prompts, URL verification discipline
14. [Gemini Deep Research for Writers (Skywork)](https://skywork.ai/blog/ai-agent/gemini-for-writers/) — 8-month testing results, time savings
15. [How Long Does It Take to Write 4000 Words?](https://capitalizemytitle.com/writing-time/4000-words/) — 8-13 hour baseline for research-driven long-form
16. [Awais Yusaf — Claude vs GPT vs Gemini for Agentic Workflows (LinkedIn)](https://www.linkedin.com/posts/awaisyusaf_claude-vs-gemini-vs-gpt-activity-7445883041929027585-C5H_) — "Route by strength" pattern, plus Hillbricht/Becker comments on agentic architecture
17. [GPT-5.5 vs Claude Opus 4.7 vs Gemini 3.1 Pro for Builders (MindStudio)](https://www.mindstudio.ai/blog/gpt-5-5-review-developers-builders/) — GPT-5.5 strengths/weaknesses for content work, instruction persistence improvements
18. [Gemini Deep Research Agent | Gemini API](https://ai.google.dev/gemini-api/docs/deep-research) — Native MCP support, autonomous research loop
19. [Deep Research Max — Google blog](https://blog.google/innovation-and-ai/models-and-research/gemini-models/next-generation-gemini-deep-research/) — Built on Gemini 3.1 Pro, native visualizations
20. [The Rise of the One-Person Creator Company (Sociolatte)](https://www.sociolatte.com/2025/10/the-rise-of-one-person-creator-company.html) — Lenny + Stratechery as solo-creator archetypes; "AI as staff"
21. [Why Perplexity and Burstiness Fail to Detect AI — Pangram Labs](https://www.pangram.com/blog/why-perplexity-and-burstiness-fail-to-detect-ai) — Why these metrics don't survive editing
22. [Google AI Content Detector: What Small Business Owners Need to Know — 2026](https://websitecontentwriters.org/google-ai-content-detector-2026/) — Pattern-repetition vs perplexity, what Google actually checks
23. [Anthropic Prompting Best Practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) — System prompt structure (Identity → Safety → Tone)
24. [Lenny Rachitsky — AI Glossary + Best of 2025](https://www.lennysnewsletter.com/p/an-ai-glossary) — Lenny's stack scope; archetype for solo AI-augmented creator
25. [Content Marketing Statistics 2026 (DigitalApplied)](https://www.digitalapplied.com/blog/content-marketing-statistics-2026-data-points) — 89% say original research is the strongest differentiator; 66.3% cite updates as second-highest impact
26. [Introducing GPT-5.5 — OpenAI](https://openai.com/index/introducing-gpt-5-5/) — Codex-only initial availability, agentic focus
