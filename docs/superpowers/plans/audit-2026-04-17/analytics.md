# Analytics & Conversion Audit — 2026-04-17

## GSC 30-day snapshot

- Impressions: 758 (+333% vs prior 30d)
- Clicks: 2 (+100%)
- Avg position: 7.3 (+0.9)
- 24 pages with impressions
- www→non-www redirect is taking hold in last 7d (6 www / 14 non-www)
- Top page still www: `www.alexmayhew.dev/blog/llm-cost-optimization-scale` (57 imp)

## P0 — Critical gaps

1. **No UTM params on outbound links** — cannot attribute reverse traffic from own distribution.
   - `src/components/ui/footer.tsx:30-31` — social links
   - `src/components/pages/about-page.tsx:117-119`
   - `src/components/blog/share-buttons.tsx:30,36`
   - Note: `shop.alexmayhew.dev` linker configured at `google-analytics.tsx:39-42` but no Gumroad anchors exist in `src/` yet.

2. **404 events not captured** — `src/app/not-found.tsx:1-21` is static Server Component with no `trackEvent("page_not_found", {path})`. Client-side 404s from broken internal links invisible.

3. **Gumroad cross-domain measurement incomplete** — GA4 linker set at `google-analytics.tsx:39-42` but Gumroad shop doesn't have `G-K4TLSRKMCV` installed with `accept_incoming: true` (per memory: "PENDING"). Linker is a no-op until installed.

## P1 — High value

4. **Missing GA4 conversion events**
   - `newsletter_signup` fires custom event but no native `sign_up` (GA4 conversion catalog name)
   - No `social_click` event
   - No `pricing_view` event
   - `/services` CTA click targeting `/contact` — loses immediate referrer intent in funnel

5. **Double-fire of `user_engagement`** — `src/lib/hooks/use-content-analytics.ts:159-161` visibility handler AND `:172-179` cleanup — quick tab switches may double-count.

6. **Bot filtering classifies but does not suppress** — `src/components/analytics/page-analytics.tsx:93-95` sets `user_type=bot` but event still sends. Custom events not filtered by GA4 default bot list.

7. **PostHog** — would add value for session replay on `/contact` and `/tools/*` flows (high-value, low-traffic). Feature flags overkill at current volume.

## P2

8. Consent Mode region list is complete (EEA+EFTA+UK+CH). Consider Brazil (BR) for LGPD.
9. `send_page_view: false` correct (PageAnalytics owns SPA tracking)
10. Scroll depth + engagement time well-implemented (25/50/75/90, 30s/60s/2m/5m)

## Priority order

1. P0: Add UTM params to all outbound links
2. P0: Install GA4 on Gumroad shop
3. P0: Client-wrap not-found.tsx for `page_not_found` event
4. P1: Rename newsletter event + fire native `sign_up`
5. P1: Add `social_click` tracking
6. P1: Fix double-fire in `use-content-analytics.ts:159`
7. P2: Evaluate PostHog scope
