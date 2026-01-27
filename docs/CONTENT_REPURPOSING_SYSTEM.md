# Content Repurposing System

> **Created:** 2026-01-27
> **Purpose:** Transform 1 blog post into 10+ content pieces across platforms
> **Time investment:** ~2 hours per blog post to create full content suite

---

## The 1-to-10 Framework

```
┌─────────────────────────────────────────────────────────────────────┐
│                         1 BLOG POST                                  │
│                              │                                       │
│    ┌─────────────────────────┼─────────────────────────┐            │
│    │                         │                         │            │
│    ▼                         ▼                         ▼            │
│ LINKEDIN              TWITTER/X                  NEWSLETTER         │
│ • Carousel            • Thread (8-12)            • Featured         │
│ • Text post           • Hot take tweet             insight          │
│ • PDF (optional)      • Quote graphic                               │
│                                                                      │
│    │                         │                         │            │
│    ▼                         ▼                         ▼            │
│ BLUESKY               HACKER NEWS              COMMUNITIES          │
│ • Cross-post          • Submit (if              • Reactive          │
│   thread                technical)                answers           │
│                       • Comment                                      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Platform-Specific Templates

### 1. LinkedIn Carousel (8-15 slides)

**Time:** 30-45 minutes

**Structure:**

```
Slide 1: HOOK
         [Bold statement or question from your post]

Slide 2: THE PROBLEM
         [Pain point your post addresses]

Slides 3-10: KEY INSIGHTS
         [One point per slide, max 30 words each]
         [Use code snippets if relevant]

Slide 11: THE TAKEAWAY
         [Summary of what to do]

Slide 12: CTA
         "Follow for more [topic] insights"
         "Full breakdown: [link in comments]"
```

**Design Rules:**

- Dark background (#0b0e14 or #1e293b)
- Accent color for highlights (#ccf381)
- Font: Clean sans-serif, large (24pt+)
- One idea per slide
- Code blocks: Use Carbon (carbon.now.sh)

**Tools:**

- Canva (free tier)
- Figma (free tier)
- Carbon.now.sh (code snippets)

---

### 2. LinkedIn Text Post (150-300 words)

**Time:** 10-15 minutes

**Structure:**

```
[HOOK LINE - surprising fact or contrarian take]

[BLANK LINE]

Here's what most people get wrong about [topic]:

[BLANK LINE]

→ Point 1
→ Point 2
→ Point 3

[BLANK LINE]

The reality?

[2-3 sentences summarizing your main insight]

[BLANK LINE]

[SOFT CTA - question to drive comments]

---

♻️ Repost if this helped someone
🔔 Follow Alex Mayhew for more [topic] insights
```

**Formatting Rules:**

- Line breaks after every 1-2 sentences
- Use → or • for lists
- Keep paragraphs to 2 lines max
- Hook must work without clicking "see more"
- End with engagement question

---

### 3. Twitter/X Thread (8-12 tweets)

**Time:** 20-30 minutes

**Structure:**

```
Tweet 1 (HOOK):
[Controversial take or surprising insight]

This thread will change how you think about [topic]:

Tweet 2-9 (VALUE):
[One point per tweet]
[Max 240 chars to leave room for engagement]
[Number each: "1/", "2/", etc.]

Tweet 10 (SUMMARY):
TL;DR:
• Point 1
• Point 2
• Point 3

Tweet 11 (CTA):
If you found this valuable:
1. Follow @alexmayhewdev for more
2. Retweet the first tweet
3. Reply with your biggest takeaway

Tweet 12 (LINK):
Full deep-dive with code examples:
[Blog post link]
```

**Thread Rules:**

- First tweet must hook WITHOUT the thread
- Each tweet should stand alone
- Include 1-2 tweets with code snippets (images)
- Self-retweet key tweets for visibility

---

### 4. Twitter/X Hot Take (Single Tweet)

**Time:** 2-5 minutes

**Formats that work:**

```
Format A - Contrarian:
"Stop [popular thing].

[Why in 1-2 sentences]

[What to do instead]"

Format B - Observation:
"I've [done X] [N times].

Here's what separates the good from the great:

[Key insight]"

Format C - Prediction:
"[Technology/trend] will [prediction].

Here's why:

[1-2 reasons]"
```

---

### 5. Newsletter Section

**Time:** 15-20 minutes

**Structure (for "This Week's Decision" section):**

```
## This Week's Decision

[2-3 sentence intro connecting to the blog post topic]

### The Situation
[50-75 words on the problem/context]

### The Insight
[100-150 words - your main takeaway, can include code]

### When to Apply This
• Scenario 1
• Scenario 2
• Scenario 3

