# Cloudflare Workers + OpenNext deploy stack — source of truth (2026-05-21)

> **Status:** CURRENT
> **Scraped from:** developers.cloudflare.com + opennext.js.org + GitHub raw via Brightdata MCP
> **Coverage:** 22 official doc pages, 763 KB markdown
> **Trigger:** Production deploy of alexmayhew.dev (PR #93, TUS merge) failed 2026-05-21 04:48 UTC with `edge-preview` `Authentication error [code: 10000]`. Investigation revealed CF infrastructure changes + OpenNext default behavior interaction.

## TL;DR

Production alexmayhew.dev deploys are failing because OpenNext's `opennextjs-cloudflare deploy` command calls wrangler's `getPlatformProxy()` (via its `getEnvFromPlatformProxy` helper), and **`getPlatformProxy()` now defaults `remoteBindings: true`** (changed June 25, 2025). That triggers a `POST /accounts/{id}/workers/subdomain/edge-preview` request, which:

1. Rejects every authentication scheme available to us (Bearer tokens AND Global API Key both return `method_not_allowed`).
2. Is not documented as having any standard auth path — it's an internal wrangler endpoint.

**Fix path (recommended):** replace `npx opennextjs-cloudflare deploy` in `.github/workflows/deploy.yml` with the official Cloudflare pattern:

```yaml
- run: npx opennextjs-cloudflare build
  env:
    NEXT_PUBLIC_GIT_SHA: ${{ github.sha }}
- uses: cloudflare/wrangler-action@v3
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

This skips OpenNext's deploy wrapper (which calls the problematic `getPlatformProxy`) and uses `wrangler deploy` directly. We lose OpenNext's `populateCache` (remote R2 incremental cache pre-warm) and skew-protection mapping, but neither is essential — both can be added back as separate steps if needed.

---

## Stack reality check (as of 2026-05-21)

### Cloudflare Pages is in maintenance — Workers Static Assets is the new home

- **Pages docs banner:** "Cloudflare recommends migrating from Pages to Workers" (per multiple search hits, HN thread, official migration guide).
- **Migration path:** `https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/`
- **What this means for us:** alexmayhew.dev is _already_ on Workers (the `wrangler.jsonc` config has `"main": "./custom-worker.ts"` — that's a Workers project, not a Pages project). Good — we're on the right side of the migration. But our `deploy.yml` still has comments/structure suggesting Pages-era thinking.
- The OpenNext + Workers Static Assets combination is now the **officially recommended** Next.js-on-CF path (per `https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/`).

### Wrangler v4 is the current major

- Released early 2025, breaking changes documented at `https://developers.cloudflare.com/workers/wrangler/migration/update-v3-to-v4/`.
- **`getBindingsProxy()` removed** — replaced by `getPlatformProxy()` (same args).
- New Node.js minimum: v20.
- `usage_model` deprecated.

### `getPlatformProxy()` — the API that's blowing up our deploy

**Signature:**

```js
const platform = await getPlatformProxy(options);
```

**Options object (current):**
| Field | Type | Default | Notes |
|---|---|---|---|
| `environment` | string | — | Wrangler env to use |
| `configPath` | string | searches upward from cwd | Path to `wrangler.jsonc` |
| `persist` | boolean \| `{ path }` | `true` | Where to persist binding data |
| **`remoteBindings`** | **boolean** | **`true` ← THE CULPRIT** | Whether to connect to remote bindings |

The `remoteBindings: true` default was added 2025-06-25 to support Remote Bindings beta (D1/KV/R2 in local dev). Source: `https://developers.cloudflare.com/changelog/post/2025-06-25-getplatformproxy-support-remote-bindings/`.

### OpenNext's `getEnvFromPlatformProxy` doesn't override the default

From OpenNext source `packages/cloudflare/src/cli/commands/utils/helpers.ts`:

```ts
export async function getEnvFromPlatformProxy(
	options: GetPlatformProxyOptions,
	buildOpts: BuildOptions
) {
	const envVars = process.env;
	const proxy = await getPlatformProxy<CloudflareEnv>({
		...options,
		envFiles: [], // ← only override is empty envFiles
	});
	// ... copies proxy.env into envVars
}
```

The `options` passed in by `deployCommand()` does **not** include `remoteBindings: false`. So `getPlatformProxy` runs with `remoteBindings: true` and tries to open a remote session via `edge-preview`.

### The `edge-preview` endpoint rejects all standard auth

We verified this directly from this host (Kali, 73.186.6.49):

```bash
# Bearer token (API token):
POST /accounts/{id}/workers/subdomain/edge-preview
→ {"code": 10405, "message": "Method not allowed for this authentication scheme"}

# Global API Key (X-Auth-Email + X-Auth-Key):
→ {"code": 1001, "error": "method_not_allowed"}
```

When wrangler in GH Actions hits the same endpoint, CF returns `10000 Authentication error` (slightly different code, same root cause — endpoint refuses the auth scheme).

**The endpoint appears to require an interactive OAuth flow** (`wrangler login`), which is not viable in CI. There is no documented CI-compatible auth path for this endpoint.

---

## Why the deploy worked April 17 but fails now

OpenNext `^1.18.0` was pinned in package.json at both dates. The semver caret allows minor + patch upgrades. Likely sequence:

1. Some npm-install between Apr 17 and May 21 picked up a newer wrangler bundled inside `@opennextjs/cloudflare`.
2. That newer wrangler updated `getPlatformProxy`'s default to `remoteBindings: true`.
3. With `remoteBindings: true`, the helper now attempts the `edge-preview` API call.
4. The endpoint doesn't accept any auth scheme available to GH Actions runners.

We cannot pin our way out via package-lock alone — the bundled wrangler will keep advancing unless we lock OpenNext to an older patch (~1.17 or earlier, pre-remote-bindings-default change). Risky regression.

---

## Fix options ranked

### Option 1 — Use official `cloudflare/wrangler-action@v3` (RECOMMENDED)

Replace OpenNext's deploy wrapper with the official CF GitHub Action. CF docs show this exact pattern at `https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/`:

```yaml
- uses: actions/checkout@v6
- run: npm ci
- run: npx opennextjs-cloudflare build
  env:
    NEXT_PUBLIC_GIT_SHA: ${{ github.sha }}
- uses: cloudflare/wrangler-action@v3
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    # no command needed — defaults to `wrangler deploy`
```

**Pros:**

- Official CF-supported pattern.
- Bypasses `getPlatformProxy` entirely. `wrangler deploy` doesn't call it.
- Decoupled from OpenNext deploy command's changing default behavior.

**Cons:**

- Loses OpenNext's `populateCache` (remote R2 incremental cache pre-warm) and skew-protection deployment mapping (`DEPLOYMENT_MAPPING_ENV_NAME` env var).
- We'd need separate steps to add those back if/when needed.

### Option 2 — Patch OpenNext to pass `remoteBindings: false`

Submit a PR to opennextjs/opennextjs-cloudflare changing `helpers.ts` to default `remoteBindings: false` in `getEnvFromPlatformProxy`. Long-term correct fix. Short-term: monkey-patch `node_modules` in a postinstall hook (fragile, but unblocks us).

**Pros:**

- Keeps `opennextjs-cloudflare deploy` working end-to-end.
- Preserves `populateCache` + skew protection.

**Cons:**

- Monkey-patch is fragile — npm install resets it.
- Upstream PR takes time to merge + release.
- Doesn't address the root issue (Wrangler's default changed without backward-compat consideration for `opennextjs-cloudflare deploy` running in CI).

