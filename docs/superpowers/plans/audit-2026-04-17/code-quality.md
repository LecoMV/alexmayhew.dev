# Code Quality Audit — 2026-04-17 (React 19 / Next 15)

Clean baseline: async params/searchParams consistent, Zod at external boundaries, Server Actions use `useActionState`/`useFormStatus`, no `any`, no `@ts-ignore`, no bare `try/catch`.

## P0 — None

## P1 — High priority

1. **Unnecessary full-page `'use client'` directives** — forces entire tree client-rendered:
   - `src/components/pages/work-page.tsx:1` — only `useState` for category filter. Extract filter as island.
   - `src/components/pages/case-study-page.tsx:1` — only `useState` for `expandedChallenge` accordion.
   - `src/app/home-page.tsx:1` — motion + 1 `onClick` tracker. Mirror `about-page.tsx` server+client split pattern.
   - `src/app/for/for-hub-page.tsx`, `technologies/technologies-page-content.tsx`, `for/[role]/role-page-content.tsx`, `services/services-page-content.tsx`, `services/[slug]/service-page-content.tsx` — all client; most content static.

2. **`useEffect` for `window.location.href`** — `src/components/blog/blog-article.tsx:51-53`. Causes render-then-effect flash per article view. Pass URL from server page or use `usePathname()`.

3. **React Compiler not enabled** — `next.config.mjs` no `experimental.reactCompiler`. Would remove most `useMemo`/`useCallback` (5 `useEffect`s + 3 `useMemo`s + 1 `useCallback` in `table-of-contents.tsx` alone).

4. **Non-null assertion crash risk** — `src/components/pages/case-study-page.tsx:31`: `const cs = project.caseStudy!;`. Parent should narrow with `if (!project.caseStudy) notFound()` and pass `caseStudy` as prop. Today a `caseStudy: undefined` project would crash client-side.

## P2 — Medium

5. **Missing `loading.tsx` everywhere** — `glob src/app/**/loading.tsx` returned zero. Blog, services, technologies, for/[role], work/[slug] all benefit from streaming skeletons.

6. **`error.tsx` coverage gaps** — only 3 exist (`app/error.tsx`, `demo/error.tsx`, `tools/traceforge/error.tsx`). Missing on `/blog`, `/services`, `/technologies`, `/for`, `/work`.

7. **`formData.get() as string` lossy casts** — `src/app/actions/contact.ts:63-69`, `newsletter.ts:30-32`. `FormDataEntryValue` is `string | File`. Use `z.object({...}).safeParse(Object.fromEntries(formData))`.

8. **Dead type cast** — `src/app/actions/contact.ts:71`: `raw as ContactFormValues` bypasses type system one layer before `safeParse` runs anyway. Drop cast, change param to `unknown`.

9. **Barrel re-exports** — `src/lib/vectorizer/index.ts:10-11` uses `export *`. Tree-shaking can't always drop through re-export barrels on Cloudflare Workers. Prefer named re-exports.

10. **`table-of-contents.tsx` complexity** — 538 lines, 5 `useEffect`s, 3 inline render blocks (~60 lines each). Split into `toc-desktop.tsx` + `toc-mobile.tsx`.

11. **`submitContactForm` complexity** — `contact.ts:74-212` (~140 lines) with retry + validation + rate-limit + turnstile + email render. Violates 50-line cap. Extract `checkRateLimit`, `verifyBotProtection`, `sendContactEmail` helpers.

12. **`console.*` in server actions** — `contact.ts:29,143,197,206`; `newsletter.ts:94,121,135`. Use `src/lib/logger.ts` for structured request-id correlated logs.

13. **Suspense coverage is one-off** — only `page-analytics.tsx:14` wraps in `<Suspense>`. Async Server Components in routes without `loading.tsx` block whole route.

## Verified clean

- TS strict (2 defensible casts in retry error typing)
- Async params Promise shape everywhere
- Zod at external boundaries (contact, newsletter, vectorizer, env)
- Server Actions use `useActionState`
- Edge compat (no fs/path in runtime)
