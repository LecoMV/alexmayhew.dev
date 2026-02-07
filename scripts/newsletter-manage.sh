#!/usr/bin/env bash
set -euo pipefail

# Newsletter Management Script for Listmonk
# Usage: ./scripts/newsletter-manage.sh <command> [args]

LISTMONK_URL="http://localhost:9000"
LISTMONK_PASS=$(pass show claude/listmonk/admin-password)
TEMPLATE_ID=5
LIST_ID=3
ISSUES_DIR="/home/deploy/projects/amdev/alexmayhew-dev/content/newsletter/issues"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

usage() {
  cat <<EOF
${BOLD}Newsletter Management Script${NC}

Usage: $(basename "$0") <command> [args]

Commands:
  create-all         Create draft campaigns for all newsletter issues
  schedule-next      Schedule the next unscheduled draft campaign
  status             List all campaigns with status and dates
  preview <issue>    Preview a newsletter issue (e.g., preview 3)

Examples:
  $(basename "$0") create-all
  $(basename "$0") schedule-next
  $(basename "$0") status
  $(basename "$0") preview 5
EOF
}

# Parse frontmatter from an MDX file
# Usage: parse_frontmatter <file> <key>
parse_frontmatter() {
  local file="$1"
  local key="$2"
  sed -n '/^---$/,/^---$/p' "$file" | grep "^${key}:" | sed "s/^${key}:[[:space:]]*//" | sed 's/^"\(.*\)"$/\1/'
}

# Get body content (everything after second ---)
get_body() {
  local file="$1"
  sed -n '/^---$/,/^---$/!p' "$file" | tail -n +1
}

# API helper
listmonk_api() {
  local method="$1"
  local endpoint="$2"
  shift 2
  curl -s -u "admin:${LISTMONK_PASS}" -X "$method" \
    "${LISTMONK_URL}${endpoint}" \
    -H "Content-Type: application/json" \
    "$@"
}

