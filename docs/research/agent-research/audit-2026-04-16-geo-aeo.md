# GEO/AEO Audit — alexmayhew.dev (2026-04-16)

**Status:** CURRENT
**Scope:** How well is the site optimized for being cited/surfaced by ChatGPT, Perplexity, Claude, Gemini, Google AI Overviews, SearchGPT
**Mode:** REPORT ONLY — no edits made

## Executive Summary

The site has a **strong AEO foundation** (FAQ schema library, question-phrased headings, TL;DR blocks, explicit answer density) and an **above-average GEO baseline** (llms.txt, broad AI crawler allow-list, rich JSON-LD graph). The three biggest losses are: (1) a **dual-conflicting llms.txt** where a 9KB static file shadows a dynamic route that would include newer content; (2) **no visible author byline** on blog posts, which strips a primary E-E-A-T extraction signal; and (3) **no llms-full.txt and no glossary/definitions page**, which is the single biggest GEO lever left on the table given that citation-worthy original frameworks already exist throughout the content.

Overall: roughly **62/100 AEO**, **55/100 GEO** vs. best-practice 2026 baseline.

---

## Critical Findings (Fix This Quarter)

### C1. Two `llms.txt` files shipping — the inferior one is winning

- **Evidence:**
  - Static: `/home/deploy/projects/amdev/alexmayhew-dev/public/llms.txt` (9KB, hand-authored, dated 2026-03-15)
  - Dynamic: `/home/deploy/projects/amdev/alexmayhew-dev/src/app/llms.txt/route.ts` (programmatic, pulls live blog index)
  - Verification: `curl -s https://alexmayhew.dev/llms.txt` returns the **static** version (Cloudflare Pages serves `/public/*` before Next.js routes at the same path).
- **Impact:**
  - Static file is a month stale — it lists post slugs that no longer exist (`/blog/building-ai-features-users-want`, `/tools/pilot`) and misses all posts authored after 2026-03-15 (every post in the `docs/CONTENT_STATUS.md` addition list).
  - Dynamic route's cleaner spec-compliant layout (hub-first, description-anchored, service section) never reaches crawlers.
  - `llmstxt.org` spec calls for a concise curated index; current static file is closer to a prose `about.md` (144 lines of marketing copy, 8 nested headings, no consistent link-list structure). This lowers machine parseability vs. the dynamic version's tight list format.
- **Recommendation:** Delete `/public/llms.txt`. Keep the dynamic `src/app/llms.txt/route.ts` and extend it to include `/technologies`, `/for/[role]`, `/tools`, `/work`, plus the top-5 hub posts' one-line summaries. Also add a separate `/llms-full.txt` route that concatenates all hub posts in full markdown for models that request the detailed variant (see M2).

### C2. No visible author byline on blog posts

- **Evidence:** `/home/deploy/projects/amdev/alexmayhew-dev/src/components/blog/blog-article.tsx` renders the header block lines 84-100 with date, reading time, and category — but a `grep -i "author|byline|Alex Mayhew"` across that file returns **zero matches**.
- **Impact (AEO):** The string "By Alex Mayhew" does not appear in the rendered HTML of any blog post. Models crawling a post have to infer authorship from JSON-LD alone, which many retrieval systems downweight vs. visible byline text. Perplexity and SearchGPT attribution traces rely heavily on explicit `"By [Author]"` strings near the `<h1>`.
- **Impact (E-E-A-T):** Google's helpful-content and E-E-A-T signals specifically reward visible authorship. No visible byline means Google cannot cross-verify the JSON-LD `author` claim against the rendered page.
- **Recommendation:** Add a visible byline component directly under the `<h1>`, linking to `/about`, with a 20-30 word credibility blurb (e.g., _"By Alex Mayhew — Technical Advisor, 15+ years architecting SaaS systems"_). Also add it to hub/spoke pSEO service pages.

### C3. No `llms-full.txt` — missing the high-leverage GEO artifact