**Read the full breakdown:** [Blog post title](link)
```

---

### 6. Hacker News Submission

**Time:** 5-10 minutes (submission) + ongoing (comments)

**Title Formula:**

```
[Descriptive, no clickbait, no ALL CAPS]

Good: "PostgreSQL RLS patterns for multi-tenant SaaS"
Bad: "You Won't BELIEVE These Database Tricks!"
```

**Submission Checklist:**

- [ ] Title is descriptive, not salesy
- [ ] Content is genuinely technical
- [ ] You can defend your points in comments
- [ ] Submit 6-9 AM Pacific (peak hours)
- [ ] Engage authentically in comments

**Comment Strategy:**

- Answer questions thoroughly
- Acknowledge valid criticism
- Share additional context
- Never be defensive

---

### 7. Bluesky Cross-Post

**Time:** 5 minutes

**Strategy:**

- Mirror Twitter threads (character limit is similar)
- Slightly adjust for Bluesky's audience (more tech-forward)
- Use feeds/starter packs for discovery
- Engage with tech community forming there

---

### 8. Community Answers (Reactive)

**Time:** 0 minutes (save for later use)

**Systems:**

- Save blog post link with tags
- Monitor Slack/Discord for relevant questions
- Drop link when genuinely helpful
- Add 1-2 sentences of context, not just link

**Tag Format for Storage:**

```yaml
title: "PostgreSQL RLS for Multi-Tenant SaaS"
url: "https://alexmayhew.dev/blog/postgresql-rls"
tags: [postgresql, rls, multi-tenancy, saas, security]
use_when:
  [
    "someone asks about tenant isolation",
    "database security questions",
    "multi-tenant architecture",
  ]
```

---

## Weekly Content Calendar

| Day           | Platform    | Content Type                           | Time  |
| ------------- | ----------- | -------------------------------------- | ----- |
| **Monday**    | Blog        | Publish new post                       | -     |
| **Tuesday**   | Newsletter  | Feature post in "This Week's Decision" | 9 AM  |
| **Tuesday**   | Twitter/X   | Thread                                 | 10 AM |
| **Wednesday** | LinkedIn    | Carousel                               | 10 AM |
| **Thursday**  | Twitter/X   | Hot take from post                     | 10 AM |
| **Thursday**  | Bluesky     | Cross-post thread                      | 11 AM |
| **Friday**    | LinkedIn    | Text post (week reflection)            | 10 AM |
| **Weekend**   | Communities | Catch up, drop links when relevant     | Async |

---

## Repurposing Checklist (Per Blog Post)

### Day 1 (Monday) - Publish

- [ ] Blog post live
- [ ] Preview image created
- [ ] Social sharing meta tags working

### Day 2 (Tuesday) - Newsletter + Twitter Thread

- [ ] Newsletter section written
- [ ] Newsletter scheduled/sent
- [ ] Twitter thread drafted
- [ ] Twitter thread scheduled (10 AM)
- [ ] Code snippet images created (Carbon)

### Day 3 (Wednesday) - LinkedIn Carousel

- [ ] Carousel slides designed
- [ ] Carousel posted (10 AM)
- [ ] Responded to early comments

### Day 4 (Thursday) - Hot Takes + Bluesky

- [ ] Twitter hot take posted
- [ ] Bluesky thread cross-posted
- [ ] Engaged with thread responses

### Day 5 (Friday) - LinkedIn Text

- [ ] LinkedIn text post drafted
- [ ] Posted (10 AM)
- [ ] Engaged with comments on all platforms

### Ongoing

- [ ] Added to community answer database
- [ ] HN submission (if technical enough)
- [ ] Monitored communities for relevant questions

---

## Content Storage Template (Obsidian/Notion)

````markdown
# [Blog Post Title]

## Metadata

- **Published:** YYYY-MM-DD
- **URL:** https://alexmayhew.dev/blog/slug
- **Primary Topic:** [topic]
- **Tags:** [[tag1]], [[tag2]], [[tag3]]

## Key Takeaways (for repurposing)

1. [Main insight]
2. [Supporting point]
3. [Supporting point]
4. [Contrarian angle]

## Hot Takes

- "[Contrarian statement that stands alone]"
- "[Surprising fact]"

## Code Snippets

```language
// Key code example
```
````

## Repurposing Status

- [x] Blog post
- [ ] Newsletter
- [ ] Twitter thread
- [ ] Twitter hot take
- [ ] LinkedIn carousel
- [ ] LinkedIn text post
- [ ] Bluesky
- [ ] HN submission
- [ ] Added to community database

## Platform Links

- Twitter thread: [url]
- LinkedIn carousel: [url]
- LinkedIn text: [url]
- HN: [url]

## Performance Notes

- Best performing: [platform]
- Engagement: [notes]
- What worked: [notes]

```

