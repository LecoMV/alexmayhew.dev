# Deployment Guide - alexmayhew.dev

> **Last Updated:** 2026-01-27
> **Status:** Production - GitHub Actions CI/CD

## Overview

This project uses **GitHub Actions for all deployments**. Pushing to GitHub automatically triggers build, validation, and deployment to Cloudflare Pages.

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐     ┌────────────────┐
│ Local Dev   │ --> │ GitHub Push  │ --> │ GitHub Actions│ --> │ Cloudflare     │
│ (git commit)│     │ (trigger)    │     │ (build/test)  │     │ Pages (deploy) │
└─────────────┘     └──────────────┘     └───────────────┘     └────────────────┘
```

## How to Deploy

### The ONLY Way to Deploy

```bash
# Make your changes
git add <files>
git commit -m "your message"
git push origin main
```

That's it. GitHub Actions handles everything:

1. **Validate** - TypeScript, ESLint, Next.js build
2. **Build OpenNext** - Creates Cloudflare-compatible bundle
3. **Deploy** - Pushes to Cloudflare Pages
4. **Health Check** - Verifies `/api/health` returns 200
5. **Smoke Tests** - Checks critical pages

### NEVER Do This

```bash
# ❌ WRONG - These bypass safety checks
npm run deploy
npx wrangler deploy
npx wrangler pages deploy
npx opennextjs-cloudflare deploy
```

## Workflow Triggers

| Event          | Action                    | Environment            |
| -------------- | ------------------------- | ---------------------- |
| Push to `main` | Full deploy to production | https://alexmayhew.dev |
| Pull Request   | Preview deployment        | Unique preview URL     |
| Manual         | **FORBIDDEN**             | -                      |

## GitHub Actions Configuration

### Required Secrets

Set in: https://github.com/LecoMV/alexmayhew.dev/settings/secrets/actions

| Secret                  | Description                                               |
| ----------------------- | --------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | Cloudflare API token with "Pages Edit" permission         |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID: `7a614aa1a5509b080b4e8cc556440e71` |

### Workflow File

Location: `.github/workflows/deploy.yml`

Jobs:

1. **validate** - Runs on every push/PR
2. **deploy-preview** - Runs on PRs only
3. **deploy-production** - Runs on push to main only

## OpenNext Compatibility

### Edge Runtime Restriction

**CRITICAL:** API routes cannot use `export const runtime = "edge"` with OpenNext.

```typescript
// ❌ WRONG - Will fail OpenNext build
export const runtime = "edge";

// ✅ CORRECT - Let OpenNext handle runtime
// (no runtime export)
```

### Supported Features

- App Router (pages, layouts, routes)
- API Routes (Node.js runtime only)
- Server Components
- Static Generation (generateStaticParams)
- Dynamic Routes
- Middleware (with limitations)

### Unsupported Features

- Edge Runtime in API routes
- Some Next.js experimental features
- Node.js-specific APIs in edge contexts

## Health Check Endpoint

**URL:** `https://alexmayhew.dev/api/health`

**Response:**

```json
{
	"status": "ok",
	"timestamp": "2026-01-27T02:30:00.000Z",
	"deployment": {
		"sha": "abc1234",
		"buildTime": "2026-01-27T02:25:00.000Z",
		"version": "0.1.0"
	}
}
```

Used by GitHub Actions to verify successful deployments.

## Rollback Procedure

If a deployment breaks production:

1. **Go to Cloudflare Dashboard**
   - Workers & Pages → alexmayhew-dev → Deployments

2. **Find Last Working Deployment**
   - Look at deployment history
   - Identify the last successful deployment

3. **Rollback**
   - Click "..." → "Rollback to this deployment"
   - Confirm the rollback

4. **Fix the Issue**
   - Debug locally
   - Push a fix commit

## Troubleshooting

### Build Fails

| Error                 | Cause                           | Fix                     |
| --------------------- | ------------------------------- | ----------------------- |
| TypeScript error      | Type mismatch                   | Fix types locally       |
| ESLint error          | Lint rule violation             | Run `npm run lint:fix`  |
| OpenNext edge runtime | `export const runtime = "edge"` | Remove runtime export   |
| Missing dependency    | Package not in package.json     | `npm install <package>` |

### Deploy Fails

| Error               | Cause         | Fix                      |
| ------------------- | ------------- | ------------------------ |
| Health check failed | Runtime error | Check Cloudflare logs    |
| Smoke test failed   | Page 500      | Check specific route     |
| API token invalid   | Token expired | Regenerate in Cloudflare |

### Checking Logs

```bash
# View latest run
GITHUB_TOKEN=$(pass show claude/github/token) gh run list --repo LecoMV/alexmayhew.dev --limit 5

# View specific run details
GITHUB_TOKEN=$(pass show claude/github/token) gh run view <RUN_ID> --repo LecoMV/alexmayhew.dev

# View failed job logs
GITHUB_TOKEN=$(pass show claude/github/token) gh run view <RUN_ID> --log-failed --repo LecoMV/alexmayhew.dev
```

## Pre-Commit/Pre-Push Hooks

### Pre-Commit (Husky + lint-staged)

Runs on every commit:

- ESLint fix
- Prettier format

### Pre-Push

Runs before every push:

- TypeScript check

If either fails, the commit/push is blocked.

## Local Development

```bash
# Start dev server (recommended)
SKIP_CF_DEV=1 PORT=3001 npm run dev

# With Cloudflare bindings (requires wrangler login)
PORT=3001 npm run dev

# Build locally (same as CI)
npm run build

# Test OpenNext build locally
npx opennextjs-cloudflare build
```

## Version Tracking

Every deployment includes:

- **Git SHA** in `/api/health` response
- **Build timestamp**
- **Site version** from package.json

Check deployed version:

```bash
curl -s https://alexmayhew.dev/api/health | jq
```

## Architecture Decisions

### Why GitHub Actions (not Cloudflare Pages Git Integration)?

1. **OpenNext Compatibility** - Native Pages integration doesn't support OpenNext well
2. **Build Control** - Full control over build process
3. **Validation** - Run tests and checks before deploy
4. **Artifact Caching** - Share build between validate and deploy jobs

### Why Not Manual Deploys?

1. **No Validation** - Skip typecheck, lint, tests
2. **No Audit Trail** - No record in GitHub
3. **No Rollback** - Harder to track what was deployed
4. **Inconsistent** - Different environments between local and CI

## Maintenance

### Updating GitHub Actions

Dependabot creates PRs for action updates. Review and merge carefully:

- Check changelog for breaking changes
- Verify PR preview deployment works

### Rotating Secrets

1. Generate new Cloudflare API token
2. Update GitHub secret `CLOUDFLARE_API_TOKEN`
3. Old token will stop working immediately

### Monitoring

- **GitHub Actions** - Check workflow runs for failures
- **Cloudflare Analytics** - Monitor traffic and errors
- **Health Endpoint** - Automated by CI, can also monitor externally
