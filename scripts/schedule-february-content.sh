#!/bin/bash
# February 2026 Content Schedule for Postiz
# Based on Voice Guide and best practices

API_KEY="89fe6989c73476046100c9b0ffe2522b118ba8a8100b35ef07e919ecebceb6c3"
BASE_URL="https://postiz.alexmayhew.dev/api/public/v1/posts"

# Integration IDs
LINKEDIN_ID="cmky9rja60001oc82ci8qle6v"
TWITTER_ID="cmkxmmwlk0001mj96243heh2y"
DEVTO_ID="cmky5o54e0001p397fhvbi0pp"

schedule_post() {
    local date="$1"
    local platform="$2"
    local content="$3"
    local title="$4"
    local integration_id=""
    local settings=""

    case "$platform" in
        "linkedin")
            integration_id="$LINKEDIN_ID"
            settings='{"__type":"linkedin"}'
            ;;
        "twitter")
            integration_id="$TWITTER_ID"
            settings='{"__type":"x","who_can_reply_post":"everyone"}'
            ;;
        "devto")
            integration_id="$DEVTO_ID"
            settings="{\"__type\":\"devto\",\"title\":\"$title\"}"
            ;;
    esac

    # Escape content for JSON
    escaped_content=$(echo "$content" | jq -Rs .)

    payload=$(cat <<EOF
{
    "type": "schedule",
    "date": "$date",
    "shortLink": false,
    "tags": [],
    "posts": [{
        "integration": {"id": "$integration_id"},
        "value": [{"content": $escaped_content, "image": []}],
        "settings": $settings
    }]
}
EOF
)

    echo "Scheduling $platform post for $date..."
    response=$(curl -s -X POST "$BASE_URL" \
        -H "Authorization: $API_KEY" \
        -H "Content-Type: application/json" \
        -d "$payload")

    if echo "$response" | jq -e '.id' > /dev/null 2>&1; then
        echo "  Success: Post ID $(echo "$response" | jq -r '.id')"
    else
        echo "  Error: $response"
    fi
}

echo "=== February 2026 Content Schedule ==="
echo ""

# WEEK 1: Jan 29 - Feb 2
# Theme: Boring Technology Wins

echo "--- WEEK 1: Boring Technology Wins ---"

# LinkedIn - Wednesday Jan 29, 10 AM EST
schedule_post "2026-01-29T15:00:00.000Z" "linkedin" "Your startup doesn't need Kubernetes.

I know, I know. \"We'll need to scale eventually.\"

Here's what I've seen advising 30+ startups:

→ Instagram scaled to 14M users with 3 engineers on PostgreSQL + Python
→ Shopify ran Rails from day one through IPO
→ Segment moved from 140 microservices back to a monolith
→ Prime Video cut costs 90% moving from serverless to monolith

The pattern is clear: start boring, migrate when you have proof.

The highest-performing companies didn't use cutting-edge tech. They used mature technology extremely well.

Technical debt from \"exciting\" technology kills more startups than scaling limits.

What's the most over-engineered solution you've seen at an early-stage company?

#StartupArchitecture #TechnicalLeadership #SoftwareEngineering #CTO"

# Twitter - Tuesday Jan 28, 10 AM EST
schedule_post "2026-01-28T15:00:00.000Z" "twitter" "Your startup doesn't need Kubernetes.

I've advised 30+ startups. The ones who adopted microservices too early spent 40-60% of year one on infrastructure.

Not features. Infrastructure.

Here's what the highest-performing companies actually used:

Instagram: PostgreSQL + Python → 14M users with 3 engineers
Shopify: Ruby on Rails → From day one through IPO
GitHub: Ruby on Rails → The world's code repository

The pattern: start boring, migrate when you have data proving you need to.

When Postgres fails, Stack Overflow has the answer. When your custom database fails, you're on your own.

Full breakdown with decision framework: https://alexmayhew.dev/blog/boring-technology-wins

Follow for more architecture insights."

# WEEK 2: Feb 3 - Feb 9
# Theme: Senior Developer Paradox

echo ""
echo "--- WEEK 2: Senior Developer Paradox ---"

# LinkedIn - Wednesday Feb 5, 10 AM EST
schedule_post "2026-02-05T15:00:00.000Z" "linkedin" "A \$200/hr senior developer often costs LESS than a \$30/hr junior.

Here's the math nobody runs:

