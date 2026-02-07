#!/usr/bin/env bash
set -euo pipefail

# Content Health Check Script
# Usage: ./scripts/content-health.sh
# Exit codes: 0 = healthy, 1 = warnings, 2 = critical

LISTMONK_URL="http://localhost:9000"
LISTMONK_PASS=$(pass show claude/listmonk/admin-password 2>/dev/null || echo "")
BLOG_DIR="/home/deploy/projects/amdev/alexmayhew-dev/content/blog"
POSTIZ_DB="PGPASSWORD=postiz_secure_2026 psql -p 5433 -U postiz_user -d postiz_app -h localhost -t -A"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BOLD='\033[1m'
NC='\033[0m'

# Status tracking
WARNINGS=0
CRITICALS=0
ALERT_DETAILS=""

pass_check() {
  echo -e "  ${GREEN}[pass]${NC} $1"
}

warn_check() {
  echo -e "  ${YELLOW}[warn]${NC} $1"
  WARNINGS=$((WARNINGS + 1))
  ALERT_DETAILS="${ALERT_DETAILS}\n[WARN] $1"
}

fail_check() {
  echo -e "  ${RED}[FAIL]${NC} $1"
  CRITICALS=$((CRITICALS + 1))
  ALERT_DETAILS="${ALERT_DETAILS}\n[FAIL] $1"
}

echo -e "${BOLD}Content Health Check — $(date '+%Y-%m-%d %H:%M %Z')${NC}\n"

# ─── 1. Postiz Status ───────────────────────────────────────────────
echo -e "${BOLD}1. Postiz${NC}"

if podman ps --format '{{.Names}}' 2>/dev/null | grep -qi postiz; then
  pass_check "Postiz container running"
else
  fail_check "Postiz container not running"
fi

