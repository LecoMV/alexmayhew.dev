# Buttondown Setup Guide — The Architect's Brief

> Step-by-step configuration for the newsletter system.
> Platform: [Buttondown](https://buttondown.com) (Standard tier, $29/mo)

---

## 1. Account Configuration

### Sending Identity

| Setting         | Value                  |
| --------------- | ---------------------- |
| Newsletter name | The Architect's Brief  |
| Sender name     | Alex Mayhew            |
| Sender email    | alex@alexmayhew.dev    |
| Reply-to        | alex@alexmayhew.dev    |
| Website URL     | https://alexmayhew.dev |

### General Settings

1. **Settings > General:**
   - Enable **Markdown mode**
   - Enable **syntax highlighting** for code blocks
   - Enable **double opt-in** (improves deliverability and list quality)
   - Set timezone to **Eastern (US)**

2. **Settings > Hosting:**
   - Custom domain: configure `newsletter.alexmayhew.dev` (or use Buttondown default)
   - Follow Buttondown's DNS setup instructions for CNAME/DKIM/SPF records

3. **Settings > Subscribing:**
   - Enable double opt-in confirmation
   - Redirect after confirmation: `https://alexmayhew.dev/newsletter/confirmed` (if page exists)

---

## 2. Custom CSS Upload

1. Navigate to **Settings > Design > Custom CSS**
2. Upload the contents of `content/newsletter/buttondown-template.css`
3. Send a test email to verify:
   - Void-navy (`#0B0E14`) background renders correctly
   - Cyber-lime (`#CCF381`) accent links are visible
   - Code blocks show gunmetal-glass (`#1E293B`) background
   - JetBrains Mono renders for inline code (falls back to system monospace)
   - Mobile layout is readable (test on iOS Mail and Gmail app)

### CSS Testing Checklist

- [ ] Dark background renders in Gmail (web and app)
- [ ] Dark background renders in Apple Mail
- [ ] Dark background renders in Outlook (may need fallback)
- [ ] Code blocks have visible borders
- [ ] Links are distinguishable from body text
- [ ] Horizontal rules are subtle but visible
- [ ] Footer text is readable (slate color on dark background)
- [ ] No horizontal scrolling on mobile

---

## 3. API Integration

The website already integrates with Buttondown via a server action.

**Key files:**

- Server action: `src/app/actions/newsletter.ts`
- Component: `src/components/newsletter/newsletter-signup.tsx`

**Environment variable:**

```bash
# Retrieve from credential store
pass show claude/buttondown/api-key

# Set in .env.local (development)
BUTTONDOWN_API_KEY=your-key-here

# Set in Cloudflare Pages (production)
# Dashboard > Settings > Environment Variables
```

**Subscriber metadata sent from website:**

```json
{
	"email_address": "subscriber@example.com",
	"referrer_url": "https://alexmayhew.dev",
	"metadata": {
		"source": "website",
		"subscribed_at": "2026-02-01T12:00:00Z"
	},
	"tags": ["source:website"]
}
```

---

## 4. Welcome Sequence Automation

Requires Buttondown **Standard tier** ($29/mo) for automations.

### Setup Steps

1. Navigate to **Automations > New Automation**
2. Create automation: "Welcome Sequence"
3. Set trigger: **"When a subscriber confirms their subscription"**

### Email Schedule

| Step | Delay       | Email                                                    | File                                                |
| ---- | ----------- | -------------------------------------------------------- | --------------------------------------------------- |
| 1    | Immediately | Welcome to The Architect's Brief                         | `content/newsletter/welcome/01-welcome.md`          |
| 2    | 3 days      | The architecture mistake I see in every early-stage SaaS | `content/newsletter/welcome/02-first-insight.md`    |
| 3    | 7 days      | How I help CTOs make better architecture decisions       | `content/newsletter/welcome/03-how-i-help.md`       |
| 4    | 14 days     | Quick question (2 weeks in)                              | `content/newsletter/welcome/04-engagement-check.md` |
| 5    | 21 days     | The architecture review that saved 6 months              | `content/newsletter/welcome/05-case-study.md`       |

### Creating Each Automation Step

For each email in the sequence:

1. Click **Add Step** in the automation
2. Set the delay (immediately, 3 days, 7 days, 14 days, 21 days)
3. Paste the Markdown content from the corresponding file (everything below the frontmatter `---`)
4. Set the subject line from the frontmatter `subject` field
5. Preview and send a test

### Testing the Welcome Sequence

1. Subscribe with a test email address (use a `+` alias: `alex+test@alexmayhew.dev`)
2. Confirm the double opt-in email
3. Verify Email 1 arrives immediately
4. Advance the automation manually (or wait) to verify each subsequent email
5. Check formatting, links, and rendering on:
   - Gmail (web)
   - Gmail (iOS/Android app)
   - Apple Mail (macOS and iOS)
6. Verify all blog post links resolve correctly

---

## 5. Sending Regular Issues

### Workflow

1. **Draft:** Write or finalize issue in `content/newsletter/issues/NNN-slug.md`
2. **Review:** Run through `content/newsletter/QUALITY_CHECKLIST.md`
3. **Stage:** Copy Markdown content to Buttondown's compose editor
4. **Preview:** Send test email to personal inbox
5. **Verify:** Check rendering on mobile and desktop
6. **Schedule:** Set send time for **Tuesday, 9 AM EST**
7. **Update:** Set frontmatter `status: "sent"` and commit

### Composing in Buttondown

1. Navigate to **Emails > New Email**
2. Set subject line from frontmatter `subject` field
3. Paste the Markdown body (everything below the second `---` in the file)
4. Replace `{first_name}` with Buttondown's personalization tag: `{{ subscriber.metadata.first_name | default: "Hey" }}`
5. Preview the email
6. Send test to personal inbox
7. Schedule for Tuesday 9 AM EST

### Post-Send Checklist

- [ ] Update issue frontmatter `status: "sent"`
- [ ] Commit the status change to git
- [ ] Check Buttondown analytics after 24 hours (open rate, click rate)
- [ ] Reply to any subscriber responses within 24 hours
- [ ] Note any content ideas from replies in the content calendar

---

## 6. Subscriber Management

### Tags

| Tag                | Applied By                | Purpose                               |
| ------------------ | ------------------------- | ------------------------------------- |
| `source:website`   | Server action (automatic) | Subscribers from alexmayhew.dev       |
| `source:blog`      | Server action (automatic) | Subscribers from blog pages           |
| `welcome-complete` | Automation (manual setup) | Finished the 5-email welcome sequence |

### Segmentation

Use tags and engagement data for future segmentation:

- **Engaged:** Opened 3+ of last 5 emails
- **Topic interest:** Based on Email 4 (engagement check) replies
- **Advisory leads:** Replied to Email 3 or Email 5 with interest

---

## 7. Deliverability

### DNS Records

Ensure these are configured for `alexmayhew.dev`:

- **SPF:** Includes Buttondown's sending servers
- **DKIM:** Buttondown-provided DKIM key
- **DMARC:** Policy set (at minimum `p=none` for monitoring)

Follow Buttondown's domain authentication guide for exact values.

### Best Practices

- Double opt-in enabled (already configured)
- Clean list regularly (remove hard bounces)
- Monitor bounce rate (should be under 2%)
- Monitor spam complaint rate (should be under 0.1%)
- Ask subscribers to add `alex@alexmayhew.dev` to contacts (Email 1 does this)

---

## 8. Troubleshooting

### Emails Not Sending

1. Check Buttondown dashboard for error messages
2. Verify API key is valid: `curl -H "Authorization: Token YOUR_KEY" https://api.buttondown.email/v1/subscribers`
3. Check DNS records: `dig TXT alexmayhew.dev`
4. Review Buttondown status page

### Subscribers Not Appearing

1. Double opt-in requires email confirmation — check spam folders
2. Rate limiting in `newsletter.ts` allows 3 attempts per IP per hour
3. Check Buttondown's "Unconfirmed" tab for pending confirmations
4. 409 responses mean already subscribed (handled as success in server action)

### Formatting Issues

1. Re-upload `buttondown-template.css`
2. Check that Markdown mode is enabled
3. Verify code block syntax highlighting is enabled
4. Test in multiple email clients (Gmail, Apple Mail, Outlook)

---

## Related Documentation

- **Newsletter strategy:** `docs/NEWSLETTER_STRATEGY.md`
- **Content calendar:** `docs/NEWSLETTER_CONTENT_CALENDAR.md`
- **Content status:** `docs/CONTENT_STATUS.md`
- **Voice guide:** `docs/VOICE_GUIDE.md`
- **Issue template:** `content/newsletter/TEMPLATE.md`
- **Quality checklist:** `content/newsletter/QUALITY_CHECKLIST.md`

---

_This document covers manual Buttondown configuration. The website integration (server action + component) is already implemented._
