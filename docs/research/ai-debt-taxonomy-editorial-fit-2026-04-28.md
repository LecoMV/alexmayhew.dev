# AI-Debt Taxonomy: Editorial Fit Analysis (2026-04-28)

**Status:** CURRENT
**Session:** Decide URL strategy for AI-debt taxonomy synthesis. SEO-auditor handles authority/cannibalization on the data side; this is the editorial read.

---

## EDITORIAL RECOMMENDATION: A (new dedicated post at `/blog/ai-debt-taxonomy`)

The 4 existing files cover ~70% of the synthesis material, but they cover it in 4 different framings... none of them is "here are the 5 types of AI debt, side by side." A reader landing on `cognitive-debt-ai-teams` gets a deep monograph on one type. Landing on `generative-debt` gets 4 sub-types under one umbrella term. Landing on the `technical-debt-bomb` gets a CTO accounting framework with debt categories embedded in the remediation playbook. None of these is a clean taxonomy reference.

Option B (expand the hub) breaks the hub. The hub's "AI Multiplier Effect" frame is the right opener for someone landing cold on AI integration... taxonomy as central frame demotes architecture, prompt engineering, cost optimization, and code review into footnotes. Wrong tradeoff.

Option C (retitle/expand `generative-debt`) requires a top-to-bottom rewrite. The current post's spine is "the productivity paradox → here's why AI code is a liability → here's the workflow to fix it." A 5-type taxonomy doesn't graft onto that spine without rewriting the intro, the section structure, and the conclusion. At that point you've written a new post but kept the URL... which steals the authority of the strongest "generative debt" search term anchor.

Option D (lean 1,500-word comparison) under-serves the topic. The 5 debt types each need ~300-500 words to be useful, plus a comparison matrix, plus a decision framework for which type matters at which stage. 1,500 words is a teaser, not the canonical answer. AI citation engines reward depth and structured matrices... a thin post won't earn the citation.

**Option A wins because:** the synthesis post can pull the matrix forward, link out to each existing post as the deep-dive on that specific debt type, and serve a distinct query ("what kinds of AI debt are there") that none of the 4 existing posts directly answers.

---

## Overlap Matrix

| Debt Type                                               | `generative-debt`                                         | `cognitive-debt-ai-teams`                                        | `ai-technical-debt-bomb`                                | Hub guide                              |
| ------------------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------- | -------------------------------------- |
| **Structural debt** (architectural violations)          | Section: "Structural Debt" (full)                         | Section: "Architectural Boundary Enforcement" (remediation only) | Table row: "Architectural Drift"                        | Mentioned in "Code Generation Reality" |
| **Hallucinated complexity** (over-engineered solutions) | Section: "Hallucinated Complexity" (full)                 | Not covered                                                      | Not covered                                             | Not covered                            |
| **Omission debt** (missing edge cases)                  | Section: "Omission Debt" (full)                           | Mentioned briefly in "Knowledge fragmentation"                   | Not covered                                             | Mentioned in "What Fails"              |
| **Security debt** (vulns + package hallucination)       | Section: "Security Debt" + "Security Implications" (full) | Not covered                                                      | Mentioned in 322% vuln stat                             | Mentioned in "Security-critical code"  |
| **Cognitive debt** (understanding gap)                  | Not covered as a category                                 | Entire post (the canonical treatment)                            | Section: "Comprehension Debt" (one of three categories) | Mentioned in FAQ                       |
| **Copy-paste / duplication debt**                       | Mentioned in TL;DR                                        | Section: "The Refactoring Death Spiral"                          | Section: "Copy-Paste Code Is Surging" (full)            | Not covered                            |
| **Comprehension debt** (sub-type of cognitive)          | Not covered                                               | Whole post is this                                               | Section: "Comprehension Debt"                           | Not covered                            |

**Synthesis %:** ~70% of the prose already exists. What's missing is the unifying lens... a single page that says "there are 5 distinct debt types, here's how they differ, here's which one bites you at which growth stage, here's which post to read for each." That synthesis page doesn't exist anywhere in the cluster.

---

## Voice Consistency Check

The 3 debt posts read as one voice. Same opener pattern (concrete number → contrarian reframe), same `...` cadence, same advisory-anecdote inserts ("In my advisory work..."), same "When NOT to worry about this" closer pattern in both `cognitive-debt` and `technical-debt-bomb`. A 5-type synthesis written in this voice will feel native, not grafted-on. No voice risk.

---

## Cannibalization Risk Assessment

Real but manageable. The risk is that `/blog/ai-debt-taxonomy` competes with `cognitive-debt-ai-teams` for "ai cognitive debt" / "ai technical debt" queries... currently the strongest performer in AI-crawler citation data per memory.

**Mitigation:** the taxonomy post must be a directory, not a treatment. Each debt type gets a 200-300 word definition + one example + a "deep dive: [link]" pointer. The taxonomy post earns "what types of AI debt exist" queries; `cognitive-debt-ai-teams` keeps "how do I measure cognitive debt" / "what is cognitive debt" queries. Clean intent split.

If the taxonomy post tries to be definitive on each type, it will steal authority from the spokes. Discipline matters here.

---

## Required Content Moves Regardless of Option

**1. The `generative-debt` post needs its taxonomy section restructured anyway.** Currently it presents 4 sub-categories (structural, hallucinated complexity, omission, security) under the "generative debt" umbrella, but the overall post conflates "generative debt = the 4 sub-types" with "generative debt = everything wrong with AI code." The naming is muddled. Fix: rename the section "Four Categories of Generative Defect" so the umbrella term `generative debt` becomes one type in the broader taxonomy, not a synonym for "all AI debt." This unblocks option A's matrix.

**2. The hub's "Generative debt is..." FAQ answer needs to point at the taxonomy post, not the `generative-debt` post.** Currently it defines generative debt as the catch-all... that's inconsistent with the taxonomy framing where it's one type among 5. One sentence change, but it's load-bearing for the cluster's coherence.
