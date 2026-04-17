# Deferred Audit Items — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete all remaining deferred audit items: CSP header propagation fix, Workers RateLimit binding migration, deploy notification permissions, Knip in CI, IntersectionObserver scroll tracking.

**Architecture:** Six independent tasks touching CI/CD, Cloudflare config, API routes, server actions, and analytics hooks. Each task produces an atomic commit. Workers RateLimit binding replaces the in-memory rate limiter across 3 consumers (chat route, contact action, newsletter action).

**Tech Stack:** Next.js 15.5.9, Cloudflare Workers (OpenNext), Wrangler 4.60, GitHub Actions, Vitest 4, TypeScript

**Spec:** `docs/superpowers/specs/2026-03-14-comprehensive-site-audit-fixes-design.md` (Deferred section)

**Research docs:**

- `docs/research/cloudflare-rate-limiting-2026.md` — Workers RateLimit binding details
- `docs/research/csp-nextjs15-cloudflare-workers-2026.md` — CSP / middleware on Workers
- `docs/research/ga4-analytics-portfolio-2026.md` — Scroll tracking best practices

---

## File Structure

| File                                             | Action                                                   | Task |
| ------------------------------------------------ | -------------------------------------------------------- | ---- |
| `wrangler.jsonc`                                 | Modify — add `rate_limits` bindings                      | T2   |
| `cloudflare-env.d.ts`                            | Regenerate via `wrangler types`                          | T2   |
| `src/lib/cloudflare-env.ts`                      | Modify — export RateLimit helper                         | T2   |
| `src/app/api/chat/route.ts`                      | Modify — replace `checkRateLimit` with binding           | T2   |
| `src/app/actions/contact.ts`                     | Modify — replace DI rate limiter with binding            | T2   |
| `src/app/actions/newsletter.ts`                  | Modify — replace DI rate limiter with binding            | T2   |
| `src/lib/rate-limit.ts`                          | Delete — no longer needed                                | T2   |
| `tests/lib/rate-limit.test.ts`                   | Delete — replaced by integration behavior                | T2   |
| `tests/lib/property/rate-limit.property.test.ts` | Delete — no longer relevant                              | T2   |
| `.github/workflows/deploy.yml`                   | Modify — add permissions block                           | T3   |
| `.github/workflows/ci.yml`                       | Modify — add knip step                                   | T4   |
| `src/lib/hooks/use-content-analytics.ts`         | Modify — replace scroll events with IntersectionObserver | T5   |
| `docs/DEFERRED_AUDIT_ITEMS.md`                   | Modify — mark completed items                            | T6   |

---

## Chunk 1: Infrastructure & CI/CD (Tasks 1-4)

### Task 1: Fix CSP Middleware Headers in Production

**Context:** Middleware.ts sets CSP and security headers but they don't appear in production HTTP responses. This is likely an OpenNext/Cloudflare Workers middleware limitation where response headers from Next.js middleware are stripped or not propagated through the Worker.

**Files:**

- Modify: `wrangler.jsonc` — add `custom_headers` or investigate alternative
- Possibly modify: `middleware.ts`

**NOTE:** This task depends on the research agent currently investigating OpenNext middleware header propagation. The fix will be one of:

- (A) OpenNext supports middleware headers and there's a config we're missing
- (B) Headers need to be set via Cloudflare Dashboard > Transform Rules (no code change)
- (C) Headers need to be set in a custom Worker wrapper

- [ ] **Step 1: Wait for research agent to complete and read findings**

Check the output at: `/tmp/claude-1000/-home-deploy-projects-amdev-alexmayhew-dev/7b8da200-d16f-433d-9d02-f8f3c015b8b5/tasks/a8693e1ce9e4f055f.output`

- [ ] **Step 2: Implement the fix based on research findings**

If Transform Rules: configure in Cloudflare Dashboard (no code change).
If wrangler config: add headers to `wrangler.jsonc`.
If code fix: modify `middleware.ts` or add Worker wrapper.

