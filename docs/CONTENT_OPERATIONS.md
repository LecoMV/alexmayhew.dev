# Content Operations — alexmayhew.dev

> Single source of truth for the content creation and distribution workflow.
> Last Updated: 2026-02-07

---

## Cadence

| Content Type      | Frequency             | Days    | Time (EST) | Owner                               |
| ----------------- | --------------------- | ------- | ---------- | ----------------------------------- |
| Blog post (spoke) | Every 2 weeks         | Monday  | —          | Claude drafts, Alex reviews         |
| Newsletter        | Weekly                | Tuesday | 9:00 AM    | Claude drafts, Alex reviews         |
| LinkedIn post     | 4x/week               | Mon-Thu | 10:00 AM   | Claude generates + reviews → Postiz |
| X/Twitter tweet   | 3x/week               | Tue-Thu | 12:00 PM   | Claude generates + reviews → Postiz |
| Dev.to cross-post | Bi-weekly (with blog) | Monday  | 9:00 AM    | Auto via n8n → Postiz               |

**Monthly output:** 2 blog posts + 4 newsletters + ~16 LinkedIn posts + ~12 X tweets + 2 Dev.to = ~36 pieces from 2 core articles + blog library.

---

## The Week A / Week B Rhythm

### Week A — Blog Week

```
Monday:    New blog post publishes (push to main → CI/CD deploys)
           └─ n8n webhook fires → generates social variants
           LinkedIn post (10:00 AM EST, blog-derived)
           Dev.to cross-post (9:00 AM EST)
Tuesday:   Newsletter issue (features the blog post's core insight)
           LinkedIn post (10:00 AM EST, blog-derived)
           X/Twitter tweet (12:00 PM EST, blog-derived)
Wednesday: LinkedIn post (10:00 AM EST, blog-derived)
           X/Twitter tweet (12:00 PM EST, blog-derived)
Thursday:  LinkedIn post (10:00 AM EST, blog-derived)
           X/Twitter tweet (12:00 PM EST, blog-derived)
```

### Week B — Newsletter-Only Week

```
Monday:    LinkedIn post (10:00 AM EST, repurposed from blog library)
Tuesday:   Newsletter issue (standalone insight — no new blog post)
           LinkedIn post (10:00 AM EST, repurposed)
           X/Twitter tweet (12:00 PM EST, repurposed)
Wednesday: LinkedIn post (10:00 AM EST, repurposed)
           X/Twitter tweet (12:00 PM EST, repurposed)
Thursday:  LinkedIn post (10:00 AM EST, repurposed)
           X/Twitter tweet (12:00 PM EST, repurposed)
```

**Repeat.** This gives 24 blog posts/year, 52 newsletters/year, ~200 LinkedIn posts/year, ~150 X tweets/year.

---

## End-to-End Workflow

### Step 1: Plan (Monthly)

At the start of each month, decide:

- Which 2 hub clusters get new spoke posts this month
- Which 4 newsletter topics to cover (2 blog-tied, 2 standalone)
- Any seasonal or timely topics to slot in

**Tool:** `bd ready` for pending content tasks, `docs/EDITORIAL_CALENDAR_2026.md` for the plan.

### Step 2: Create (Weekly)

**Blog posts (Week A — Monday):**

1. Claude drafts the full post in brand voice (2,000-4,000 words)
2. Alex reviews (15-20 min): verify claims, add personal anecdotes, check voice
3. Run through `content/blog/QUALITY_CHECKLIST.md`
4. Create featured image (WebP, 1920x1072, neo-brutalist style)
5. Push to `main` → GitHub Actions builds and deploys

**Newsletter issues (Every Tuesday):**

1. Claude drafts in template format (`content/newsletter/TEMPLATE.md`)
2. Alex reviews (10-15 min): verify links, check voice, approve
3. Run through `content/newsletter/QUALITY_CHECKLIST.md`
4. Create campaign in Listmonk (Admin UI or API)
5. Schedule for Tuesday 9:00 AM EST

### Step 3: Distribute (Automatic)

**Automated flow (n8n + Groq + voice validation):**

```
Blog push to main
  → GitHub webhook (or manual n8n trigger)
    → n8n reads post content
      → 4 parallel Groq (Llama 3.3 70B) generations:
          ├─ LinkedIn text post (1,000-1,300 chars)
          ├─ X standalone tweet (under 280 chars)
          ├─ Dev.to article (full cross-post)
          └─ Newsletter section ("This Week's Decision" format)
      → If Groq fails → fallback to Ollama (Gemma 2 9B)
      → Voice compliance validation node:
          ├─ Banned words check (game-changer, delve, etc.)
          ├─ Emoji detection
          ├─ Platform-specific length validation
          └─ Hashtag detection
      → Postiz API schedules LinkedIn/X/Dev.to to correct day/time
      → Response includes all content + validation results
```

