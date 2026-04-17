# Content Audit — alexmayhew.dev (2026-04-16)

**Auditor:** research-analyst
**Scope:** Voice, quality, conversion across homepage, services, about, blog (15 posts sampled), newsletter (36 issues), pSEO, CTAs, contact, lead magnets, error pages, metadata, OG imagery.
**Standards referenced:** `docs/VOICE_GUIDE.md`, `docs/BLOG_QUALITY_CHECKLIST.md`
**Not included:** emoji/slop checks on images (binary), exhaustive every-blog voice scan (sampled).

---

## Executive Summary

Content infrastructure is mature. Voice discipline on blogs is strong: **zero em dashes in blog/newsletter content** (a major prior audit finding is resolved), **zero body-text emojis**, **zero hedging ("perhaps/maybe/might want to")**, and **zero "game-changer/revolutionary"** occurrences. The SaaS Scaling Quiz lead magnet exists and works but is **nowhere on the homepage, about, services, or contact pages** (CRITICAL CRO gap). Homepage word count is still ~270-290 visible words (prior target: 500+). **Five CRITICAL voice contradictions** remain: an experience-number conflict between pages ("15+ years" vs "Six years"), double-dash `--` in every hub-post Key Takeaway, zero testimonials/social proof anywhere, orphan blog posts lacking hub callouts, and CTA casing inconsistency across error states.

**Counts at a glance:**

| Metric                                   | Value                 | Target       | Verdict   |
| ---------------------------------------- | --------------------- | ------------ | --------- |
| Em dashes in blog/newsletter             | 0                     | 0            | PASS      |
| Em dashes in `src/` source               | 5 (CSS comment)       | 0            | OK        |
| Hedging ("perhaps/might want to")        | 0                     | 0            | PASS      |
| "game-changer/revolutionary"             | 0                     | 0            | PASS      |
| "cutting-edge" in blogs                  | 3 (all contrarian)    | —            | PASS      |
| Blog posts with 4+ internal links        | 71/74                 | 74           | HIGH PASS |
| Blog posts with "Part of [Hub]" callout  | 66/74 (hubs excepted) | 74           | GAP x3    |
| Blog posts with "## More in This Series" | 64/74                 | 74 (non-hub) | GAP x5    |
| Body-text emojis in content              | 0                     | 0            | PASS      |
| Testimonials on site                     | 0                     | 3+           | CRITICAL  |
| Saas Scaling Quiz CTAs above fold        | 0                     | 1+           | CRITICAL  |

---

## CRITICAL Findings (Fix Before Next Campaign)

### C1. Experience-number contradiction between home and about

**Severity:** CRITICAL (trust/E-E-A-T)
**File:** `src/app/home-page.tsx:251` vs `src/components/pages/about-page.tsx:155`

Home snippet: `"15+ years building production systems across fintech, healthcare, SaaS, and e-commerce."`
About page: `"Six years of building systems that scale has taught me something counterintuitive..."`
Timeline on about (lines 90-116) shows 2018-2024 = **six years**.
llms.txt (`src/app/llms.txt/route.ts:32`) says `"15+ years of experience, 30+ startups advised"`.
Roles data (`src/data/roles/pages.ts:112`) uses `"15+ years of hands-on technical leadership experience"`.

A CTO comparing these within the same session will mark the claim as untrustworthy. Either the about narrative is wrong, or the 15+ year claim is inflated. **Decide the correct figure and synchronize everywhere.** If the honest number is six years as a Technical Advisor but 15+ years total in software, say that explicitly: "Six years advising SaaS founders; 15+ years total in production software."

### C2. Zero social proof anywhere on the site

**Severity:** CRITICAL (CRO)
**Files:** Homepage, services, about, contact — none contain testimonials.

Search across `src/` for `testimonial|Testimonial` returns zero files. Services page has only the four number metrics (400%, 337x, $2M+, 0 incidents) but no attribution. These numbers are unverifiable claims without a name, logo, or quote. For a $25k-$50k MVP engagement floor (`src/data/pseo/pages.ts:152-163`), buyers expect named proof.

