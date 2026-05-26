# Kit (ConvertKit) vs Beehiiv: Newsletter Platform Comparison (2026)

**Status:** CURRENT
**Date:** 2026-05-26
**Context:** Platform decision for "The Architect's Brief" — a technical newsletter targeting CTOs and startup founders. Current state: Beehiiv free plan, 1 subscriber, zero posts sent, working API integration (`src/app/actions/newsletter.ts`). Also has Kit set up on The Unsexy Stack with sequences working.

---

## TL;DR Verdict

**Stay on Beehiiv for now. Migrate to Kit Creator ($33/mo) when automations become load-bearing (e.g., stagefit onboarding sequence post-quiz).**

Rationale:
- Beehiiv free tier (2,500 subs) beats Kit free tier on API custom fields: Kit free = 1 sequence, 1 automation; Beehiiv free = full subscriber + custom field API, no send or automation API.
- Kit wins decisively on automation API depth, broadcast API (full CRUD via API), and sequences.
- Beehiiv's Send API (create/send posts programmatically) is Enterprise-only — so if you want to programmatically publish issues from a CMS or pipeline, Kit is the only option at non-enterprise pricing.
- At 0–2,500 subscribers: Beehiiv is free, Kit Newsletter is free (up to 10k). Neither costs money yet.
- The migration from Beehiiv → Kit is a single-file change to `src/app/actions/newsletter.ts` — low friction.

---

## 1. API Capabilities Comparison

### Kit API v4 (api.kit.com/v4/)

**Broadcasts (newsletters/posts):**
- Full CRUD via API: create, get, update, delete, list, schedule, send
- POST to `/v4/broadcasts` to create a draft; PUT with `published_at` to schedule; publish immediately by setting `status: "confirmed"` without `scheduled_at`
- Full HTML body support; segmentation targeting per broadcast
- Stats endpoints: open rates, link clicks, per-broadcast analytics
- Rate limit: 120 requests / 60 seconds

**Sequences (drip campaigns / onboarding):**
- Full CRUD on sequences and individual sequence emails via API
- Add subscriber to sequence by email address: `POST /v4/sequences/{id}/subscribers`
- Remove, list subscribers in sequence — all via API
- No dashboard visit required for any sequence management

**Subscribers:**
- Create, update, get, delete, list
- `POST /v4/subscribers` creates or updates by email
- Query by email: `/v4/subscribers?email_address=<email>`
- Cursor-based pagination (not offset)

**Custom Fields:**
- 140-field limit per account
- Create, list, update label, delete, bulk-create, bulk-update subscriber field values
- All available on Creator plan and above (free Newsletter plan can set fields on subscribers but sequences are limited to 1)
- Fields are key-value on subscriber records; used in email personalization via `{{ subscriber.fields.field_name }}`

**Tags:**
- Create, delete, list, apply/remove per subscriber via API
- Bulk create tags
- Tags can gate automation paths

**Webhooks/Automations:**
- Outbound webhooks: create, delete, list via API
- Event types: subscriber activate, unsubscribe, bounce, complaint, form subscribe, sequence subscribe
- Automations themselves are created/managed via dashboard (visual builder); not constructable via API
- API can enroll subscribers into automations that exist in dashboard

**Bottom line for Kit:** Full broadcast lifecycle via API. Full sequence management via API. Custom fields via API. The gap vs. Beehiiv: automation graphs themselves are dashboard-only, but enrollment via API works.

---

### Beehiiv API v2 (api.beehiiv.com/v2/)

**Posts/Broadcasts (create and send):**
- `POST /v2/publications/{id}/posts` — create a post with blocks or raw HTML
- Supports scheduling via `scheduled_at`
- **BLOCKED: requires Enterprise plan (Send API, currently in beta)**
- Standard/Scale/Max plans: posts can only be created and sent from the dashboard
- The regular posts API (`posts:write` scope) is Enterprise-gated

**Automations:**
- List automations: read-only, returns name/status/trigger type
- **Enroll subscriber into automation: YES** — `POST /v2/publications/{id}/automations/{automation_id}/journeys`
  - Requires automation to have "Add by API" trigger configured
  - Works with `email` or `subscription_id`
  - Also works at subscription-create time via `automation_ids` param
