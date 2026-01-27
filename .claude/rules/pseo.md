---
paths:
  - "src/data/pseo/**/*.ts"
  - "src/app/services/**/*.tsx"
  - "src/app/technologies/**/*.tsx"
  - "src/app/for/**/*.tsx"
---

# pSEO Implementation Rules

## Quality Gates (Non-Negotiable)

Every pSEO page MUST have:

- 5+ unique insights (50+ chars each)
- 150+ words in `whyThisStack`
- 150+ words in `projectApproach`
- 3+ industry regulations (if applicable)
- 5+ pain points with solutions
- 4+ FAQs
- SEO title 30-70 chars
- SEO description 100-170 chars

## Data Files

```
src/data/pseo/
├── index.ts          # Exports and utilities
├── types.ts          # TypeScript interfaces
├── validation.ts     # Zod schemas
├── pages.ts          # 19 service pages
├── technologies.ts   # 8 technology definitions
├── industries.ts     # 10 industry definitions
├── migrations.ts     # 7 legacy migration pages
└── integrations.ts   # 5 SaaS integration pages
```

## Adding New Pages

1. Add page data to appropriate file in `src/data/pseo/`
2. Run `npm run build` - fails if quality gates not met
3. Verify JSON-LD in browser dev tools
4. Check internal links to related pages

## Positioning

**Technical Advisor** (NOT freelancer):

- "Partner with me" not "Hire me"
- "Architect solutions" not "Build websites"
- "Accepting select engagements" not "Available for work"
- Value/outcome-focused, not task-focused

See @docs/COPY_AUDIT_REPORT.md for full guidelines.