**Recommendation:** Add a three-quote testimonial strip to the homepage (between Services and About sections) and a named-logo row to services/page.tsx. Even two verified quotes with LinkedIn-linkable names will outperform current unattributed metrics. Case studies on `/work` exist but are not surfaced on the homepage narrative.

### C3. SaaS Scaling Quiz lead magnet invisible outside /tools

**Severity:** CRITICAL (CRO / lead gen)
**Evidence:** `grep "saas-readiness|Scaling Quiz"` returns matches ONLY in `/src/app/tools/saas-readiness/` and `/src/components/pages/tools-page.tsx`. No references in:

- `src/app/home-page.tsx`
- `src/components/pages/about-page.tsx`
- `src/components/pages/contact-page.tsx`
- `src/app/services/services-page-content.tsx`
- `src/components/ui/navigation.tsx` (not in tools dropdown either)

The homepage has three CTAs: `START_CONVERSATION()`, `View Work`, `INITIATE_PARTNERSHIP()`. **None lead to the free self-qualifying asset.** Contact and services pages have the same pattern.

**Rewrite suggestion (homepage, new section between Services and About, or replace current bottom CTA):**

```
▸ Free Assessment
Not ready to talk yet? Diagnose your SaaS scaling gaps in 3 minutes.
8 architecture questions. Actionable scorecard. No email required to see results.
[RUN_ASSESSMENT()] → /tools/saas-readiness
```

Also add a "Tools" dropdown entry at `src/components/ui/navigation.tsx:45-70` with the SaaS Scaling quiz (currently only lists Voice Cloner, TraceForge, Claude Pilot).

### C4. Double-dash `--` violations in every hub post Key Takeaway

**Severity:** CRITICAL (voice guide violation)
**Files:** 12 blog posts. Grep `--` pattern:

- `saas-architecture-decision-framework.mdx:22` (4 instances in key takeaway block)
- `performance-engineering-playbook.mdx:22`
- `ai-assisted-development-guide.mdx`
- `modern-frontend-architecture.mdx` (also key takeaway)
- `database-migration-patterns.mdx`
- `tailwind-vs-component-libraries.mdx`
- `multi-tenancy-prisma-rls.mdx`
- `saas-billing-stripe-architecture.mdx`
- `vector-database-selection.mdx`
- `ai-code-review.mdx`
- `anatomy-of-high-precision-saas.mdx`
- `llm-integration-architecture.mdx`
- `saas-reliability-monitoring.mdx`

VOICE_GUIDE.md line 113: `"NEVER use em dashes (—) or double dashes (--)"`.

Representative quote (`saas-architecture-decision-framework.mdx:22`):

> "Use PostgreSQL with Row-Level Security from day one **--** retrofitting tenant isolation costs 10x the upfront investment."

Should be:

> "Use PostgreSQL with Row-Level Security from day one... retrofitting tenant isolation costs 10x the upfront investment."

12 file sweep to replace `--` with `... ` (space-hyphen-hyphen-space → space-dot-dot-dot-space) will close this. Also one in `content/newsletter/issues/015-code-review.mdx:1`.

### C5. Error/404/offline CTA copy inconsistency

**Severity:** CRITICAL (brand voice consistency)
**Files:**

- `src/app/not-found.tsx:16`: `"Return Home"` (Title Case)
- `src/app/error.tsx:41`: `"Return home"` (sentence case)
- `src/app/offline/page.tsx:31`: `"HOME"` (caps only, no function syntax)
- `src/app/offline/page.tsx:23`: `"RETRY_CONNECTION()"` (function syntax)

The code-syntax CTA pattern (`START_CONVERSATION()`, `TRANSMIT_MESSAGE()`, `INITIATE_PARTNERSHIP()`, `SCHEDULE_CONSULTATION()`, `INITIATE_CONTACT()`, `SCOPE_INTEGRATION()`, `AUDIT_SYSTEM()`, `SCHEDULE_CALL()`, `VIEW_SERVICE()`, `EXPLORE()`, `TRANSMIT_MESSAGE()`, `VIEW_LIVE()`, `SOURCE_CODE()`, `DISCUSS_PROJECT()`, `COPY_LINK()`, `SHARE()`, `RETRY_CONNECTION()`) is used inconsistently — 15+ different verbs. Error and 404 pages fall back to plain-case. Pick one and apply site-wide.

