# Plan B: Smooth Scroll & Framer Motion Transitions

**Goal:** Fix rough scrolling + replace all 35 duration-based Framer Motion transitions with spring physics.

**Tech Stack:** Lenis (smooth scroll), Framer Motion, motion-constants.ts

---

## Task 1: Tune Lenis Smooth Scroll

**File:** `src/components/providers/smooth-scroll.tsx`

- [ ] **Step 1:** Write test checking smooth-scroll.tsx has `duration` <= 1.0
- [ ] **Step 2:** Change config:
  - `duration: 1.2` → `duration: 0.8` (snappier)
  - `wheelMultiplier: 1` → `wheelMultiplier: 1.2` (more responsive)
  - `touchMultiplier: 2` → `touchMultiplier: 1.5` (less aggressive on mobile)
- [ ] **Step 3:** Run build, commit

## Task 2: Add micro-interaction spring constant

**File:** `src/lib/motion-constants.ts`

- [ ] **Step 1:** Add `microSpring` constant for 0.15s-equivalent transitions:
  ```ts
  export const microSpring = { type: "spring" as const, stiffness: 500, damping: 30 };
  ```
- [ ] **Step 2:** Add `gentleSpring` for 0.3s-equivalent overlay transitions:
  ```ts
  export const gentleSpring = { type: "spring" as const, stiffness: 200, damping: 25 };
  ```
- [ ] **Step 3:** Commit

## Task 3: Replace duration-based transitions

**Mapping:**
| Current | Replacement | Files |
|---------|-------------|-------|
| `duration: 0.15` | `microSpring` | navigation.tsx, command-palette.tsx (2), terminal.tsx, progress-log.tsx |
| `duration: 0.2` | `microSpring` | chat-widget.tsx (3), blog-article.tsx, table-of-contents.tsx |
| `duration: 0.3` | `gentleSpring` | contact-page.tsx, home-page.tsx (2), for-hub-page.tsx, role-page-content.tsx (2), technologies-page-content.tsx, technology-page-content.tsx (2), service-page-content.tsx (2), demo/backgrounds/page.tsx |
| `duration: 0.5` | `springTransition` | crt-effect.tsx |
| `duration: 1.0+` | `springTransition` | circuit-traces.tsx, blueprint-grid.tsx, ascii-field.tsx, hybrid-atmospheric.tsx, code-rain.tsx, data-flow.tsx |

**KEEP duration-based (animations, not transitions):**

- `duration: 0.5, repeat: Infinity` — cursor blink (terminal.tsx:265)
- `duration: 0.8, repeat: Infinity` — cursor blink (home-page.tsx:162)
- `duration: 1, repeat: Infinity` — progress spinner (progress-log.tsx:101)
- `duration: 2 + Math.random()` — particle animation (demo/page.tsx:222)
- `{ duration: 0 }` — reduced motion override (table-of-contents.tsx:384, 465)

- [ ] **Step 1:** Write test checking no `duration:` in non-animation transitions
- [ ] **Step 2:** Replace each group, import from motion-constants
- [ ] **Step 3:** Run build, verify smooth scroll feels right locally
- [ ] **Step 4:** Commit