---

## Tools Stack (Free)

### Content Planning
| Tool | Purpose | Cost |
|------|---------|------|
| **Obsidian** | Content hub, visualization, storage | Free |
| **Obsidian Canvas** | Hub-and-spoke visualization | Free |
| **Obsidian Graph View** | Content relationship mapping | Free |

### Scheduling
| Tool | Purpose | Cost |
|------|---------|------|
| **Postiz** (self-hosted) | All platform scheduling | Free + $5/mo VPS |
| **Typefully** (free tier) | Twitter/X scheduling (15/month) | Free |

### Design
| Tool | Purpose | Cost |
|------|---------|------|
| **Canva** (free tier) | LinkedIn carousels | Free |
| **Carbon** | Code snippet images | Free |
| **Excalidraw** | Technical diagrams | Free |

### Automation
| Tool | Purpose | Cost |
|------|---------|------|
| **N8N** (self-hosted) | Cross-posting automation | Free |
| **GitHub Actions** | Blog → notification workflows | Free |

---

## Recommended Setup

### Option A: Minimal (Free, No Self-Hosting)

```

Obsidian (local) → Plan content, track status
↓
Typefully (free) → Twitter/X scheduling (15/month)
↓
Manual posting → LinkedIn, Bluesky, Newsletter

```

**Cost:** $0
**Limitation:** Manual cross-posting, 15 Twitter posts/month

---

### Option B: Automated (Free + $5/mo VPS)

```

Obsidian (local) → Plan content, visualize hubs
↓
Git repo → Version control all content
↓
Postiz (Docker) → Schedule to ALL platforms
↓
N8N → Auto-notify on blog publish, cross-post

```

**Cost:** ~$5/month (Hetzner/DigitalOcean VPS)
**Benefit:** Full automation, all platforms, unlimited scheduling

---

### Option C: Maximum Control (Developer Stack)

```

Obsidian vault → Content planning
↓
Git repo → Source of truth (markdown)
↓
TinaCMS → Visual editing when needed
↓
Postiz API → Programmatic scheduling
↓
N8N workflows → Complex automation
↓
Custom scripts → Analytics, reporting

```

**Cost:** ~$5-10/month
**Benefit:** Everything is code, fully scriptable

---

## Content Hub Visualization (Obsidian Canvas Example)

```

                    ┌─────────────────────┐
                    │   PILLAR: SaaS      │
                    │   Architecture      │
                    └──────────┬──────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼

┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ Multi-Tenancy │ │ Database │ │ Auth Patterns │
│ (Hub) │ │ Selection │ │ (Hub) │
└───────┬───────┘ │ (Hub) │ └───────┬───────┘
│ └───────┬───────┘ │
│ │ │
┌────┴────┐ ┌────┴────┐ ┌────┴────┐
│ RLS │ │ Postgres│ │ JWT vs │
│ Guide │ │ vs MySQL│ │ Session │
└─────────┘ └─────────┘ └─────────┘
(Spoke) (Spoke) (Spoke)

```

Use Obsidian Canvas to create these visual maps:
- Drag notes onto canvas
- Connect with arrows
- Color-code by content type
- Add status tags (draft, published, repurposed)

---

## Performance Tracking

### Weekly Metrics
| Platform | Metric | Target |
|----------|--------|--------|
| LinkedIn | Post impressions | 5K+ |
| LinkedIn | Engagement rate | 3%+ |
| Twitter | Thread impressions | 10K+ |
| Twitter | Thread engagement | 2%+ |
| Newsletter | Open rate | 25%+ |
| Blog | Sessions from social | Track |

### Monthly Review
- [ ] Best performing content piece
- [ ] Best performing platform
- [ ] Content gaps identified
- [ ] Hub pages that need more spokes
- [ ] Topics that resonate vs. don't

---

## Quick Start Checklist

### Week 1: Setup
- [ ] Install Obsidian
- [ ] Create content vault structure
- [ ] Set up Canvas for hub visualization
- [ ] Create Typefully account (or deploy Postiz)
- [ ] Create Carbon account for code images
- [ ] Create Canva account for carousels

### Week 2: First Full Cycle
- [ ] Take existing blog post
- [ ] Run through full repurposing checklist
- [ ] Post to all platforms
- [ ] Track time spent
- [ ] Note what worked/didn't

### Week 3+: Iterate
- [ ] Establish weekly rhythm
- [ ] Build content backlog
- [ ] Refine templates based on performance
- [ ] Automate what you can

---

*Review and update this system monthly based on platform changes and performance data.*
```
