# AI-Debt Taxonomy — Red-Team Review of the Hybrid Plan (2026-04-28)

**Status:** CURRENT
**Session:** Adversarial stress-test of the hybrid retitle-and-restructure plan for `/blog/ai-assisted-development-generative-debt`.

---

## VERDICT: PLAN NEEDS MODIFICATION

The plan's structure is sound, but it carries one load-bearing factual error and one under-counted scope item that together push effort from 4-5h to 8-10h and create a real cannibalization risk if shipped as written. Two specific edits make it defensible.

---

## The 3 weakest assumptions (ranked)

### 1. (CRITICAL) "75% content reuse" — the existing taxonomy has a different shape than the new one

The existing post's section titled "The Generative Debt Taxonomy" (lines 50-138) is a taxonomy of **sub-types of one debt type**: Structural / Hallucinated Complexity / Omission / Security. The hybrid plan reuses this slot to host a peer taxonomy of **five debt types**: Generative / Cognitive / Comprehension / Intent / Technical. These are different conceptual objects. You cannot graft one onto the other without rewriting the section's framing, the post's TL;DR ("AI accelerates creation but increases defects" frames generative-as-umbrella), the introduction ("The Productivity Paradox"), and the conclusion ("The generative debt crisis is real").

Editorial-fit doc Section "Required Content Moves" already flags this: _"the post conflates 'generative debt = the 4 sub-types' with 'generative debt = everything wrong with AI code.' The naming is muddled."_ The fix it prescribes — rename the section "Four Categories of Generative Defect" — IS a top-to-bottom reframe, not a directory restructure.

Evidence: 2,254 words exist. The hybrid plan adds 5 × 250 = 1,250 directory entries + DefinedTermSet + intro/outro reframe + 12 anchor edits + hub FAQ rewrite. Realistic effort: **8-10 hours**, not 4-5. The 4-5h estimate is the cost of _adding_ the directory; it omits the cost of _removing_ the contradictory existing frame.

### 2. (HIGH) Cannibalization risk on "cognitive debt" queries is real, not mitigated

The plan claims directory framing avoids competing with `/blog/cognitive-debt-ai-teams`. The site-fit data falsifies the premise this rests on:

- `/blog/cognitive-debt-ai-teams` is the page ChatGPT-User actually fetched in the 24h Cloudflare window (smoking gun, site-fit Section 4).
- It has **48 mentions of "cognitive debt"** vs the genDebt post's 1.
- The slug contains the literal phrase "cognitive-debt."
- It's 3,963 words on the topic.

A 200-300 word "cognitive debt" entry on the retitled taxonomy page will not steal the _deep-dive_ query, but the new page risks being confused by Google with the cognitive-debt page on **shared-intent queries** like "ai cognitive debt" or "ai debt types." The genDebt URL ranks pos 6.16 today; the cognitive-debt URL is the active AI-citation surface. Google may merge them or pick the wrong one as canonical for the cluster, cooling whichever is currently warming.

Evidence: Site-fit doc shows the genDebt slug's 28d/d trend is **−74% (cooling)** while cognitive-debt is part of the +540% ChatGPT-User surge. Putting "Cognitive Debt" as a labeled section H2 inside the retitled taxonomy URL gives Google two strong on-page signals on a single domain for the same phrase. That's textbook cannibalization input.

### 3. (HIGH) "Intent debt" is a term-without-substance for this site's voice

Intent debt is mentioned 0 times across all 4 candidate MDX files (URL-strategy doc grep). The only popular source is Storey's arXiv 2603.22106. Validation research notes the term as "EMERGING / academic" — not in the popular essay corpus. To write 200-300 credible words, Alex needs either (a) original framing or (b) heavy paraphrase of one source — paraphrasing a single arXiv paper is the canonical "feels like padding" move and the brand voice (Direct & Authoritative, Experienced Perspective) makes that worse, not better.

Realistic outcomes: either the section is thin (and AI engines deprioritize it for citation, which is the entire point of the retitle), OR Alex writes 600+ original words on intent debt — which busts the "directory" framing for a debt type with the least site authority.

---

## Other findings (not fatal)

- **(LOW) URL authority preservation under retitle:** Google generally preserves canonical equity under same-URL retitles + body rewrites. Risk is low BUT pos 6.16 is borderline noise (37 imp / 0 clicks), so "preservation" is preserving near-zero. The retitle won't _hurt_ — but it also doesn't earn what the plan implies. Treat as neutral, not a feature.
- **(LOW) Slug/title mismatch UX:** "ai-assisted-development-generative-debt" vs title "AI-Debt Taxonomy" is mild dissonance. Googlebot doesn't care (canonical URL is canonical). SERP CTR impact is small — slug already buried under title in Google previews. Not a blocker.
- **(LOW) The 12-link anchor update:** Verified by grep — none of the 12 inbound mentions use time-sensitive language ("recent," "new," "latest"). All are evergreen. The 12-edit pass is genuinely trivial.

---

## Required modifications

1. **Re-estimate to 8-10 hours.** The existing post requires top-to-bottom reframing (TL;DR, intro, taxonomy section, conclusion), not just directory insertion. Honest effort budget prevents mid-flight scope panic.
2. **Demote "Cognitive Debt" entry to a 100-word stub** with strong "deep dive: cognitive-debt-ai-teams" CTA. Do not write a 250-300 word section that competes on entity density. Treat the cognitive entry as a navigational pointer, not a definition.
3. **Either drop "Intent Debt" or commit to research depth.** Honest options: (a) cut it to 4 types (Generative / Cognitive / Comprehension / Technical) — drops the Storey synthesis claim but keeps voice integrity; (b) keep it but spend 1-2 hours of Storey arXiv reading first and write it from genuine understanding. The 200-300 words "from a position of expertise without faking it" path doesn't exist for this term on this site today.
4. **Update the hub FAQ answer** (`ai-assisted-development-guide.mdx` line 477-479): the current FAQ defines "generative debt" identically to how `cognitive-debt-ai-teams.mdx` defines "cognitive debt" (both = "AI code accepted without understanding"). This must be rewritten to position generative debt as the architectural-violation sub-type, OR the entire taxonomy is internally contradictory on day one.
5. **Track the canary.** Snapshot `/blog/ai-assisted-development-generative-debt` GSC position weekly for 60 days post-retitle. If pos 6.16 collapses to >15 within 30 days, the retitle hurt. Reversion plan: rename back, revert anchors, accept the directory loss.

---

## Better plan (if modifications above feel too heavy)

Skip the retitle. Keep the existing post as the "Generative Debt" deep-dive (its actual content shape). Publish the taxonomy as a new short URL `/blog/ai-debt-taxonomy` (~1,800 words, directory-only, link-out heavy). Cost: same 8-10h. Benefit: no cannibalization risk, no contradictory hub FAQ, no anchor churn, no canary risk. Cost: forfeits the 12 inbound links and the (marginal) pos 6.16. Given that pos 6.16 is producing 0 clicks/90d, that forfeit is nominal. **The hybrid plan's central claim — that retitling preserves real authority — does not survive the GSC data.** Option A from the editorial-fit doc was probably right; the URL-strategy doc's option C wins on a metric (37 impressions) that doesn't translate to outcomes.

If Alex wants the directory + the inbound links, do both: ship `/blog/ai-debt-taxonomy` AND leave the existing genDebt post unchanged. The 12 internal links keep working; the new taxonomy hub gets the 5-type framing without the existing post's structural tax.
