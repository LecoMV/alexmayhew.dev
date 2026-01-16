# Gemini Research Prompts for Blog Articles

> **Purpose:** Use these prompts with Gemini to gather verified technical facts, current statistics, and expert perspectives before writing each article.
>
> **Instructions:** Copy each prompt to Gemini. Request sources for all claims. Flag any conflicting information.

---

## Research Protocol

For each article, Gemini should provide:

1. **Verified Facts** — With sources (URLs, documentation links)
2. **Current Statistics** — 2025-2026 data preferred
3. **Counter-Arguments** — What critics say, when NOT to use this approach
4. **Real Examples** — Case studies, open-source projects, company blogs
5. **Expert Opinions** — Quotes from recognized authorities

---

## ARTICLE 01: The Anatomy of a High-Precision SaaS

### Prompt for Gemini:

```
I'm writing a comprehensive technical article about building scalable B2B SaaS applications from zero to 100k users. I need thoroughly researched, accurate information with sources.

RESEARCH QUESTIONS:

1. INFRASTRUCTURE COMPARISON (2025-2026):
   - What are the actual cost differences between AWS ECS, Vercel, and Cloudflare Pages/Workers for a SaaS handling 100k MAU?
   - What are documented cold start times for each platform?
   - Find case studies of SaaS companies that migrated between these platforms and why.

2. DATABASE ARCHITECTURE:
   - What are current best practices for PostgreSQL schema design for multi-tenant SaaS?
   - Shared database vs. schema-per-tenant vs. database-per-tenant: what do experts recommend and when?
   - What are the actual performance benchmarks for PostgreSQL at 100k+ users?

3. TYPE-SAFE API PATTERNS:
   - Current state of tRPC vs GraphQL vs REST for SaaS in 2025-2026
   - Bundle size comparisons with sources
   - Real-world adoption statistics

4. NEXT.JS APP ROUTER:
   - What are documented limitations and gotchas as of Next.js 15?
   - Performance benchmarks comparing Pages Router vs App Router
   - When do experts recommend NOT using App Router?

5. COUNTER-ARGUMENTS:
   - What are the strongest arguments AGAINST this stack?
   - What scale does this architecture fail at?
   - What alternatives do critics recommend?

Please provide specific sources (URLs) for all claims. Flag any areas where information is conflicting or uncertain.
```

---

## ARTICLE 02: Migrating to the Edge: Latency Analysis

### Prompt for Gemini:

```
I'm writing a data-driven comparison of edge deployment platforms for Next.js applications. I need verified benchmarks and accurate technical information.

RESEARCH QUESTIONS:

1. COLD START BENCHMARKS (2025-2026):
   - What are the actual measured cold start times for:
     - Vercel Edge Functions
     - Cloudflare Workers/Pages
     - AWS Lambda@Edge
     - Netlify Edge Functions
   - Find independent benchmarks, not just vendor marketing claims
   - What factors affect cold start times?

2. REGIONAL LATENCY:
   - What are documented P50/P95/P99 latencies for each platform across regions?
   - Find case studies showing before/after latency improvements from edge migration
   - What is the actual latency benefit of edge vs. regional deployment?

3. COST ANALYSIS:
   - Pricing models for each platform as of 2025-2026
   - At what traffic levels does each platform become more/less cost-effective?
   - Hidden costs (bandwidth, compute time, etc.)

4. LIMITATIONS:
   - What can't run on edge runtimes? (Node.js APIs, native modules, etc.)
   - Database connection challenges from edge
   - Bundle size limits per platform

5. COUNTER-ARGUMENTS:
   - When is edge deployment NOT the right choice?
   - What do critics say about edge hype vs. reality?
   - Cases where companies moved AWAY from edge and why

Provide specific sources for all benchmarks. Distinguish between vendor claims and independent measurements.
```

---

## ARTICLE 03: The 'Atmospheric' Stack: Rejecting UI Libraries

### Prompt for Gemini:

