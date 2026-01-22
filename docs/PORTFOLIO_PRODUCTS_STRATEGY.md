# Portfolio Products Strategy - 2026 Best Practices

> **Purpose**: Strategic guide for showcasing three developer tools as products on alexmayhew.dev
> **Last Updated**: January 2026

---

## Executive Summary

This document outlines the strategy for presenting three projects as polished products on the portfolio:

| Project               | Product Name              | Type             | Status         | Priority |
| --------------------- | ------------------------- | ---------------- | -------------- | -------- |
| Vectorizer            | **TraceForge** (proposed) | Online SaaS Tool | Ready          | High     |
| Claude Command Center | **Claude Pilot**          | Desktop Download | 85% Ready      | High     |
| Electron Test App     | **AEVP**                  | SaaS Platform    | In Development | Low      |

---

## 2026 Portfolio Best Practices (Research Summary)

### Key Trends

1. **Product-Led Storytelling** - Place the product at the center, not generic descriptions
2. **Interactive Demos** - Screenshots → embedded product previews, video demos, guided tours
3. **Micro-Animations** - Minimal motion that adds meaning (CTA hover, scroll reveals)
4. **Case Study Depth** - Problem → Process → Solution narrative for each project
5. **Quality Over Quantity** - 3-4 exceptional projects > 10 mediocre ones
6. **Developer-First Design** - Technical credibility through clean, modular layouts

### Essential Landing Page Elements

```
Hero Section
├── Clear headline with USP
├── Subheadline explaining what it does
├── Primary CTA (Try Now / Download)
├── Product screenshot or video demo
└── Social proof (if available)

Features Section
├── 3-4 key capabilities with icons
├── Brief, benefit-focused descriptions
└── Optional: Expandable technical details

Demo/Preview Section
├── Interactive demo embed OR
├── Video walkthrough OR
├── Animated GIF of key workflow
└── "See it in action" framing

Technical Details
├── Tech stack badges
├── Performance metrics
├── Security/privacy notes
└── Source code link (if open source)

Call to Action
├── Primary: Start using / Download
├── Secondary: View source / Documentation
└── Tertiary: Contact for custom work
```

---

## Project 1: TraceForge (Vectorizer)

### Current State

- **Location**: `/home/deploy/projects/vectorizer`
- **Tech**: FastAPI + Potrace + VTracer + SVGO
- **Status**: Production-ready, already processing images

### Rebranding Rationale

**Why rename from "Neural Vectorizer"?**

- No longer uses AI/LLM for the core process
- Potrace (bitmap tracing) is the primary engine
- Avoid misleading "AI-powered" claims
- New name should reflect precision/craftsmanship

**Proposed Names** (ranked):

1. **TraceForge** - Evokes precision tooling, "forging" vectors
2. **VectorSmith** - Craftsman angle, suggests quality
3. **PathCraft** - References SVG paths, artisan feel
4. **Tracery** - Elegant, architectural reference
5. **Inkline** - Simple, memorable, suggests line art

### Product Page Structure

```
/tools/traceforge (or /vectorize)

HERO
├── Headline: "Raster to Vector in Seconds"
├── Subhead: "Drop your image. Get a clean SVG. No signup required."
├── [Upload Zone] - Drag & drop with live preview
├── "Trusted by X designers" (future social proof)

HOW IT WORKS
├── Step 1: Upload PNG, JPG, or WebP
├── Step 2: Choose preset (logo, illustration, photo)
├── Step 3: Download optimized SVG
└── Processing animation showing stages

PRESETS SHOWCASE
├── Logo (smooth curves)
├── Logo (geometric/sharp)
├── Illustration
├── Line art
├── Photo edge detection
└── Side-by-side before/after examples

TECHNICAL DETAILS (expandable)
├── Pipeline: Potrace + VTracer + SVGO
├── Output: Clean, optimized SVG paths
├── Privacy: Images processed locally, not stored
└── API available for developers

CASE STUDY SNIPPET
├── "Built to vectorize the AM logo you see on this site"
├── Link to full case study
└── Show original → vectorized comparison
```

### Implementation Approach

**Option A: Embedded Tool** (Recommended)

- Host the FastAPI backend on Cloudflare Workers or separate VPS
- Embed upload UI directly on alexmayhew.dev
- Users can try without leaving the site
- Demonstrates full-stack capability

**Option B: Separate Domain**

- traceforge.dev or vectorize.alexmayhew.dev
- Full SaaS experience
- More complex but better for scaling

### Monetization Angle (Future)

- Free tier: 5 images/day
- Pro tier: Unlimited + API access + batch processing
- Enterprise: Self-hosted license

