# Deployment Rules (MANDATORY)

## Golden Rule

**NEVER run `npm run deploy` or any wrangler deploy command manually.**

This project uses GitHub Actions for all deployments. Manual deployments bypass safety checks and can break production.

## How to Deploy

```bash
# The ONLY correct way to deploy
git add <files>
git commit -m "your message"
git push origin main
```

That's it. GitHub Actions handles everything else:

1. Runs typecheck and lint
2. Builds Next.js
3. Builds OpenNext for Cloudflare
4. Deploys to Cloudflare Pages
5. Runs health checks
6. Runs smoke tests
7. Creates GitHub issue if anything fails

## Before Every Push

Verify locally:

```bash
npm run typecheck   # Must pass
npm run lint        # Must pass
npm run build       # Must succeed
```

## If Production Breaks

1. **DO NOT** try to fix by deploying again manually
2. **DO** rollback via Cloudflare Dashboard:
   - Workers & Pages → alexmayhew-dev → Deployments
   - Find last working deployment → Rollback
3. **THEN** fix the issue locally and push a new commit

## Forbidden Commands

```bash
# NEVER run these:
npm run deploy
npx wrangler deploy
npx wrangler pages deploy
npx opennextjs-cloudflare deploy

# These bypass all safety checks and can break production
```

## Why This Matters

Manual deployments:

- Skip typecheck validation
- Skip lint validation
- Skip health checks
- Skip smoke tests
- Have no audit trail
- Cannot be easily rolled back
- Don't update GitHub deployment status

Automated deployments via GitHub Actions:

- Run full validation pipeline
- Create deployment records
- Enable easy rollback
- Update GitHub status
- Notify on failure
- Leave audit trail

## OpenNext Technical Requirements

### R2 Binding Name (CRITICAL)

The R2 bucket binding MUST be named exactly `NEXT_INC_CACHE_R2_BUCKET` in wrangler.jsonc:

```jsonc
"r2_buckets": [
  {
    "binding": "NEXT_INC_CACHE_R2_BUCKET",  // ← Exact name required
    "bucket_name": "alexmayhew-dev-cache"
  }
]
```

**DO NOT** use `NEXT_CACHE` or any other name - OpenNext will fail with "No R2 binding 'NEXT_INC_CACHE_R2_BUCKET' found!"

### No Edge Runtime

API routes cannot use `export const runtime = "edge"` with OpenNext. Remove any such exports.

### GitHub Actions Hidden Files

The `.open-next/` directory requires `include-hidden-files: true` in upload-artifact action.

## Checking Deployment Status

```bash
# Check if site is healthy
curl -s https://alexmayhew.dev/api/health | jq

# Expected response
{
  "status": "ok",
  "timestamp": "...",
  "deployment": {
    "sha": "abc1234",
    "buildTime": "...",
    "version": "0.1.0"
  }
}

# Check GitHub Actions runs
GITHUB_TOKEN=$(pass show claude/github/token) gh run list --repo LecoMV/alexmayhew.dev --limit 5
```

## Credentials

GitHub repository secrets are configured:

- `CLOUDFLARE_API_TOKEN` - API token with Pages Edit permission
- `CLOUDFLARE_ACCOUNT_ID` - `7a614aa1a5509b080b4e8cc556440e71`

Local credentials:

- `pass show claude/cloudflare/api-token` - Cloudflare API token
- `pass show claude/github/token` - GitHub token for gh CLI
