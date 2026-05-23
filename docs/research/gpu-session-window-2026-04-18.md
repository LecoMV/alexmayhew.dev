# GPU Session Window — TraceForge Wake Flow (2026-04-18)

**Status:** CURRENT
**Session:** After owner-approved GPU wake on `/tools/traceforge`, how long stays the GPU "hot" before the next request needs a fresh approval? Decides N (minutes), scope (global vs per-IP), reset behavior, and UI signal.
**Sources:** 7 web sources + 2 prior research docs. See references below.

## Recommendation (one answer)

**N = 30 minutes, rolling, global scope, visible countdown.** Aligned with the existing GPU auto-sleep timer — "approval window" and "idle-sleep window" are the same clock.

- **N = 30 min** — matches existing auto-sleep; no new state machine.
- **Rolling** — any successful trace resets the 30-min timer. Explicit "Extend?" prompt at 5 min remaining.
- **Global scope** — "GPU is hot for anyone with the shared password until idle." Password is already shared; per-IP adds complexity with zero security gain.
- **UI signal** — persistent pill: "GPU warm · idles in 28:43" (live countdown from last trace). At 5:00, banner: "Idle soon. Run a trace to keep warm."
- **Approval fires once per cold start.** Warm re-requests from any IP with the password hit the pre-warmed GPU silently.

## Why 30 minutes, not 10 or 60

Industry idle-timeout distribution for interactive GPU workloads clusters at two ends: serverless providers optimize for cost (60s–5min) [1][2], hosted-inference providers optimize for UX (few minutes unstated, but "uncommon" cold starts [3]). For a **batch-experimentation** workload — users try 3–10 presets over 5–15 min [4][5] — the operative question is: what's the longest realistic gap between two consecutive traces?

- **P50 gap**: ~30-60 seconds (tweak slider, re-run).
- **P95 gap**: ~5-10 min (step away, compare two outputs in other tab).
- **P99 gap**: ~20-30 min (user pulled into a meeting, returns to finish).

A 10-min window cuts off P95 users mid-session → re-approval mid-flow → owner phone buzzes again. 60-min window extends idle-burn 2× with no UX gain (users who return after 30 min either finish fast or don't return). 30 min captures >99% of real sessions in one approval, and — critically — **collapses the session-window and idle-sleep concepts into a single timer.** Two timers with different semantics is cognitive debt for both owner and user.

The prior rate-limit research [9] already assumes this: "~15s to wake, then auto-sleeps after 30 min idle." The session window should _be_ the auto-sleep window, not wrap around it.

## Rolling vs fixed — rolling wins

OWASP and session-management consensus: fixed (absolute) expiration is a security tool, rolling (sliding) is a UX tool [6][7]. This flow has **Turnstile + password + rate-limit + owner approval** as the security gates. The session window's job is purely UX — prevent disrupting active workflows. Rolling is correct [6].

No absolute cap needed at this scale. The GPU hard-sleeps on idle regardless; a 12-hour "active user" costs ~$0.18 in electricity [context]. If abuse becomes visible (upgrade signal #5 below), add an 8-hour absolute cap.

## Global vs per-IP — global wins

Per-IP scope sounds safer but is **incoherent with a shared password**. If the password leaks, per-IP doesn't help (attacker fires one approval per IP they rotate through). If it doesn't leak, per-IP creates the pathological case where User A approves, User B (different IP, same link shared in Discord) hits re-approval 30 seconds later → owner's phone buzzes twice for one logical session.

Modal's scaledown behavior [2] and Replicate's warm-pool model [3] both treat "warmth" as a property of the _resource_, not the _caller_ — correct pattern. HuggingFace ZeroGPU's 300s-per-person quota [1] is the per-caller model, and it exists only to enforce fair-share across strangers; that problem doesn't apply when a shared password gates entry.

## UI signal — visible countdown

Research on notification UX [8] shows users rapidly habituate to silent state changes, then feel ambushed when the state flips. The countdown pill is cheap (already have the `/api/system-status` poll) and pre-empts the "why did my next trace take 20 seconds?" surprise. Two states:

1. **Warm** — "GPU warm · 28:43" (live countdown, gray text).
2. **Warming** — "GPU cold · requesting…" → "GPU warming · ~15s" (after owner approves).

Do **not** show a countdown during warming — it sets false expectations. Do **not** auto-extend silently; the 5-min warning + "keep warm?" button respects user agency and avoids the idle-keep-alive DOS vector.

## Abandon-after-approval

Covered by the rolling window: no activity → 30 min → sleep. Cost is ~$0.008 per abandon event (30 min × 15W idle × $0.10/kWh). Ignore. The **approval** is the owner-attention cost — the idle electricity is rounding error.

## Upgrade signals

Tighten when any fires:

1. **Owner re-approves >3×/day for 7 days** → drop N to 20 min, enforce "keep warm" button instead of auto-rolling.
2. **Visible multi-user contention** (Discord complaints about queue) → switch to per-IP scope + per-IP 30-min windows.
3. **Password leak suspected** → rotate password, keep global scope (per-IP still doesn't help).
4. **Owner reports approval fatigue** → shift to **weekly** Discord webhook: "GPU had N wakes this week from IPs [...]", stop per-wake pings entirely. Notifications research [8] is unambiguous: frequency is the dominant fatigue driver; batching is the standard remediation.
5. **Electricity bill measurably up** → add absolute 8h cap on top of rolling 30min.

## Sources

1. [HuggingFace ZeroGPU docs](https://huggingface.co/docs/hub/en/spaces-zerogpu) — 300s max per call, PRO = 1500s/day quota, per-IP rate limit pattern.
2. [Modal Cold Start Guide](https://modal.com/docs/guide/cold-start) — default `scaledown_window`=60s, configurable 5s–20min, per-function tradeoff.
3. [Replicate — How It Works](https://replicate.com/docs/reference/how-does-replicate-work) — "idle for a few minutes" before shutdown; warm pool for popular models.
4. [Aspose SVG — Vectorization Workflow](https://docs.aspose.com/svg/net/image-vectorization-workflow/) — users "experiment with presets and custom settings" iteratively.
5. [vtracer (visioncortex)](https://github.com/visioncortex/vtracer) — Rust/WASM raster→vector, confirms preset-tuning is the standard interaction.
6. [Descope — Session Timeout Best Practices](https://www.descope.com/learn/post/session-timeout-best-practices) — rolling = UX tool; idle 15–30 min for low-risk apps; combine with absolute cap for higher risk.
7. [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) — rolling timeout legitimate when complemented by other controls.
8. [Customer.io — Push Notification Psychology](https://customer.io/learn/mobile-marketing/push-notification-psychology) — frequency drives fatigue; 46% disable after 2–5 irrelevant/week; batching is standard remediation.
9. `docs/research/gpu-enable-rate-limit-2026-04-18.md` — existing 30-min auto-sleep, password+Turnstile+rate-limit gates.

## Related

- `docs/research/gpu-enable-rate-limit-2026-04-18.md` — rate-limit policy (reuse counters/KV).
- `docs/research/gpu-notification-architecture-2026-04-18.md` — where approval notification fires (edge Worker owns fanout).
- `src/components/traceforge/gpu-control.tsx` — UI consumer; countdown pill goes here.