- Create/modify automation workflows: dashboard-only (no API for building automation graphs)
- **Automations are a paid feature (Scale plan, $43/mo+)** — not available on free Launch plan (except 1 welcome email)

**Subscribers (Subscriptions):**
- Full CRUD: create, get, update, delete, list
- `POST /v2/publications/{id}/subscriptions` — the current integration endpoint
- Custom fields on create: pass `custom_fields: [{name, value}]` array
- Expand with `?expand[]=custom_fields` to retrieve fields on GET
- UTM tracking, referral codes, tier (free/premium) all on create

**Custom Fields:**
- Full CRUD: create, get, list, update, delete per field definition
- Data types: Text, Number, True/False, Date, Date & Time
- Set on subscription via `custom_fields` array at create time or via PATCH
- Fields must be pre-created in publication before setting values (creation via API works)
- No field count cap documented

**Webhooks:**
- Standard webhook support for subscription events
- Dashboard-configured

**Bottom line for Beehiiv:** Subscriber management and custom fields via API are solid and match current integration. Automation enrollment via API is available (Scale plan). Post creation/sending via API requires Enterprise. The API is narrower than Kit's for programmatic newsletter sending.

---

## 2. Pricing Comparison

### At 0–1,000 Subscribers

| Plan | Beehiiv | Kit |
|------|---------|-----|
| Free tier limit | 2,500 subscribers | 10,000 subscribers |
| Free tier price | $0 | $0 |
| Free tier automations | 1 welcome email only | 1 visual automation + 1 sequence |
| Free tier API | Subscriptions + custom fields (no Send API) | Broadcasts + sequences + custom fields (limited automations) |
| First paid tier | Scale: $43/mo (or $517/yr) | Creator: $33/mo (or $390/yr) |

**Winner at 0–1,000 subs: Tie** — both are free, but Kit's free tier includes more automation capability and full broadcast API.

### At 5,000 Subscribers

| Plan | Beehiiv | Kit |
|------|---------|-----|
| Cost (monthly) | $43/mo (Scale, covers up to 5K) | $89/mo (Creator, 5K tier) |
| Cost (annual) | ~$517/yr | ~$890/yr (~$74/mo) |

**Winner at 5K: Beehiiv** — roughly half the cost. $43 vs $89/mo is significant.

### At 10,000 Subscribers

| Plan | Beehiiv | Kit |
|------|---------|-----|
| Cost (monthly) | ~$96/mo (Max) or remains $43 (Scale) | ~$135/mo (Creator post–Sept 2025 35% increase) |
| Revenue cut | 0% on paid subscriptions | 0.6% transaction fee |
| Sponsor network | Available (0% cut) | Requires 10K+, weekly sends, exclusivity, Kit takes 23.5% |

**Winner at 10K: Beehiiv** — cheaper on Scale ($43), 0% take rate vs Kit's 0.6% + sponsor cut structure.

### Kit Pricing Note
Kit raised prices ~35% in September 2025. The Creator plan is now $33/mo (1K subs), $59/mo (3K), $89/mo (5K), ~$135/mo (10K). The free Newsletter plan covers up to 10K subscribers with unlimited broadcasts but only 1 automation and 1 sequence — useful for purely broadcast-based newsletters.

### Beehiiv Pricing Note
The free Launch plan covers 2,500 subscribers with no automations (except single welcome email) and no Send API. Paid Scale plan ($43/mo) unlocks automations, ad network, surveys, polls, team seats, human support.

---

## 3. Email Sequences / Automations

### Kit

**Visual Automations:**
- Drag-and-drop workflow builder
- Triggers: form subscribe, tag added, tag removed, product purchase, link click, custom event, API enrollment
- Conditions: subscriber tags, custom fields, purchase history, engagement metrics, date/time
- Actions: send email, add/remove tag, add to sequence, delay, move to branch
- Unlimited paths and steps
- **Available on free plan: 1 automation only**
- **Creator ($33/mo+): unlimited automations**

**Sequences:**
- Time-delayed email series (day 1, day 3, day 7, etc.)
- Each email in sequence is individually schedulable
- Full CRUD on sequences and sequence emails via API
- Add subscriber via API: `POST /v4/sequences/{id}/subscribers`
- **Free plan: 1 sequence only**
- **Creator+: unlimited sequences**

**API access to automations:** Subscriber enrollment via API. Automation construction requires dashboard.

