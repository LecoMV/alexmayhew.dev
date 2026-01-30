# Listmonk Setup Guide — The Architect's Brief

> Self-hosted newsletter platform configuration.
> Platform: [Listmonk](https://listmonk.app) v6.0.0 (self-hosted)

---

## 1. Infrastructure

| Component  | Details                                                        |
| ---------- | -------------------------------------------------------------- |
| Container  | `docker.io/listmonk/listmonk:v6.0.0` via Podman                |
| Database   | PostgreSQL on port 5433 (shared instance, `listmonk` database) |
| Config     | `/data/listmonk/config.toml`                                   |
| Compose    | `/data/listmonk/podman-compose.yml`                            |
| Uploads    | `/data/listmonk/uploads/`                                      |
| Local URL  | `http://localhost:9000`                                        |
| Public URL | `https://listmonk.alexmayhew.dev` (Cloudflare Tunnel)          |
| Systemd    | `~/.config/systemd/user/listmonk.service` (auto-start)         |

### Starting/Stopping

```bash
# Via systemd (preferred)
systemctl --user start listmonk
systemctl --user stop listmonk
systemctl --user status listmonk

# Direct
cd /data/listmonk && podman-compose up -d
cd /data/listmonk && podman-compose down
```

---

## 2. Configuration

### Sending Identity

| Setting         | Value                           |
| --------------- | ------------------------------- |
| Newsletter name | The Architect's Brief           |
| Sender name     | Alex Mayhew                     |
| Sender email    | alex@alexmayhew.dev             |
| Root URL        | https://listmonk.alexmayhew.dev |

### SMTP (Resend)

| Setting  | Value                             |
| -------- | --------------------------------- |
| Host     | smtp.resend.com                   |
| Port     | 465                               |
| Auth     | Login                             |
| Username | resend                            |
| Password | `pass show claude/resend/api-key` |
| TLS      | TLS (SSL)                         |

### Mailing List

| Attribute | Value                |
| --------- | -------------------- |
| Name      | The Architects Brief |
| List ID   | 3                    |
| Type      | Public               |
| Opt-in    | Double               |

---

## 3. API Integration

The website integrates with Listmonk via the **public subscription API** (no auth required).

> **Note:** Listmonk v6 RBAC restricts the admin API (`/api/subscribers`) from managing list assignments. The public endpoint (`/api/public/subscription`) correctly handles subscriber creation, list assignment, and double opt-in confirmation emails.

**Key files:**

- Server action: `src/app/actions/newsletter.ts`
- Env config: `src/lib/cloudflare-env.ts`
- Component: `src/components/newsletter/newsletter-signup.tsx`

**Environment:**

```bash
# Local development (.env.local)
LISTMONK_API_URL=http://localhost:9000

# Admin credentials (for admin UI and n8n, NOT used by website signup)
pass show claude/listmonk/admin-password
```

**Subscriber creation payload:**

```
POST /api/public/subscription
Content-Type: application/json

{
	"email": "subscriber@example.com",
	"name": "",
	"list_uuids": ["41e24d1e-f13b-45b5-8a73-483ffe85def2"]
}
```

**List UUID:** `41e24d1e-f13b-45b5-8a73-483ffe85def2` (The Architects Brief, ID 3)

**API response codes:**

- `200` — Success (subscriber created or already exists, `has_optin: true` for double opt-in)
- `400` — Invalid email or missing list UUIDs

---

## 4. Email Templates

### Campaign Template (ID 5)

"The Architects Brief" — table-based HTML layout with:

- Neo-brutalist dark theme (void-navy bg, cyber-lime accents)
- `{{ template "content" . }}` for campaign content injection
- `{{ .UnsubscribeURL }}` and `{{ .ManageURL }}` in footer
- Max-width 600px, mobile-responsive

### Transactional Templates (Welcome Sequence)

| ID  | Name                          | Subject                                                  | Delay     |
| --- | ----------------------------- | -------------------------------------------------------- | --------- |
| 6   | Welcome - 01 Welcome          | Welcome to The Architect's Brief (+ what to expect)      | Immediate |
| 7   | Welcome - 02 First Insight    | The architecture mistake I see in every early-stage SaaS | Day 3     |
| 8   | Welcome - 03 How I Help       | How I help CTOs make better architecture decisions       | Day 7     |
| 9   | Welcome - 04 Engagement Check | Quick question (2 weeks in)                              | Day 14    |
| 10  | Welcome - 05 Case Study       | The architecture review that saved 6 months              | Day 21    |

---

## 5. Welcome Sequence Automation (n8n)

Listmonk lacks native drip campaigns. The welcome sequence is automated via n8n (port 5678).

**Workflow:** `docs/n8n-workflows/welcome-sequence-workflow.json`

### Flow

```
Cron (every 15 min) → Query subscribers without "welcome_started" attrib
  → Mark "welcome_started" → Send template 6 (immediate)
  → Wait 3 days → Send template 7
  → Wait 4 days → Send template 8
  → Wait 7 days → Send template 9
  → Wait 7 days → Send template 10
  → Mark "welcome_complete"
```

### Setup

1. Import `welcome-sequence-workflow.json` into n8n
2. Create HTTP Basic Auth credential named "Listmonk API" with admin credentials
3. Activate the workflow

n8n Wait nodes persist state to database — survives restarts.

---

## 6. Sending Regular Issues

### Workflow

1. **Draft:** Write issue in `content/newsletter/issues/NNN-slug.md`
2. **Review:** Run through `content/newsletter/QUALITY_CHECKLIST.md`
3. **Create campaign:** Admin UI > Campaigns > New, or via API
4. **Content type:** Markdown (rendered by Listmonk)
5. **Template:** Select "The Architects Brief" (ID 5)
6. **List:** Select "The Architects Brief" (ID 3)
7. **Preview:** Send test email to personal inbox
8. **Schedule:** Set send time for Tuesday, 9 AM EST
9. **Update:** Set frontmatter `status: "sent"` and commit

### Draft Campaigns

| ID  | Issue | Subject                                             | Send Date  |
| --- | ----- | --------------------------------------------------- | ---------- |
| 2   | #001  | Why your SaaS needs a monolith (yes, really)        | 2026-02-04 |
| 3   | #002  | The hidden cost of microservices (at your stage)    | 2026-02-11 |
| 4   | #003  | PostgreSQL RLS: multi-tenancy without the migration | 2026-02-18 |
| 5   | #004  | When NOT to use Next.js (and what to pick instead)  | 2026-02-25 |

---

## 7. Subscriber Management

### Attributes

| Attribute          | Set By        | Purpose                                      |
| ------------------ | ------------- | -------------------------------------------- |
| `source`           | Server action | Where they signed up (website, blog, footer) |
| `subscribed_at`    | Server action | ISO timestamp of signup                      |
| `welcome_started`  | n8n           | Timestamp when welcome sequence began        |
| `welcome_step`     | n8n           | Current step in welcome sequence (1-5)       |
| `welcome_complete` | n8n           | Timestamp when welcome sequence finished     |

### Subscriber Query Examples

```sql
-- New subscribers not yet in welcome sequence
subscribers.status = 'enabled' AND NOT subscribers.attribs ? 'welcome_started'

-- Completed welcome sequence
subscribers.attribs->>'welcome_complete' IS NOT NULL

-- From website signup
subscribers.attribs->>'source' = 'website'
```

---

## 8. Troubleshooting

### Listmonk Not Starting

```bash
podman logs listmonk                    # Check container logs
systemctl --user status listmonk        # Check service status
curl -sf http://localhost:9000/          # Test local access
```

### Emails Not Sending

1. Check SMTP config in Admin > Settings > SMTP
2. Test SMTP: Admin > Settings > SMTP > Send test email
3. Verify Resend API key: `pass show claude/resend/api-key`
4. Check DNS records: `dig TXT alexmayhew.dev` (SPF/DKIM/DMARC)

### Subscribers Not Appearing

1. Double opt-in requires email confirmation — check spam folders
2. Rate limiting allows 3 attempts per IP per hour
3. Check Listmonk Admin > Subscribers for pending confirmations
4. 409 responses mean already subscribed (handled as success)

### Welcome Sequence Not Triggering

1. Check n8n at `http://localhost:5678`
2. Verify workflow is active
3. Check n8n HTTP Basic Auth credential has correct Listmonk password
4. Verify subscriber has no `welcome_started` attribute

---

## Related Documentation

- **Newsletter strategy:** `docs/NEWSLETTER_STRATEGY.md`
- **Content status:** `docs/CONTENT_STATUS.md`
- **Content operations:** `docs/CONTENT_OPERATIONS.md`
- **Voice guide:** `docs/VOICE_GUIDE.md`
- **Issue template:** `content/newsletter/TEMPLATE.md`
- **Quality checklist:** `content/newsletter/QUALITY_CHECKLIST.md`
- **n8n workflow:** `docs/n8n-workflows/welcome-sequence-workflow.json`
