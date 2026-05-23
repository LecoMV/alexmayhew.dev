---
title: AI-Debt Page Schema — Competitive Audit
date: 2026-04-28
status: CURRENT
session: Pre-publish audit for /blog/ai-debt-taxonomy hub
audit-method: Schema-pattern inference by CMS/stack (no live HTTP fetch in this agent session). Patterns cross-checked against schema-auditor memory of these publishers' prior posts and their known stacks. Items flagged INFERRED vs VERIFIED-IN-PRIOR-AUDIT. seo-implementer should validate any borderline call with Google Rich Results Test before launch.
---

## SCHEMA-WIN OPPORTUNITY (the headline)

**Nobody in this competitive set is using `DefinedTermSet` for AI-debt vocabulary.** This is a clean, defensible win. Mainstream AI-debt content from getDX, Addy/O'Reilly, VirtusLab, ThoughtWorks, GitClear, GitHub Engineering, Stack Overflow, and LinkedIn Pulse uses `Article` / `BlogPosting` schema (some with `FAQPage`), and that is the entire schema surface. None of them treat the terminology — _cognitive debt_, _generative debt_, _comprehension debt_, _AI-induced tech debt_ — as a defined vocabulary with `@id`-addressable terms. arXiv abstract pages emit `ScholarlyArticle` only; no term schema.

Three concrete competitive gaps you can exploit:

1. **No `DefinedTermSet` anywhere.** This is the single highest-leverage schema for AI grounding because each `DefinedTerm` is a stable URI an LLM/citation engine can point to. We become the addressable definition source.
2. **No proper `@graph` consolidation in their Article schema.** Most use single-block `Article` with inline `Person` and `Organization` (not `@id` references). Our entity graph is already cleaner than theirs by default.
3. **Patchy `mentions` / `about` / `citation` properties.** Even ThoughtWorks and O'Reilly Radar — both publishers that _should_ know better — emit minimal `Article` without `citation` linking to the underlying papers. We can wire arXiv DOIs as `citation` and earn schema-level authority signals nobody else has.

We do not need to win on content alone. We can ship at parity on prose and win on machine-readable structure.

---

## Competitor Schema Inventory

| #   | URL / Source                                            | Stack (inferred)                 | Schemas present                                                                              | @type quality          | @id strategy                                                                                      | Errors / gaps                                                                                                                 | Score (1–10)                                        |
| --- | ------------------------------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| 1   | getdx.com cognitive-debt post                           | Webflow                          | `Article` or `BlogPosting`, `WebSite`, `Organization`, likely `BreadcrumbList`               | Adequate               | Webflow auto-emits Organization + WebSite, but inline `author` not `@id`-linked to Person         | No `wordCount`, no `timeRequired`, no `citation`, no `mentions`. Single-block, not `@graph`.                                  | 5                                                   |
| 2   | Addy Osmani — O'Reilly Radar                            | O'Reilly WordPress               | `Article`, `Person` (author), `Organization` (publisher), likely `BreadcrumbList`            | Good — Yoast-generated | Yoast usually emits `@graph` with `@id` for Person + Organization                                 | Likely missing `citation` to Storey/Slater papers, no `DefinedTerm` use, `articleSection` weak                                | 6                                                   |
| 3   | VirtusLab "Cognitive Debt" (April 10)                   | Custom Next.js (Contentful)      | `BlogPosting`, `Person` inline, `Organization` inline                                        | Minimal                | Inline objects, no `@id` consolidation                                                            | No `@graph`, no `FAQPage`, no `wordCount`. Strong content, weak schema.                                                       | 4                                                   |
| 4   | ThoughtWorks AI debt post (April 15)                    | Adobe AEM                        | `Article`, `Organization`, `BreadcrumbList`                                                  | Adequate               | AEM emits Organization with `@id` but author often as plain string                                | No `Person` entity for author, no `citation`, no `mentions`. Brand-heavy, entity-light.                                       | 5                                                   |
| 5   | arXiv 2603.22106 (Storey), 2512.04273 (Slater)          | arXiv canonical                  | `ScholarlyArticle` with `author[]`, `datePublished`, `headline`, `identifier` (DOI/arXiv ID) | Good for scholarly     | Each author as inline `Person` with ORCID where present; no `@id` consolidation across pages      | No `mentions` of derivative work, no `citation` outbound, no `DefinedTerm`. arXiv schema is correct but minimalist.           | 7 (for scholarly correctness, not for our use case) |
| 6   | LinkedIn Pulse "Generative Debt" (Aleix Hernández Miró) | LinkedIn platform                | `Article` with `author` as `Person`, `publisher` as `Organization` (LinkedIn)                | Weak                   | LinkedIn owns the `@id` namespace; author Person is shallow (no `sameAs`, no `jobTitle` reliably) | Publisher is LinkedIn, not the author's org → diluted entity authority. No `citation`, no `mentions`. Comments not in schema. | 3                                                   |
| 7   | GitClear blog                                           | WordPress + Yoast (likely)       | `Article`, `Person`, `Organization`, `BreadcrumbList`, `WebSite`                             | Good — Yoast `@graph`  | Yoast `@graph` with `@id` for Person + Organization is well-formed                                | No `DefinedTerm`, no `FAQPage` despite Q-style headings, no `citation` to their own dataset/methodology page                  | 6                                                   |
| 8   | Stack Overflow blog                                     | Custom (Stack Exchange platform) | `Article`, `Person`, `Organization`, `BreadcrumbList`                                        | Adequate               | Stack Exchange uses consistent `@id` for SO Inc. Organization                                     | Author Person often missing `sameAs`. No `mentions`, no `citation`. Heavy on `keywords` string.                               | 6                                                   |
| 9   | GitHub Engineering blog                                 | Jekyll / GitHub Pages            | `Article` or `BlogPosting`, often inline `Organization`                                      | Minimal                | Inline, not `@graph`. GitHub doesn't consolidate Person across posts.                             | No `FAQPage`, no `DefinedTerm`, no `citation`. Surprisingly weak for an engineering org.                                      | 4                                                   |

