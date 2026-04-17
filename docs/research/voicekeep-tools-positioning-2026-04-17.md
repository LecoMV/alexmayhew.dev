# VoiceKeep / Voice Cloner Cross-Domain Positioning Research (2026-04-17)

**Status:** CURRENT
**Session:** Deciding whether `/tools/voice-cloner` on alexmayhew.dev duplicates the voicekeep.io product entity, and how to consolidate the schema graph across two domains.

## Schema

### Current emission inventory (as of 2026-04-17)

1. `/tools/voice-cloner` emits a standalone **SoftwareApplication** (no `@id`, no `sameAs`) via `SoftwareJsonLd`:
   - `name: "Voice Cloner"`, `url: https://alexmayhew.dev/tools/voice-cloner`, `applicationCategory: MultimediaApplication`, `offers.price=0`, `author: #person`, `publisher: #organization`.
2. `/work/voice-cloner` emits a **TechArticle** about the case study plus a nested `about: { @type: SoftwareApplication, name: "VoiceKeep" }` via `CaseStudyJsonLd` (no `@id`, no `url`, no `sameAs`).
3. `src/data/projects.ts` has `link: "https://voicekeep.io"` for the case-study project but the tools page hard-codes CTAs to `https://voicecloner.alexmayhew.dev`. Two public entry points point at what is in fact one product.
4. voicekeep.io (separate Next.js deploy) is assumed to emit its own `SoftwareApplication` with `name: "VoiceKeep"`, `url: https://voicekeep.io`.

### Findings

**1. Yes, this is a duplicate-entity problem.** Three SoftwareApplication nodes (`Voice Cloner` on /tools, `VoiceKeep` on /work, `VoiceKeep` on voicekeep.io) with different names, different URLs, and no `@id`/`sameAs` cross-reference. Google's entity reconciliation uses `@id`, `url`, and `sameAs` as the primary join keys; with none of those linking the three, it treats them as three distinct apps. This dilutes entity signal — reviews, ratings, install counts, and EEAT earned on voicekeep.io cannot flow to the portfolio mentions, and the portfolio mentions compete for the "VoiceKeep" query rather than supporting it.

**2. Product entity should live on voicekeep.io only.** 2026 best practice for "product lives on marketing domain, portfolio describes it": the marketing domain owns the canonical `SoftwareApplication` with a stable `@id` (e.g. `https://voicekeep.io/#software`). The portfolio describes the work using **CreativeWork/TechArticle** (the case study is an article _about_ the product, not the product itself) and references the product via `about: { @id: "https://voicekeep.io/#software" }` plus `sameAs: ["https://voicekeep.io"]`. Do not re-declare `SoftwareApplication` properties on the portfolio — let Google dereference the `@id`.

**3. Deleting `/tools/voice-cloner` is the correct call.** The page is a marketing clone of voicekeep.io on the wrong domain. Keeping it creates the duplicate SoftwareApplication and splits PageRank between two marketing pages for the same product. The `/work/voice-cloner` case study already covers the portfolio narrative.

**4. 301 redirect is sufficient — no interim schema needed.** A 301 from `/tools/voice-cloner` to `https://voicekeep.io` transfers link equity and drops the duplicate entity. Google does not parse JSON-LD on 3xx responses. Add the redirect in `next.config.js` or Cloudflare Worker rules. Do not render a body with canonical meta — 301 with empty body is cleaner.

### Recommendations

**P0 — Delete `/tools/voice-cloner` and 301 to voicekeep.io.** Removes the duplicate SoftwareApplication entity and consolidates external link equity. Update `src/data/projects.ts` so nothing else links to `/tools/voice-cloner`. Keep `link: "https://voicekeep.io"` on the project record.

**P0 — Update `CaseStudyJsonLd` to stop declaring a SoftwareApplication.** Replace the inline `about: { @type: SoftwareApplication, name: project.title }` with `about: { @id: "https://voicekeep.io/#software" }` when the project has an external product URL, and add `sameAs: ["https://voicekeep.io"]` at the TechArticle level. Portfolio describes, it does not re-declare.