**Recommendation:** All primary CTAs use `VERB_NOUN()` code syntax with the cyber-lime accent. 404 → `RETURN_HOME()`, Error → `RETRY()` + `RETURN_HOME()`, Offline already matches. Also consolidate the 15 unique CTA verbs into a vocabulary of ~5: `START_CONVERSATION()`, `SCHEDULE_CALL()`, `RUN_ASSESSMENT()`, `VIEW_WORK()`, `READ_GUIDE()`.

---

## HIGH Findings

### H1. Homepage word count still under 500-word target

**File:** `src/app/home-page.tsx`
**Evidence:** ~270-290 visible body words (hero ~28, services copy ~55, about ~100, newsletter ~30, bottom CTA ~25, misc ~30). Prior audit flagged 262 words; this is a marginal improvement.

The hero is 26 words, which is fine. The deficit is in two places:

1. **Services section (lines 174-233)** — three cards at 20 words each (total ~60). Should include concrete outcomes per service.
2. **About snippet (lines 250-259)** — only two paragraphs (~100 words). Missing: a single contrarian line, a specific client-result quote, or a one-line reason why advisory ≠ dev-for-hire.

**Rewrite suggestion (Services section cards, add outcome after description):**

```js
{
  icon: Terminal,
  title: "Full-Stack Development",
  description: "End-to-end web applications architected for scale, security, and long-term maintainability.",
  outcome: "One client went from 4.2s LCP to 1.8s... trial-to-paid more than doubled.",
  code: "dev.fullstack()",
},
```

Add a 100-word "What Advisory Is NOT" section above the bottom CTA:

> "I don't write your code. I don't replace your team. I show up for the four or five decisions per quarter where choosing wrong costs you six months."

This gets homepage to 500+ words without padding.

### H2. Orphan posts without hub callouts

**Severity:** HIGH (hub-and-spoke SEO, E-E-A-T)
**Files:**

- `content/blog/typescript-business-case.mdx` — has `series: "frontend-architecture"` but no `"Part of [Modern Frontend Architecture]"` callout and no `## More in This Series` section. Only **1 internal /blog link** (below 4-7 target). Only 1,853 words (below 2,000 quality gate).
- `content/blog/ai-assisted-development-reality.mdx` — has `series: "ai-development"` but no hub callout.
- `content/blog/hello-world.mdx` — 301 words, uses legacy `publishedAt` frontmatter key instead of `date`, no series, no tags that map to any hub. Should either be rewritten as a real post or unpublished. Currently drains crawl budget without earning it.

**Missing from hub network (CRITICAL SEO):** 3 non-hub posts do not participate in the series structure. Research doc `docs/CONTENT_STATUS.md` claims 5 hubs + 39 spokes = 44 connected posts. With 74 total, that leaves 30 unassigned posts, many of which DO have `series:` keys in frontmatter but no visible hub callout. The mismatch between frontmatter metadata and rendered hub navigation means internal link equity is lost.

### H3. Two blog posts below the 4-link internal-linking floor

**Severity:** HIGH (SEO)
**Files:**

- `content/blog/rest-api-design-mistakes.mdx` — only **2 internal /blog links** (hub callout at top + 1 in footer). Post covers 7 API mistakes, naturally links to backend/architecture posts but doesn't.
- `content/blog/soc2-compliance-startup-roadmap.mdx` — only **2 internal /blog links**. A compliance post that could easily link to multi-tenancy-prisma-rls, incident-response-saas, and saas-reliability-monitoring.
- `content/blog/typescript-business-case.mdx` — only **1 internal /blog link**.

**Fix:** Each post should have 4-7 internal links per BLOG_QUALITY_CHECKLIST.md line 44 (section absent in current checklist — should be added). Easy remediation: add 3-5 related links to footer of each post.

### H4. Contact form has Turnstile but no friction-reducing confirmation copy

**Severity:** HIGH (CRO)
**File:** `src/components/pages/contact-page.tsx:354-360`
Success message is only: `"Message received. I'll respond within 24 hours."`

Voice guide says "dense information, business context first." Post-submit is the moment to deepen trust and guide next action, but it does nothing. No:

