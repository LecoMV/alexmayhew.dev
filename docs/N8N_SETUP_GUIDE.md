# n8n Content Repurposing Setup Guide

> **Created:** 2026-01-27
> **Updated:** 2026-02-07 (Groq upgrade, voice validation, newsletter branch)
> **Status:** Active
> **Container:** Podman at http://localhost:5678

## What Changed (2026-02-07)

Major workflow upgrade:

1. **Groq Llama 3.3 70B** replaces Gemma 2 9B as primary LLM (with Ollama fallback)
2. **Voice compliance validation** node checks all output for banned words, emojis, length
3. **Newsletter generation branch** added (4th parallel generation path)
4. Content quality significantly improved (70B model vs 9B)

### Previous Changes (2026-01-28)

The workflow automatically schedules posts to Postiz. When you trigger the webhook, it:

1. Generates LinkedIn, Twitter, Dev.to, and Newsletter content via Groq (Ollama fallback)
2. Validates content against brand voice rules
3. Formats and schedules posts to Postiz
4. Returns a summary including validation results

### Integration IDs (Updated 2026-01-28)

After re-authenticating LinkedIn, the integration IDs are:

- **LinkedIn:** `cmky9rja60001oc82ci8qle6v`
- **Twitter/X:** `cmkxmmwlk0001mj96243heh2y`
- **Dev.to:** `cmky5o54e0001p397fhvbi0pp`

---

## Quick Start

### Step 1: Import the Workflow

1. Open n8n: http://localhost:5678
2. Click **Workflows** in sidebar
3. Click **+** → **Import from File**
4. Select: `docs/n8n-workflows/content-repurposing-workflow.json`

### Step 2: Activate the Workflow

1. Open the imported workflow "Blog to Multi-Platform Content"
2. Click the **Active** toggle in the top-right (turns green)
3. **Important:** The webhook URL is only registered after activation

### Step 3: Get the Production Webhook URL

1. Click on the **Webhook** node (first node)
2. Look for **Production URL** (not Test URL)
3. It will be: `http://localhost:5678/webhook/content-repurpose`

### Step 4: Test the Webhook

```bash
curl -X POST http://localhost:5678/webhook/content-repurpose \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Why Boring Technology Wins",
    "slug": "boring-technology-wins",
    "content": "Segment moved from 140 microservices back to a monolith. Prime Video moved from serverless to monolith with 90% cost reduction. Instagram scaled to 14M users with PostgreSQL and 3 engineers. The pattern: start boring, migrate when you have proof."
  }'
```

Expected response (after 60-120 seconds):

```json
{
	"success": true,
	"title": "Why Boring Technology Wins",
	"generated_at": "2026-01-28T...",
	"content": {
		"linkedin_carousel": "SLIDE 1: Your startup doesn't need microservices...",
		"twitter_thread": "1/ The highest-performing tech companies...",
		"newsletter_section": "## This Week's Decision...",
		"devto_article": "---\ntitle: Why Boring Technology Wins..."
	}
}
```

---

## Workflow Architecture

```
POST /webhook/content-repurpose
         │
         ├──► Groq: LinkedIn Post (parallel)
         │      └─ IF fail → Ollama Fallback: LinkedIn
         │
         ├──► Groq: X/Twitter Tweet (parallel)
         │      └─ IF fail → Ollama Fallback: Twitter
         │
         ├──► Groq: Dev.to Article (parallel)
         │      └─ IF fail → Ollama Fallback: DevTo
         │
         └──► Groq: Newsletter Section (parallel)
                └─ IF fail → Ollama Fallback: Newsletter
                      │
                      ▼
               Wait For All (Merge)
                      │
                      ▼
               Voice Compliance Validation (Code)
               ├─ Banned words check
               ├─ Emoji detection
               ├─ Length validation per platform
               └─ Hashtag detection
                      │
                      ▼
               Prepare Postiz Payloads (Code)
                      │
                      ├──► Schedule LinkedIn (Postiz API)
                      ├──► Schedule X/Twitter (Postiz API)
                      └──► Schedule Dev.to (Postiz API)
                              │
                              ▼
                      Merge Postiz Results
                              │
                              ▼
                      Format Response (Code)
                              │
                              ▼
                      Respond to Webhook (JSON)
```

**Key Design Decisions:**