**P1 — Ensure voicekeep.io emits a canonical SoftwareApplication with `@id: https://voicekeep.io/#software`.** Without a stable `@id` on the marketing domain, the portfolio's `about` reference has nothing to resolve to. This is a voicekeep.io repo change, out of scope for this site, but must be tracked.

**P2 — Audit all other `/tools/*` case-study-shadow pages** (`/tools/traceforge` etc.) for the same pattern: if the tool has its own marketing domain, delete the `/tools` mirror; if it lives only on alexmayhew.dev, keep the SoftwareApplication there and drop any redundant `about` in the case study.

### Sources consulted

- Google Search Central: Software app (SoftwareApplication) structured data guidelines (2025+)
- schema.org/SoftwareApplication and schema.org/CreativeWork about property semantics
- Internal research doc: `docs/research/schema-markup-seo-2026.md` (entity @id consolidation pattern)

## CRO

### Ranking: B > A > C (with tension flagged against Schema's recommendation)

**Schema agent above recommends A (delete + 301).** From CRO's lens, B (teaser page) is a better fit for Alex's positioning. The tension is resolvable: B can achieve the same entity-consolidation outcome if executed correctly. See "Reconciling with Schema" below.

#### Why B over A (CRO rationale)

Alex isn't a SaaS operator trying to convert alexmayhew.dev traffic into voicekeep.io signups. He's a Technical Advisor whose VoiceKeep work is **evidence**, not inventory. The conversion path that matters isn't "visitor → voicekeep.io signup" ... it's "visitor → reads case study → sees specific engineering decisions (worker recycling every 500 generations, 4-tier Redis priority queue, chapter-as-conversation pattern) → books advisory call."

Option A severs that narrative arc for users who arrive at `/tools` from blog or nav. With ~758 impressions / 2 clicks over 30d, the page isn't a conversion engine ... it's a trust anchor. A bare 301 strips context for the 99.7% of visitors who don't click through to voicekeep.io.

The `/work/voice-cloner` case study in `src/data/projects.ts` already carries the technical narrative at depth (5 challenges, 4 tech decisions, 99.95% uptime, 0.03% error rate). A teaser keeps `/tools` coherent as a list while routing conversion intent to voicekeep.io.

#### Why B over C

The current 440-line marketing page duplicates voicekeep.io's positioning (9-feature grid, specs table, audiobook section) and violates Alex's "Technical Advisor, not SaaS operator" frame. Every feature card reads like a product team wrote it. Option C keeps all the duplicate-entity risk Schema flagged in exchange for marginal funnel gain.

#### Reconciling with Schema's Option A recommendation

Schema's core concerns (duplicate SoftwareApplication, split PageRank, entity reconciliation) are addressed under B if the teaser page:

1. **Drops `SoftwareJsonLd` entirely.** No SoftwareApplication emission on the teaser — it's a CreativeWork/informational page, not a product page. This removes the duplicate entity Schema flagged.
2. **Sets `alternates.canonical: "https://voicekeep.io/"`** (cross-domain canonical). Tells Google the product entity lives at voicekeep.io; the teaser is a descriptive reference, not a competitor.
3. **Keeps the page thin (≤120 words)** so there's nothing for Google to interpret as a duplicate marketing page.

Net result: no duplicate SoftwareApplication, no competing canonical, but the internal narrative node survives. Schema's entity-consolidation goal is met without losing the CRO trust-anchor benefit.

### Draft teaser copy (98 words)

```
# VoiceKeep

I built VoiceKeep to solve a real problem in AI voice production: existing TTS platforms
handle single-voice generation but offer nothing for multi-character audiobook workflows.

It runs Qwen3-TTS 1.7B on a dedicated RTX PRO 6000 Blackwell server. 12s P50 latency,
99.95% uptime, 0.03% error rate. Single-voice TTS, multi-speaker conversations, and full
manuscript-to-M4B audiobook production ... all through one inference pipeline.

→ Try VoiceKeep at voicekeep.io
→ Read the engineering story: /work/voice-cloner
← Back to tools
```