```
I'm writing an opinionated article about building custom design systems with Tailwind CSS instead of using component libraries like Material UI, Chakra, or Ant Design. I need accurate technical data to support or challenge this position.

RESEARCH QUESTIONS:

1. BUNDLE SIZE COMPARISON (Current versions, 2025-2026):
   - What are the actual bundle sizes of:
     - Material UI (MUI) - full install vs. tree-shaken
     - Chakra UI - full install vs. tree-shaken
     - Ant Design - full install vs. tree-shaken
     - Radix UI primitives
     - Tailwind CSS (with purge)
   - How do these affect Core Web Vitals (LCP, FID, CLS)?
   - Find real bundle analysis from production apps

2. DEVELOPMENT SPEED:
   - Are there studies comparing development velocity with UI libraries vs. custom Tailwind?
   - What do engineering teams report about maintenance burden?
   - Long-term refactoring costs

3. ACCESSIBILITY:
   - How do UI libraries compare to custom implementations for a11y?
   - What accessibility features come "free" with libraries?
   - Cost of building accessible components from scratch

4. DESIGN DIFFERENTIATION:
   - Case studies of products that switched from UI libraries to custom design
   - Conversion rate or user experience impacts
   - Brand differentiation arguments

5. NEO-BRUTALIST DESIGN:
   - Current state of neo-brutalist/anti-design movement in 2025-2026
   - Notable examples of brutalist web design in production
   - Design principles and philosophy from authoritative sources

6. COUNTER-ARGUMENTS:
   - When ARE UI libraries the right choice?
   - What do proponents of Material UI/Chakra say in defense?
   - Small team / startup considerations
   - Accessibility risks of custom implementations

Provide sources for all bundle size claims. Note any data that's outdated or uncertain.
```

---

## ARTICLE 04: Postgres vs. MongoDB for Fintech

### Prompt for Gemini:

```
I'm writing a technical advisory article about database selection for fintech applications, focusing on regulatory and compliance requirements. I need verified information about compliance frameworks and database capabilities.

RESEARCH QUESTIONS:

1. REGULATORY REQUIREMENTS:
   - What specific database requirements exist for:
     - SOC 2 compliance
     - PCI DSS
     - GDPR audit trails
     - Financial services regulations (SEC, FINRA if applicable)
   - How do PostgreSQL and MongoDB each address these?

2. ACID COMPLIANCE:
   - Current state of MongoDB ACID transactions (2025-2026)
   - Documented limitations compared to PostgreSQL
   - Real-world fintech case studies for each database

3. AUDIT TRAIL IMPLEMENTATION:
   - How do fintech companies implement audit logging in each database?
   - Schema-on-read vs schema-on-write for financial records
   - Data immutability patterns

4. PERFORMANCE:
   - Actual performance benchmarks for financial transaction workloads
   - OLTP performance comparisons
   - Scaling characteristics for each

5. ADOPTION:
   - Which major fintech companies use PostgreSQL vs MongoDB?
   - What are their stated reasons?
   - Migration stories between the two

6. COUNTER-ARGUMENTS:
   - When IS MongoDB better for fintech?
   - What do MongoDB advocates say about compliance capabilities?
   - Document database use cases in finance

Provide sources, especially for compliance/regulatory claims. Flag any information that may vary by jurisdiction.
```

---

## ARTICLE 05: Why 'Generic' AI Code Creates Technical Debt

### Prompt for Gemini:

```
I'm writing an article about the technical debt implications of AI-generated code (GitHub Copilot, ChatGPT, etc.). I need research-backed claims, not opinions.

RESEARCH QUESTIONS:

1. CODE QUALITY STUDIES:
   - Are there academic or industry studies measuring AI-generated code quality?
   - Security vulnerability rates in AI-generated vs. human code
   - Test coverage patterns in AI-generated code
   - Maintainability metrics (cyclomatic complexity, coupling, etc.)

2. PRODUCTIVITY RESEARCH:
   - GitHub's own studies on Copilot productivity
   - Independent research validating or challenging those claims
   - Long-term productivity effects (including refactoring time)

3. TECHNICAL DEBT PATTERNS:
   - Documented patterns of technical debt introduced by AI code
   - Code review findings from teams using AI tools
   - Refactoring costs reported by engineering teams

4. SECURITY IMPLICATIONS:
   - Studies on security vulnerabilities in AI-generated code
   - Known patterns of insecure code from AI tools
   - Mitigation strategies

5. EXPERT PERSPECTIVES:
   - What do respected engineers say about AI code quality?
   - Company policies on AI code (bans, restrictions, guidelines)
   - Best practices for AI-assisted development

6. COUNTER-ARGUMENTS:
   - What are the strongest defenses of AI-generated code quality?
   - Success stories of AI-assisted development
   - When does AI code work well?

Prioritize peer-reviewed research and verifiable case studies over opinion pieces.
```

---