### Beehiiv

**Automation Workflows:**
- Visual workflow builder (dashboard-only for construction)
- Triggers: subscription created, custom event, Add by API, segment membership, date-based
- Conditions and branches available
- Up to 3 triggers per automation
- Unlimited steps in a workflow
- **Available on Scale plan ($43/mo+) only** — free plan gets only 1 welcome email

**Sequences:**
- No standalone "sequence" concept — sequences are implemented as automation workflows with time-delay steps
- Functionally equivalent to Kit sequences but constructed in the automation builder

**API access to automations:**
- Enroll subscriber: `POST /v2/publications/{id}/automations/{id}/journeys` (Scale+ plan)
- Also via `automation_ids` param on subscription create
- Read-only list/get for automation metadata
- Cannot create or modify automations via API

**For the stagefit quiz flow specifically:**
Kit is better. After quiz completion, you need to:
1. Create/update subscriber with stagefit custom fields
2. Add subscriber to the appropriate onboarding sequence (based on zone/persona)

Kit: `POST /v4/subscribers` (create with fields) + `POST /v4/sequences/{zone_sequence_id}/subscribers` — two API calls, no dashboard visit needed.

Beehiiv: `POST /subscriptions` (create with custom_fields + automation_ids) — one API call, but requires automations to exist with "Add by API" trigger, and only on Scale plan.

---

## 4. Custom Fields / Tagging

### Kit Custom Fields

- 140 fields maximum per account
- Types: text, integer, boolean, date, datetime (flexible)
- API: full CRUD — create field definitions, bulk update subscriber values
- Endpoint: `POST /v4/subscribers` with `fields: {field_name: value}` in body
- Personalization in emails: `{{ subscriber.fields.stagefit_zone }}` merge tags
- Conditional content in automations: branch on field values
- Segmentation: create segments based on field values for broadcast targeting

**For the stagefit schema:**
`stagefit_zone`, `stagefit_severity`, `stagefit_delta`, `velocity_drag_band`, `reversibility_risk_count`, `top_misaligned_1`, `top_misaligned_2`, `top_misaligned_3`, `persona`, `customer_type`, `revenue_stage`, `trigger_event` — all 12 fields easily fit in Kit's 140-field limit. Setting all 12 in one subscriber upsert works.

### Beehiiv Custom Fields

- No documented field count cap
- Types: Text, Number, True/False, Date, Date & Time
- API: full CRUD on field definitions; set values on subscription create or via PATCH
- Fields must exist in publication before setting (can create via API)
- Personalization: `{{custom_fields.stagefit_zone}}` merge syntax
- Conditional send: available in automation branches on paid plans
- The current integration (`src/app/actions/newsletter.ts`) already uses this pattern correctly

**For the stagefit schema:** Already working. The `custom_fields` array in the subscription create call is live and tested. No changes needed to store quiz data.

**Tagging:**
- Kit: first-class tags, full API (create, apply, remove), can gate automations — stronger for behavioral segmentation
- Beehiiv: tags exist but less prominent; primary segmentation is via custom fields and segments

**Winner: Kit** for automation-conditional personalization. Beehiiv is sufficient for storage and merge-tag usage but lacks the tag-based automation branching depth.

---

## 5. Deliverability

### Kit
- Self-reported: 99.8% delivery rate
- Publishes deliverability reports (rare transparency for ESPs)
- Strict anti-spam enforcement on shared IP pools
- Supports custom domain authentication (DKIM, DMARC, SPF)
- Creator-focused audience = historically high engagement rates → keeps shared pool reputation strong
- 45% average open rate cited across platform
- Long track record (10+ years); major ISP relationships established
- Known limitation: no built-in deliverability dashboard or seed testing tools

### Beehiiv
- Enterprise-grade infrastructure; deliverability has improved through 2025
- Some documented cases of deliverability issues as platform scaled (migration stories exist)
- Better email editor = better-looking emails = potentially better engagement signals
- No published deliverability reports

### For B2B Technical Audiences (CTOs, Founders)
Both platforms are adequate. The differentiator is engagement: Kit's plain-text, creator-style emails have historically driven 45%+ open rates and direct replies — valuable signal for a B2B advisory newsletter where relationship-building matters. Beehiiv's richer email editor produces more "designed" newsletters that can feel more commercial to a technical audience.

