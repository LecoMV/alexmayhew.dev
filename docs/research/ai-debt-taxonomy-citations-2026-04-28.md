# AI-Debt Taxonomy — Primary-Source Citation Verification (2026-04-28)

**Status:** CURRENT
**Session:** Verify every statistic destined for `/blog/ai-debt-taxonomy` against primary publications. Tier each by retrieval confidence. Reject anything that can't be traced to an original source.
**Method:** Direct fetches of arXiv papers, vendor reports, blog posts, and press releases. No second-hand citations accepted. PDFs converted with `pdftotext` for line-level verification.

---

## SUMMARY (canonical citation file for drafting)

### Verified — use exactly as written (HIGH confidence)

| #   | Stat                                                                                              | Source                                      | Notes                                                                                         |
| --- | ------------------------------------------------------------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1   | METR: 19% slower with AI                                                                          | METR + arXiv 2507.09089                     | RCT, N=16 devs, 246 issues, July 2025. Devs predicted +24%, perceived +20%.                   |
| 2a  | GitClear: 211M lines analyzed (Jan 2020 – Dec 2024)                                               | GitClear "AI Copilot Code Quality" Feb 2025 | William Harding (CEO/lead). Verified in PDF.                                                  |
| 2b  | GitClear: copy/paste rose 8.3% (2020) → 12.3% (2024)                                              | GitClear 2025 PDF p. tabular data           | Direct quote in report.                                                                       |
| 2c  | GitClear: "Moved" code crashed −39.9% YoY (24.8% in 2021 → 9.5% in 2024)                          | GitClear 2025 PDF                           | Cleaner framing than the loose "60% decline in refactoring."                                  |
| 2d  | GitClear: 8x increase in code blocks with 5+ duplicated lines (in 2024)                           | GitClear 2025 PDF                           | Use this — NOT "8x copy-paste."                                                               |
| 2e  | GitClear cites Google DORA 2024: 7.2% delivery-stability decrease per 25% increase in AI adoption | Google DORA 2024 (via GitClear)             | Use Google as primary, GitClear as secondary.                                                 |
| 4a  | CodeRabbit: AI PRs ship 1.7x more issues (10.83 vs 6.45 per PR)                                   | CodeRabbit Dec 17 2025 report               | N=470 PRs (320 AI-co-authored, 150 human). David Loker.                                       |
| 4b  | CodeRabbit: 2.74x more security vulnerabilities                                                   | Same report                                 | NOT 322% — that's a different study (Apiiro).                                                 |
| 4c  | Apiiro: 322% more privilege escalation paths in AI code                                           | Apiiro Sep 4 2025                           | "Tens of thousands of repos, several thousand devs, Fortune 50 enterprises." Different scope. |
| 5   | Stack Overflow 2025 Survey: 3.1% highly trust AI accuracy                                         | survey.stackoverflow.co/2025/ai/            | N=49K+ developers. 33% trust, 46% distrust.                                                   |
| 6   | Storey "Triple Debt Model": Technical / Cognitive / Intent                                        | arXiv 2603.22106                            | Margaret-Anne Storey, U. Victoria. Submitted Mar 23 2026, v4 Apr 6. NO sample sizes in paper. |
| 7   | Osmani: comprehension debt definition + 17% comprehension drop                                    | O'Reilly Radar Apr 13 2026                  | The 17% figure is from an Anthropic study he cites (N=52 engineers).                          |
| 8   | getDX: cognitive debt is project-level (lives "in the brains of developers")                      | getDX newsletter Apr 22 2026                | Authors: Abi Noda + Margaret-Anne Storey (guest). NO numerical stats.                         |
| 9   | Aleix Hernández Miró: "generative debt" coining definition                                        | LinkedIn Pulse Jan 9 2026                   | URL still live (HTTP 200, verified 2026-04-28).                                               |
| 10  | ThoughtWorks Tech Radar v34: AI-induced cognitive debt                                            | thoughtworks.com Apr 15 2026                | NO definition, NO stats. Useful as endorsement signal only.                                   |
| 11  | Harness "State of Software Delivery": 67% of devs spend more time debugging AI code               | Harness Jan 8 2025 press release            | N=500 engineering leaders/devs. Use the 67% — NOT the loose "majority."                       |
| 12  | GitHub Copilot: 55.8% faster on JS HTTP server task                                               | GitHub research blog Sep 7 2022             | N=95 devs. CI [21%, 89%]. ONE task. Use carefully.                                            |

