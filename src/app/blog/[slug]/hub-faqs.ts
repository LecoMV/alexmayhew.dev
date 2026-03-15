/**
 * FAQ data for blog posts — rendered as FAQPage JSON-LD schema.
 * Each key is the blog post slug. Hub posts and high-value spokes get FAQs.
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

	// --- High-value spoke posts ---

	"monolith-first-architecture": [
		{
			question: "How long should a SaaS stay on a monolith before splitting into microservices?",
			answer:
				"Most SaaS products should stay on a monolith until $5-10M ARR or 15+ engineers. The transition trigger is team coordination cost, not technical limits. A well-structured monolith with clear module boundaries can serve millions of users. Premature decomposition adds 6-12 months of distributed systems complexity without proportional benefit.",
		},
		{
			question: "What is a modular monolith and how does it differ from microservices?",
			answer:
				"A modular monolith is a single deployable application with strictly enforced module boundaries — modules communicate through defined interfaces, not direct database access. Unlike microservices, it avoids network latency, distributed transactions, and deployment orchestration. You get most of the organizational benefits of microservices (team autonomy, clear ownership) without the operational overhead.",
		},
		{
			question: "What are the signs that a monolith needs to be broken apart?",
			answer:
				"The three reliable signals are: deployment frequency drops below weekly because changes require full-system testing, two or more teams regularly block each other on the same codebase, and a single module's scaling requirements differ dramatically from the rest (e.g., video processing alongside CRUD operations). If none of these apply, your monolith is fine.",
		},
	],

	"react-server-components-practical-guide": [
		{
			question: "What is the difference between Server Components and Client Components in React?",
			answer:
				"Server Components render on the server and send zero JavaScript to the browser — they can directly access databases, file systems, and APIs. Client Components render on both server (for HTML) and client (for interactivity) and include JavaScript bundles. The rule: use Server Components by default, add 'use client' only when you need hooks, event handlers, or browser APIs.",
		},
		{
			question: "Can Server Components and Client Components be mixed in the same page?",
			answer:
				"Yes. Server Components can render Client Components as children, but Client Components cannot import Server Components directly. The pattern is to pass Server Components as props (children or render props) to Client Components. This lets you keep data-fetching on the server while adding interactivity where needed.",
		},
		{
			question: "Do React Server Components replace API routes?",
			answer:
				"For read operations, yes. Server Components can query databases directly without API endpoints, eliminating client-server waterfalls. For mutations (form submissions, updates), you still need Server Actions or API routes. The net effect is fewer API endpoints, less client-side data fetching code, and simpler architectures for read-heavy applications.",
		},
	],

	"technical-debt-strategy": [
		{
			question: "How do you measure technical debt?",
			answer:
				"Measure technical debt through its impact, not its existence. Track deployment frequency (how often you can ship), change failure rate (what percentage of deployments cause incidents), and time-to-implement for new features versus historical baselines. When a feature that took 2 days a year ago now takes 2 weeks, that delta is the cost of accumulated debt.",
		},
		{
			question: "How much time should engineering teams spend on technical debt?",
			answer:
				"Allocate 15-20% of sprint capacity to debt reduction as a baseline. Teams that allocate 0% slow down by approximately 25% per year as debt compounds. The most effective approach is not dedicated 'tech debt sprints' but embedding debt work into feature development — when you touch a module for a feature, also clean up that module.",
		},
		{
			question: "How do you prioritize which technical debt to pay down first?",
			answer:
				"Prioritize by blast radius multiplied by change frequency. Debt in code that changes weekly costs more than debt in code that hasn't been touched in a year. Map your debt items on a 2x2 matrix: high-change-frequency + high-blast-radius items go first. Debt in stable, rarely-modified code can wait indefinitely — it costs nothing if nobody touches it.",
		},
	],

	"database-query-optimization": [
		{
			question: "How do I find slow database queries in production?",
			answer:
				"Enable pg_stat_statements in PostgreSQL to track all queries with execution times, call counts, and I/O statistics. Sort by total_exec_time (not mean) to find queries that consume the most aggregate resources. A query running 10,000 times at 50ms each costs more than a query running once at 5 seconds. Use EXPLAIN ANALYZE on the top offenders to see their execution plans.",
		},
		{
			question: "When should I add a database index?",
			answer:
				"Add an index when a query scans more than 5-10% of a table's rows to return its results (visible in EXPLAIN as sequential scans on large tables). Focus on columns used in WHERE clauses, JOIN conditions, and ORDER BY. Every index speeds up reads but slows down writes — on write-heavy tables, only index columns that appear in your most frequent queries.",
		},
		{
			question: "What is the N+1 query problem and how do I fix it?",
			answer:
				"The N+1 problem occurs when code fetches a list of N items, then makes one additional query per item to load related data — resulting in N+1 total queries instead of 2. Fix it by using JOINs or batch loading (WHERE id IN (...)) to fetch related data in a single query. ORMs often hide N+1 problems behind lazy loading — use query logging to detect them.",
		},
	],

	"typescript-business-case": [
		{
			question: "Is TypeScript worth the overhead for a startup?",
			answer:
				"Yes. TypeScript adds approximately 10-15% more code volume but reduces production bugs by 15-25% according to studies of open-source projects. For startups, the real value is faster onboarding (types are documentation), safer refactoring (the compiler catches breaking changes), and better IDE support (autocomplete reduces context-switching to documentation).",
		},
		{
			question: "How long does it take to migrate from JavaScript to TypeScript?",
			answer:
				"A gradual migration takes 2-6 months for a medium-sized codebase (50K-200K lines). Start by renaming .js files to .ts with strict mode disabled, then incrementally add types to files as you modify them. The key insight: you don't need to migrate everything at once. TypeScript's allowJs flag lets JavaScript and TypeScript coexist indefinitely.",
		},
		{
			question: "What TypeScript features should every developer know?",
			answer:
				"Focus on five features: union types for modeling states (type Status = 'loading' | 'success' | 'error'), generics for reusable utilities, discriminated unions for type-safe branching, utility types (Pick, Omit, Partial), and type narrowing with typeof/instanceof guards. These cover 90% of real-world TypeScript usage. Avoid overusing advanced features like conditional types and template literal types — they hurt readability.",
		},
	],

	"metr-paradox-ai-productivity": [
		{
			question: "What did the METR study find about AI and developer productivity?",
			answer:
				"The METR randomized controlled trial (n=16, 246 tasks) found that experienced open-source developers completed tasks 19% slower when using AI tools, while believing they were 24% faster. The 43-percentage-point perception gap means teams cannot self-correct — engineers genuinely feel more productive while delivering less.",
		},
		{
			question: "Why does AI make experienced developers slower?",
			answer:
				"The METR study tested experienced developers on their own mature codebases. Three likely mechanisms: context switching between coding and AI interaction fragments deep work, verification overhead from reviewing AI suggestions exceeds the time saved, and hallucinated solutions create false starts that waste time on dead-end approaches.",
		},
		{
			question: "Does the METR study mean AI coding tools are useless?",
			answer:
				"No. The METR study tested complex tasks in mature codebases — the hardest scenario. AI tools demonstrably accelerate short, well-scoped tasks: boilerplate generation, test scaffolding, documentation, and greenfield exploration. The pattern: AI excels where the 'what' is defined and the 'why' doesn't require deep codebase knowledge.",
		},
	],

	"cognitive-debt-ai-teams": [
		{
			question: "What is cognitive debt in AI-assisted development?",
			answer:
				"Cognitive debt is the gap between what a codebase does and what the team understands about why it does it. Unlike technical debt (a conscious trade-off), cognitive debt accumulates invisibly when engineers accept AI-generated code without fully understanding its logic. It compounds faster than technical debt because it erodes the team's capacity to make architectural decisions, debug production incidents, and onboard new engineers.",
		},
		{
			question: "How do you measure cognitive debt?",
			answer:
				"Five signals indicate cognitive debt accumulation: (1) time to explain a module exceeds time to rewrite it, (2) PR reviews default to 'LGTM' on AI-generated code, (3) incident investigation takes 3x longer because nobody understands the flow, (4) refactoring declines — GitClear measured a 60% decline in refactored code from 2021 to 2024, (5) architecture decisions default to 'whatever AI suggests' rather than intentional design.",
		},
		{
			question: "Is cognitive debt the same as technical debt?",
			answer:
				"No. Technical debt is a conscious trade-off — you know you're cutting corners and plan to pay it back. Cognitive debt is invisible — the code works, passes tests, and looks professional, but nobody on the team understands why it works. Technical debt costs time to fix. Cognitive debt costs the ability to know what needs fixing. The second is categorically more dangerous.",
		},
	],

	"production-mcp-servers": [
		{
			question: "What is MCP and why does it matter for AI development?",
			answer:
				"MCP (Model Context Protocol) is the open standard for connecting AI models to external tools and data sources. It has 97M+ monthly SDK downloads and is backed by Anthropic, OpenAI, Google, and Microsoft. MCP won the integration standard war — no serious competing standard exists. It matters because it defines how AI agents interact with your codebase, databases, APIs, and infrastructure.",
		},
		{
			question: "What are the biggest security risks with MCP servers?",
			answer:
				"The three most critical risks are tool poisoning (malicious servers embed hidden instructions in tool descriptions that are visible to AI but invisible to users), indirect prompt injection (attackers embed instructions in external content like GitHub issues that get processed through MCP), and supply chain compromise (43 agent framework components identified with embedded vulnerabilities in November 2026). The Invariant Labs exploit demonstrated real data exfiltration through a GitHub MCP server.",
		},
		{
			question: "How do I secure a production MCP server?",
			answer:
				"Start with five non-negotiable controls: authentication on every tool call (not just the connection), input validation and sanitization for all tool parameters, rate limiting per client and per tool, structured logging with audit trails for every operation, and tool description integrity checks to prevent poisoning. Most community MCP servers skip all five, which is why 8,600 servers exist but few are production-ready.",
		},
	],

	"when-not-to-use-ai-coding": [
		{
			question: "When does AI coding actually slow developers down?",
			answer:
				"The METR randomized controlled trial (n=16, 246 tasks) found experienced developers were 19% slower on complex tasks in mature codebases when using AI tools. AI slows you down on security-critical code paths, cross-module refactoring, debugging in mature codebases, performance-critical hot paths, compliance-regulated code, and architectural decisions. The pattern: AI hurts most when deep codebase knowledge matters more than code generation speed.",
		},
		{
			question: "What coding tasks are best suited for AI assistance?",
			answer:
				"AI demonstrably accelerates five task categories: boilerplate generation (CRUD endpoints, data models, configuration files), test scaffolding (unit test structure, mock setup, assertion patterns), documentation (inline comments, API docs, README updates), greenfield exploration (prototyping, proof-of-concept work), and code explanation (understanding unfamiliar codebases). The common thread is that these tasks have well-defined patterns where the 'what' is clear.",
		},
		{
			question: "How do I decide whether to use AI for a specific task?",
			answer:
				"Use the two-axis framework: task complexity (simple, moderate, complex) crossed with codebase familiarity (greenfield, known patterns, deep institutional knowledge). AI delivers positive ROI in the simple-to-moderate complexity range on greenfield or pattern-matching work. It delivers negative ROI on complex tasks in codebases with deep institutional knowledge. 66% of developers report spending more time fixing AI code than expected, confirming the mismatch on complex tasks.",
		},
	],

	"ai-technical-debt-bomb": [
		{
			question: "How much technical debt does AI-generated code create?",
			answer:
				"Industry projections estimate $1.5T in accumulated AI-generated technical debt by 2027. GitClear's analysis of 211M lines found refactoring declined 60% (from 25% of changes in 2021 to under 10% in 2024), while copy-paste code increased 8x. Year 2 maintenance costs for unmanaged AI-generated code run 4x higher than traditional code. Forrester predicts 75% of technology decision-makers will face moderate-to-severe AI-generated tech debt by 2026.",
		},
		{
			question: "How is AI technical debt different from regular technical debt?",
			answer:
				"Traditional technical debt is a conscious trade-off with known costs. AI technical debt is invisible — it accumulates when developers accept AI-generated code without understanding it, creating code that works but nobody can maintain. AI debt has three unique components: comprehension debt (nobody understands why the code works), duplication debt (8x increase in copy-paste code), and architectural drift (locally optimal AI suggestions that don't compose into a coherent system).",
		},
		{
			question: "How do I audit my codebase for AI-generated technical debt?",
			answer:
				"Track four metrics: code duplication rate (GitClear-style analysis of copy-paste blocks exceeding 5 lines), refactoring rate (percentage of commits that improve existing code without changing behavior — healthy is 15-25%), churn rate (code rewritten within 14 days of commit), and comprehension ratio (time to explain a module vs time to rewrite it). If duplication is rising, refactoring is declining, and churn exceeds 15%, AI debt is accumulating faster than your team can manage.",
		},
	],

	"agentic-engineering": [
		{
			question: "What is agentic engineering?",
			answer:
				"Agentic engineering is the management discipline of directing AI agents to write code rather than writing it directly. It changes sprint structure (velocity metrics no longer measure what matters), code ownership (git blame becomes meaningless when agents write the code), code review (PR review time increased 91% with AI tools), and hiring criteria (orchestration skill matters more than typing speed). Staff+ engineers lead adoption at 63.5% because the skill is architectural judgment, not code generation.",
		},
		{
			question: "Which AI coding tools are leading in 2026?",
			answer:
				"Claude Code is the #1 AI coding tool, jumping from 4% to 63% adoption in 8 months since May 2025 (Pragmatic Engineer survey, n=906). Cursor is growing 35% over 9 months. GitHub Copilot dominates large enterprises (56% at 10K+ employees) through Microsoft bundling, not developer preference. At startups: 75% use Claude Code, 42% Cursor, 35% Copilot. 95% of developers use AI tools weekly, and 55% regularly use AI agents.",
		},
		{
			question: "How do you measure productivity in an agentic engineering team?",
			answer:
				"Traditional metrics (lines of code, commits, PRs merged) are meaningless when agents generate the code. Measure instead: decision quality (architecture decisions that hold up under review), comprehension depth (can the team explain the code the agents wrote?), incident resolution speed (MTTU as proxy for system understanding), and review effectiveness (bugs caught per review hour). The goal is measuring engineering judgment, not output volume.",
		},
	],

	"ai-tdd-non-deterministic-code": [
		{
			question: "Why does TDD matter more with AI-generated code?",
			answer:
				"AI-generated tests tend to test implementation, not intent — they pass when the bug exists in both the code and the test. 50% of QA leaders cite maintenance burden and flaky scripts as the primary AI testing challenge (World Quality Report 2025-26). TDD inverts the problem: the human defines intent through a failing test, the AI implements to pass it, and the human reviews the result. This constrains AI output to verifiable behavior rather than letting it generate both the code and its own validation.",
		},
		{
			question: "What is the RED-GREEN-REFACTOR pattern for AI-assisted development?",
			answer:
				"RED: the human writes a failing test that precisely defines the intended behavior. GREEN: the AI implements code to pass that test, constrained by the test specification. REFACTOR: the human reviews the AI output for DRY violations, security issues, and maintainability concerns. This pattern produces measurably better AI-assisted code because the test acts as a contract — the AI can't silently introduce bugs that the test doesn't cover.",
		},
		{
			question: "How do you test non-deterministic AI output?",
			answer:
				"Three patterns work for non-deterministic systems: property-based testing (assert invariants that must hold regardless of specific output — response is valid JSON, contains required fields, stays within length bounds), golden dataset testing (curate input-output pairs representing expected behavior and test against them with similarity thresholds), and eval suites (structured scoring of AI output across dimensions like accuracy, relevance, and safety with pass/fail thresholds per dimension).",
		},
	],

	"ai-security-red-team-playbook": [
		{
			question: "What are the main security threats from AI coding tools?",
			answer:
				"Seven confirmed production attack vectors: prompt injection (direct and indirect), tool poisoning (hidden instructions in MCP tool descriptions), indirect prompt injection (via external content like GitHub issues), memory poisoning (corrupting RAG data sources), supply chain compromise (43 agent framework components with embedded vulnerabilities), AI-generated vulnerable code (45% of samples contain security issues, +322% more than human code), and agentic AI as insider threat (agents with broad permissions can access and exfiltrate data).",
		},
		{
			question: "How do I red team an AI-augmented system?",
			answer:
				"Test each of the seven attack vectors systematically: inject adversarial instructions in all user-controlled inputs, audit MCP tool descriptions for hidden instructions, test whether external content (issues, emails, documents) can influence agent behavior, verify RAG data sources can't be poisoned, audit all AI framework dependencies for supply chain risks, scan AI-generated code with SAST tools before merge, and verify agent permissions follow least-privilege principles. Document findings in a threat model specific to your AI architecture.",
		},
		{
			question: "What is tool poisoning in MCP and how do I prevent it?",
			answer:
				"Tool poisoning occurs when a malicious MCP server embeds hidden instructions in tool descriptions that are visible to the AI model but invisible to users. Real example: a 'random fact of the day' MCP tool secretly exfiltrated WhatsApp history by embedding exfiltration instructions in the tool description. Prevention requires tool description integrity verification, allowlisting approved MCP servers, monitoring tool behavior for unexpected data access patterns, and sandboxing MCP server execution.",
		},
	],

	"claude-code-vs-cursor-cost-analysis": [
		{
			question: "How much does Claude Code vs Cursor cost for a 10-person team?",
			answer:
				"Monthly licensing: Cursor Business costs $400/month (10 seats at $40/seat). Claude Code at Max 5x tier costs ~$1,000/month (10 seats at $100/seat). But licensing is only 30-40% of total cost. Token overages for heavy agentic use add $500-2,000/month. Workflow adoption costs 2-5 engineer-days per person. The 90-day total cost of ownership ranges from $5,000-8,000 for Cursor to $12,000-20,000 for Claude Code at the Max tier.",
		},
		{
			question: "Should I choose Claude Code or Cursor for my engineering team?",
			answer:
				"It depends on team composition and work patterns. Cursor suits junior-to-mid teams doing IDE-centric work — it's visual, guided, and has a gentler learning curve. Claude Code suits senior-heavy teams doing complex, multi-file, agentic work — it's CLI-first, autonomous, and optimized for architectural tasks. At enterprise scale (10K+ employees), GitHub Copilot often wins through Microsoft procurement bundling regardless of feature comparison.",
		},
		{
			question: "What are the hidden costs of AI coding tools?",
			answer:
				"Four hidden costs that don't appear in pricing pages: token overages (agentic usage multiplies base subscription costs 2-5x for heavy users), training and adoption time (2-5 engineer-days per person to become proficient), workflow disruption during transition (measured in sprint velocity dips of 10-20% for 2-4 weeks), and the review burden (PR review time increased 91% with AI tools, meaning more code requires proportionally more human review capacity).",
		},
	],

	"vibe-coding-hangover-recovery": [
		{
			question: "What is the vibe coding hangover?",
			answer:
				"The vibe coding hangover is what happens 6-12 months after a product is built primarily with AI assistance without adequate human comprehension of the generated code. Symptoms include: nobody can explain the auth flow, incident investigation takes 3x longer than expected, new hires take 2x longer to onboard, and refactoring attempts introduce more bugs than they fix. 89% of CTOs report production disasters from AI-generated code, and Year 2 maintenance costs run 4x traditional levels.",
		},
		{
			question: "How do I assess the severity of AI-generated code problems in my codebase?",
			answer:
				"Use a four-tier severity model. Severity 1: critical paths nobody understands (auth, billing, data pipelines) — immediate triage required. Severity 2: core business logic with no documentation or design rationale — address within 30 days. Severity 3: non-critical features with high complexity — schedule for quarterly remediation. Severity 4: internal tooling with single maintainer — lowest priority. Map every module to a severity tier and address them in order.",
		},
		{
			question: "Should I rewrite my vibe-coded codebase or try to fix it?",
			answer:
				"Apply the 50% rule: if more than 50% of modules are Severity 1 or 2, a phased rewrite of critical paths is more cost-effective than remediation. If under 50%, targeted remediation works — start with comprehension sprints (not refactoring sprints), create Architecture Decision Records for every module, and establish ownership transfer protocols. The rewrite threshold also depends on team turnover: if the original team has left, remediation costs approach rewrite costs because nobody holds any mental model.",
		},
	],

	"hiring-ai-engineers": [
		{
			question: "What skills should I look for when hiring AI engineers?",
			answer:
				"Most companies need AI-augmented engineers (engineers who use AI tools effectively), not ML engineers or AI researchers. Look for: ability to critically evaluate AI-generated code (give them a buggy AI-generated module and ask them to find the issues), architectural judgment under constraints (design an AI feature with cost, quality, and latency trade-offs), and the contrarian test (when would you NOT use AI for this task?). Resume keywords like 'proficient in ChatGPT' are red flags, not qualifications.",
		},
		{
			question: "What is the current salary range for AI engineers?",
			answer:
				"AI engineer average salary reached $206K in 2025, a $50K year-over-year increase. However, the 'AI engineer' title spans a wide range: ML infrastructure engineers command $250K-400K at major tech companies, AI-augmented software engineers earn $150K-250K depending on seniority, and dedicated prompt engineers (a declining role) earn $120K-180K. Nearly 90% of companies have created new AI-related positions, but the majority report workforce shortages for genuinely AI-fluent talent.",
		},
		{
			question: "Should I hire dedicated AI engineers or train my existing team?",
			answer:
				"For most teams under 50 engineers, training existing staff is more cost-effective. The skills gap is in AI-assisted workflow adoption and judgment, not deep ML expertise. Staff+ engineers already lead AI adoption at 63.5% vs 49.7% for regular engineers — they need refinement, not replacement. Hire dedicated AI engineers only when you're building AI as your core product (not just using AI tools), or when you need ML infrastructure expertise that doesn't exist on your current team.",
		},
	],

	"enterprise-ai-sdlc-blueprint": [
		{
			question: "Why do enterprise AI development projects fail?",
			answer:
				"30%+ of enterprise generative AI projects are abandoned after POC. The three most common failure causes are: no scalable integration plan (the POC works in isolation but doesn't fit the SDLC), governance gaps discovered post-POC (security, legal, and compliance requirements weren't addressed during POC), and the training gap (46% of developers distrust AI accuracy, and only 3.1% highly trust it — adoption stalls without structured training programs that build confidence through verification).",
		},
		{
			question: "What are the 5 enterprise evaluation gates for AI coding tools?",
			answer:
				"Five enterprise functions must evaluate before AI coding tools touch internal repos: Security (what code, metadata, and context leaves the organizational boundary?), Legal (IP ownership, liability, indemnity, acceptable use terms), Compliance (are prompts, outputs, and approvals auditable for regulatory requirements?), Architecture (where does AI fit in the existing SDLC workflow?), and Procurement (enterprise-grade contract terms, SLAs, support, and pricing). Skipping any gate creates exposure that surfaces later at higher remediation cost.",
		},
		{
			question: "How do I move from pilot to production with AI coding tools?",
			answer:
				"Follow a three-phase model. Phase 1 (Controlled Pilot, 4-8 weeks): select 2-3 teams, define scope and success metrics, measure outcomes against baselines. Phase 2 (Governed Expansion, 8-16 weeks): establish quality gates, review standards, and training programs based on pilot learnings. Phase 3 (Mature Practice, ongoing): automated compliance checks, continuous monitoring, org-wide standards, and regular audit cycles. Less than 30% of AI initiative leaders report executive satisfaction with ROI — the phased approach prevents the 'pilot works, production fails' pattern.",
		},
	],
};
