# alexmayhew.dev - 2026 Marketing Launch Plan

> **Created:** January 23, 2026
> **Status:** READY FOR EXECUTION
> **Epic Bead:** amdev-183
> **Goal:** Establish Alex Mayhew as a technical advisor, generate organic high-quality leads

---

## Executive Summary

This plan transforms alexmayhew.dev from a portfolio site into a lead-generation engine. Based on January 2026 market research, it implements five strategic phases targeting the shift from "freelancer" to "technical advisor" positioning—a critical distinction that commands 40%+ higher fees and attracts enterprise clients.

**Key Metrics:**

- Target: First client inquiry within 30 days
- Pipeline: 3-5 qualified leads per month by 90 days
- Community: Active presence in 5+ tech communities
- Content: 4 LinkedIn posts/week, 1 blog post/month

---

## Market Context (January 2026)

### The 2026 Developer Landscape

1. **AI Transformation**: 53% of tech job postings require AI/ML skills (up from 29% in 2024)
2. **Talent Density Priority**: Companies want "A-players" who orchestrate AI tools, not code monkeys
3. **Trust-Based Funnels**: Modern buyers: Discover → Trust → Use → Share → Return
4. **Community-First Marketing**: Private communities generate 5x more qualified leads than content alone

### Positioning Shift: Freelancer → Technical Advisor

| Freelancer                | Technical Advisor                        |
| ------------------------- | ---------------------------------------- |
| Sells time                | Sells outcomes                           |
| Executes tasks            | Provides strategic guidance              |
| Project-based             | Relationship-based                       |
| Competes on price         | Competes on expertise                    |
| "What do you need built?" | "What business problem are you solving?" |

---

## Phase 1: Positioning & Messaging Overhaul

**Bead:** amdev-nfc | **Priority:** P1

### Objective

Transform all site copy from freelancer language to technical advisor positioning.

### Tasks

#### 1.1 Audit Current Site Copy (amdev-drq)

- [ ] Review homepage for freelancer language
- [ ] Check about page positioning
- [ ] Audit project descriptions
- [ ] Review contact page messaging
- [ ] Document all phrases needing change

**Red Flags to Find:**

- "Hire me" → "Partner with me"
- "I build websites" → "I architect scalable solutions"
- "Freelance developer" → "Technical advisor"
- "Available for work" → "Accepting select engagements"
- Hourly rate mentions → Value-based outcomes

#### 1.2 Rewrite Homepage Hero (amdev-jj0)

**Current Pattern (Freelancer):**

```
Full-Stack Developer for Hire
I build web applications with React, Node, and Python.
[Hire Me]
```

**New Pattern (Technical Advisor):**

```
Technical Advisor for Ambitious Startups
I architect production systems that scale from MVP to millions of users.
When your tech decisions have business consequences, you need strategic guidance—not just code.
[Discuss Your Project]
```

**Key Elements:**

- Lead with client benefit, not skills
- Emphasize strategic partnership
- Qualify the audience ("ambitious startups")
- CTA suggests conversation, not transaction

#### 1.3 Create Services Framework (amdev-1zw)

**Tier 1: Advisory Retainer**

- Monthly strategic guidance
- Architecture reviews
- Tech stack decisions
- Team scaling advice
- Target: Post-seed startups

**Tier 2: Strategic Implementation**

- Full-stack development with strategic oversight
- MVP to production systems
- Technical debt reduction
- Performance optimization
- Target: Funded startups without senior eng

**Tier 3: Technical Due Diligence**

- Code audits for M&A
- Investor technical assessments
- Architecture reviews
- Security evaluations
- Target: VCs, PE firms, acquirers

#### 1.4 Rewrite About Page (amdev-z07)

**Structure:**

1. **Opening Hook**: Problem I solve, not my history
2. **Philosophy**: How I approach technical challenges
3. **Proof Points**: Outcomes achieved (with metrics)
4. **Differentiators**: What makes my approach unique
5. **Human Element**: Brief personal touch
6. **CTA**: Next step invitation

**Example Opening:**

> "Every week, founders make technical decisions that will either compound into competitive advantage or accumulate as crushing debt. I help them choose wisely."

#### 1.5 Update Case Studies (amdev-8qk)

**Case Study Formula:**

