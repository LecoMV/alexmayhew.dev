# Master Marketing & Content Plan

> **alexmayhew.dev - Technical Advisor Lead Generation Engine**
>
> **Created:** 2026-01-27
> **Status:** Active
> **Goal:** 10K newsletter subscribers, 2-5 consulting leads/month within 12 months

---

## Executive Summary

This master plan synthesizes all research and strategy for transforming alexmayhew.dev from a portfolio site into a **Content Operating System** that attracts high-value consulting clients. The strategy pivots from "Freelancer" positioning to "Technical Advisor" - selling strategic expertise rather than implementation hours.

### The Core Formula

```
CONTENT CREATION (1x effort)
         ↓
    AUTOMATION PIPELINE
         ↓
MULTI-PLATFORM DISTRIBUTION (10x reach)
         ↓
    TRUST & AUTHORITY
         ↓
INBOUND CONSULTING LEADS
```

### Key Metrics

| Metric                 | 3 Month | 6 Month | 12 Month    |
| ---------------------- | ------- | ------- | ----------- |
| Newsletter subscribers | 1,000   | 5,000   | 10,000      |
| LinkedIn followers     | 2,000   | 5,000   | 10,000      |
| Monthly site sessions  | 5,000   | 15,000  | 30,000      |
| Inbound leads/month    | 1-2     | 3-5     | 5-10        |
| Consulting revenue     | Track   | Growing | Sustainable |

---

## Component Documents

This master plan references detailed strategy documents. Each handles a specific domain:

| Document                                                                         | Purpose             | Key Content                                    |
| -------------------------------------------------------------------------------- | ------------------- | ---------------------------------------------- |
| [SOCIAL_MEDIA_MARKETING_PLAN.md](./SOCIAL_MEDIA_MARKETING_PLAN.md)               | Platform strategies | LinkedIn, X, HN, Bluesky, Communities          |
| [SOCIAL_MEDIA_STRATEGY_2026.md](./SOCIAL_MEDIA_STRATEGY_2026.md)                 | Detailed research   | ROI benchmarks, posting times, growth tactics  |
| [NEWSLETTER_STRATEGY.md](./NEWSLETTER_STRATEGY.md)                               | Email system        | Buttondown setup, welcome sequence, CTAs       |
| [CONTENT_REPURPOSING_SYSTEM.md](./CONTENT_REPURPOSING_SYSTEM.md)                 | 1-to-10 framework   | Templates, weekly calendar, tools stack        |
| [CONTENT_STRATEGY_TECHNICAL_ADVISOR.md](./CONTENT_STRATEGY_TECHNICAL_ADVISOR.md) | Strategic blueprint | CMS architecture, ADRs, positioning theory     |
| [SELF_HOSTED_LLM_GUIDE.md](./SELF_HOSTED_LLM_GUIDE.md)                           | AI infrastructure   | Ollama, Groq, n8n integration, model selection |

---

## Part 1: Positioning & Messaging

### The Freelancer → Technical Advisor Pivot

| Dimension      | Freelancer (Old)          | Technical Advisor (New)                 |
| -------------- | ------------------------- | --------------------------------------- |
| **Value Prop** | "I build things"          | "I guide strategic technical decisions" |
| **Content**    | Tutorials, code snippets  | ADRs, case studies, war stories         |
| **CTA**        | "Hire me for a project"   | "Book a strategic audit"                |
| **Risk**       | Execution (does it work?) | Strategic (is it the right thing?)      |
| **Pricing**    | Hourly/project            | Retainer/advisory                       |

### Target Audience

**Primary:** CTOs, VPs of Engineering, Technical Founders at scaling companies (Series A-C)

**Their Problems:**

- Legacy system modernization
- Scaling architecture decisions
- Technical debt management
- Team productivity optimization
- Build vs. buy decisions

**Why They Hire Advisors:**

- Need experienced judgment, not just hands
- Want to avoid expensive mistakes
- Lack internal expertise for specific decisions
- Need external validation for stakeholders

### Brand Voice

- **Opinionated** - Take stands, don't hedge
- **Experienced** - Reference real situations
- **Strategic** - Focus on "why" not "how"
- **Accessible** - Complex ideas, simple language
- **Honest** - Acknowledge trade-offs and failures

