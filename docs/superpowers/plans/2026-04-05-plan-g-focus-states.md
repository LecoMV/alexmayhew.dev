# Plan G: Focus States & A11y Polish

**Goal:** Add visible focus indicators to all remaining interactive elements.

**Tech Stack:** Tailwind CSS, focus-visible pseudo-class

---

## Task 1: Fix elements with focus:outline-none but no focus-visible:ring

**Files:**

- `src/components/chat/chat-widget.tsx:266` — chat input
- `src/components/traceforge/gpu-control.tsx:133` — GPU input

- [ ] **Step 1:** Write test checking these files contain `focus-visible:ring`
- [ ] **Step 2:** Add `focus-visible:ring-2 focus-visible:ring-cyber-lime` alongside existing `focus:outline-none`
- [ ] **Step 3:** Run build, commit

## Task 2: Audit all interactive elements for keyboard accessibility

- [ ] **Step 1:** Search for all `<button`, `<a`, `<input`, `<select`, `<textarea` without focus-visible classes
- [ ] **Step 2:** Fix any gaps found
- [ ] **Step 3:** Commit
