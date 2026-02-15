alexmayhew.dev — Complete Infrastructure Summary

Core Stack  
 ┌────────────────┬─────────────────────────────────┬─────────────────┐  
 │ Layer │ Technology │ Version │
├────────────────┼─────────────────────────────────┼─────────────────┤
│ Framework │ Next.js (App Router) │ 15.5.9 │
├────────────────┼─────────────────────────────────┼─────────────────┤
│ Runtime │ React │ 19.1.4 │
├────────────────┼─────────────────────────────────┼─────────────────┤
│ Language │ TypeScript (strict) │ 5 │
├────────────────┼─────────────────────────────────┼─────────────────┤
│ Styling │ Tailwind CSS │ 4 │
├────────────────┼─────────────────────────────────┼─────────────────┤
│ Animations │ Framer Motion │ 12.26.2 │
├────────────────┼─────────────────────────────────┼─────────────────┤
│ Content │ Fumadocs MDX + Keystatic CMS │ 15.8.5 / 0.5.48 │
├────────────────┼─────────────────────────────────┼─────────────────┤
│ Edge Deploy │ OpenNext → Cloudflare Workers │ 1.14.4 │
├────────────────┼─────────────────────────────────┼─────────────────┤
│ AI Chat │ Qwen 2.5-Coder 32B (Workers AI) │ Latest │
├────────────────┼─────────────────────────────────┼─────────────────┤
│ Error Tracking │ Sentry │ 10.34.0 │
├────────────────┼─────────────────────────────────┼─────────────────┤
│ Testing │ Vitest + Playwright │ 4.0 / 1.57 │
└────────────────┴─────────────────────────────────┴─────────────────┘
Cloudflare Bindings
┌──────────────────────────┬────────────────────┬───────────────────────────┐
│ Binding │ Type │ Purpose │
├──────────────────────────┼────────────────────┼───────────────────────────┤
│ ASSETS │ Static Files │ Compiled Next.js assets │
├──────────────────────────┼────────────────────┼───────────────────────────┤
│ IMAGES │ Image Optimization │ Cloudflare Image Resizing │
├──────────────────────────┼────────────────────┼───────────────────────────┤
│ AI │ Workers AI │ Qwen 2.5-Coder 32B chat │
├──────────────────────────┼────────────────────┼───────────────────────────┤
│ NEXT_INC_CACHE_R2_BUCKET │ R2 Bucket │ ISR cache persistence │
├──────────────────────────┼────────────────────┼───────────────────────────┤
│ WORKER_SELF_REFERENCE │ Service Binding │ Edge caching │
└──────────────────────────┴────────────────────┴───────────────────────────┘
CI/CD Pipeline (GitHub Actions)

4 workflows:

1. ci.yml — lint → typecheck → test → build (on push/PR)
2. deploy.yml — validate → deploy preview (PR) or production (main) → health check → smoke tests → sitemap validation → failure notification
3. e2e.yml — Playwright on Chromium
4. publish-scheduled.yml — Cron Monday 05:00 UTC, auto-publishes up to 2 draft blog posts per run

API Routes
┌─────────────────────┬──────────────────────────────────────────────────────────────┐
│ Route │ Purpose │
├─────────────────────┼──────────────────────────────────────────────────────────────┤
│ GET /api/health │ Deployment liveness (sha, version, timestamp) │
├─────────────────────┼──────────────────────────────────────────────────────────────┤
│ POST /api/chat │ AI chat (rate limited 10/min, 1000 char max, Qwen 2.5-Coder) │
├─────────────────────┼──────────────────────────────────────────────────────────────┤
│ GET /api/geo │ Geolocation via Cloudflare headers │
├─────────────────────┼──────────────────────────────────────────────────────────────┤
│ POST /api/vectorize │ TraceForge file upload proxy │
├─────────────────────┼──────────────────────────────────────────────────────────────┤
│ /api/keystatic/\* │ CMS routing │
└─────────────────────┴──────────────────────────────────────────────────────────────┘
Content Platform Infrastructure