## ARTICLE 06: Optimizing AWS Lambda Cold Starts

### Prompt for Gemini:

```
I'm writing a practical guide to Lambda cold start optimization. I need current, verified technical information.

RESEARCH QUESTIONS:

1. COLD START BENCHMARKS (2025-2026):
   - Current cold start times by runtime (Node.js, Python, Go, Rust, etc.)
   - Impact of bundle size on cold start time (quantified)
   - Memory allocation vs. cold start relationship

2. OPTIMIZATION TECHNIQUES:
   - Provisioned Concurrency: costs, limitations, when to use
   - SnapStart: current support, measured improvements
   - Bundle optimization: specific techniques with measured impact
   - Keep-warm strategies: effectiveness, costs, pitfalls

3. ARCHITECTURE PATTERNS:
   - Lambda vs. containers (Fargate, ECS) decision framework
   - When to use each based on cold start requirements
   - Hybrid architectures

4. REAL-WORLD DATA:
   - Case studies of companies optimizing Lambda cold starts
   - Before/after metrics from production systems
   - Cost implications of optimization strategies

5. LIMITATIONS:
   - What can't be optimized away?
   - When is Lambda fundamentally wrong choice?
   - Alternative serverless platforms comparison

Provide AWS documentation links and independent benchmarks. Note version-specific information.
```

---

## ARTICLE 07: Neo-Brutalism: A Developer's Guide

### Prompt for Gemini:

```
I'm writing about neo-brutalist web design from a developer's implementation perspective. I need design theory background and practical examples.

RESEARCH QUESTIONS:

1. DESIGN HISTORY AND THEORY:
   - Origins of brutalism in architecture
   - Translation to web design: key figures, timeline
   - Core principles from design authorities

2. VISUAL ELEMENTS:
   - Defining characteristics of neo-brutalist web design
   - Typography choices and rationale
   - Color theory in brutalist design
   - Grid and layout principles

3. NOTABLE EXAMPLES (2024-2026):
   - Production websites using neo-brutalist design
   - Awards or recognition for brutalist web design
   - Company/brand examples (not just portfolios)

4. IMPLEMENTATION:
   - CSS techniques specific to brutalist aesthetic
   - Framework considerations (Tailwind patterns)
   - Responsive design challenges

5. UX CONSIDERATIONS:
   - Accessibility in brutalist design
   - User research on brutalist interfaces
   - Conversion rate data (if available)

6. CRITICISM:
   - Arguments against brutalist web design
   - When brutalism fails
   - Audience/context limitations

Provide authoritative design sources (Awwwards, design publications, academic sources).
```

---

## ARTICLE 08: The Hidden Cost of 'Cheap' Developers

### Prompt for Gemini:

```
I'm writing about the total cost of ownership when hiring developers at different rate levels. I need data-backed claims about development costs and quality correlations.

RESEARCH QUESTIONS:

1. DEVELOPER RATE DATA (2025-2026):
   - Current freelance/contractor rates by experience level (US, EU, global)
   - Agency vs. freelancer rate comparisons
   - Rate trends over past 5 years

2. QUALITY CORRELATIONS:
   - Are there studies correlating developer rates with code quality?
   - Technical debt accumulation by team experience level
   - Bug rates and time-to-fix by experience level

3. TOTAL COST OF OWNERSHIP:
   - Studies on refactoring costs for poorly-written code
   - Maintenance burden statistics
   - Timeline overrun data by team composition

4. HIRING RESEARCH:
   - What predicts developer quality beyond rate?
   - Interview effectiveness studies
   - Portfolio/GitHub analysis accuracy

5. CASE STUDIES:
   - Companies that rebuilt systems due to initial poor development
   - Cost comparisons of "cheap" vs. "expensive" development paths
   - Startup failure post-mortems related to technical decisions

6. COUNTER-ARGUMENTS:
   - Successful projects built with lower-cost developers
   - When is cost optimization appropriate?
   - Geographic arbitrage success stories

Focus on quantifiable data. Avoid pure opinion pieces.
```

---

## ARTICLE 09: Multi-Tenancy with Prisma & Row Level Security

### Prompt for Gemini:

