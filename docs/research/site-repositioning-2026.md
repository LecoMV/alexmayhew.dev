# Site Repositioning Research (2026-08-17)

**Status:** CURRENT
**Session:** 3-agent research round (wf_ceb56aff-8a9) before rewriting alexmayhew.dev from consultant-positioning to dual-purpose (job-seeking now, consulting later). Full per-claim sources in the workflow journal.

## Key Findings

### Positioning (why the tone-down is quantified, not cosmetic)

- **The founder/consultant framing measurably suppresses callbacks.** Yale field experiment (2,800 SWE applications): non-founders 24% callback; successful-looking founders 10.9% (entry) / 6.3% (mid) — the MORE successful the framing, the worse. LBS: ~35% less likely to interview. Driver is flight-risk, not capability. "Technical Advisor, 15+ years, 30+ startups, Founder" + priced services = worst-case configuration for non-senior applications.
- **Unverifiable claims are offer-rescission class.** HireRight 2025: 75%+ of employers caught a discrepancy; 36% have withdrawn an offer over one; ~85% of hiring managers report rejecting on something found online. The site is the most trivially diffable artifact against a resume.
- **What converts on personal sites: technical writing + clickable artifacts** (HN corpus: blogs drove nearly all outcomes; polish secondary; stale/stub sections actively repel). The 73-post corpus is the site's #1 employment asset; the products page in its current state (offline product, unverified product, wrong PenQWEN specs) is the repellent "stale TODO" pattern.
- **"The entity is a disclosure; 'Founder' is an identity"** — keep Mayhew Technology LLC visible-but-small on /about and /resume; keep "Founder" out of H1/title/meta/JSON-LD jobTitle. Add one explicit commitment paragraph on /about (states why full-time now; LLC = legal continuity).
- Availability = one calm sentence under the hero, not a banner. Remove in one commit later.

### SEO transition mechanics

- **Changing Person jobTitle/description: no ranking penalty; the CURRENT inconsistency is the E-E-A-T liability** (cross-node disagreement is the documented trust-downgrade pattern). Keep the existing Person @id — never mint a new one.
- **Crawl budget is a non-issue** (<10k pages per Google's own doc); the constraint is link equity. Reject any "prune for crawl budget" reasoning.
- **Never bulk-noindex** (Google: noindex still costs the fetch; not a removal tool). If URLs ever go: 301 where equity exists, 410 for true zero-equity orphans. **This PR removes no URLs** — reframe in place; consolidation is a later GSC-impressions-driven pass.
- **One deploy, not a drip** — staggered changes = a month of fresh inconsistencies on a slow-recrawl domain.
- Blog author bios must change in the same deploy (stale consultant bio × 73 posts = 73 contradictions).
- **Leave GSC Settings → Search generative AI on Include** (opt-out is a publisher click-protection lever; this site needs surface area). Documented here so no future session flips it "for privacy."
- IndexNow: Google still unsupported (2026) — keep the CI step for Bing/Copilot-adjacent indexes (AI assistants ground on Bing-derived data; disproportionately useful mid-job-search).
- Recrawl reality: days-to-weeks; ~10-12/day URL Inspection budget → spend on /, /about, /resume, /services, top posts only, once each. Entity/KG effects: assume 3-6 months, no feedback loop at ~905 impressions/90d. Sitemap lastmod only for genuinely changed URLs.

### /resume page spec (verified against primary sources 2026-08-17)

- **ProfilePage → mainEntity → Person**: current Google pattern (doc updated 2025-12-10); valid for About-Me/employee-style pages, INVALID on homepages. No rich result — entity comprehension only. Reuse the existing PERSON_REF @id as mainEntity.
- **hasOccupation**: still valid (schema.org v30.0); express dates via Role wrappers (startDate/endDate + nested Occupation). NDA client → emit the Role with generic occupation, no employer — no unexplained gap.
- **PDF = derived artifact from the same data module as the HTML page** (drift is the hazard). Canonical via HTTP `Link: <https://alexmayhew.dev/resume>; rel="canonical"` header on the PDF (PDFs can't carry <link>); canonical preferred over noindex.
- **Cloudflare 2026-09-15 CORRECTION:** default Agent+Training block applies to NEW domains onboarding, and only on ad-carrying pages. This zone = existing + ad-free → not auto-affected. Action = verification: dashboard (Security → Settings → manage AI traffic) confirm Search+Agent allowed explicitly; screenshot to docs/; no public API documented. PLUS empirical smoke test: curl /resume with ChatGPT-User / Claude-User / PerplexityBot UAs asserting 200 + HTML body, added to the post-deploy smoke job (Workers+Static-Assets interaction is undocumented — prove it).
- **The realistic AI-fetch vector is a recruiter pasting the URL into ChatGPT/Claude** (Agent-class fetch, an inconsistency check by design). No evidence AI sourcing platforms crawl personal domains (they aggregate LinkedIn/GitHub/ATS). Consistency between site, /resume, PDF, and LinkedIn is therefore the primary deliverable; schema is secondary.
- Answer-first self-contained resume blocks: NOT vendor-verified — implement as good writing practice, not as a requirement.

## Decisions adopted (see plan doc)

Invert IA (evidence up, commerce down); purge unverifiable claims sitewide in one deploy incl. schema/ai.txt/llms*.txt/bios; role-neutral H1 + one availability line; /resume per spec above; products page truth pass (VoiceKeep honest dating, AudioKeep removed, PenQWEN specs corrected); services de-priced but live and indexable; no URL removals this PR; LLC visible-but-small; commitment paragraph on /about.

## Sources

Primary: Google ProfilePage doc, Google crawl-budget doc, Google canonicalization doc, schema.org v30.0, Cloudflare changelog 2026-07-01 + blog, Search Console generative-AI controls coverage (SEJ/TechCrunch/9to5), Yale SOM founder-callback field experiment, HireRight 2025 Global Benchmark, HN personal-site corpus (news.ycombinator.com/item?id=41656015). Full per-claim URL list: workflow `wf_ceb56aff-8a9` journal.
