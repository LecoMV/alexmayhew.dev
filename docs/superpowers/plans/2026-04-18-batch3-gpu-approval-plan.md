# TraceForge Batch 3 — GPU Owner-Approval Flow Implementation Plan

**Spec:** `docs/superpowers/specs/2026-04-18-traceforge-gpu-approval-spec.md`
**Status:** READY TO EXECUTE (spec approved on iteration 2)
**Order:** can ship first OR last — independent of Batches 1/2/4. Recommended AFTER Batch 4 so origin secrets are hardened before HMAC secret lands.

## Prerequisites

**Secrets to generate / already have:**

- [ ] Generate `GPU_APPROVAL_HMAC_SECRET` **and persist to pass-store** (Worker-only secret, but persist so rotation and recovery can retrieve it):
  ```bash
  openssl rand -hex 32 | pass insert -m -f claude/alexmayhew-dev/gpu-approval-hmac-secret
  ```
- [ ] Generate `EDGE_ORIGIN_HMAC` **and persist to pass-store** (MUST be identical on edge Worker AND origin `.env` — persist so Phase 5 can pull the same value):
  ```bash
  openssl rand -hex 32 | pass insert -m -f claude/shared/edge-origin-hmac
  ```
- [ ] Discord webhook URL already in `pass show claude/discord/gpu-ops-webhook` → stage for `wrangler secret put DISCORD_OPS_WEBHOOK`

**Critical invariant:** `EDGE_ORIGIN_HMAC` is a symmetric secret shared between the edge Worker and origin. If the value diverges (different `openssl rand` runs), every edge→origin call fails with HTTP 403. Always read from `pass show claude/shared/edge-origin-hmac` — never regenerate.

**Infra confirmations:**

- [ ] Redis running on origin (already used by Celery — verify `redis-cli ping` returns PONG).
- [ ] `RATE_LIMIT_KV` binding exists in `wrangler.jsonc` (verified at lines 71-76).
- [ ] Existing `TURNSTILE_SECRET_KEY` + `RESEND_API_KEY` Worker secrets in place.
- [ ] `alex@alexmayhew.dev` confirmed as notification recipient.

## Phase 1 — Commit A (alexmayhew.dev): library primitives

**Commit message:** `feat(gpu): HMAC + KV-session + coalesce libraries + status route`

1. [ ] Create `src/lib/edge-hmac.ts`:
   - [ ] `importHmacKey(secret, usage)`, `signApproveToken`, `verifyApproveToken`, `base64urlEncode`, `base64urlDecode`.
   - [ ] Full Web Crypto API implementation per spec §E2 step 6 — `Uint8Array` passed to `subtle.verify`, NOT hex.
2. [ ] Create `src/lib/gpu-session.ts`:
   - [ ] TypeScript `type GpuState = "cold" | "pending" | "warm" | "denied"`.
   - [ ] `GpuSession` interface with all fields per spec §E1.
   - [ ] Helpers: `readSession(kv)`, `writeSession(kv, session, ttlSec)`, `bumpActivity(kv, ttlSec)`.
   - [ ] Optimistic-concurrency helper `tryClaimPending(kv, requestId, ...)` returning `{claimed: boolean, ...}` using KV metadata read-after-write pattern.
3. [ ] Create `src/lib/gpu-session-guard.ts`:
   - [ ] `withGpuSessionGuard({allow: GpuState[]}): (req: Request) => Promise<Response | null>` — null to proceed, Response to return early.
4. [ ] Create `src/lib/coalesce.ts`:
   - [ ] Two-key pattern: `gpu:coalesce:<channel>:last` + `gpu:coalesce:<channel>:pending`.
   - [ ] Exports `shouldSendNow(kv, channel, windowSec)` + `markSent(kv, channel)` + `incrementPending(kv, channel)` + `flushPending(kv, channel, sendFn)`.
5. [ ] Modify `src/lib/rate-limit.ts`:
   - [ ] Add `windowSec?: number` (default 60) + `failClosed?: boolean` (default false) to `CheckRateLimitOptions`.
   - [ ] Replace `const WINDOW_MS = 60_000` with `const windowMs = (options.windowSec ?? 60) * 1000`.
   - [ ] On KV throw: return `{ success: !options.failClosed }`. (Fail-open preserved for contact form; fail-closed for GPU route.)
