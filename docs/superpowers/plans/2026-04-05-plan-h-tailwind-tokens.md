# Plan H: Tailwind Design Token Cleanup

**Goal:** Replace remaining arbitrary max-w values with design tokens.

**Tech Stack:** Tailwind 4, @theme in globals.css

---

## Task 1: Add content-width tokens

**File:** `src/app/globals.css` — add to `@theme` block

- [ ] **Step 1:** Write test checking globals.css contains content-narrow and content-article tokens
- [ ] **Step 2:** Add tokens:
  ```css
  --max-width-article: 1280px;
  --max-width-narrow: 900px;
  --max-width-newsletter: 700px;
  ```
- [ ] **Step 3:** Commit

## Task 2: Replace arbitrary values

| File                                      | Current          | Replacement        |
| ----------------------------------------- | ---------------- | ------------------ |
| `src/components/blog/blog-article.tsx:55` | `max-w-[1280px]` | `max-w-article`    |
| `src/app/newsletter/page.tsx:53`          | `max-w-[900px]`  | `max-w-narrow`     |
| `src/app/newsletter/[slug]/page.tsx:68`   | `max-w-[700px]`  | `max-w-newsletter` |

**Keep as-is (component-specific, not design tokens):**

- `chat-widget.tsx:218` — `max-w-[260px]` (chat bubble width)
- `traceforge/result-viewer.tsx:229,234` — `max-w-[200px]` (image thumbnail)

- [ ] **Step 1:** Replace the 3 values above
- [ ] **Step 2:** Run build, commit
