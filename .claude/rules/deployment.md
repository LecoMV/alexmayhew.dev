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