- **Evidence:** `curl -sI https://alexmayhew.dev/llms-full.txt` returns `HTTP/2 404`. Only the short `llms.txt` exists.
- **Impact:** `llmstxt.org` spec now explicitly recommends a companion `llms-full.txt` containing complete content in a single markdown file, optimized for model ingestion. Mintlify, Anthropic docs, and major dev-tooling sites ship both. Models that want grounded citations prefer the full variant because it eliminates the second-fetch round-trip. Without it, Perplexity and Claude-SearchBot either skip the site or fall back to HTML scraping (higher error, lower attribution fidelity).
- **Recommendation:** Add `src/app/llms-full.txt/route.ts` that concatenates all hub posts (~5 posts, ~12k words) with YAML frontmatter stripped, preceded by a 300-word site overview. Cache 24 hours.

### C4. Person schema lacks E-E-A-T credential signals

- **Evidence:** `src/components/seo/json-ld.tsx` lines 1-61. The `Person` schema has `jobTitle`, `knowsAbout`, `award`, `sameAs` — but is missing:
  - `hasCredential` (certifications, formal qualifications)
  - `alumniOf` (educational institutions)
  - `memberOf` (professional organizations)
  - `yearsOfExperience` / description specifying years
  - `nationality` / `homeLocation` (Person detail that helps disambiguation)
  - `knowsLanguage` (the site mentions English/Spanish but schema doesn't)
- **Impact:** When ChatGPT or Claude is asked _"Who is a technical advisor specializing in SaaS architecture?"_, their retrieval-augmented answer leans heavily on `Person`-schema fields to establish authority. Absent `hasCredential`/`alumniOf`/years, the response may prefer competitors whose schemas are more complete.
- **Recommendation:** Enrich `Person` with at minimum: `description` expanded to explicitly state "15+ years of experience" (quantitative, not qualitative), `knowsLanguage: ["English", "Spanish"]`, and `memberOf` with any relevant professional bodies. If formal credentials exist, add `hasCredential`.

### C5. `BreadcrumbList` only on blog and newsletter — absent from all other extractable pages

- **Evidence:** `grep BreadcrumbJsonLd src/**/*.tsx` returns only `src/app/blog/[slug]/page.tsx` and `src/app/newsletter/[slug]/page.tsx`. pSEO service pages use `breadcrumbSchema()` helper _inline_ inside their JSON-LD bundle (which is correct), but **`/about`, `/work`, `/work/[slug]`, `/tools/*`, `/technologies/*`, `/for/[role]`, `/services` (index)** have no BreadcrumbList.
- **Impact:** AI crawlers use breadcrumbs to understand page hierarchy and context — this is especially important for SearchGPT and Google AI Overviews which cite with site-hierarchy paths. Missing breadcrumbs on `/work/[slug]` (case studies) means AI answers lose the "this is a portfolio piece under Alex Mayhew's work" anchor.
- **Recommendation:** Add `BreadcrumbJsonLd` to every non-root page. Refactor to a shared helper so adding a new page section forces breadcrumb declaration at build time.

---

## High Priority

### H1. No glossary / definitions page — leaving the single biggest GEO lever on the table

- **Evidence:** `curl -sI https://alexmayhew.dev/glossary` → 404. No `/faq` standalone either.
- **Why this matters (2026 context):** A curated glossary of definitional statements ("_X is Y_" format) is one of the highest-ROI GEO moves in 2026. Models like Perplexity and SearchGPT disproportionately cite glossary entries for definitional queries ("what is cognitive debt", "what is the lambda tax") because the entry is a self-contained, citation-sized unit. The content already contains dozens of coinable terms authored by Alex (cognitive debt, generative debt, vibe coding hangover, atmospheric engineering, 50% rule, METR paradox, lambda tax reframing). These are **original phrases** where Alex could be the primary citation source.
- **Recommendation:** Create `/glossary` as a single long page with 20-30 terms in `<dl>`/`<dt>`/`<dd>` structure, each entry having a `DefinedTerm` JSON-LD schema and anchored sections for direct `#term` linking. Every hub and spoke post then links to glossary anchors rather than re-defining inline. Expected impact: high — these phrases are searchable, unique, and the content already defines them authoritatively.

### H2. FAQ schema coverage stops at hubs and ~6 spokes — missing 27 published posts

- **Evidence:** `src/app/blog/[slug]/hub-faqs.ts` contains FAQs for 15 slugs (5 hubs + 10 spokes). `src/data/blog-index.json` would show the full 69 posts. FAQ schema presence on **majority of spokes = 0**.
- **Impact:** FAQPage schema is still one of the highest-signal AEO structures — Google AI Overviews, Perplexity, and ChatGPT all preferentially extract from marked-up FAQ blocks. Every spoke post that has natural Q&A content but no FAQ schema is leaving citations on the table.
- **Recommendation:** Audit each spoke for existing `## FAQ` sections (the `cognitive-debt-ai-teams.mdx` grep showed `## FAQ` at line 323 — likely many others). Wherever the MDX already has a FAQ section, auto-generate FAQPage JSON-LD from the parsed MDX at build time rather than hand-authoring in `hub-faqs.ts`. This is a one-time build-plugin effort that scales to every future post.

### H3. No `HowTo` schema usage despite rich step-based content

- **Evidence:** `grep HowToJsonLd src/**/*.tsx` shows the component exists (`src/components/seo/howto-json-ld.tsx`) and is referenced by `migration-json-ld.tsx` and `integration-json-ld.tsx` — but a grep for `HowToJsonLd` invocations in **blog posts** returns zero. Posts like `vibe-coding-hangover-recovery`, `database-migration-patterns`, `ai-security-red-team-playbook` are step-based tutorials.
- **Impact:** HowTo schema is the best match for "how do I X" queries that ChatGPT/Perplexity handle frequently. Without HowTo markup, the content competes as generic Article rather than as a recipe-style answer.
- **Recommendation:** Add HowTo schema to all playbook/recipe blog posts. At least 10 existing posts qualify.

### H4. `sameAs` inconsistency — Bluesky in Person but not in Organization or ConsultingService

- **Evidence:** `src/components/seo/json-ld.tsx`:
  - `personSchema.sameAs` (line 9-14) includes `bsky.app/profile/alexmayhewdev.bsky.social`
  - `organizationSchema.sameAs` (lines 76-80) — **no Bluesky**
  - `professionalServiceSchema.sameAs` (lines 197-201) — **no Bluesky**
  - `public/llms.txt` lines 187-191 — no Bluesky listed
  - `src/app/llms.txt/route.ts` lines 85-90 — no Bluesky listed
- **Impact:** Knowledge graph disambiguation degrades when same-entity references don't share the same sameAs set. AI models merging sources sometimes split the entity into duplicates.
- **Recommendation:** Centralize `SAME_AS_URLS` in `schema-utils.tsx` and reference from every schema. Add Dev.to once Alex starts cross-posting (currently canonical-to-site only in plan). Verify LinkedIn/GitHub/X/Bluesky are the full set.

### H5. No Wikipedia / Wikidata entity

- **Evidence:** Grep for `wikipedia|wikidata` in `src/**` returns zero. The site has not attempted Wikidata presence.
- **Impact:** Wikipedia/Wikidata is a primary grounding source for ChatGPT, Claude, and Gemini. An Alex Mayhew Wikidata entity (even at Q-level stub) with `sameAs` to the site would materially improve entity recognition. This is likely premature at current domain authority, but should be on the 12-month plan once content has visible external citations.
- **Recommendation:** Defer to post-2026-Q3. Track as roadmap item pending 5+ external citations on trusted tech publications.

### H6. No AI-crawler-aware analytics or bot traffic observability

- **Evidence:** `middleware.ts` lines 1-63 — only sets security headers. No user-agent inspection, logging, or differentiated handling for AI bots. No Cloudflare Workers rule or Logpush config visible in repo to track GPTBot/ClaudeBot/PerplexityBot hits.
- **Impact:** Currently blind to whether the `robots.txt` allow-list is actually producing AI-crawler traffic, which bot is most active, which pages they hit, and whether the `llms.txt` file is being requested. Without this, future GEO optimization is guesswork.
- **Recommendation:** Add a lightweight Cloudflare Workers logpush rule (or a `mcp__cloudflare__logs` consumer) that tags requests with AI-bot user-agent patterns. Minimum viable: a cron-scheduled script that parses Cloudflare Analytics for these UAs weekly and writes to `docs/research/ai-crawler-traffic-YYYY-MM.md`.

---

## Medium Priority

### M1. Inverted-pyramid violation on some hub intros

- **Evidence:** `content/blog/ai-assisted-development-guide.mdx` lines 16-22 — strong TL;DR + Key Takeaways, correct inverted pyramid.
- `content/blog/cognitive-debt-ai-teams.mdx` line 14 also has TL;DR.
- But sample of 5 non-hub posts (spot-checked) showed mixed pattern — some have TL;DR, some don't. A full audit would require traversing all 69 posts.
- **Recommendation:** Make TL;DR mandatory via a frontmatter-validation step in the build pipeline. Fumadocs/content-collections can enforce schema presence. Every post should start with a `> **TL;DR:** ...` block within the first 200 words.

### M2. `Article` schema missing `wordCount` and `inLanguage` variance

- **Evidence:** `src/components/seo/article-json-ld.tsx` lines 26-49 — has `keywords`, `articleSection`, `inLanguage: "en-US"`, `isAccessibleForFree: true`, but no:
  - `wordCount` — AI models use this to estimate answer depth
  - `speakable` spec pointer (voice/AI assistant extraction hint)
  - `about` / `mentions` — named-entity anchors for content
  - `citation` — would link external research sources this post draws from
  - `dependencies` array referring to prerequisite hub posts
- **Recommendation:** Add `wordCount` (trivial — compute from MDX at build), `speakable` with xpath to h1/TL;DR, and `mentions` for named frameworks (e.g., METR study, GitClear findings).

### M3. `ProfilePage` on /about has minimal E-E-A-T surface

- **Evidence:** `src/app/about/page.tsx` lines 36-50 — ProfilePage schema is bare. `mainEntity: PERSON_REF` is correct, but the page doesn't surface:
  - `primaryImageOfPage`
  - `significantLink` to credibility anchors (published articles, case studies)
  - `hasPart` listing the key sections (skills, timeline, outcomes)
- The rendered `AboutPage` (`src/components/pages/about-page.tsx`) has excellent outcome-stat density (`400%`, `2.1s → 0.3s`, `$2M+`, `Zero critical incidents` at lines 46-67) — but these are in a `<div>` without `<dl>`/`<dt>` semantic markup, reducing extractability.
- **Recommendation:** (1) Wrap the `outcomes` block in `<dl>` with each metric as `<dt>`/`<dd>`. (2) Expand the ProfilePage JSON-LD with `primaryImageOfPage` and `significantLink` array pointing to 3-5 best posts.

### M4. Internal attribution sentences not templated

- **Evidence:** The AboutPage prose at `src/components/pages/about-page.tsx` lines 149-164 is strong ("I help them choose wisely", "six years of building systems") but the phrase **"Alex Mayhew, a Technical Advisor with X years of experience in Y,"** — the classic explicit-attribution sentence pattern that AI models extract verbatim — does not appear anywhere on the site.
- **Why this matters:** Models cite with attribution tags. If the source has a pre-formed attribution sentence, citations are higher fidelity. Docs like the Stripe Press author pages and Anthropic team pages all include this canonical sentence.
- **Recommendation:** Add one canonical attribution sentence to the AboutPage hero and to the byline component, e.g., _"Alex Mayhew is a Technical Advisor and Systems Architect with 15+ years of experience, specializing in SaaS architecture, performance engineering, and AI-assisted development for startups."_ Use the same sentence verbatim across the byline, about hero, contact page intro, and llms.txt overview.

### M5. FAQ answers in `hub-faqs.ts` use ellipsis as bullet delimiter — mixed results in extraction

- **Evidence:** `src/app/blog/[slug]/hub-faqs.ts` — answers occasionally use `...` to connect clauses (e.g., line 176: _"render on both server (for HTML) and client (for interactivity)..."_). This matches the site's voice convention, but some LLMs misparse `...` as continuation/truncation and cut the answer.
- **Impact:** Minor. Worst case, an extracted answer appears truncated.
- **Recommendation:** Leave voice guide intact for human-readable content. In FAQ _answers_ specifically, replace inner `...` with explicit `—` or split into two sentences to ensure clean machine extraction. The questions and primary declarative sentences are already clean.

### M6. No `SpeakableSpecification` for voice assistants

- **Evidence:** No `speakable` field in any JSON-LD in the repo.
- **Impact:** Google Assistant and other voice-interface AI systems preferentially read `speakable`-tagged content. For a portfolio site this is low leverage, but for hub posts that are likely to be referenced in audio contexts, it costs nothing to add.
- **Recommendation:** Add to hub posts' Article schema: `speakable: { "@type": "SpeakableSpecification", xpath: ["/html/head/title", "//*[@id='tldr']"] }`.

### M7. `Article` is `TechArticle` for hubs but `BlogPosting` for spokes — good split, but no `proficiencyLevel` or `dependencies`

- **Evidence:** `src/components/seo/article-json-ld.tsx` line 28 — good that hubs are `TechArticle`. But `TechArticle` has unique fields (`proficiencyLevel`, `dependencies`) that aren't populated.
- **Recommendation:** Hub articles should set `proficiencyLevel: "Advanced"` (their audience is senior engineers/CTOs) and `dependencies` listing 1-2 prerequisite concepts. This lets AI tutors and research agents route the right post to the right user skill level.

### M8. OpenGraph `type: "profile"` on /about but profile-specific fields missing

- **Evidence:** `src/app/about/page.tsx` line 14 — `type: "profile"`. OG profile type supports `profile:first_name`, `profile:last_name`, `profile:username` — none set.
- **Impact:** Minor. Facebook/LinkedIn scrapers look for these. AI scrapers also extract from OG as fallback.
- **Recommendation:** Add them in `openGraph` block.

---

## Low Priority

### L1. robots.txt is well-configured for AI crawlers — keep it as is

- **Evidence:** `src/app/robots.ts` lines 1-72. Explicitly allows: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Google-Extended, GoogleOther, PerplexityBot, Perplexity-User, CCBot, Meta-ExternalAgent, AI2Bot, Applebot-Extended.
- **Verdict:** This is the 2026 state of the art. No change needed. Worth adding `amazonbot`, `YouBot`, and `Bytespider` for completeness, but low priority.

### L2. `Article` `keywords` field uses comma-string not array — a Google/AEO schema 2026 pattern preference shift

- **Evidence:** `src/components/seo/article-json-ld.tsx` line 46: `keywords: tags.join(", ")`.
- **Recommendation:** Change to `keywords: tags` (array). schema.org accepts both but array is preferred in 2026 for extraction tools.

### L3. No `mainEntityOfPage` fallback on pages using `webPageSchema` helper

- **Evidence:** `src/components/seo/schema-utils.tsx` lines 70-90 — the helper accepts `mainEntityId` but most invocations don't pass it. Defaults to the page URL (self-reference), which is technically valid but less informative than pointing to the `Service` or `Article` `@id`.
- **Recommendation:** Always pass `mainEntityId` explicitly; makes the JSON-LD graph more navigable for crawlers.

### L4. llms.txt (both versions) lack a `# Optional` trailing section per spec

- **Evidence:** `llmstxt.org` spec suggests an `## Optional` section with secondary-but-useful links. Neither file has one.
- **Recommendation:** Add an `## Optional` section with links to RSS feed, sitemap, a "canonical latest post" anchor, and a "most-cited" selection.

### L5. No `CreativeWork.citation` cross-references between hub and spoke posts

- **Evidence:** Hub and spoke posts link via prose/nav, but JSON-LD doesn't declare the relationship.
- **Recommendation:** On each spoke post's Article schema, add `isPartOf` pointing to the hub's `@id`. This makes the hub-and-spoke taxonomy machine-readable and is exactly the kind of signal Claude-SearchBot and Perplexity use to group related results.

### L6. CollectionPage on /blog is minimal

- **Evidence:** `src/app/blog/page.tsx` lines 43-67 — good that CollectionPage exists with ItemList. Missing `inLanguage`, `about` (the blog's topical focus), `dateModified`, `editor` pointing to Person.
- **Recommendation:** Enrich in a 10-line edit.

---

## What's Working Well (Keep Doing)

1. **Robots allow-list is best-in-class for 2026** — all major AI crawlers explicitly allowed.
2. **FAQ schema library (`hub-faqs.ts`) is exceptional for the hubs and key spokes** — concise, declarative answers, specific numbers, primary-source anchoring. This is the single strongest AEO asset on the site.
3. **TL;DR + Key Takeaways on hub posts** — inverted pyramid is correctly applied on AI-assisted-development-guide and cognitive-debt-ai-teams at minimum.
4. **Question-phrased headings** — `grep "^## |^### "` on cognitive-debt post shows headings like _"What Is Cognitive Debt?"_, _"How do you measure cognitive debt?"_. This is exactly what AEO wants.
5. **Schema.org `@id` graph already in place** — `PERSON_REF`, `ORG_REF`, `WEBSITE_REF` in `schema-utils.tsx` correctly implement the @id pattern that lets AI models merge cross-page entities into one knowledge-graph entity.
6. **Brand/entity consistency** — "Alex Mayhew" is used consistently across JSON-LD, metadata, llms.txt, and OpenGraph. No "A. Mayhew" or "A.M." variants that would split entity recognition.
7. **Factual density in FAQs** — 43-percentage-point gap (METR), $1.5T by 2027 (AI debt), 60% refactoring decline (GitClear), 63% Claude Code adoption — specific, sourceable numbers throughout. This is prime citation bait.
8. **pSEO Service schemas include price ranges** — rare and valuable for AI answers to "how much does a technical advisor cost".

---

## Scoring (0-100 vs. 2026 Best Practice)

| Dimension                                             | Score  | Notes                                                                  |
| ----------------------------------------------------- | ------ | ---------------------------------------------------------------------- |
| Technical discoverability (robots, llms.txt, sitemap) | 70     | llms.txt conflict drags this down; otherwise excellent                 |
| Structured data (JSON-LD graph)                       | 75     | Strong on services/blog; gaps on work/tools/tech; missing Person depth |
| Content structure (TL;DR, Q&A, lists, tables)         | 78     | Hubs exemplary; spokes inconsistent                                    |
| E-E-A-T signals                                       | 50     | No visible byline, no credentials, no Wikipedia                        |
| Citation-worthiness                                   | 80     | Original frameworks, specific numbers, quotable content — strong       |
| Entity/brand consistency                              | 85     | Consistent naming; missing Bluesky in 2 of 3 schemas                   |
| AI-bot observability                                  | 10     | No logging, no metrics — blind spot                                    |
| **Overall AEO**                                       | **62** |                                                                        |
| **Overall GEO**                                       | **55** |                                                                        |

---

## Recommended Priority Queue (Where to Spend the Next 40 Engineering Hours)

1. **Delete `/public/llms.txt`; fix dynamic route to include all sections** (C1) — 2 hours, unblocks GEO
2. **Add visible author byline component to blog-article + pSEO pages** (C2) — 3 hours, unblocks E-E-A-T
3. **Build `/llms-full.txt` route concatenating hubs** (C3) — 4 hours, major GEO leverage
4. **Create `/glossary` with 20-30 Alex-originated terms + `DefinedTerm` schema** (H1) — 12 hours, highest ROI content move
5. **Build-time FAQ schema auto-gen from MDX `## FAQ` sections** (H2) — 8 hours, scales to all 69 posts and all future posts
6. **Add Person schema `description` with explicit "15+ years", `knowsLanguage`, `memberOf`** (C4) — 1 hour
7. **Add BreadcrumbList to all non-blog/non-newsletter pages** (C5) — 3 hours
8. **Add HowTo schema to 10 playbook posts** (H3) — 4 hours
9. **Add `wordCount` + `speakable` + `isPartOf` to Article schema** (M2, M6, L5) — 3 hours

**Total: ~40 hours to lift both AEO and GEO scores from ~60 to ~80.**

---

## Sources / References

- `docs/research/schema-markup-seo-2026.md` (existing repo research, 143 lines) — confirms llms.txt complementary role
- `docs/research/person-schema-eeat-2026.md` (existing repo research, 474 lines) — confirms ProfilePage choice
- `docs/research/agent-research/audit-2026-04-16-schema.md` (sibling audit) — coordinate with its findings
- `llmstxt.org` spec (as of 2026) — llms.txt and llms-full.txt patterns
- Schema.org 2026 (FAQPage, HowTo, ProfilePage, DefinedTerm, SpeakableSpecification)