1. **The Hook** (1 sentence): Quantified outcome
2. **The Context** (2-3 sentences): Client situation, stakes
3. **The Challenge** (2-3 sentences): Technical/business problem
4. **The Intervention** (3-4 sentences): Strategic approach, not just tech
5. **The Result** (2-3 sentences): Metrics, testimonial

**Example Transformation:**

Before:

> "PhotoKeep Pro - AI photo restoration platform built with Python, FastAPI, PyTorch."

After:

> "**Reducing restoration processing costs by 73% while improving quality by 4dB**
>
> A photo restoration startup was burning $12k/month on cloud GPU costs while producing mediocre results. By architecting a custom model orchestration layer with intelligent memory management, we achieved 99.95% uptime, 28.5dB PSNR quality (beating Magnific AI), and reduced infrastructure costs to $3.2k/month."

---

## Phase 2: Programmatic SEO Implementation

**Bead:** amdev-9z1 | **Priority:** P1 | **Depends On:** Phase 1

### Objective

Generate organic traffic through high-intent long-tail keywords without duplicate content penalties.

### The Quality-First Framework

Google's guidance is clear: each page must provide unique value. Our approach:

1. **5+ Unique Data Points Per Page** - Non-negotiable minimum
2. **Industry-Specific Insights** - Regulations, pain points, trends
3. **Technology-Specific Recommendations** - Real implementation guidance
4. **Localized Content** - Where relevant (Boston/MA focus)
5. **Fresh Case Study Snippets** - Relevant project examples

### Tasks

#### 2.1 Design Data Schema (amdev-7o3)

```typescript
// src/data/pseo/types.ts
interface PseoPage {
	slug: string; // e.g., "nextjs-developer-for-fintech"
	technology: Technology;
	industry: Industry;

	// Required: 5+ unique data points
	uniqueInsights: string[]; // Min 5 items
	industryRegulations: Regulation[];
	commonPainPoints: PainPoint[];
	techStackRecommendations: Recommendation[];
	caseStudySnippet?: CaseStudy;

	// SEO
	title: string;
	description: string;
	keywords: string[];

	// Differentiation
	whyThisStack: string; // 150+ words, unique per page
	projectApproach: string; // Industry-specific methodology
	budgetGuidance: BudgetRange;

	// Internal linking
	relatedServices: string[];
	relatedBlogPosts: string[];
}
```

#### 2.2 Build Dynamic Route (amdev-fb7)

**File:** `src/app/services/[slug]/page.tsx`

**Key Requirements:**

- `generateStaticParams()` for all pages
- Proper canonical tags
- JSON-LD ServicePage schema
- Internal linking to related content
- Unique meta descriptions (no template duplication)

**Quality Gates:**

- Reject pages with <5 unique data points
- Minimum 800 words unique content per page
- Must include industry-specific section
- Must include technology-specific section

#### 2.3 Industry Research Database (amdev-jxz)

**Target Industries:**

| Industry        | Regulations                | Key Pain Points                    | Tech Needs                      |
| --------------- | -------------------------- | ---------------------------------- | ------------------------------- |
| **Fintech**     | PCI-DSS, SOC2, SEC         | Real-time processing, audit trails | High availability, encryption   |
| **Healthcare**  | HIPAA, HITECH              | Data privacy, integration          | Secure APIs, compliance logging |
| **E-commerce**  | PCI-DSS, CCPA              | Scale, inventory sync              | CDN, caching, search            |
| **SaaS B2B**    | SOC2, GDPR                 | Multi-tenancy, SSO                 | Scalable infra, auth            |
| **Logistics**   | DOT, customs               | Real-time tracking, optimization   | Maps, routing, IoT              |
| **Real Estate** | Fair Housing, MLS          | Data aggregation, search           | Property APIs, mapping          |
| **EdTech**      | FERPA, COPPA               | Video, engagement                  | Streaming, analytics            |
| **Legal Tech**  | Bar rules, confidentiality | Document management                | Security, search                |

**Per-Industry Required Content:**

1. 3+ specific regulations with compliance implications
2. 5+ common technical pain points
3. Recommended tech stack with rationale
4. Budget range expectations
5. Timeline expectations
6. 1 relevant case study or example

#### 2.4 Technology Content (amdev-b8t)

**Core Technologies:**

