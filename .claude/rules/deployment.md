# Deployment Rules (MANDATORY)

## Golden Rule

**NEVER run manual deploy commands:**

- `npm run deploy`
- `npx wrangler deploy`
- `npx wrangler pages deploy`
- `npx opennextjs-cloudflare deploy`

## How to Deploy

```bash
git add <files>
git commit -m "your message"
git push origin main
```

GitHub Actions handles: typecheck → lint → build → deploy → health check → smoke tests.

## Before Every Push

```bash
npm run build  # Includes typecheck + lint
```

## If Production Breaks

1. **DO NOT** deploy manually to fix
2. Rollback via Cloudflare Dashboard: Workers & Pages → alexmayhew-dev → Deployments → Rollback
3. Fix locally, push new commit

## Health Check

```bash
curl -s https://alexmayhew.dev/api/health | jq
```

## Technical Requirements

See @.claude/rules/opennext.md for R2 binding and edge runtime restrictions.

## Full Documentation

See @docs/DEPLOYMENT.md for comprehensive deployment guide.
