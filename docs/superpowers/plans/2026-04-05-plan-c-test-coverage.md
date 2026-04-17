# Plan C: Test Coverage Push (51% → 80%+)

**Goal:** Comprehensive test coverage for all untested components and critical paths.

**Tech Stack:** Vitest, React Testing Library, JSDOM

---

## Priority 1: JSON-LD Components (16 untested files)

**Files to test:** All in `src/components/seo/`

| File                       | Test Strategy                                                   |
| -------------------------- | --------------------------------------------------------------- |
| article-json-ld.tsx        | Render, check @type=BlogPosting, required fields                |
| breadcrumb-json-ld.tsx     | Render, check BreadcrumbList items                              |
| case-study-json-ld.tsx     | Render with mock Project, check CreativeWork                    |
| comparison-json-ld.tsx     | Render with mock ComparisonPage, check TechArticle              |
| contact-json-ld.tsx        | Render, check ContactPage + PERSON_REF                          |
| faq-json-ld.tsx            | Render with FAQs, check FAQPage                                 |
| howto-json-ld.tsx          | Render, check HowTo schema                                      |
| integration-json-ld.tsx    | Render with mock IntegrationPage                                |
| json-ld.tsx                | Render main JsonLd, check Person/Organization/ConsultingService |
| local-business-json-ld.tsx | Render, check LocalBusiness                                     |
| migration-json-ld.tsx      | Render with mock MigrationPage                                  |
| role-json-ld.tsx           | Render with mock RolePage, check Service                        |
| service-json-ld.tsx        | Render with mock PseoPage                                       |
| software-json-ld.tsx       | Render, check SoftwareApplication                               |
| technology-json-ld.tsx     | Render with mock Technology                                     |
| topic-cluster-nav.tsx      | Render with mock posts, check navigation links                  |

- [ ] **Step 1:** Create `tests/components/seo/` test files (batch via agent)
- [ ] **Step 2:** Each test: render component, parse JSON-LD from script tag, assert required fields
- [ ] **Step 3:** Run coverage, verify JSON-LD coverage > 90%

## Priority 2: Hooks (28% → 80%+)

**Files:** `src/lib/hooks/`

- [ ] **Step 1:** Identify all hooks and their dependencies
- [ ] **Step 2:** Write tests with mocked window/document APIs
- [ ] **Step 3:** Run coverage

## Priority 3: Server Actions (contact + newsletter)

**Files:** `src/app/actions/contact.ts`, `src/app/actions/newsletter.ts`

- [ ] **Step 1:** Mock fetch for Resend API and Listmonk API
- [ ] **Step 2:** Test success path, validation failure, API failure, rate limiting
- [ ] **Step 3:** Test Turnstile verification mock

## Priority 4: Role Pages + Data

**Files:** `src/data/roles/`, `src/app/for/`

- [ ] **Step 1:** Validate role page data structure (all required fields)
- [ ] **Step 2:** Test getPublishedRolePages returns valid data

## Execution Strategy

Dispatch 4 parallel test-writing agents:

1. Agent 1: JSON-LD components (16 files)
2. Agent 2: Hooks + utilities
3. Agent 3: Server actions
4. Agent 4: Role pages + data validation

After all agents complete: run `npx vitest run --coverage` and verify > 80%.