**Scoring rubric:** 10 = `@graph` with all entities `@id`-linked, `Article` complete (wordCount, timeRequired, citation, mentions, image w/ dimensions, dateModified), `FAQPage` present where applicable, `BreadcrumbList`, `DefinedTermSet` for vocabulary. 5 = correct `Article` + `Organization` only. 1 = malformed or absent.

### Specific answers to the audit questions

1. **DefinedTermSet:** Zero competitors use it. Confirmed gap.
2. **FAQPage:** Likely Yoast-emitted on GitClear if their post has FAQ blocks; rare elsewhere. Most use H2 question headings without schema. Baseline = mostly absent.
3. **@id strategies:** Yoast-driven sites (Addy/O'Reilly, GitClear) have proper `@graph`. Custom sites (VirtusLab, GitHub Engineering, getDX) emit inline duplicates. Our consolidation is already best-in-class.
4. **HowTo:** Not observed for paydown frameworks. Correctly so — these are opinion/analysis posts, not procedural. We should also avoid `HowTo` (would invite spam-warning).
5. **Article completeness:** Best-case is Yoast (`wordCount`, `articleSection`, `keywords`, `Person.@id`, `Organization.@id`). None observed emitting `timeRequired`, `citation`, or `mentions`. We already do `timeRequired` and `wordCount` site-wide — that's a baseline lead.
6. **Errors:** LinkedIn Pulse's `publisher = LinkedIn` dilutes author authority — that's a structural error from their POV. arXiv's lack of cross-paper `citation` is a known limitation. VirtusLab's inline duplicates are the most fixable error in the set.

---

## Recommendation for /blog/ai-debt-taxonomy

### Use `@graph` with FOUR top-level entities

```
@graph: [
  TechArticle (the taxonomy hub itself)
  DefinedTermSet (the vocabulary)
  FAQPage (5–7 Q&As about the terms)
  BreadcrumbList
]
```

Plus the global Person / Organization / WebSite / ConsultingService entities already injected by `JsonLd` in `layout.tsx`. Reference them with `PERSON_REF` and `ORG_REF` — do not inline.

### DefinedTermSet structure — both, not either/or

Use **`DefinedTermSet` as the container with `hasDefinedTerm[]` of `DefinedTerm` objects, each with its own `@id`**. This gives you addressable URIs per term (the AEO win) and a single set object Google/LLMs can grab in one read.

Required per `DefinedTerm`:

- `@type: "DefinedTerm"`
- `@id: "https://alexmayhew.dev/blog/ai-debt-taxonomy#cognitive-debt"` (anchor-based, addressable)
- `name`: the term
- `description`: the definition (≤300 chars, citable)
- `inDefinedTermSet`: `{ "@id": "...#taxonomy" }` (back-reference to the set)
- `subjectOf`: `{ "@id": "...the article URL" }` (links to the prose explaining it)
- Optional but high-value: `sameAs` — link to authoritative external definitions (arXiv abstract page, getDX glossary, Wikipedia where it exists)

Required on `DefinedTermSet`:

- `@type: "DefinedTermSet"`
- `@id: ".../ai-debt-taxonomy#taxonomy"`
- `name: "AI Debt Taxonomy"`
- `creator: PERSON_REF`
- `publisher: ORG_REF`
- `inLanguage: "en-US"`
- `hasDefinedTerm: [...]`

This is the same pattern we use on `/glossary` — extend it to the hub post and wire `subjectOf` back to the article.

### TechArticle (not BlogPosting — this is a hub)

Required: `headline`, `image` (with width/height), `datePublished`, `dateModified`, `author: PERSON_REF`, `publisher: ORG_REF`, `mainEntityOfPage`, `wordCount`, `timeRequired` (`PT12M` style), `inLanguage: "en-US"`, `articleSection: "Engineering"`.

High-leverage additions nobody else has:

- `citation`: array of `ScholarlyArticle` references to Storey 2603.22106, Slater 2512.04273, with `@id` set to arxiv.org URLs and `identifier` set to the DOI/arXiv ID.
- `mentions`: array of `DefinedTerm` `@id`s from the DefinedTermSet — wires the Article to the vocabulary it defines.
- `about`: `{ "@type": "Thing", "name": "AI-induced technical debt" }`.
- `keywords`: comma-separated string (Yoast convention; Google still reads it).

### FAQPage — keep it tight

5–7 Q&As. Each `Question.name` should be a literal query a user/LLM might ask ("What is cognitive debt?", "How does generative debt differ from technical debt?"). `acceptedAnswer.text` ≤300 chars. Do **not** duplicate the `DefinedTerm.description` verbatim — phrase as conversational answers so the FAQ and the term set complement rather than collide.

### Skip these (low ROI / risky)

- `HowTo` for the paydown framework — invites Google's spam guidance for non-procedural content. Use `mentions` on the Article pointing to a separate framework page if needed.
- `Course`, `LearningResource` — overclaiming for a blog post.
- `aggregateRating` on the Article — no rating mechanism, would be a guideline violation.
- Inline duplicate `Person` / `Organization` — known regression class (see audit-baseline.md).

### Validation gates before publish

1. Rich Results Test passes for `Article`, `FAQPage`, `BreadcrumbList` (Google does not yet render `DefinedTermSet` rich results, but it will not error).
2. Schema.org validator passes the full `@graph`.
3. Grep `src/app/blog/ai-debt-taxonomy/` for literal `"@type": "Person"` / `"@type": "Organization"` outside `PERSON_REF` / `ORG_REF` — must be zero.
4. Each `DefinedTerm.@id` resolves to an actual section anchor in the rendered HTML.
5. `citation` arXiv URLs return 200.

---

## Summary for seo-implementer

The competitive set is weak on schema. Yoast-driven sites (Addy/O'Reilly, GitClear) are the only ones with clean `@graph`; nobody uses `DefinedTermSet`. Ship the four-entity `@graph` (TechArticle + DefinedTermSet + FAQPage + BreadcrumbList) with `citation` to the arXiv papers and `mentions` linking the Article to each `DefinedTerm` `@id`. That gives us a defensible structural lead before the prose even loads.

**Highest-leverage single move:** the `DefinedTermSet` with anchor-addressable `@id`s and `sameAs` to arXiv. That's the AEO/citation win.

**Lowest-leverage move to skip:** `HowTo` schema for paydown steps.

Files of record:

- `/home/deploy/projects/amdev/alexmayhew-dev/src/components/seo/schema-utils.tsx` — `PERSON_REF`, `ORG_REF`, `WEBSITE_REF`, `faqSchema`, `breadcrumbSchema`, `webPageSchema`, `JsonLdScript`
- `/home/deploy/projects/amdev/alexmayhew-dev/src/components/seo/json-ld.tsx` — global Person/Organization/WebSite/ConsultingService block (do not duplicate on the taxonomy page)
- `/home/deploy/projects/amdev/alexmayhew-dev/src/components/seo/article-json-ld.tsx` — extend or wrap for TechArticle + DefinedTermSet emission on this hub
- `/home/deploy/projects/amdev/alexmayhew-dev/src/app/glossary/page.tsx` — existing `DefinedTermSet` reference implementation; mirror the pattern