Junior at \$30/hr with 50% rework time = \$60/hr effective
Add management overhead (+25%) = \$75/hr
Add communication latency (+20%) = \$90/hr actual cost

Senior at \$150/hr with 10% rework = \$166/hr effective
Minimal management overhead = \$175/hr actual cost

But the real gap? The bugs that reach production.

A bug costs \$100 to fix during design.
\$1,000 during coding.
\$10,000 in QA.
\$100,000+ in production.

Senior developers don't just write better code. They \"fix\" bugs before writing them.

The CISQ estimates poor software quality costs \$2.41 trillion annually. That's not hourly rate differentials. It's architectural decisions that burden teams for years.

Stop optimizing for hourly rate. Start optimizing for cost per unit of delivered value.

#TechnicalHiring #EngineeringLeadership #StartupHiring #CTO"

# Twitter - Tuesday Feb 4, 10 AM EST
schedule_post "2026-02-04T15:00:00.000Z" "twitter" "A \$200/hr senior developer often costs LESS than a \$30/hr junior.

The math nobody runs:

Junior \$30/hr + 50% rework + 25% management overhead = \$90/hr actual
Senior \$150/hr + 10% rework + 5% overhead = \$175/hr actual

The gap narrows fast. But here's what really matters:

A bug costs:
- \$100 to fix during design
- \$1,000 during coding
- \$10,000 in QA
- \$100,000+ in production

Senior developers \"fix\" bugs before writing them. They've seen these patterns fail.

AI makes this worse, not better. Seniors ship 2.5x more AI-assisted code than juniors. Why? They can validate AI output and spot subtle bugs.

Stop optimizing for hourly rate. Start optimizing for cost per unit of delivered value.

Full breakdown: https://alexmayhew.dev/blog/senior-developer-paradox"

# WEEK 3: Feb 10 - Feb 16
# Theme: Tech Stack as Capital Allocation

echo ""
echo "--- WEEK 3: Tech Stack Capital Allocation ---"

# LinkedIn - Wednesday Feb 12, 10 AM EST
schedule_post "2026-02-12T15:00:00.000Z" "linkedin" "Your tech stack is not an expression of technical preferences.

It's a capital allocation decision.

Labor costs = 50-70% of engineering opex.
Your stack determines your hiring pool.

The Hiring Liquidity Matrix:

JavaScript/TypeScript: Deep pool, 30-40 day time-to-hire, HIGH noise
Rust: Constrained pool, 45-60+ day time-to-hire, LOW noise

Rust developers command \$175K-195K (15-20% premium).

For a Series A with 10 engineers, choosing Rust over Python = \$300K-500K extra annual payroll.

That capital could extend runway by months.

The innovation tokens framework:

→ Spend tokens ONLY on technology that supports your core differentiator
→ When Postgres fails, Stack Overflow has the answer
→ When your six-month-old vector database fails, you're on your own

CFOs evaluate capital assets on TCO, liquidity, and depreciation.

CTOs should evaluate stacks the same way.

What stage is your company? That determines your optimal stack.

#TechnicalStrategy #StartupArchitecture #EngineeringLeadership"

# Twitter - Tuesday Feb 11, 10 AM EST
schedule_post "2026-02-11T15:00:00.000Z" "twitter" "Your tech stack is a capital allocation decision with measurable impact on hiring costs, development velocity, and operational expenses.

Labor costs = 50-70% of engineering opex.

The hiring liquidity matrix matters:

JavaScript: Deep pool, 30-40 days to hire
Rust: Constrained pool, 45-60+ days to hire

But Rust developers command 15-20% salary premium.

10 engineers on Rust vs Python = \$300K-500K extra payroll annually.

The real framework:

Seed stage (0-10 engineers): Optimize for SPEED
- Python/Django, Rails, or Next.js
- Monolith architecture
- PaaS (Vercel, Render)

Growth stage (20-50): Optimize for SCALE
- Add Go/Rust for specific bottlenecks only
- Profile first, optimize second

Stop asking \"what's the best stack?\"

Start asking \"what stack minimizes TCO at our current stage?\"

Full framework: https://alexmayhew.dev/blog/tech-stack-capital-allocation"

# WEEK 4: Feb 17 - Feb 23
# Theme: AI-Assisted Development / Generative Debt

echo ""
echo "--- WEEK 4: AI & Generative Debt ---"

# LinkedIn - Wednesday Feb 19, 10 AM EST
schedule_post "2026-02-19T15:00:00.000Z" "linkedin" "AI accelerates creation by 55%.