```
I'm writing a technical deep-dive on implementing multi-tenant SaaS with PostgreSQL Row Level Security and Prisma ORM. I need accurate, current technical information.

RESEARCH QUESTIONS:

1. ROW LEVEL SECURITY:
   - Current PostgreSQL RLS capabilities and syntax
   - Performance implications of RLS policies
   - Bypass scenarios and security considerations
   - Best practices from PostgreSQL documentation

2. PRISMA INTEGRATION:
   - Current Prisma support for RLS (as of 2025-2026)
   - Middleware patterns for tenant isolation
   - Known limitations or gotchas
   - Alternative ORMs with better RLS support

3. MULTI-TENANCY PATTERNS:
   - Shared database vs. schema-per-tenant vs. database-per-tenant
   - When to use each pattern (scale, compliance, isolation requirements)
   - Migration paths between patterns

4. SECURITY:
   - Documented data isolation failures in multi-tenant systems
   - Testing strategies for tenant isolation
   - Compliance implications (SOC 2, GDPR)

5. REAL-WORLD IMPLEMENTATIONS:
   - Open-source multi-tenant SaaS implementations
   - Company blog posts about their multi-tenant architecture
   - Performance data from production systems

6. ALTERNATIVES:
   - When is RLS NOT the right approach?
   - Application-level vs. database-level isolation debate
   - Other database multi-tenancy features (Citus, etc.)

Provide Prisma and PostgreSQL documentation links. Note any version-specific information.
```

---

## ARTICLE 10: 3 Advanced React Server Component Patterns

### Prompt for Gemini:

```
I'm writing about advanced patterns for React Server Components in Next.js 15. I need current, accurate technical information about RSC capabilities and limitations.

RESEARCH QUESTIONS:

1. RSC CURRENT STATE (Next.js 15, React 19):
   - What are the documented capabilities and limitations?
   - Changes from earlier versions
   - Official recommendations from React and Vercel teams

2. DATA FETCHING PATTERNS:
   - Parallel vs. sequential data fetching in RSC
   - Suspense boundaries best practices
   - Streaming implementation details

3. CLIENT/SERVER COMPOSITION:
   - "Islands" architecture in RSC context
   - Serialization boundaries
   - State management across the boundary

4. PERFORMANCE:
   - Benchmarks comparing RSC to client-side rendering
   - Bundle size impacts
   - Time-to-first-byte improvements

5. REAL-WORLD ADOPTION:
   - Companies using RSC in production
   - Migration experiences (blog posts, talks)
   - Common pitfalls and solutions

6. CRITICISM AND LIMITATIONS:
   - What do RSC critics say?
   - Known issues or limitations
   - When NOT to use RSC

Prioritize official React/Next.js documentation and Vercel blog posts. Note any experimental features.
```

---

## ARTICLE 11: Bulletproof CI/CD for Next.js

### Prompt for Gemini:

```
I'm writing a practical guide to CI/CD pipeline setup for Next.js applications. I need current best practices and real-world configurations.

RESEARCH QUESTIONS:

1. GITHUB ACTIONS:
   - Current best practices for Next.js CI/CD (2025-2026)
   - Caching strategies and measured improvements
   - Matrix builds and parallelization

2. BUILD OPTIMIZATION:
   - Turbopack vs. Webpack build times in CI
   - Incremental build strategies
   - Artifact caching between jobs

3. PREVIEW DEPLOYMENTS:
   - Vercel preview deployment features
   - Self-hosted preview deployment solutions
   - Database branching for previews (Neon, PlanetScale)

4. TESTING STRATEGIES:
   - Test parallelization in CI
   - Playwright/Cypress CI configuration
   - Visual regression testing tools

5. DEPLOYMENT STRATEGIES:
   - Blue-green deployments for Next.js
   - Rollback automation
   - Feature flags integration

6. SECURITY:
   - Secrets management in CI/CD
   - Dependency scanning
   - SAST/DAST integration

Provide example configuration files where available. Note any platform-specific considerations.
```

---

## ARTICLE 12: From Figma to Code: Pixel-Perfect Implementation

### Prompt for Gemini:

```
I'm writing about the designer-developer handoff process and pixel-perfect implementation techniques. I need practical information and real workflow examples.

RESEARCH QUESTIONS:

1. HANDOFF TOOLS (2025-2026):
   - Current state of Figma Dev Mode
   - Alternative handoff tools (Zeplin, Avocode, etc.)
   - Token extraction and design system sync tools

2. MEASUREMENT TECHNIQUES:
   - Browser extensions for design comparison
   - Automated visual regression tools
   - Pixel-perfect validation workflows

3. DESIGN TOKENS:
   - Style Dictionary and alternatives
   - Figma to Tailwind workflows
   - Token synchronization automation

4. COMPONENT MAPPING:
   - Figma component to React component patterns
   - Auto-generated code quality assessment
   - Manual implementation best practices

5. COMMON DRIFT ISSUES:
   - Why implementations diverge from designs
   - Typography rendering differences
   - Responsive breakpoint misalignment

6. TEAM WORKFLOWS:
   - Design review processes that work
   - QA for visual implementation
   - Designer-developer collaboration patterns

Provide tool-specific documentation links and real workflow examples.
```