| Technology            | When to Use                     | Common Pitfalls             | Project Types         |
| --------------------- | ------------------------------- | --------------------------- | --------------------- |
| **Next.js/React**     | Dynamic web apps, SEO-critical  | Overusing client components | SaaS, marketing sites |
| **Python/FastAPI**    | AI/ML, data processing          | Async complexity            | APIs, pipelines       |
| **Node.js**           | Real-time, JavaScript fullstack | Callback hell, memory       | Chat, streaming       |
| **PostgreSQL**        | Relational data, transactions   | N+1 queries                 | Most apps             |
| **AI/ML Integration** | Automation, intelligence        | Hallucination, cost         | Enhancement features  |

#### 2.5 Generate Initial 20 Pages (amdev-rr0)

**Priority Pages (High Search Volume + High Intent):**

1. `nextjs-developer-for-saas`
2. `react-developer-for-fintech`
3. `fullstack-developer-for-startups`
4. `python-developer-for-ai-integration`
5. `api-developer-for-healthcare`
6. `nextjs-developer-for-ecommerce`
7. `technical-advisor-for-startups`
8. `fractional-cto-for-seed-stage`
9. `mvp-developer-for-founders`
10. `react-developer-for-saas`
11. `python-developer-for-data-pipelines`
12. `fullstack-developer-for-fintech`
13. `technical-cofounder-alternative`
14. `senior-developer-for-healthcare`
15. `cloud-architect-for-startups`
16. `api-developer-for-logistics`
17. `nextjs-developer-for-real-estate`
18. `ai-integration-developer`
19. `performance-optimization-consultant`
20. `technical-due-diligence-services`

**Quality Checklist Per Page:**

- [ ] 800+ words unique content
- [ ] 5+ unique data points
- [ ] Industry-specific section (200+ words)
- [ ] Technology-specific section (200+ words)
- [ ] Case study snippet
- [ ] 3+ internal links
- [ ] Unique meta description
- [ ] JSON-LD structured data
- [ ] Passes Copyscape

#### 2.6 Internal Linking Strategy (amdev-a8h)

**Link Architecture:**

```
Homepage
├── /services (index)
│   ├── /services/nextjs-developer-for-saas
│   │   ├── Links to: related industry pages
│   │   ├── Links to: related tech pages
│   │   └── Links to: relevant blog posts
│   └── ... (19 more pages)
├── /work (case studies)
│   └── Each links to relevant service pages
└── /blog
    └── Each post links to relevant service pages
```

**Per-Page Link Requirements:**

- 2+ links to other service pages
- 1+ link to relevant case study
- 1+ link to relevant blog post
- Contextual anchor text (not "click here")

#### 2.7 Google Search Console Submission (amdev-8n0)

**Sitemap Updates:**

```typescript
// src/app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const services = await getAllPseoPages();

	return [
		...existingPages,
		...services.map((service) => ({
			url: `https://alexmayhew.dev/services/${service.slug}`,
			lastModified: service.updatedAt,
			changeFrequency: "monthly",
			priority: 0.8,
		})),
	];
}
```

**GSC Actions:**

1. Submit updated sitemap
2. Request indexing for priority pages
3. Set up performance monitoring
4. Track keyword rankings weekly

---

## Phase 3: Community Infiltration Strategy

**Bead:** amdev-qx1 | **Priority:** P2

### Objective

Build reputation in developer and founder communities through helpful contributions.

### The "Help First" Philosophy

**Rule:** Never pitch. Only help. Opportunities come from demonstrated expertise.

### Tasks

#### 3.1 Join Target Slack Communities (amdev-nx8)

**Priority Communities:**

| Community                  | Focus               | Application Required | Notes                |
| -------------------------- | ------------------- | -------------------- | -------------------- |
| **CTO Craft**              | Engineering leaders | Yes                  | High-value, vetted   |
| **Rands Leadership Slack** | Eng managers        | Yes                  | Very active          |
| **Boston Startups**        | Local ecosystem     | No                   | Geographic focus     |
| **Indie Hackers**          | Solo founders       | No                   | High founder density |
| **Tech Leaders**           | Senior engineers    | Yes                  | Decision makers      |

**Application Strategy:**

- Reference specific expertise areas
- Mention willingness to contribute
- Note genuine interest in community

#### 3.2 Join Target Discord Servers (amdev-262)

**Priority Servers:**

| Server             | Focus           | Notes                          |
| ------------------ | --------------- | ------------------------------ |
| **Indie Hackers**  | Bootstrappers   | Very active, founder-heavy     |
| **Reactiflux**     | React/JS        | Technical discussions          |
| **Python Discord** | Python          | Good for AI/ML discussions     |
| **Y Combinator**   | Funded startups | High-quality founders          |
| **Buildspace**     | Builders        | Younger audience, enthusiastic |

#### 3.3 Set Up Keyword Monitoring (amdev-r50)

**Priority Keywords:**

```
# High Intent - Immediate Need
"looking for developer"
"need a developer"
"hiring developer"
"seeking technical cofounder"
"need help with"
"anyone know a good"

