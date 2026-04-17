# Cloudflare www-to-non-www Redirect for Pages/Workers (2026-03-30)

**Status:** CURRENT
**Session:** Fix duplicate content issue where www.alexmayhew.dev serves HTTP 200 instead of 301 redirect

## Problem

- `https://www.alexmayhew.dev/` returns HTTP 200 with full page content (124,917 bytes)
- `https://alexmayhew.dev/` returns HTTP 200 with identical content
- Both resolve to same Cloudflare anycast IPs: 172.67.199.92, 104.21.21.162
- This causes duplicate content issues with Google (SEO penalty)

## Current State (Diagnosed)

- **DNS:** `www.alexmayhew.dev` resolves to A records (Cloudflare proxy IPs). No visible CNAME externally due to Cloudflare CNAME flattening, but a proxied DNS record exists in Cloudflare.
- **Worker:** Both apex and www serve the OpenNext worker (`x-opennext: 1`, `cf-placement: local-BOS`). This means `www` is either added as a custom domain on the Workers project, or there's a Worker route matching `www.alexmayhew.dev/*`.
- **No redirect config exists** in wrangler.jsonc, next.config.mjs, custom-worker.ts, or `_redirects` file.
- **custom-worker.ts** already handles `.pages.dev` noindex but has no www redirect logic.

## Root Cause

The `www` subdomain has a proxied DNS record pointing to Cloudflare, and the Workers/Pages project is configured to serve content on `www.alexmayhew.dev` (either via custom domain or route). No redirect rule exists anywhere.

## Solution Options

### Option A: Cloudflare Bulk Redirects (Official Cloudflare Pages recommendation)

**Source:** https://developers.cloudflare.com/pages/how-to/www-redirect/

Steps:

1. Go to Cloudflare Dashboard > Account Home > Bulk Redirects
2. Create a Bulk Redirect List with one entry:
   - Source URL: `www.alexmayhew.dev`
   - Target URL: `https://alexmayhew.dev`
   - Status: 301
   - Parameters: Preserve query string, Subpath matching, Preserve path suffix, Include subdomains
3. Create a Bulk Redirect Rule using the list
4. Ensure DNS has a proxied A record for `www` pointing to `192.0.2.1` (dummy IP, since Cloudflare intercepts before it reaches origin)
5. **CRITICAL:** If `www` is currently a custom domain on the Workers/Pages project, REMOVE it from the custom domains list first. Otherwise the Worker will handle the request before Bulk Redirects can fire.

### Option B: Single Redirect Rules (Modern approach, more flexible)

**Source:** https://developers.cloudflare.com/rules/url-forwarding/examples/redirect-www-to-root/

Steps:

1. Go to Cloudflare Dashboard > Rules > Redirect Rules
2. Create a Single Redirect Rule:
   - When: Wildcard pattern `https://www.*`
   - Then: Redirect to `https://${1}`
   - Status: 301
   - Preserve query string: Enabled
3. Same DNS and custom domain considerations as Option A

### Option C: Custom Worker redirect (in custom-worker.ts)

Add redirect logic at the top of the fetch handler:

```typescript
const url = new URL(request.url);
if (url.hostname === "www.alexmayhew.dev") {
	url.hostname = "alexmayhew.dev";
	return Response.redirect(url.toString(), 301);
}
```

**Pros:** No dashboard config needed, version-controlled
**Cons:** Only works if the Worker is routing www traffic (which it currently is). Adds latency (Worker cold start for redirect).

## Recommendation: Option A (Bulk Redirects)

This is the official Cloudflare Pages documentation recommendation. It operates at the Cloudflare edge BEFORE the Worker executes, so it's faster and doesn't consume Worker invocations.

## Critical Pre-Requisite: Check Custom Domain Configuration

Before any redirect will work at the Cloudflare edge level (Options A or B), you MUST verify whether `www.alexmayhew.dev` is configured as a custom domain on the Workers/Pages project. If it is:

1. Remove it from the custom domain list (Workers & Pages > alexmayhew-dev > Settings > Domains & Routes)
2. The proxied DNS record for `www` should remain (needed for Cloudflare to intercept the request)
3. Then the Bulk Redirect / Redirect Rule will fire before any Worker code runs

If `www` is a Worker route (not custom domain), removing the route achieves the same effect.

## DNS Record Required

A proxied DNS record must exist for `www.alexmayhew.dev` so Cloudflare's proxy intercepts the request:

- Type: A
- Name: www
- Value: 192.0.2.1 (dummy, Cloudflare never sends traffic to it)
- Proxy: PROXIED (orange cloud ON)

## Execution Order (Important)

1. Single Redirect Rules (highest priority)
2. Bulk Redirects
3. Worker routes / Custom domains
4. Page Rules (lowest, being deprecated)

## Verification

After implementation:

```bash
curl -sI "https://www.alexmayhew.dev/" | head -5
# Expected: HTTP/2 301 + Location: https://alexmayhew.dev/

curl -sI "https://www.alexmayhew.dev/blog/some-post" | head -5
# Expected: HTTP/2 301 + Location: https://alexmayhew.dev/blog/some-post
```

## Sources

- [Cloudflare Pages: Redirecting www to domain apex](https://developers.cloudflare.com/pages/how-to/www-redirect/)
- [Cloudflare Rules: Redirect from WWW to root](https://developers.cloudflare.com/rules/url-forwarding/examples/redirect-www-to-root/)
- [Cloudflare: Bulk Redirects](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/)
- [Cloudflare: Single Redirects](https://developers.cloudflare.com/rules/url-forwarding/)
- [Cloudflare: Custom Domains for Pages](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Cloudflare: CNAME Flattening](https://developers.cloudflare.com/dns/cname-flattening/)
