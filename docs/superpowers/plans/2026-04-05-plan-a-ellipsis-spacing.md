# Plan A: Ellipsis Spacing Fix

**Goal:** Fix `...word` → `... word` across all source files. Ellipsis attaches to preceding word, space before next word.

**Tech Stack:** TypeScript / TSX string content

---

## Task 1: Fix ellipsis spacing in string content

**Regex:** Replace `\.\.\.([a-zA-Z])` with `... $1`

**Exclusions (DO NOT replace):**

- Spread operators: `...args`, `...props`, `...rest`, `...items`, `...messages`, `...inputs`, `...params`, etc.
- Spread in destructuring: `...other`, `...config`
- Set spread: `...EU_COUNTRIES`, `...EEA_COUNTRIES`
- Template spread: `...${variable}`
- Function rest params: `...inputs: ClassValue[]`
- Array spread in JSX: `[...messages, userMessage]`

**Safe to replace (string content in quotes or JSX text):**

- `"guidance...not"` → `"guidance... not"`
- `landmines before they detonate...saving` → `landmines before they detonate... saving`
- JSX text content between `>` and `<`

**Approach:**

- [ ] **Step 1:** Write test checking `about-page.tsx` has no `...[a-z]` in string literals
- [ ] **Step 2:** Use targeted sed that only replaces inside quoted strings — OR manually review each file since spread ops are syntactically obvious (not inside quotes)
- [ ] **Step 3:** For each file, use Edit with `replace_all` on specific string patterns (not blind regex)
- [ ] **Step 4:** Verify zero matches: `grep -rn '\.\.\.[a-z]' src/ --include='*.ts' --include='*.tsx' | grep -v '\.\.\.' | grep "'.*\.\.\..*'" ` (string content only)
- [ ] **Step 5:** Run build, commit

**Files (string content violations — 580+ after excluding spread ops):**

- All pSEO data files (pages, technologies, migrations, comparisons, integrations, roles)
- about-page.tsx, home-page.tsx, contact-page.tsx
- hub-faqs.ts, blog-article.tsx, table-of-contents.tsx
- terminal commands, chat widget, voice-cloner, pilot, traceforge
- JSON-LD components, actions, logger