### Reframe required (MEDIUM confidence — need editorial repair)

| Stat as proposed                                                                                    | Problem                                                                                                                                                                                                                                                            | Required reframe                                                                                                                                                                                                                  |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Forrester $1.5T AI-debt projection by 2027"                                                        | DOES NOT EXIST. Conflation of Gartner's $1.5T worldwide AI **spending** forecast (2025) with Forrester's separate technical-debt severity prediction.                                                                                                              | DROP the dollar figure. Replace with verified Forrester stat: "75% of technology decision-makers will see their technical debt rise to moderate or high severity by 2026" (Forrester Predictions 2025, Oct 22 2024).              |
| "23.7% higher bug-fix ratio in AI-heavy codebases"                                                  | NOT in any GitClear report. Likely paraphrase confusion with one of: Google DORA's 7.2% delivery-stability drop per 25% AI-adoption increase, or a third-party study GitClear cites (Type 1-3 clones in DL projects: 57.1% of co-changed clones involved in bugs). | DROP. Substitute Google DORA: "AI adoption brings detrimental effects… reductions to software delivery performance" (DORA 2024). Pair with verified GitClear "first year on record where copy/paste exceeded moved lines" (2024). |
| "60% decline in refactoring activity"                                                               | Not the framing GitClear used. They reported "Moved" code dropped from 24.8% in 2021 to 9.5% in 2024 — that's a 61.7% relative decline of moved-code share. Defensible but reframe as exact data.                                                                  | Use: "GitClear: 'Moved' code lines dropped from 24.8% of changes in 2021 to 9.5% in 2024 — a 39.9% YoY drop in 2024 alone."                                                                                                       |
| "8x increase in copy-paste"                                                                         | Conflation. The 8x figure is for "code blocks with 5+ duplicated lines" — NOT for copy/paste lines as a category (which only rose 8.3% → 12.3%).                                                                                                                   | Use: "GitClear recorded an 8-fold increase in code blocks with 5+ duplicated lines during 2024." NOT "8x copy-paste."                                                                                                             |
| "Stack Overflow: 3.1% highly trust AI-generated code"                                               | Verified, but check phrasing. The 3.1% is "highly trust the accuracy of AI tools." Among professional devs the figure is 2.7%.                                                                                                                                     | Use exact phrasing from survey page: "Highly trust: 3.1%. Somewhat trust: 29.6%. Somewhat distrust: 26.1%. Highly distrust: 19.6%."                                                                                               |
| "75% of tech decision-makers reporting moderate-to-severe AI debt — same source or separate study?" | Same source as the $1.5T claim (Forrester Predictions 2025). The framing is "technical debt," not "AI debt."                                                                                                                                                       | Use: "75% of tech decision-makers will see technical debt rise to moderate or high severity by 2026" (Forrester Predictions 2025, Oct 22 2024).                                                                                   |
| "Addy Osmani — '70% Problem' / Comprehension Debt (O'Reilly Radar 2026-04-13)"                      | These are **two different essays** by Osmani conflated into one. "The 70% Problem" is December 2024 (his Substack `addyo.substack.com/p/the-70-problem-hard-truths-about-`). "Comprehension Debt" is March 14 2026 (Medium) → April 13 2026 (O'Reilly Radar).      | Treat separately. Cite "70% Problem" only for the AI-finishes-70%-of-the-task framing. Cite "Comprehension Debt" for the AI-vs-human-comprehension-gap definition + the 17% Anthropic study.                                      |
| "Harness 2025 developer survey — majority of engineers spend more time debugging"                   | Verified but loose. Use the precise 67% figure.                                                                                                                                                                                                                    | "67% of developers say they spend more time debugging AI-generated code; 92% report AI increases the 'blast radius' from bad code reaching production" (Harness, Jan 8 2025).                                                     |

### DO NOT USE

| Stat                                                   | Reason                                                                                                                            |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| "Forrester $1.5T AI-debt projection by 2027"           | Does not exist in any Forrester publication.                                                                                      |
| "23.7% higher bug-fix ratio" (attributed to GitClear)  | Does not appear in either GitClear report. Likely paraphrase corruption.                                                          |
| "8x increase in copy-paste" (without qualifier)        | Misrepresents the 8x figure (which is for 5+-line duplicate blocks, not the copy/paste line metric).                              |
| "55% faster" stated as a general AI productivity claim | Single-task RCT (HTTP server in JS, N=95). Cannot be generalized to "AI makes devs 55% faster." If used, must include task scope. |

---

## Stat 1: METR — "19% slower with AI assistance"

- **Source URL:** https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/
- **arXiv paper:** https://arxiv.org/abs/2507.09089 ("Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity")
- **Authors:** METR research team (Joel Becker et al.)
- **Publication date:** July 10, 2025
- **Methodology:** Randomized controlled trial. Developers randomly assigned to allow-AI or disallow-AI on each of 246 issues from their own repositories. Tasks averaged ~2 hours. Self-reported time + screen recordings.
- **Sample size:** **16 experienced open-source developers**, **246 total issues**.
- **Primary AI tools:** Cursor Pro with Claude 3.5 / 3.7 Sonnet (frontier at study time).
- **Direct quote:** "When developers are allowed to use AI tools, they take 19% longer to complete issues—a significant slowdown that goes against developer beliefs and expert forecasts."
- **Perception gap:** Developers predicted AI would speed them up by 24% pre-study; estimated being sped up by 20% post-study.
- **Confidence:** HIGH
- **Caveats (from authors):**
  - Applies specifically to experienced devs on large, high-quality OSS projects.
  - Authors explicitly note results "do not represent most software development broadly."
  - Learning effects beyond ~50 hours of tool usage cannot be ruled out.
  - Selection bias in recruitment is acknowledged.
- **Use it as:** "exactly as written" — but always with the "experienced devs / mature codebases" qualifier. The study's own follow-up (Feb 2026 update) softened framing; cite the original July 2025 paper.

---

## Stat 2: GitClear — "211 million lines of code" analysis

- **Source URL:** https://www.gitclear.com/ai_assistant_code_quality_2025_research
- **PDF:** https://gitclear-public.s3.us-west-2.amazonaws.com/GitClear-AI-Copilot-Code-Quality-2025.pdf
- **Author:** William Harding, Lead Researcher & CEO, Alloy.dev Research
- **Publication date:** February 2025 (v2025.2.5)
- **Title:** "AI Copilot Code Quality: Evaluating 2024's Increased Defect Rate via Code Quality Metrics"
- **Methodology:** Largest known database of structured code-change data. ~10,000 repos sample (per appendix A2). 211M lines analyzed Jan 2020 – Dec 2024.
- **Direct quote (lines analyzed):** "211 million changed lines of code, authored between January 2020 and December 2024."

### 2a. Bug-fix ratio claim (23.7%) — **NOT VERIFIED**

- **Searched:** GitClear 2025 PDF (1,566 lines, full text), GitClear 2024 PDF, GitClear blog landing pages.
- **Result:** No "23.7%" figure anywhere. Closest stats found:
  - "57.1% of all co-changed clones are involved in bugs" (cited from a third-party DL study, NOT GitClear's own claim).
  - Google DORA 2024: "for every 25% increase in the adoption of AI, their model projects a 7.2% decrease in delivery stability."
- **Confidence:** LOW (does not exist as stated)
- **Use it as:** **DO NOT USE.** Replace with Google DORA's 7.2% figure cited via GitClear, or with one of the verified GitClear metrics below.

### 2b. Refactoring decline (60%? 25% → <10%?)

- **Direct quote:** "the percentage of changed code lines (associated with refactoring) sunk from 25% of changed lines in 2021, to less than 10% in 2024."
- **Specific table values:** "Moved" code: 24.1% (2020), 24.8% (2021), 20.5% (2022), [2023 row obscured], 9.5% (2024 actual). 2024 YoY change for Moved: **−39.9%**.
- **Confidence:** HIGH
- **Use it as:** "GitClear's 211M-line analysis found 'Moved' code (the signature of refactoring) collapsed from 24.8% of changes in 2021 to 9.5% in 2024 — a 39.9% YoY drop in 2024 alone."

### 2c. Copy/paste increase (8x?)

- **Two distinct stats — DO NOT CONFLATE:**
  1. Copy/pasted lines (per-commit basis): **8.3% (2021) → 12.3% (2024).** A 4-percentage-point absolute increase, ~48% relative increase.
  2. Code blocks with 5+ duplicated lines: **8-fold increase during 2024.**
- **Direct quote:** "we recorded an 8-fold increase in the frequency of code blocks with 5+ duplicated lines during 2024."
- **Direct quote:** "lines classified as 'copy/pasted' (cloned) rose from 8.3% to 12.3% in the same period."
- **Confidence:** HIGH (when used precisely)
- **Use it as:** Pick one carefully. Phrasing like "8x increase in copy-paste" without qualifier is misleading.

### 2d. Headline finding

- **Direct quote:** "2024 marked the first year GitClear has ever measured where the number of 'Copy/Pasted' lines exceeded the count of 'Moved' lines."
- **Confidence:** HIGH
- **Use it as:** Strongest single sentence to quote from the GitClear report.

---

## Stat 3: Forrester "$1.5T AI-debt projection by 2027" — **DOES NOT EXIST**

- **Searched:** Forrester press releases (2024 & 2026 predictions), Forrester blogs, CFO Dive, Construction Dive, Yahoo Finance, BusinessWire.
- **Result:** Zero hits for "$1.5 trillion AI debt." The figure that exists is:
  - **Gartner**, not Forrester: "Worldwide AI **spending** will total $1.5 trillion in 2025" (Sep 17 2025). This is AI spending, not AI debt.
  - **Forrester** has a separate prediction: "More than 50% of technology decision-makers will see their technical debt rise to a moderate or high level of severity in 2025, with that number projected to reach 75% by 2026."
- **Source URL (verified Forrester stat):** https://www.forrester.com/press-newsroom/forrester-predictions-2025-tech-security/ — "Forrester's Technology & Security Predictions 2025"
- **Publication date:** October 22, 2024
- **Direct quote:** "75% of technology decision-makers will see their technical debt rise to a moderate or high level of severity by 2026."
- **Confidence:** HIGH (for the 75% stat) / ZERO (for the $1.5T claim — does not exist)
- **Use it as:** **DROP "$1.5T by 2027" entirely.** Use the Forrester 75% figure exactly as written. Do not say "AI debt" — Forrester says "technical debt."

### Related but separate: $2.41T Accenture/CISQ figure

- **Direct quote (CFO Dive citing Accenture):** "tech debt costs U.S. organizations $2.41 trillion a year"
- **Original source:** Consortium for Information and Software Quality (CISQ), 2022 data. Cited by Accenture, then by Forrester analyst Carlos Casanova.
- **Confidence:** MEDIUM (third-hand citation; primary source is CISQ 2022, which is itself dated)
- **Use it as:** If a dollar figure is needed, this is the only credible one. Cite as "Accenture/CISQ 2022."

---

## Stat 4: CodeRabbit — "1.7x more bugs, 322% more security vulnerabilities"

- **Source URL:** https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report
- **Author:** David Loker
- **Publication date:** December 17, 2025
- **Sample size:** **470 open-source GitHub pull requests** (320 AI-co-authored, 150 human-only).

### 4a. 1.7x bugs — **VERIFIED**

- **Direct quote:** "AI-authored changes produced 10.83 issues per PR, compared to 6.45 for human-only PRs" (= ~1.68x, headlined as 1.7x).
- **Confidence:** HIGH
- **Use it as:** "exactly as written" — include the underlying 10.83 vs 6.45 numbers when space allows.

### 4b. 322% security vulnerabilities — **WRONG ATTRIBUTION**

- The 322% figure is **NOT in CodeRabbit's report.** CodeRabbit's actual security finding is **2.74x more security vulnerabilities** (≈174% increase).
- **Direct quote (CodeRabbit):** "Security issues were up to 2.74× higher" with improper password handling identified as the most prominent pattern.
- The 322% figure comes from a **different study by Apiiro**: https://apiiro.com/blog/4x-velocity-10x-vulnerabilities-ai-coding-assistants-are-shipping-more-risks/
- **Apiiro details:** Itay Nussbaum (Product Manager), September 4, 2025. Sample: "tens of thousands of code repositories and several thousand developers across Fortune 50 enterprises" via Apiiro's Deep Code Analysis (DCA) engine. Time period Dec 2024 – June 2025.
- **Apiiro direct quote:** "Privilege escalation paths jumped 322%, and architectural design flaws spiked 153%."
- **Confidence:** HIGH (when correctly attributed)
- **Use it as:** **REFRAME.** Use 2.74x (CodeRabbit) for "more security vulnerabilities." Use 322% (Apiiro) for "more privilege escalation paths" — these are different metrics from different studies. Do not attribute 322% to CodeRabbit.

### 4c. Other CodeRabbit findings (verified)

| Stat                | Direct quote                                                        |
| ------------------- | ------------------------------------------------------------------- |
| Logic & correctness | "Logic and correctness issues were 75% more common in AI PRs"       |
| Readability         | "Readability issues spiked more than 3× in AI contributions"        |
| Error handling      | "Error handling and exception-path gaps were nearly 2× more common" |
| Performance         | "Excessive I/O operations were ~8× more common in AI-authored PRs"  |
| Formatting          | "Formatting problems were 2.66× more common in AI PRs"              |

---

## Stat 5: Stack Overflow Developer Survey — "3.1% highly trust AI-generated code"

- **Source URL:** https://survey.stackoverflow.co/2025/ai/
- **Survey year:** 2025 Stack Overflow Developer Survey
- **Sample size:** **49,000+ developers worldwide** (33,244 responses to AI questions; 67.8% response rate per the AI section).
- **Publication date of report:** December 29, 2025
- **Direct quote:**
  - Highly trust: 3.1%
  - Somewhat trust: 29.6%
  - Somewhat distrust: 26.1%
  - Highly distrust: 19.6%
- **Direct quote (summary):** "More developers actively distrust the accuracy of AI tools (46%) than trust it (33%), and only a fraction (3%) report 'highly trusting' the output."
- **Among professional developers:** "highly trust" drops to 2.7%.
- **Confidence:** HIGH
- **Use it as:** "exactly as written." If choosing one number, the cleanest phrasing is "Only 3.1% of developers highly trust the accuracy of AI-generated code; 46% actively distrust it" (StackOverflow 2025 Survey).

---

## Stat 6: Storey — "From Technical Debt to Cognitive and Intent Debt" (arXiv 2603.22106)

- **Source URL:** https://arxiv.org/abs/2603.22106
- **PDF:** https://arxiv.org/pdf/2603.22106
- **Author:** Margaret-Anne Storey (sole author). Email: mstorey@uvic.ca → **University of Victoria** (Computer Science, BC, Canada).
- **Publication date:** Submitted March 23, 2026 (v1); last revised April 6, 2026 (v4).
- **Length:** 10 pages, 1 figure.
- **Triple Debt Model — direct quote (abstract):** "This article proposes a Triple Debt Model for reasoning about software health, built around three interacting debt types: technical debt in code, cognitive debt in people, and intent debt in externalized knowledge."
- **Cognitive debt definition (direct quote):** "Cognitive debt is a team-level, project-level property reflecting the erosion of shared understanding across a software system over time, leading to increasingly inadequate shared mental models for reasoning about and safely changing the system."
- **Intent debt definition (direct quote):** "Intent debt refers to the absence or erosion of explicit rationale, goals, and constraints that guide how humans and agents evolve the system."
- **Sample size of pilot study:** **NONE.** The paper is a position/framework paper. No empirical study with sample size is reported.
- **Confidence:** HIGH (for definitions); the paper is a conceptual framework, not an empirical study, so do not cite "studies" or "data" from it.
- **Use it as:** "exactly as written" for the Triple Debt Model definitions. Do not imply empirical backing.

---

## Stat 7: Addy Osmani — "Comprehension Debt" (O'Reilly Radar)

- **Source URL (O'Reilly):** https://www.oreilly.com/radar/comprehension-debt-the-hidden-cost-of-ai-generated-code/
- **Source URL (original on Osmani's blog):** https://addyosmani.com/blog/comprehension-debt/
- **Source URL (Medium):** https://medium.com/@addyosmani/comprehension-debt-the-hidden-cost-of-ai-generated-code-285a25dac57e
- **Author:** Addy Osmani
- **Publication date:** March 14, 2026 (Osmani's blog/Medium); April 13, 2026 (O'Reilly Radar republication).
- **Definition (direct quote):** "Comprehension debt is the growing gap between how much code exists in your system and how much of it any human being genuinely understands."
- **Cited statistic — the 17% comprehension drop:** "An Anthropic study of 52 engineers learning a new library found that AI-assisted participants 'scored 17% lower on a follow-up comprehension quiz (50% versus 67%).'"
- **Cited statistic — passive vs active AI use:** "developers using AI for code generation delegation score below 40% on comprehension tests, while developers using AI for conceptual inquiry score above 65%."
- **Headline framing (direct quote):** "AI generates code far faster than humans can evaluate it."
- **Confidence:** HIGH (for Osmani's definition and quotes); MEDIUM for the underlying 17% figure (it's an Anthropic study cited inside Osmani's piece — track to primary if used as a load-bearing stat).
- **Use it as:** "exactly as written" for the comprehension-debt definition. The 17% Anthropic figure should be cited as "an Anthropic study cited by Osmani" not as Osmani's own data.

### Important: "70% Problem" is a SEPARATE Osmani essay

- **Source URL:** https://addyo.substack.com/p/the-70-problem-hard-truths-about
- **Publication date:** December 2024 (per Osmani's Substack)
- **Concept:** "AI gets you 70% of the way to a working solution, but that last 30% is where things get tricky."
- **Confidence:** HIGH
- **Use it as:** Separate citation. Do NOT conflate with the "Comprehension Debt" piece — they are different essays from different years.

---

## Stat 8: getDX — "Cognitive Debt: The Hidden Risk in AI-Driven Software Development"

- **Source URL:** https://newsletter.getdx.com/p/cognitive-debt-the-hidden-risk-in
- **Authors/Byline:** Abi Noda (founder, getDX) + Margaret-Anne Storey (guest contributor).
- **Publication date:** April 22, 2026
- **Definition (direct quote):** "The debt compounded from going fast lives in the brains of the developers and affects their lived experiences and abilities to 'go fast' or to make changes."
- **Project-level framing (direct quote):** Cognitive debt is "a project-level property, capturing how a team loses understanding over time."
- **Statistics cited:** **NONE.** The piece is qualitative — references the Storey arXiv paper and the same 52-engineer study Osmani cites, but doesn't introduce new numbers.
- **Mitigation framing:** "require that at least one human on the team fully understands each AI-generated change before it ships, document not just what changed but why, and create regular checkpoints where the team rebuilds shared understanding."
- **Confidence:** HIGH
- **Use it as:** "exactly as written" for the definition. Do not attribute statistics to this source — it has none.

---

## Stat 9: Aleix Hernández Miró — "Generative Debt: The Hidden Cost of Vibe Coding"

- **Source URL:** https://www.linkedin.com/pulse/generative-debt-hidden-cost-vibe-coding-aleix-hern%C3%A1ndez-mir%C3%B3-upe5e
- **URL still live:** Verified HTTP 200 on 2026-04-28.
- **Author:** Aleix Hernández Miró (Oracle, per byline).
- **Publication date:** January 9, 2026
- **Definition (direct quote):** "the accumulated cost of AI-generated code that you've accepted without sufficient review, validation or understanding."
- **Framing (direct quote):** "technical debt with a twist: you didn't even make the suboptimal decisions yourself. They were made for you, and you approved them with a keystroke."
- **Distribution:** 6 reactions (low engagement). NOT a major-publication piece. Use only if you want to credit term-coining attribution.
- **Confidence:** HIGH (for what it says)
- **Use it as:** "exactly as written" for the term-coining attribution. The piece itself has no empirical backing.

---

## Stat 10: ThoughtWorks Tech Radar v34 — AI cognitive debt

- **Source URL:** https://www.thoughtworks.com/about-us/news/2026/combat-ai-cognitive-debt-radar-v34
- **Publication date:** April 15, 2026
- **Authors:** Organizational publication; Rachel Laycock (CTO) is the named spokesperson.
- **Definition:** **NONE provided.** ThoughtWorks references "accumulating cognitive debt" without formally defining it.
- **Statistics cited:** **NONE.**
- **Direct quote (Laycock):** "The inflection point we're at isn't so much about technology — it's about technique."
- **Confidence:** HIGH (for the fact that ThoughtWorks endorsed the cognitive-debt framing); LOW (for any specific claim — they don't make any).
- **Use it as:** Endorsement / signal of mainstream pickup. NOT for stats. Reframe to: "ThoughtWorks Technology Radar v34 (April 2026) explicitly named cognitive debt as a core risk of AI-accelerated development."

---

## Stat 11: Harness — "Majority of engineers spend more time debugging AI-generated code"

- **Source URL:** https://www.prnewswire.com/news-releases/harness-releases-its-state-of-software-delivery-report-developers-excited-by-promise-of-ai-to-combat-burnout-but-security-and-governance-gaps-persist-302345391.html
- **Title:** "State of Software Delivery Report: Beyond CodeGen – The Role of AI in the SDLC"
- **Publication date:** January 8, 2025
- **Sample size:** **500 engineering leaders and developers**.
- **Direct quote:** "67% of developers said they spend more time debugging AI-generated code."
- **Direct quote:** "92% of developers report that AI increases the 'blast radius' from bad code reaching production."
- **Methodology disclosure:** Press release does not specify dates, sampling method, or margin of error.
- **Confidence:** MEDIUM (the stat is verified in a press release; the underlying methodology is not transparent — caveat reader if using as a load-bearing claim).
- **Use it as:** Use 67% — NOT the loose "majority." The existing alexmayhew.dev post `ai-technical-debt-bomb.mdx` uses the imprecise "majority" framing. Tighten to: "Harness's 2025 State of Software Delivery survey (N=500) found 67% of developers spend more time debugging AI-generated code, and 92% report AI increases the 'blast radius' from bad code reaching production."

### Related but distinct: Harness 2026 "State of DevOps Modernization"

- **Source:** https://www.prnewswire.com/news-releases/harness-report-reveals-ai-coding-accelerates-development-devops-maturity-in-2026-isnt-keeping-pace-302710937.html
- **Publication date:** March 11, 2026
- **Survey:** Coleman Parkes, N=700 engineering practitioners + managers (300 US, 100 each UK/Germany/France/India), conducted Feb 2026.
- **Direct quote:** "47% of very frequent AI coding users report that manual work, such as QA, remediation, and validation, has become more problematic, versus 28% of occasional users."
- **Direct quote:** "69% of very frequent AI coding users say their teams experience deployment problems always, nearly always, or frequently when AI-generated code is involved."
- **Confidence:** HIGH (more transparent methodology than the Jan 2025 release).
- **Use it as:** Newer / more rigorous Harness data. Use these stats if available rather than the Jan 2025 ones.

---

## Stat 12: GitHub Copilot — "55% faster task completion"

- **Source URL:** https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/
- **Authors:** GitHub research team (Eirini Kalliamvakou principal investigator).
- **Publication date:** September 7, 2022 (updated May 21, 2024).
- **Sample size:** Survey ≥2,000 developers; controlled experiment N=95 professional developers.
- **Methodology:** Single-task RCT — write an HTTP server in JavaScript as quickly as possible. Random assignment to Copilot-on/off groups.
- **Direct quote (headline):** "developers using GitHub Copilot took on average 1 hour and 11 minutes to complete the task, while the developers who didn't use GitHub Copilot took on average 2 hours and 41 minutes."
- **Calculated speedup:** 55.8% faster.
- **Confidence interval (direct quote):** "The 95% confidence interval for the percentage speed gain is [21%, 89%]" — P=.0017.
- **Task completion rate:** 78% (Copilot) vs. 70% (control).
- **Confidence:** HIGH (for the specific task tested); MEDIUM-LOW for generalization (one task, JS-familiar devs, time-pressured "as quickly as possible" framing).
- **Use it as:** Always include the task scope. Phrasing: "GitHub's 2022 RCT (N=95) found Copilot users completed a JavaScript HTTP-server task 55.8% faster (CI: 21–89%)." Do NOT use as a generic "AI makes devs 55% faster" claim — that overgeneralizes a single-task study with a wide CI.

---

## Sources (canonical bibliography for the post)

### Primary research

1. METR. "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity." July 10, 2025. https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/ + arXiv:2507.09089
2. GitClear. William Harding. "AI Copilot Code Quality: Evaluating 2024's Increased Defect Rate." February 2025. https://www.gitclear.com/ai_assistant_code_quality_2025_research
3. Forrester. "Technology & Security Predictions 2025." October 22, 2024. https://www.forrester.com/press-newsroom/forrester-predictions-2025-tech-security/
4. CodeRabbit. David Loker. "State of AI vs Human Code Generation Report." December 17, 2025. https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report
5. Apiiro. Itay Nussbaum. "4x Velocity, 10x Vulnerabilities: AI Coding Assistants Are Shipping More Risks." September 4, 2025. https://apiiro.com/blog/4x-velocity-10x-vulnerabilities-ai-coding-assistants-are-shipping-more-risks/
6. Stack Overflow. "2025 Developer Survey — AI section." December 29, 2025. https://survey.stackoverflow.co/2025/ai/
7. Storey, Margaret-Anne. "From Technical Debt to Cognitive and Intent Debt: Rethinking Software Health in the Age of AI." University of Victoria. arXiv:2603.22106. v1 March 23, 2026; v4 April 6, 2026.
8. Osmani, Addy. "Comprehension Debt: The Hidden Cost of AI-Generated Code." Osmani's blog March 14, 2026; O'Reilly Radar April 13, 2026. https://www.oreilly.com/radar/comprehension-debt-the-hidden-cost-of-ai-generated-code/
9. Osmani, Addy. "The 70% Problem: Hard Truths About AI-Assisted Coding." Substack, December 2024. https://addyo.substack.com/p/the-70-problem-hard-truths-about
10. Noda, Abi & Storey, Margaret-Anne. "Cognitive Debt: The Hidden Risk in AI-Driven Software Development." getDX newsletter, April 22, 2026. https://newsletter.getdx.com/p/cognitive-debt-the-hidden-risk-in
11. Hernández Miró, Aleix. "Generative Debt: The Hidden Cost of Vibe Coding." LinkedIn Pulse, January 9, 2026. https://www.linkedin.com/pulse/generative-debt-hidden-cost-vibe-coding-aleix-hern%C3%A1ndez-mir%C3%B3-upe5e
12. ThoughtWorks. "Technology Radar Volume 34: Combating AI Cognitive Debt." April 15, 2026. https://www.thoughtworks.com/about-us/news/2026/combat-ai-cognitive-debt-radar-v34
13. Harness. "State of Software Delivery Report: Beyond CodeGen – The Role of AI in the SDLC." January 8, 2025. https://www.prnewswire.com/news-releases/harness-releases-its-state-of-software-delivery-report-developers-excited-by-promise-of-ai-to-combat-burnout-but-security-and-governance-gaps-persist-302345391.html
14. Harness / Coleman Parkes. "State of DevOps Modernization 2026." March 11, 2026. https://www.prnewswire.com/news-releases/harness-report-reveals-ai-coding-accelerates-development-devops-maturity-in-2026-isnt-keeping-pace-302710937.html
15. GitHub. "Research: Quantifying GitHub Copilot's Impact on Developer Productivity and Happiness." September 7, 2022. https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/

### Supporting context

16. Google DORA. "DORA 2024 Report" (cited via GitClear) — 7.2% delivery-stability decrease per 25% AI-adoption increase.
17. CISQ / Accenture. Tech debt costs U.S. organizations $2.41 trillion/year (2022 data).
18. CFO Dive. "AI rush is fueling tech debt 'tsunami': Forrester." https://www.cfodive.com/news/tech-debt-tsunami-building-amid-ai-craze-forrester/733984/

---

## Verification methodology notes

- Every primary-source URL was fetched directly via WebFetch, NimbleWay, or arXiv API (for the Storey paper).
- The GitClear 2025 PDF was downloaded, converted with `pdftotext`, and searched line-by-line for each claim.
- The Forrester $1.5T claim was searched across 4 separate queries with different keyword combinations to confirm it does not exist; the Gartner $1.5T (AI spending, not debt) was identified as the likely source of the conflation.
- The 322% figure was traced to its actual source (Apiiro, not CodeRabbit) by searching the exact phrase across vendor reports.
- The Stack Overflow 3.1% figure was confirmed on the official survey site (stackoverflow.co/2025/ai/) — the blog summary uses different framing (29% trust accuracy) but the AI section page provides the granular tier breakdown.

## Gaps / caveats

- Could not verify Apiiro's full methodology — their "tens of thousands of repos" claim is from a vendor blog post, not a peer-reviewed study. Use with appropriate hedging.
- Harness's January 2025 press release does not disclose survey methodology details. The March 2026 follow-up (Coleman Parkes, N=700) is more rigorous — prefer it.
- The 17% Anthropic comprehension study cited by Osmani was not retrieved at primary source for this audit. If load-bearing, track to the original Anthropic publication.
- The "70% problem" is sometimes confused with the "Comprehension Debt" essay — they are different essays from different years (Dec 2024 vs Mar/Apr 2026). Cite separately.