---

## Project 2: Claude Pilot

### Current State

- **Location**: `/home/deploy/projects/claude-command-center`
- **Tech**: Electron 40 + React 19 + tRPC + TypeScript
- **Status**: v0.2.0-alpha.1 (85% production-ready)
- **Tests**: 4,442+ passing, 80% coverage

### Product Positioning

**What it is**: Professional desktop control center for Claude Code developers
**Who it's for**: Developers using Claude Code who need session management, memory access, and workflow control
**Why it matters**: Bridges the gap between CLI and productive development

### Download Page Structure

```
/tools/claude-pilot (or /pilot)

HERO
├── Headline: "Command Your Claude Code Sessions"
├── Subhead: "The desktop control center for professional Claude Code development"
├── [Download macOS] [Download Linux] [Download Windows]
├── Version badge: "v0.2.0-alpha.1"
├── "Open Source" badge with GitHub link

FEATURE GRID (2x3)
├── Session Management: Monitor, inspect, cleanup
├── Memory Browser: PostgreSQL + Memgraph + Qdrant
├── MCP Control: Configure servers without restart
├── Integrated Terminal: Multi-tab with Claude CLI
├── System Monitor: CPU/Memory/GPU real-time
└── Profile Manager: Switch development contexts

SCREENSHOT GALLERY
├── Dashboard view
├── Session transcript viewer
├── Memory browser search
├── MCP configuration editor
└── Dark theme throughout (matches portfolio)

TECHNICAL SPECS
├── Electron 40 + React 19
├── 25 tRPC controllers, 201 handlers
├── Type-safe IPC (Zod validation)
├── 80% test coverage
├── Cross-platform builds

DOWNLOAD SECTION
├── Platform auto-detection
├── Manual platform selection
├── System requirements
├── Installation instructions
└── Changelog link

SECURITY NOTES
├── Context isolation enabled
├── No telemetry/analytics
├── Credentials stored in OS keychain
├── Sandboxed renderer processes
└── View security architecture →
```

### Distribution Strategy

1. **GitHub Releases** (primary)
   - AppImage, deb, tar.gz for Linux
   - DMG for macOS
   - NSIS installer for Windows

2. **Portfolio Download Page**
   - Direct links to latest release
   - Platform auto-detection
   - Installation guide

3. **Future**: Homebrew tap, AUR package, Scoop bucket

### Marketing Angle

```
"Built by a Claude Code power user, for Claude Code power users."

Features that matter:
✓ See all your active sessions in one place
✓ Search across all your learnings and memories
✓ Configure MCP servers without restarting
✓ Monitor system resources in real-time
✓ Manage profiles for different projects
```

---

## Project 3: AEVP (Electron Test App)

### Current State

- **Location**: `/home/deploy/projects/electron-test-app`
- **Tech**: Turborepo + Next.js 15 + Electron 35 + Go (WebRTC)
- **Status**: Active development, not ready for showcase
- **Description**: "BrowserStack for Electron apps" - AI-powered testing platform

### When to Add

**Prerequisites before showcase**:

- [ ] Working demo environment
- [ ] Video walkthrough recorded
- [ ] Core features stable
- [ ] Documentation complete
- [ ] At least one external user test

### Future Page Structure

```
/tools/aevp (or /electron-testing)

HERO
├── Headline: "Test Electron Apps Like Never Before"
├── Subhead: "AI-powered testing platform with real-time introspection"
├── [Request Beta Access] (waitlist)
├── Video demo autoplay (muted)

CAPABILITIES
├── Real-time Electron introspection
├── AI agent-driven testing
├── Cross-platform streaming (WebRTC)
├── Session orchestration
└── Accessibility tree inspection

TECH ARCHITECTURE
├── Monorepo diagram
├── WebRTC streaming explanation
├── MCP server integration
└── Agent coordination flow

BETA SIGNUP
├── Email capture
├── Use case selection
├── Company/project info
└── Early access benefits
```

---

## Site Architecture

### Proposed URL Structure

```
alexmayhew.dev/
├── /                      # Home (hero + intro)
├── /work                  # Project case studies
│   ├── /work/traceforge   # Full case study
│   ├── /work/claude-pilot # Full case study
│   └── /work/[other]      # Client work
├── /tools                 # Product landing pages
│   ├── /tools/traceforge  # Live vectorizer tool
│   └── /tools/pilot       # Download page
├── /about                 # Bio, skills, philosophy
├── /blog                  # Technical articles
└── /contact               # Contact form
```

### Navigation Strategy