# Pain Signals - Opportunity to Help
"stuck on"
"can't figure out"
"architecture question"
"scaling issues"
"performance problem"
"technical debt"

# Technology Specific
"Next.js problem"
"React performance"
"Python API"
"database scaling"
"authentication help"
```

**Setup:**

- Enable Slack/Discord keyword notifications
- Check alerts 2x daily (morning/evening)
- Respond within 4 hours to high-intent

#### 3.4 Profile Optimization (amdev-1m2)

**Standard Profile Format:**

```
Name: Alex Mayhew
Title: Technical Advisor for Startups
Bio: I help founders make better technical decisions.
     Full-stack architect (React, Python, Node).
     Open to architecture questions.
Link: alexmayhew.dev
```

**Profile Photo:** Professional headshot, consistent across platforms

#### 3.5 Response Templates (amdev-sk6)

**Template: Architecture Question**

```
Good question! A few thoughts:

1. [Direct answer to their question]
2. [Common pitfall to avoid]
3. [Alternative approach worth considering]

I've done something similar for [brief relevant example].
Happy to elaborate if helpful.
```

**Template: Performance Issue**

```
That's a frustrating one. Based on what you've described:

**Quick wins to try:**
- [Specific suggestion 1]
- [Specific suggestion 2]

**If that doesn't work:**
- [Deeper investigation approach]

I dealt with something similar in [context].
The root cause turned out to be [insight].
```

**Template: Tech Stack Decision**

```
It depends on a few factors:

**Go with [Option A] if:**
- [Condition 1]
- [Condition 2]

**Go with [Option B] if:**
- [Condition 1]
- [Condition 2]

For most startups I advise, I recommend [specific choice]
because [concrete reason with business context].
```

#### 3.6 Daily Engagement Routine (amdev-h77)

**Morning (10 min):**

- Check keyword alerts
- Scan 2-3 active channels
- Respond to any relevant threads

**Evening (5 min):**

- Follow up on any ongoing conversations
- Check for replies to your contributions
- Note interesting discussions for content ideas

**Weekly Metrics:**

- Helpful responses given: Target 5+
- DMs received: Track for trends
- Referral conversations: Track for pipeline

---

## Phase 4: LinkedIn Authority Building

**Bead:** amdev-7ww | **Priority:** P2

### Objective

Position as thought leader through consistent, valuable content.

### Tasks

#### 4.1 Profile Overhaul (amdev-9ta)

**Headline (120 chars max):**

```
Technical Advisor for Startups | Full-Stack Architect |
Turning Founders' Ideas into Scalable Products
```

**About Section (2600 chars max):**

```
Every week, startup founders make technical decisions that will
either become competitive advantages or crushing debt.

I help them choose wisely.

After architecting systems that:
→ Process millions of transactions
→ Scale from MVP to enterprise
→ Pass security audits and due diligence

I've learned that the best technical decisions aren't about
picking the "right" technology—they're about matching
solutions to business constraints.

WHAT I DO:
• Strategic Technical Advisory - ongoing guidance for
  founders navigating technical decisions
• Full-Stack Architecture - building scalable systems
  from the ground up
• Technical Due Diligence - code audits and assessments
  for investors and acquirers

TECHNOLOGIES I WORK WITH:
React/Next.js, Python/FastAPI, Node.js, PostgreSQL,
AI/ML Integration, Cloud Architecture (AWS/GCP/Cloudflare)

RECENT WORK:
• GPU-accelerated image processing platform (99.95% uptime,
  73% cost reduction)
• Enterprise AI orchestration system (14 models, 49GB VRAM)
• Custom cybersecurity LLM with domain-specific fine-tuning

If you're a founder making technical decisions with
business consequences, let's talk.

