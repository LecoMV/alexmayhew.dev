# AI-Debt Taxonomy URL Strategy (2026-04-28)

**Status:** CURRENT
**Decision context:** Choosing between four URL strategies (A/B/C/D) for an AI-Debt Taxonomy synthesis piece covering Generative, Cognitive, Comprehension, Intent, and Technical debt.
**Sources:** GSC API live pull (90d/28d windows, 2026-01-26 → 2026-04-26), MDX file inspection of 4 candidate posts, internal-link grep across `content/blog/`, prior research `generative-debt-validation-2026-04-28.md` and `generative-debt-site-fit-2026-04-28.md`.

---

## RECOMMENDATION: **C** — Expand and retitle `/blog/ai-assisted-development-generative-debt`

### The 3 strongest data points

1. **It is the only one of the four URLs with any GSC presence.** Live pull confirms the site-fit doc: 37 impressions / 0 clicks / pos 6.16 over 90d, declining to 0.11/d in the last 28d. The other three URLs — including the supposed "authority hub" `/blog/ai-assisted-development-guide` — return **0 impressions, 0 clicks, position 0** in GSC. There is no hub authority to preserve (kills option B's premise). There is exactly one URL in this cluster Google has indexed deeply enough to surface, and it already carries the term "generative-debt" in its slug.

2. **The taxonomy is ~75% already written across the existing posts; the synthesis is the missing piece, not the content.** Term-frequency map across the 4 MDX files: `generative debt` → 4 in hub, 3 in genDebt, 1 in cognitive, 1 in techDebt. `cognitive debt` → 48 in cognitive, 2 in techDebt, 0 elsewhere. `comprehension` → 10 in cognitive, 9 in techDebt, 1 in genDebt. `structural debt`, `hallucinated complexity`, `omission debt`, `security debt` → all already defined in `ai-assisted-development-generative-debt.mdx` (already 4 of the 5 user-listed types in there as labeled subsections). `intent debt` → **0 mentions anywhere**. The work to ship a 5-type taxonomy is: write Intent debt + Comprehension debt sections, retitle, restructure existing Generative Debt Taxonomy section to host all 5, and consolidate cross-references. That is option C verbatim. Option A duplicates 75% of work on a fresh URL; option D throws away the depth that's already on disk.

3. **Inbound internal-link math: option C inherits 12 inbound links instantly; options A/D start at 0.** Grep of `content/blog/*.mdx` for href patterns confirms: ai-assisted-development-generative-debt = 12 inbound posts, cognitive-debt-ai-teams = 5, ai-technical-debt-bomb = 1, hub = 23. Adding a new URL (A or D) requires touching the same 12 posts to redirect link equity to the new slug, plus 5 more if we want cognitive's inbounds rewired. That is editorial churn with a non-zero risk of breaking links. Option C inherits the 12 inbounds with zero edits and lets us _add_ taxonomy callouts to cognitive-debt + technical-debt + hub without retiring anything.

---

## Per-option scoring

| Criterion              | A: New `/ai-debt-taxonomy`                                                                                   | B: Expand hub                                                                                                                                          | **C: Expand+retitle genDebt**                                                                                                                                                                                                                                                                                                                                                                                           | D: Lean `/ai-debt-types-compared`                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Authority preserved    | **1/5** — fresh URL, zero GSC history                                                                        | **2/5** — hub has 0 imp/90d; the "23 inbound links" is internal only, no demonstrable Google authority                                                 | **5/5** — only URL with 90d GSC presence (37 imp, pos 6.16) and the only one declining slowly enough to be salvageable                                                                                                                                                                                                                                                                                                  | **1/5** — fresh URL, zero history, fresh slug                                                                                         |
| Writing effort         | **2/5** — new 4,500-6,000 word piece + canonical hub edits                                                   | **3/5** — restructure existing 3,781-word hub to lead with taxonomy (rewrites the framing)                                                             | **4/5** — existing 2,254 words covers 4 of 5 types; needs ~1,500-2,000 new words for Intent + Comprehension sections + restructuring                                                                                                                                                                                                                                                                                    | **5/5** — 1,500-2,000 word synthesis matrix is the cheapest writing job                                                               |
| Schema cleanliness     | **2/5** — fresh Article + DefinedTermSet on a URL with no inbound entity graph                               | **3/5** — hub has Article + ItemList; DefinedTermSet adds cleanly but it's a structural change to a navigational hub, not a definitional page          | **5/5** — existing Article schema is already in place; DefinedTermSet bolts on; the page is already definitional in shape                                                                                                                                                                                                                                                                                               | **2/5** — DefinedTermSet on a thin (1,500-word) page is weak signal; rich-result eligibility requires depth                           |
| Cluster coherence      | **2/5** — adds a 5th sibling competing with 4 existing posts; risk of cannibalization on overlapping queries | **3/5** — coherent with hub-and-spoke pattern, but the hub becomes a definitional document, undermining its current "framework + deep-dives" structure | **4/5** — the post is already the canonical "AI debt taxonomy" entry by content shape; retitle aligns title with reality. Cognitive + technical-debt posts become labeled spokes, and the existing site-fit doc explicitly recommends "subordinate generative debt to the broader taxonomy" — option C is exactly that. -1 point because it does require touching the existing /generative-debt anchor text in 12 posts | **3/5** — synthesis post can sit cleanly alongside existing 3 posts as a "compare-the-debts" landing page, but it duplicates concepts |
| AI-citation likelihood | **2/5** — new URL, no training-corpus inclusion until next snapshot, ~30-90 day delay                        | **2/5** — the hub URL has 0 ChatGPT-User fetches in the 24h Cloudflare window per site-fit doc                                                         | **4/5** — site-fit doc shows ChatGPT-User fetched `/blog/cognitive-debt-ai-teams` in last 24h; the cognitive/generative-debt cluster is the AI-citation surface that's already active. Retitling and expanding the existing slug keeps the URL ChatGPT/Claude have already crawled; adding 5-type DefinedTermSet markup is a strong AEO signal for a definitional query                                                 | **2/5** — fresh URL, same training-corpus cold-start problem as A                                                                     |

**Totals:** A = 9/25, B = 13/25, **C = 22/25**, D = 13/25.

C wins on every dimension except writing effort, where D is cheaper but produces a thinner artifact with no authority foundation.

---

## What's the natural anchor URL for AI citations on this topic?

**`/blog/cognitive-debt-ai-teams` is the URL AI crawlers are actually hitting today** — the site-fit doc records ChatGPT-User fetching that path within the 24h Cloudflare window (2026-04-27 → 2026-04-28). It is also the post with the highest term density for "cognitive debt" (48 mentions) and "comprehension" (10 mentions), and it is part of the surge from 5 → 32 ChatGPT-User fetches/24h in the last 9 days.

But cognitive-debt-ai-teams is **not** the right anchor for the _taxonomy_ — it is one debt type's deep dive. The natural anchor for "what are the types of AI debt" queries is a definitional page that hosts all 5 terms with DefinedTerm schema. Today, the closest existing page to that shape is `/blog/ai-assisted-development-generative-debt`, which already contains a section literally titled "The Generative Debt Taxonomy" and defines 4 of the 5 debt types as subsections. That is option C.

The strategic move: keep cognitive-debt-ai-teams as the highest-AI-traffic spoke; make the retitled generative-debt URL the taxonomy hub that the cognitive-debt post and the technical-debt-bomb post link to as the canonical definition source. The existing 12 inbound links to the generative-debt URL stay valid, and we add taxonomy-anchor callouts from cognitive + technical debt posts (currently 0 cognitive→genDebt links from cognitive-debt-ai-teams, per grep — that's a gap to close regardless of the URL decision).

---

## Editorial risk to flag

Option C requires retitling a URL that has 12 inbound internal links anchored as "Generative Debt Crisis." If the new title is "The AI-Debt Taxonomy: Generative, Cognitive, Comprehension, Intent, and Technical," the existing anchor text in those 12 posts becomes mismatched (they still say "Generative Debt Crisis"). Decision needed during implementation:

1. Leave anchor text alone — old links still work, but inbound semantics now describe a sub-section rather than the page topic.
2. Update anchor text in all 12 posts to "AI-Debt Taxonomy" — clean, but a 12-file edit pass.

Recommended: option 2 during implementation, batched with the retitling commit. Beads issue scope: ~15 file edits (1 retitle + 14 anchor updates including cognitive-debt + technical-debt + hub + 11 more).

The generative-debt term itself should remain prominent in the post body as the original-coining attribution (per Slater arXiv 2512.04273 + Aleix LinkedIn Pulse) — this is what the validation research called "subordinate generative debt to the broader taxonomy as the architectural-violation sub-type." The retitle does not delete the term; it widens the scope.

---

## What this rules out

- **Option A is dominated** on every criterion except writing effort vs. C. There is no scenario where shipping a brand-new URL beats expanding the only URL with GSC presence in this cluster.
- **Option B is dominated** because the hub URL has zero GSC impressions in 90d, contradicting the premise that it has authority worth restructuring around. Adding a taxonomy to the hub turns a navigational document into a definitional one and confuses the entity graph (Article-as-hub vs. Article-as-definition).
- **Option D is dominated** unless writing effort is the binding constraint. With 75% of the taxonomy content already written, the marginal cost of going from D's 1,500 words to C's 4,000+ words is small, and C earns the schema/authority/coherence points D leaves on the table.

---

## Confidence and gaps

- **High confidence:** The 4-URL GSC pull (live, this session). The internal-link counts (grep of repo). The taxonomy term-frequency map.
- **Medium confidence:** The AI-citation likelihood scoring leans on the site-fit doc's 24h Cloudflare snapshot. A 24h window is thin; if the ChatGPT-User surge reverses, score for C drops to 3/5 and the gap with B narrows.
- **Gap:** GA4 referrer data is still blocked (per project memory), so we cannot verify whether AI-grounding fetches translate to actual visitors from chatgpt.com / claude.ai / perplexity.ai. The recommendation does not depend on resolving this, but measurement of post-publish success does.
