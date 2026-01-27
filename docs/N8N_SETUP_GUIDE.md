# n8n Setup Guide

> **Created:** 2026-01-27
> **Status:** Deployed at http://localhost:5678
> **Container:** Podman

---

## Current Deployment

n8n is running as a Podman container:

```bash
# Check status
podman ps | grep n8n

# View logs
podman logs n8n --tail 50

# Restart
podman restart n8n

# Stop
podman stop n8n

# Start
podman start n8n
```

**Web Interface:** http://localhost:5678

---

## Container Configuration

```bash
podman run -d \
  --name n8n \
  --restart unless-stopped \
  -p 5678:5678 \
  --user root \
  -v /data/n8n:/home/node/.n8n:Z \
  -e N8N_SECURE_COOKIE=false \
  -e GENERIC_TIMEZONE="America/New_York" \
  docker.io/n8nio/n8n:latest
```

**Data Directory:** `/data/n8n`

---

## Importing the Content Repurposing Workflow

1. Open n8n at http://localhost:5678
2. Complete initial setup (create account)
3. Go to **Workflows** → **Import from File**
4. Select `docs/n8n-workflows/content-repurposing-workflow.json`
5. Activate the workflow

---

## Workflow: Blog to Social Content Suite

### Architecture

```
Blog Published (Webhook)
       │
       ├──► Generate LinkedIn Carousel (Ollama/Gemma 2 9B)
       │
       ├──► Generate Twitter Thread (Ollama/Gemma 2 9B)
       │
       └──► Generate Newsletter Section (Ollama/Gemma 2 9B)
              │
              ▼
       Parse LLM Responses
              │
              ▼
       Format Output (JSON)
```

### Webhook Endpoint

After activating, the webhook URL will be:

```
http://localhost:5678/webhook/blog-published
```

### Test the Webhook

```bash
curl -X POST http://localhost:5678/webhook/blog-published \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Why Your SaaS Needs a Monolith First",
    "content": "Your startup does not need Kubernetes. Or microservices. Or a service mesh. What it needs is a well-structured monolith that ships features fast and can be extracted into services later when you actually need to scale. Here is why the boring architecture wins..."
  }'
```

---

## Ollama Connection

The workflow connects to Ollama at:

```
http://host.containers.internal:11434
```

This is the special hostname Podman uses to access the host machine from inside containers.

### Verify Ollama is Accessible

```bash
# From the container
podman exec n8n curl -s http://host.containers.internal:11434/api/tags

# Should list available models including gemma2:9b
```

### If Ollama is Not Accessible

1. Check Ollama is running: `ollama list`
2. Check Ollama is listening on all interfaces:
   ```bash
   # Start Ollama with host binding
   OLLAMA_HOST=0.0.0.0 ollama serve
   ```
3. Or modify `/etc/systemd/system/ollama.service` to set `OLLAMA_HOST=0.0.0.0`

---

## Adding More Integrations

### Notion Integration

1. Create Notion integration at https://www.notion.so/my-integrations
2. Get the API key
3. Add Notion credentials in n8n: **Settings** → **Credentials** → **Add Credential** → **Notion API**
4. Add Notion nodes to save generated content to a database

### Slack Notifications

1. Create Slack app at https://api.slack.com/apps
2. Add OAuth token with `chat:write` scope
3. Add Slack credentials in n8n
4. Add Slack node to send notifications when content is generated

### Buttondown Integration

1. Get API key from Buttondown settings
2. Add HTTP Request node:
   ```
   POST https://api.buttondown.email/v1/drafts
   Headers: Authorization: Token YOUR_API_KEY
   Body: { "subject": "...", "body": "..." }
   ```

---

## Scheduling

To auto-run the repurposing workflow when blog posts are published:

### Option 1: Webhook from CMS

Configure your CMS (Keystatic) to call the webhook when content is published.

### Option 2: RSS Polling

Add a Schedule Trigger + RSS Feed node to poll your blog RSS feed:

```
Cron: 0 */4 * * *  (every 4 hours)
RSS URL: https://alexmayhew.dev/feed.xml
```

---

## Backup

```bash
# Backup n8n data
cp -r /data/n8n /data/n8n-backup-$(date +%Y%m%d)

# Export all workflows via API
curl -X GET http://localhost:5678/api/v1/workflows \
  -H "X-N8N-API-KEY: your-api-key" \
  > n8n-workflows-backup.json
```

---

## Troubleshooting

### Workflow Not Triggering

1. Check workflow is active (toggle in top right)
2. Check webhook URL is correct
3. Test with curl command above

### Ollama Timeout

Increase timeout in HTTP Request node:

```json
{
	"options": {
		"timeout": 180000 // 3 minutes
	}
}
```

### Memory Issues

If n8n runs out of memory:

```bash
podman stop n8n
podman rm n8n

# Restart with memory limit
podman run -d \
  --name n8n \
  --memory 2g \
  ... (rest of options)
```

---

## Environment Variables Reference

| Variable                  | Default | Description             |
| ------------------------- | ------- | ----------------------- |
| `N8N_SECURE_COOKIE`       | true    | Set false for localhost |
| `GENERIC_TIMEZONE`        | UTC     | Timezone for schedules  |
| `N8N_BASIC_AUTH_ACTIVE`   | false   | Enable HTTP basic auth  |
| `N8N_BASIC_AUTH_USER`     | -       | Basic auth username     |
| `N8N_BASIC_AUTH_PASSWORD` | -       | Basic auth password     |
| `WEBHOOK_URL`             | -       | Public webhook URL      |

---

## Related Files

- Workflow JSON: `docs/n8n-workflows/content-repurposing-workflow.json`
- LLM Prompts: `docs/LLM_REPURPOSING_PROMPTS.md`
- Implementation Plan: `docs/IMPLEMENTATION_ROADMAP.md`