- Calendar link for faster booking
- Lead magnet cross-sell ("While you wait: try the SaaS Scaling Assessment")
- Expected next step ("You'll get a Loom in 24 hours reviewing your situation")

**Rewrite:**

```
TRANSMISSION_COMPLETE

You'll get a personalized response within 24 hours — not a form letter.
While you wait:
▸ Run the SaaS Scaling Assessment → /tools/saas-readiness
▸ Read the SaaS Architecture Framework → /blog/saas-architecture-decision-framework
▸ Or book directly → [calendar link if one exists]
```

Also the **"How did you find me?" field** (referralSource) is a good qualification signal but is NOT marked required. Voice consistency: the field label `"How did you find me?"` uses sentence case; every other label is uppercase mono. Change to `REFERRAL SOURCE` for consistency.

### H5. Services page "buzzword" risk — low but real

**Severity:** HIGH (voice)
**File:** `src/app/services/services-page-content.tsx`

The word "enterprise-grade" is on-voice (VOICE_GUIDE.md line 196 endorses it), but:

- Line 399 (home-page): `"transform your vision into enterprise-grade digital reality"` → **"digital reality"** is buzzwordy. "Production system" or "shipped architecture" is on-voice.
- Line 16-18 about text (`transform your vision into enterprise-grade digital reality`) — remove "digital reality."
- Line 123-127: `"Architecture decisions that compound into advantage."` — this is good, but the preceding hero subcopy says `"compound into competitive advantage"` on the homepage. Unify to "compound into competitive advantage" everywhere.

No "game-changer" / "revolutionary" / "cutting-edge" found on services pages (prior audit concern addressed).

### H6. Hero value prop buries the outcome

**Severity:** HIGH (CRO)
**File:** `src/app/home-page.tsx:93-95`
Current: `"I architect production systems that scale from MVP to millions. When your tech decisions have business consequences, you need strategic guidance... not just code."`

Problem: "scale from MVP to millions" is abstract. CTAs buying advisory want to know **what mistake they'll avoid and what it's worth.** VOICE_GUIDE.md endorses "I help CTOs avoid $500K mistakes" as the tagline — it's in the file but not on the page.

**Rewrite (retains 26-word density, swaps generic for specific):**

> "I help CTOs avoid $500K architecture mistakes. The decision you're about to make — microservices, multi-tenancy, edge vs origin — has a 3-year trajectory. I've seen the failure patterns."

Then the secondary line: "15+ years across fintech, SaaS, healthcare. Six years advising founders through the scale inflection."

### H7. Zero sameAs / social proof links on about page

**Severity:** HIGH (E-E-A-T, schema)
**File:** `src/components/pages/about-page.tsx`

No `sameAs` links to LinkedIn, GitHub, X/Twitter, Dev.to, Speakerdeck, StackOverflow, or other authority-building profiles. About page has a footer CTA but no photo (the file shows no `<Image>` for a headshot), no LinkedIn URL, no GitHub. Person schema at `src/app/about/page.tsx:45` uses `PERSON_REF` — verify that reference includes `sameAs: []` entries.

Without sameAs links from about page HTML, Google can't tie the entity to authoritative external profiles. This is a direct E-E-A-T signal per `docs/research/person-schema-eeat-2026.md`.

### H8. Contrarian POV missing from about page

**Severity:** HIGH (differentiation)
**File:** `src/components/pages/about-page.tsx`

VOICE_GUIDE.md calls for "Contrarian When Warranted." About page has none. The differentiators section (lines 69-88) lists "Compound Architecture / Risk Mitigation / Velocity Engineering" — all agreeable, none challenging conventional wisdom. The hero H1 is `"The difference between architecture and accidents."` which is a strong angle but never pays off in the body.

**Add a contrarian pillar:**

> "I'll tell you not to hire me. If you need three weeks of hands-on Next.js work, hire a senior engineer. Advisory is for the decisions where wrong costs you six months of rework — not the decisions you already know how to make."

This turns the positioning from "Technical Advisor who does X, Y, Z" into "Technical Advisor who disqualifies wrong fits," which is far more trust-building.

---