### Option 3 — Downgrade `@opennextjs/cloudflare` (and wrangler with it)

Pin to a version before the bundled wrangler picked up `remoteBindings: true` default. Probably `1.16.x` or older.

**Pros:** Fastest unblock.
**Cons:** Loses recent OpenNext fixes/features. Tech debt. Eventually have to migrate forward anyway.

### Option 4 — Skip `opennextjs-cloudflare deploy`, run `wrangler deploy` directly

Same intent as Option 1 but via `npx wrangler deploy` instead of the `wrangler-action`. Equivalent outcome, less abstraction.

---

## What `wrangler-action@v3` actually does

From `https://github.com/cloudflare/wrangler-action`:

1. Installs the wrangler version pinned in your `package.json` (or installs `wrangler@latest` if missing).
2. Sets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` env vars.
3. Runs `wrangler deploy` by default (configurable via `command:`).
4. Captures the deployment URL into a step output.
5. Optionally posts a PR comment with the deploy URL (`preview:` mode).

**Key:** it does NOT call any wrangler API function — only the `wrangler deploy` CLI command, which reads `wrangler.jsonc` and uploads the built worker. No `getPlatformProxy`. No `edge-preview`.

---

## CF API token scope minimums for `wrangler deploy`

From CF docs + community references:

| Scope                                   | Required for                                            |
| --------------------------------------- | ------------------------------------------------------- |
| Workers Scripts: Edit                   | The actual deploy                                       |
| Workers KV Storage: Edit                | KV namespace management (RATE_LIMIT_KV in our case)     |
| Workers R2 Storage: Edit                | R2 bucket management (NEXT_INC_CACHE_R2_BUCKET)         |
| Workers AI: Read                        | AI binding                                              |
| Account Settings: Read                  | Account metadata                                        |
| Zone: Read (all zones)                  | Reading zone info for custom domains                    |
| **(NO Workers Subdomain: Edit needed)** | — the `wrangler deploy` path doesn't hit `edge-preview` |

**No IP allowlist** on the token — GH Actions runners are Azure cloud, IPs rotate.

---

## Authoritative URLs (scraped 2026-05-21 — fresh)

### Cloudflare

- Workers homepage: https://developers.cloudflare.com/workers/
- Static Assets: https://developers.cloudflare.com/workers/static-assets/
- Migrate Pages → Workers: https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/
- Wrangler API reference: https://developers.cloudflare.com/workers/wrangler/api/
- Wrangler commands: https://developers.cloudflare.com/workers/wrangler/commands/
- Wrangler configuration: https://developers.cloudflare.com/workers/wrangler/configuration/
- Wrangler v3 → v4 migration: https://developers.cloudflare.com/workers/wrangler/migration/update-v3-to-v4/
- GitHub Actions CI/CD: https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/
- Next.js framework guide: https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- Multi-Workers dev: https://developers.cloudflare.com/workers/development-testing/multi-workers/
- Errors reference: https://developers.cloudflare.com/workers/observability/errors/
- Remote bindings changelog (root cause): https://developers.cloudflare.com/changelog/post/2025-06-25-getplatformproxy-support-remote-bindings/

### OpenNext

- Cloudflare adapter index: https://opennext.js.org/cloudflare
- Get started: https://opennext.js.org/cloudflare/get-started
- CLI reference: https://opennext.js.org/cloudflare/cli
- Bindings (remote bindings opt-in): https://opennext.js.org/cloudflare/bindings
- Dev & deploy how-to: https://opennext.js.org/cloudflare/howtos/dev-deploy
- Multi-worker setup: https://opennext.js.org/cloudflare/howtos/multi-worker
- Troubleshooting: https://opennext.js.org/cloudflare/troubleshooting
- Caching: https://opennext.js.org/cloudflare/caching
- Env vars: https://opennext.js.org/cloudflare/howtos/env-vars

### Useful tip — markdown access to all CF docs

Every CF docs page supports a markdown version. Append `index.md` to the URL or send `Accept: text/markdown`:

```
https://developers.cloudflare.com/workers/wrangler/api/         (HTML — bloated)
https://developers.cloudflare.com/workers/wrangler/api/index.md (Markdown — clean)
```

CF also exposes index files:

- `https://developers.cloudflare.com/llms.txt` (all products index)
- `https://developers.cloudflare.com/workers/llms.txt` (Workers-specific)
- `https://developers.cloudflare.com/changelog/llms.txt` (changelogs)

