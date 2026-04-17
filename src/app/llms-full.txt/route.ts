import { blog } from "@/../.source/server";
import { hubFaqs } from "@/app/blog/[slug]/hub-faqs";
import { glossary } from "@/data/glossary";

/**
 * llms-full.txt: expanded grounding file for LLM-based search agents
 * (Perplexity, ClaudeBot, GPTBot, Google SGE). Mirrors llms.txt structure
 * but includes full FAQ content, glossary definitions, inlined About
 * content, and no slice cap on spoke listings.
 *
 * Runtime note: We avoid reading MDX file bodies at request time to
 * remain edge-compatible. Hub summaries and glossary definitions are
 * imported from TypeScript modules.
 */

function getSlug(path: string): string {
	return path.replace(/^\//, "").replace(/\.mdx$/, "");
}

const SITE_URL = "https://alexmayhew.dev";

const ABOUT_INLINE = `Alex Mayhew is an independent Technical Advisor and Systems Architect with 15+ years of experience shipping production software, advising 30+ startups, and leading engineering teams from seed stage through Series C. The practice is focused on the technical decisions that compound into competitive advantage... or, made badly, into a $500K bill two years later.

Typical engagements fall into three shapes. First: fractional CTO for seed and Series A founders who need senior architectural judgement on part-time hours, not a $400K hire. Second: technical advisor for growth-stage companies hitting the scaling decisions... multi-tenancy, database sharding, microservices, edge rendering... that are expensive to reverse. Third: architecture review and due diligence for VCs, acquirers, and boards evaluating an engineering organisation before a funding event or acquisition.

The technical focus is SaaS: Next.js and React on the frontend, PostgreSQL and Node or Python on the backend, Cloudflare and AWS on the infrastructure. The human focus is the same on every engagement: translate technical reality into decisions a non-technical founder or operator can actually act on.

Based in the UK. Working with founders globally. Direct contact via the contact form or via LinkedIn.`;

const HUB_SUMMARIES: Record<string, string> = {
	"saas-architecture-decision-framework": `Architecture decisions compound. A 2-hour choice at $0 MRR becomes a 6-month migration at $1M ARR. This guide maps critical decisions to revenue milestones:

- Stage 1 ($0 to $10K MRR): Embarrassingly simple stack. PostgreSQL with Row-Level Security from day one, tenant_id column on every table, monolith on Vercel or Cloudflare. $0 to $200 per month of infrastructure.
- Stage 2 ($10K to $100K MRR): Add read replicas before sharding. Add Redis for session and caching. Extract the first background job processor. Still a monolith.
- Stage 3 ($100K to $1M ARR): Evaluate whether organisational scale justifies service extraction... usually not until 15+ engineers. Formalise tenant isolation testing. Move compute closer to users if latency matters.
- Stage 4 ($1M+ ARR): Selective microservices only where team topology demands it. Multi-region if customer geography demands it.

Non-negotiables from day one: RLS multi-tenancy, PostgreSQL, tenant_id on every row, boring technology choices. Reversible decisions can be made fast. Irreversible decisions should be made slowly or deferred until you have data.`,

	"engineering-leadership-founder-to-cto": `The IC-to-tech-lead-to-CTO path is the single most commonly botched engineering transition. This guide covers the full arc:

- The 50% Rule: On promotion to tech lead, at least 50 percent of pre-promotion coding hours must move into review, mentorship, and planning within the first quarter. Teams that skip this quietly stall.
- IC to tech lead: Success is measured by team throughput, not personal commits. The hardest shift is emotional, not tactical.
- Tech lead to engineering manager: Moves from technical multiplication to organisational design. Hiring, performance management, and cross-functional relationships become the job.
- Fractional CTO vs full-time: Under $5M ARR and under 15 engineers, a fractional CTO at 8-20 hours per month ($2K-$8K monthly) beats a $400K full-time hire on every dimension except availability. Full-time becomes necessary when architectural decisions need daily leadership presence.
- Hiring your first five engineers: Generalists, not specialists. Work sample tests over resume screens. Budget $150K-$200K base for a senior in a major market, 60-70 percent of that for fully remote.`,

	"modern-frontend-architecture": `Frontend architecture in 2026 is defined by three shifts: React Server Components went from experimental to default, the Edge became a production deployment target, and design systems stopped being optional. This guide covers:

- RSC in production: Server Components reduce client-side JavaScript by 30-60 percent by rendering data-fetching components on the server. Cannot use hooks, browser APIs, or event handlers... those require Client Components. Use the 'use client' boundary deliberately, not defensively.
- Tailwind vs component libraries: Tailwind for styling, headless primitives (Radix, shadcn) for complex interactive patterns. Custom component libraries are rarely worth building before product-market fit.
- Design tokens: Type-safe tokens in a single source of truth. Theme switching, dark mode, and brand updates become a one-line change. Build this before you have five components, not after you have fifty.
- State management in 2026: Server state goes in the server. Client state goes in React Query or Zustand. Redux is largely obsolete for new projects. URL state belongs in the URL.
- Edge rendering economics: Cold starts exist. Lambda Tax applies. For steady traffic above 10 RPS, a long-running container is often 5-10x cheaper than the equivalent serverless deployment.`,

	"performance-engineering-playbook": `Performance is a business metric, not an engineering metric. This guide covers the levers that actually move Core Web Vitals and user retention:

- Measure before optimising. RUM beats synthetic for user-facing metrics. Establish p50, p75, p99 baselines before shipping optimisations.
- Core Web Vitals 2026: LCP under 2.5s, INP under 200ms, CLS under 0.1. INP replaced FID in March 2024 and is the metric most teams are still failing on.
- Database query optimisation: Indexes are not magic. N+1 queries dominate slow endpoints. EXPLAIN ANALYZE every query over 50ms on production-shaped data.
- Caching strategies: CDN for static, Redis for shared, HTTP for revalidation, service worker for offline. Each layer has a different invalidation cost.
- Real-time monitoring: p99 latency matters more than p50 for user experience. Alert on percentile shifts, not averages.
- Node.js memory leaks: Usually closures over request-scoped data. Heap snapshots at stable load expose them quickly.`,

	"ai-assisted-development-guide": `AI-assisted development in 2026 looks nothing like the marketing. This guide covers what actually works and what silently breaks:

- The METR Paradox: Developers perceive a 20 percent speedup while measurably being 19 percent slower. Measure cycle time on completed work, not developer sentiment.
- Cognitive Debt: AI-generated code ships faster than any team can mentally load. Gap compounds. Pay it down with pair review and architectural justification for every AI-generated change.
- Generative Debt: Technical debt with no architectural intent behind it. Triggers none of the normal code smell signals. Force human-authored justification.
- Vibe Coding Hangover: Velocity triples month one, crashes by month six as incidents mount in code nobody understands. Prevent by maintaining design review discipline.
- Tool selection: Claude Code, Cursor, Copilot. Cost profiles differ by an order of magnitude depending on usage pattern. Audit actual spend at the 90-day mark.
- Testing AI-generated code: AI writes plausible tests, not useful ones. Require failure-mode tests human-authored for any critical path.
- When not to use AI coding: Security-sensitive code, irreversible infrastructure changes, and anything that requires architectural decisions the AI does not have context for.`,
};

function renderFaqBlock(hubSlug: string): string {
	const faqs = hubFaqs[hubSlug];
	if (!faqs) return "";
	return faqs.map((faq) => `**Q: ${faq.question}**\n\nA: ${faq.answer}`).join("\n\n");
}

function renderGlossary(): string {
	return glossary
		.map(
			(entry) =>
				`### ${entry.term}\n\n*${entry.oneLineDefinition}*\n\n${entry.fullDefinition}\n\nCited in: ${entry.citedInPosts
					.map((slug) => `${SITE_URL}/blog/${slug}`)
					.join(", ")}\nFirst used: ${entry.firstUsed}`
		)
		.join("\n\n---\n\n");
}

export function GET() {
	const publishedPosts = blog
		.filter((post) => !post.draft)
		.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

	const hubs = publishedPosts.filter((post) => post.isHub);
	const spokes = publishedPosts.filter((post) => !post.isHub);

	const hubSections = hubs
		.map((post) => {
			const slug = getSlug(post.info.path);
			const summary = HUB_SUMMARIES[slug] ?? post.description;
			const faqBlock = renderFaqBlock(slug);
			return `### ${post.title}

URL: ${SITE_URL}/blog/${slug}
Published: ${post.publishedAt.toISOString().split("T")[0]}
Description: ${post.description}

${summary}

${faqBlock ? `#### Frequently Asked Questions\n\n${faqBlock}` : ""}`.trim();
		})
		.join("\n\n---\n\n");

	const spokeLines = spokes
		.map((post) => {
			const slug = getSlug(post.info.path);
			return `- [${post.title}](${SITE_URL}/blog/${slug}) — ${post.description}`;
		})
		.join("\n");

	const content = `# alexmayhew.dev (full content for LLM grounding)

> Expanded content file for LLM-based search agents. Includes full hub post summaries, all hub FAQ content, the complete glossary of coined terms, and the full About page. The standard index is at ${SITE_URL}/llms.txt.

## About Alex Mayhew

${ABOUT_INLINE}

## Expertise Areas

- SaaS Architecture: Multi-tenancy, database scaling, deployment models, cost optimization from MVP to $1M ARR
- Engineering Leadership: Hiring frameworks, IC-to-lead transitions, fractional CTO guidance, technical debt strategy
- Frontend Architecture: React/Next.js patterns, design systems, performance optimization, edge rendering
- Performance Engineering: Core Web Vitals, database query optimization, CDN strategy, Node.js memory management
- AI-Assisted Development: LLM integration architecture, prompt engineering, AI code review, cost optimization

## Comprehensive Guides (Hub Posts — full summaries and FAQs)

${hubSections}

## All Articles

${spokeLines}

## Glossary (original terms coined on alexmayhew.dev)

${renderGlossary()}

## Services

- [Technical Advisory](${SITE_URL}/services/technical-advisor-for-startups): Strategic architecture guidance for startups
- [Fractional CTO](${SITE_URL}/services/fractional-cto-for-startups): Part-time CTO leadership for early-stage companies
- [Next.js Development](${SITE_URL}/services/nextjs-developer-for-saas): Production SaaS architecture with Next.js
- [AI Integration](${SITE_URL}/services/ai-integration-developer-for-saas): LLM and AI feature development for SaaS
- [All Services](${SITE_URL}/services)

## For Decision Makers

- [For CTOs](${SITE_URL}/for/cto): Architecture review and scaling strategy
- [For Technical Founders](${SITE_URL}/for/technical-founder): MVP to production guidance
- [For Seed Founders](${SITE_URL}/for/seed-founder): First technical hires and stack decisions
- [For VPs of Engineering](${SITE_URL}/for/vp-engineering): Team scaling and process optimization

## Contact

- Website: ${SITE_URL}
- Contact: ${SITE_URL}/contact
- LinkedIn: https://www.linkedin.com/in/alexmmayhew
- X/Twitter: https://x.com/alexmayhewdev
- RSS: ${SITE_URL}/feed.xml
- Glossary: ${SITE_URL}/glossary
`;

	return new Response(content, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=86400, s-maxage=86400",
		},
	});
}