Three links, one outcome-focused intro, zero duplicate feature cards. Under 100 words gives the page weight without competing with the product site.

### CTA microcopy

**Dropdown / hub card CTA:** `Built VoiceKeep` (past tense signals "this is evidence of what I do", not "sign up here"). Hub card description: "Production AI voice platform. 99.95% uptime on a single GPU. The engineering story."

**On-page outbound CTA:** `Try VoiceKeep at voicekeep.io →` (explicit destination ... no misdirection about where the user is going).

**Case study link:** `Read the engineering story →` (maps to the Technical Advisor frame, not the product frame).

### Nav label recommendation

**Use "VoiceKeep"** in the dropdown, not "Voice Cloner". Reasons:

1. Matches the production brand the user will actually use.
2. "Voice Cloner" is a feature; "VoiceKeep" is the product ... using the product name signals Alex ships named things, not demos.
3. Aligns with how `src/data/projects.ts` already refers to it (`title: "VoiceKeep"`).
4. Removes confusion with the `voicecloner.alexmayhew.dev` dev URL still hardcoded in the current page (lines 280, 429).

### Edge cases B must handle

- **Canonical:** cross-domain to `https://voicekeep.io/`. Verify Google accepts cross-domain canonicals for this case (yes ... documented pattern for product-on-separate-domain).
- **Schema:** strip `SoftwareJsonLd`. Keep `BreadcrumbList` only. Aligns with Schema agent's P0.
- **Outbound link:** UTM tag (`?utm_source=alexmayhew.dev&utm_medium=tools&utm_campaign=voicekeep_teaser`) so GA4 attribution survives the domain hop.
- **Hardcoded URL cleanup:** current page references `voicecloner.alexmayhew.dev` in two `<a href>` blocks. Both must point to `voicekeep.io` on the teaser.
- **Sitemap:** keep `/tools/voice-cloner` in sitemap as a thin CreativeWork node. Drop if GSC flags it as thin content post-launch.

### If the user sides with Schema (Option A)

If delete + 301 wins on schema grounds, the CRO mitigation is:

1. Update the `/tools` hub card for Voice Cloner to **link directly to `/work/voice-cloner`** (the case study), not to `voicekeep.io`. The case study becomes the trust anchor.
2. Add a prominent "Try VoiceKeep →" CTA inside the case study hero, with UTM tracking.
3. Rename the tools hub card from "Voice Cloner" to "VoiceKeep" with badge "Case Study" (not "Live").

This preserves the narrative path at the cost of one extra click from /tools to voicekeep.io.

## Analytics

### Current state (verified in code)

- `G-K4TLSRKMCV` config in `src/components/analytics/google-analytics.tsx:39-42` declares `linker.domains: ['shop.alexmayhew.dev']` with `accept_incoming: true`. **voicekeep.io is NOT in the linker list** — no `_gl` client-ID propagation today.
- Footer (`src/components/ui/footer.tsx:29-35`) and About (`src/components/pages/about-page.tsx:119`) decorate outbound links with `utm_source=alexmayhew.dev&utm_medium=<medium>&utm_campaign=footer|about`. No other outbound points do.
- `SocialLink` (`src/components/ui/social-link.tsx`) is the canonical outbound pattern: `target="_blank"` + `onClick` fires `trackSocialClick(network, { location, url })`. `_blank` keeps the source tab alive so the beacon completes reliably — no sequencing/wait required.
- No generic `outbound_click` or `voicekeep_click` helper yet. `trackCTAClick`, `trackEvent`, `trackContentEvent` already exist.
- `src/data/projects.ts:467` has a bare `https://voicekeep.io` link with no UTM, no event — attribution currently invisible from this placement.

### Decision 1 — Cross-domain GA4 linker: P2, not the right tool