- [ ] **Step 3: Deploy and verify headers appear**

```bash
curl -sI https://alexmayhew.dev/ | grep -iE "content-security-policy|x-frame-options|referrer-policy"
```

- [ ] **Step 4: Commit if code changes were needed**

---

### Task 2: Migrate Rate Limiting to Workers RateLimit Binding

**Files:**

- Modify: `wrangler.jsonc`
- Regenerate: `cloudflare-env.d.ts`
- Modify: `src/lib/cloudflare-env.ts`
- Modify: `src/app/api/chat/route.ts`
- Modify: `src/app/actions/contact.ts`
- Modify: `src/app/actions/newsletter.ts`
- Delete: `src/lib/rate-limit.ts`
- Delete: `tests/lib/rate-limit.test.ts`
- Delete: `tests/lib/property/rate-limit.property.test.ts`
- Modify: `tests/actions/contact.test.ts`
- Modify: `tests/actions/newsletter.test.ts`

- [ ] **Step 1: Add rate_limits bindings to wrangler.jsonc**

Add after the `r2_buckets` section:

```jsonc
/**
 * Workers Rate Limiting Bindings
 * Globally-coordinated rate limiting with near-zero latency
 * Limits configured in Cloudflare Dashboard > Workers > Rate Limiting
 * @see https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
 */
"rate_limits": [
    {
        "binding": "RATE_LIMITER_CHAT",
        "namespace_id": "1001",
        "simple": { "limit": 10, "period": 60 }
    },
    {
        "binding": "RATE_LIMITER_CONTACT",
        "namespace_id": "1002",
        "simple": { "limit": 5, "period": 3600 }
    },
    {
        "binding": "RATE_LIMITER_NEWSLETTER",
        "namespace_id": "1003",
        "simple": { "limit": 3, "period": 3600 }
    }
]
```

- [ ] **Step 2: Regenerate cloudflare-env.d.ts**

```bash
npx wrangler types --env-interface CloudflareEnv ./cloudflare-env.d.ts
```

If wrangler auth fails locally, manually add to the `Cloudflare.Env` interface (first 27 lines of cloudflare-env.d.ts):

```typescript
RATE_LIMITER_CHAT: RateLimit;
RATE_LIMITER_CONTACT: RateLimit;
RATE_LIMITER_NEWSLETTER: RateLimit;
```

- [ ] **Step 3: Update cloudflare-env.ts to export rate limiter helper**

Add a helper function to `src/lib/cloudflare-env.ts`:

```typescript
export async function getRateLimiter(
	name: "RATE_LIMITER_CHAT" | "RATE_LIMITER_CONTACT" | "RATE_LIMITER_NEWSLETTER"
): Promise<RateLimit | null> {
	try {
		const { env } = await getCloudflareContext();
		return env[name] ?? null;
	} catch {
		return null;
	}
}
```

- [ ] **Step 4: Update /api/chat route**

In `src/app/api/chat/route.ts`:

Remove imports:

```typescript
// DELETE: import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
// DELETE: const RATE_LIMIT_CONFIG = { limit: 10, windowSeconds: 60 };
```

Replace rate limit block (lines 132-149) with:

```typescript
const clientIP =
	request.headers.get("cf-connecting-ip") ||
	request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
	"unknown";

const { env } = await getCloudflareContext();

if (env.RATE_LIMITER_CHAT) {
	const { success } = await env.RATE_LIMITER_CHAT.limit({ key: `chat:${clientIP}` });
	if (!success) {
		return Response.json(
			{ error: "Too many requests. Please wait before sending more messages." },
			{ status: 429, headers: { "Retry-After": "60" } }
		);
	}
}
```

Note: `getCloudflareContext()` is already imported and called later for `env.AI`. Move the context fetch earlier and reuse.

