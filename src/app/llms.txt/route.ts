import { blog } from "@/../.source/server";

function getSlug(path: string): string {
	return path.replace(/^\//, "").replace(/\.mdx$/, "");
}

export function GET() {
	const publishedPosts = blog
		.filter((post) => !post.draft)
		.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

	const hubs = publishedPosts.filter((post) => post.isHub);
	const spokes = publishedPosts.filter((post) => !post.isHub);

	const hubLines = hubs
		.map(
			(post) =>
				`- [${post.title}](https://alexmayhew.dev/blog/${getSlug(post.info.path)}): ${post.description}`
		)
		.join("\n");

	const spokeLines = spokes
		.slice(0, 20)
		.map(
			(post) =>
				`- [${post.title}](https://alexmayhew.dev/blog/${getSlug(post.info.path)}): ${post.description}`
		)
		.join("\n");

	const content = `# alexmayhew.dev

> Alex Mayhew is a Technical Advisor and Systems Architect who helps CTOs and startup founders avoid costly architecture mistakes. 15+ years of experience, 30+ startups advised. Content covers SaaS architecture, engineering leadership, frontend architecture, performance engineering, and AI-assisted development.

## Expertise Areas

- SaaS Architecture: Multi-tenancy, database scaling, deployment models, cost optimization from MVP to $1M ARR
- Engineering Leadership: Hiring frameworks, IC-to-lead transitions, fractional CTO guidance, technical debt strategy
- Frontend Architecture: React/Next.js patterns, design systems, performance optimization, edge rendering
- Performance Engineering: Core Web Vitals, database query optimization, CDN strategy, Node.js memory management
- AI-Assisted Development: LLM integration architecture, prompt engineering, AI code review, cost optimization

## Comprehensive Guides (Hub Posts)

${hubLines}

## Recent Articles

${spokeLines}

## Services

- [All Services](https://alexmayhew.dev/services): Full catalog of technical advisory and development services
- [Technical Advisory](https://alexmayhew.dev/services/technical-advisor-for-startups): Strategic architecture guidance for startups
- [Fractional CTO](https://alexmayhew.dev/services/fractional-cto-for-startups): Part-time CTO leadership for early-stage companies
- [Next.js Development](https://alexmayhew.dev/services/nextjs-developer-for-saas): Production SaaS architecture with Next.js
- [AI Integration](https://alexmayhew.dev/services/ai-integration-developer-for-saas): LLM and AI feature development for SaaS

## Service Categories

- [Technology Comparisons](https://alexmayhew.dev/services/comparisons/next-js-vs-remix-for-saas): Side-by-side technology evaluations
- [Legacy Migrations](https://alexmayhew.dev/services/migrations/angularjs-to-nextjs-migration): Modernization from legacy stacks
- [SaaS Integrations](https://alexmayhew.dev/services/integrations/salesforce-stripe-integration): Third-party platform integration

## Technologies

- [React & Next.js](https://alexmayhew.dev/technologies/react-nextjs)
- [Python & FastAPI](https://alexmayhew.dev/technologies/python-fastapi)
- [Node.js & Express](https://alexmayhew.dev/technologies/nodejs-express)
- [AI/ML Integration](https://alexmayhew.dev/technologies/ai-ml-integration)
- [Cloud Architecture](https://alexmayhew.dev/technologies/cloud-architecture)

## For Decision Makers

- [For CTOs](https://alexmayhew.dev/for/cto): Architecture review and scaling strategy
- [For Technical Founders](https://alexmayhew.dev/for/technical-founder): MVP to production guidance
- [For Seed Founders](https://alexmayhew.dev/for/seed-founder): First technical hires and stack decisions
- [For VPs of Engineering](https://alexmayhew.dev/for/vp-engineering): Team scaling and process optimization

## Tools

- [TraceForge](https://alexmayhew.dev/tools/traceforge): SVG trace visualization tool
- [Pilot](https://alexmayhew.dev/tools/pilot): AI-powered code assistant

## Contact

- Website: https://alexmayhew.dev
- Contact: https://alexmayhew.dev/contact
- LinkedIn: https://linkedin.com/in/alexmayhew
- X/Twitter: https://x.com/alexmayhewdev
- RSS: https://alexmayhew.dev/feed.xml
`;

	return new Response(content, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=86400",
		},
	});
}
