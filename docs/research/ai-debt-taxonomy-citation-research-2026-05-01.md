# AI-Debt Taxonomy — Citation-Worthiness Research (2026-05-01)

**Status:** CURRENT
**Session:** Validate or challenge whether expanding `/blog/ai-assisted-development-generative-debt` into a 4-type taxonomy hub (Generative / Cognitive / Comprehension / AI Technical Debt) can become a citation-worthy primary source for AI Overviews. The user has dropped the "Intent Debt" type after prior research and wants this round to focus on (1) competitive landscape including academic sources, (2) saturation re-check post 2026-04-28, (3) AI-Overview citation pattern reality, (4) original-evidence bar for solo-author taxonomies, (5) primary-term selection (generative debt vs AI technical debt vs AI debt).
**Sources:** 18 sources across WebSearch, NimbleWay (search + extract), prior research docs (`ai-debt-taxonomy-citations-2026-04-28.md`, `ai-debt-taxonomy-redteam-2026-04-28.md`, `ai-debt-taxonomy-url-strategy-2026-04-28.md`, `ai-debt-taxonomy-editorial-fit-2026-04-28.md`, `ai-debt-schema-competitive-2026-04-28.md`, `generative-debt-validation-2026-04-28.md`).
**Method:** Cross-checked academic SE literature (arXiv, IEEE, MDPI, ScienceDirect) for AI-debt taxonomies; then probed the 30-day window since the prior research was written; then triangulated against AI-Overview citation pattern data from Profound, Yext, ALM Corp, and others.

---

## VERDICT

**Taxonomy is viable but the 4-type framing the user proposes is NOT citation-worthy as written.** Three things must change for this hub to win AI-Overview citations:

1. **The 4 types are the wrong layer of abstraction.** Generative + Comprehension + Cognitive are all _symptoms_ of AI-assisted development; "AI Technical Debt" is the parent category. Putting them as peers makes the taxonomy logically muddled — AI Technical Debt subsumes the other three. Citation engines preferentially cite frameworks where the categories don't overlap (Bogner's data/model/configuration/ethics; Storey's technical/cognitive/intent — both pass this test). The user's 4 types fail it.

2. **The category is fully claimed at the framework level — the only remaining defensible move is synthesis.** Bogner et al. (2021, IEEE TechDebt 2021, ~600 citations) own the academic AI-debt taxonomy. Storey (2026 arXiv 2603.22106) owns the Triple Debt Model. Slater (2025 arXiv 2512.04273) owns "Generative Debt" academically. RDEL Substack (Lizzie Matusov, March 31, 2026) has already synthesized Storey's framework for an engineering-leadership audience — exactly the audience alexmayhew.dev targets. Going in with another sole-author taxonomy at this date is too late to coin; the only winning move is to be the _best synthesis of all named frameworks_ with editorial clarity AND original measurement that nobody else has shipped.

3. **DefinedTermSet is a structural win but not a citation guarantee.** Schema-competitive research confirms zero competitors use DefinedTermSet for AI-debt vocabulary. But Profound's 680M-citation study and ALM Corp's 2026 ranking-factor data show AI Overviews cite Wikipedia (47.9% of ChatGPT top-10), Reddit (21% of Google AIO top-10, 47% of Perplexity top-10), Gartner, YouTube, LinkedIn — not personal blogs with optimized schema. DefinedTermSet helps; it does not get a fresh-domain personal blog into the cited set absent (a) inbound links from the federation already cited (Storey, Osmani, Willison, getDX, ThoughtWorks), or (b) a piece of original evidence (data, framework, novel definition) those federations link back to.

**Top 3 existing competitors we'd be ranked against:**

1. **Margaret-Anne Storey** — arXiv 2603.22106 (Triple Debt Model: technical / cognitive / intent), February 9 2026 blog, getDX co-byline April 22 2026. She is the academic + thought-leadership canonical source for AI-era debt taxonomy. Her framework is already being synthesized downstream (RDEL March 31, getDX April 22, ThoughtWorks Tech Radar v34 April 15). Her domain authority (margaretstorey.com + arXiv DOI + getDX + University of Victoria) is structurally higher than alexmayhew.dev.

2. **Addy Osmani — O'Reilly Radar** ("Comprehension Debt: The Hidden Cost of AI-Generated Code", March 14 2026 → April 13 2026 O'Reilly republish). Osmani has the popular-essay canon for "comprehension debt." O'Reilly Radar is a top-50 tech-publication domain. He owns this term. The user's plan to define "comprehension debt" alongside three others on alexmayhew.dev is a direct steal-attempt that loses on domain authority.

