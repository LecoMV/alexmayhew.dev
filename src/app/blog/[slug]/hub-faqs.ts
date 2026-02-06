/**
 * FAQ data for hub posts — rendered as FAQPage JSON-LD schema.
 * Each key is the blog post slug. Only hub posts need FAQs.
 * Answers are concise (2-4 sentences) for AI citation optimization.
 */
export const hubFaqs: Record<string, { question: string; answer: string }[]> = {
	"saas-architecture-decision-framework": [
		{
			question: "Should my SaaS start with a monolith or microservices?",
			answer:
				"Start with a monolith. At pre-PMF and early growth stages (under $2M ARR), a well-structured monolith lets you iterate 3-5x faster than microservices. The transition point to microservices is typically $5-10M ARR or 15+ engineers, when team coordination costs exceed the overhead of service boundaries.",
		},
		{
			question: "When should a SaaS switch from single-tenant to multi-tenant architecture?",
			answer:
				"Move to multi-tenant when you have 10+ customers and operational overhead of managing separate instances becomes unsustainable. Multi-tenancy with PostgreSQL Row-Level Security (RLS) gives you data isolation at the database level without separate infrastructure per tenant. The migration typically takes 2-4 months for a small team.",
		},
		{
			question: "How much should a startup spend on infrastructure in year one?",
			answer:
				"Most startups overspend on infrastructure by 40-60% in year one. A typical SaaS serving under 10,000 users can run on $200-500/month of cloud infrastructure. The $0 infrastructure stack (Cloudflare Pages, Supabase free tier, Vercel) can handle MVP through first $10K MRR with zero hosting costs.",
		},
		{
			question: "What are the biggest SaaS architecture mistakes that cost startups money?",
			answer:
				"The three most expensive mistakes are: premature microservices (adds 6-12 months of complexity before product-market fit), over-provisioned infrastructure (spending $3,000/month when $300 would suffice), and choosing the wrong database for your access patterns (relational for graph-heavy data, or NoSQL when you need complex joins). Each mistake typically costs $200K-500K in wasted engineering time.",
		},
		{
			question: "How do I choose between building custom features or buying third-party tools?",
			answer:
				"Build what differentiates your product. Buy everything else. Authentication, payments, email, analytics, and monitoring are solved problems with mature vendors. The build-vs-buy calculation changes at scale: a $50/month Stripe fee becomes significant at $1M+ MRR, but building payment processing from scratch before that point wastes 3-6 months of engineering time.",
		},
		{
			question: "What database should I use for a new SaaS product?",
			answer:
				"PostgreSQL covers 90% of SaaS use cases. It handles relational queries, JSON documents, full-text search, and geospatial data in a single database. Add Redis for caching and session management. Only consider specialized databases (MongoDB, DynamoDB, or a graph database) when PostgreSQL demonstrably cannot meet a specific access pattern requirement.",
		},
	],

	"engineering-leadership-founder-to-cto": [
		{
			question: "When should a startup hire its first CTO?",
			answer:
				"Most startups under $5M ARR do not need a full-time CTO. A fractional CTO at 8-20 hours per month ($2,000-$8,000/month) provides strategic guidance without the $315K-595K annual cost of a full-time hire. Hire a full-time CTO when you have 15+ engineers and architectural decisions require daily leadership presence.",
		},
		{
			question: "What is the difference between a fractional CTO and a full-time CTO?",
			answer:
				"A fractional CTO provides strategic architecture guidance, technical due diligence, and team mentorship at 8-20 hours per month. A full-time CTO manages daily engineering operations, hiring, team culture, and long-term technical vision. The fractional model works at pre-Series A when you need experience without the overhead. The full-time model becomes necessary when team size and technical complexity require dedicated leadership.",
		},
		{
			question: "How do I transition from individual contributor to tech lead?",
			answer:
				"The biggest shift is from personal output to team output. Follow the 30/30/30/10 rule: 30% coding, 30% code review and architecture, 30% mentoring and communication, 10% process improvement. The transition typically takes 12-18 months. The hardest part is measuring success by team velocity rather than personal commits.",
		},
		{
			question: "What makes a senior developer actually senior?",
			answer:
				"Senior developers multiply team output rather than just maximizing personal output. They anticipate problems before they become incidents, make decisions that reduce future complexity, and mentor others without being asked. The paradox: the best senior developers often write less code because they spend time preventing unnecessary code from being written.",
		},
		{
			question: "How do I build my first engineering team as a non-technical founder?",
			answer:
				"Start with a strong first hire who can be both architect and builder. Your first 5 engineers should be generalists, not specialists. Use work sample tests (correlation with job performance: r=0.54) instead of resume screens (r=0.18). Budget $150K-200K base salary for your first senior engineer in a major market, or hire remote at 60-70% of that.",
		},
	],

	"modern-frontend-architecture": [
		{
			question: "Should I use React Server Components in production?",
			answer:
				"Yes, if you are on Next.js 14+. React Server Components reduce client-side JavaScript by 30-60% by rendering data-fetching components on the server. They eliminate client-server waterfalls for data loading. The main constraint is that Server Components cannot use hooks, browser APIs, or event handlers — those require Client Components with the 'use client' directive.",
		},
		{
			question: "How do I choose between Tailwind CSS and component libraries?",
			answer:
				"Use Tailwind CSS when you need full design control and have designers creating custom interfaces. Use component libraries (Radix, shadcn/ui) when you need accessible, tested components without building from scratch. The best approach for most teams: Tailwind for styling + headless component libraries (Radix primitives) for complex interactive patterns like modals, dropdowns, and comboboxes.",
		},
		{
			question: "What is a design token system and when do I need one?",
			answer:
				"Design tokens are the single source of truth for visual design decisions: colors, spacing, typography, shadows, and animations stored as platform-agnostic variables. You need a token system when your design starts having inconsistencies across components, or when you have 2+ developers touching UI code. Tokens reduce design debt by making it impossible to use unauthorized values.",
		},
		{
			question: "How do I improve Core Web Vitals for a React application?",
			answer:
				"Focus on the three metrics: LCP (Largest Contentful Paint) under 2.5 seconds, INP (Interaction to Next Paint) under 200ms, and CLS (Cumulative Layout Shift) under 0.1. The highest-impact fixes are: lazy-load below-fold images, use next/image for automatic optimization, code-split routes with dynamic imports, and set explicit dimensions on images and embeds to prevent layout shifts.",
		},
		{
			question: "What is the best state management approach for React in 2026?",
			answer:
				"Server state (TanStack Query or SWR) for API data, URL state for navigation and filters, and minimal client state (Zustand or React Context) for UI-only concerns. Most applications over-use global state. If your data comes from an API, it is server state and should be managed by a server-state library that handles caching, revalidation, and optimistic updates automatically.",
		},
	],

	"performance-engineering-playbook": [
		{
			question: "What is a good Time to First Byte (TTFB) for a web application?",
			answer:
				"Target TTFB under 800ms for a good user experience, under 200ms for excellent. The biggest TTFB improvements come from edge caching (CDN), database query optimization (adding indexes), and reducing server-side computation. Moving static pages to a CDN can reduce TTFB from 500ms to under 50ms globally.",
		},
		{
			question: "How do serverless cold starts affect application performance?",
			answer:
				"Cold starts add 100-500ms latency on the first request after idle periods. Go and Rust functions cold start in approximately 100ms, while Java functions take 1-2 seconds. Mitigation strategies include provisioned concurrency (keeps functions warm), smaller deployment packages, and choosing lightweight runtimes. The 'Lambda Tax' means serverless is not always cheaper than containers for steady-traffic workloads.",
		},
		{
			question: "What CDN caching strategy should I use for a SaaS application?",
			answer:
				"Use a three-tier caching strategy: CDN edge cache for static assets (CSS, JS, images) with long TTLs (1 year with content hashing), short CDN cache for API responses (30-60 seconds with stale-while-revalidate), and application-level cache (Redis) for database query results. This combination typically reduces origin server load by 80-90%.",
		},
		{
			question: "How do I reduce frontend JavaScript bundle size?",
			answer:
				"Start with analysis: run your bundler's analyzer to identify the largest dependencies. The highest-impact techniques are: code splitting by route (dynamic imports), replacing heavy libraries with lighter alternatives (date-fns instead of moment.js saves 60KB), tree-shaking unused exports, and lazy-loading components below the fold. Target under 200KB of JavaScript for initial page load.",
		},
		{
			question: "When is edge computing worth the complexity?",
			answer:
				"Edge computing is worth it when your users are geographically distributed and latency directly impacts revenue. E-commerce sites see 1-2% conversion improvement per 100ms of latency reduction. Edge is not worth it for internal tools, admin panels, or applications where all users are in one region. The complexity cost includes managing distributed state, debugging across regions, and dealing with cold starts at each edge location.",
		},
	],

	"ai-assisted-development-guide": [
		{
			question: "What is generative debt in AI-assisted development?",
			answer:
				"Generative debt is technical debt created when developers accept AI-generated code without fully understanding it. Unlike traditional technical debt (conscious trade-offs), generative debt accumulates invisibly because the code works but nobody on the team understands why. It compounds when AI-generated code calls other AI-generated code, creating layers of opaque logic that become unmaintainable.",
		},
		{
			question: "Can AI replace human code review?",
			answer:
				"AI catches 60-80% of style violations, formatting issues, and common bug patterns. It cannot reliably evaluate architecture decisions, business logic correctness, or security implications that require domain context. The optimal approach: AI handles the first pass (style, patterns, known anti-patterns), freeing senior reviewers to focus exclusively on architecture, business logic, and security.",
		},
		{
			question: "How do I integrate LLMs into a production SaaS product?",
			answer:
				"Start with a retrieval-augmented generation (RAG) architecture: your data stays in a vector database, the LLM generates responses grounded in your specific content. This avoids hallucination on domain-specific questions. Key decisions: choose an embedding model (OpenAI ada-002 or open-source alternatives), a vector store (pgvector for PostgreSQL users, Pinecone for managed), and implement guardrails for output validation.",
		},
		{
			question: "How much does it cost to run AI features in production?",
			answer:
				"LLM API costs range from $0.01 to $0.10 per request depending on model and context length. At 10,000 daily active users making 5 AI requests each, expect $500-5,000/month in API costs. Cost optimization strategies: use smaller models for simple tasks (GPT-4o-mini instead of GPT-4o), cache common responses, batch requests, and truncate context to only relevant information.",
		},
		{
			question: "What AI features do users actually want in SaaS products?",
			answer:
				"Users want AI that saves them time on repetitive tasks, not AI that replaces their judgment. The highest-adoption AI features are: smart search (natural language queries over structured data), content generation drafts (not final versions), anomaly detection (alerting on unusual patterns), and auto-categorization. Features that try to make decisions for users (auto-approve, auto-respond) consistently see low adoption and high churn.",
		},
	],
};