cmd_create_all() {
  echo -e "${BOLD}Creating draft campaigns from newsletter issues...${NC}\n"

  # Get existing campaigns to check for duplicates
  local existing
  existing=$(listmonk_api GET "/api/campaigns?per_page=all" | jq -r '.data.results[]?.subject // empty')

  local created=0
  local skipped=0

  for file in "${ISSUES_DIR}"/*.mdx; do
    [ -f "$file" ] || continue

    local issue subject title send_date name
    issue=$(parse_frontmatter "$file" "issue")
    subject=$(parse_frontmatter "$file" "subject")
    title=$(parse_frontmatter "$file" "title")
    send_date=$(parse_frontmatter "$file" "sendDate")

    if [ -z "$subject" ] || [ -z "$issue" ]; then
      echo -e "  ${YELLOW}[SKIP]${NC} $(basename "$file") - missing subject or issue number"
      continue
    fi

    # Check if campaign already exists
    if echo "$existing" | grep -qF "$subject"; then
      echo -e "  ${BLUE}[EXISTS]${NC} Issue #${issue} - ${title}"
      ((skipped++))
      continue
    fi

    name="Issue #${issue} - ${title}"
    local send_at="${send_date}T14:00:00Z"

    # Get body content
    local body
    body=$(get_body "$file")

    # Escape body for JSON
    local body_json
    body_json=$(printf '%s' "$body" | jq -Rs .)

    local payload
    payload=$(jq -n \
      --arg name "$name" \
      --arg subject "$subject" \
      --argjson lists "[$LIST_ID]" \
      --argjson template_id "$TEMPLATE_ID" \
      --arg body "$body" \
      --arg send_at "$send_at" \
      '{
        name: $name,
        subject: $subject,
        lists: $lists,
        template_id: $template_id,
        type: "regular",
        content_type: "markdown",
        body: $body,
        send_at: $send_at
      }')

    local response
    response=$(listmonk_api POST "/api/campaigns" -d "$payload")

    local campaign_id
    campaign_id=$(echo "$response" | jq -r '.data.id // empty')

    if [ -n "$campaign_id" ]; then
      echo -e "  ${GREEN}[CREATED]${NC} Issue #${issue} - ${title} (campaign #${campaign_id}, send: ${send_date})"
      ((created++))
    else
      local error
      error=$(echo "$response" | jq -r '.message // "Unknown error"')
      echo -e "  ${RED}[ERROR]${NC} Issue #${issue} - ${title}: ${error}"
    fi
  done

  echo ""
  echo -e "${BOLD}Summary:${NC} ${GREEN}${created} created${NC}, ${BLUE}${skipped} skipped${NC}"
}

cmd_schedule_next() {
  echo -e "${BOLD}Finding next unscheduled draft campaign...${NC}\n"

  local now
  now=$(date -u +%s)
  local week_ahead
  week_ahead=$(date -u -d "+7 days" +%s)

  # Get draft campaigns sorted by send_at
  local campaigns
  campaigns=$(listmonk_api GET "/api/campaigns?status=draft&per_page=all" | \
    jq -r '.data.results[] | select(.send_at != null) | "\(.id)\t\(.name)\t\(.send_at)"' | \
    sort -t$'\t' -k3)

  if [ -z "$campaigns" ]; then
    echo -e "${YELLOW}No draft campaigns with send dates found.${NC}"
    return 0
  fi

  # Find first campaign with future send_at
  local found=false
  while IFS=$'\t' read -r id name send_at; do
    local send_ts
    send_ts=$(date -u -d "$send_at" +%s 2>/dev/null || echo 0)

    if [ "$send_ts" -gt "$now" ]; then
      local send_display
      send_display=$(date -u -d "$send_at" "+%Y-%m-%d %H:%M UTC")

      if [ "$send_ts" -gt "$week_ahead" ]; then
        echo -e "${YELLOW}Next draft: ${name}${NC}"
        echo -e "  Send date: ${send_display}"
        echo -e "  ${YELLOW}Send date is more than 7 days away. Skipping.${NC}"
        return 0
      fi

      echo -e "Campaign: ${BOLD}${name}${NC}"
      echo -e "  ID: ${id}"
      echo -e "  Send date: ${send_display}"
      echo ""
      read -rp "Schedule this campaign? [y/N] " confirm

      if [[ "$confirm" =~ ^[Yy]$ ]]; then
        local response
        response=$(listmonk_api PUT "/api/campaigns/${id}/status" \
          -d '{"status": "scheduled"}')

        local new_status
        new_status=$(echo "$response" | jq -r '.data.status // empty')

        if [ "$new_status" = "scheduled" ]; then
          echo -e "\n${GREEN}Campaign scheduled successfully.${NC}"
        else
          local error
          error=$(echo "$response" | jq -r '.message // "Unknown error"')
          echo -e "\n${RED}Failed to schedule: ${error}${NC}"
        fi
      else
        echo -e "\n${YELLOW}Cancelled.${NC}"
      fi

      found=true
      break
    fi
  done <<< "$campaigns"

  if [ "$found" = false ]; then
    echo -e "${YELLOW}No future draft campaigns found.${NC}"
  fi
}

cmd_status() {
  echo -e "${BOLD}Campaign Status${NC}\n"

  local campaigns
  campaigns=$(listmonk_api GET "/api/campaigns?per_page=all&order_by=created_at&order=desc")

  local count
  count=$(echo "$campaigns" | jq -r '.data.results | length')

  if [ "$count" -eq 0 ]; then
    echo -e "${YELLOW}No campaigns found.${NC}"
    return 0
  fi

  # Print header
  printf "${BOLD}%-5s %-40s %-12s %-20s %s${NC}\n" "ID" "NAME" "STATUS" "SEND DATE" "VIEWS"
  printf "%-5s %-40s %-12s %-20s %s\n" "-----" "----------------------------------------" "------------" "--------------------" "-----"

  echo "$campaigns" | jq -r '.data.results[] | "\(.id)\t\(.name)\t\(.status)\t\(.send_at // "not set")\t\(.views // 0)"' | \
  while IFS=$'\t' read -r id name status send_at views; do
    local color
    case "$status" in
      "running")   color="$GREEN" ;;
      "scheduled") color="$BLUE" ;;
      "draft")     color="$YELLOW" ;;
      "finished")  color="$GREEN" ;;
      "cancelled") color="$RED" ;;
      *)           color="$NC" ;;
    esac

    # Format send_at
    local send_display="not set"
    if [ "$send_at" != "not set" ] && [ "$send_at" != "null" ]; then
      send_display=$(date -u -d "$send_at" "+%Y-%m-%d %H:%M" 2>/dev/null || echo "$send_at")
    fi

    # Truncate name
    local short_name
    short_name=$(echo "$name" | cut -c1-38)

    printf "%-5s %-40s ${color}%-12s${NC} %-20s %s\n" "$id" "$short_name" "$status" "$send_display" "$views"
  done
}

cmd_preview() {
  local issue_num="$1"

  # Pad issue number with leading zeros for file matching
  local padded
  padded=$(printf "%03d" "$issue_num")

  local file
  file=$(find "$ISSUES_DIR" -name "${padded}-*.mdx" -type f | head -1)

  if [ -z "$file" ] || [ ! -f "$file" ]; then
    echo -e "${RED}Issue #${issue_num} not found in ${ISSUES_DIR}${NC}"
    return 1
  fi

  local title subject send_date
  title=$(parse_frontmatter "$file" "title")
  subject=$(parse_frontmatter "$file" "subject")
  send_date=$(parse_frontmatter "$file" "sendDate")

  echo -e "${BOLD}Issue #${issue_num}: ${title}${NC}"
  echo -e "Subject: ${subject}"
  echo -e "Send Date: ${send_date}"
  echo -e "File: ${file}"
  echo ""
  echo "---"
  echo ""

  get_body "$file"
}

# Main
case "${1:-}" in
  create-all)
    cmd_create_all
    ;;
  schedule-next)
    cmd_schedule_next
    ;;
  status)
    cmd_status
    ;;
  preview)
    if [ -z "${2:-}" ]; then
      echo -e "${RED}Usage: $(basename "$0") preview <issue-number>${NC}"
      exit 1
    fi
    cmd_preview "$2"
    ;;
  -h|--help|help)
    usage
    ;;
  *)
    usage
    exit 1
    ;;
esac