This is the cleanest way to scrape CF docs going forward — no HTML stripping needed.

---

## Local file inventory

Saved to `docs/research/`:

- `cf-workers-docs-2026-05-21/` — 10 files, 514 KB (Workers/Wrangler/Static Assets/CI-CD/Errors)
- `opennext-docs-2026-05-21/` — 8 files, 140 KB (OpenNext CF adapter)
- `cf-extra-2026-05-21/` — 4 files, 91 KB (changelog, dev-testing, OpenNext helpers source, env-vars)

All scraped via Brightdata MCP `scrape_batch` (10 URLs/batch limit). Total: 22 doc pages, ~745 KB.

---

## Action items (cross-references)

| Item                                                                                                   | Where                                                           |
| ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| Update `.github/workflows/deploy.yml` to use `cloudflare/wrangler-action@v3`                           | `.github/workflows/deploy.yml` deploy-production job            |
| Drop the LISTMONK env-var validation gates                                                             | same file (Listmonk gone since 1108678)                         |
| Update CLAUDE.md to reflect Workers (not Pages)                                                        | project root CLAUDE.md "Deploy" line                            |
| Update AGENTS.md token-scope spec                                                                      | AGENTS.md                                                       |
| Verify CF API token scopes (drop Workers Subdomain: Edit — not needed once we bypass getPlatformProxy) | CF dashboard                                                    |
| Add INFO file to pass for the new GH Actions CI token                                                  | `pass insert claude/cloudflare/api-token-amdev-gh-actions-INFO` |