6. [ ] Create `src/app/api/gpu/status/route.ts` per spec §E4 — read-only KV lookup, 60/60s rate limit, no Turnstile.
7. [ ] Write tests:
   - [ ] `tests/lib/edge-hmac.test.ts` — sign/verify roundtrip, domain separator (approve vs edge-origin), tampered-signature rejection.
   - [ ] `tests/lib/gpu-session.test.ts` — state transitions, TTL, concurrency claim.
   - [ ] `tests/lib/coalesce.test.ts` — send-now, skip-within-window, pending-flush.
   - [ ] `tests/api/gpu/status.test.ts` — state rendering, missing-session → cold.
8. [ ] `npm run test:run`, `npm run build`. Commit + push → CI green.

## Phase 2 — Commit B (alexmayhew.dev): `/api/gpu/request` route

**Commit message:** `feat(gpu): POST /api/gpu/request — Turnstile + rate limit + Discord+Resend fanout`

1. [ ] Create `src/components/emails/gpu-approval-request.tsx` (React-Email template).
2. [ ] Create `src/app/api/gpu/request/route.ts` per spec §E2 full 10-step flow:
   - [ ] Turnstile verify via `verifyTurnstileToken` from `@/lib/turnstile` (NOT `_contact-deps.ts`).
   - [ ] Tier-A rate limit via `checkRateLimit({... failClosed: true, windowSec: 60})`.
   - [ ] Optimistic-concurrency KV write with writer-id check.
   - [ ] HMAC approve-token generation.
   - [ ] Notification fanout via `waitUntil` — Discord (with Markdown-strip sanitize of user note) + Resend (with coalesce).
3. [ ] Add `scheduled(event, env, ctx)` handler in `custom-worker.ts` that flushes coalesced email.
4. [ ] Update `wrangler.jsonc`:
   - [ ] Add `"triggers": {"crons": ["*/1 * * * *"]}`.
   - [ ] Document new secrets in a comment block: `GPU_APPROVAL_HMAC_SECRET`, `EDGE_ORIGIN_HMAC`, `DISCORD_OPS_WEBHOOK`, `GPU_CONTROL_PASSWORD`.
5. [ ] Stage secrets from pass-store (Prerequisites step must be done first so the values exist):
   - [ ] `pass show claude/alexmayhew-dev/gpu-approval-hmac-secret | wrangler secret put GPU_APPROVAL_HMAC_SECRET`
   - [ ] `pass show claude/shared/edge-origin-hmac | wrangler secret put EDGE_ORIGIN_HMAC`
   - [ ] `pass show claude/discord/gpu-ops-webhook | wrangler secret put DISCORD_OPS_WEBHOOK`
   - [ ] Keep `GPU_CONTROL_PASSWORD` secret as-is (existing).
   - [ ] **Dev-channel smoke first (reviewer m6):** Before first Phase 2 push, temporarily swap `DISCORD_OPS_WEBHOOK` to a dev Discord channel webhook. After smoke confirms the embed format + rate limiting work, swap to the production ops-channel webhook and push again.
6. [ ] Write `tests/api/gpu/request.test.ts` — Turnstile fail, rate-limit exceed, already-warm/pending, happy path, Discord coalesce, Resend coalesce.
7. [ ] `npm run test:run`, `npm run build`. Commit + push.

## Phase 3 — Commit C (alexmayhew.dev): `/api/gpu/approve` route with password fallback

**Commit message:** `feat(gpu): GET /api/gpu/approve — HMAC-verified approve/deny + origin call`

1. [ ] Create `src/app/api/gpu/approve/route.ts` per spec §E3:
   - [ ] `verifyApproveToken` call.
   - [ ] Consume-before-origin-call pattern.
   - [ ] Origin call with 25s `AbortSignal.timeout` ceiling.
   - [ ] **This commit uses password auth to origin** (passes `{password: env.GPU_CONTROL_PASSWORD}` in body). HMAC-to-origin lands in Commit E+F.
   - [ ] Handle 200 / 409 "already consumed" / timeout / 5xx per spec.