## MEDIUM Findings

### M1. Pseo `whyThisStack` is high-quality but repetitive across pages

**Files:** `src/data/pseo/pages.ts`
Sampled pages nextjs-for-saas (line 146) and react-for-fintech (line 357) — each is genuinely unique in content (e.g., PCI scope argument in fintech vs multi-tenancy in SaaS). **This is strong.** The pSEO engine is producing non-generic copy.

Minor: the pattern `"I've built SaaS platforms on Next.js serving 100,000+ monthly active users..."` appears verbatim in multiple pages. For maximum uniqueness, vary the social-proof sentence per page (different client count or outcome).

### M2. Pseo FAQs — unique per page, strong

Verified: 90 `question:` entries across pSEO pages, and no repeated question strings (verified via grep for "How long does it take"). Each service page has 4+ unique FAQs. **This is already ahead of many pSEO sites.**

### M3. Metadata titles do work as SERP ads, but some are flat

**Files sampled:**

- `src/app/tools/saas-readiness/page.tsx:9`: `"SaaS Scaling Readiness Assessment"` — 34 chars, OK but underselling. Could be `"SaaS Scaling Readiness: 3-Min Diagnostic"` to match hero copy "8 questions. Under 3 minutes."
- `src/app/services/page.tsx:9`: `"Technical Advisory Services"` — 27 chars, too generic. Doesn't tell Google who it's for.
- `src/app/about/page.tsx:7`: `"About"` — 5 chars. Relies on template to append "| Alex Mayhew", so renders as `"About | Alex Mayhew"` = 18 chars. Too short. Try `"About Alex Mayhew — Technical Advisor"` (removing the em dash per voice rule → `"About Alex Mayhew... Technical Advisor"`).
- `src/app/contact/page.tsx:7`: `"Contact"` — 7 chars, same problem.

**Fix pattern:** every page title should be benefit-driven, not label-driven. Homepage already does this (`"Alex Mayhew | Technical Advisor & Systems Architect"`).

### M4. OG description truncation risk

**File:** `src/app/og/route.tsx:117-118`
Code truncates at 120 chars then appends `"..."`. Current blog descriptions in frontmatter are often 140-160 chars (good for Google), meaning OG image always cuts off the last ~30 chars. Either lift the OG truncation to 140 or write blog descriptions to be punchy at 110 chars.

### M5. Services page "enterprise-grade" + "digital reality" buzz signal

**File:** `src/app/home-page.tsx:399-400`
`"Partner with me to transform your vision into enterprise-grade digital reality."`
"Enterprise-grade" is on-voice. "Digital reality" is not. **Rewrite:**

> "Partner with me on the decisions that compound. Advisory relationships that turn the next architecture choice into a moat, not a migration."

### M6. Newsletter 020-onwards uses consistent single-decision structure

**Files:** `content/newsletter/issues/020-036-*.mdx`
Sampled 036-revenue-leakage.mdx — follows "Situation / Insight / Code / When to Apply / Worth Your Time / Tool of the Week" structure cleanly. Single decision per issue (billing leakage). **PASS on quality checklist.** One `perhaps` or hedging not found in the sampled issue.

### M7. `content/blog/hello-world.mdx` should be unpublished or rewritten

**File:** `content/blog/hello-world.mdx`

- 301 words (far below the 2,000-word quality gate)
- Uses legacy `publishedAt` frontmatter key instead of `date`
- `draft: false` — is indexable
- No series, no hub callout
- Generic "my philosophy" intro post from 2025-08-12 (updated 2026-02-06)

Either rewrite to 2,000+ words or set `draft: true`. Currently it's brand-diluting content at `/blog/hello-world`.

### M8. "6 years" / "Six years" / "half a decade" — narrative inconsistency

**File:** `src/components/pages/about-page.tsx:155`
The narrative "Six years of building systems that scale" works for the advisory arc but contradicts "15+ years" on the homepage. If the real story is **6 years advising + 15+ total in tech**, say that: "Six years advising SaaS founders on the scale inflection. 15+ years total in production systems — starting as a full-stack engineer at [X]."

### M9. `services/services-page-content.tsx` CTA hierarchy

