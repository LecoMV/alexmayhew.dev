# Social Content: SaaS Architecture Cluster (2 Posts)

---

## Post 15: The Hidden Tax of "We Support Both" (Publish: Sep 22)

**Slug:** `hidden-tax-supporting-both`

### LinkedIn Post 1 (Mon Sep 21)

"We support both" is the most expensive sentence in SaaS architecture.

I've audited 8 SaaS codebases where "we support both MySQL and PostgreSQL" or "we support both AWS and GCP" accounted for 25-40% of total engineering overhead.

The cost isn't visible in sprint planning because it's distributed:

- An extra 30 minutes on every PR review checking both paths
- An extra 2 hours on every deployment verifying both configurations
- An extra week on every security audit
- An extra month on every major feature (dual implementation + dual testing)

The math: supporting two databases creates a 2.3x testing multiplier (not 2x, because some tests are configuration-independent). Add two cloud providers and it's 4.6x.

One client spent $200K/year in engineering overhead maintaining MySQL support for a single $50K/year customer.

The fix isn't always eliminating one option. Sometimes you genuinely need both. The fix is making the decision consciously, quantifying the tax, and choosing "both" only when the business value exceeds the ongoing engineering cost.

Have you quantified the engineering cost of "we support both" in your codebase?

### LinkedIn Post 2 (Tue Sep 22)

The most dangerous "both" isn't technical. It's organizational.

A client's PostgreSQL deployment used Row-Level Security for tenant isolation. Their MongoDB deployment relied on application-level filtering. A bug in the application filter exposed cross-tenant data—but only in the MongoDB configuration.

The vulnerability existed for 8 months. Security testing focused on the PostgreSQL path because that's what the security team knew best. The MongoDB path had different access controls, different encryption configurations, and different vulnerability scanning pipelines.

Every "both" doubles your security audit scope. Two databases means two sets of access controls, two encryption configs, two vulnerability scanning pipelines, two sets of compliance documentation.

The on-call impact: MTTR was 35% longer for issues in the less-used configuration because engineers had less operational muscle memory for it. The on-call engineer at 3 AM needs to know not just "the database is slow" but "the MySQL database is slow and the fix is different than the PostgreSQL fix."

Security alone justifies eliminating "both" in most cases. The reduced attack surface and concentrated expertise outweigh the convenience of optionality.

Which of your "we support both" decisions has the highest security surface area?

### LinkedIn Post 3 (Wed Sep 23)

Where "both" comes from. It's never decided at an architecture meeting. It accumulates.

The customer-driven "both": Your biggest prospect uses MongoDB. Your app runs on PostgreSQL. Sales says "can we support both?" Engineering says "it's just a database adapter." Six months later, the adapter has 47 special cases.

The acquisition "both": Two companies merge. One runs on AWS, the other on GCP. "We'll support both while we migrate." Three years later, both are still supported. The migration never happened.

The team preference "both": Half prefers REST, half prefers GraphQL. "Let's support both." Now every endpoint has two implementations, two doc sets, and two test suites.

The backward compatibility "both": You shipped API v1. Now v2 is better. "We'll support both until customers migrate." V1 is still running five years later with 12% of traffic and 40% of the API-related bugs.

Each one starts with "it's not that much work." Each one becomes a permanent tax. The total across 4-5 accumulated "boths" is 25-40% of engineering capacity.

How many "we support both" decisions has your team accumulated over the past 3 years?

### LinkedIn Post 4 (Thu Sep 24)

The exit strategy for "we support both" determines whether it takes 3 months or 3 years.

The Strangler Fig approach:

Step 1: Stop new development on the deprecated option. All new features only need to work with the chosen option.

Step 2: Migrate existing customers. Provide migration tooling and a timeline. Offer migration support as a service.

Step 3: Set a sunset date. Announce 6-12 months in advance. Stick to it.

Step 4: Remove the code. After sunset, delete the abstraction layer and all configuration-specific code. The code reduction alone improves velocity.