GA4 cross-domain linking requires **the same measurement ID (or same property) on both domains**. Sharing `G-K4TLSRKMCV` between alexmayhew.dev (portfolio/content) and voicekeep.io (SaaS product with distinct funnel, pricing, audience) pollutes both: bounce rate, conversions, content groups, audiences all merge. voicekeep.io almost certainly has no GA4 today (fresh install required either way).

**Recommended architecture:** keep properties separate. Install a **dedicated new GA4 property on voicekeep.io** (new measurement ID). Bridge attribution with UTMs + an outbound click event on alexmayhew.dev. Adding `voicekeep.io` to `linker.domains` is low-cost and harmless — defer until both properties actually need client-ID continuity. If a unified view is ever needed, use a **roll-up property** (360) or join in BigQuery — do not force one property to serve two products.

### Decision 2 — UTM taxonomy: P0

Every outbound voicekeep.io link (tools card, `/work/voice-cloner`, `projects.ts`, blog CTAs, teaser page under CRO Option B) MUST carry UTMs. Standard:

| Param          | Value                  | Notes                                                                                             |
| -------------- | ---------------------- | ------------------------------------------------------------------------------------------------- |
| `utm_source`   | `alexmayhew.dev`       | Canonical single source                                                                           |
| `utm_medium`   | `referral`             | GA4 maps to Referral channel group                                                                |
| `utm_campaign` | `voicekeep_crosspromo` | Stable identifier across placements                                                               |
| `utm_content`  | `<placement-slug>`     | `tools-card`, `tools-teaser`, `work-case-study`, `projects-link`, `blog-inline`, `tools-redirect` |
| `utm_term`     | —                      | Omit (not paid)                                                                                   |

Centralize in a `withVoicekeepUtm(placement: string)` helper (mirrors existing `withUtm` in footer). Only `utm_content` varies — prevents taxonomy drift.

If Schema's Option A ships (301 `/tools/voice-cloner` → voicekeep.io), the redirect target URL itself MUST include these UTMs so typed-URL and legacy-backlink traffic still gets attributed. Prefer Cloudflare Worker rule appending `utm_content=tools-redirect`.

### Decision 3 — `voicekeep_click` event: P0

Fire a dedicated custom event on click — do **not** rely on voicekeep.io's GA4 alone (gives per-placement CTR without a cross-property join). Shape:

```
voicekeep_click {
  event_category: 'outbound',
  source_component: 'tools-card' | 'tools-teaser' | 'work-case-study' | 'projects-link' | 'blog-inline',
  source_url: window.location.pathname,
  destination: 'voicekeep.io',
  utm_content: <same slug as the link>
}
```

Register `source_component` and `utm_content` as custom dimensions in GA4 Admin. Mark `voicekeep_click` as a **conversion** — it is a soft conversion from alexmayhew.dev, independent of downstream voicekeep.io signup tracking. No sequencing required: `target="_blank"` + `rel="noopener noreferrer"` keeps the source tab alive so `gtag` beacon completes reliably.

Ship a `VoicekeepLink` component cloning `SocialLink`'s pattern (`onClick` handler, not a link interceptor) — works on mouse click, keyboard Enter, and middle-click.

### Decision 4 — Referrer chain preservation: P1

With two separate GA4 properties, the chain splits cleanly:

- **alexmayhew.dev side:** standard GA4 session model keeps source/medium sticky across page views. `voicekeep_click.source_url` records last-touch internal page so `/blog/post → /tools → voicekeep_click` is reconstructible from the event sequence.
- **voicekeep.io side:** landing page sees `referrer=alexmayhew.dev` + UTMs → session source becomes `alexmayhew.dev / referral / voicekeep_crosspromo / <placement>`. Any downstream signup/paid conversion attaches to that session.

Upstream chain lives on alexmayhew.dev; downstream chain lives on voicekeep.io. Join by `utm_content` + timestamp if ever required. Two clean attributions beat one muddy cross-domain session.

### Recommendations