# Check posts queued in next 7 days
QUEUED_7D=$(eval "$POSTIZ_DB" -c "
  SELECT COUNT(*) FROM posts
  WHERE \"publishDate\" >= NOW()
    AND \"publishDate\" <= NOW() + INTERVAL '7 days'
    AND state = 'queue';
" 2>/dev/null || echo "ERR")

if [ "$QUEUED_7D" = "ERR" ]; then
  warn_check "Could not query Postiz DB"
elif [ "$QUEUED_7D" -gt 0 ]; then
  pass_check "${QUEUED_7D} posts queued in next 7 days"
else
  warn_check "No posts queued in next 7 days"
fi

# ─── 2. Listmonk Status ─────────────────────────────────────────────
echo -e "\n${BOLD}2. Listmonk${NC}"

if podman ps --format '{{.Names}}' 2>/dev/null | grep -qi listmonk; then
  pass_check "Listmonk container running"
else
  fail_check "Listmonk container not running"
fi

# Check for scheduled campaigns in next 7 days
if [ -n "$LISTMONK_PASS" ]; then
  SCHEDULED=$(curl -s -u "admin:${LISTMONK_PASS}" \
    "${LISTMONK_URL}/api/campaigns?status=scheduled&per_page=all" 2>/dev/null | \
    jq -r '.data.results[]? | select(.send_at != null) | .send_at' 2>/dev/null || echo "ERR")

  if [ "$SCHEDULED" = "ERR" ]; then
    warn_check "Could not query Listmonk API"
  else
    NOW_TS=$(date -u +%s)
    WEEK_TS=$(date -u -d "+7 days" +%s)
    UPCOMING=0

    while IFS= read -r send_at; do
      [ -z "$send_at" ] && continue
      SEND_TS=$(date -u -d "$send_at" +%s 2>/dev/null || continue)
      if [ "$SEND_TS" -ge "$NOW_TS" ] && [ "$SEND_TS" -le "$WEEK_TS" ]; then
        UPCOMING=$((UPCOMING + 1))
      fi
    done <<< "$SCHEDULED"

    if [ "$UPCOMING" -gt 0 ]; then
      pass_check "${UPCOMING} newsletter(s) scheduled in next 7 days"
    else
      warn_check "No newsletters scheduled in next 7 days"
    fi
  fi
else
  warn_check "Listmonk password not available (pass not configured)"
fi

# ─── 3. n8n Status ──────────────────────────────────────────────────
echo -e "\n${BOLD}3. n8n${NC}"

if systemctl --user is-active n8n.service &>/dev/null; then
  pass_check "n8n service running"
else
  fail_check "n8n service not running"
fi

# ─── 4. Ollama Status ───────────────────────────────────────────────
echo -e "\n${BOLD}4. Ollama${NC}"

if systemctl is-active ollama.service &>/dev/null; then
  pass_check "Ollama service running"
else
  warn_check "Ollama service not running"
fi

# Check for loaded models
MODELS=$(curl -s http://localhost:11434/api/tags 2>/dev/null | jq -r '.models[]?.name' 2>/dev/null || echo "ERR")
if [ "$MODELS" = "ERR" ] || [ -z "$MODELS" ]; then
  warn_check "No Ollama models found or API unreachable"
else
  MODEL_COUNT=$(echo "$MODELS" | wc -l)
  pass_check "${MODEL_COUNT} model(s) available"
fi

# ─── 5. Blog Publish Check ──────────────────────────────────────────
echo -e "\n${BOLD}5. Blog Publish Check${NC}"

TODAY=$(date -u +%Y-%m-%d)
TODAY_TS=$(date -u -d "$TODAY" +%s)
MISSED=0
MISSED_POSTS=""

for file in "$BLOG_DIR"/*.mdx; do
  [ -f "$file" ] || continue

  if ! grep -q '^draft: true' "$file"; then
    continue
  fi

  POST_DATE=$(sed -n '/^---$/,/^---$/p' "$file" | grep '^date:' | sed 's/^date:[[:space:]]*//' | sed 's/^"\(.*\)"$/\1/')
  [ -z "$POST_DATE" ] && continue

  POST_TS=$(date -u -d "$POST_DATE" +%s 2>/dev/null || continue)

  if [ "$POST_TS" -le "$TODAY_TS" ]; then
    SLUG=$(basename "$file" .mdx)
    MISSED=$((MISSED + 1))
    MISSED_POSTS="${MISSED_POSTS} ${SLUG}(${POST_DATE})"
  fi
done

if [ "$MISSED" -eq 0 ]; then
  pass_check "No missed blog publishes"
else
  warn_check "${MISSED} blog post(s) past due date but still draft:${MISSED_POSTS}"
fi

# ─── 6. Social Gap Check ────────────────────────────────────────────
echo -e "\n${BOLD}6. Social Gap Check (next 14 days)${NC}"

LINKEDIN_GAPS=""
X_GAPS=""

for i in $(seq 0 13); do
  CHECK_DATE=$(date -u -d "+${i} days" +%Y-%m-%d)
  DOW=$(date -u -d "$CHECK_DATE" +%u)

  # LinkedIn: Mon-Thu (1-4)
  if [ "$DOW" -ge 1 ] && [ "$DOW" -le 4 ]; then
    LI_COUNT=$(eval "$POSTIZ_DB" -c "
      SELECT COUNT(*) FROM posts
      WHERE \"publishDate\"::date = '${CHECK_DATE}'
        AND state = 'queue'
        AND content LIKE '%linkedin%';
    " 2>/dev/null || echo "ERR")

    if [ "$LI_COUNT" = "ERR" ]; then
      :  # Skip if DB unreachable (already warned above)
    elif [ "$LI_COUNT" -eq 0 ]; then
      LINKEDIN_GAPS="${LINKEDIN_GAPS} ${CHECK_DATE}"
    fi
  fi

  # X/Twitter: Tue-Thu (2-4)
  if [ "$DOW" -ge 2 ] && [ "$DOW" -le 4 ]; then
    X_COUNT=$(eval "$POSTIZ_DB" -c "
      SELECT COUNT(*) FROM posts
      WHERE \"publishDate\"::date = '${CHECK_DATE}'
        AND state = 'queue'
        AND content LIKE '%x%';
    " 2>/dev/null || echo "ERR")

    if [ "$X_COUNT" = "ERR" ]; then
      :
    elif [ "$X_COUNT" -eq 0 ]; then
      X_GAPS="${X_GAPS} ${CHECK_DATE}"
    fi
  fi
done

if [ -z "$LINKEDIN_GAPS" ]; then
  pass_check "LinkedIn: No gaps in next 14 days"
else
  warn_check "LinkedIn gaps:${LINKEDIN_GAPS}"
fi

if [ -z "$X_GAPS" ]; then
  pass_check "X/Twitter: No gaps in next 14 days"
else
  warn_check "X/Twitter gaps:${X_GAPS}"
fi

# ─── Summary ────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}Summary${NC}"

if [ "$CRITICALS" -gt 0 ]; then
  echo -e "  ${RED}${CRITICALS} critical issue(s)${NC}, ${YELLOW}${WARNINGS} warning(s)${NC}"
elif [ "$WARNINGS" -gt 0 ]; then
  echo -e "  ${YELLOW}${WARNINGS} warning(s)${NC}, no critical issues"
else
  echo -e "  ${GREEN}All checks passed${NC}"
fi

# ─── Send Alert if Issues Found ─────────────────────────────────────
if [ "$CRITICALS" -gt 0 ] && [ -n "$LISTMONK_PASS" ]; then
  echo ""
  echo -e "${BOLD}Sending alert email...${NC}"

  ALERT_BODY="Content Health Check found ${CRITICALS} critical issue(s) and ${WARNINGS} warning(s).\n\nDetails:${ALERT_DETAILS}"

  curl -s -u "admin:${LISTMONK_PASS}" "${LISTMONK_URL}/api/tx" \
    -H "Content-Type: application/json" \
    -d "$(jq -n \
      --arg email "alex@alexmayhew.dev" \
      --argjson template_id "$TEMPLATE_ID" \
      --arg body "$ALERT_BODY" \
      '{
        subscriber_email: $email,
        template_id: $template_id,
        data: {subject: "Content Health Alert", body: $body}
      }')" >/dev/null 2>&1 && \
    echo -e "  ${GREEN}Alert sent to alex@alexmayhew.dev${NC}" || \
    echo -e "  ${RED}Failed to send alert${NC}"
fi

# Exit code
if [ "$CRITICALS" -gt 0 ]; then
  exit 2
elif [ "$WARNINGS" -gt 0 ]; then
  exit 1
else
  exit 0
fi
