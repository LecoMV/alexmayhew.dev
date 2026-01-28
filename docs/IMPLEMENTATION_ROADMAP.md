# Implementation Roadmap: Marketing & Content System

> **Created:** 2026-01-27
> **Based on:** All research documents in `/docs/`
> **Goal:** 10K newsletter subscribers, 2-5 consulting leads/month in 12 months

---

## Executive Summary

This roadmap prioritizes **quick wins** that create compounding value. The strategy is:

1. **Build the engine first** (newsletter + LLM automation)
2. **Create content once, distribute everywhere** (1-to-10 framework)
3. **Let automation handle the repetitive work**

---

## Phase 1: Infrastructure (Week 1-2)

### 1.1 Local LLM Setup ⭐ Priority

**Task:** Install Ollama + Gemma 2 9B on your desktop

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull Gemma 2 9B (best for creative writing on RTX 3080)
ollama pull gemma2:9b

# Test it
ollama run gemma2:9b "Write a LinkedIn hook about microservices being overhyped"
```

**Why first:** Everything else depends on having LLM access for content generation.

**Bead:** `amdev-8eh` (update description to Gemma 2 9B)

---

### 1.2 Groq API Setup

**Task:** Create free Groq account for Llama 3.3 70B access

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up (no credit card)
3. Generate API key
4. Store in `pass`: `pass insert claude/groq/api-key`

**Free tier:** 14,400 requests/day, 6,000 tokens/minute

**Why:** Access to 70B quality when local 9B isn't enough.

---

### 1.3 Newsletter Platform Setup

**Task:** Set up Buttondown account

1. Create account at [buttondown.email](https://buttondown.email)
2. Configure sending domain (alexmayhew.dev)
3. Set up API key for automation
4. Create welcome email template

**Bead:** `amdev-4yj`

---

### 1.4 Newsletter Signup Components

**Task:** Add signup forms to alexmayhew.dev

- Homepage hero CTA
- Blog post inline signup
- Footer signup
- Post-article signup

**Bead:** `amdev-9sr`

---

## Phase 2: Content System (Week 2-3)

### 2.1 Obsidian Content Vault

**Task:** Set up Obsidian with content planning structure

```
content-vault/
├── 📁 Pillars/           # Content themes
│   ├── architecture.md
│   ├── migrations.md
│   ├── performance.md
│   └── saas-patterns.md
├── 📁 Blog-Posts/        # Source content
├── 📁 Repurposed/        # Generated content
│   ├── linkedin/
│   ├── twitter/
│   └── newsletter/
├── 📁 Templates/         # Prompt templates
└── 📁 Analytics/         # Performance tracking
```

**Bead:** `amdev-k7q`

---

### 2.2 Repurposing Templates

**Task:** Create prompt templates for each platform

Save these in Obsidian or directly in n8n:

**LinkedIn Carousel:**

```
You are a B2B ghostwriter for a Software Architect. Convert this blog post into a LinkedIn carousel:
- Slide 1: Bold hook statement
- Slide 2: The problem
- Slides 3-8: Key insights (one per slide, max 30 words)
- Slide 9: Summary
- Slide 10: CTA

Blog post: {{content}}
```

**Twitter Thread:**

```
Convert this into a Twitter thread of 8-12 tweets:
- Tweet 1: Punchy hook that stands alone
- Middle tweets: One insight each, max 240 chars
- Last tweet: Link to full article

No hashtags inline. Keep technical accuracy.

Blog post: {{content}}
```

**Newsletter Section:**

```
Write a "This Week's Decision" section for a technical newsletter:
- 2-3 sentence intro
- "The Situation" (50-75 words)
- "The Insight" (100-150 words)
- "When to Apply This" (3 bullet points)

Blog post: {{content}}
```

**Bead:** `amdev-cv8`

---

### 2.3 n8n Automation Setup

**Task:** Deploy n8n and create repurposing workflow

```bash
# Run n8n with Docker
docker run -d --name n8n \
  --network host \
  -v n8n_data:/home/node/.n8n \
  n8nio/n8n
```

**Workflow structure:**

```
Blog Post Published (Webhook)
    ↓
Fetch Post Content
    ↓