**Groq upgrade note:** Llama 3.3 70B produces significantly better output than Gemma 2 9B. Expect ~20-30% rewrite rate (down from ~90%). Ollama serves as automatic fallback if Groq is unavailable.

**Manual trigger (if webhook doesn't fire):**

```bash
curl -X POST http://localhost:5678/webhook/content-repurpose \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Post Title",
    "slug": "post-slug",
    "content": "Full blog post markdown..."
  }'
```

**Newsletter campaign management (`scripts/newsletter-manage.sh`):**

```bash
# Create all draft campaigns from newsletter markdown files
./scripts/newsletter-manage.sh create-all

# Show status of all campaigns (draft/scheduled/sent)
./scripts/newsletter-manage.sh status

# Schedule the next upcoming draft campaign
./scripts/newsletter-manage.sh schedule-next

# Preview a specific issue's rendered HTML
./scripts/newsletter-manage.sh preview 005
```

**Listmonk newsletter (manual fallback):**

1. Create campaign in Listmonk Admin > Campaigns > New
2. Select "The Architects Brief" template and list
3. Send test to personal inbox → verify rendering
4. Schedule for Tuesday 9:00 AM EST

**Blog auto-publish (GitHub Actions):**

The `.github/workflows/publish-scheduled.yml` workflow runs every Monday at 05:00 UTC. It scans `content/blog/*.mdx` for posts where `date <= today` and `draft: true`, flips them to `draft: false`, commits, and pushes — triggering the existing deploy pipeline. Safety guards: max 2 posts per run, only publishes posts within the current week's date range, supports `DRY_RUN` mode via `workflow_dispatch`.

### Step 4: Measure (Weekly)

Every Friday, check:

- Newsletter: open rate, click rate, reply count (Listmonk dashboard)
- Social: engagement per post (Postiz analytics)
- Blog: page views, time on page (GA4)
- Note what resonated for future topic planning

---

## Quality Gates

| Content Type     | Checklist Location                        | Gate                                    |
| ---------------- | ----------------------------------------- | --------------------------------------- |
| Blog post        | `content/blog/QUALITY_CHECKLIST.md`       | Must pass before pushing to main        |
| Newsletter issue | `content/newsletter/QUALITY_CHECKLIST.md` | Must pass before scheduling in Listmonk |
| Social posts     | Auto-generated — spot-check weekly        | Review Postiz queue every Monday        |

---

## Automation Infrastructure

| System         | URL/Location                              | Purpose                                |
| -------------- | ----------------------------------------- | -------------------------------------- |
| n8n            | `http://localhost:5678`                   | Content generation + Postiz scheduling |
| Postiz         | `https://postiz.alexmayhew.dev`           | Social media scheduling dashboard      |
| Listmonk       | `https://listmonk.alexmayhew.dev`         | Newsletter delivery (self-hosted)      |
| Groq API       | Cloud (Llama 3.3 70B)                     | Primary content generation             |
| Ollama         | Local (Gemma 2 9B)                        | Fallback content generation            |
| GitHub Actions | `.github/workflows/deploy.yml`            | CI/CD on push to main                  |
| GitHub Actions | `.github/workflows/publish-scheduled.yml` | Auto-publish blog posts on schedule    |

### Content Health Monitor

`scripts/content-health.sh` runs daily checks across all content infrastructure:

```bash
./scripts/content-health.sh    # Run all checks
```

**Checks performed:**

1. Postiz container running + posts queued for next 7 days
2. Listmonk container running + campaign scheduled for next Tuesday
3. n8n container running + content repurposing workflow active
4. Ollama service running + model loaded
5. Blog posts past their date with `draft: true` still set
6. Social media gaps (days with zero queued posts in next 2 weeks)

**Exit codes:** 0 = healthy, 1 = warnings, 2 = critical failures

Deploy as systemd timer (daily at 08:00 EST) or n8n Schedule Trigger.

### If Automation Fails

**n8n not responding:**

```bash
podman ps | grep n8n          # Check if container is running
podman restart n8n            # Restart if needed
# Then manually trigger the webhook
```

**Postiz not scheduling:**

1. Check `https://postiz.alexmayhew.dev` dashboard
2. Verify API key is valid
3. Check integration IDs haven't changed (LinkedIn, Twitter, Dev.to)
4. Fallback: schedule posts manually in Postiz dashboard

**Listmonk not sending:**

1. Check Listmonk dashboard at `https://listmonk.alexmayhew.dev`
2. Check container logs: `podman logs listmonk`
3. Verify SMTP: Admin > Settings > SMTP > Send test
4. Fallback: send manually from Listmonk admin dashboard

---

## Staggered Distribution Rationale

Content goes out on different days, not all at once:

| Why Stagger                       | Explanation                                                                            |
| --------------------------------- | -------------------------------------------------------------------------------------- |
| Extends content lifespan          | 1 blog post generates 5 days of visibility instead of 1                                |
| Avoids audience fatigue           | CTO audience on LinkedIn AND Twitter doesn't see the same insight twice in one morning |
| Platform-native optimization      | Each format (carousel, thread, article) gets its own peak engagement window            |
| Builds perception of omnipresence | Consistent presence across platforms throughout the week                               |

**Exception:** Time-sensitive content (industry news reaction, major announcement) goes out simultaneously across all platforms.

---

## Content Types Reference

### Blog Posts (Spokes)

- **Length:** 2,000-5,000 words
- **Format:** MDX with frontmatter
- **Location:** `content/blog/`
- **Model:** Hub-and-spoke (every post extends a hub cluster)
- **Quality gate:** `content/blog/QUALITY_CHECKLIST.md`

### Newsletter Issues

- **Length:** 500-700 words
- **Format:** Markdown with frontmatter
- **Location:** `content/newsletter/issues/`
- **Template:** `content/newsletter/TEMPLATE.md`
- **Quality gate:** `content/newsletter/QUALITY_CHECKLIST.md`

### Social Posts (LLM-Generated + Claude-Reviewed)

- **LinkedIn text post:** 1,000-1,300 chars, no hashtags, no links in body, ends with specific question
- **X/Twitter tweet:** Max 280 chars, standalone insight, no links, no hashtags
- **Dev.to article:** Full markdown with canonical URL back to alexmayhew.dev
- **Generation prompts:** `docs/LLM_REPURPOSING_PROMPTS.md`
- **Quality note:** All LLM output must be reviewed for voice compliance and factual accuracy before scheduling

---

## Session Workflow (Claude + Alex)

### Starting a Content Session

```bash
bd ready                          # Check for content tasks
# Look at docs/EDITORIAL_CALENDAR_2026.md for what's next
# Draft the content piece
# Run through quality checklist
# Push to git (blog) or create campaign in Listmonk (newsletter)
```

### Ending a Content Session

```bash
git add <files>
git commit -m "content: add [post/issue title]"
bd close <completed-bead-ids>
bd sync
git push origin main              # Triggers CI/CD + n8n distribution
```

---

## Key Documents

| Document                                               | Purpose                                     |
| ------------------------------------------------------ | ------------------------------------------- |
| `docs/EDITORIAL_CALENDAR_2026.md`                      | What to write and when                      |
| `docs/CONTENT_STATUS.md`                               | Hub-and-spoke inventory                     |
| `docs/VOICE_GUIDE.md`                                  | Brand voice for all content                 |
| `docs/CONTENT_REPURPOSING_SYSTEM.md`                   | 1-to-10 framework and templates             |
| `docs/LLM_REPURPOSING_PROMPTS.md`                      | Prompts for Groq/Ollama generation          |
| `docs/N8N_SETUP_GUIDE.md`                              | n8n workflow setup and configuration        |
| `docs/NEWSLETTER_STRATEGY.md`                          | Newsletter platform, growth targets         |
| `docs/NEWSLETTER_CONTENT_CALENDAR.md`                  | Newsletter schedule (issues 1-36)           |
| `docs/LISTMONK_SETUP.md`                               | Listmonk configuration guide                |
| `content/blog/QUALITY_CHECKLIST.md`                    | Blog post quality gate                      |
| `content/newsletter/QUALITY_CHECKLIST.md`              | Newsletter quality gate                     |
| `content/newsletter/TEMPLATE.md`                       | Newsletter issue template                   |
| `content/newsletter/issues/`                           | 36 pre-written newsletter issues (.mdx)     |
| `scripts/newsletter-manage.sh`                         | Listmonk campaign management CLI            |
| `scripts/content-health.sh`                            | Daily content infrastructure health check   |
| `.github/workflows/publish-scheduled.yml`              | Auto-publish blog posts on schedule         |
| `docs/n8n-workflows/content-repurposing-workflow.json` | n8n workflow (Groq + fallback + validation) |
