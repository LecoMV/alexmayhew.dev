# Development Discipline (MANDATORY)

## Pre-Commit Checklist

Every commit MUST pass these checks locally before pushing:

1. `npm run build` — catches TypeScript errors, ESLint violations, build failures
2. `npx vitest run` — all tests pass
3. `git diff --staged` — only intended files are staged, no secrets

## CI/CD Awareness

- CI runs stricter ESLint rules than local dev (e.g., `no-require-imports`, `exhaustive-deps`)
- ALWAYS run full lint locally before pushing — don't rely on CI to catch lint errors
- Monitor GitHub Actions after every push until the deploy completes
- If CI fails: fix locally, push a new commit (never force-push to main)

## Common CI Failures to Avoid

- `require()` in TypeScript files → use `import` or `await import()`
- `setState` inside `useEffect` → React 19 flags as cascading render
- Missing `useEffect` dependencies → extract to stable variables, add to deps
- Unused imports/variables → remove before committing
- `any` types → use explicit types

## Testing Standards

- Write tests BEFORE implementation when possible (TDD)
- Test edge cases: empty arrays, null values, API failures, network timeouts
- Mock external services (APIs, databases) — tests must run without network
- If a test is flaky, fix the root cause — don't skip or retry

## Error Handling

- No bare `try/catch` — catch specific exception types
- Log errors with context (what was being attempted, what failed)
- Fail gracefully for non-critical features (fallback, not crash)
- Never swallow errors silently — at minimum log a warning

## Don't Over-Engineer

- Solve the stated problem, not hypothetical future ones
- Three similar lines of code is better than a premature abstraction
- Don't add features, refactor code, or make "improvements" beyond what was asked
- If unsure whether something is needed: don't build it yet
