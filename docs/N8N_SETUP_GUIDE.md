# n8n Content Repurposing Setup Guide

> **Created:** 2026-01-27
> **Updated:** 2026-01-28 (Research-based best practices)
> **Status:** Ready for setup
> **Container:** Podman at http://localhost:5678

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
         ├──► Ollama: LinkedIn Carousel (parallel)
         │
         ├──► Ollama: Twitter Thread (parallel)
         │
         ├──► Ollama: Dev.to Article (parallel)
         │
         └──► Ollama: Newsletter Section (parallel)
                      │
                      ▼
               Wait For All (Merge)
                      │
                      ▼
               Format Output (Code)
                      │
                      ▼
               Respond to Webhook (JSON)
```

**Key Design Decisions:**

- Uses `responseMode: "responseNode"` for async webhook response
- 4 parallel HTTP requests to Ollama for speed
- Merge node waits for all branches to complete
- "Respond to Webhook" node returns structured JSON

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

### Ollama Connection

The workflow connects to Ollama via:

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
		"linkedin_carousel": "string - 10-12 slides formatted",
		"twitter_thread": "string - 8-10 tweets formatted",
		"newsletter_section": "string - Newsletter excerpt",
		"devto_article": "string - Full Dev.to article with frontmatter"
	}
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

### Ollama Timeout

**Cause:** LLM generation takes too long.

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

### Merge Node Not Waiting

**Cause:** Merge node configuration issue.

**Fix:** The workflow uses `mode: "combine"` with `combinationMode: "multiplex"` which should wait for all inputs. If issues persist, try:

1. Open workflow in n8n UI
2. Click on "Wait For All" node
3. Verify all 4 inputs are connected

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

| Service     | Location                              |
| ----------- | ------------------------------------- |
| n8n API Key | `pass show claude/n8n/api-key`        |
| Groq API    | `pass show claude/groq/api-key`       |
| Buttondown  | `pass show claude/buttondown/api-key` |

---

## Related Files

- Workflow JSON: `docs/n8n-workflows/content-repurposing-workflow.json`
- Voice Guide: `docs/VOICE_GUIDE.md`
- LLM Prompts Reference: `docs/LLM_REPURPOSING_PROMPTS.md`
- Implementation Roadmap: `docs/IMPLEMENTATION_ROADMAP.md`

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

2. **Schedule to Postiz:** Copy generated content to Postiz for scheduling

3. **Add to Buttondown:** Use newsletter section for weekly email

4. **Cross-post to Dev.to:** Paste Dev.to article with canonical URL