**Slight edge: Kit** for raw plain-text deliverability reputation and transparency, though neither is a dealbreaker.

---

## 6. Migration Effort: Beehiiv → Kit

The entire integration lives in one file: `src/app/actions/newsletter.ts`.

### Current Beehiiv Integration (live)
```
POST https://api.beehiiv.com/v2/publications/{id}/subscriptions
Authorization: Bearer {BEEHIIV_API_KEY}
Body: {
  email,
  reactivate_existing: true,
  send_welcome_email: true,
  utm_source,
  utm_medium,
  custom_fields: [{name, value}, ...]
}
```

### Kit Equivalent
```
POST https://api.kit.com/v4/subscribers
X-Kit-Api-Key: {KIT_API_KEY}
Body: {
  email_address: email,
  fields: {
    stagefit_zone: value,
    stagefit_severity: value,
    // ... remaining fields
  }
}
```

Then, to add to a welcome sequence:
```
POST https://api.kit.com/v4/sequences/{WELCOME_SEQUENCE_ID}/subscribers
X-Kit-Api-Key: {KIT_API_KEY}
Body: { email_address: email }
```

### What Changes
1. Replace `BEEHIIV_API_KEY` + `BEEHIIV_PUBLICATION_ID` env vars with `KIT_API_KEY` + optionally `KIT_SEQUENCE_ID`
2. In `newsletter.ts`: change the fetch URL, headers (Bearer → X-Kit-Api-Key), and body structure
3. Custom fields: `custom_fields: [{name, value}]` array → `fields: {name: value}` object
4. Optionally: add second fetch call to enroll in sequence (if you want the stagefit flow)
5. Update `newsletter-beehiiv.test.ts` to mock Kit API instead
6. Create Kit custom field definitions in dashboard (one-time, or via API)
7. Re-create the welcome sequence in Kit dashboard

### What Stays the Same
- `ALLOWED_CUSTOM_FIELDS` set — identical field names
- Rate limiting, Turnstile, Zod validation — all unchanged
- Error handling pattern — HTTP status codes are similar
- The 409 (existing subscriber) → Kit returns 200 with existing subscriber data, handle differently

### Migration Complexity: LOW
Estimated 2–3 hours including tests. The actual API call change is ~20 lines. The main work is setting up Kit field definitions and sequences in the dashboard.

### Subscriber Migration (when you have a real list)
Kit provides built-in Beehiiv import: Settings → Add Subscribers → Other provider → Beehiiv → paste API key. Imports subscribers with tags. Custom fields require re-mapping manually or via CSV with column headers matching Kit field names.

At 1 subscriber: migration is effectively zero cost.

---

## 7. Landing Pages / Hosted Content

### Does Alex Need This?

**No.** The site is `alexmayhew.dev` — a full custom Next.js build with its own:
- Newsletter signup form (in `src/app/actions/newsletter.ts`)
- Blog at `/blog` (MDX content, 73 posts)
- Service pages and pSEO
- Contact forms

Neither Beehiiv's hosted publication site nor Kit's landing page builder adds value here. The hosted content features are for newsletters that lack their own website.

**Beehiiv** provides a hosted `{publication}.beehiiv.com` site — unnecessary here; it's already hidden/custom-domain-mapped to alexmayhew.dev.

**Kit** provides 30+ landing page templates — unnecessary; Next.js pages cover this.

**Verdict:** Hosted content is a non-factor for this use case. Don't let it influence the platform decision.

---

## 8. Feature Matrix Summary

| Feature | Beehiiv Free | Beehiiv Scale ($43/mo) | Kit Free (Newsletter) | Kit Creator ($33/mo) |
|---------|-------------|------------------------|----------------------|---------------------|
| Max free subscribers | 2,500 | N/A (paid) | 10,000 | N/A (paid) |
| Broadcasts via dashboard | Yes | Yes | Yes | Yes |
| Broadcasts via API | No (Enterprise only) | No (Enterprise only) | Yes | Yes |
| Sequences | No | Yes (as automation workflows) | 1 only | Unlimited |
| Visual automations | Welcome email only | Yes (unlimited steps) | 1 only | Unlimited |
| Enroll subscriber via API | No | Yes (Add by API trigger) | No (1 automation limit) | Yes |
| Custom fields on subscriber | Yes (API) | Yes (API) | Yes (API) | Yes (API) |
| Custom field count cap | None documented | None documented | 140 | 140 |
| Tags | Limited | Limited | Full (API) | Full (API) |
| Deliverability reporting | No | No | No | No |
| Email editor quality | Strong | Strong | Basic | Basic |
| 0% revenue cut | Yes | Yes | No (0.6%) | No (0.6%) |
| Hosted newsletter site | Yes | Yes | Yes | Yes |
| API auth | Bearer token | Bearer token | X-Kit-Api-Key / OAuth | X-Kit-Api-Key / OAuth |