2. [ ] Write `tests/api/gpu/approve.test.ts` — all 8 test cases from spec.
3. [ ] `npm run test:run`, `npm run build`. Commit + push.
4. [ ] Manual smoke: trigger `/api/gpu/request`; tail the approve URL from test webhook; curl it → verify origin wakes GPU + KV transitions to `warm`.

## Phase 4 — Commit D (alexmayhew.dev): vectorize-proxy guard

**Commit message:** `feat(gpu): 503 on vectorize when GPU session not warm`

1. [ ] Edit all 5 vectorize route files per spec §E5 (enumerated list):
   - [ ] `src/app/api/vectorize/route.ts` — `withGpuSessionGuard({allow:["warm","pending"]})`.
   - [ ] `src/app/api/vectorize/[taskId]/process/route.ts` — `withGpuSessionGuard({allow:["warm"]})` + `lastActivityAt` bump on 2xx.
   - [ ] `src/app/api/vectorize/[taskId]/status/route.ts` — NO guard (existing tasks remain retrievable).
   - [ ] `src/app/api/vectorize/[taskId]/download/[filename]/route.ts` — NO guard.
   - [ ] `src/app/api/vectorize/generators/route.ts` — NO guard (public read).
2. [ ] Write `tests/api/vectorize-guard.test.ts` covering all 5 routes.
3. [ ] Commit + push.

## Phase 5 — Commit E (vectorizer origin): HMAC auth + nonce tracking

**Repo:** vectorizer

**Commit message:** `feat(api): edge HMAC auth for /gpu/enable with Redis SETNX nonce tracking`

1. [ ] Edit `app/api/server.py`:
   - [ ] Add `verify_edge_signature()` + `try_consume_nonce()` helpers per spec §O1.
   - [ ] Modify `enable_gpu()` handler: accept body, verify HMAC, SETNX nonce, fall back to password if no HMAC.
   - [ ] Same treatment for `disable_gpu()`.
   - [ ] Add `logger.warning("password-path /gpu/enable called...")` on fallback path.
2. [ ] Edit `.env.example`: add `EDGE_ORIGIN_HMAC=<32-byte-hex>`. Do NOT commit the real value.
3. [ ] Write `tests/api/test_edge_hmac_auth.py` — 5 test cases from spec.
4. [ ] Load `EDGE_ORIGIN_HMAC` into origin `.env` from the pass-store (same value as the Worker secret — NEVER regenerate):
   ```bash
   ssh rtx01
   pass show claude/shared/edge-origin-hmac  # copy value
   sudo nano /home/deploy/projects/vectorizer/.env
   # Add/update: EDGE_ORIGIN_HMAC=<the-value>
   sudo systemctl restart vectorizer-api vectorizer-worker
   ```
5. [ ] `pytest tests/api/test_edge_hmac_auth.py -xvs`. Must pass.
6. [ ] **Cutover gate (reviewer M2):** verify the origin is ready to accept HMAC before Phase 6 ships the edge flip:

   ```bash
   # On rtx01:
   journalctl -u vectorizer-api --since="2 minutes ago" | grep -E "(Started|running|edge-hmac)"
   # Must show clean restart with no errors. If any error, fix before proceeding.

   # Synthetic HMAC probe from a developer laptop (not CI):
   TS=$(date +%s)
   BODY='{"requestId":"test-00000000"}'
   SECRET=$(pass show claude/shared/edge-origin-hmac)
   SIG=$(printf "edge-origin:POST:/gpu/enable:${TS}:${BODY}" | openssl dgst -sha256 -hmac "$SECRET" | awk '{print $NF}')
   curl -v -X POST https://api.traceforge.tool/gpu/enable \
     -H "Content-Type: application/json" \
     -H "X-Edge-Timestamp: ${TS}" \
     -H "X-Edge-Signature: ${SIG}" \
     -d "$BODY"
   # Expected: 200 (nonce consumed, GPU enables) OR 409 if nonce already used.
   # NOT expected: 403 (signature fail — means secret mismatch between pass + origin .env + Worker).
   ```

7. [ ] Commit + push origin code.

## Phase 6 — Commit F (alexmayhew.dev): flip approve to HMAC

**Commit message:** `feat(gpu): use edge-origin HMAC auth instead of password on approve path`