- **P0** Ship `withVoicekeepUtm(placement)` helper + `VoicekeepLink` component that fires `voicekeep_click` on activation. Apply to every outbound voicekeep.io link: tools card/teaser, `/work/voice-cloner`, `projects.ts`, blog CTAs. Register custom dimensions. Mark `voicekeep_click` as a conversion in GA4.
- **P0** Install GA4 as a fresh property on voicekeep.io so downstream signup/paid conversions land with clean attribution.
- **P0** If Schema's Option A (301) ships, the redirect target URL must include the full UTM set + `utm_content=tools-redirect`.
- **P1** Add `voicekeep.io` to `linker.domains` opportunistically — zero runtime cost, unlocks future shared-audience experiments.
- **P2** Revisit unified reporting (roll-up property or BigQuery join) only after 90 days of data prove it is needed.

### Sources consulted

- Google Analytics 4 cross-domain measurement: https://support.google.com/analytics/answer/10071811 (same property requirement)
- GA4 consent + UTM precedence rules (UTMs override Referrer)
- Internal: `docs/research/ga4-consent-mode-v2-implementation-2026.md`
- In-repo patterns: `src/components/ui/footer.tsx` (UTM helper), `src/components/ui/social-link.tsx` (event pattern)

## SEO

### Evidence (GSC API, property `sc-domain:alexmayhew.dev`, queried 2026-04-17)

| Signal                                                                                     | Value                                                               |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| URL Inspection `coverageState` for `/tools/voice-cloner`                                   | **Discovered – currently not indexed**                              |
| Impressions (2026-01-17 → 2026-04-16)                                                      | **0**                                                               |
| Clicks (same window)                                                                       | **0**                                                               |
| Queries containing "voice" / "cloner" / "audiobook" / "voicekeep" anywhere on the property | **0 rows**                                                          |
| Referring URLs Google knows about                                                          | `/services`, `/newsletter/020-billing-architecture` (internal only) |
| External backlinks GSC reports                                                             | none                                                                |
| Sitemap inclusion                                                                          | yes, priority 0.7 (`src/app/sitemap.ts:89-94`)                      |

Interpretation: Google crawled it, declined to index it, and it holds **zero ranking equity** after ~90 days of sitemap exposure. There is nothing to preserve. `voicekeep.io` returns HTTP 200 with production Clerk/Sentry/CSP stack — destination is ready.

Note: the CRO section cites "~758 impressions / 2 clicks over 30d" for this URL. GSC shows zero over 90 days. That figure likely came from Cloudflare Web Analytics or GA4, not Google Search. From a Google indexing / ranking standpoint, the page is invisible.

### Decision 1 — Keep, 301, noindex, or delete?

**Recommendation: P0 — 301 redirect `/tools/voice-cloner` → `https://voicekeep.io/` and delete the route file.** This is Schema's Option A. I agree with it and disagree with CRO's Option B for the reasons below.

- **No SEO equity to lose.** `Discovered – not indexed` + 0 impressions = a 301 costs nothing measurable.
- **Cross-domain `rel=canonical` is a hint, not a directive.** Google documents this explicitly and routinely ignores cross-domain canonicals across different brand names (Mueller, Search Central). CRO's Option B depends on Google honoring that canonical — fragile when the brands differ (alexmayhew.dev vs VoiceKeep).
- **Deleting the route removes the misleading `SoftwareJsonLd`** (`page.tsx:220-236`) that currently declares the product's `url` is `/tools/voice-cloner`. This resolves Schema's duplicate-entity finding at its source, rather than patching around it.
- **`noindex`** keeps stale schema crawlable and wastes the URL. **404/410** breaks the one newsletter backlink and passes no equity.

**Adopt CRO's fallback for narrative preservation:** point the Tools dropdown and hub card at `/work/voice-cloner` (the existing case study), not at `voicekeep.io` directly. The case study becomes the trust anchor, the 301 handles any legacy traffic to `/tools/voice-cloner`, and the duplicate-entity problem disappears. This is the only configuration where Schema's entity goal, CRO's narrative goal, and Analytics' attribution goal all converge.

