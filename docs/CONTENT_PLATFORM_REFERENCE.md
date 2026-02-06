# Content Platform Reference

> Complete reference for the alexmayhew.dev content platform — infrastructure, brand identity, content strategy, social media operations, and automation. This document is the starting point for any future session touching content.

_Last updated: 2026-02-05_

---

## Table of Contents

1. [Brand Identity & Voice](#brand-identity--voice)
2. [Content Architecture](#content-architecture)
3. [Infrastructure](#infrastructure)
4. [Social Media Operations](#social-media-operations)
5. [Newsletter Operations](#newsletter-operations)
6. [Content Repurposing Pipeline](#content-repurposing-pipeline)
7. [Posting Schedule & Cadence](#posting-schedule--cadence)
8. [Quality Gates](#quality-gates)
9. [Troubleshooting](#troubleshooting)
10. [Document Map](#document-map)

---

## Brand Identity & Voice

### Who Alex Mayhew Is

**Role:** Technical Advisor (NEVER freelancer, consultant, or developer for hire)

**Tagline:** "I help CTOs avoid $500K mistakes"

**Positioning:** Strategic architecture guidance for ambitious startups. The person founders call before making irreversible technical decisions.

**Experience Lens:** Speaks from direct advisory experience with 30+ startups. Uses phrases like "I've advised...", "The founders I work with...", "I've seen the failure patterns..."

### The Six Voice Pillars

Every piece of content — blog, newsletter, tweet, LinkedIn post, reply — must express these six qualities:

| Pillar                        | What It Means                               | Example                                                                                   |
| ----------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Technical Precision**       | Specific numbers, never vague               | "40-60% of year one spent on infrastructure" not "a lot of time"                          |
| **Direct & Authoritative**    | Clear positions, no hedging                 | "Your startup doesn't need Kubernetes" not "You might want to consider alternatives"      |
| **Business Context First**    | Every tech point ties to outcomes           | "Stop optimizing for hourly rate. Start optimizing for cost per unit of delivered value." |
| **Experienced Perspective**   | Lived experience, not theory                | "I've built SaaS platforms serving 100,000+ users"                                        |
| **Dense Information**         | Every sentence carries weight, no filler    | No "In today's world", "It goes without saying", "As we all know"                         |
| **Contrarian When Warranted** | Challenge conventional wisdom with evidence | "A $200/hr senior developer often costs LESS than a $30/hr junior"                        |

### What We NEVER Use

- Emojis (absolutely zero, ever)
- Exclamation points (rarely, if ever)
- "Game-changer", "revolutionary", "awesome", "amazing" (marketing buzzwords)
- "Perhaps", "maybe", "might want to" (hedging undermines authority)
- "Just", "simply", "easy" (minimizes complexity)
- "Best practices" without explaining why (generic advice anyone could give)
- "Leverage", "utilize" (corporate speak)
- "Freelancer", "for hire" (undermines advisor positioning)

### What We DO Use

- Em dashes — for asides and emphasis
- Specific numbers: "$315-595K in year one", "8-20 hours per month", "40%"
- Decision frameworks: "The transition point: $5-10M ARR or 15+ engineers"
- War stories (anonymized): "I watched a founder spend 3 months setting up Kubernetes..."
- Rhetorical questions (sparingly): "What's the hardest leadership hire you've had to make?"
- Technical terms with context — never gatekeep, always explain the business impact

### Tone by Context

**LinkedIn posts:** Authoritative but approachable. Dense information. 1,000-1,300 characters. Short paragraphs with lots of white space. End with a specific question (never "thoughts?").

**X/Twitter:** Punchier, more direct. Hot takes with evidence. 280 chars for single tweets, threads for depth. More conversational than LinkedIn.

**Replies/Comments:** Match the energy of the conversation. Validate what's correct, redirect what's off, add one insight they didn't mention. 2-4 sentences max.

**Newsletter:** More personal and reflective. Can show uncertainty or evolving thinking. Still data-driven but warmer tone.

**Full voice specification:** `docs/VOICE_GUIDE.md`

---

## Content Architecture

### Hub-and-Spoke Model

The blog uses a hub-and-spoke content strategy with 5 comprehensive guide hubs and 39 spoke posts, totaling 44 blog posts.

| Hub                                    | Series Key                | Spokes | Topics                                                  |
| -------------------------------------- | ------------------------- | ------ | ------------------------------------------------------- |
| SaaS Architecture Decision Framework   | `saas-architecture`       | 11     | Multi-tenancy, PMF, boring tech, build vs buy           |
| Engineering Leadership: Founder to CTO | `engineering-leadership`  | 6      | IC to lead, hiring, fractional CTO, senior paradox      |
| Modern Frontend Architecture           | `frontend-architecture`   | 8      | Neo-brutalism, design tokens, RSC, accessibility        |
| Performance Engineering Playbook       | `performance-engineering` | 8      | CWV, CDN, cold starts, edge computing, monitoring       |
| AI-Assisted Development Guide          | `ai-development`          | 6      | Generative debt, code review, LLM architecture, prompts |

**How it works:**

- Hub posts have `isHub: true` in frontmatter
- Spoke posts have `series: "[cluster-name]"` in frontmatter
- Every spoke links back to its hub ("Part of [Hub]" callout)
- Every spoke has a "More in This Series" section linking 3-5 related spokes
- Cross-cluster posts get "Related Guides" linking to other hubs
- All 20 pSEO service pages link to relevant hubs

**Adding new content:**

- New spoke: Create MDX with `series: "[cluster-name]"`, add hub callout and series links
- New hub: Create MDX with `isHub: true`, appears automatically in "Comprehensive Guides" grid

**Content locations:**

```
content/blog/                    # 44 blog posts (MDX)
content/newsletter/issues/       # 4 newsletter issues (Markdown)
content/newsletter/welcome/      # 5 welcome sequence emails
content/newsletter/TEMPLATE.md   # Newsletter template
```

**Full inventory:** `docs/CONTENT_STATUS.md`
**Editorial calendar:** `docs/EDITORIAL_CALENDAR_2026.md`
**Hub strategy details:** `docs/HUB_AND_SPOKE_CONTENT_STRATEGY.md`

---

## Infrastructure

### Architecture Overview

```
Blog (Next.js on Cloudflare Pages)
  ↓ newsletter signup
Listmonk (localhost:9000) ← Resend SMTP
  ↓ new subscriber webhook
n8n (localhost:5678) → Welcome sequence (5 emails over 21 days)

Blog push to main
  ↓ manual trigger or webhook
n8n → Ollama/Groq LLM → generates 4 content variants
  ↓ Postiz API
Postiz (localhost:4007) → schedules to LinkedIn, X, Dev.to
  ↓ Temporal workflows
Posts fire at scheduled times
```

### Services

| Service          | Port  | Container                              | Purpose                           |
| ---------------- | ----- | -------------------------------------- | --------------------------------- |
| **Postiz**       | 4007  | `ghcr.io/gitroomhq/postiz-app:v2.13.0` | Social media scheduling           |
| **Postiz Redis** | 6379  | `redis:7.2-alpine`                     | Queue/cache for Postiz            |
| **Temporal**     | 7233  | `temporalio/auto-setup:1.28.1`         | Workflow engine (post scheduling) |
| **Temporal UI**  | 8081  | `temporalio/ui:2.34.0`                 | Workflow monitoring               |
| **Temporal ES**  | 9200  | `elasticsearch:7.17.27`                | Search for Temporal               |
| **n8n**          | 5678  | `n8nio/n8n:latest`                     | Workflow automation               |
| **Listmonk**     | 9000  | `listmonk/listmonk:v6.0.0`             | Newsletter platform               |
| **Ollama**       | 11434 | native                                 | Local LLM (Gemma 2 9B)            |

### Databases (Shared PostgreSQL on port 5433)

| Database      | User            | Password Source        | Purpose                          |
| ------------- | --------------- | ---------------------- | -------------------------------- |
| `postiz_app`  | `postiz_user`   | `postiz_secure_2026`   | Social scheduling data           |
| `listmonk`    | `deploy`        | `claude_deploy_2024`   | Newsletter subscribers/campaigns |
| `temporal_db` | `temporal_user` | `temporal_secure_2026` | Workflow state                   |

### Cloudflare Tunnel Routes

| Subdomain                 | Target                                   |
| ------------------------- | ---------------------------------------- |
| `postiz.alexmayhew.dev`   | `http://localhost:4007`                  |
| `listmonk.alexmayhew.dev` | `http://localhost:9000`                  |
| `alexmayhew.dev`          | Cloudflare Pages (GitHub Actions deploy) |

Tunnel ID: `05a8dd1a-a6fa-40f1-97af-24b515983762`
Config: `/etc/cloudflared/config.yml`

### Systemd Services

```bash
# n8n (user service)
systemctl --user status n8n
systemctl --user restart n8n

# n8n health check (timer, every 5 min)
systemctl --user status n8n-healthcheck.timer

# Listmonk (user service)
systemctl --user status listmonk
systemctl --user restart listmonk

# Postiz (root podman-compose)
sudo podman ps --filter name=postiz
cd /data/postiz && sudo podman-compose -f docker-compose.production.yaml up -d
cd /data/postiz && sudo podman-compose -f docker-compose.production.yaml down
```

### Credentials

All stored in `pass` password manager:

```bash
pass show claude/listmonk/admin-password  # Listmonk admin + API
pass show claude/resend/api-key           # Resend SMTP (newsletter delivery)
pass show claude/groq/api-key             # Groq API (Llama 3.3 70B, free tier)
pass show claude/cloudflare/api-token     # Cloudflare Workers AI
pass show claude/n8n/api-key              # n8n workflow API
```

### Key Configuration Files

| File                                                 | Purpose                                      |
| ---------------------------------------------------- | -------------------------------------------- |
| `/data/postiz/docker-compose.production.yaml`        | Postiz + Temporal stack                      |
| `/data/postiz/.env`                                  | Postiz secrets (JWT, OAuth, API keys)        |
| `/data/postiz/patches/linkedin.provider.js`          | LinkedIn personal profile fix                |
| `/data/listmonk/podman-compose.yml`                  | Listmonk container config                    |
| `/data/listmonk/config.toml`                         | Listmonk DB + app settings                   |
| `/data/listmonk/custom-static/`                      | Email templates (neo-brutalist)              |
| `/home/deploy/.config/systemd/user/n8n.service`      | n8n service definition                       |
| `/home/deploy/.config/systemd/user/listmonk.service` | Listmonk service definition                  |
| `/home/deploy/n8n-data/`                             | n8n persistent data (workflows, credentials) |
| `/etc/cloudflared/config.yml`                        | Tunnel routes                                |

---

## Social Media Operations

### Platform Strategy

| Platform      | Purpose                               | Cadence                        | Current Status            |
| ------------- | ------------------------------------- | ------------------------------ | ------------------------- |
| **LinkedIn**  | Primary lead gen, authority building  | 2-3 posts/week                 | Active, ~growing          |
| **X/Twitter** | Reach, engagement, community building | 1-2 posts/week + daily replies | New account (~1 follower) |
| **Dev.to**    | SEO + cross-posting full articles     | Bi-weekly (auto via Postiz)    | Active                    |
| **Bluesky**   | Secondary reach                       | Weekly cross-post              | Not yet active            |

### LinkedIn Strategy

**Post Format:**

- 1,000-1,300 characters (dwell time sweet spot)
- Short paragraphs, lots of white space
- Line breaks every 1-2 sentences
- NEVER put links in post body (kills reach) — add in first comment
- 3-4 hashtags at end or skip entirely (algorithm uses keyword detection now)
- End with a specific question (never generic "thoughts?")

**Post Structure:**

```
[Hook - contrarian or surprising statement]

[The math/evidence - specific numbers]

[What most people get wrong]

[What actually works - framework or insight]

[Personal experience tie-in]

[Closing question - specific, not "thoughts?"]
```

**Best Times:** Weekdays 8-10 AM EST, 5-7 PM EST. Tuesday-Thursday perform best.

**Algorithm (2026):** Dwell time is critical. "Golden hour" (first 60-90 min) determines reach. Comments weighted highest. Engagement bait phrases get flagged.

**Engagement Priority:**

- Always respond to: Substantive counterpoints, people adding experience, direct questions, other CTOs/founders
- Brief acknowledgment: Simple agreement, one-line validations
- Skip: Generic pitches, tangential debates, hostile bad-faith comments, listicles

**Reply Tone:**

- Agreement: Brief validation + one insight. Don't over-explain.
- Valid pushback: "Fair point. [Concede specific thing]. The core argument is [restate thesis differently]."
- Misread: "Good question. [Clarify without being defensive]. The post is about [X], not [Y]."
- War stories: Acknowledge their story, connect to your pattern.

**Full LinkedIn strategy:** `docs/SOCIAL_MEDIA_PLAYBOOK.md`
**Reply examples:** `docs/LINKEDIN_REPLY_EXAMPLES.md`

### X/Twitter Strategy

**The Reality for New Accounts (0-500 followers):**

| Activity                   | Time Split |
| -------------------------- | ---------- |
| Engaging (replies, quotes) | 70-80%     |
| Posting original content   | 20-30%     |

Posting into the void doesn't work. The algorithm won't show content without engagement history.

**Growth Phases:**

**Phase 1 (0-100 followers):**

1. Find 5-10 relevant posts from target accounts daily
2. Write thoughtful replies that add value (not "great post!")
3. Follow 10-15 relevant accounts
4. Post 1 original tweet (optional)

**Phase 2 (100-500 followers):**

1. Join X Communities: Build in Public (~180K members), Indie Hackers, Tech Startups
2. Post original content inside Communities first (guaranteed visibility)
3. Community engagement builds algorithm credibility
4. 1-2 posts per day + active replies

**High-Value Accounts to Engage:**

- @GergelyOrosz (Pragmatic Engineer)
- @mjovanovictech (Milan Jovanovic, modular monolith)
- @simonhoiberg (Simon Hoiberg, bootstrapped SaaS)
- CTOs/founders sharing architecture decisions
- People posting about "boring technology", monolith vs microservices

**Post Formats:**

- Single tweet: Bold contrarian statement + 1-2 sentence evidence + what to do instead
- Thread (8-12 tweets): Standalone hook (no "Thread:" prefix) + one insight per tweet + summary + CTA
- Quote tweet: Add your take to someone else's post

**Best Times:** Weekdays 8-10 AM EST, 12-2 PM EST. Weekends 9-11 AM EST.

**Post Lifespan:** ~18 minutes peak visibility. Timing matters more than LinkedIn.

**Full X strategy:** `docs/X_TWITTER_ENGAGEMENT_GUIDE.md`

### Content Themes That Perform

1. **Anti-complexity takes** — "Your startup doesn't need Kubernetes", "Microservices kill more startups than they save"
2. **Cost/math breakdowns** — "The $200/hr senior costs less than the $30/hr junior", "Here's the math nobody runs"
3. **Architecture decision frameworks** — "When to break up a monolith (spoiler: later than you think)"
4. **Production war stories (anonymized)** — "I watched a startup burn $400K on infrastructure before PMF"
5. **Fractional/advisory positioning** — "Your startup doesn't need a CTO. Here's what it needs instead."

### Red Lines

**Never do:**

- Engage with trolls or bad-faith comments
- Post same content to LinkedIn and X verbatim (platform-native formats differ)
- Comment on competitor's posts promoting similar services
- Use engagement bait ("Like if you agree!", "What do you think?")
- Post external links in LinkedIn post body

**Always do:**

- Respond to substantive pushback (shows confidence)
- Credit others when referencing their ideas
- Tie technical points to business outcomes
- Use specific numbers over vague claims
- Let good threads end naturally (don't over-engage)

---

## Newsletter Operations

### "The Architect's Brief"

| Setting  | Value                                          |
| -------- | ---------------------------------------------- |
| Platform | Listmonk v6.0.0 (self-hosted)                  |
| URL      | https://listmonk.alexmayhew.dev                |
| Schedule | Every Tuesday, 9:00 AM EST                     |
| Sender   | Alex Mayhew (alex@alexmayhew.dev)              |
| SMTP     | Resend (smtp.resend.com:465, TLS/SSL)          |
| Format   | Markdown, 500-700 words                        |
| List ID  | 3 (UUID: 41e24d1e-f13b-45b5-8a73-483ffe85def2) |
| Opt-in   | Double                                         |

### Newsletter Format

Each issue follows this structure (~600-800 words):

1. **Personal hook** (2-3 sentences)
2. **This Week's Decision** (200-300 words with code example) — the core value
3. **Worth Your Time** (3 curated links with 50-word commentary each)
4. **Tool of the Week** (50-100 words)
5. **CTA + P.S.** (soft, trust-based)

### Welcome Sequence (5 emails, automated via n8n)

| Email                  | Timing    | Purpose                               |
| ---------------------- | --------- | ------------------------------------- |
| 01-welcome.md          | Immediate | Welcome + top 3 blog posts            |
| 02-first-insight.md    | Day 3     | Expertise demonstration               |
| 03-how-i-help.md       | Day 7     | Advisory services intro + lead magnet |
| 04-engagement-check.md | Day 14    | Content preference survey             |
| 05-case-study.md       | Day 21    | Case study demonstrating value        |

### Drafted Issues

| #   | Send Date  | Title                                | Pillar        | Status |
| --- | ---------- | ------------------------------------ | ------------- | ------ |
| 1   | 2026-02-04 | Why Your SaaS Needs a Monolith First | architecture  | Draft  |
| 2   | 2026-02-11 | The Hidden Cost of Microservices     | architecture  | Draft  |
| 3   | 2026-02-18 | PostgreSQL RLS for Multi-Tenancy     | saas-patterns | Draft  |
| 4   | 2026-02-25 | When NOT to Use Next.js              | contrarian    | Draft  |

### Newsletter Signup Integration

Three signup variants exist in the Next.js app:

1. Homepage card (`src/components/newsletter/newsletter-signup.tsx`)
2. Blog inline (within blog post layout)
3. Footer minimal (site footer)

All call the same server action: `src/app/actions/newsletter.ts`
API: POST to Listmonk `/api/subscribers` with Basic auth

**Full newsletter strategy:** `docs/NEWSLETTER_STRATEGY.md`
**Listmonk setup:** `docs/LISTMONK_SETUP.md`

---

## Content Repurposing Pipeline

### The 1-to-10 Framework

One blog post becomes 10+ content pieces:

```
1 Blog Post (Monday)
  ├─ Newsletter section (Tuesday, 9 AM)
  ├─ Twitter/X thread (Tuesday, 10 AM)
  ├─ LinkedIn carousel (Wednesday, 10 AM)
  ├─ Dev.to cross-post (Monday, 9 AM — bi-weekly)
  ├─ Twitter hot take (Thursday, 10 AM)
  ├─ Bluesky cross-post (Thursday, 11 AM)
  ├─ LinkedIn text post (Friday, 10 AM)
  └─ Community answers (async, reactive)
```

### Automation Flow

```
Blog push to main → manual n8n trigger
  → n8n reads post content
    → 4 parallel LLM generations:
        ├─ LinkedIn carousel (Ollama/Groq)
        ├─ Twitter thread (Ollama/Groq)
        ├─ Dev.to article (Ollama/Groq)
        └─ Newsletter section (Ollama/Groq)
    → Postiz API schedules to correct day/time
    → Response logged
```

**Manual trigger:**

```bash
curl -X POST http://localhost:5678/webhook/content-repurpose \
  -H "Content-Type: application/json" \
  -d '{"title": "Post Title", "slug": "post-slug", "content": "Full markdown..."}'
```

### LLM Stack

| Model                 | Use                                     | Location                       |
| --------------------- | --------------------------------------- | ------------------------------ |
| Gemma 2 9B            | Content repurposing (LinkedIn, threads) | Local (Ollama, RTX 3080)       |
| Llama 3.3 70B         | Hot takes, community answers            | Groq API (14,400 req/day free) |
| Cloudflare Workers AI | Fallback                                | Free tier (10K neurons/day)    |

### Postiz Integration IDs

| Platform  | Integration ID              |
| --------- | --------------------------- |
| LinkedIn  | `cmky9rja60001oc82ci8qle6v` |
| X/Twitter | `cmkxmmwlk0001mj96243heh2y` |
| Dev.to    | `cmky5o54e0001p397fhvbi0pp` |

### n8n Workflow Files (version controlled)

```
docs/n8n-workflows/content-repurposing-workflow.json
docs/n8n-workflows/welcome-sequence-workflow.json
```

**Full repurposing system:** `docs/CONTENT_REPURPOSING_SYSTEM.md`
**LLM prompts:** `docs/LLM_REPURPOSING_PROMPTS.md`
**n8n setup:** `docs/N8N_SETUP_GUIDE.md`
**LLM stack:** `docs/SELF_HOSTED_LLM_GUIDE.md`

---

## Posting Schedule & Cadence

### Week A / Week B Rhythm

**Week A (Blog Week):**

- Monday: New blog post publishes, n8n generates variants
- Tuesday: Newsletter features blog insight + Twitter thread
- Wednesday: LinkedIn carousel
- Thursday: Twitter hot take + Bluesky
- Friday: LinkedIn text post

**Week B (Newsletter-Only Week):**

- Tuesday: Standalone newsletter insight
- Wednesday: LinkedIn post (repurposed from existing content)
- Thursday: Twitter post (repurposed)
- Friday: LinkedIn text post

**Monthly Output:** 2 blog posts + 4 newsletters + ~12 social posts = ~18 pieces from 2 core articles.

### Postiz Auto-Schedule (Current)

Posts are queued in Postiz with specific dates:

| Cycle  | Dev.to (Monday)   | X/Twitter (Tuesday) | LinkedIn (Wednesday) |
| ------ | ----------------- | ------------------- | -------------------- |
| Week 1 | Feb 3 (PUBLISHED) | Feb 4 (ERROR)       | Feb 5 (PUBLISHED)    |
| Week 2 | Feb 10            | Feb 11              | Feb 12               |
| Week 3 | Feb 17            | Feb 18              | Feb 19               |
| Week 4 | Feb 24            | Feb 25              | Feb 26               |

### Known Issues

**Feb 4 X post failed:** `ApplicationFailure: Unknown Error` at `XProvider.post`. Content (~800 chars) is within Premium's 4,000 char limit. Likely API integration issue. Needs investigation before Feb 11 X post.

**Postiz health check:** Shows "unhealthy" because container lacks `curl`/`wget`. Cosmetic — app is functional on port 4007.

---

## Quality Gates

### Blog Posts

Must pass `content/blog/QUALITY_CHECKLIST.md` before pushing to main:

- Voice check against 6 pillars
- Specific numbers and evidence
- Hub/spoke metadata correct
- Internal links present
- Featured image (WebP, 1920x1072, neo-brutalist)
- SEO meta tags

### Newsletter Issues

Must pass `content/newsletter/QUALITY_CHECKLIST.md` before scheduling:

- Voice consistency
- Links verified
- CTA present
- Subject line follows formula
- Preview text optimized

### Social Posts

Auto-generated posts: Spot-check Postiz queue every Monday.
Manual posts: Voice check against `docs/SOCIAL_MEDIA_PLAYBOOK.md`.
Replies: Follow tone calibration in `docs/LINKEDIN_REPLY_EXAMPLES.md`.

---

## Troubleshooting

### n8n Not Responding

```bash
systemctl --user status n8n
systemctl --user restart n8n
# Check logs
podman logs n8n 2>&1 | tail -50
```

Common issue: Permission errors on `/home/deploy/n8n-data/`. Fix:

```bash
podman unshare chown -R 1000:1000 /home/deploy/n8n-data/
```

### Postiz Not Scheduling

```bash
sudo podman ps --filter name=postiz
sudo podman logs 8d12438d4338 2>&1 | tail -50
# Check if posts are stuck
PGPASSWORD=postiz_secure_2026 psql -p 5433 -U postiz_user -d postiz_app \
  -c "SELECT state, count(*) FROM \"Post\" GROUP BY state;"
```

Common issues:

- RUN_CRON not set to `true` in `.env`
- Temporal worker not running (check `sudo podman logs temporal`)
- LinkedIn/X tokens expired (re-auth in Postiz UI at localhost:4007)

### Listmonk Not Sending

```bash
systemctl --user status listmonk
# Check logs
cd /data/listmonk && podman-compose logs --tail 50
```

Common issues:

- Resend SMTP credentials expired (check `pass show claude/resend/api-key`)
- Database connection lost (PostgreSQL on 5433)

### Safely Checking Posts Without Firing

If Postiz has been down and you need to check for past-due posts:

1. **Stop Postiz first:** `sudo podman stop postiz`
2. **Query DB directly:**
   ```bash
   PGPASSWORD=postiz_secure_2026 psql -p 5433 -U postiz_user -d postiz_app \
     -c "SELECT state, \"publishDate\", LEFT(content, 60) FROM \"Post\" WHERE state='QUEUE' AND \"publishDate\" < NOW() ORDER BY \"publishDate\";"
   ```
3. **If past-due posts exist:** Change state to DRAFT before restarting
4. **Restart Postiz:** `cd /data/postiz && sudo podman-compose -f docker-compose.production.yaml up -d`

---

## Document Map

### Brand & Voice

| Document                   | Path                                 | Purpose                                                    |
| -------------------------- | ------------------------------------ | ---------------------------------------------------------- |
| Voice Guide                | `docs/VOICE_GUIDE.md`                | Definitive brand voice spec (6 pillars, formatting, terms) |
| Social Media Playbook      | `docs/SOCIAL_MEDIA_PLAYBOOK.md`      | Platform strategies, engagement rules, post templates      |
| LinkedIn Reply Examples    | `docs/LINKEDIN_REPLY_EXAMPLES.md`    | Real reply examples for tone consistency                   |
| X/Twitter Engagement Guide | `docs/X_TWITTER_ENGAGEMENT_GUIDE.md` | Growth strategy, reply templates, accounts to follow       |
| Copy Audit Report          | `docs/COPY_AUDIT_REPORT.md`          | Website copy analysis and improvements                     |

### Content Strategy

| Document                   | Path                                     | Purpose                                            |
| -------------------------- | ---------------------------------------- | -------------------------------------------------- |
| Content Status             | `docs/CONTENT_STATUS.md`                 | Current hub-and-spoke inventory, linking structure |
| Editorial Calendar 2026    | `docs/EDITORIAL_CALENDAR_2026.md`        | Full year plan (24 blogs, 51 newsletters)          |
| Content Operations         | `docs/CONTENT_OPERATIONS.md`             | Week A/B workflow, who does what, automation       |
| Hub-and-Spoke Strategy     | `docs/HUB_AND_SPOKE_CONTENT_STRATEGY.md` | Content architecture design                        |
| Content Repurposing System | `docs/CONTENT_REPURPOSING_SYSTEM.md`     | 1-to-10 framework, templates per platform          |
| Content Cluster Plan       | `docs/CONTENT_CLUSTER_PLAN.md`           | Cluster organization                               |
| Content Ideas              | `docs/CONTENT_IDEAS.md`                  | Idea backlog                                       |

### Newsletter

| Document            | Path                                      | Purpose                                |
| ------------------- | ----------------------------------------- | -------------------------------------- |
| Newsletter Strategy | `docs/NEWSLETTER_STRATEGY.md`             | Growth phases, format, CTA ladder      |
| Listmonk Setup      | `docs/LISTMONK_SETUP.md`                  | Self-hosted newsletter platform config |
| Newsletter Calendar | `docs/NEWSLETTER_CONTENT_CALENDAR.md`     | Issue schedule                         |
| Newsletter Template | `content/newsletter/TEMPLATE.md`          | Issue template                         |
| Newsletter Quality  | `content/newsletter/QUALITY_CHECKLIST.md` | Pre-send checklist                     |

### Automation & Infrastructure

| Document                | Path                              | Purpose                             |
| ----------------------- | --------------------------------- | ----------------------------------- |
| n8n Setup Guide         | `docs/N8N_SETUP_GUIDE.md`         | Webhook, Ollama, Postiz integration |
| LLM Repurposing Prompts | `docs/LLM_REPURPOSING_PROMPTS.md` | Brand-consistent LLM prompts        |
| Self-Hosted LLM Guide   | `docs/SELF_HOSTED_LLM_GUIDE.md`   | Ollama, Groq, Cloudflare AI         |
| Implementation Roadmap  | `docs/IMPLEMENTATION_ROADMAP.md`  | Build-out plan                      |
| n8n Workflows           | `docs/n8n-workflows/`             | Exportable workflow JSON            |

### Marketing

| Document                    | Path                                  | Purpose                        |
| --------------------------- | ------------------------------------- | ------------------------------ |
| Marketing Plan 2026         | `MARKETING_PLAN_2026.md`              | Annual marketing strategy      |
| Social Media Strategy 2026  | `docs/SOCIAL_MEDIA_STRATEGY_2026.md`  | Detailed social strategy       |
| Social Media Marketing Plan | `docs/SOCIAL_MEDIA_MARKETING_PLAN.md` | Marketing-specific social plan |
| LinkedIn Overhaul Guide     | `docs/LINKEDIN_OVERHAUL_GUIDE.md`     | LinkedIn profile optimization  |
| Portfolio Products Strategy | `docs/PORTFOLIO_PRODUCTS_STRATEGY.md` | Product strategy               |

---

## Quick Reference for Future Sessions

### Starting a Content Session

1. Read this document first for full context
2. Check service health:
   ```bash
   systemctl --user status n8n
   sudo podman ps --filter name=postiz
   systemctl --user status listmonk
   ```
3. Check what's scheduled:
   ```bash
   PGPASSWORD=postiz_secure_2026 psql -p 5433 -U postiz_user -d postiz_app \
     -c "SELECT state, to_char(\"publishDate\", 'YYYY-MM-DD HH24:MI') as dt, LEFT(content, 60), i.\"providerIdentifier\" FROM \"Post\" p LEFT JOIN \"Integration\" i ON p.\"integrationId\"=i.id WHERE \"publishDate\" >= NOW() ORDER BY \"publishDate\" LIMIT 10;"
   ```
4. Check editorial calendar: `docs/EDITORIAL_CALENDAR_2026.md`
5. For voice consistency: `docs/VOICE_GUIDE.md` + `docs/SOCIAL_MEDIA_PLAYBOOK.md`

### Writing Social Media Content

1. Check brand voice (6 pillars above)
2. Use platform-specific format from Social Media Playbook
3. For LinkedIn replies, reference `docs/LINKEDIN_REPLY_EXAMPLES.md` for tone
4. For X/Twitter, reference `docs/X_TWITTER_ENGAGEMENT_GUIDE.md`
5. Never: emojis, hedging, exclamation points, links in LinkedIn body

### Deploying Content Changes

```bash
# Blog posts deploy via git push
git add content/blog/new-post.mdx
git commit -m "content: add new spoke post"
git push origin main
# GitHub Actions handles build + deploy

# Then trigger repurposing:
curl -X POST http://localhost:5678/webhook/content-repurpose \
  -H "Content-Type: application/json" \
  -d '{"title": "...", "slug": "...", "content": "..."}'
```

### The Essence

Alex Mayhew is the person founders wish they'd talked to before making their most expensive technical decisions. The content doesn't sell — it demonstrates. Every post, newsletter, and reply builds the case that this person understands the patterns that separate startups that scale from startups that stall. The voice is earned authority: specific, direct, contrarian when the evidence supports it, and always tied to business outcomes. No fluff, no filler, no hedging.