---

## ARTICLE 13: The 'No-Loading-State' UI: Optimistic Updates

### Prompt for Gemini:

```
I'm writing about optimistic UI patterns to eliminate loading states. I need technical accuracy about implementation and UX research about effectiveness.

RESEARCH QUESTIONS:

1. UX RESEARCH:
   - Studies on loading state impact on user experience
   - Perceived performance vs. actual performance
   - User tolerance for loading times by context

2. IMPLEMENTATION PATTERNS:
   - React Query/TanStack Query optimistic update API
   - SWR optimistic mutation patterns
   - Server Actions optimistic patterns in Next.js

3. ERROR HANDLING:
   - Rollback strategies when optimism fails
   - User notification patterns for failed mutations
   - Conflict resolution

4. REAL-WORLD EXAMPLES:
   - Apps known for optimistic UI (Linear, Notion, etc.)
   - Implementation blog posts from these companies
   - Performance/UX improvements reported

5. WHEN NOT TO USE:
   - Operations that shouldn't be optimistic
   - Financial/critical data considerations
   - User expectation management

6. TECHNICAL CONSIDERATIONS:
   - Cache invalidation strategies
   - Race condition handling
   - Network failure recovery

Provide React Query/TanStack documentation links and UX research sources.
```

---

## ARTICLE 14: The CTO's Guide to Choosing a Tech Stack

### Prompt for Gemini:

```
I'm writing for CTOs and technical founders about strategic tech stack selection. I need business-oriented research, not just technical comparisons.

RESEARCH QUESTIONS:

1. HIRING IMPLICATIONS:
   - Developer availability by technology (Stack Overflow surveys, etc.)
   - Salary ranges by technology stack
   - Time-to-hire data

2. MAINTENANCE COSTS:
   - Long-term maintenance cost studies by technology
   - Technical debt accumulation rates
   - Framework longevity data

3. STARTUP SUCCESS PATTERNS:
   - Tech stacks of successful startups
   - Stack migrations and timing
   - Correlation (if any) between stack choice and outcomes

4. DECISION FRAMEWORKS:
   - How successful CTOs approach stack selection
   - Criteria prioritization
   - Risk assessment approaches

5. MIGRATION COSTS:
   - Cost studies of major stack migrations
   - Time and resource requirements
   - When migration is necessary vs. premature

6. COUNTER-ARGUMENTS:
   - "Boring technology" arguments
   - When cutting-edge is appropriate
   - Build vs. buy in stack context

Prioritize business research and CTO perspectives over pure technical comparisons.
```

---

## ARTICLE 15: Atmospheric Animations: Physics in Framer Motion

### Prompt for Gemini:

```
I'm writing about physics-based animations in Framer Motion, focusing on creating natural-feeling UI interactions. I need accurate technical documentation and design theory.

RESEARCH QUESTIONS:

1. ANIMATION PHYSICS:
   - Spring physics parameters (stiffness, damping, mass) explained
   - Mathematical basis for spring animations
   - How Framer Motion implements springs

2. FRAMER MOTION SPECIFICS (Current version):
   - Spring configuration options and defaults
   - Performance characteristics
   - Gesture integration (drag, tap, etc.)

3. PERCEPTION RESEARCH:
   - Research on animation timing and user perception
   - Why linear animations feel "wrong"
   - Cognitive load of different animation types

4. PERFORMANCE:
   - Framer Motion performance benchmarks
   - GPU acceleration details
   - Frame rate optimization techniques

5. ACCESSIBILITY:
   - Reduced motion preferences handling
   - Animation and vestibular disorders
   - WCAG guidelines for animation

6. EXAMPLES:
   - Notable sites using physics-based animations well
   - Framer Motion showcase examples
   - Animation patterns in design systems

Provide Framer Motion documentation links and animation research sources.
```

---

## ARTICLE 16: Secure Authentication for B2B SaaS