Services
┌───────────────┬──────┬──────────────────────────┬────────────────────────┐
│ Service │ Port │ Container │ Purpose │
├───────────────┼──────┼──────────────────────────┼────────────────────────┤
│ Postiz │ 4007 │ postiz (rootless podman) │ Social scheduling │
├───────────────┼──────┼──────────────────────────┼────────────────────────┤
│ n8n │ 5678 │ n8n (rootless podman) │ Workflow automation │
├───────────────┼──────┼──────────────────────────┼────────────────────────┤
│ Listmonk │ 9000 │ root-level podman │ Newsletter │
├───────────────┼──────┼──────────────────────────┼────────────────────────┤
│ Temporal │ 7233 │ temporal │ Workflow orchestration │
├───────────────┼──────┼──────────────────────────┼────────────────────────┤
│ Temporal UI │ 8081 │ temporal-ui │ Dashboard │
├───────────────┼──────┼──────────────────────────┼────────────────────────┤
│ PostgreSQL │ 5433 │ Host system │ Database │
├───────────────┼──────┼──────────────────────────┼────────────────────────┤
│ Redis │ 6379 │ postiz-redis │ Cache │
├───────────────┼──────┼──────────────────────────┼────────────────────────┤
│ Elasticsearch │ — │ temporal-elasticsearch │ Temporal search │
└───────────────┴──────┴──────────────────────────┴────────────────────────┘
Content Counts
┌──────────────────────┬───────────────────┐
│ Resource │ Count │
├──────────────────────┼───────────────────┤
│ Blog posts (MDX) │ 62 │
├──────────────────────┼───────────────────┤
│ Newsletter issues │ 36 │
├──────────────────────┼───────────────────┤
│ Social content files │ 6 │
├──────────────────────┼───────────────────┤
│ Posts in QUEUE │ 154 │
├──────────────────────┼───────────────────┤
│ Posts PUBLISHED │ 10 │
├──────────────────────┼───────────────────┤
│ Posts in DRAFT │ 18 │
├──────────────────────┼───────────────────┤
│ Posts in ERROR │ 2 (X/Twitter 402) │
└──────────────────────┴───────────────────┘
Monitoring Stack (Systemd Timers)
┌─────────────────────────┬──────────────┬──────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────┐
│ Timer │ Interval │ Script │ Function │
├─────────────────────────┼──────────────┼──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤
│ postiz-watchdog │ 5 min │ postiz-watchdog │ HTTP + containers + Redis + past-due + errors + LinkedIn expiry │
├─────────────────────────┼──────────────┼──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤
│ n8n-healthcheck │ 5 min │ n8n-healthcheck │ Container + API health, auto-restart │
├─────────────────────────┼──────────────┼──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤
│ listmonk-watchdog │ 5 min │ listmonk-watchdog │ HTTP health (can't auto-restart — root container) │
├─────────────────────────┼──────────────┼──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤
│ content-monitor │ 30 min │ content-platform-monitor │ Full platform: 4 services, 6 containers, DB, schedule, dupes, tokens, disk, log rotation │
├─────────────────────────┼──────────────┼──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤
│ content-weekly-reminder │ Mon 8 AM EST │ — │ Weekly status notification │
└─────────────────────────┴──────────────┴──────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────┘
Triple-Layer Safety (Temporal Backlog Protection)

1. postiz-safe-start — ExecStartPre in postiz.service. Drafts all past-due QUEUE posts before Temporal starts.
2. postiz-watchdog — Every 5 min. Auto-drafts posts >30 min past-due.
3. content-platform-monitor — Every 30 min. Auto-drafts posts >10 min past-due.

LLM Pipeline
┌────────────────────┬─────────────────────────────┬─────────────────────────────┐
│ Model │ Provider │ Purpose │
├────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ Llama 3.3 70B │ Groq (free, 14,400 req/day) │ Primary content repurposing │
├────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ Gemma 2 9B │ Ollama (local RTX 3080) │ Fallback │
├────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ Qwen 2.5-Coder 32B │ Cloudflare Workers AI │ Site chat widget │
└────────────────────┴─────────────────────────────┴─────────────────────────────┘
Design System (Neo-Brutalist)
┌───────────────────┬─────────┬───────────────────────────────┐
│ Token │ Value │ Usage │
├───────────────────┼─────────┼───────────────────────────────┤
│ bg-void-navy │ #0B0E14 │ Background (never pure black) │
├───────────────────┼─────────┼───────────────────────────────┤
│ bg-gunmetal-glass │ #1E293B │ Cards, surfaces │
├───────────────────┼─────────┼───────────────────────────────┤
│ text-mist-white │ #E2E8F0 │ Primary text │
├───────────────────┼─────────┼───────────────────────────────┤
│ text-slate-text │ #94A3B8 │ Secondary text │
├───────────────────┼─────────┼───────────────────────────────┤
│ text-cyber-lime │ #CCF381 │ Accents, CTAs │
├───────────────────┼─────────┼───────────────────────────────┤
│ text-burnt-ember │ #FF6B6B │ Errors │
└───────────────────┴─────────┴───────────────────────────────┘
Rules: No shadows, max rounded-md, spring physics only, border border-white/10 for edges. Fonts: Inter (body), JetBrains Mono (headers/code), both self-hosted WOFF2.

Current System Health (2026-02-15)
┌──────────────────┬─────────────────────────────────────┐
│ Check │ Status │
├──────────────────┼─────────────────────────────────────┤
│ All 6 containers │ Running (4 days uptime) │
├──────────────────┼─────────────────────────────────────┤
│ Postiz HTTP │ 307 (healthy) │
├──────────────────┼─────────────────────────────────────┤
│ n8n HTTP │ 200 (healthy) │
├──────────────────┼─────────────────────────────────────┤
│ Listmonk HTTP │ 200 (healthy) │
├──────────────────┼─────────────────────────────────────┤
│ Temporal UI HTTP │ 200 (healthy) │
├──────────────────┼─────────────────────────────────────┤
│ PostgreSQL │ Connected │
├──────────────────┼─────────────────────────────────────┤
│ Disk usage │ 81% (warning threshold) │
├──────────────────┼─────────────────────────────────────┤
│ X/Twitter │ 2 ERROR posts (402 CreditsDepleted) │
├──────────────────┼─────────────────────────────────────┤
│ LinkedIn token │ Valid (expires 2026-03-29) │
└──────────────────┴─────────────────────────────────────┘
Key Scripts
┌──────────────────────────┬───────────────┬─────────────────────────────────────────────────┐
│ Script │ Location │ Purpose │
├──────────────────────────┼───────────────┼─────────────────────────────────────────────────┤
│ content-health.sh │ scripts/ │ Interactive health dashboard │
├──────────────────────────┼───────────────┼─────────────────────────────────────────────────┤
│ newsletter-manage.sh │ scripts/ │ Newsletter lifecycle (create, schedule, status) │
├──────────────────────────┼───────────────┼─────────────────────────────────────────────────┤
│ schedule-content.sh │ scripts/ │ Batch schedule social via Postiz API │
├──────────────────────────┼───────────────┼─────────────────────────────────────────────────┤
│ postiz-safe-start │ ~/.local/bin/ │ Pre-start Temporal safety │
├──────────────────────────┼───────────────┼─────────────────────────────────────────────────┤
│ postiz-watchdog │ ~/.local/bin/ │ 5-min health + self-healing │
├──────────────────────────┼───────────────┼─────────────────────────────────────────────────┤
│ content-platform-monitor │ ~/.local/bin/ │ 30-min comprehensive check │
├──────────────────────────┼───────────────┼─────────────────────────────────────────────────┤
│ n8n-healthcheck │ ~/.local/bin/ │ n8n liveness + auto-restart │
├──────────────────────────┼───────────────┼─────────────────────────────────────────────────┤
│ listmonk-watchdog │ ~/.local/bin/ │ Listmonk HTTP check │
└──────────────────────────┴───────────────┴─────────────────────────────────────────────────┘

---

That's everything — the full site, content platform, monitoring, CI/CD, design system, and current health status.
