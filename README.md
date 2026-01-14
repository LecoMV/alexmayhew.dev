# alexmayhew.dev

[![CI](https://github.com/LecoMV/alexmayhew.dev/actions/workflows/ci.yml/badge.svg)](https://github.com/LecoMV/alexmayhew.dev/actions/workflows/ci.yml)
[![E2E Tests](https://github.com/LecoMV/alexmayhew.dev/actions/workflows/e2e.yml/badge.svg)](https://github.com/LecoMV/alexmayhew.dev/actions/workflows/e2e.yml)
[![codecov](https://codecov.io/gh/LecoMV/alexmayhew.dev/graph/badge.svg)](https://codecov.io/gh/LecoMV/alexmayhew.dev)

> Portfolio website for Alex Mayhew - Full-stack web developer

**Philosophy:** "Atmospheric Engineering" - High-precision digital instruments, tactile and heavy

**Aesthetic:** Neo-Brutalist, anti-AI-generic, handcrafted feel

## Tech Stack

| Layer         | Technology                  |
| ------------- | --------------------------- |
| Framework     | Next.js 15 (App Router)     |
| React         | React 19                    |
| Styling       | Tailwind CSS 4              |
| Animation     | Framer Motion               |
| Smooth Scroll | Lenis                       |
| Icons         | Lucide React                |
| Testing       | Vitest + Playwright         |
| Deployment    | OpenNext → Cloudflare Pages |

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test        # Unit tests (watch mode)
npm run test:e2e    # E2E tests (all browsers)

# Validate before commit
npm run validate    # Types + Lint + Tests
```

## Scripts

| Command                 | Description                  |
| ----------------------- | ---------------------------- |
| `npm run dev`           | Start dev server (Turbopack) |
| `npm run build`         | Production build             |
| `npm run lint`          | ESLint check                 |
| `npm run format`        | Format with Prettier         |
| `npm run typecheck`     | TypeScript check             |
| `npm run test`          | Unit tests (watch)           |
| `npm run test:run`      | Unit tests (single run)      |
| `npm run test:coverage` | Tests with coverage          |
| `npm run test:e2e`      | E2E tests                    |
| `npm run test:e2e:ui`   | E2E with Playwright UI       |
| `npm run validate`      | Full validation              |

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/
│   ├── ui/           # Atomic UI components
│   └── providers/    # Context providers
├── lib/              # Utilities
└── types/            # TypeScript types

tests/                # Unit tests (Vitest)
e2e/                  # E2E tests (Playwright)
.github/              # CI/CD workflows
```

## Testing

### Coverage Thresholds

- **Branches:** 80%
- **Functions:** 80%
- **Lines:** 80%
- **Statements:** 80%

### Running Tests

```bash
# Unit tests
npm run test              # Watch mode
npm run test:run          # Single run
npm run test:coverage     # With coverage report

# E2E tests
npm run test:e2e          # Headless
npm run test:e2e:headed   # With browser
npm run test:e2e:ui       # Playwright UI mode
```

## Development Guidelines

See [CLAUDE.md](./CLAUDE.md) for:

- Design system specifications
- Component patterns
- Code style rules
- Forbidden patterns

## License

Private - All rights reserved