---

## Part 2: Content Strategy

### The Content Operating System

Content is structured data, not static pages. Every piece should be designed for repurposing at creation time.

#### Content Types

**1. Architectural Decision Records (ADRs)**

```markdown
# ADR: [Title]

## Status

Accepted | Deprecated | Proposed

## Context

[The situation requiring a decision]

## Decision

[What we decided]

## Consequences

### Positive

- [Benefit 1]
- [Benefit 2]

### Negative

- [Trade-off 1]
- [Trade-off 2]
```

**Why ADRs work:** They demonstrate trade-off analysis - the core skill clients pay for.

**2. War Stories (Case Studies)**

```markdown
# [Dramatic Hook Title]

## The Incident

[What went wrong / the challenge]

## The Diagnostics

[How you found the root cause]

## The Fix

[The architectural solution]

## The Result

[Measurable outcome]
```

**Why War Stories work:** They create emotional trust through shared technical trauma.

**3. Technical Deep-Dives**

- System design breakdowns
- Technology comparisons
- Performance optimization guides
- Security architecture patterns

**4. Newsletter-First Content**

- "This Week's Decision" insights
- Curated links with commentary
- Behind-the-scenes of consulting work

### Content Pillars (Rotate Weekly)

| Pillar                     | Example Topics                                |
| -------------------------- | --------------------------------------------- |
| **Architecture Decisions** | Monolith vs microservices, database selection |
| **Migration Strategies**   | Legacy modernization, platform migrations     |
| **Performance**            | Caching, database optimization, scaling       |
| **SaaS Patterns**          | Multi-tenancy, billing, auth                  |
| **Contrarian Takes**       | "Why X is wrong for your startup"             |

### Repurposing Fields (Add to Every Post)

```yaml
# Frontmatter for every blog post
socialHook: "1-2 sentence scroll-stopper for social"
keyTakeaways:
  - "Takeaway 1"
  - "Takeaway 2"
  - "Takeaway 3"
hotTake: "Contrarian single-tweet version"
platformStatus:
  newsletter: false
  linkedin: false
  twitter: false
  hackernews: false
```

---

## Part 3: Platform Strategy

### Priority Matrix

| Platform          | Priority | Time/Week | Purpose                            |
| ----------------- | -------- | --------- | ---------------------------------- |
| **Newsletter**    | P0       | 2 hrs     | Owned audience, direct conversion  |
| **LinkedIn**      | P0       | 5 hrs     | Lead generation (62% of B2B leads) |
| **Twitter/X**     | P1       | 3 hrs     | Thought leadership, dev community  |
| **Hacker News**   | P1       | 2 hrs     | Technical credibility              |
| **Bluesky**       | P2       | 1 hr      | Early adoption opportunity         |
| **Slack/Discord** | P2       | 3 hrs     | Direct access to decision-makers   |
| **Facebook**      | Skip     | 0         | Poor B2B ROI                       |

### Platform-Specific Strategies

**Newsletter (See [NEWSLETTER_STRATEGY.md](./NEWSLETTER_STRATEGY.md))**

- Platform: Buttondown
- Frequency: Weekly (Tuesday 9 AM EST)
- Format: "This Week's Decision" + curated links
- Goal: 10K subscribers in 12 months

**LinkedIn (See [SOCIAL_MEDIA_MARKETING_PLAN.md](./SOCIAL_MEDIA_MARKETING_PLAN.md))**

- Frequency: 3-5 posts/week
- Best times: Tuesday-Thursday, 10 AM - 12 PM
- Formats: Carousels (highest), text posts, PDFs
- Engagement: Comment on 5-10 posts daily

**Twitter/X**

- Frequency: 1-3 tweets/day
- Threads: Weekly (8-12 tweets)
- Strategy: Hot takes + technical threads
- Engagement: Reply within 1 hour

**Hacker News**

- Frequency: 1-2 submissions/month (max)
- Timing: 6-9 AM Pacific
- Rules: No marketing language, be intellectually honest
- Strategy: Build karma through comments first

**Communities to Join**

- CTO Craft (18K+ CTOs, FREE)
- MicroConf Connect ($49/mo)
- Reactiflux Discord (230K+)
- Next.js Discord (114K+)
- Rands Leadership Slack (FREE)