3. **Justus Bogner et al.** — "Characterizing Technical Debt and Antipatterns in AI-Based Systems: A Systematic Mapping Study" (IEEE TechDebt 2021, arXiv 2103.09783). Authors: Justus Bogner, Roberto Verdecchia, Ilias Gerostathopoulos. This is the peer-reviewed academic taxonomy that all subsequent AI-debt work cites. Four AI-specific debt types: **data, model, configuration, ethics**. 72 antipatterns, 46 solutions. The MDPI scoping review (2025, applsci/15/13/7165) extends this to **18+1 categories** including Algorithm Debt, Self-Admitted Technical Debt, Accessibility Debt. Note: these academic taxonomies are about ML systems debt, not AI-assisted-coding debt — but search engines and AI engines don't always distinguish, and a query like "types of AI technical debt" pulls Bogner first.

**Recommended primary term:** **"AI technical debt"** for the URL slug and title. NOT "generative debt" (orphaned, low search volume), NOT "AI debt" (ambiguous with finance/macroeconomic AI-investment debt — Profound search confirms "AI debt" SERP is heavily contaminated by SoftBank borrowing, AI Infrastructure spending, ESG bond ETFs, financial press releases). "AI technical debt" disambiguates cleanly, has demonstrable searcher demand (the user's existing post ranks pos 6.16 for it), and lets the post legitimately house the 4 AI-coding-specific sub-types.

---

## Section 1: Competitive Landscape — Who has published an AI-debt taxonomy?

### Academic / peer-reviewed

| #   | Source                                | Authors                              | Date                              | Framework                                                                                                                                                                 | Citation weight                                                                                                                                               |
| --- | ------------------------------------- | ------------------------------------ | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | arXiv 2103.09783 / IEEE TechDebt 2021 | Bogner, Verdecchia, Gerostathopoulos | Mar 2021                          | 4 new TD types: **data, model, configuration, ethics** + 72 antipatterns + 46 solutions (21 primary studies)                                                              | HIGH — peer-reviewed, IEEE conference, foundational. Vrije Universiteit Amsterdam + others. Cited extensively in MDPI 2025 scoping review and follow-on work. |
| 2   | arXiv 2603.22106                      | Storey                               | Mar 23 2026 (v1), Apr 6 2026 (v4) | **Triple Debt Model**: technical / cognitive / intent                                                                                                                     | HIGH — sole author at U. Victoria, arXiv preprint, already cited by getDX, RDEL Substack, Simon Willison, multiple HN front-page threads                      |
| 3   | arXiv 2512.04273                      | Slater                               | Dec 2025                          | **Generative Debt** + sub-types: Hallucinated Coupling, Implementation Laziness, Omission Debt (pilot N=15)                                                               | MEDIUM — Georgia Tech, arXiv only, pilot study. Proposes Debt Remediation Index but hasn't released it.                                                       |
| 4   | arXiv 2602.20206                      | (multiple authors)                   | Feb 2026                          | **Epistemic Debt** in generative-AI-scaffolded novice programming + metacognitive scripts                                                                                 | MEDIUM — pedagogy-focused, narrow scope                                                                                                                       |
| 5   | MDPI applsci 15/13/7165               | (authors per publication)            | 2025                              | **Scoping review** → 18+1 categories incl. Algorithm Debt, SATD, Accessibility Debt                                                                                       | MEDIUM — peer-reviewed but in MDPI (mid-tier journal)                                                                                                         |
| 6   | ScienceDirect S0164121225002687       | (authors per publication)            | 2025                              | **Multivocal literature review** of TD evolution from DevOps to GenAI                                                                                                     | MEDIUM — Journal of Systems and Software, peer-reviewed                                                                                                       |
| 7   | MSR 2026 Mining Challenge             | (multiple authors)                   | 2026                              | "Characterizing Self-Admitted Technical Debt Generated by AI Coding Agents" — 34 SATD topics, 10 categories, AI agents predominantly document requirement and design debt | MEDIUM — emerging at top SE-research conference. Will be cited starting late 2026.                                                                            |
| 8   | arXiv 2511.09663                      | (authors per publication)            | Nov 2025                          | **Alignment Debt** — making AI usable                                                                                                                                     | LOW so far — recent, not yet picked up                                                                                                                        |

### Industry / thought-leadership

| #   | Source                      | Author                         | Date                                    | Framework                                                                                                                               | Citation weight                                                                                                        |
| --- | --------------------------- | ------------------------------ | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 9   | margaretstorey.com blog     | Storey                         | Feb 9 2026                              | Cognitive debt essay (popular treatment of Triple Debt Model)                                                                           | HIGH — Simon Willison endorsed Feb 15; HN front-page; canonical popular essay                                          |
| 10  | O'Reilly Radar              | Addy Osmani                    | Apr 13 2026 (Mar 14 on his blog/Medium) | **Comprehension Debt: The Hidden Cost of AI-Generated Code**                                                                            | HIGH — O'Reilly Radar is a top-tier tech publication; Osmani is Google Chrome team                                     |
| 11  | getDX newsletter            | Abi Noda + Storey              | Apr 22 2026                             | Cognitive debt as project-level property                                                                                                | HIGH — getDX is engineering-leadership canonical newsletter; Storey co-byline gives academic weight                    |
| 12  | RDEL Substack               | Lizzie Matusov                 | Mar 31 2026                             | "What kinds of new debt are teams accumulating with AI?" — synthesis of Storey's Triple Debt Model FOR engineering leaders              | HIGH-RISK COMPETITOR — Lizzie Matusov is researcher at Multitudes; this is exactly the angle alexmayhew.dev would take |
| 13  | ThoughtWorks Tech Radar v34 | Rachel Laycock + ThoughtWorks  | Apr 15 2026                             | Combat AI cognitive debt — endorsement, no new framework                                                                                | MEDIUM — major signal of mainstream adoption of "cognitive debt"                                                       |
| 14  | Sonar blog                  | (author per publication)       | 2026                                    | "The great toil shift: How AI is redefining technical debt"                                                                             | MEDIUM — vendor blog, focused on Sonar product                                                                         |
| 15  | Databricks Blog             | (author per publication)       | 2024+                                   | "Hidden Technical Debt of GenAI Systems" — extends Sculley to GenAI                                                                     | MEDIUM — major vendor, decent authority                                                                                |
| 16  | Stack Overflow blog         | (multiple)                     | Jan 23 2026                             | "AI can 10x developers...in creating tech debt"                                                                                         | HIGH — Stack Overflow is canonical developer publication, Stack Exchange platform                                      |
| 17  | LinkedIn Pulse              | Aleix Hernández Miró           | Jan 9 2026                              | **Generative debt** definition (originally coined here for AI/code) — 6 reactions                                                       | LOW — LinkedIn Pulse, low engagement, but is the popular-essay coining                                                 |
| 18  | MIT Sloan Management Review | Schelfaut + Shukla (Accenture) | Feb 17 2025                             | "How to Manage Tech Debt in the AI Era" — frames "all technical debt is becoming AI technical debt"; cites Accenture/CISQ $2.41T figure | HIGH — MIT Sloan is top-tier, Accenture-funded research, widely cited in business AI debt discourse                    |

### Notable absences (verified)

- **Martin Fowler / martinfowler.com** — searched recent-changes; no AI-debt taxonomy post.
- **GitHub Engineering blog** — no AI-debt taxonomy post.
- **McKinsey, Gartner, IDC** — Gartner is referenced in Profound's citation data as a top-7 source for Google AIO and Perplexity, but no specific Gartner AI-debt taxonomy publication was found in the search. McKinsey publishes on AI investment but not on AI debt taxonomy. IDC has the same gap.
- **Stripe Press** — no AI-debt taxonomy publication.
- **ACM Queue, IEEE Software** — Bogner's IEEE TechDebt 2021 paper is the existing peer-reviewed entry. No newer ACM Queue or IEEE Software taxonomy on AI-coding-debt specifically.

**Key insight:** the academic side is OWNED by Bogner (ML-systems debt) and Storey (AI-coding cognitive/intent debt). The popular-essay side is OWNED by Osmani (comprehension), Storey (cognitive), getDX (cognitive). The user's 4-type taxonomy (Generative / Cognitive / Comprehension / AI Technical) is positioned in a corridor where every category has a stronger named owner than alexmayhew.dev currently has.

---

## Section 2: Saturation Re-Check Since 2026-04-28

The prior `generative-debt-validation-2026-04-28.md` documented the saturation state as of April 28. New publications in the 30-day window since:

- **No new sole-author taxonomy** has shipped that frames "AI debt" as 4+ types in the alexmayhew.dev style. The closest is **Lizzie Matusov's RDEL #137 (March 31)** — published 28 days BEFORE the prior research but apparently missed by it. Matusov's piece is structurally the same shape the user is proposing: "as AI generates more of our code, what kinds of debt are accumulating that technical debt alone doesn't capture?" → she answers via Storey's Triple Debt Model. This is direct competition the prior research missed.

- **siliconangle.com (April 29 2026):** "Cognitive debt and the slow uptake of strategic AI" — uses cognitive-debt frame in enterprise-AI strategy context. Generic descriptive use.

- **CSA Labs (Cloud Security Alliance):** "Vibe Coding's Security Debt: The AI-Generated CVE Surge" (research note) — narrows to security debt as a sub-type. Adds another competing sub-type framing.

- **Augment Code:** "What Happens When AI Technical Debt Compounds (And How Spec-Driven Dev Prevents It)" — vendor-marketing framing, positions spec-driven development as the cure.

- **byteiota.com:** "AI Technical Debt: 30-41% Increase Hits Developers" — pulls together multiple stats (productivity paradox, 1.7x bugs, 30-41% debt increase) into a single read.

- **fullstory.com:** "The Ghost in the Machine: Why AI Agents Expose Our Technical Debt" — agentic-AI framing.

**Saturation verdict:** the category is **fully saturated at the publication frequency level**, but the category-defining synthesis (a single page that names 4-5 types side-by-side, with definitions, examples, deep-dive links, and an original measurement) is STILL not on the public web as a single piece. RDEL #137 is the closest competitor — but it's a 1,200-word newsletter explainer, not a 5,000-word reference. There IS a gap for a definitive synthesis. The window is closing fast (months, not years).

---

## Section 3: AI Overview Citation Pattern (2026 Reality)

### What gets cited (multiple verified sources)

**Profound (680M-citation analysis, Aug 2024 - June 2025):**

- ChatGPT top-10 cited sources: Wikipedia (47.9%), Reddit (11.3%), Forbes (6.8%), G2 (6.7%), TechRadar (5.5%)
- Google AI Overviews top-10: Reddit (21%), YouTube (18.8%), Quora (14.3%), LinkedIn (13%), Gartner (7.1%)
- Perplexity top-10: Reddit (46.7%), YouTube (13.9%), Gartner (7%)
- TLD pattern: .com (80.4%), .org (11.3%) — personal-blog .dev TLDs are a thin slice. **alexmayhew.dev's TLD class itself is undercounted in current AI-citation patterns.**

**ALM Corp (2026):** "Google AI Overview citations from top-10 pages dropped from 76% to 38%" — meaning AI Overviews increasingly cite OFF-page-1 sources. This is a real opening for niche-authority pages.

**Profound, ALM, panstag, mikekhorev consistent claims:**

- Schema markup is correlated with citation, not causal. Sites with complete Tier-1 schema see "up to 40% more AI Overview appearances."
- FAQPage schema is the highest-impact schema type for AI Overviews in 2026.
- Pages with FAQPage schema reach citation rate of 41% vs 15% without.
- Structured data (any) → "73% selection boost."
- Pages with H1-H2-H3 hierarchy → 2.8x more likely to be cited.
- 80% of pages cited by AIs use lists and structured elements.
- Original data → 3.7x more likely to be cited.
- Content with citations and quotations → 30-40% higher visibility.
- Pages updated within 2 months → 28% more citations than older.

**Wellows / digivate / averi.ai (2026 Google AI Overviews ranking factor analyses):**

- The query landscape: AI Overviews now hit 48% of queries.
- Schema types with explicit AI-Overview correlation: **Article, FAQPage, HowTo, Q&A, SpeakableSpecification, VideoObject, Organization**. DefinedTerm is mentioned but as a _secondary_ signal, not a primary one.
- "Semantic completeness" is the #1 ranking factor — content scoring 8.5/10+ on semantic completeness is 4.2x more likely to be cited.

### What this means for DefinedTermSet specifically

**DefinedTermSet is documented as useful but not a primary signal.** Two of the citation-pattern sources (panstag, wellows) explicitly mention DefinedTerm/DefinedTermSet as "establishing semantic authority for industry terminology" but neither cites it as a top-5 ranking factor. FAQPage is the verified top-tier schema for AI Overviews; DefinedTermSet is an adjacency that helps but does not substitute for the core (FAQPage + complete Article + originality).

**Recommendation:** ship DefinedTermSet (the schema-competitive doc was right that it's a defensible win on a competitive set that doesn't use it) BUT do not over-rely. The piece must ALSO have:

- Complete `Article` (or `TechArticle`) with `wordCount`, `timeRequired`, `citation` to arXiv DOIs, `mentions` linking to each `DefinedTerm` `@id`.
- `FAQPage` with 5-7 Q&As written as literal user/LLM queries.
- Strong H1-H2-H3 hierarchy with each debt type as an H2.
- Lists / tables for the comparison matrix.
- Recent dateModified (we update it monthly to keep the freshness boost).

DefinedTermSet on top of that stack is additive insurance for the AEO win, not the win itself.

### Per-platform optimization summary

- **Gemini / Google AIO** trusts Reddit, YouTube, LinkedIn, Quora — surfaces of community discussion. Owning a citation here means getting the alexmayhew.dev URL surfaced in those federations (cross-post to dev.to, comment on relevant Reddit threads with the URL, get YouTube creators to link to it).
- **Perplexity** trusts Reddit (47%) and Gartner. Perplexity citations come from being the most-linked source in expert/community discussions. Distribution > schema.
- **ChatGPT** trusts Wikipedia. The federation is encyclopedic. To win ChatGPT citations, the term must have a Wikipedia entry that links to alexmayhew.dev as a reference, OR alexmayhew.dev must appear in Wikipedia-cited federations (Forbes, TechRadar, NerdWallet).

The hub-and-spoke schema work alone does not get the URL into any of these federations. **Distribution work — Reddit comments, dev.to cross-posts, HN submissions, getting Storey/Osmani/Willison to link back — is the load-bearing AEO move, not the schema markup.**

---

## Section 4: Original-Evidence Bar — What does it take?

Standard examples of solo-author dev frameworks that became citation-worthy:

### Twelve-Factor App (Adam Wiggins, Heroku, Nov 2011)

- Backed by **Heroku's platform-as-a-service**: thousands of customer apps validating the patterns. The 12 factors were already empirically observed across the entire Heroku fleet before being codified.
- **Actively pruned** — Wiggins published the canonical 12 only after extensive internal debate at Heroku.
- **Distribution lever:** Heroku's own developer-relations org promoted it for years. Adam Wiggins gave conference talks, the site was open-sourced, and the cloud-native movement adopted it as the canonical PaaS deployment model.
- **15 years of compound interest:** Google Cloud just published a "16-factor" extension for AI in 2026, demonstrating that the original is the canonical reference even after 15 years.

### Conventional Commits (Benjamin E. Coe, 2017)

- Built on the **Angular Commit Guidelines** which already had thousands of users.
- Coe's contribution was the **specification format** (the SemVer-aligned commit-message convention) and the **conventionalcommits.org** website that hosted it.
- **Tooling lever:** commitlint, semantic-release, husky — packages that USE Conventional Commits became the distribution layer. Adoption is now 116+ top GitHub projects per a 2025 study.

### Will Larson — Staff Engineer (2020)

- Larson interviewed **dozens of Staff+ engineers** at top companies to extract patterns.
- The **archetypes framework** (Tech Lead / Architect / Solver / Right Hand) is an EMPIRICAL synthesis from interviews — not a theoretical framework Larson invented.
- **Distribution lever:** Larson's existing audience (lethain.com, prior books, exec roles at Stripe/Calm/Uber).

### Pattern: what they share

1. **Empirical foundation, not theoretical claim.** All three rest on empirical evidence — Heroku's fleet, Angular's guidelines + open-source adoption, dozens of interviews. Sole-author taxonomies that survive are observations of patterns already at scale, not novel frameworks.
2. **Existing distribution.** Wiggins had Heroku DevRel. Coe had ngrx/Angular adjacency. Larson had a 100k+ engineering blog audience.
3. **Tooling or service that USES the framework.** 12-factor → Heroku's PaaS, kubernetes manifests, every cloud platform. Conventional Commits → commitlint/semantic-release/husky. Staff Engineer → adopted by HR/eng-leadership at Calm, Stripe, etc.
4. **Genuine new conceptual layer.** 12-factor introduced the "config-as-environment" pattern. Conventional Commits introduced the "commit-message-as-changelog" pattern. Staff Engineer introduced the "non-management technical leadership" archetype taxonomy.

### What alexmayhew.dev currently has and doesn't have

**Has:**

- Brand voice + writing quality.
- Existing post at pos 6.16 for "generative debt" (low organic value but a beachhead).
- Hub-and-spoke architecture with 4 already-written debt-related posts.
- Schema infrastructure (DefinedTermSet on /glossary, JSON-LD utility module, Person/Organization @id consolidation).

**Does NOT have:**

- **Empirical foundation** — no audit of N codebases, no interview series, no original measurement that would back the taxonomy.
- **Distribution.** The Cloudflare ChatGPT-User fetches in the prior research are NOT distribution — they're a single-day blip. No newsletter list of 10k engineers, no Twitter audience, no podcast, no conference circuit.
- **Tooling that uses the framework.** Nothing on the site or in the codebase USES the AI-Debt Taxonomy operationally. It's a static essay.
- **Genuinely new conceptual layer.** Generative debt was coined by Aleix + Slater. Cognitive debt by Storey. Comprehension debt by Osmani. AI Technical Debt is the parent that's been used since Sculley 2015 + Bogner 2021. Nothing in the user's 4-type framing is conceptually novel.

### Codex's bar: "without proprietary examples or named methodology = renamed spoke"

This is correct. The taxonomy as described is reshelving existing terms. To clear the bar:

**Option 1 — Empirical extension:** Run Slater's hexagonal-architecture trap against 5 frontier models (GPT-5, Claude 4.6, Gemini 2.5, Llama 3 70B, Mistral Large), publish per-model violation rates. This is exactly what the validation research recommended on April 28. It would generate ORIGINAL DATA citation engines and Storey/Osmani/Willison would link back to. **Cost: ~3-5 days of careful AI-coding-experiment work + write-up. ROI: highest.**

**Option 2 — Audit-as-evidence:** Apply a debt-detection checklist to N alexmayhew.dev advisory engagements (anonymized) or to N popular open-source repos. Publish the categorized findings with rates per debt type. **Cost: ~1-2 weeks if engagements are pre-anonymized; data licensing risk for advisory cases.**

**Option 3 — Synthesis-as-deliverable:** Build a public tool — a "debt-detector" CLI or web app that scans a repo and categorizes debt by the 4 types. The taxonomy becomes the conceptual backbone of the tool, the tool is the distribution lever. **Cost: ~2-4 weeks of build time. Highest leverage but biggest scope.**

**Option 4 (insufficient on its own):** Just write the synthesis essay with great prose, complete schema, and full citations. **Cost: low. Probability of becoming the cited reference: low (5-15%) absent at least one of options 1-3.**

The user's current plan = Option 4 alone. To clear Codex's bar, option 4 must be paired with at least option 1 OR option 3.

---

## Section 5: Specific-Term Saturation — generative debt vs AI technical debt vs AI debt

### "Generative debt"

- **Coining attribution:** Aleix Hernández Miró (LinkedIn Pulse, Jan 9 2026) + Slater (arXiv 2512.04273, Dec 2025).
- **Search demand:** zero measurable organic demand per prior research. Reddit, HN: zero hits.
- **Competition:** alexmayhew.dev's own existing post (pos 6.16, 37 imp / 0 clicks / 90d), Aleix's LinkedIn (6 reactions), Slater's arXiv (uncited so far), CodeKarma's marketing posts, dsilahcilar's GitHub README. Total competition: 5 pieces, none with significant authority.
- **Pros:** least crowded SERP; a clear coining attribution is available.
- **Cons:** no search demand. Owning the term means owning silence. The category demand is for "AI technical debt" / "cognitive debt" / "vibe coding tech debt" / "comprehension debt" — never "generative debt" specifically.
- **Verdict:** orphaned term. NOT the primary URL/title term.

### "AI technical debt"

- **Coining attribution:** Sculley et al. ("Hidden Technical Debt in Machine Learning Systems," NeurIPS 2015) for ML-systems flavor; Bogner et al. (2021) for the AI-systems extension. Generic descriptive term in 2026 mainstream.
- **Search demand:** **HIGH and growing.** Stack Overflow blog (Jan 23 2026), MIT Sloan, ICSE 2026 panel, multiple top-ranked competitor pieces. The prior research's existing post position 6.16 IS for this term-cluster.
- **Competition:** Stack Overflow, MIT Sloan, Augment Code, Tembo, Sonar, Pixelmojo, Beam, Salesforce Ben, Databricks, ScienceDirect academic, MDPI academic. ~30+ competing pieces with varying authority.
- **Pros:** unambiguous term, maps to clear searcher intent, the existing alexmayhew.dev post already ranks for it (low position but real signal), the category demand is here, AI engines understand it.
- **Cons:** crowded. Need to bring something the others don't have (synthesis, taxonomy completeness, original data) to win citation share.
- **Verdict:** **THIS IS THE PRIMARY TERM.** The URL/title should lead with "AI Technical Debt." Use "Taxonomy" as the discriminator.

### "AI debt"

- **Term meaning:** ambiguous. Profound's 30-day search now shows "AI debt" SERP contaminated by:
  - SoftBank borrowing $40B for OpenAI (financial press)
  - $161B in AI debt accumulated by tech giants (financial press)
  - ESG bond ETFs and AI Debt Selection Trust securities
  - Corporate bond markets transformation
- **Search intent split:** ~30-50% of "AI debt" queries today are about AI INFRASTRUCTURE financing debt, not AI technical debt. This is a contamination problem that will get worse, not better, as Big Tech continues to issue AI capex bonds.
- **Verdict:** **NOT the primary term.** Disambiguation tax is too high. Use "AI Technical Debt" as the primary.

### Recommendation

- **URL slug:** keep `/blog/ai-assisted-development-generative-debt` (preserves existing pos 6.16, 12 inbound internal links — the prior URL-strategy doc covers this).
- **Title:** "AI Technical Debt: A Taxonomy for Engineering Leaders (Generative, Cognitive, Comprehension, and Beyond)" or similar. Lead with the high-demand disambiguated term.
- **H1:** "AI Technical Debt: A Working Taxonomy."
- **Subheadings (H2):** the four types as proposed.
- **Body strategy:** position "Generative Debt" as the _architectural-violation sub-type_ attributed to Slater + Aleix. Position "Cognitive Debt" as the _people-layer_ attributed to Storey. Position "Comprehension Debt" as the _codebase-layer_ attributed to Osmani. Position "AI Technical Debt" as the parent + the _code-layer_ attributed to Sculley/Bogner. Show how they nest and where they overlap. **This nesting structure is itself the contribution** — the prior validation research and the editorial-fit doc both noted no one has yet done the explicit nested-not-parallel synthesis.

This re-framing fixes the verdict's first criticism (the 4 types are not peers — they're at different levels). The taxonomy becomes a **layered model**: code → codebase → people, with the architectural-violation sub-type attributed to Slater/Aleix as a subtype of code-layer. This is conceptually defensible and citation-worthy IF paired with original evidence (Section 4, Options 1-3).