AI increases defects by 23.7%.

This is the productivity paradox nobody wants to talk about.

GitClear analyzed 150M+ lines of changed code:

→ Code \"churn\" (rewritten within 2 weeks) is spiking
→ Copy/paste code increased 8% YoY
→ 80% of AI code violated architectural patterns

The uncomfortable truth: AI code is legacy code on day one.

Here's what I've seen:

A junior used Copilot to generate a validation function. The AI suggested a library that sounded reasonable but didn't exist. The junior created a package with that name, implemented stub functions, and moved on.

The code \"worked\" in development. In production, the validation validated nothing. Cleanup took two weeks.

The verification-first workflow:

1. Treat AI code as untrusted input
2. Review AI suggestions like junior developer PRs
3. Verify against YOUR architecture, not training data
4. Test edge cases the AI doesn't know about

AI is a powerful tool. But tools require skill to use safely.

Who's responsible for reviewing AI-generated code on your team?

#AIEngineering #TechnicalDebt #SoftwareDevelopment"

# Twitter - Tuesday Feb 18, 10 AM EST
schedule_post "2026-02-18T15:00:00.000Z" "twitter" "AI accelerates creation by 55%.

AI increases defects by 23.7%.

GitClear found:
- Code churn (rewritten within 2 weeks) is spiking
- Copy/paste code up 8% YoY
- 80% of AI code violated architectural patterns

96% of devs don't trust AI output.
50%+ don't review it carefully.

The verification-first workflow:

1. Treat AI code as untrusted input
2. Review like junior developer PRs
3. Verify against YOUR architecture
4. Test edge cases AI doesn't know

Seniors ship 2.5x more AI-assisted code than juniors.

Not because they use it more. Because they can validate the output.

AI code is legacy code on day one.

Full analysis: https://alexmayhew.dev/blog/ai-assisted-development-generative-debt"

# WEEK 5: Feb 24 - Feb 28
# Theme: Zero to 10K MRR / SaaS Playbook

echo ""
echo "--- WEEK 5: Zero to 10K MRR ---"

# LinkedIn - Wednesday Feb 26, 10 AM EST
schedule_post "2026-02-26T15:00:00.000Z" "linkedin" "I watched a founder spend 3 months setting up Kubernetes before having a single customer.

He had Helm charts. Terraform modules. A CI/CD pipeline that would make FAANG weep.

He also had zero revenue and dwindling runway.

This is the Premature Infrastructure Trap.

Your first \$10K MRR requires customers, not Kubernetes.

The \$0/month launch stack:

→ Database: Neon Postgres (free tier)
→ Backend: Hono on Cloudflare Workers (\$0-5/month)
→ Frontend: Next.js on Vercel (free tier)
→ Auth: Clerk (\$0 to 10K MAU)
→ Payments: Stripe (\$0 until revenue)

Total infrastructure cost at launch: approximately \$0.

Your entire backend can be 50 lines of code. One file. One deployment target. Zero container orchestration.

The architecture that takes you from \$0 to \$10K MRR is fundamentally different from \$100K to \$1M MRR.

Optimizing for the wrong stage is technical debt that manifests as wasted time and burned capital.

What's the most over-engineered MVP you've seen?

#SaaSFounders #StartupArchitecture #BootstrappedSaaS"

# Twitter - Tuesday Feb 25, 10 AM EST
schedule_post "2026-02-25T15:00:00.000Z" "twitter" "Your first \$10K MRR requires customers, not Kubernetes.

I watched a founder spend 3 months on infrastructure before a single customer. Zero revenue. Dwindling runway.

The \$0/month launch stack:

Database: Neon Postgres (free)
Backend: Hono on Cloudflare Workers (\$0-5)
Frontend: Next.js on Vercel (free)
Auth: Clerk (free to 10K MAU)
Payments: Stripe (free until revenue)

Instagram scaled to 14M users with 3 engineers on PostgreSQL + Python.

Shopify ran Rails from day one through IPO.

Your goal at \$0 MRR: validate someone will pay. Every hour on infrastructure is an hour not on customer discovery.

The architecture for \$0→\$10K is different from \$100K→\$1M.

Stop building infrastructure. Start building product.

Full playbook: https://alexmayhew.dev/blog/zero-to-10k-mrr-saas-playbook"

echo ""
echo "=== Scheduling complete ==="
echo "Check Postiz dashboard to verify: https://postiz.alexmayhew.dev"
