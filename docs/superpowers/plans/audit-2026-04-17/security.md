# Security Audit — 2026-04-17

Prior HIGHs (Next 15.5.15, DI export leak, newsletter Turnstile) all resolved.

## P1 — Residual risks (fix order: reporting → rate limits → CSP)

1. **Ratelimit binding never declared in wrangler.jsonc** — the silent catch-block fallthrough means all three "rate-limited" surfaces (contact, newsletter, quiz) are effectively OPEN in production. Verify `wrangler.jsonc` has `unsafe` binding for `RATE_LIMITER_CONTACT` / `RATE_LIMITER_NEWSLETTER`. Check production behavior before continuing CSP tightening.

2. **No CSP reporting endpoint** — blind spot once CSP tightens. Set up `report-to` group + `report-uri` (fallback) → collect into Cloudflare Logpush or a worker endpoint that writes to R2 / D1. Without reports, can't validate tightening safely.

3. **SSG fallback CSP still ships `'unsafe-inline'`** — `custom-worker.ts`. Drop once reporting confirms no violations. Middleware CSP on dynamic routes already uses nonce + 'strict-dynamic'.

## Fix order

1. Add CSP reporting endpoint (Worker route + R2 or Cloudflare Logs)
2. Verify + add `RATE_LIMITER_*` bindings in wrangler.jsonc
3. Monitor reports for 24-72h
4. Drop `'unsafe-inline'` from fallback CSP