---

## 9. Decision Framework

### Stay on Beehiiv Free if:
- Still in zero-to-launch phase (< 100 subscribers)
- Not yet building automated onboarding sequences
- Not publishing programmatically (all issues drafted in dashboard)
- Want zero infrastructure spend until meaningful subscriber count

### Migrate to Kit Creator ($33/mo) when:
- Stagefit quiz integration is live and you need to route subscribers into different sequences based on `stagefit_zone` or `persona` values — this requires Kit's `POST /v4/sequences/{id}/subscribers` or unlimited automations
- You want to programmatically create/schedule broadcasts (e.g., automated "This Week's Brief" pipeline)
- Subscriber count crosses 100+ (enough to justify sequence investment)

### Consider Beehiiv Scale ($43/mo) instead of Kit Creator if:
- Subscriber count is growing rapidly and cost matters at 5K+ (Beehiiv is $43 at all counts below 10K; Kit hits $89 at 5K)
- The richer email editor drives better engagement for your audience
- You don't need programmatic post creation (acceptable to draft in dashboard)
- You want 0% revenue cut when you eventually launch paid tiers

### Never need:
- Beehiiv Enterprise (too expensive; Send API only needed if publishing from external CMS)
- Kit Pro ($66/mo) — subscriber scoring and Facebook audiences are not relevant to a technical advisory newsletter
- Landing page features on either platform (already have alexmayhew.dev)

---

## Sources

- [Kit v4 API Documentation — Upgrading to v4](https://developers.kit.com/api-reference/upgrading-to-v4)
- [Kit API Overview](https://developers.kit.com/api-reference/overview)
- [Kit API llms.txt endpoint index](https://developers.kit.com/llms.txt)
- [Kit Pricing (emailtooltester.com)](https://www.emailtooltester.com/en/reviews/convertkit/pricing/)
- [Kit Pricing (kit.com)](https://kit.com/pricing)
- [Beehiiv API — Create Subscription](https://developers.beehiiv.com/api-reference/subscriptions/create)
- [Beehiiv API — Automation Journeys (Add by API)](https://developers.beehiiv.com/api-reference/automation-journeys/create)
- [Beehiiv API — Automations List](https://developers.beehiiv.com/api-reference/automations/index)
- [Beehiiv API — Create Post](https://developers.beehiiv.com/api-reference/posts/create)
- [Beehiiv Send API Access Guide](https://www.beehiiv.com/support/article/29286794539671-how-to-access-the-beehiiv-send-api)
- [Beehiiv Pricing](https://www.beehiiv.com/pricing)
- [Beehiiv Custom Fields — Introduction](https://product.beehiiv.com/p/introducing-custom-fields)
- [Kit vs Beehiiv — Mailotrix](https://mailotrix.com/kit-vs-beehiiv/)
- [Kit vs Beehiiv — ALM Corp](https://almcorp.com/blog/beehiiv-vs-kit-vs-mailchimp-comparison/)
- [Beehiiv vs ConvertKit — marketersguide.org](https://marketersguide.org/beehiiv-vs-kit-review/)
- [Migrating from Beehiiv to Kit — Kit Help Center](https://help.kit.com/en/articles/10248340-migrating-from-beehiiv-to-kit)
- [Kit Deliverability — Warmy Blog](https://www.warmy.io/blog/convertkit-deliverability-not-working-improve-email-deliverability/)
- [Kit vs Beehiiv pricing — Knocked Up Money](https://www.knockedupmoney.com/blog/convertkit-vs-beehiiv-whats-the-best-newsletter-platform)
- [Beehiiv pricing tiers — emailtooltester.com](https://www.emailtooltester.com/en/reviews/beehiiv/pricing/)