- Uses `responseMode: "responseNode"` for async webhook response
- **Groq primary, Ollama fallback** — IF nodes route to Ollama on Groq HTTP errors
- 4 parallel generation branches (LinkedIn, X, Dev.to, Newsletter)
- Voice compliance validation catches banned words, emojis, length violations
- Newsletter content returned in response but NOT auto-scheduled (requires manual Listmonk campaign)
- Merge node waits for all branches to complete
- "Respond to Webhook" node returns structured JSON with validation results

---

## Container Configuration

### Current Setup

```bash
# Check status
podman ps | grep n8n

# View logs
podman logs n8n --tail 50

# Restart
podman restart n8n
```

### Groq API Connection (Primary)

The workflow uses Groq's OpenAI-compatible API:

```
https://api.groq.com/openai/v1/chat/completions
```

**Model:** `llama-3.3-70b-versatile`
**Auth:** Bearer token from `pass show claude/groq/api-key`
**Rate limit:** 14,400 requests/day (free tier)

**Verify Groq is accessible:**

```bash
curl -s https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer $(pass show claude/groq/api-key)" | jq '.data[0].id'
```

### Ollama Connection (Fallback)

If Groq returns an error (rate limit, outage), the workflow falls back to Ollama via:

```
http://host.containers.internal:11434
```

This is Podman's special hostname for accessing the host machine.

**Verify Ollama is accessible:**

```bash
podman exec n8n wget -qO- http://host.containers.internal:11434/api/tags | head -1
```

**If Ollama isn't accessible:**

```bash
# Ensure Ollama listens on all interfaces
grep OLLAMA_HOST /etc/systemd/system/ollama.service
# Should show: Environment="OLLAMA_HOST=0.0.0.0"

# If not, add it and restart:
sudo systemctl daemon-reload
sudo systemctl restart ollama
```

### Voice Compliance Validation

A Code node validates all generated content before scheduling:

- **Banned words:** game-changer, revolutionary, cutting-edge, leverage, utilize, delve, landscape, best practices, synergy, perhaps, maybe, might, could potentially, just, simply, easy, straightforward
- **Emoji detection:** Flags any Unicode emoji characters
- **Length checks:** LinkedIn 900-1400 chars, X under 280 chars
- **Hashtag detection:** Flags hashtags on LinkedIn/X (allowed on Dev.to)

Validation results are included in the webhook response. Content is NOT blocked — the caller decides whether to review flagged content.

---

## API Reference

### Webhook Input Schema

```json
{
	"title": "string (required) - Blog post title",
	"slug": "string (optional) - URL slug for Dev.to canonical link",
	"content": "string (required) - Full blog post content in markdown"
}
```

### Response Schema

```json
{
	"success": true,
	"title": "string",
	"generated_at": "ISO 8601 timestamp",
	"content": {
		"linkedin": "string - 1,000-1,300 char text post",
		"twitter": "string - Under 280 char standalone tweet",
		"devto": "string - Full Dev.to article with frontmatter",
		"newsletter": "string - This Week's Decision section"
	},
	"validation": {
		"linkedin": { "valid": true, "issues": [] },
		"twitter": { "valid": true, "issues": [] },
		"devto": { "valid": true, "issues": [] },
		"newsletter": { "valid": true, "issues": [] }
	},
	"postiz": {
		"linkedin": { "scheduled": true, "post_id": "..." },
		"twitter": { "scheduled": true, "post_id": "..." },
		"devto": { "scheduled": true, "post_id": "..." }
	},
	"source": "groq"
}
```

---

## n8n API Access

API key stored in: `pass show claude/n8n/api-key`

### List Workflows

```bash
curl -s http://localhost:5678/api/v1/workflows \
  -H "X-N8N-API-KEY: $(pass show claude/n8n/api-key)" | jq '.data[].name'
```

### Get Workflow Status

```bash
curl -s "http://localhost:5678/api/v1/workflows/{id}" \
  -H "X-N8N-API-KEY: $(pass show claude/n8n/api-key)" | jq '{name, active}'
```

### View Executions

```bash
curl -s "http://localhost:5678/api/v1/executions" \
  -H "X-N8N-API-KEY: $(pass show claude/n8n/api-key)" | jq '.data[:3]'
```

---

## Troubleshooting

### Webhook Returns 404

**Cause:** Workflow not activated or webhook not registered.

**Fix:**

1. Open workflow in n8n UI
2. Ensure Active toggle is ON (green)
3. Click Save if you made changes
4. Try the Production URL (not Test URL)