### Prompt for Gemini:

```
I'm writing about implementing enterprise-grade authentication for B2B SaaS applications. I need current, accurate security information.

RESEARCH QUESTIONS:

1. ENTERPRISE REQUIREMENTS:
   - What authentication features do enterprise buyers require?
   - SSO (SAML, OIDC) adoption rates
   - Compliance requirements (SOC 2, etc.) related to auth

2. IMPLEMENTATION:
   - NextAuth.js/Auth.js enterprise features (current state)
   - Clerk, Auth0, WorkOS comparison
   - Self-hosted vs. managed auth trade-offs

3. SSO PROTOCOLS:
   - SAML vs. OIDC technical comparison
   - Implementation complexity
   - Common integration challenges

4. SESSION MANAGEMENT:
   - Secure session handling best practices
   - Token rotation strategies
   - Multi-device session management

5. AUDIT LOGGING:
   - Authentication audit trail requirements
   - What to log for compliance
   - Storage and retention

6. SECURITY CONSIDERATIONS:
   - OWASP authentication guidelines
   - Common auth vulnerabilities
   - Penetration testing for auth

Provide security documentation and compliance framework references.
```

---

## ARTICLE 17: Debugging Memory Leaks in Node.js

### Prompt for Gemini:

```
I'm writing a practical guide to identifying and fixing memory leaks in Node.js applications. I need accurate technical information about V8 and debugging tools.

RESEARCH QUESTIONS:

1. MEMORY MODEL:
   - V8 memory management explained
   - Garbage collection in Node.js
   - Common causes of memory leaks

2. DETECTION:
   - Symptoms of memory leaks in production
   - Monitoring tools and metrics
   - Alert thresholds

3. DEBUGGING TOOLS:
   - Chrome DevTools memory profiling for Node
   - Heap snapshot analysis
   - --inspect flag usage

4. COMMON CULPRITS:
   - Closure memory leaks
   - Event listener accumulation
   - Global variable pollution
   - Cache without eviction

5. PREVENTION:
   - Coding patterns that prevent leaks
   - Static analysis tools
   - Testing for memory leaks

6. PRODUCTION STRATEGIES:
   - Graceful degradation
   - Automatic restart strategies
   - Memory limit configuration

Provide Node.js documentation links and tool-specific guides.
```

---

## ARTICLE 18: Why TypeScript is Your Best Documentation

### Prompt for Gemini:

```
I'm writing about TypeScript as a documentation tool, making the business case for static typing. I need research on developer productivity and code quality.

RESEARCH QUESTIONS:

1. PRODUCTIVITY RESEARCH:
   - Studies on TypeScript vs. JavaScript productivity
   - Onboarding time comparisons
   - Bug detection rates

2. DOCUMENTATION VALUE:
   - How types serve as documentation
   - IDE feature utilization data
   - Comparison to JSDoc/manual documentation

3. ADOPTION DATA:
   - TypeScript adoption trends (2020-2026)
   - Enterprise adoption rates
   - Developer preference surveys

4. ROI ARGUMENTS:
   - Cost of type-related bugs in production
   - Refactoring safety improvements
   - Long-term maintenance benefits

5. IMPLEMENTATION:
   - Gradual migration strategies
   - Strictness level recommendations
   - Configuration best practices

6. COUNTER-ARGUMENTS:
   - Valid criticisms of TypeScript
   - When types add too much friction
   - Alternatives (JSDoc, runtime validation)

Provide survey data (Stack Overflow, State of JS) and research paper references.
```

---

## Usage Instructions

1. **Run each prompt through Gemini** with "Deep Research" or equivalent mode
2. **Save responses** in `.context/research/article-XX-research.md`
3. **Flag uncertainties** - note where Gemini expresses doubt or conflicting sources
4. **Verify critical claims** - especially bundle sizes, performance numbers, and compliance requirements
5. **Cross-reference** - use multiple prompts to verify important facts

---

## Quality Checklist for Research

Before using research in an article:

- [ ] All performance claims have dated sources
- [ ] Bundle sizes verified against current npm packages
- [ ] Compliance requirements verified against official frameworks
- [ ] Counter-arguments researched as thoroughly as main arguments
- [ ] Expert opinions attributed to named individuals
- [ ] Any AI limitations or uncertainties explicitly noted

---

_These prompts are designed to extract verifiable facts that will make our content technically bulletproof and authoritative._
