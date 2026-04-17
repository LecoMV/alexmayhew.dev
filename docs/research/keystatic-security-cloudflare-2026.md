# Keystatic CMS Security & Cloudflare Compatibility Research (2026-03-14)

**Status:** CURRENT
**Session:** Researching authentication exposure risk for /keystatic routes deployed to Cloudflare Workers via OpenNext

---

## Key Findings (Summary)

1. **LOCAL MODE HAS NO AUTHENTICATION** — `/keystatic` routes with `kind: "local"` are publicly accessible with zero auth. Anyone can read and write content.
2. **GITHUB MODE AUTH IS BROKEN ON CLOUDFLARE WORKERS** — OAuth state generation fails on edge runtime (issue #1497, unresolved as of January 2026). GitHub mode cannot be used as the auth layer on this stack.
3. **THE CURRENT PRODUCTION CONFIG IS EXPOSED** — `keystatic.config.ts` falls back to `kind: "local"` if `KEYSTATIC_GITHUB_CLIENT_ID` is not set. If that env var is absent from Cloudflare Workers secrets, local mode runs in production with no auth.
4. **THE OFFICIAL FIX IS A 3-LINE CHANGE** — Keystatic's own docs show how to hard-disable the routes in production via `notFound()`. This is the correct immediate fix.
5. **GITHUB MODE IS ARCHITECTURALLY INCOMPATIBLE WITH THIS STACK** — Even if env vars are set, GitHub OAuth state generation is broken on Cloudflare Workers (node crypto vs web crypto issue).

---

## Question-by-Question Findings

### 1. Does Keystatic have built-in authentication?

**Local mode:** No authentication whatsoever. Designed for local development only. The maintainers explicitly state: "local mode lacks authentication — it's intended for development only." (GitHub Discussions #315)

**GitHub mode:** Uses GitHub OAuth 2.0 via a registered GitHub App. Only users with **write access** to the connected repository can access `/keystatic`. The OAuth flow requires:

- `KEYSTATIC_GITHUB_CLIENT_ID`
- `KEYSTATIC_GITHUB_CLIENT_SECRET`
- `KEYSTATIC_SECRET` (session signing key)
- `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`

**The security model:** GitHub repo permissions ARE the access control. No separate user database.

---

### 2. Is Keystatic functional on Cloudflare Workers / edge runtime?

**Local mode:** Definitively incompatible. Requires `fs` (file system) access which does not exist in Workers runtime.

**GitHub mode on Cloudflare Workers (OpenNext):** Broken. Bug #1497 (open, January 2026) documents that OAuth state parameter generation fails:

- No OAuth state is generated in the redirect URL to GitHub
- No `Set-Cookie` header is set
- Results in 401 Unauthorized on callback
- Root cause: Keystatic's `packages/keystatic/src/api/github.ts` and `api/cookies.ts` use Node.js crypto and cookie APIs incompatible with Web Crypto API used by Workers runtime
- This affects Cloudflare Pages, Deno Deploy, Bun, and other edge/serverless platforms

**Workaround available:** Keystatic Cloud mode bypasses GitHub OAuth entirely and reportedly works on Cloudflare Pages. Requires a Keystatic Cloud account.

---

### 3. How to protect /keystatic routes in Next.js

**Option A — Official Keystatic recipe (disable in production):**
Keystatic docs: https://keystatic.com/docs/recipes/nextjs-disable-admin-ui-in-production

Three files to change:

`keystatic.config.ts`:

```typescript
export const showAdminUI = process.env.NODE_ENV === "development";
```

`src/app/keystatic/layout.tsx`:

```typescript
import { notFound } from "next/navigation";
import { showAdminUI } from "../../../keystatic.config";
import KeystaticApp from "./keystatic";

export default function Layout() {
  if (!showAdminUI) notFound();
  return <KeystaticApp />;
}
```

`src/app/api/keystatic/[...params]/route.ts`:

```typescript
import { makeRouteHandler } from "@keystatic/next/route-handler";
import config, { showAdminUI } from "../../../../../keystatic.config";

const notFoundHandler = () => new Response(null, { status: 404 });

export const { POST, GET } = showAdminUI
	? makeRouteHandler({ config })
	: { GET: notFoundHandler, POST: notFoundHandler };
```

**Option B — Middleware-based IP allowlist (if UI needed in production):**
Add to `middleware.ts` before the CSP block:

```typescript
if (request.nextUrl.pathname.startsWith("/keystatic")) {
	const ip = request.headers.get("cf-connecting-ip") ?? "";
	const ALLOWED_IPS = (process.env.KEYSTATIC_ALLOWED_IPS ?? "").split(",");
	if (!ALLOWED_IPS.includes(ip)) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}
}
```

**Option C — Clerk middleware protection (if Clerk is added later):**

```typescript
export default clerkMiddleware(async (auth, request) => {
	if (request.nextUrl.pathname.startsWith("/keystatic")) {
		await auth.protect();
	}
});
```

Note: Clerk is not currently installed in this project.

---

### 4. Should /keystatic be in the production build at all?

**Recommended answer: No, if content editing only happens locally or via git.**

The site uses git-based content (MDX files in `content/blog/`). The Keystatic admin is a convenience layer for non-developer content editing. Since:

- GitHub mode is broken on Cloudflare Workers
- Local mode has no auth
- Content can be edited directly via git

The safest posture is to hard-disable the routes in production using Option A above. The build still includes the code (bundle size impact is minimal — Keystatic UI is lazy-loaded client-side), but all routes return 404.

**If the routes must exist in production**, they need middleware-based protection since GitHub OAuth cannot be used on this runtime.

---

### 5. Does GitHub mode use GitHub OAuth? Is it production-safe?

GitHub mode does use GitHub OAuth 2.0 via a custom GitHub App. It is production-safe on Node.js runtimes (Vercel, Railway, self-hosted). It is NOT production-safe on Cloudflare Workers due to bug #1497.

The access model is solid: only users with `write` access to the `LecoMV/alexmayhew.dev` repo can authenticate. This is a clean, auditable access control mechanism — but it cannot be used on this stack without a fix from the Keystatic maintainers.

---

### 6. Should /keystatic be on a separate domain/subdomain?

**Mainstream best practice for CMS admin panels:** Yes — separate subdomain (e.g., `cms.alexmayhew.dev`) allows:

- Different CSP headers (the current CSP would block Keystatic's UI JavaScript anyway — `connect-src 'self'` is too restrictive for GitHub API calls)
- Different rate limiting and WAF rules
- Ability to geo-restrict or IP-restrict without affecting the public site

**For this specific site:** This is overkill. The content editor is a solo operator (Alex). The right answer is Option A: hard-disable in production, use local mode during dev.

---

## Current State Assessment

```
keystatic.config.ts storage logic:
  production + KEYSTATIC_GITHUB_CLIENT_ID set  → github mode (broken OAuth)
  production + no env var                      → local mode (NO AUTH)
  development                                  → local mode (expected, fine)
```

**Risk:** If `KEYSTATIC_GITHUB_CLIENT_ID` is not set in Cloudflare Workers secrets (which it is not — `wrangler.jsonc` has no vars set), the site deploys with local mode in production. The `/keystatic` admin is publicly accessible at `https://alexmayhew.dev/keystatic` with **no authentication**. Anyone can read and write blog content.

Verify current exposure:

```bash
curl -s -o /dev/null -w "%{http_code}" https://alexmayhew.dev/keystatic
```

A `200` response confirms the route is live and unauthenticated.

---

## Recommended Fix (Immediate)

Apply Option A (disable in production). It is:

- Three small file changes
- Zero new dependencies
- Official Keystatic recommendation
- Reversible (uncomment for local dev, nothing changes)
- Compatible with Cloudflare Workers (no runtime restrictions)

After the fix, `curl https://alexmayhew.dev/keystatic` returns 404.

---

## Sources

- [Keystatic: Disable Admin UI in Production](https://keystatic.com/docs/recipes/nextjs-disable-admin-ui-in-production)
- [Keystatic: GitHub Mode Docs](https://keystatic.com/docs/github-mode)
- [Keystatic: Local Mode Docs](https://keystatic.com/docs/local-mode)
- [Keystatic Discussion #315: Authentication](https://github.com/Thinkmill/keystatic/discussions/315)
- [Keystatic Issue #1497: OAuth State Broken on Cloudflare Pages](https://github.com/Thinkmill/keystatic/issues/1497)
- [Keystatic Issue #1229: Env Vars on Cloudflare Pages](https://github.com/Thinkmill/keystatic/issues/1229)
- [OpenNext Cloudflare Docs](https://opennext.js.org/cloudflare)