---

## Part 4: The Repurposing Pipeline

### Weekly Workflow

| Day           | Primary Action              | Platforms        |
| ------------- | --------------------------- | ---------------- |
| **Monday**    | Publish blog post           | Blog             |
| **Tuesday**   | Newsletter + Twitter thread | Email, Twitter   |
| **Wednesday** | LinkedIn carousel           | LinkedIn         |
| **Thursday**  | Hot take + Bluesky          | Twitter, Bluesky |
| **Friday**    | LinkedIn text post          | LinkedIn         |
| **Weekend**   | Community engagement        | Slack/Discord    |

### 1-to-10 Framework

```
1 BLOG POST
    │
    ├── Newsletter section (15 min)
    ├── LinkedIn carousel (30 min)
    ├── LinkedIn text post (10 min)
    ├── Twitter thread (20 min)
    ├── Twitter hot take (2 min)
    ├── Bluesky cross-post (5 min)
    ├── HN submission (5 min)
    └── Community answer database (0 min - reactive)

Total: ~2 hours = 10+ content pieces
```

See [CONTENT_REPURPOSING_SYSTEM.md](./CONTENT_REPURPOSING_SYSTEM.md) for detailed templates.

---

## Part 5: Tools & Infrastructure

### The Stack

| Layer                | Tool                 | Cost          | Purpose                      |
| -------------------- | -------------------- | ------------- | ---------------------------- |
| **Content Planning** | Obsidian             | Free          | Hub-and-spoke visualization  |
| **Visualization**    | Obsidian Canvas      | Free          | Content relationship mapping |
| **Scheduling**       | Postiz (self-hosted) | ~$5/mo VPS    | Multi-platform posting       |
| **Alt Scheduling**   | Typefully            | Free (15/mo)  | Twitter/X focus              |
| **Automation**       | N8N (self-hosted)    | Free          | Cross-posting, notifications |
| **Newsletter**       | Buttondown           | $29/mo at 10K | API-first, dev-friendly      |
| **Design**           | Canva                | Free          | Carousels                    |
| **Code Images**      | Carbon               | Free          | Syntax-highlighted snippets  |
| **Analytics**        | GA4 + PostHog        | Free          | Traffic + behavior           |

### Setup Options

**Option A: Minimal ($0/month)**

```
Obsidian → Typefully (15 posts/mo) → Manual cross-posting
```

**Option B: Automated (~$5/month)**

```
Obsidian → Git → Postiz (Docker) → N8N automation
```

**Option C: Full Pipeline (~$35/month at scale)**

```
Obsidian → Postiz → N8N → Buttondown → All platforms automated
```

### Future Consideration: Sanity.io

If automation needs grow, consider migrating from Git-based markdown to Sanity.io CMS:

- GROQ queries for structured data extraction
- No markdown parsing needed
- Schema-as-code (developer-friendly)
- Free tier sufficient for solo advisor

See [CONTENT_STRATEGY_TECHNICAL_ADVISOR.md](./CONTENT_STRATEGY_TECHNICAL_ADVISOR.md) for detailed CMS analysis.

---

## Part 6: Lead Generation Funnel

### The Journey

```
AWARENESS
├── Blog posts (SEO)
├── Social media posts
├── Community answers
├── HN/Reddit visibility
│
▼
INTEREST
├── Newsletter signup
├── Social follow
├── Return visits
│
▼
CONSIDERATION
├── Read multiple posts
├── Check services pages
├── Share with colleagues (dark social)
│
▼
DECISION
├── Contact form
├── Direct DM
├── Referral from colleague
```

### Conversion Points

1. **Newsletter signup** - Primary conversion goal
   - Inline in blog posts
   - Homepage hero
   - Exit-intent (optional)
   - Footer on every page

2. **Lead magnet** - "SaaS Architecture Decision Framework" PDF

3. **Contact CTA** - Soft ask in newsletter, services pages

4. **Referral program** - $2-3K per successful introduction

### The Trust Ladder (CTA Progression)

**Months 1-3 (Low commitment):**

- "Hit reply and tell me about your stack"
- "Forward to a colleague"

