#!/bin/bash
# Schedule all blog content to Postiz for X/Twitter
# Usage: ./scripts/schedule-content.sh [--dry-run]

set -e

API_KEY="89fe6989c73476046100c9b0ffe2522b118ba8a8100b35ef07e919ecebceb6c3"
POSTIZ_URL="https://postiz.alexmayhew.dev/api/public/v1/posts"
BLOG_DIR="/home/deploy/projects/amdev/alexmayhew-dev/content/blog"
OLLAMA_URL="http://localhost:11434/api/generate"

# Integration IDs
TWITTER_ID="cmkxmmwlk0001mj96243heh2y"
# LINKEDIN_ID=""  # Add after connecting in Postiz
# DEVTO_ID=""     # Add after connecting in Postiz

DRY_RUN=false
if [[ "$1" == "--dry-run" ]]; then
    DRY_RUN=true
    echo "=== DRY RUN MODE ==="
fi

# Schedule configuration (start date, times)
START_DATE="2026-01-29"
MORNING_TIME="15:00:00"  # 10 AM ET in UTC
AFTERNOON_TIME="20:00:00"  # 3 PM ET in UTC

# Blog posts to schedule (ordered by priority)
POSTS=(
    "ai-assisted-development-generative-debt"
    "senior-developer-paradox"
    "zero-to-10k-mrr-saas-playbook"
    "boring-technology-wins"
    "anatomy-of-high-precision-saas"
    "multi-tenancy-prisma-rls"
    "technical-hiring-framework"
    "build-vs-buy"
    "optimistic-ui"
    "atmospheric-animations-framer-motion"
    "rsc-edge-death-of-waterfall"
    "tech-stack-capital-allocation"
    "typescript-business-case"
    "lambda-tax-cold-starts"
    "tailwind-vs-component-libraries"
    "nodejs-memory-leaks"
    "designer-developer-handoff"
    "neo-brutalism-developer-guide"
)

generate_twitter_thread() {
    local slug="$1"
    local file="$BLOG_DIR/${slug}.mdx"

    if [[ ! -f "$file" ]]; then
        echo "ERROR: File not found: $file"
        return 1
    fi

    # Extract title and first 100 lines for context
    local title=$(grep -m1 "^title:" "$file" | sed 's/title: *"\(.*\)"/\1/')
    local content=$(head -150 "$file" | tail -+12)  # Skip frontmatter

    # Generate thread via Ollama
    local prompt="You are Alex Mayhew, a Technical Advisor who helps CTOs avoid \$500K architecture mistakes.

Your voice:
- Direct and authoritative—take clear positions
- Specific numbers (40%, 10x, 100k+)—never vague
- Experience-backed (\"I've advised 30+ startups...\")
- Punchy and dense

NEVER use emojis.

<task>Convert this into a Twitter thread of 6-8 tweets</task>

<rules>
- Tweet 1: Standalone hook (contrarian or counterintuitive)
- Tweets 2-6: One insight each, max 270 chars each
- Final tweet: Summary with link to full article
- NO hashtags, NO emojis
- Output as JSON array of strings
</rules>

<input>
Title: $title
URL: https://alexmayhew.dev/blog/$slug

$content
</input>

Output ONLY the JSON array of tweets. No other text."

    local response=$(curl -s "$OLLAMA_URL" -d "{
        \"model\": \"gemma2:9b\",
        \"prompt\": $(echo "$prompt" | jq -Rs .),
        \"stream\": false,
        \"options\": { \"temperature\": 0.6, \"num_predict\": 1000 }
    }" | jq -r '.response')

    echo "$response"
}

schedule_twitter_post() {
    local tweets_json="$1"
    local schedule_date="$2"

    # Convert JSON array to Postiz format
    local value_array=$(echo "$tweets_json" | jq '[.[] | { content: ., image: [] }]')

    local payload=$(jq -n \
        --arg date "$schedule_date" \
        --arg integration_id "$TWITTER_ID" \
        --argjson value "$value_array" \
        '{
            type: "schedule",
            date: $date,
            shortLink: false,
            tags: [],
            posts: [{
                integration: { id: $integration_id },
                value: $value,
                settings: { __type: "x", who_can_reply_post: "everyone" }
            }]
        }')

    if $DRY_RUN; then
        echo "Would schedule for $schedule_date:"
        echo "$payload" | jq '.posts[0].value[0].content'
        return 0
    fi

    curl -s -X POST "$POSTIZ_URL" \
        -H "Authorization: $API_KEY" \
        -H "Content-Type: application/json" \
        -d "$payload"
}

# Calculate schedule dates
calculate_date() {
    local day_offset="$1"
    local time="$2"
    date -d "$START_DATE + $day_offset days $time" -u +"%Y-%m-%dT%H:%M:%SZ"
}

# Main loop
echo "Starting content scheduling..."
echo "================================"

day_offset=0
slot=0  # 0 = morning, 1 = afternoon

for slug in "${POSTS[@]}"; do
    echo ""
    echo "Processing: $slug"

    # Determine schedule time
    if [[ $slot -eq 0 ]]; then
        schedule_time=$(calculate_date $day_offset $MORNING_TIME)
        slot=1
    else
        schedule_time=$(calculate_date $day_offset $AFTERNOON_TIME)
        slot=0
        ((day_offset++))
    fi

    echo "  Schedule time: $schedule_time"

    # Generate content
    echo "  Generating Twitter thread..."
    tweets=$(generate_twitter_thread "$slug")

    if [[ -z "$tweets" ]] || [[ "$tweets" == "null" ]]; then
        echo "  ERROR: Failed to generate content"
        continue
    fi

    # Validate JSON
    if ! echo "$tweets" | jq -e . >/dev/null 2>&1; then
        echo "  ERROR: Invalid JSON response"
        continue
    fi

    # Schedule post
    echo "  Scheduling..."
    result=$(schedule_twitter_post "$tweets" "$schedule_time")

    if $DRY_RUN; then
        echo "  [DRY RUN] Would schedule"
    else
        post_id=$(echo "$result" | jq -r '.[0].postId // empty')
        if [[ -n "$post_id" ]]; then
            echo "  SUCCESS: Scheduled with ID $post_id"
        else
            echo "  ERROR: $result"
        fi
    fi

    # Small delay to avoid rate limiting
    sleep 2
done

echo ""
echo "================================"
echo "Content scheduling complete!"