**Pre-gate (reviewer M2):** Do NOT push this commit until Phase 5 step 6's synthetic HMAC probe has succeeded against production origin. If the probe returned 403, the edge flip will break the approval flow for every incoming user.

1. [ ] Verify Phase 5 step 6 probe returned 200 or 409 (NOT 403).
2. [ ] Edit `src/app/api/gpu/approve/route.ts`:
   - [ ] Replace `{password: env.GPU_CONTROL_PASSWORD}` body with `{requestId}` body + HMAC headers (`X-Edge-Timestamp`, `X-Edge-Signature`).
   - [ ] Sign payload using `edge-hmac.ts` helpers with `"edge-origin:"` domain separator.
   - [ ] Update tests.
3. [ ] Commit + push.
4. [ ] Manual smoke: trigger full flow, verify origin `/gpu/enable` accepts via HMAC (check origin journalctl for no `password-path` warning).
5. [ ] Post-cutover audit (after 24h): `ssh rtx01 'sudo journalctl -u vectorizer-api --since="24 hours ago" | grep password-path | wc -l'` — expect 0. If > 0, investigate which client still uses password auth and rotate the password if warranted.

## Phase 7 — Commit G (alexmayhew.dev): frontend UI replacement

**Commit message:** `feat(traceforge): replace password form with approval-request button + countdown pill`

1. [ ] Rewrite `src/components/traceforge/gpu-control.tsx`:
   - [ ] Remove password input form entirely.
   - [ ] State-machine UI: cold → button "Request GPU session", pending → disabled + caption, warm → `<GpuSessionPill />`, denied → gray caption.
   - [ ] Embed `<Turnstile />` widget from `src/components/ui/turnstile.tsx`.
   - [ ] POST to `/api/gpu/request` with turnstileToken + optional note.
2. [ ] Create `src/components/traceforge/gpu-session-pill.tsx` — countdown pill polling `/api/gpu/status` every 5s while pending/warm.
3. [ ] Extend `e2e/traceforge.spec.ts` — button, Turnstile challenge, pending state, warm state.
4. [ ] `npm run test:run`, `npm run build`. Commit + push.

## Phase 8 — Commit H: Cloudflare WAF rule (manual dashboard + docs)

**Commit message:** `docs: Cloudflare WAF Tier-B rate-limit rule for /api/gpu/request`

1. [ ] Create `docs/gpu-waf-rule.md` per spec §E6 — exact dashboard settings.
2. [ ] Login to Cloudflare dashboard → Security → WAF → Rate limiting rules → Create:
   - URI path equals `/api/gpu/request`
   - 30 requests per 10 minutes per IP
   - Action: Block, mitigation timeout 10 min
3. [ ] Commit the doc. Record the rule ID in the doc for future reference.

## Post-batch verification

- [ ] End-to-end: new user (no password) requests GPU → Alex receives Discord + email → clicks approve → GPU wakes → user traces successfully.
- [ ] 30-minute idle → session expires → vectorize returns 503.
- [ ] Rate limit: 4th request in 60s from one IP → 429.
- [ ] WAF rule active in Cloudflare dashboard.
- [ ] Coalesce: 10 rapid requests → 1 Discord message, 1 email.
- [ ] Deny path: click deny URL → session resets, user sees declined message.
- [ ] Approve link double-click → 2nd click gets "already used."
- [ ] Origin HMAC: `journalctl -u vectorizer-api | grep password-path` → 0 entries post-cutover.

## Rollback

- Revert in reverse commit order. Phase 7 revert restores the password form — works because origin retains password-auth fallback.
- If entire batch fails: revert commits 1-8 and the origin will continue accepting direct password POSTs from any remaining cached bookmarks.
- WAF rule deletion is a dashboard toggle.

## Known limitations (documented, not blocking)

- KV eventual consistency (1-60s) means cross-PoP approve-link replay is possible in the window between first approve and consume-flag propagation. **Mitigation** via origin-side Redis SETNX nonce (Phase 5). This resolves the race at the only linearizable authority.
- Single-approver model. Queue / multi-approver is a future batch.
- Global session scope means "anyone can trace while warm." This matches the research verdict (`gpu-session-window-2026-04-18.md`) and the reality of a shared-password trust model.