📩 alex@alexmayhew.dev
🌐 alexmayhew.dev
```

**Featured Section:**

1. Best performing blog post
2. TraceForge live demo
3. Most impressive case study

#### 4.2 Content Calendar (amdev-e24)

**Weekly Cadence:**
| Day | Content Type | Topic Source |
|-----|-------------|--------------|
| Monday | Technical Deep-Dive | Current project insight |
| Wednesday | Building in Public | Project update or learning |
| Friday | Industry Observation | Trend or opinion |
| Weekend | Engagement Focus | Comment on others' posts |

**Content Pillars:**

1. **Architecture Decisions** - Why I chose X over Y
2. **Startup Tech Wisdom** - Lessons for founders
3. **Building in Public** - Current project updates
4. **Tool Recommendations** - What I use and why

#### 4.3 First 8 Posts (amdev-6h5)

**Post 1: Introduction/Positioning**

```
I've spent the last year as a technical advisor
instead of a freelance developer.

The difference?

As a freelancer: "What do you want me to build?"
As an advisor: "What problem are you actually solving?"

The conversations changed. The projects got better.
The outcomes improved.

Here's what I learned about making that shift...
```

**Post 2: Technical Insight**

```
Unpopular opinion: Your startup doesn't need Kubernetes.

I know, I know. Everyone "needs to scale."

But here's what I've seen:
[Specific example with numbers]

When K8s makes sense:
• [Condition 1]
• [Condition 2]

When it doesn't:
• [Condition 1]
• [Condition 2]

What's the most over-engineered solution you've seen?
```

**Post 3: Building in Public**

```
Just shipped TraceForge - a GPU-accelerated
raster-to-vector converter.

What I learned building it:
1. [Technical insight]
2. [Business decision]
3. [Unexpected challenge]

Try it free: [link]

What's something you've built recently that taught
you something unexpected?
```

**Post 4-8:** Continue pattern with varied topics

#### 4.4 Target Connection List (amdev-1uz)

**Ideal Connection Profile:**

- Startup founders (Seed to Series B)
- CTOs/VPs Engineering at growing companies
- Agency owners (design, marketing, SEO)
- VCs/Angels (for due diligence referrals)
- Other technical advisors (referral network)

**Research Sources:**

- LinkedIn Sales Navigator (if available)
- Crunchbase (recently funded)
- AngelList/Wellfound
- Local Boston startup community
- Y Combinator directory

**Target: 100 connections to add**

- 40 founders
- 30 technical leaders
- 15 agency owners
- 15 investors/advisors

#### 4.5 Engagement Strategy (amdev-bd4)

**Daily Routine (15 min):**

1. Check notifications, respond to comments
2. Find 3 posts from target connections
3. Leave thoughtful comments (not "great post!")
4. Share 1 post with added insight

**Comment Formula:**

```
[Specific thing I agree with or learned] +
[Additional insight from my experience] +
[Question to continue conversation]
```

#### 4.6 Blog Repurposing (amdev-gpg)

**Existing Blog Posts to Repurpose:**

| Blog Post                     | LinkedIn Angle                                     |
| ----------------------------- | -------------------------------------------------- |
| AI-Assisted Development       | "The hidden cost of AI-generated code"             |
| Boring Technology Wins        | "Why I recommend Rails over Next.js sometimes"     |
| Lambda Tax Cold Starts        | "The performance tax nobody talks about"           |
| Senior Developer Paradox      | "Why the best engineers write less code"           |
| Tech Stack Capital Allocation | "Your tech stack is a capital allocation decision" |

**Repurposing Formula:**

1. Extract key insight (1-2 sentences)
2. Add personal experience context
3. Make it conversational/controversial
4. End with question for engagement
5. Link to full article in comments

---

## Phase 5: Agency Partnership Outreach

**Bead:** amdev-uej | **Priority:** P2

### Objective

Establish white-label partnerships with design and marketing agencies.

### Tasks

#### 5.1 Value Proposition (amdev-ehc)

**Core Message:**

> "I allow you to say 'Yes' to $50k+ projects you would usually decline."

**Key Benefits:**

1. **Capacity Expansion** - Take on larger technical projects
2. **Quality Assurance** - Enterprise-grade code
3. **Risk Reduction** - Reliable delivery, no ghosting
4. **White-Label Ready** - Your brand, my execution
5. **Non-Compete** - 12-month non-solicitation guaranteed

**Objection Handling:**

| Objection                    | Response                                                           |
| ---------------------------- | ------------------------------------------------------------------ |
| "Too expensive"              | "I help you win $50k projects. My fee is part of that margin."     |
| "Will you steal our client?" | "I sign a 12-month non-solicitation. It's in the MSA."             |
| "We've been burned before"   | "I'll do a small pilot project so you can evaluate with low risk." |
| "We have developers"         | "I handle the complex architecture your team can then maintain."   |

#### 5.2 Prospect List (amdev-cix)

**Target Agency Profiles:**

| Type                   | Signals                                    | Pain Points                          |
| ---------------------- | ------------------------------------------ | ------------------------------------ |
| **Design Agencies**    | Beautiful Dribbble, weak tech case studies | Can't implement complex interactions |
| **Marketing Agencies** | Strong SEO/PPC, limited web services       | Lose clients needing web dev         |
| **SEO Agencies**       | Rank for "web design [city]"               | Technical SEO, site speed issues     |
| **Branding Agencies**  | High-end identity work                     | Can't build the websites they design |

**Research Process:**

1. Search "[city] design agency" or "[city] marketing agency"
2. Check portfolio for technical weakness
3. Find founder/owner on LinkedIn
4. Note recent work for personalization
5. Add to outreach spreadsheet

**Spreadsheet Columns:**

- Agency Name
- Website
- Owner Name
- Email
- LinkedIn
- Recent Project (for personalization)
- Tech Weakness Identified
- Outreach Status
- Response

#### 5.3 Email Templates (amdev-hts)

**Template A: Design Agency**

```
Subject: Increasing [Agency]'s capacity for technical builds