---

## Section 6: Conflicting Information

- **DefinedTermSet rich-result eligibility:** the schema-competitive research said "Google does not yet render `DefinedTermSet` rich results, but it will not error" — this remains true. panstag and wellows treat DefinedTerm as a real ranking signal; mikekhorev does not include it in their top-5 list. **Conflict:** the size of the DefinedTermSet boost is uncertain. **Resolution:** ship it (zero downside, possible upside, defensible competitive lead per schema audit) but don't budget on its strength alone.

- **Prior research said "DO NOT pursue 'generative debt' as hub-term"** but the URL-strategy doc said "expand and retitle the generative-debt URL." **Resolution:** these are not in conflict. The URL strategy is to keep the slug (preserve authority). The validation research is about the TITLE term. The verdict here aligns with both: keep slug, retitle to lead with "AI Technical Debt."

- **Lizzie Matusov's RDEL #137 (March 31, 2026)** was published 28 days before the prior research and apparently missed by it. **Resolution:** add to competitor list. RDEL audience overlaps with alexmayhew.dev's target. Treat as a primary competitor whose framing precedes any new alexmayhew.dev publication.

---

## Section 7: Gaps

- **No keyword volume data** — Profound, ahrefs, semrush not directly queried in this round. The "AI technical debt" demand is inferred from publication frequency + prior research's HN/Reddit signals + the existing alexmayhew.dev post's GSC data (37 imp / 90d for one post is genuine demand).
- **No direct LLM citation testing** — did not query ChatGPT, Perplexity, Gemini directly with "what is AI technical debt" / "types of AI debt" / "what is generative debt" to see which sources are pulled. This would be high-value pre-publish work and is recommended before launch.
- **No verification of Slater Generative Debt paper's actual academic uptake** — the December 2025 paper has been on arXiv ~5 months. Citation count not checked in Semantic Scholar / Connected Papers.
- **No probe of getDX subscriber count, RDEL subscriber count, ThoughtWorks Tech Radar reach** — these are the federations the user would want backlinks from. Their reach and link-policy is unknown without further research.