- [ ] **Step 5: Update contact action**

In `src/app/actions/contact.ts`:

Remove imports:

```typescript
// DELETE: import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
```

Add import:

```typescript
import { getCloudflareContext } from "@opennextjs/cloudflare";
```

Replace the rate limiting section (lines 128-141) with:

```typescript
// 2. Rate Limiting (Workers RateLimit binding)
const clientIP =
	headersList.get("cf-connecting-ip") ||
	headersList.get("x-forwarded-for")?.split(",")[0].trim() ||
	"unknown";

try {
	const { env } = await getCloudflareContext();
	if (env.RATE_LIMITER_CONTACT) {
		const { success } = await env.RATE_LIMITER_CONTACT.limit({ key: `contact:${clientIP}` });
		if (!success) {
			return {
				success: false,
				error: "Too many submissions. Please try again later.",
			};
		}
	}
} catch {
	// Rate limiting unavailable (local dev) — allow request
}
```

Also update the DI container: remove `rateLimit` and `getIP` from `dependencies`, `__setDependencies`, and `__resetDependencies`. The rate limiting is now infrastructure-level, not injectable.

- [ ] **Step 6: Update newsletter action**

Same pattern as contact action. In `src/app/actions/newsletter.ts`:

Remove `checkRateLimit` and `getClientIP` imports. Replace rate limiting section with Workers binding call using `RATE_LIMITER_NEWSLETTER`. Update DI container to remove rate limit deps.

- [ ] **Step 7: Update tests**

In `tests/actions/contact.test.ts`:

- Remove all `rateLimit` DI mocking
- Mock `getCloudflareContext` instead to provide `{ env: { RATE_LIMITER_CONTACT: { limit: vi.fn().mockResolvedValue({ success: true }) } } }`
- Update rate limit exceeded test to mock `limit` returning `{ success: false }`

Same pattern for `tests/actions/newsletter.test.ts`.

- [ ] **Step 8: Delete old rate limiter**

```bash
rm src/lib/rate-limit.ts tests/lib/rate-limit.test.ts tests/lib/property/rate-limit.property.test.ts
```

- [ ] **Step 9: Verify**

```bash
npx vitest run
npm run typecheck
npm run build
```

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: migrate rate limiting to Workers RateLimit binding

Replace in-memory per-isolate rate limiter with Cloudflare's
globally-coordinated Workers RateLimit binding (GA Sep 2025).
Fixes: state not shared across isolates, setInterval unreliable.
Affects: /api/chat, contact action, newsletter action."
```

---

### Task 3: Fix Deploy Workflow Notification Permissions

**Files:**

- Modify: `.github/workflows/deploy.yml`

- [ ] **Step 1: Add permissions to deploy-production job**

Add `permissions` block to the `deploy-production` job (after line 143, alongside `environment`):

```yaml
deploy-production:
  name: Deploy Production
  needs: validate
  if: github.event_name == 'push' && github.ref == 'refs/heads/main'
  runs-on: ubuntu-latest
  permissions:
    contents: read
    issues: write
  environment:
    name: production
    url: https://alexmayhew.dev
```

- [ ] **Step 2: Verify YAML is valid**

```bash
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/deploy.yml'))"
```

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "fix: add issues:write permission to deploy workflow

The failure notification step needs issues:write to create
GitHub issues when deployment fails. Was getting 403."
```

---

### Task 4: Add Knip Dead Code Detection to CI

**Files:**

- Modify: `.github/workflows/ci.yml`

- [ ] **Step 1: Add knip step to lint job**

Add after the "Check formatting" step in the `lint` job:

```yaml
- name: Dead code detection
  run: npx knip --no-exit-code
```

Using `--no-exit-code` initially to avoid breaking CI while we clean up any findings. After the first run shows clean results, remove the flag to enforce.

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add Knip dead code detection to lint job

