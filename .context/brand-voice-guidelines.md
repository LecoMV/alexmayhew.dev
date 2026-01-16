# alexmayhew.dev Brand Voice Guidelines

> **Version:** 1.0 | **Last Updated:** 2026-01-15
>
> These guidelines define how Alex Mayhew communicates across all content. Every piece of content—blog posts, case studies, documentation—must align with this voice.

---

## Core Identity

**Brand Philosophy:** Atmospheric Engineering
**Translation:** High-precision digital instruments, handcrafted with intentionality

**Archetype:** Creator-Sage Hybrid

- **Creator:** Builds things that matter, precision craftsmanship
- **Sage:** Expert knowledge, teaches through demonstration

---

## The Voice in One Sentence

> "Direct, technically precise, opinionated without arrogance—a senior engineer who explains complex systems clearly because they respect your intelligence, not because they're dumbing it down."

---

## Voice Dimensions

### Four-Axis Positioning

| Dimension                  | Position      | What This Means                              |
| -------------------------- | ------------- | -------------------------------------------- |
| **Technical ↔ Accessible** | 70% Technical | Use precise terminology, define on first use |
| **Formal ↔ Casual**        | 60% Formal    | Professional but not corporate               |
| **Confident ↔ Humble**     | 75% Confident | Strong opinions backed by evidence           |
| **Serious ↔ Witty**        | 80% Serious   | Dry humor acceptable, never jokes            |

### Core Attributes

1. **Precise** — Every word earns its place
2. **Direct** — No preamble, no hedge words
3. **Technical** — Comfortable with specifics
4. **Opinionated** — Takes stances, shows reasoning
5. **Human** — First person, admits trade-offs

---

## The Dual-Audience Principle

Every piece of content serves **two audiences simultaneously**:

### Audience 1: Technical Decision-Makers

- CTOs, VPs of Engineering, Senior Developers
- **What they need:** Proof of technical depth, architectural thinking
- **What they scan for:** Specific technologies, metrics, trade-offs

### Audience 2: Non-Technical Decision-Makers

- Founders, CEOs, Product Managers
- **What they need:** Confidence you can solve their problem
- **What they scan for:** Outcomes, timelines, cost implications

### The Solution: Progressive Disclosure

Structure all content in layers:

```
┌─────────────────────────────────────────────────────┐
│  LAYER 1: Executive Summary (50-75 words)          │
│  → Business impact, key metric, outcome            │
│  → Non-technical readers stop here satisfied       │
├─────────────────────────────────────────────────────┤
│  LAYER 2: The Approach (300-500 words)             │
│  → High-level architecture, decisions made         │
│  → Both audiences engage here                      │
├─────────────────────────────────────────────────────┤
│  LAYER 3: Implementation (expandable)              │
│  → Code samples, technical details                 │
│  → Technical readers dive deep                     │
└─────────────────────────────────────────────────────┘
```

---

## Writing Principles

### 1. Lead with Impact, Not Implementation

```markdown
❌ "We implemented a Redis caching layer with LRU eviction..."
✅ "Page load dropped from 3.2s to 480ms. Here's how."
```

### 2. Specific Over Vague

```markdown
❌ "Significantly improved performance"
✅ "Reduced P99 latency from 1.2s to 180ms"

❌ "Using modern technologies"
✅ "Next.js 15, PostgreSQL 16, deployed to Cloudflare Workers"
```

### 3. Acknowledge Trade-offs

```markdown
❌ "Server Components are better than Client Components"
✅ "Server Components reduce bundle size but require runtime consideration for dynamic data"
```

### 4. Show Reasoning, Not Just Conclusions

```markdown
❌ "I recommend Hono over Express"
✅ "For edge deployment, Hono's 14KB bundle outperforms Express's 208KB—
critical when cold starts cost you users"
```

### 5. Use First Person Deliberately

| Use     | When                                          |
| ------- | --------------------------------------------- |
| **I**   | Personal opinions, solo work, recommendations |
| **We**  | Collaborative projects, shared decisions      |
| **You** | Addressing the reader directly                |

Never use: "One should..." or "It is recommended that..."

---

## Sentence-Level Guidelines

### Do

- Start with strong verbs: "Build," "Ship," "Optimize," "Reduce"
- Keep sentences under 25 words (average 15-18)
- One idea per sentence
- Define technical terms on first use
- Include metrics where relevant

### Avoid

- Hedge words: "sort of," "kind of," "basically," "actually"
- Filler phrases: "In order to," "Due to the fact that"
- Passive voice: "The system was built" → "I built the system"
- Marketing speak: "leverage," "synergy," "cutting-edge," "revolutionary"
- Exclamation points (ever)

---

## Word Lists

### Use These Words

```
build, ship, deploy, optimize, reduce, constraint, trade-off,
architecture, system, precise, direct, honest, functional,
performance, latency, throughput, resilient, scalable, production,
root cause, bottleneck, edge case, regression
```

### Avoid These Words

```
leverage, synergy, game-changing, revolutionary, cutting-edge,
best-in-class, world-class, solution, innovative, passionate,
amazing, seamless, robust (unless technical context), ecosystem,
journey, empower, unlock, disrupt, paradigm
```

### Phrases to Replace