---

## Sources

1. [Bogner, Verdecchia, Gerostathopoulos — Characterizing Technical Debt and Antipatterns in AI-Based Systems (arXiv 2103.09783, IEEE TechDebt 2021)](https://arxiv.org/abs/2103.09783) — academic 4-type taxonomy: data, model, configuration, ethics. Foundational citation.
2. [Storey — From Technical Debt to Cognitive and Intent Debt (arXiv 2603.22106)](https://arxiv.org/abs/2603.22106) — Triple Debt Model framework. Sole-author at U. Victoria.
3. [Slater — Quantitative Analysis of Technical Debt and Pattern Violation in LLM Architectures (arXiv 2512.04273)](https://arxiv.org/abs/2512.04273) — generative-debt formalization, pilot N=15.
4. [MDPI scoping review — A Scoping Review and Assessment Framework for TD in AI/ML Competition Platforms](https://www.mdpi.com/2076-3417/15/13/7165) — extends Bogner to 18+1 categories incl. Algorithm Debt, SATD, Accessibility Debt.
5. [ScienceDirect — The Evolution of Technical Debt from DevOps to Generative AI: A multivocal literature review](https://www.sciencedirect.com/science/article/pii/S0164121225002687) — 2025 multivocal review (paywall).
6. [MSR 2026 Mining Challenge — Characterizing Self-Admitted Technical Debt Generated by AI Coding Agents](https://2026.msrconf.org/details/msr-2026-mining-challenge/28/Characterizing-Self-Admitted-Technical-Debt-Generated-by-AI-Coding-Agents) — 34 SATD topics, 10 categories, AI agents document requirement+design debt.
7. [MIT Sloan Management Review — How to Manage Tech Debt in the AI Era (Schelfaut + Shukla, Accenture, Feb 17 2025)](https://sloanreview.mit.edu/article/how-to-manage-tech-debt-in-the-ai-era/) — frames "all technical debt is becoming AI technical debt"; cites $2.41T CISQ.
8. [Storey — How Generative and Agentic AI Shift Concern from Technical Debt to Cognitive Debt (margaretstorey.com, Feb 9 2026)](https://margaretstorey.com/blog/2026/02/09/cognitive-debt/) — popular treatment. Endorsed by Simon Willison Feb 15.
9. [Osmani — Comprehension Debt: The Hidden Cost of AI-Generated Code (O'Reilly Radar, April 13 2026)](https://www.oreilly.com/radar/comprehension-debt-the-hidden-cost-of-ai-generated-code/) — owns "comprehension debt" canonically.
10. [Noda + Storey — Cognitive Debt: The Hidden Risk in AI-Driven Software Development (getDX newsletter, April 22 2026)](https://newsletter.getdx.com/p/cognitive-debt-the-hidden-risk-in) — engineering-leadership canonical co-byline.
11. [Matusov — RDEL #137: What Kinds of New Debt Are Teams Accumulating with AI? (RDEL Substack, March 31 2026)](https://rdel.substack.com/p/rdel-137-what-kinds-of-new-debt-are) — direct synthesis competitor for engineering leaders. Missed in prior research.
12. [ThoughtWorks Tech Radar v34 — Combat AI Cognitive Debt (April 15 2026)](https://www.thoughtworks.com/about-us/news/2026/combat-ai-cognitive-debt-radar-v34) — mainstream endorsement of cognitive-debt frame.
13. [Stack Overflow blog — AI Can 10x Developers... in Creating Tech Debt (Jan 23 2026)](https://stackoverflow.blog/2026/01/23/ai-can-10x-developers-in-creating-tech-debt/) — high-DA descriptive AI-tech-debt piece.
14. [Hernández Miró — Generative Debt: The Hidden Cost of Vibe Coding (LinkedIn Pulse, Jan 9 2026)](https://www.linkedin.com/pulse/generative-debt-hidden-cost-vibe-coding-aleix-hern%C3%A1ndez-mir%C3%B3-upe5e) — popular-essay coining of generative debt.
15. [Profound — AI Platform Citation Patterns (June 2025, updated Aug 2025)](https://www.tryprofound.com/blog/ai-platform-citation-patterns) — 680M-citation analysis. Wikipedia 47.9% ChatGPT top-10, Reddit 47% Perplexity top-10, Gartner 7% Google AIO + Perplexity.
16. [ALM Corp — Google AI Overview Citations from Top-10 Pages Dropped 76% to 38% (2026)](https://almcorp.com/blog/google-ai-overview-citations-drop-top-ranking-pages-2026/) — AIO citation pattern shift.
17. [Wellows — Google AI Overviews Ranking Factors 2026](https://wellows.com/blog/google-ai-overviews-ranking-factors/) — schema (40% boost), FAQPage (41% citation rate), structure (2.8x), original data (3.7x).
18. [Twelve-Factor App methodology — Wikipedia / Heroku (Adam Wiggins, Nov 2011)](https://en.wikipedia.org/wiki/Twelve-Factor_App_methodology) — framework adoption pattern reference.