### Groq API Error / Rate Limit

**Cause:** Groq returns HTTP error (429 rate limit, 500 server error, etc.)

**Behavior:** The IF nodes automatically route to Ollama fallback. Check the `source` field in the response — if it says `"ollama"`, Groq failed.

**Fix:**

- Check Groq API status: `curl -s https://api.groq.com/openai/v1/models -H "Authorization: Bearer $(pass show claude/groq/api-key)"`
- If rate limited, wait or reduce request frequency (free tier: 14,400/day)
- If API key expired, update: `pass edit claude/groq/api-key`

### Ollama Timeout (Fallback)

**Cause:** LLM generation takes too long (only when running as Groq fallback).

**Fix:** Timeout is set to 180 seconds (3 minutes) per request. If still timing out:

- Check Ollama is using GPU: `nvidia-smi`
- Reduce `num_predict` in workflow prompts
- Check Ollama logs: `journalctl -u ollama -f`

### Empty Response from Ollama

**Cause:** Model not loaded or wrong model name.

**Fix:**

```bash
# Verify model exists
ollama list | grep gemma2

# If missing, pull it
ollama pull gemma2:9b
```

### Voice Validation Flagging Everything

**Cause:** Generated content consistently fails voice compliance checks.

**Fix:** Validation results appear in the webhook response under `validation`. Common issues:

- Groq output contains hedging words ("perhaps", "maybe") — check prompts in `docs/LLM_REPURPOSING_PROMPTS.md`
- LinkedIn posts too short (under 900 chars) — increase `max_tokens` in the Groq node
- Content isn't blocked, only flagged — review and edit before scheduling

### Merge Node Not Waiting

**Cause:** Merge node configuration issue.

**Fix:** The workflow uses `mode: "combine"` with `combinationMode: "multiplex"` which should wait for all inputs. If issues persist, try:

1. Open workflow in n8n UI
2. Click on "Wait For All" node
3. Verify all 8 inputs are connected (4 Groq + 4 fallback paths)

---

## Voice Consistency

All prompts in this workflow follow the brand voice from `docs/VOICE_GUIDE.md`:

- Direct and authoritative—no hedging
- Specific numbers (40%, 10x, 100k+)
- Experience-backed claims
- NO emojis (enforced in every prompt)
- Em dashes for emphasis

---

## Credentials Reference

| Service          | Location                                   |
| ---------------- | ------------------------------------------ |
| n8n API Key      | `pass show claude/n8n/api-key`             |
| Groq API         | `pass show claude/groq/api-key`            |
| Listmonk Admin   | `pass show claude/listmonk/admin-password` |
| Postiz API Token | Postiz dashboard > Settings > API          |

---

## Related Files

- Workflow JSON: `docs/n8n-workflows/content-repurposing-workflow.json`
- Voice Guide: `docs/VOICE_GUIDE.md`
- LLM Prompts Reference: `docs/LLM_REPURPOSING_PROMPTS.md`
- Content System Overview: `docs/CONTENT_REPURPOSING_SYSTEM.md`
- LLM Stack Guide: `docs/SELF_HOSTED_LLM_GUIDE.md`
- Implementation Roadmap: `docs/IMPLEMENTATION_ROADMAP.md`
- Claude Config Guide: `docs/CLAUDE_CODE_CONFIG.md`

---

## Next Steps After Setup

1. **Test with a real blog post:**

   ```bash
   # Read a blog post and test
   CONTENT=$(cat content/blog/boring-technology-wins.mdx | tail -n +12)
   curl -X POST http://localhost:5678/webhook/content-repurpose \
     -H "Content-Type: application/json" \
     -d "{\"title\": \"Why Boring Technology Wins\", \"slug\": \"boring-technology-wins\", \"content\": $(echo "$CONTENT" | jq -Rs .)}"
   ```

2. **Verify Groq is primary:** Check the `source` field in the response — should say `"groq"`. If it says `"ollama"`, Groq may be failing.

3. **Check voice validation:** Review the `validation` field. Fix any flagged issues before content goes live.

4. **Newsletter section:** The `content.newsletter` field contains a "This Week's Decision" section. Use it with `scripts/newsletter-manage.sh` or create a Listmonk campaign manually.

5. **Auto-scheduling:** LinkedIn, X, and Dev.to posts are automatically scheduled to Postiz. Newsletter content is NOT auto-scheduled — use `scripts/newsletter-manage.sh schedule-next`.