The customer conversation that works: "We're consolidating from two database backends to one. This lets us ship features 30% faster and reduce our security surface area. We'll provide full migration support and a 9-month transition period."

In my experience, 90% of customers accept without pushback when framed as quality and velocity improvement. The 10% who push back are either bluffing (they'll migrate when the deadline arrives) or genuinely locked in (negotiate a custom support contract).

Have you ever successfully eliminated a "both" from your architecture, and how did customers react?

### X Tweet 1 (Tue Sep 22)

"We support both" accounted for 25-40% of engineering overhead across 8 SaaS codebases I've audited. One team spent $200K/year maintaining MySQL support for a single $50K/year customer. Quantify the tax before accepting "both."

### X Tweet 2 (Wed Sep 23)

A client's "we support both" MongoDB path had a cross-tenant data leak for 8 months. Security testing focused on the PostgreSQL path. Every "both" doubles your security audit scope. The reduced attack surface alone justifies elimination.

### X Tweet 3 (Thu Sep 24)

The exit strategy: stop new development on the deprecated option, migrate customers with tooling, set a sunset date, delete the code. 90% of customers accept when you frame it as "ship features 30% faster."

### Dev.to Article

**Title:** The Hidden Tax of "We Support Both"
**Canonical URL:** https://alexmayhew.dev/blog/hidden-tax-supporting-both

Every SaaS team eventually says "we'll support both." Both databases, both cloud providers, both API versions. The hidden cost isn't the initial implementation—it's the permanent engineering tax.

**The Real Costs**

Across 8 SaaS codebases I've audited, "we support both" accounted for 25-40% of total engineering overhead:

| Category       | Impact                                    |
| -------------- | ----------------------------------------- |
| Testing        | 2.3x multiplier (not exactly 2x)          |
| Operations     | 35% longer MTTR for less-used config      |
| Security       | 2x audit scope, 2x attack surface         |
| Cognitive load | Every engineer must understand both paths |

One client spent $200K/year in engineering overhead maintaining MySQL support for a single $50K/year customer.

**Where "Both" Comes From**

It's never a deliberate architecture decision. It accumulates:

- Customer-driven: "Sales says our biggest prospect uses MongoDB"
- Acquisition: "We'll migrate after the merger" (three years ago)
- Team preference: "Half want REST, half want GraphQL"
- Backward compatibility: "V1 still handles 12% of traffic"

**The Decision Framework**

Before accepting "both," calculate:

1. Annual engineering tax (testing, CI, docs, on-call, security, cognitive load)
2. Annual business value (revenue from customers requiring the second option)
3. Compare honestly

**The Exit Strategy**

1. Stop new development on the deprecated option
2. Migrate customers with tooling and a timeline
3. Set and honor a sunset date (6-12 months notice)
4. Delete the code

Frame it to customers: "Consolidating lets us ship features 30% faster." 90% accept without pushback.

Read the full analysis with specific recommendations for common "both" scenarios: https://alexmayhew.dev/blog/hidden-tax-supporting-both

### Newsletter Section

**This Week's Decision: Should You Eliminate a "We Support Both"?**

**Situation:** Your codebase supports both PostgreSQL and MongoDB. The MongoDB path has 47 special cases in the database adapter. Every PR takes an extra 30 minutes to review. The last security audit took twice as long as expected because it had to cover both database configurations.

**Insight:** Across 8 audits, "we support both" accounted for 25-40% of engineering overhead—distributed invisibly across PR reviews, deployments, security audits, and on-call. Quantify the annual engineering tax vs. the annual revenue from customers requiring the second option. One client spent $200K/year maintaining MySQL for a $50K/year customer. The exit strategy: stop new development on the deprecated option, migrate with tooling, set a sunset date. 90% of customers accept when framed as a quality improvement.

**When to Apply:** Any codebase where "both" has accumulated over 2+ years and the engineering overhead is becoming visible.

**When NOT to Apply:** The "both" is a genuine product differentiator (multi-cloud for enterprise), has a defined sunset date, or the abstraction is truly clean and interchangeable.

---

## Post 16: SaaS Billing Architecture with Stripe (Publish: Oct 6)

**Slug:** `saas-billing-stripe-architecture`

### LinkedIn Post 1 (Mon Oct 5)

Billing is the only part of your SaaS where a bug directly costs you money.

An incorrect proration calculation. A missed webhook. A race condition in subscription upgrades. Each one leaks revenue.

I've helped teams recover from billing bugs that cost $10K-100K before detection. The architecture that prevents this: Stripe as the source of truth for subscription state.

The most common mistake: storing subscription state in your database and treating it as authoritative. Your database says the customer is on the Growth plan. Stripe says their payment failed and they're past_due. Your application grants Growth features to a customer who isn't paying.

The correct model: Stripe is authoritative. Your database stores a cache of Stripe state for fast reads. Webhooks keep you in sync. A synced_at column tells you when the row was last updated from Stripe. If it's stale, re-sync.

This sounds like a semantic distinction, but it changes every engineering decision. You never write to your subscription table directly. You always go through Stripe first, then let the webhook update your cache.

Is your database or Stripe the source of truth for subscription state?

### LinkedIn Post 2 (Tue Oct 6)

The subscription lifecycle has 7 states, 12 transitions, and a dozen edge cases. If your webhook handler doesn't cover all of them, you're leaking revenue.

The state machine:

created → trialing → active (trial converts)
created → trialing → past_due (trial expires, payment fails)
active → past_due (renewal payment fails)
past_due → active (retry succeeds)
past_due → canceled (all retries fail)
active → canceled (customer cancels)

Each transition triggers a webhook. Each webhook must be handled idempotently because Stripe may send the same event multiple times.

The idempotency pattern: store processed event IDs. Before processing a webhook, check if the event ID exists in your processed_events table. If it does, return 200 and skip. If it doesn't, process and record.

The critical miss I see in most implementations: customer.subscription.trial_will_end. This webhook fires 3 days before trial expiration. If you don't send a "your trial is ending" email, you lose the conversion opportunity. This single webhook handler difference accounts for 15-25% of trial conversion rates.

Does your webhook handler cover every subscription lifecycle event?

### LinkedIn Post 3 (Wed Oct 7)

The subscription upgrade that gives away $50K/year in free access.

A customer upgrades from Starter ($29/mo) to Growth ($99/mo) on day 15 of their billing cycle. Stripe prorates automatically. But two things can go wrong.

Problem 1: The prorated payment fails because the customer's card is declined. Without payment_behavior: 'error_if_incomplete', Stripe completes the upgrade anyway. The customer gets Growth features for free until the next billing cycle.

Problem 2: You wait for the webhook to update entitlements. The upgrade succeeds at Stripe, but the webhook takes 30 seconds to arrive. During those 30 seconds, the customer sees Starter features on the Growth plan they just paid for. They contact support.

The fix for both: use payment_behavior: 'error_if_incomplete' (upgrade fails if payment fails), and update entitlements immediately after the API call (don't wait for the webhook). The webhook confirms the state later.

For a SaaS with 1,000 customers and 5% monthly upgrade rate, the first bug alone can cost $50K/year in free access.

Have you tested what happens when a subscription upgrade's prorated payment fails?

### LinkedIn Post 4 (Thu Oct 8)

Despite webhooks, billing state drifts. A daily reconciliation job catches the drift before it costs you money.

Webhooks can fail to deliver. Your handler can have a bug that partially processes an event. The customer can update their payment method on Stripe's hosted page (no webhook to your app).

The reconciliation pattern: once daily, compare every active subscription in your database with Stripe's API. If the status, plan, or period dates differ, log a warning and sync from Stripe.

This catches every drift scenario. More importantly, it reveals webhook processing bugs—if reconciliation regularly finds drift for a specific event type, your handler for that event has a bug.

Schedule it for off-peak hours. At 5,000 subscriptions, the full reconciliation takes about 10 minutes (staying under Stripe's rate limits). The cost of the API calls is negligible compared to the revenue leakage it prevents.

The client I helped implement this discovered $8,200/month in revenue leakage from 23 subscriptions that had upgraded on Stripe's billing portal but weren't reflected in the application. Those customers had Growth features locked while paying Growth prices. The support tickets wrote themselves.

Do you reconcile your subscription database with Stripe, and how often?

### X Tweet 1 (Tue Oct 6)

Billing is where a bug directly costs money. The most common: treating your database as source of truth instead of Stripe. Customer's payment fails, your app still grants access. Stripe is authoritative. Your database is a cache.

### X Tweet 2 (Wed Oct 7)

Without payment_behavior: 'error_if_incomplete', a failed prorated payment during upgrade still grants the higher plan. For 1,000 customers with 5% monthly upgrades, that's ~$50K/year in free access. One API parameter.

### X Tweet 3 (Thu Oct 8)

Daily reconciliation between your subscription database and Stripe caught $8,200/month in revenue leakage for a client. 23 subscriptions upgraded on Stripe's portal but not reflected in the app. Webhooks alone aren't enough.

### Dev.to Article

**Title:** SaaS Billing Architecture with Stripe
**Canonical URL:** https://alexmayhew.dev/blog/saas-billing-stripe-architecture

Billing is where architecture decisions have the most direct revenue impact. Here's the Stripe integration architecture that prevents revenue leakage.

**Stripe as Source of Truth**

Your database stores a cache of Stripe state. Stripe is authoritative. Never write to your subscription table directly—go through Stripe's API, let webhooks update your cache. A `synced_at` column tells you when each row was last updated.

**The Webhook State Machine**

Handle every lifecycle event idempotently:

```typescript
// Idempotency: check if already processed
const processed = await db.query("SELECT id FROM processed_events WHERE stripe_event_id = $1", [
	event.id,
]);
if (processed.rowCount > 0) return new Response("Already processed", { status: 200 });
```

Critical events: `customer.subscription.created`, `updated`, `deleted`, `invoice.paid`, `invoice.payment_failed`, and `trial_will_end` (handling this alone improves trial conversion by 15-25%).

**Edge Cases That Leak Revenue**

1. **Upgrade proration failure**: Without `payment_behavior: 'error_if_incomplete'`, a declined card during upgrade still grants the higher plan. $50K/year leakage potential.

2. **Grace period policy**: When payment fails, should the customer keep access? Most B2B SaaS uses a 7-day grace period: full access for 7 days, read-only for days 8-14, locked after day 14.

3. **Reconciliation drift**: Daily comparison between your DB and Stripe catches webhook failures. One client found $8,200/month in revenue leakage from 23 subscriptions that upgraded on Stripe's portal.

**Entitlement Management**

Map plans to capabilities, not plan names. `PLAN_ENTITLEMENTS['price_growth_monthly']` returns features, limits, and rate limits. Never scatter `if (plan === 'enterprise')` through the codebase.

Read the full architecture with metered billing patterns and test strategies: https://alexmayhew.dev/blog/saas-billing-stripe-architecture

### Newsletter Section

**This Week's Decision: How Should You Architect Stripe Billing?**

**Situation:** You're building subscription billing for your SaaS. The team has a basic Stripe Checkout integration but needs to handle upgrades, downgrades, failed payments, and usage-based pricing. Customers are already reporting billing-related issues.

**Insight:** Make Stripe the source of truth—your database caches Stripe state, never the reverse. Handle every webhook event idempotently (store processed event IDs). Two critical fixes: add `payment_behavior: 'error_if_incomplete'` to upgrades (prevents free access on failed proration payments), and implement daily reconciliation between your DB and Stripe (one client found $8,200/month in revenue leakage). Map entitlements to plan capabilities, not plan names—`if (plan === 'enterprise')` scattered through the codebase becomes unmaintainable.

**When to Apply:** Any SaaS with paid subscriptions moving beyond basic Stripe Checkout.

**When NOT to Apply:** Pre-revenue MVPs validating product-market fit (use Stripe Checkout with minimal code) or one-time payment products.