### Decision 2 — Sitemap, search index, llms.txt, internal links

- **Sitemap** (`src/app/sitemap.ts:89-94`): **remove** the entry. Sitemap URLs that 301 produce GSC warnings.
- **Command palette search index** (`src/data/search-index.ts:141-146`): **remove** the "Voice Cloner" entry. Optionally add a new Tool entry with `href: "https://voicekeep.io"` + external-link affordance (P2 — requires small render change in the palette).
- **`llms.txt`** (`src/app/llms.txt/route.ts`): no change required — it does not currently list `/tools/voice-cloner`. P2: add voicekeep.io under Tools so AI assistants discover it.
- **Tools hub card** (`src/components/pages/tools-page.tsx:35-46`): repoint to `/work/voice-cloner`, label "VoiceKeep", badge "Case Study". Per CRO's fallback plan.
- **Nav dropdown** (`src/components/ui/navigation.tsx:52-60`): same — `/work/voice-cloner`, label "VoiceKeep".
- **Newsletter 020** (`/newsletter/020-billing-architecture`): rewrite link body to `/work/voice-cloner` so the 301 is not doing permanent work on a persistent internal link.
- **Outbound-to-voicekeep.io CTAs** (on the case study, per Analytics P0): must carry the UTM + `voicekeep_click` event Analytics specified. SEO-neutral, attribution-critical.

### Decision 3 — Dwell/engagement risk from outbound link

**Net positive, and the CRO fallback makes it better.**

- **Ranking signals:** Google's engagement weighting rewards _long clicks from SERP_. With the case study as the intermediate node, users dwell on alexmayhew.dev before the exit — strengthens engagement metrics for alexmayhew.dev, not weakens them.
- **Link equity:** The case study already links to `voicekeep.io` via `src/data/projects.ts:467`. That dofollow passes PageRank outward — the goal, because voicekeep.io is Alex's product with its own near-zero authority problem.
- **GA4 exit:** fires from `/work/voice-cloner`, not `/tools`. Keeps `/tools` bounce metrics clean.

### Prioritized Actions

**P0 — this week**

1. Server-level 301: `/tools/voice-cloner` → `https://voicekeep.io/?utm_source=alexmayhew.dev&utm_medium=referral&utm_campaign=voicekeep_crosspromo&utm_content=tools-redirect` (permanent; UTMs per Analytics section).
2. Delete `src/app/tools/voice-cloner/page.tsx` (removes the stale `SoftwareJsonLd` — resolves Schema's duplicate-entity finding).
3. Remove the sitemap entry at `src/app/sitemap.ts:89-94`.

**P1 — within 2 weeks** 4. Update nav (`navigation.tsx:54`) and tools hub card (`tools-page.tsx:40`) to point at `/work/voice-cloner`, label "VoiceKeep", badge "Case Study". 5. Verify `/work/voice-cloner` has a prominent outbound CTA to `https://voicekeep.io` using the Analytics section's `VoicekeepLink` + UTM. Add if missing. 6. Rewrite the `/newsletter/020-billing-architecture` link body to `/work/voice-cloner`. 7. Remove/replace the Voice Cloner entry in `src/data/search-index.ts:141-146`.

**P2 — nice-to-have** 8. Add voicekeep.io to the Tools section of `llms.txt`. 9. Add `sameAs: ["https://voicekeep.io"]` to the Person schema on `/about` — helps Google consolidate cross-domain identity (complements Schema's `@id` plan).

### Sources

- GSC URL Inspection API + Search Analytics API, executed 2026-04-17 against `sc-domain:alexmayhew.dev`.
- Google Search Central: "Consolidating duplicate URLs" — 301 is the strongest move signal; cross-domain canonical is a hint.
- Project memory: near-zero domain authority, zero external backlinks — redirect risk is negligible.
- Schema section (above) for the entity-consolidation argument this SEO section depends on.
- CRO section (above) for the case-study-as-trust-anchor fallback that this section adopts.
- Analytics section (above) for the UTM string appended to the 301 target.
