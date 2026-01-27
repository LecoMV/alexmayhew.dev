---
paths:
  - "src/app/api/**/*.ts"
  - "wrangler.jsonc"
  - ".github/workflows/*.yml"
---

# OpenNext + Cloudflare Requirements

## Edge Runtime Restriction (CRITICAL)

API routes CANNOT use `export const runtime = "edge"` with OpenNext.

```typescript
// WRONG - Will fail OpenNext build
export const runtime = "edge";

// CORRECT - Let OpenNext handle runtime
// (no runtime export)
```

## R2 Binding Name (CRITICAL)

The R2 bucket binding MUST be named exactly `NEXT_INC_CACHE_R2_BUCKET`:

```jsonc
// wrangler.jsonc
"r2_buckets": [
  {
    "binding": "NEXT_INC_CACHE_R2_BUCKET",  // Exact name required
    "bucket_name": "alexmayhew-dev-cache"
  }
]
```

Using any other name causes: "No R2 binding 'NEXT_INC_CACHE_R2_BUCKET' found!"

## GitHub Actions Hidden Files

The `.open-next/` directory requires special handling:

```yaml
- uses: actions/upload-artifact@v4
  with:
    path: .open-next/
    include-hidden-files: true # Required for .open-next
```

## Environment Variables

- Local: Store in `.dev.vars`
- Production: Configure in Cloudflare Dashboard
- Access: `getCloudflareContext()` in server components
