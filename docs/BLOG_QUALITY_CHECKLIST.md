# Blog Post Quality Checklist

> Run every post through this gate before merging to main.
> If any item fails, revise before publishing.

---

## Content Quality

- [ ] Title is specific and outcome-oriented (not vague — "How to X" or "Why Y")
- [ ] Contains at least 3 specific metrics or numbers (not "many" or "significant")
- [ ] Every technical point ties to a business outcome (revenue, time, cost, risk)
- [ ] At least one contrarian or non-obvious insight that challenges conventional wisdom
- [ ] Code examples use real variable and function names (never `foo`, `bar`, `baz`, `example`)
- [ ] Code examples are production-quality — could be copy-pasted into a real project
- [ ] Decision frameworks are stage-specific (ARR range, team size, or growth stage)
- [ ] Includes "When to Apply" and "When NOT to Apply" guidance
- [ ] Word count is 2,000-5,000 words (thorough but not padded)

---

## Voice Check

- [ ] No hedging language ("perhaps", "maybe", "might want to", "could potentially")
- [ ] No marketing buzzwords ("game-changer", "revolutionary", "cutting-edge", "next-level")
- [ ] No emojis in body text
- [ ] No exclamation points (max 1 in entire post)
- [ ] No filler phrases ("in today's world", "as we all know", "it goes without saying")
- [ ] Uses em dashes for emphasis — not parentheses for asides
- [ ] Specific numbers throughout (40%, 10x, $300K — never "a lot" or "many")
- [ ] Experience-backed claims ("I've built...", "In my advisory work..." — not "research shows")
- [ ] Reads like a senior engineer explaining to a peer — not a tutorial for beginners

---

## Hub-and-Spoke Structure

- [ ] Frontmatter includes `series` key matching the parent hub cluster
- [ ] "Part of [Hub Name]" callout at the top of the post
- [ ] "More in This Series" section at the bottom with 3-5 related spoke links
- [ ] Cross-cluster "Related Guides" section if the post spans multiple topics
- [ ] All internal links use relative paths (`/blog/slug-name`)
- [ ] No orphan post — every post connects to at least one hub

---

## SEO & Discoverability

- [ ] Meta description is 150-160 characters, includes primary keyword
- [ ] H1 is the title (only one H1 per page)
- [ ] H2s break the post into scannable sections (every 300-500 words)
- [ ] Primary keyword appears in title, first paragraph, and at least 2 H2s
- [ ] Alt text on all images (descriptive, includes keyword where natural)
- [ ] Featured image exists and follows brand guidelines (WebP, 1920x1072, neo-brutalist)
- [ ] Reading time is accurate in frontmatter

---

## E-E-A-T Signals (Google + AI Search)

- [ ] Author attribution is clear (Alex Mayhew, Technical Advisor)
- [ ] Contains first-person experience ("I've advised...", "In my work with...")
- [ ] Specific, verifiable claims (not vague assertions)
- [ ] Links to authoritative external sources where claims need backing
- [ ] Structured with clear headings that AI search engines can parse
- [ ] Takes a clear position — not a "both sides" summary

---

## Technical Quality

- [ ] All external links verified working
- [ ] Code blocks specify language for syntax highlighting (`typescript, `sql, etc.)
- [ ] No code blocks wider than 80 characters (readable on mobile)
- [ ] Tables render correctly in MDX preview
- [ ] No broken internal links (check spoke/hub cross-references)
- [ ] Frontmatter is complete: title, description, date, author, category, tags, series, readingTime, image

---

## Pre-Publish Final Check

- [ ] Read the entire post aloud — does it flow naturally?
- [ ] Would you send this to a CTO client as advice? If not, it's not ready.
- [ ] The opening paragraph makes you want to keep reading
- [ ] The conclusion gives a clear, actionable takeaway
- [ ] If a competitor wrote this, would you respect them for it?