Runs knip in CI to catch unused exports and dead code.
Using --no-exit-code initially for visibility without blocking."
```

---

## Chunk 2: Performance & Cleanup (Tasks 5-6)

### Task 5: Implement IntersectionObserver Scroll Tracking

**Files:**

- Modify: `src/lib/hooks/use-content-analytics.ts`

- [ ] **Step 1: Replace scroll event tracking with IntersectionObserver**

Replace the scroll tracking section (lines 67-129) with IntersectionObserver:

```typescript
// Track scroll depth via IntersectionObserver sentinels
const observerRef = useRef<IntersectionObserver | null>(null);
const sentinelsCreated = useRef<boolean>(false);

useEffect(() => {
	if (sentinelsCreated.current) return;
	sentinelsCreated.current = true;

	const milestones = [25, 50, 75, 90];
	const sentinels: HTMLElement[] = [];

	// Find the article/content container
	const article = document.querySelector("article") || document.querySelector("main");
	if (!article) return;

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				const milestone = Number(entry.target.getAttribute("data-scroll-depth"));
				if (milestone && !trackedMilestones.current.has(milestone)) {
					trackedMilestones.current.add(milestone);
					trackContentEvent("scroll", {
						content_id: contentId,
						content_type: contentType,
						scroll_depth: milestone,
						content_category: contentCategory,
					});
				}
				observer.unobserve(entry.target);
			}
		},
		{ threshold: 0 }
	);

	observerRef.current = observer;

	// Create invisible sentinel elements at each milestone depth
	for (const milestone of milestones) {
		const sentinel = document.createElement("div");
		sentinel.setAttribute("data-scroll-depth", String(milestone));
		sentinel.style.cssText =
			"position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;";

		// Position sentinel at milestone% of the article
		const position = (milestone / 100) * article.scrollHeight;
		sentinel.style.top = `${position}px`;

		article.style.position = article.style.position || "relative";
		article.appendChild(sentinel);
		sentinels.push(sentinel);
		observer.observe(sentinel);
	}

	return () => {
		observer.disconnect();
		sentinels.forEach((s) => s.remove());
		sentinelsCreated.current = false;
	};
}, [contentId, contentType, contentCategory]);
```

Remove the old scroll handler useEffect (the one with `window.addEventListener("scroll", handleScroll)`).

Remove the `trackScrollDepth` useCallback since it's no longer needed.

Keep `maxScrollDepth` ref — update it in the observer callback:

```typescript
if (milestone > maxScrollDepth.current) {
	maxScrollDepth.current = milestone;
}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/hooks/use-content-analytics.ts
git commit -m "perf: replace scroll events with IntersectionObserver for depth tracking

Zero main-thread cost — observer fires only when sentinel enters
viewport. Replaces scroll event + 100ms debounce pattern."
```

---

### Task 6: Update Deferred Items Doc + Final Push

**Files:**

- Modify: `docs/DEFERRED_AUDIT_ITEMS.md`

- [ ] **Step 1: Update deferred items to mark completed ones**

Mark D.2, D.5, D.6 as COMPLETED. Update D.1 status. Remove D.7 if env vars are confirmed.

- [ ] **Step 2: Run full verification**

```bash
npx vitest run
npm run typecheck
npm run lint
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add docs/DEFERRED_AUDIT_ITEMS.md
git commit -m "docs: update deferred items — mark D.2, D.5, D.6 as completed"
```

- [ ] **Step 4: Push to main**

```bash
git push origin main
```

- [ ] **Step 5: Monitor all workflows**

```bash
gh run list --repo LecoMV/alexmayhew.dev --limit 5
# Wait for all 3 workflows (CI, E2E, Deploy) to complete
```

- [ ] **Step 6: Verify production**

```bash
curl -sf https://alexmayhew.dev/api/health | python3 -m json.tool
curl -sI https://alexmayhew.dev/ | grep -iE "content-security|x-frame|strict-transport"
```