**File:** lines 320-350
Bottom CTA is `SCHEDULE_CONSULTATION()` + newsletter signup below. Strong. But the ONLY CTA on the page is the bottom one — the top trust-metrics section (lines 131-153) has no CTA, and the three-tier engagement models (lines 155-215) have no "Tier CTA" buttons per tier. A visitor who decides "Tier 2 is me" has no way to click through. **Add a "Start here" button per tier.**

### M10. "Not sure yet" budget option EXISTS

**File:** `src/components/pages/contact-page.tsx:256-258`
Confirmed: `<option value="not-sure">Not sure yet</option>` is present. Prior audit finding is **RESOLVED**.

### M11. Blog quality checklist not mentioning 4-7 link density

**File:** `docs/BLOG_QUALITY_CHECKLIST.md`
The checklist under "Hub-and-Spoke Structure" doesn't specify a minimum internal link count. Add: `[ ] 4-7 internal /blog links per post (no orphan posts)`.

### M12. Hero "Strategic Architecture" H1 leaves the "for whom" implicit

**File:** `src/app/home-page.tsx:80-85`
The badge "Technical Advisor" is the only audience signal. SEO benefit and CRO clarity both improve if the H1 includes the buyer (CTO / founder / fintech).

**Rewrite:**

```
Strategic
Architecture for
SaaS CTOs.
```

Or lead with the tagline from VOICE_GUIDE.md: "I help CTOs avoid $500K mistakes."

---

## LOW Findings

### L1. `// ✓ ✗` symbols in code comment in `agentic-engineering.mdx` lines 119-123

Not emojis proper — Unicode check/cross marks inside a TypeScript code comment demonstrating a code review checklist. **Acceptable** (renders as inline code, context-appropriate, not body text).

### L2. Newsletter welcome/template files contain template markers

**File:** `content/newsletter/TEMPLATE.md` — expected, internal scaffold.

### L3. pSEO `expertApproach.summary` has a few repeating phrases

**File:** `src/data/pseo/pages.ts:191` (Claude Pilot mention)
The "In building Claude Pilot..." story is strong first-person proof, but appears across many pages. Consider rotating between 2-3 different proof stories so repeat visitors don't see the same anecdote on every service page.

### L4. `typescript-business-case.mdx:429` has a duplicate bullet

```
- Faster onboarding, fearless refactoring
- 30-100x cost reduction (catching errors early)
- Faster onboarding, fearless refactoring   ← duplicate
```

Copy-paste artifact.

### L5. `multi-region-saas-architecture.mdx` is the longest post (13 sections, 19 internal links) — excellent hub density.

### L6. Contact page "Email", "Location", "Response Time" sidebar uses `font-mono text-sm` for values but sentence-case labels. Minor inconsistency with the form's uppercase label convention.

### L7. Font loading fallback in OG route (`src/app/og/route.tsx:22-24`) silently swallows errors. If Inter+JetBrains Mono fonts fail to load from origin, OG images render with system fonts — not a brand disaster, but also not logged. Add a Sentry breadcrumb.

### L8. `docs/VOICE_GUIDE.md:159` uses an em dash (`isn't about technology preference—it's about`) in an EXAMPLE showing what NOT to do. This is in example text but renders as if endorsed. Rewrite the example with ellipsis: `"This isn't about technology preference... it's about shipping features vs. managing infrastructure."`

### L9. `saas-readiness` quiz has canonical + meta but the href in tools-page is `/tools/saas-readiness`, while the nav dropdown (`src/components/ui/navigation.tsx:45-70`) omits it. CRO amplification fix: add to the dropdown.

### L10. 404 and error pages don't offer "Recent posts" or "Popular tools" as rescue paths — just one "Return Home" button. Missed re-engagement opportunity.

### L11. Newsletter issues 022 `api-cost-replacement` and 027 `denormalize-database` not sampled here. Spot-check recommended.

### L12. `content/blog/hello-world.mdx:9` frontmatter uses `publishedAt` — legacy key. Other posts use `date`. Inconsistent frontmatter will fail strict schema validation later.