| Instead of                  | Use                             |
| --------------------------- | ------------------------------- |
| "Leverage our expertise"    | "Build systems that scale"      |
| "Cutting-edge technology"   | [Name the specific technology]  |
| "Seamless integration"      | "Works with [X] out of the box" |
| "Empower your team"         | "Your team ships faster"        |
| "Revolutionary approach"    | [Describe what's different]     |
| "Best-in-class performance" | "[X]ms latency, [Y]% uptime"    |

---

## Tone Shifts by Content Type

| Content Type      | Tone                      | Example                                                              |
| ----------------- | ------------------------- | -------------------------------------------------------------------- |
| **Homepage**      | Confident + Direct        | "I build production systems for technical teams."                    |
| **About**         | Warm + Professional       | "I work with 3-4 clients per year on projects worth obsessing over." |
| **Case Study**    | Analytical + Specific     | "Challenge: 40% cart abandonment. Root cause: 3.2s API latency."     |
| **Blog Post**     | Educational + Opinionated | "Why I stopped using [X] and what I use instead."                    |
| **Documentation** | Clear + Precise           | "Install the package. Configure the environment variables. Deploy."  |

---

## The Anti-AI Authenticity Checklist

Before publishing any content, verify:

- [ ] Contains at least one personal anecdote or specific experience
- [ ] Includes a contrarian or nuanced opinion (not generic best practices)
- [ ] Uses sentence length variety (some <5 words, some >25)
- [ ] Contains imperfections that reflect natural speech (fragments, asides)
- [ ] Has specific details only you would know (project names, metrics, constraints)
- [ ] Expresses genuine perspective: doubt, enthusiasm, frustration
- [ ] Includes trade-offs and limitations, not just benefits

### The "Fingerprint" Test

Ask: "Could this have been written by any developer, or does it clearly come from Alex Mayhew?"

Fingerprints include:

- Neo-Brutalist aesthetic references
- Specific tech stack opinions (Next.js, Tailwind, PostgreSQL)
- Edge deployment and performance obsession
- "Atmospheric" metaphors (precision instruments, handcrafted)
- Trade-off acknowledgment as a signature move

---

## Example Rewrites

### Homepage Hero

```markdown
❌ BEFORE (Generic):
"I'm a passionate full-stack developer creating innovative digital
solutions that transform businesses and deliver amazing user experiences."

✅ AFTER (Atmospheric):
"Full-stack systems for technical founders. Next.js, PostgreSQL,
deployed to the edge. I take 4 projects per year."
```

### Case Study Opening

```markdown
❌ BEFORE (Vague):
"Client X came to us with a challenging problem that required a
comprehensive solution leveraging modern technologies."

✅ AFTER (Specific):
"Problem: 100k monthly users, 40% checkout abandonment, $180k/month
in lost revenue. Root cause: 3.2s API response times."
```

### Blog Post Intro

```markdown
❌ BEFORE (Tutorial-style):
"In this article, we'll explore the amazing benefits of React Server
Components and how they can revolutionize your development workflow."

✅ AFTER (Opinionated):
"I migrated three production apps to Server Components last quarter.
Two improved significantly. One was a mistake. Here's how to know
which you're building."
```

### About Page

```markdown
❌ BEFORE (Generic):
"I'm passionate about code and creating great experiences. I believe
in clean code and best practices. Let's work together!"

✅ AFTER (Specific):
"6 years building production systems. TypeScript since 2019, Go for
tooling, PostgreSQL for almost everything. Previously at [Company]
and [Company]. Based in [Location], work globally."
```

---

## Content Structure Template

### Blog Post Structure

```markdown
# [Action-Oriented Title with Specificity]

## TL;DR

[1-2 sentences: Business impact + key insight. Non-technical readers
get value here.]

## The Problem

[What pain point does this solve? Who has this problem? Why does it
matter? 150-200 words.]

## The Approach

[High-level solution. What did we choose and why? Acknowledge
trade-offs. 300-400 words.]

## Implementation

[Technical details for those who want them. Code samples, architecture
diagrams, specific configurations. Progressive disclosure with
expandable sections if needed. 500-1000 words.]

## Results

[Metrics. Before/after. What worked, what didn't. Be honest about
limitations. 150-200 words.]

## When to Use This

[Who should apply this approach? Who shouldn't? Constraints and
prerequisites. 100-150 words.]
```

---

## Voice Testing Questions

Before publishing, ask:

1. **Authority:** Would a CTO find this credible?
2. **Honesty:** Can I defend every claim?
3. **Respect:** Does this respect the reader's intelligence?
4. **Precision:** Have I removed all filler?
5. **Authenticity:** Does this sound like me spoken aloud?
6. **Value:** Did the reader learn something actionable?

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│  ATMOSPHERIC ENGINEERING VOICE                              │
├─────────────────────────────────────────────────────────────┤
│  ✓ Precise      ✓ Direct       ✓ Technical                 │
│  ✓ Opinionated  ✓ Human        ✓ Trade-off aware           │
├─────────────────────────────────────────────────────────────┤
│  ✗ Marketing speak    ✗ Vague claims    ✗ Hedge words      │
│  ✗ Passive voice      ✗ Generic advice  ✗ Exclamation!     │
├─────────────────────────────────────────────────────────────┤
│  EVERY PIECE: Impact first → Approach → Details            │
│  EVERY CLAIM: Specific metric or remove                    │
│  EVERY POST: At least one personal insight/trade-off       │
└─────────────────────────────────────────────────────────────┘
```

---

## Appendix: Reference Voices to Study

1. **Stripe Engineering Blog** — Technical precision, business context
2. **Linear Blog** — Opinionated product thinking, clear stances
3. **Vercel Changelog** — Direct technical updates, no fluff
4. **Julia Evans (jvns.ca)** — Non-condescending explanations
5. **Maggie Appleton** — Visual explanations, information design

---

_This document is the source of truth for alexmayhew.dev content voice. When in doubt, return here._