┌─────────────────┬─────────────────┬─────────────────┐
│  Ollama         │  Ollama         │  Ollama         │
│  → LinkedIn     │  → Twitter      │  → Newsletter   │
│     Carousel    │     Thread      │     Section     │
└────────┬────────┴────────┬────────┴────────┬────────┘
         ↓                 ↓                 ↓
    Save to Notion    Save to Notion    Add to Buttondown
         ↓                 ↓                 ↓
    Notify Slack     Notify Slack      Notify Slack
```

---

## Phase 3: Content Calendar (Week 3-4)

### 3.1 Newsletter Content Calendar

**Frequency:** Weekly, Tuesday 9 AM EST

**Format: "The Architect's Brief"**

```markdown
# This Week's Decision

[Featured insight from blog post]

---

## 🔗 Links Worth Your Time

1. [Article 1] - My take: ...
2. [Article 2] - My take: ...
3. [Article 3] - My take: ...

---

## 📊 From the Trenches

[Personal observation or war story]

---

👋 Reply and tell me what you're building.
```

**Bead:** `amdev-peg`

---

### 3.2 Weekly Posting Schedule

| Day           | Platform   | Content                    | Time      |
| ------------- | ---------- | -------------------------- | --------- |
| **Monday**    | Blog       | Publish new post           | -         |
| **Monday**    | Dev.to     | Cross-post (canonical URL) | 2 PM EST  |
| **Tuesday**   | Newsletter | Weekly issue               | 9 AM EST  |
| **Tuesday**   | Twitter    | Thread from post           | 10 AM EST |
| **Wednesday** | LinkedIn   | Carousel                   | 10 AM EST |
| **Thursday**  | Twitter    | Hot take                   | 10 AM EST |
| **Thursday**  | Bluesky    | Cross-post thread          | 11 AM EST |
| **Friday**    | LinkedIn   | Text post                  | 10 AM EST |

**Discord Strategy:** Help-first engagement in Reactiflux, Next.js Discord, Python Discord. No self-promotion until established reputation (30+ helpful answers).

---

## Phase 4: LinkedIn Authority (Week 4-6)

### 4.1 Profile Overhaul

**Bead:** `amdev-9ta`

- Headline: "Technical Advisor | I help CTOs avoid $500K architecture mistakes"
- Banner: Custom design with alexmayhew.dev branding
- About: Rewrite with Technical Advisor positioning
- Featured: Lead magnet + top posts

---

### 4.2 First 8 LinkedIn Posts

**Bead:** `amdev-6h5`

Topics from existing blog posts:

1. PostgreSQL RLS for multi-tenancy
2. When to NOT use microservices
3. The real cost of technical debt
4. Why your SaaS needs a monolith first
5. Database migrations that won't wake you at 3 AM
6. The architecture decision I regret most
7. What CTOs actually want from technical advisors
8. How I replaced $500/mo in API costs with local LLMs

---

### 4.3 Engagement Strategy

**Daily routine (30 min):**

- Comment on 5-10 posts from target audience
- Respond to all comments on your posts
- Share 1 relevant post with commentary

**Bead:** `amdev-bd4`

---

## Phase 5: Community Infiltration (Week 6-8)

### 5.1 Join Key Communities

| Community              | Members   | Why                              |
| ---------------------- | --------- | -------------------------------- |
| CTO Craft              | 18K+ CTOs | Direct access to decision-makers |
| Rands Leadership Slack | Free      | Engineering leaders              |
| Reactiflux Discord     | 230K+     | React/Next.js developers         |
| Next.js Discord        | 114K+     | Framework community              |

**Bead:** `amdev-qx1`

---

### 5.2 Help-First Strategy

**Rule:** 90% helping, 10% promoting

- Answer questions thoroughly
- Share relevant blog posts when genuinely helpful
- Build reputation before any self-promotion
- Track questions that become blog post ideas

**Beads:** `amdev-r50`, `amdev-sk6`, `amdev-h77`

---

## Phase 6: Agency Partnerships (Month 3+)

### 6.1 Build Prospect List

**Target:** Agencies that need technical advisors for client projects

- Digital agencies with enterprise clients
- Design agencies expanding into dev
- Marketing agencies with SaaS clients

**Bead:** `amdev-cix`

---

### 6.2 Outreach Campaign

**Goal:** 50 agencies contacted, 5-10 conversations, 2-3 partnerships

**Email template:**

```
Subject: Technical partner for your [SaaS/enterprise] clients?