Hi [Name],

I've been following [Agency]'s work—the [specific project]
you did for [client] was exceptional.

I work with design agencies as their invisible technical
partner. When you have a project that needs complex React
development, API integrations, or performance optimization,
I handle it under your brand.

Recently, I helped a design agency deliver a SaaS MVP
for their client—work they would have declined without
technical support. It added $30k to their project scope.

Would a quick call make sense to see if there's a fit?

Best,
Alex

P.S. I sign a 12-month non-solicitation, so your clients
stay yours.
```

**Template B: Marketing Agency**

```
Subject: Technical development partnership with [Agency]

Hi [Name],

I noticed [Agency] does excellent work on [service type]—
but I didn't see many custom web development projects
in your portfolio.

If you're turning down web development requests (or
outsourcing to unreliable developers), I might be
able to help.

I partner with marketing agencies as their dedicated
technical resource. You sell the project, manage the
client, and I build it—all under your brand.

One agency I work with added $80k in revenue last
quarter from projects they previously couldn't handle.

Worth a 15-minute call to explore?

Alex
```

**Template C: SEO Agency**

```
Subject: Technical SEO implementation for [Agency] clients

Hi [Name],

Technical SEO recommendations without implementation
is frustrating for everyone—your team knows what needs
to happen, but clients can't get it done.

I work with SEO agencies as their technical implementation
partner. Core Web Vitals fixes, site speed optimization,
structured data, technical migrations—I handle it so
your recommendations actually get implemented.

Would it be useful to have a reliable technical partner
for your client projects?

