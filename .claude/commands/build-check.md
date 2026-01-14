# Build Check

Run the full build pipeline to verify the project compiles correctly.

## Steps

1. Run TypeScript type checking
2. Run ESLint
3. Run Next.js build
4. Report any errors

```bash
npx tsc --noEmit && npm run lint && npm run build
```

If errors occur, fix them before proceeding.