Hi [Name],

I noticed [Agency] works with [client type].

I'm a technical advisor who helps agencies deliver complex projects
without hiring full-time architects. My clients include [social proof].

Would it make sense to chat about how we might work together?

Alex
```

**Beads:** `amdev-hts`, `amdev-t3y`

---

## Tech Stack Summary

### Content Creation

| Tool                  | Purpose                     | Cost                   |
| --------------------- | --------------------------- | ---------------------- |
| Obsidian              | Content planning & vault    | Free                   |
| Gemma 2 9B (Ollama)   | Local LLM for writing       | Free                   |
| Groq API              | Cloud LLM (70B quality)     | Free                   |
| Cloudflare Workers AI | Edge LLM (already deployed) | Free (10K neurons/day) |
| Carbon                | Code snippet images         | Free                   |
| Canva                 | Carousel design             | Free                   |

### Distribution

| Tool       | Purpose                       | Cost                 |
| ---------- | ----------------------------- | -------------------- |
| Buttondown | Newsletter                    | Free → $29/mo at 10K |
| Postiz     | Social scheduling (self-host) | Free                 |
| Dev.to     | Developer blog cross-post     | Free                 |
| n8n        | Workflow automation           | Free (self-hosted)   |

### Analytics

| Tool               | Purpose          | Cost     |
| ------------------ | ---------------- | -------- |
| GA4                | Site analytics   | Free     |
| Buttondown         | Email metrics    | Included |
| LinkedIn Analytics | Post performance | Free     |

**Total monthly cost:** $0 until 10K subscribers

---

## Success Metrics

### Month 1

- [ ] Newsletter launched with 100+ subscribers
- [ ] 4 blog posts published
- [ ] 16+ LinkedIn posts
- [ ] n8n automation working

### Month 3

- [ ] 1,000 newsletter subscribers
- [ ] 2,000 LinkedIn followers
- [ ] 5,000 monthly site sessions
- [ ] 1-2 inbound leads

### Month 6

- [ ] 5,000 newsletter subscribers
- [ ] 5,000 LinkedIn followers
- [ ] 15,000 monthly site sessions
- [ ] 3-5 inbound leads/month

### Month 12

- [ ] 10,000 newsletter subscribers
- [ ] 10,000 LinkedIn followers
- [ ] 30,000 monthly site sessions
- [ ] 5-10 inbound leads/month
- [ ] Sustainable consulting revenue

---

## Quick Start Checklist

### This Week

- [ ] Install Ollama + Gemma 2 9B
- [ ] Create Groq account
- [ ] Create Buttondown account
- [ ] Set up Obsidian vault

### Next Week

- [ ] Add newsletter signup to site
- [ ] Write first 4 newsletter issues (buffer)
- [ ] Create repurposing templates
- [ ] Set up n8n workflow

### Week 3

- [ ] Launch newsletter
- [ ] Overhaul LinkedIn profile
- [ ] Post first LinkedIn carousel
- [ ] Join 2-3 communities

---

## Related Documents

- [MASTER_MARKETING_PLAN.md](./MASTER_MARKETING_PLAN.md) - Strategic overview
- [SELF_HOSTED_LLM_GUIDE.md](./SELF_HOSTED_LLM_GUIDE.md) - LLM setup details
- [NEWSLETTER_STRATEGY.md](./NEWSLETTER_STRATEGY.md) - Newsletter deep-dive
- [CONTENT_REPURPOSING_SYSTEM.md](./CONTENT_REPURPOSING_SYSTEM.md) - Templates & workflow
- [SOCIAL_MEDIA_MARKETING_PLAN.md](./SOCIAL_MEDIA_MARKETING_PLAN.md) - Platform strategies
- [CONTENT_STRATEGY_TECHNICAL_ADVISOR.md](./CONTENT_STRATEGY_TECHNICAL_ADVISOR.md) - CMS architecture

---

_This roadmap should be reviewed weekly and updated based on what's working._
