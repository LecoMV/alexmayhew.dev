# Content Operations — alexmayhew.dev

> Single source of truth for the content creation and distribution workflow.
> Last Updated: 2026-01-29

---

## Cadence

| Content Type       | Frequency             | Day       | Time (EST) | Owner                       |
| ------------------ | --------------------- | --------- | ---------- | --------------------------- |
| Blog post (spoke)  | Every 2 weeks         | Monday    | —          | Claude drafts, Alex reviews |
| Newsletter         | Weekly                | Tuesday   | 9:00 AM    | Claude drafts, Alex reviews |
| Twitter/X thread   | Weekly                | Tuesday   | 10:00 AM   | Auto via n8n → Postiz       |
| LinkedIn carousel  | Weekly                | Wednesday | 10:00 AM   | Auto via n8n → Postiz       |
| Dev.to cross-post  | Bi-weekly (with blog) | Monday    | 9:00 AM    | Auto via n8n → Postiz       |
| Twitter/X hot take | Weekly                | Thursday  | 10:00 AM   | Auto via n8n → Postiz       |
| Bluesky cross-post | Weekly                | Thursday  | 11:00 AM   | Manual                      |
| LinkedIn text post | Weekly                | Friday    | 10:00 AM   | Auto via n8n → Postiz       |

**Monthly output:** 2 blog posts + 4 newsletters + ~12 social posts = ~18 pieces from 2 core articles.

---

## The Week A / Week B Rhythm

### Week A — Blog Week

```
Monday:    New blog post publishes (push to main → CI/CD deploys)
           └─ n8n webhook fires → generates social variants → Postiz schedules
Tuesday:   Newsletter issue (features the blog post's core insight)
           Twitter/X thread (auto-scheduled from blog)
Wednesday: LinkedIn carousel (auto-scheduled from blog)
Thursday:  Twitter/X hot take (auto-scheduled) + Bluesky cross-post (manual)
Friday:    LinkedIn text post (auto-scheduled from blog)
```

### Week B — Newsletter-Only Week

```
Tuesday:   Newsletter issue (standalone insight — no new blog post)
Wednesday: LinkedIn post (repurposed from newsletter or existing blog content)
Thursday:  Twitter/X post (repurposed)
Friday:    LinkedIn text post (repurposed)
```

**Repeat.** This gives 24 blog posts/year, 52 newsletters/year, 100+ social posts/year.

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

**Automated flow (n8n):**

```
Blog push to main
  → GitHub webhook (or manual n8n trigger)
    → n8n reads post content
      → 3 parallel Ollama (Gemma 2 9B) generations:
          ├─ LinkedIn text post
          ├─ X standalone tweet
          └─ Dev.to article
      → Postiz API schedules each to correct day/time
      → Response logged
```

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

**Listmonk newsletter (via admin dashboard):**

1. Create campaign in Listmonk Admin > Campaigns > New
2. Select "The Architects Brief" template and list
3. Send test to personal inbox → verify rendering
4. Schedule for Tuesday 9:00 AM EST

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

| System         | URL/Location                      | Purpose                                |
| -------------- | --------------------------------- | -------------------------------------- |
| n8n            | `http://localhost:5678`           | Content generation + Postiz scheduling |
| Postiz         | `https://postiz.alexmayhew.dev`   | Social media scheduling dashboard      |
| Listmonk       | `https://listmonk.alexmayhew.dev` | Newsletter delivery (self-hosted)      |
| Ollama         | Local (Gemma 2 9B)                | Content variant generation             |
| Groq API       | Cloud (Llama 3.3 70B)             | Hot takes + community answers          |
| GitHub Actions | `.github/workflows/deploy.yml`    | CI/CD on push to main                  |

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

### Social Posts (Auto-Generated)

- **LinkedIn carousel:** 10-12 slides, 1,200-1,800 chars
- **Twitter thread:** 8-12 tweets
- **Dev.to article:** Full markdown with canonical URL back to alexmayhew.dev
- **LinkedIn text:** 150-300 words
- **Twitter hot take:** Max 280 chars, contrarian angle
- **Generation prompts:** `docs/LLM_REPURPOSING_PROMPTS.md`

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

| Document                                  | Purpose                              |
| ----------------------------------------- | ------------------------------------ |
| `docs/EDITORIAL_CALENDAR_2026.md`         | What to write and when               |
| `docs/CONTENT_STATUS.md`                  | Hub-and-spoke inventory              |
| `docs/VOICE_GUIDE.md`                     | Brand voice for all content          |
| `docs/CONTENT_REPURPOSING_SYSTEM.md`      | 1-to-10 framework and templates      |
| `docs/LLM_REPURPOSING_PROMPTS.md`         | Prompts for Ollama/Groq generation   |
| `docs/N8N_SETUP_GUIDE.md`                 | n8n workflow setup and configuration |
| `docs/NEWSLETTER_STRATEGY.md`             | Newsletter platform, growth targets  |
| `docs/LISTMONK_SETUP.md`                  | Listmonk configuration guide         |
| `content/blog/QUALITY_CHECKLIST.md`       | Blog post quality gate               |
| `content/newsletter/QUALITY_CHECKLIST.md` | Newsletter quality gate              |
| `content/newsletter/TEMPLATE.md`          | Newsletter issue template            |