```tsx
// Primary nav (minimal, 2026 trend)
<nav>
  <Logo />
  <NavLinks>
    <Link href="/work">Work</Link>
    <Link href="/tools">Tools</Link>
    <Link href="/about">About</Link>
    <Link href="/contact" className="cta">Let's Talk</Link>
  </NavLinks>
</nav>

// Tools dropdown (on hover/click)
<ToolsDropdown>
  <ToolLink href="/tools/traceforge">
    <Icon name="vector" />
    <span>TraceForge</span>
    <Badge>Live Tool</Badge>
  </ToolLink>
  <ToolLink href="/tools/pilot">
    <Icon name="terminal" />
    <span>Claude Pilot</span>
    <Badge>Download</Badge>
  </ToolLink>
</ToolsDropdown>
```

---

## Visual Design Guidelines

### Consistent Product Branding

Each product should have:

- **Icon**: Custom SVG icon in cyber-lime
- **Color accent**: Primary cyber-lime, secondary unique to product
- **Typography**: JetBrains Mono for product names

### Product Card Component

```tsx
// For /work and /tools listing
<ProductCard>
	<ProductIcon src={icon} />
	<ProductName>TraceForge</ProductName>
	<ProductType>Online Tool</ProductType>
	<ProductDescription>Transform raster images into clean, optimized SVG vectors</ProductDescription>
	<ProductCTA href="/tools/traceforge">Try Now →</ProductCTA>
</ProductCard>
```

### Screenshot Guidelines

- **Resolution**: 2x for retina (1400x900 minimum)
- **Theme**: Dark mode matching portfolio
- **Browser chrome**: Minimal or none
- **Annotations**: Cyber-lime highlights for callouts
- **Format**: WebP with PNG fallback

---

## Content Strategy

### Case Study Template

```markdown
# [Product Name]

## The Problem

[What challenge does this solve? Who has this problem?]

## The Approach

[How did you think through the solution? What decisions were made?]

## The Tech

[Stack, architecture, interesting technical challenges]

## The Result

[Screenshots, metrics, user feedback if available]

## Try It / Download It

[CTA to product page]
```

### Blog Post Ideas (Supporting Content)

1. "Building a Production SVG Vectorizer Without AI"
2. "Electron Security in 2026: What Actually Matters"
3. "Type-Safe IPC with tRPC in Electron Apps"
4. "Real-Time Memory Search Across Three Databases"
5. "From CLI to Control Center: Building Claude Pilot"

---

## Implementation Roadmap

### Phase 1: TraceForge (Week 1-2)

- [ ] Finalize product name
- [ ] Design landing page mockup
- [ ] Build embedded upload component
- [ ] Deploy FastAPI to production
- [ ] Create before/after showcase images
- [ ] Write case study

### Phase 2: Claude Pilot (Week 2-3)

- [ ] Create download page design
- [ ] Set up GitHub releases automation
- [ ] Record product walkthrough video
- [ ] Build platform detection logic
- [ ] Write installation documentation
- [ ] Create feature screenshots

### Phase 3: Portfolio Integration (Week 3-4)

- [ ] Build /tools route structure
- [ ] Create product card components
- [ ] Update navigation with Tools dropdown
- [ ] Add tools to sitemap
- [ ] SEO optimization for product pages

### Phase 4: AEVP (Future)

- [ ] Waitlist signup form
- [ ] Beta landing page
- [ ] Demo video production

---

## Metrics to Track

### Product Page Success

- Time on page
- Scroll depth
- CTA click rate
- Download/upload starts
- Completion rate (for vectorizer)

### Portfolio Impact

- Inbound inquiries mentioning tools
- GitHub stars/forks
- Direct traffic to tool pages
- Backlinks from dev communities

---

## Sources & References

### Portfolio Best Practices

- [Elementor: Best Web Developer Portfolio Examples](https://elementor.com/blog/best-web-developer-portfolio-examples/)
- [DEV Community: The Anthology of a Creative Developer](https://dev.to/nk2552003/the-anthology-of-a-creative-developer-a-2026-portfolio-56jp)
- [Webflow: Portfolio Website Examples](https://webflow.com/blog/design-portfolio-examples)

### SaaS Landing Pages

- [SaaSFrame: 2026 Landing Page Trends](https://www.saasframe.io/blog/10-saas-landing-page-trends-for-2026-with-real-examples)
- [Fibr: SaaS Landing Pages Best Practices](https://fibr.ai/landing-page/saas-landing-pages)
- [Unbounce: State of SaaS Landing Pages](https://unbounce.com/conversion-rate-optimization/the-state-of-saas-landing-pages/)

---

_This document should be updated as projects evolve and market trends shift._
