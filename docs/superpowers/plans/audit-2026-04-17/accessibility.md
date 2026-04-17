# Accessibility Audit — 2026-04-17 (WCAG 2.2 AA)

Overall: ~90% WCAG 2.1 AA compliant. To reach 2.2 AA: fix P0s below.

## P0 — WCAG A/AA failures

1. **h1 → h3 heading jumps (WCAG 1.3.1 A)** — systemic on:
   - `src/app/privacy/page.tsx:34,39` (10 instances)
   - `src/app/terms/page.tsx:34,39` (9 instances)
   - `src/components/pages/contact-page.tsx:144,416`
   - `src/components/pages/about-page.tsx:140,192`
   - `src/components/pages/tools-page.tsx:87,119`
     Fix: demote h1→h2 for sections or convert styled h3→h2.

2. **Command palette backdrop click handler on non-interactive div (WCAG 2.1.1 A, 4.1.2 A)** — `src/components/ui/command-palette.tsx:79-82`. `<div onClick={() => setOpen(false)}>` — not keyboard reachable. Replace with `<button type="button" aria-label="Close search">` or remove handler (Escape already works).

3. **Focus trap missing in modals (WCAG 2.4.3 A, 2.1.2 A)**
   - `src/components/chat/chat-widget.tsx:239-248` — `role="dialog" aria-modal="true"` but no focus trap.
   - `src/components/ui/command-palette.tsx:85` — same.
     Fix: `focus-trap-react` or native `inert` on background; return focus to trigger on close.

## P1 — Should fix

4. **WCAG 2.2 Target Size 2.5.8 AA** — re-verify `navigation.tsx:300` search trigger and `share-buttons.tsx` icon-only buttons yield ≥24×24 after rendering.

5. **Contact form fields not linked to error message (WCAG 3.3.1 A, 1.3.1 A)** — `src/components/pages/contact-page.tsx:172-196`. Add `aria-invalid={!!state.error}` and `aria-describedby="contact-error"` on inputs; give error alert `id="contact-error"`.

6. **Success message not announced (WCAG 4.1.3 AA)** — `contact-page.tsx:380-388`. Add `role="status"` to success `<m.p>`.

7. **Cookie consent X = decline conflation (WCAG 3.3.2 A)** — `src/components/ui/cookie-consent.tsx:137-143`. Relabel to `aria-label="Decline and close"` or add neutral "remind me later" path.

8. **Decorative pulse dots missing `aria-hidden`** — `src/components/ui/navigation.tsx:354,408,436`.

9. **Color contrast 1.4.3 AA borderline failures**
   - `text-slate-text/60` on void-navy ≈ **3.4:1** — FAILS 4.5:1. Used in:
     - `footer.tsx:146,156` (copyright, version)
     - `newsletter-signup.tsx:173`
     - `contact-page.tsx` placeholder text borderline
       Fix: raise `/60` → `/80` for actual text; keep decorative `/40` with `aria-hidden`.

## P2 — Enhancement

10. **Tools dropdown mouseleave 150ms race** — `navigation.tsx:116-120`. Disable timer when focus is within dropdown.
11. **Skip link target missing `tabIndex={-1}`** — `layout.tsx:166` `<main id="main-content">`. Some browsers won't focus after skip.
12. **WCAG 2.2 Focus Not Obscured 2.4.11 AA** — add `scroll-padding-top` to `<html>` globals for sticky header.
13. **WCAG 2.2 Redundant Entry 3.3.7 A** — contact form loses email value on failed Turnstile. Use `defaultValue={state.values?.email}`.
14. **Cookie consent lacks landmark role** — `cookie-consent.tsx:102`. Add `role="region" aria-label="Cookie consent"`.

## Verified compliant

- Skip link, Escape dismisses dropdowns, `reducedMotion="user"`, semantic landmarks, form labels `htmlFor`/`id`, `aria-expanded`/`aria-haspopup`/`aria-controls`, logo alt text, social icon aria-labels, quiz error linked via `aria-describedby`, `cyber-lime` contrast 12.5:1 AAA.