Alex
```

#### 5.4 Partnership Collateral (amdev-5vq)

**Collateral Package:**

1. **Partnership Overview (1-pager)**
   - Services offered
   - Process overview
   - Pricing framework
   - Guarantees

2. **Case Studies (anonymized)**
   - 2-3 successful agency partnerships
   - Metrics and outcomes
   - Testimonials if available

3. **Technical Capabilities**
   - Technology expertise
   - Project types
   - Typical timelines

4. **Process Documentation**
   - How handoffs work
   - Communication expectations
   - Quality assurance process

5. **FAQ Document**
   - Common questions answered
   - Objection handling

#### 5.5 MSA Template (amdev-oiv)

**Key Clauses:**

1. **IP Transfer**

   > "All intellectual property rights in deliverables transfer
   > to Agency upon full payment of associated invoice."

2. **Non-Solicitation**

   > "Developer agrees not to directly solicit Agency's clients
   > for services competitive with those provided under this
   > Agreement for a period of twelve (12) months following
   > last project delivery."

3. **Confidentiality**

   > "Developer shall maintain confidentiality of all client
   > information and project details. White-label arrangements
   > shall not be disclosed to end clients without Agency consent."

4. **Revision Scope**

   > "Each project includes two (2) rounds of revisions within
   > original scope. Additional revisions or scope changes
   > billed at [rate]/hour with prior Agency approval."

5. **Payment Terms**

   > "50% deposit upon project initiation, 50% upon delivery.
   > Net 15 payment terms. Late payment incurs 1.5% monthly fee."

6. **Termination**
   > "Either party may terminate with 30 days written notice.
   > Outstanding project commitments to be honored or
   > transitioned per mutual agreement."

#### 5.6 Outreach Campaign (amdev-t3y)

**Campaign Structure:**

| Day    | Action                             |
| ------ | ---------------------------------- |
| Day 1  | Send emails 1-10                   |
| Day 2  | Send emails 11-20                  |
| Day 3  | Send emails 21-30                  |
| Day 4  | Send emails 31-40                  |
| Day 5  | Send emails 41-50                  |
| Day 8  | Follow up batch 1 (non-responders) |
| Day 9  | Follow up batch 2                  |
| Day 10 | Follow up batch 3                  |
| Day 11 | Follow up batch 4                  |
| Day 12 | Follow up batch 5                  |

**Follow-Up Template:**

```
Subject: Re: [Original Subject]

Hi [Name],

Just floating this back up—I know agency life is busy.

If white-label development isn't a priority right now,
no worries at all. But if you're ever stuck on a project
that needs senior technical support, I'm around.

Alex
```

**Tracking Metrics:**

- Open rate (target: 40%+)
- Reply rate (target: 10%+)
- Meeting rate (target: 5%+)
- Partnership conversion (target: 4%+)

#### 5.7 Onboarding Process (amdev-8gt)

**Day 1: Kick-Off**

- 30-min video call
- Review partnership terms
- Sign MSA
- Exchange contact info
- Set up communication channel (Slack/Discord)

**First Project:**

- 15-min scope call
- Written brief from agency
- Quote within 24 hours
- Deposit before work begins
- Daily async updates
- Delivery + revision cycle
- Handoff documentation

**Ongoing:**

- Weekly availability update
- Priority for repeat partners
- Quarterly partnership review

---

## Success Metrics

### 30-Day Checkpoints

- [ ] Site messaging transformed (Phase 1 complete)
- [ ] 10+ pSEO pages live and indexed
- [ ] Active in 3+ communities
- [ ] LinkedIn profile optimized
- [ ] First outreach batch sent

### 60-Day Checkpoints

- [ ] 20+ pSEO pages live
- [ ] First inbound inquiry from content
- [ ] 8+ LinkedIn posts published
- [ ] Community reputation established
- [ ] 50 agency emails sent, 2+ meetings

### 90-Day Checkpoints

- [ ] Sustainable organic traffic growth
- [ ] 3-5 qualified leads per month
- [ ] 1+ agency partnership active
- [ ] Regular content cadence established
- [ ] Pipeline covering next quarter

---

## Risk Mitigation

### Content Risks

| Risk                     | Mitigation                                   |
| ------------------------ | -------------------------------------------- |
| pSEO duplicate penalties | Quality gate: 5+ unique data points per page |
| LinkedIn shadowban       | Genuine engagement, no automation            |
| Community ban            | Help first, never pitch                      |

### Business Risks

| Risk                             | Mitigation                           |
| -------------------------------- | ------------------------------------ |
| No responses to outreach         | A/B test templates, refine targeting |
| Community efforts not converting | Track and attribute carefully        |
| Burnout from content creation    | Batch creation, repurposing          |

---

## Quick Reference: Beads

### Epic

- `amdev-183` - [EPIC] 2026 Marketing Launch Plan

### Phases

- `amdev-nfc` - Phase 1: Positioning & Messaging Overhaul
- `amdev-9z1` - Phase 2: pSEO Implementation
- `amdev-qx1` - Phase 3: Community Infiltration Strategy
- `amdev-7ww` - Phase 4: LinkedIn Authority Building
- `amdev-uej` - Phase 5: Agency Partnership Outreach

### Ready to Start (No Blockers)

Run `bd ready` to see current unblocked tasks.

---

_Plan created January 23, 2026. Execute with bd tracking._