**Months 3-6 (Medium commitment):**

- "Download my Architecture Decision Framework"
- "Join my monthly office hours"

**Months 6+ (High commitment):**

- "Book a free 30-minute architecture review"
- "Let's discuss your modernization project"

---

## Part 7: Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)

**Infrastructure:**

- [ ] Set up Buttondown account
- [ ] Configure newsletter signup on site
- [ ] Create welcome sequence (5 emails)
- [ ] Set up Obsidian content vault
- [ ] Install Typefully or deploy Postiz

**Content:**

- [ ] Add repurposing fields to blog frontmatter
- [ ] Create first ADR template
- [ ] Write first 4 newsletter issues (buffer)

### Phase 2: Launch (Weeks 3-4)

**Newsletter:**

- [ ] Announce on LinkedIn
- [ ] Tweet thread about launch
- [ ] Email personal network
- [ ] Add to email signature
- [ ] Send first issue

**Content System:**

- [ ] Run first full repurposing cycle
- [ ] Establish weekly posting rhythm
- [ ] Join 2-3 Slack/Discord communities

### Phase 3: Growth (Months 2-3)

**Scaling:**

- [ ] Implement referral program
- [ ] Create lead magnet PDF
- [ ] Cross-promote with complementary newsletters
- [ ] Submit to HN (high-quality technical posts)
- [ ] Build community reputation (90/10 rule)

**Optimization:**

- [ ] Track metrics weekly
- [ ] A/B test subject lines
- [ ] Double down on what works
- [ ] Cut what doesn't

### Phase 4: Conversion (Months 4-6)

**Pipeline:**

- [ ] Add case study CTAs to high-performing content
- [ ] Formalize consultation offering
- [ ] Launch monthly office hours
- [ ] Build agency partnership list
- [ ] Draft referral program for past clients

---

## Part 8: Metrics & Review Cadence

### Weekly Review (15 min)

| Metric                    | Tool       | Target      |
| ------------------------- | ---------- | ----------- |
| Newsletter open rate      | Buttondown | >25%        |
| Newsletter click rate     | Buttondown | >3%         |
| LinkedIn impressions      | LinkedIn   | 5K+         |
| Twitter thread engagement | Twitter    | Track trend |
| New subscribers           | Buttondown | Track       |

### Monthly Review (1 hour)

- [ ] Total subscriber count
- [ ] Best/worst performing content
- [ ] Platform ROI (time vs. results)
- [ ] Consulting leads attributed
- [ ] Content gaps identified
- [ ] Adjust strategy as needed

### Quarterly Review (Half day)

- [ ] Revenue from organic leads
- [ ] Subscriber quality assessment
- [ ] Platform strategy review
- [ ] Tool stack evaluation
- [ ] Next quarter planning

---

## Part 9: The Uncomfortable Truths

1. **First 6 months will feel like shouting into void** - Keep going anyway

2. **Your first clients will come from your network** - Content builds long-term pipeline

3. **Most content will underperform** - 1 in 10 posts drives 90% of results

4. **Dark social is real** - You can't track most sharing (Slack, email, WhatsApp)

5. **Consistency beats perfection** - Good content regularly > perfect content rarely

6. **Community > broadcasting** - Relationships matter more than follower counts

7. **It's a 12-month game minimum** - SEO takes 6-12 months; first leads at 4-6 months

---

## Quick Reference

### Daily Checklist (30 min)

- [ ] Engage with 5-10 LinkedIn posts
- [ ] Respond to comments/DMs
- [ ] Check community channels for questions to answer

### Weekly Checklist (2-3 hours)

- [ ] Write/publish blog post (or repurpose existing)
- [ ] Send newsletter (Tuesday)
- [ ] Create LinkedIn carousel
- [ ] Post Twitter thread
- [ ] Review weekly metrics

### Monthly Checklist (2 hours)

- [ ] Plan next month's content
- [ ] Review performance data
- [ ] Adjust strategy
- [ ] Reach out to 5 potential collaborators

---

## Document Changelog

| Date       | Change                                                 |
| ---------- | ------------------------------------------------------ |
| 2026-01-27 | Initial master plan created, synthesizing all research |

---

_This plan should be reviewed monthly and updated based on what's working._