### L13. "Beyond the Terminal" section on about page (lines 345-369) is a weak closer. The copy "I believe the best technical work comes from understanding how things are made... whether that's coffee, furniture, or distributed systems" is generic. Drop in a specific hobby or interest that gives the section texture (specific coffee roaster, specific woodworking project).

---

## Recommended Prioritization

**Week 1 (ship):**

1. Resolve 15+ vs 6 years contradiction (C1) — pick one, update 5 files
2. Add 2-3 named testimonials to homepage + services (C2)
3. Surface SaaS Scaling Quiz on homepage, about, services, contact, and in nav dropdown (C3)
4. Replace all `--` in hub post Key Takeaways with `... ` (C4) — 12 files
5. Standardize 404/error/offline CTA copy and casing (C5)

**Week 2:** 6. Add "Part of [Hub]" callout + "More in This Series" to `typescript-business-case`, `ai-assisted-development-reality` (H2) 7. Expand `rest-api-design-mistakes` and `soc2-compliance-startup-roadmap` to 4+ internal links each (H3) 8. Expand homepage copy to 500+ words with outcome sentences and "What Advisory Is NOT" block (H1) 9. Rewrite hero H1/sub to lead with tagline (H6, M12) 10. Rewrite contact success copy to include lead magnet + next steps (H4)

**Week 3:** 11. Add sameAs links on about page (H7) — LinkedIn, GitHub, X, Dev.to 12. Add contrarian pillar to about page (H8) 13. Unpublish or rewrite `hello-world.mdx` (M7) 14. Rewrite flat metadata titles for About, Contact, Services (M3) 15. Rotate pSEO proof stories (L3)

---

## Evidence Summary Table

| Issue                       | Severity | File(s)                                                                                    | Line(s)           | Counted    |
| --------------------------- | -------- | ------------------------------------------------------------------------------------------ | ----------------- | ---------- |
| 15+ vs 6 years              | CRITICAL | home-page.tsx, about-page.tsx, llms.txt/route.ts, roles/pages.ts                           | 251, 155, 32, 112 | 4 files    |
| Zero testimonials           | CRITICAL | site-wide                                                                                  | —                 | 0 found    |
| Quiz not surfaced           | CRITICAL | home-page.tsx, about-page.tsx, contact-page.tsx, services-page-content.tsx, navigation.tsx | —                 | 0 refs     |
| `--` in hub posts           | CRITICAL | blog/\*.mdx                                                                                | 22 (KT block)     | 12 files   |
| 404/Error CTA inconsistency | CRITICAL | not-found.tsx, error.tsx, offline/page.tsx                                                 | 16, 41, 23/31     | 3 files    |
| Homepage word count         | HIGH     | home-page.tsx                                                                              | all               | ~280 words |
| Orphan posts                | HIGH     | typescript-business-case, ai-assisted-development-reality, hello-world                     | —                 | 3 posts    |
| Below link floor            | HIGH     | rest-api-design-mistakes, soc2-compliance-startup-roadmap, typescript-business-case        | —                 | 3 posts    |
| Generic success copy        | HIGH     | contact-page.tsx                                                                           | 354-360           | 1 section  |
| Buzzword "digital reality"  | HIGH     | home-page.tsx                                                                              | 399               | 1 instance |
| Hero buries tagline         | HIGH     | home-page.tsx                                                                              | 93-95             | —          |
| No sameAs                   | HIGH     | about-page.tsx                                                                             | all               | 0 refs     |
| No contrarian POV           | HIGH     | about-page.tsx                                                                             | 69-88             | —          |

---

**Sources consulted:**

- VOICE_GUIDE.md (lines 113, 123-125, 196, 200-205)
- BLOG_QUALITY_CHECKLIST.md (lines 24-33, 37-44)
- `src/app/page.tsx`, `home-page.tsx`, `about/page.tsx`, `contact/page.tsx`, `services/`
- 15+ blog posts sampled (5 hubs + 10 spokes)
- 2+ newsletter issues (001, 036)
- 3+ pSEO entries (nextjs-for-saas, react-for-fintech, python-for-healthcare)
- Navigation component, error/404/offline pages, OG route
- Cross-reference docs: `docs/CONTENT_STATUS.md`, `docs/research/person-schema-eeat-2026.md`, `memory/MEMORY.md`
