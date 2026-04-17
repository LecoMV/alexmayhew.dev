/**
 * FAQ data for blog posts ... rendered as FAQPage JSON-LD schema.
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
				"Yes, if you are on Next.js 14+. React Server Components reduce client-side JavaScript by 30-60% by rendering data-fetching components on the server. They eliminate client-server waterfalls for data loading. The main constraint is that Server Components cannot use hooks, browser APIs, or event handlers ... those require Client Components with the 'use client' directive.",
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
				"A modular monolith is a single deployable application with strictly enforced module boundaries ... modules communicate through defined interfaces, not direct database access. Unlike microservices, it avoids network latency, distributed transactions, and deployment orchestration. You get most of the organizational benefits of microservices (team autonomy, clear ownership) without the operational overhead.",
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
				"Server Components render on the server and send zero JavaScript to the browser ... they can directly access databases, file systems, and APIs. Client Components render on both server (for HTML) and client (for interactivity) and include JavaScript bundles. The rule: use Server Components by default, add 'use client' only when you need hooks, event handlers, or browser APIs.",
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
				"Allocate 15-20% of sprint capacity to debt reduction as a baseline. Teams that allocate 0% slow down by approximately 25% per year as debt compounds. The most effective approach is not dedicated 'tech debt sprints' but embedding debt work into feature development ... when you touch a module for a feature, also clean up that module.",
		},
		{
			question: "How do you prioritize which technical debt to pay down first?",
			answer:
				"Prioritize by blast radius multiplied by change frequency. Debt in code that changes weekly costs more than debt in code that hasn't been touched in a year. Map your debt items on a 2x2 matrix: high-change-frequency + high-blast-radius items go first. Debt in stable, rarely-modified code can wait indefinitely ... it costs nothing if nobody touches it.",
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
				"Add an index when a query scans more than 5-10% of a table's rows to return its results (visible in EXPLAIN as sequential scans on large tables). Focus on columns used in WHERE clauses, JOIN conditions, and ORDER BY. Every index speeds up reads but slows down writes ... on write-heavy tables, only index columns that appear in your most frequent queries.",
		},
		{
			question: "What is the N+1 query problem and how do I fix it?",
			answer:
				"The N+1 problem occurs when code fetches a list of N items, then makes one additional query per item to load related data ... resulting in N+1 total queries instead of 2. Fix it by using JOINs or batch loading (WHERE id IN (...)) to fetch related data in a single query. ORMs often hide N+1 problems behind lazy loading ... use query logging to detect them.",
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
				"Focus on five features: union types for modeling states (type Status = 'loading' | 'success' | 'error'), generics for reusable utilities, discriminated unions for type-safe branching, utility types (Pick, Omit, Partial), and type narrowing with typeof/instanceof guards. These cover 90% of real-world TypeScript usage. Avoid overusing advanced features like conditional types and template literal types ... they hurt readability.",
		},
	],

	"metr-paradox-ai-productivity": [
		{
			question: "What did the METR study find about AI and developer productivity?",
			answer:
				"The METR randomized controlled trial (n=16, 246 tasks) found that experienced open-source developers completed tasks 19% slower when using AI tools, while believing they were 24% faster. The 43-percentage-point perception gap means teams cannot self-correct ... engineers genuinely feel more productive while delivering less.",
		},
		{
			question: "Why does AI make experienced developers slower?",
			answer:
				"The METR study tested experienced developers on their own mature codebases. Three likely mechanisms: context switching between coding and AI interaction fragments deep work, verification overhead from reviewing AI suggestions exceeds the time saved, and hallucinated solutions create false starts that waste time on dead-end approaches.",
		},
		{
			question: "Does the METR study mean AI coding tools are useless?",
			answer:
				"No. The METR study tested complex tasks in mature codebases ... the hardest scenario. AI tools demonstrably accelerate short, well-scoped tasks: boilerplate generation, test scaffolding, documentation, and greenfield exploration. The pattern: AI excels where the 'what' is defined and the 'why' doesn't require deep codebase knowledge.",
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
				"Five signals indicate cognitive debt accumulation: (1) time to explain a module exceeds time to rewrite it, (2) PR reviews default to 'LGTM' on AI-generated code, (3) incident investigation takes 3x longer because nobody understands the flow, (4) refactoring declines ... GitClear measured a 60% decline in refactored code from 2021 to 2024, (5) architecture decisions default to 'whatever AI suggests' rather than intentional design.",
		},
		{
			question: "Is cognitive debt the same as technical debt?",
			answer:
				"No. Technical debt is a conscious trade-off ... you know you're cutting corners and plan to pay it back. Cognitive debt is invisible ... the code works, passes tests, and looks professional, but nobody on the team understands why it works. Technical debt costs time to fix. Cognitive debt costs the ability to know what needs fixing. The second is categorically more dangerous.",
		},
	],

	"production-mcp-servers": [
		{
			question: "What is MCP and why does it matter for AI development?",
			answer:
				"MCP (Model Context Protocol) is the open standard for connecting AI models to external tools and data sources. It has 97M+ monthly SDK downloads and is backed by Anthropic, OpenAI, Google, and Microsoft. MCP won the integration standard war ... no serious competing standard exists. It matters because it defines how AI agents interact with your codebase, databases, APIs, and infrastructure.",
		},
		{
			question: "What are the biggest security risks with MCP servers?",
			answer:
				"The three most critical risks are tool poisoning (malicious servers embed hidden instructions in tool descriptions that are visible to AI but invisible to users), indirect prompt injection (attackers embed instructions in external content like GitHub issues that get processed through MCP), and supply chain compromise (43 agent framework components identified with embedded vulnerabilities by Barracuda Security). The Invariant Labs exploit demonstrated real data exfiltration through a GitHub MCP server.",
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
				"Use the two-axis framework: task complexity (simple, moderate, complex) crossed with codebase familiarity (greenfield, known patterns, deep institutional knowledge). AI delivers positive ROI in the simple-to-moderate complexity range on greenfield or pattern-matching work. It delivers negative ROI on complex tasks in codebases with deep institutional knowledge. The Harness 2025 survey found a majority of developers spend more time fixing AI code than expected, confirming the mismatch on complex tasks.",
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
				"Traditional technical debt is a conscious trade-off with known costs. AI technical debt is invisible ... it accumulates when developers accept AI-generated code without understanding it, creating code that works but nobody can maintain. AI debt has three unique components: comprehension debt (nobody understands why the code works), duplication debt (8x increase in copy-paste code), and architectural drift (locally optimal AI suggestions that don't compose into a coherent system).",
		},
		{
			question: "How do I audit my codebase for AI-generated technical debt?",
			answer:
				"Track four metrics: code duplication rate (GitClear-style analysis of copy-paste blocks exceeding 5 lines), refactoring rate (percentage of commits that improve existing code without changing behavior ... healthy is 15-25%), churn rate (code rewritten within 14 days of commit), and comprehension ratio (time to explain a module vs time to rewrite it). If duplication is rising, refactoring is declining, and churn exceeds 15%, AI debt is accumulating faster than your team can manage.",
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
				"AI-generated tests tend to test implementation, not intent ... they pass when the bug exists in both the code and the test. 50% of QA leaders cite maintenance burden and flaky scripts as the primary AI testing challenge (World Quality Report 2025-26). TDD inverts the problem: the human defines intent through a failing test, the AI implements to pass it, and the human reviews the result. This constrains AI output to verifiable behavior rather than letting it generate both the code and its own validation.",
		},
		{
			question: "What is the RED-GREEN-REFACTOR pattern for AI-assisted development?",
			answer:
				"RED: the human writes a failing test that precisely defines the intended behavior. GREEN: the AI implements code to pass that test, constrained by the test specification. REFACTOR: the human reviews the AI output for DRY violations, security issues, and maintainability concerns. This pattern produces measurably better AI-assisted code because the test acts as a contract ... the AI can't silently introduce bugs that the test doesn't cover.",
		},
		{
			question: "How do you test non-deterministic AI output?",
			answer:
				"Three patterns work for non-deterministic systems: property-based testing (assert invariants that must hold regardless of specific output ... response is valid JSON, contains required fields, stays within length bounds), golden dataset testing (curate input-output pairs representing expected behavior and test against them with similarity thresholds), and eval suites (structured scoring of AI output across dimensions like accuracy, relevance, and safety with pass/fail thresholds per dimension).",
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
				"It depends on team composition and work patterns. Cursor suits junior-to-mid teams doing IDE-centric work ... it's visual, guided, and has a gentler learning curve. Claude Code suits senior-heavy teams doing complex, multi-file, agentic work ... it's CLI-first, autonomous, and optimized for architectural tasks. At enterprise scale (10K+ employees), GitHub Copilot often wins through Microsoft procurement bundling regardless of feature comparison.",
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
				"Use a four-tier severity model. Severity 1: critical paths nobody understands (auth, billing, data pipelines) ... immediate triage required. Severity 2: core business logic with no documentation or design rationale ... address within 30 days. Severity 3: non-critical features with high complexity ... schedule for quarterly remediation. Severity 4: internal tooling with single maintainer ... lowest priority. Map every module to a severity tier and address them in order.",
		},
		{
			question: "Should I rewrite my vibe-coded codebase or try to fix it?",
			answer:
				"Apply the 50% rule: if more than 50% of modules are Severity 1 or 2, a phased rewrite of critical paths is more cost-effective than remediation. If under 50%, targeted remediation works ... start with comprehension sprints (not refactoring sprints), create Architecture Decision Records for every module, and establish ownership transfer protocols. The rewrite threshold also depends on team turnover: if the original team has left, remediation costs approach rewrite costs because nobody holds any mental model.",
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
				"For most teams under 50 engineers, training existing staff is more cost-effective. The skills gap is in AI-assisted workflow adoption and judgment, not deep ML expertise. Staff+ engineers already lead AI adoption at 63.5% vs 49.7% for regular engineers ... they need refinement, not replacement. Hire dedicated AI engineers only when you're building AI as your core product (not just using AI tools), or when you need ML infrastructure expertise that doesn't exist on your current team.",
		},
	],

	"saas-billing-stripe-architecture": [
		{
			question: "Should I use Stripe Checkout or Stripe Elements for a SaaS product?",
			answer:
				"Use Stripe Checkout for MVPs and simple subscriptions ... it handles PCI compliance and saves 2-3 weeks of integration work. Use Stripe Elements when you need custom UI or embedded payment flows.",
		},
		{
			question: "How do I handle failed SaaS payments without losing customers?",
			answer:
				"Implement dunning management with smart retries (day 3, 5, 7, 14) plus Stripe Smart Retries. This recovers 30-40% of failed payments automatically before cancellation.",
		},
		{
			question: "What is the right way to model SaaS subscriptions in a database?",
			answer:
				"Store the authoritative subscription state in Stripe, not your database. Mirror only the fields you need (status, plan, period_end) and sync via webhooks with idempotency keys to prevent duplicate events.",
		},
	],

	"multi-tenancy-prisma-rls": [
		{
			question: "Is PostgreSQL Row-Level Security (RLS) safe for multi-tenant SaaS?",
			answer:
				"Yes. RLS provides defense in depth at the database layer. A missing WHERE clause in application code cannot leak tenant data because the database enforces isolation independently. Performance overhead is typically under 5%.",
		},
		{
			question: "Should I use schema-per-tenant or row-level multi-tenancy?",
			answer:
				"Row-level with RLS scales to thousands of tenants on shared infrastructure. Schema-per-tenant is appropriate only for enterprise contracts requiring physical isolation ... it caps out at roughly 100-500 tenants before Postgres metadata overhead degrades performance.",
		},
		{
			question: "How do I prevent tenant data leaks when using Prisma?",
			answer:
				"Set the tenant context via `SET app.current_tenant` in a Prisma middleware on every transaction. Combine this with Postgres RLS policies on every tenant-scoped table. Never rely on application-layer WHERE clauses alone.",
		},
	],

	"core-web-vitals-2026-audit": [
		{
			question: "What are the 2026 Core Web Vitals thresholds?",
			answer:
				"LCP under 2.5s, INP under 200ms, CLS under 0.1. INP replaced FID in March 2024 and measures responsiveness across the full page lifecycle, not just first input. 75th percentile on real user data determines pass/fail.",
		},
		{
			question: "Why did my INP score drop after replacing FID?",
			answer:
				"INP measures every interaction, not just the first one. Heavy JavaScript handlers on scroll, hover, or repeated clicks now count. A single 500ms handler that fires after initial load can fail INP even when FID passed.",
		},
		{
			question: "How do I improve INP on a React application?",
			answer:
				"Break long tasks with scheduler.yield() or setTimeout, move non-critical work off the main thread, debounce expensive handlers, and use React 19 transitions for state updates triggered by user input. Target handler work under 50ms.",
		},
	],

	"rag-architecture-saas": [
		{
			question: "When should I use RAG instead of fine-tuning an LLM?",
			answer:
				"Use RAG when your data changes frequently, when citations matter for compliance, or when you have under 10,000 high-quality training examples. Fine-tuning is only worth the cost when RAG hits ceiling on task-specific reasoning.",
		},
		{
			question: "Which vector database should I use for a production RAG system?",
			answer:
				"Start with pgvector if you already run PostgreSQL ... it handles up to 10M vectors comfortably. Move to Pinecone, Weaviate, or Qdrant only when you exceed 10M vectors or need sub-10ms query latency at scale.",
		},
		{
			question: "How do I prevent RAG from hallucinating on questions outside my corpus?",
			answer:
				"Add a confidence threshold on retrieval scores, require the LLM to cite source passages, and implement a fallback response when top-k results fall below the threshold. This cuts hallucination rates from 15-25% to under 3%.",
		},
	],

	"build-vs-buy": [
		{
			question: "When does build-vs-buy favor building?",
			answer:
				"Build only when the capability is core to your differentiation and buying forces compromises that damage the product experience. Everything else ... auth, payments, email, monitoring, analytics ... should be bought.",
		},
		{
			question: "How much does it cost to build vs buy authentication?",
			answer:
				"Buying (Clerk, Auth0, Supabase Auth) costs $0-500/month under 10K MAU. Building costs 3-6 engineer-months upfront plus ongoing maintenance for MFA, SSO, password policies, and compliance. Buy wins until you hit $2-3M ARR.",
		},
		{
			question: "What is the hidden cost of buying third-party tools?",
			answer:
				"Integration surface area. Each vendor adds webhook handling, retry logic, rate limits, and outage dependencies. Budget 20-30% of a vendor's license cost as ongoing integration maintenance.",
		},
	],

	"zero-to-10k-mrr-saas-playbook": [
		{
			question: "How long does it take to reach $10K MRR for a SaaS?",
			answer:
				"The median is 12-18 months from launch to $10K MRR for B2B SaaS with a technical founder. Faster paths (3-6 months) require an existing audience or strong network. Slower paths (24+ months) typically lack distribution, not product.",
		},
		{
			question: "What infrastructure do I need from $0 to $10K MRR?",
			answer:
				"Cloudflare Pages or Vercel for hosting ($0-20/month), PostgreSQL via Neon or Supabase free tier, Stripe for payments, and Resend for transactional email. Total infrastructure cost under $100/month through $10K MRR.",
		},
		{
			question: "When should I hire my first engineer for a SaaS startup?",
			answer:
				"Hire your first engineer at $15-25K MRR when the founder spends over 50% of time on support and bug fixes. Hiring earlier burns runway on salary; hiring later caps growth as technical debt accumulates faster than it can be paid down.",
		},
	],

	"lambda-tax-cold-starts": [
		{
			question: "What is the Lambda Tax in serverless computing?",
			answer:
				"The Lambda Tax is the 2-5x cost premium serverless incurs over containers for steady-traffic workloads. At over 1M requests/month with predictable load, container hosting on Fly.io or Railway typically costs 40-60% less than AWS Lambda.",
		},
		{
			question: "How long do AWS Lambda cold starts last?",
			answer:
				"Go and Rust functions cold start in 100-200ms. Node.js and Python take 300-800ms. Java and .NET take 1-3 seconds. Provisioned concurrency eliminates cold starts but removes most of the serverless cost advantage.",
		},
		{
			question: "When is serverless worth the cold start penalty?",
			answer:
				"Serverless wins for event-driven workloads, low-traffic APIs under 100K requests/month, and bursty traffic with 10x+ peak-to-average ratios. Containers win for steady traffic, latency-critical paths, and workloads over 1M requests/month.",
		},
	],

	"edge-computing-saas": [
		{
			question: "When is edge computing worth the complexity for a SaaS?",
			answer:
				"Edge is worth it when users are geographically distributed and 100ms of latency affects revenue. E-commerce sees 1-2% conversion lift per 100ms reduction. Edge is not worth it for admin panels, internal tools, or single-region products.",
		},
		{
			question: "What are the main limitations of Cloudflare Workers?",
			answer:
				"50ms CPU limit per request on free tier (30s on paid), no native Node.js filesystem or TCP sockets, 1MB compressed script size, and limited database options (D1, KV, R2, or HTTP-based external DBs). No persistent memory between requests.",
		},
		{
			question: "Can I run a full Next.js app on Cloudflare Workers?",
			answer:
				"Yes, via OpenNext or @cloudflare/next-on-pages. Static and server-rendered pages both work. Limitations: no Next.js Image Optimization without R2, no ISR without workarounds, and some npm packages that require Node.js APIs need polyfills.",
		},
	],

	"fractional-cto-vs-full-time": [
		{
			question: "What does a fractional CTO cost per month?",
			answer:
				"Fractional CTOs typically charge $2,000-$8,000/month for 8-20 hours. Senior tier with strategic focus runs $5,000-$10,000/month. Full-time CTO total compensation averages $315K-595K annually including equity ... 4-6x the fractional cost.",
		},
		{
			question: "When should a startup transition from fractional to full-time CTO?",
			answer:
				"Transition when engineering team exceeds 15 people, when architectural decisions require daily leadership presence, or after Series A with clear product-market fit. Before these signals, a fractional model provides equivalent value at fraction of cost.",
		},
		{
			question: "What does a fractional CTO actually do day-to-day?",
			answer:
				"Strategic architecture review, technical due diligence for fundraising, hiring loop participation, vendor selection (cloud, tools, auth), mentoring lead engineers, and acting as technical counterparty in board and investor meetings.",
		},
	],

	"enterprise-ai-sdlc-blueprint": [
		{
			question: "Why do enterprise AI development projects fail?",
			answer:
				"30%+ of enterprise generative AI projects are abandoned after POC. The three most common failure causes are: no scalable integration plan (the POC works in isolation but doesn't fit the SDLC), governance gaps discovered post-POC (security, legal, and compliance requirements weren't addressed during POC), and the training gap (46% of developers distrust AI accuracy, and only 3.1% highly trust it ... adoption stalls without structured training programs that build confidence through verification).",
		},
		{
			question: "What are the 5 enterprise evaluation gates for AI coding tools?",
			answer:
				"Five enterprise functions must evaluate before AI coding tools touch internal repos: Security (what code, metadata, and context leaves the organizational boundary?), Legal (IP ownership, liability, indemnity, acceptable use terms), Compliance (are prompts, outputs, and approvals auditable for regulatory requirements?), Architecture (where does AI fit in the existing SDLC workflow?), and Procurement (enterprise-grade contract terms, SLAs, support, and pricing). Skipping any gate creates exposure that surfaces later at higher remediation cost.",
		},
		{
			question: "How do I move from pilot to production with AI coding tools?",
			answer:
				"Follow a three-phase model. Phase 1 (Controlled Pilot, 4-8 weeks): select 2-3 teams, define scope and success metrics, measure outcomes against baselines. Phase 2 (Governed Expansion, 8-16 weeks): establish quality gates, review standards, and training programs based on pilot learnings. Phase 3 (Mature Practice, ongoing): automated compliance checks, continuous monitoring, org-wide standards, and regular audit cycles. Less than 30% of AI initiative leaders report executive satisfaction with ROI ... the phased approach prevents the 'pilot works, production fails' pattern.",
		},
	],

	"500k-architecture-mistake": [
		{
			question: "When should a SaaS actually migrate from monolith to microservices?",
			answer:
				"Only at 50+ engineers with genuinely different scaling requirements per service. Below that, feature flags and module boundaries solve the real problems at 1/10 the cost.",
		},
		{
			question: "What does a premature microservices migration cost a Series A startup?",
			answer:
				"Roughly $460-520K: $300K in engineering time over 6 months, $60-120K in infrastructure overhead, plus $100K+ in opportunity cost from features not shipped.",
		},
		{
			question: "What simpler alternatives solve problems teams blame on their monolith?",
			answer:
				"Feature flags replace deployment risk. Read replicas fix analytics contention. CODEOWNERS files and module boundaries eliminate team conflicts. Total implementation: 3 weeks.",
		},
	],

	"accessibility-design-systems": [
		{
			question: "How much do web accessibility lawsuits cost companies?",
			answer:
				"ADA lawsuits rose 320% from 2018-2024. Over 4,600 digital accessibility lawsuits filed in federal court in 2023. Settlements typically run $10,000 to $100,000.",
		},
		{
			question: "What percentage of accessibility issues does automated testing catch?",
			answer:
				"Automated tools like axe-core catch 30-50% of issues. The remaining 50-70% require manual screen reader testing and keyboard-only navigation to uncover.",
		},
		{
			question: "What WCAG contrast ratio do I need for accessible text?",
			answer:
				"WCAG AA requires 4.5:1 for normal text and 3:1 for large text (18px+ or 14px+ bold). AAA requires 7:1 for normal text. UI components need 3:1 minimum.",
		},
	],

	"ai-assisted-development-generative-debt": [
		{
			question: "Does AI-assisted coding actually increase bug rates?",
			answer:
				"Yes. GitClear analysis of 150M+ lines shows 23.7% higher bug-fix ratios on AI-heavy projects. Copy-paste code increased 8% year-over-year as churn rose.",
		},
		{
			question: "Why do developers trust AI code they admit is untrustworthy?",
			answer:
				"96% of developers don't fully trust AI output, yet 50%+ merge it with cursory review. Time pressure wins: the speed advantage disappears if you review thoroughly.",
		},
		{
			question: "What AI coding tasks carry the lowest risk?",
			answer:
				"Language translation (Airbnb: 79% faster Ruby to TypeScript), test migration between frameworks, and documentation generation. The logic is pre-verified; AI handles syntax.",
		},
	],

	"ai-assisted-development-reality": [
		{
			question: "Can someone with no development background ship production software using AI?",
			answer:
				"No. AI amplifies existing competence, it doesn't create it. You need enough pattern recognition to catch the 5% of AI output that's subtly wrong while using the 95% that's correct.",
		},
		{
			question: "What separates productive AI-assisted development from vibe coding?",
			answer:
				"The formula: Competence + Discipline + Research + AI = Results. Remove any of the first three and you get demo-quality code that breaks under real conditions.",
		},
		{
			question: "Who does AI coding actually threaten?",
			answer:
				"Engineers whose primary value is implementation speed. AI commoditized fast implementation but not architectural judgment. Senior engineers with deep system knowledge are more valuable, not less.",
		},
	],

	"ai-code-review": [
		{
			question: "What percentage of code review can AI reliably handle?",
			answer:
				"AI catches 60-80% of style violations and common bug patterns. It misses business logic errors, security edge cases, and architectural fit. Use AI as a filter, not a replacement.",
		},
		{
			question: "What do senior developers spend their review time on?",
			answer:
				"Senior engineers spend 15-25% of their time reviewing PRs. Teams that automate formatting, linting, and type checks cut review time from 45 minutes to 15 minutes per PR.",
		},
		{
			question: "What is the hybrid AI code review workflow?",
			answer:
				"AI pre-review filters style, formatting, and known anti-patterns. Humans focus on architecture, business logic, and security. This cuts reviewer fatigue and catches more real bugs.",
		},
	],

	"ai-cost-optimization": [
		{
			question: "At what monthly spend does self-hosted AI beat API pricing?",
			answer:
				"Below $2K/month: stick with APIs. Above $5K/month: self-hosting pays off within 6 months. A100 GPUs deliver ~$0.50/1M tokens vs $3-15/1M for equivalent API quality.",
		},
		{
			question: "Does semantic caching actually reduce LLM costs?",
			answer:
				"Yes. Semantic caching with 0.95+ similarity thresholds cuts costs 40-60% regardless of deployment model. It's the highest-ROI optimization before touching model choice or prompts.",
		},
		{
			question: "When does fine-tuning an LLM make financial sense?",
			answer:
				"When you need domain-specific quality that base models can't match. Expect $25/1M training tokens plus ongoing inference savings of 40-60%. Otherwise, RAG with a base model wins.",
		},
	],

	"anatomy-of-high-precision-saas": [
		{
			question: "When should a SaaS migrate off Vercel?",
			answer:
				"When bandwidth costs exceed $500/month or you hit enterprise requirements Vercel can't meet (static IPs for firewall allowlisting). Vercel Pro includes 1TB; overage is $0.15/GB.",
		},
		{
			question: "What architecture stack scales B2B SaaS from 10K to 100K users?",
			answer:
				"Next.js 15 on Vercel, tRPC for internal APIs, PostgreSQL with RLS for multi-tenancy, PgBouncer for connection pooling. Graduate to AWS ECS only when bandwidth costs force it.",
		},
		{
			question: "What breaks first as a SaaS scales past 10,000 users?",
			answer:
				"Usually Vercel bandwidth bills (one team jumped from $400 to $2,100 in a billing cycle), schema-per-tenant databases (caps at 300 customers), or P99 latency creeping past 4 seconds.",
		},
	],

	"atmospheric-animations-framer-motion": [
		{
			question: "Why do spring animations feel more natural than linear easing?",
			answer:
				"Biological motion follows physics. Your arm accelerates, decelerates, and settles with slight overshoot. Linear animations violate this intuition because nothing in nature moves at constant velocity.",
		},
		{
			question: "What damping ratio should I use for UI animations?",
			answer:
				"Damping ratio (ζ) of 0.7-0.9 works for most UI. Below 1 is bouncy, exactly 1 is smooth without overshoot, above 1 is sluggish. Never use linear easing for interactive feedback.",
		},
		{
			question: "Should animations respect prefers-reduced-motion?",
			answer:
				"Yes. Always. It's an accessibility requirement for users with vestibular disorders. Framer Motion supports it via reducedMotion='user' on the LazyMotion provider.",
		},
	],

	"boring-technology-wins": [
		{
			question: "Why did Amazon Prime Video move from serverless to a monolith?",
			answer:
				"Their Video Quality Analysis service hit Lambda and Step Functions scalability ceilings. The monolithic rewrite cut infrastructure costs by 90% for that specific service.",
		},
		{
			question: "What is the Known Failure Modes principle?",
			answer:
				"When PostgreSQL fails, Stack Overflow has the answer. When your custom database fails, you pioneer the debugging. Boring technology has documented failure modes; novel tech doesn't.",
		},
		{
			question: "How large did Instagram scale on PostgreSQL and Python?",
			answer:
				"Instagram reached 14 million users with 3 engineers on PostgreSQL and Python. Technical novelty wasn't the competitive advantage; disciplined use of boring technology was.",
		},
	],

	"building-ai-features-users-want": [
		{
			question: "What percentage of AI features actually reach adoption thresholds?",
			answer:
				"Only 20% survive. Of 12 AI feature launches I've reviewed, 8 were rolled back within 6 months. The survivors started with a user problem, not with AI as the starting point.",
		},
		{
			question: "What tasks should you never use AI for?",
			answer:
				"Precision-critical calculations (invoice totals), legal or compliance determinations, tasks requiring perfect accuracy, and simple deterministic operations. One error destroys user trust.",
		},
		{
			question: "How should I interview users about AI features?",
			answer:
				"Never ask 'would you like AI to help with X?' Users always say yes out of politeness. Ask 'walk me through the last time you did this task. What was the hardest part?'",
		},
	],

	"caching-strategies-production": [
		{
			question: "Should I reach for Redis as my first cache?",
			answer:
				"No. HTTP cache headers and in-process LRU caches eliminate 60-80% of database queries without cache cluster operational overhead. Use Redis for session state and rate limiting.",
		},
		{
			question: "What is the right caching layer hierarchy?",
			answer:
				"Browser cache (0ms) for static assets, CDN edge cache (5-20ms) with stale-while-revalidate for API responses, in-process LRU (0.01ms), then distributed Redis (1-5ms) if still needed.",
		},
		{
			question: "How do I avoid stale data after writes in a cached system?",
			answer:
				"Use write-through invalidation at each layer, not TTL-based expiration. Write-through handles 80% of cases cleanly. Avoid 5-30 minute staleness windows that generate support tickets.",
		},
	],

	"cdn-caching-strategy": [
		{
			question: "What cache hit ratio should a properly configured CDN deliver?",
			answer:
				"90%+ cache hit ratios with sub-50ms TTFB globally. One optimization reduced bandwidth costs 73% while improving TTFB from 800ms to 50ms by fixing content hashing and TTLs.",
		},
		{
			question: "How long should I cache static assets?",
			answer:
				"One year with content hashing (immutable flag). JS bundles, CSS, images, and fonts never change at a hashed URL, so cache forever. The hash changes when content changes.",
		},
		{
			question: "When should I use stale-while-revalidate caching?",
			answer:
				"For dynamic content that changes occasionally but can tolerate brief staleness. Typical pattern: max-age=60, stale-while-revalidate=300 for dashboard data and API responses.",
		},
	],

	"code-review-practices-scale": [
		{
			question: "How does code review cycle time scale with team size?",
			answer:
				"Median PR cycle time grows from 4 hours at team size 5 to 52 hours at team size 20. That 48-hour jump isn't review time, it's queue wait time compounding.",
		},
		{
			question: "What review work should teams automate before humans touch a PR?",
			answer:
				"Formatting (Prettier), linting (ESLint), type checking, test runs, coverage thresholds (80% on changed lines), security scanning (Semgrep), and bundle size limits.",
		},
		{
			question: "What is a reasonable PR size limit for code review?",
			answer:
				"PRs over 400 lines of non-test code should require explicit justification. Large PRs take disproportionately longer to review and hide more bugs behind reviewer fatigue.",
		},
	],

	"component-api-design": [
		{
			question: "What are the signs of a hostile component API?",
			answer:
				"Too many required props, no TypeScript integration, unclear variant naming, and developers creating wrapper components to avoid dealing with the base component. API friction multiplies across usage.",
		},
		{
			question: "When should I use compound components over configuration props?",
			answer:
				"Use compound components (Tabs.List, Tabs.Tab) when the structure needs flexibility. Use configuration props for simple cases. Composition scales better than configuration for complex UI.",
		},
		{
			question: "How do I decide between controlled and uncontrolled component APIs?",
			answer:
				"Support both explicitly. Uncontrolled (defaultValue) for forms you don't need to react to. Controlled (value + onChange) when parent state drives behavior. Never make it implicit.",
		},
	],

	"core-web-vitals-optimization": [
		{
			question: "What Core Web Vitals thresholds do I need to hit for green scores?",
			answer:
				"LCP under 2.5 seconds, INP under 200ms, CLS under 0.1. 75th percentile of real user data determines pass/fail. All three must be green for the page to pass.",
		},
		{
			question: "What business impact does a 100ms LCP improvement produce?",
			answer:
				"Vodafone measured +1.11% conversion rate per 100ms faster LCP. Rakuten saw +0.7% cart additions per 100ms faster INP. Pinterest got +15% session duration per 0.1 CLS reduction.",
		},
		{
			question: "What are the fastest Core Web Vitals wins?",
			answer:
				"Preload the LCP image, use next/font with display:swap, defer third-party scripts, and reserve space for dynamic content. These alone can cut LCP by 40%.",
		},
	],

	"database-migration-patterns": [
		{
			question: "Why do database migrations fail in production but pass in staging?",
			answer:
				"Staging databases have 10,000 rows; production has 50 million. A migration that runs in 200ms locally can hold a table lock for 45 minutes in production. Test against production-scale data.",
		},
		{
			question: "What are the three categories of database migration risk?",
			answer:
				"Low: schema-only changes (ADD COLUMN with static defaults). Medium: data backfills that compete for I/O. High: mixed schema and data changes. Never mix categories in one migration.",
		},
		{
			question: "When should I use expand-contract for zero-downtime migrations?",
			answer:
				"Always, for any change touching data in use. Expand (add new column/table), dual-write, backfill in batches, contract (remove old). CONCURRENTLY on every index creation.",
		},
	],

	"designer-developer-handoff": [
		{
			question: "Why is the designer-developer handoff metaphor broken?",
			answer:
				"Handoff implies a static baton: screenshot, Figma link, spec doc. The moment it passes, it's already diverging from reality. Continuous synchronization replaces the relay race.",
		},
		{
			question: "What does Figma Code Connect solve?",
			answer:
				"It shows developers real production code in Dev Mode, not generic CSS. A button displays as <Button variant='primary'> instead of generic padding and color values.",
		},
		{
			question: "How do I catch visual drift between design and implementation?",
			answer:
				"Use Percy or Chromatic for automated visual regression testing. Run on every PR. 'Pixel perfect' means design system intent matches, not that every pixel matches a static screenshot.",
		},
	],

	"design-tokens-comprehensive": [
		{
			question: "Why do color-only design token systems fail?",
			answer:
				"The designer specifies '16px padding with 24px gap and medium shadow'; the developer guesses. Three rounds of review burns 2 hours on spacing that should take 2 minutes.",
		},
		{
			question: "What are the three layers of a design token architecture?",
			answer:
				"Primitive tokens (raw values like #3B82F6), semantic tokens (color.action.primary), and component tokens (button.primary.background). Each layer references the one above it.",
		},
		{
			question: "How much time does a complete token system save?",
			answer:
				"A complete token system (typography, spacing, elevation, animation) reduces design-to-code translation time by 70% and eliminates the 'that's not quite right' back-and-forth.",
		},
	],

	"documentation-engineers-read": [
		{
			question: "What percentage of engineering documentation is actually accurate?",
			answer:
				"In audits across 12 companies, 40-60% of docs were outdated. 70%+ of engineers reported finding incorrect information monthly. 90%+ of 'comprehensive' architecture docs hadn't been updated in 6+ months.",
		},
		{
			question: "What are the only four documentation types engineers actually use?",
			answer:
				"Architecture Decision Records (ADRs), runbooks, onboarding guides, and API contracts. Everything else has a half-life of roughly 6 weeks before it's outdated and actively misleading.",
		},
		{
			question: "Why are wrong docs worse than missing docs?",
			answer:
				"When an engineer follows outdated instructions and breaks something, they lose trust in all documentation. They ask a colleague instead, defeating the purpose of writing docs at all.",
		},
	],

	"event-driven-architecture-saas": [
		{
			question: "When should a SaaS actually adopt event-driven architecture?",
			answer:
				"When synchronous cascading failures take down production, database lock contention spikes P99 latency, or cross-team API coupling blocks weekly deploys. Not before real pain appears.",
		},
		{
			question: "What does premature event-driven architecture cost?",
			answer:
				"Teams that adopted EDA too early spent 20-25% of engineering headcount managing Kafka infrastructure instead of shipping features. $50-100K/year in infrastructure they didn't need.",
		},
		{
			question: "Kafka or NATS JetStream for SaaS events?",
			answer:
				"Kafka handles 500K-1M messages/sec but requires 8+ cores and 64-128GB RAM per broker. NATS JetStream delivers sub-millisecond latency at a fraction of operational cost for smaller teams.",
		},
	],

	"first-engineering-team-playbook": [
		{
			question: "What order should I hire my first five engineers?",
			answer:
				"Generalist first (full-stack, 4-7 years experience), then specialist based on product needs, then two complementary hires, then a senior anchor. Sequence matters more than individuals.",
		},
		{
			question: "How much does building a first engineering team cost?",
			answer:
				"$600-900K in salary over 12-18 months for 5 engineers, plus 3-5% equity. First hire typically $180-220K base in major US markets, or 60-70% of that remote.",
		},
		{
			question: "What mistakes kill first engineering teams?",
			answer:
				"Hiring two backend engineers because that's what the founder knows, then scrambling to add frontend. Hiring junior without senior mentorship. Bringing in a senior who has to undo 8 months of work.",
		},
	],

	"hidden-tax-supporting-both": [
		{
			question: "What is the actual engineering cost of supporting two databases?",
			answer:
				"Test matrix grows 2.3x, maintenance 2.5x. In audits across 8 SaaS codebases, 'we support both' accounted for 25-40% of total engineering overhead, mostly distributed across PRs and reviews.",
		},
		{
			question: "Where does 'we support both' come from?",
			answer:
				"Customer-driven ('our biggest prospect uses MongoDB'), acquisition-driven (merged AWS and GCP), team-preference ('half prefer REST, half GraphQL'), or backward compatibility ('v1 still has 12% traffic').",
		},
		{
			question: "When is supporting two options actually worth the cost?",
			answer:
				"When business value clearly exceeds ongoing engineering tax. Quantify the cost: extra 30 min per PR review, extra 2 hours per deploy, extra week per security audit. Make it conscious.",
		},
	],

	"hiring-first-staff-engineer": [
		{
			question: "When does a startup actually need a staff engineer?",
			answer:
				"At 15-25 engineers with a specific organizational gap: CTO is the architecture bottleneck, teams solve the same problem three ways, or senior engineers have no growth path beyond management.",
		},
		{
			question: "What is the salary for a first staff engineer hire?",
			answer:
				"Expect $250-350K total comp as of early 2026. Hire for influence and communication over raw technical skill. A brilliant engineer who can't persuade creates more problems than they solve.",
		},
		{
			question: "What is the difference between a senior engineer and a staff engineer?",
			answer:
				"Senior engineers deliver excellent individual output. Staff engineers multiply the output of the entire engineering organization. The title isn't a promotion for seniors who don't want to manage.",
		},
	],

	"ic-to-tech-lead": [
		{
			question: "What is the 30/30/30 rule for tech leads?",
			answer:
				"30% coding, 30% code review and mentoring, 30% architecture and planning, 10% meetings. Stop measuring yourself by personal commits; start measuring team output.",
		},
		{
			question: "Why do senior ICs stop getting promoted?",
			answer:
				"They keep optimizing for code output. The feedback 'we need to see more leadership' means impact multiplication: enabling 5 engineers to ship 8 features beats shipping 10 yourself.",
		},
		{
			question: "How long does the IC to tech lead transition take?",
			answer:
				"Engineers who lead without the title get promoted in 12-18 months. Engineers who wait for the promotion to start leading rarely get it. Start solving unassigned problems now.",
		},
	],

	"incident-response-saas": [
		{
			question: "Why do SaaS incident response processes fail?",
			answer:
				"Teams conflate 'finding the fix' with 'restoring service.' Restore first (revert deploy, failover), root cause after. Three engineers investigating independently duplicates work without progress.",
		},
		{
			question: "What is the SEV-1 response SLA for a SaaS outage?",
			answer:
				"5 minutes to start mitigation for total service outage or data loss risk. All hands on deck, CEO notified, customers communicated proactively. Silence is worse than bad news.",
		},
		{
			question: "Who should be the Incident Commander during an outage?",
			answer:
				"Not the most technical engineer. The IC coordinates, communicates, and decides; they don't debug. Assign an IC before you need one. The best ICs run comms while engineers fix.",
		},
	],

	"llm-cost-optimization-scale": [
		{
			question: "What is the 80/20 rule of LLM cost optimization?",
			answer:
				"80% of queries can be handled by cheap fast models (GPT-4o-mini at $0.15/1M input); 20% need expensive capable models (Claude Sonnet at $3/1M). Tiered routing cuts costs 60-70%.",
		},
		{
			question: "How does an AI feature go from $4/month to $225K/month?",
			answer:
				"Scale. $0.03 per query is $9/month at 10 queries/day, $4,500/month at 1,000 DAU averaging 5 queries, and $225,000/month at 50,000 DAU. Optimize before you scale.",
		},
		{
			question: "What is semantic caching and how much does it save?",
			answer:
				"Serving near-identical queries from cache using 0.95+ similarity thresholds. Eliminates 20-30% of LLM calls entirely on top of model routing savings. Compounds with prompt compression.",
		},
	],

	"llm-integration-architecture": [
		{
			question: "Which vector database should I use for production RAG?",
			answer:
				"pgvector for under 1M vectors, Qdrant for 1-10M, Pinecone for 10M+ or managed preference. Adopting a dedicated vector DB before you need one adds infrastructure you'll regret.",
		},
		{
			question: "Which OpenAI embedding model delivers the best cost-quality ratio?",
			answer:
				"text-embedding-3-small at $0.02/1M tokens beats ada-002 on quality at half the cost. Use it as the default for new RAG systems unless you need the larger model's specific capabilities.",
		},
		{
			question: "How do I prevent a vector database from being a single point of failure?",
			answer:
				"Build fallback chains, not single points. Primary vector store, secondary cache layer, and a deterministic fallback path. Cache aggressively; semantic caching cuts LLM costs 40-60%.",
		},
	],

	"multi-region-saas-architecture": [
		{
			question: "When should a SaaS go multi-region?",
			answer:
				"When half your users hit 200ms+ latency, or a GDPR Article 44 violation threatens you. Scale isn't the trigger; latency and compliance are. Fines run up to 4% of global revenue.",
		},
		{
			question: "Active-active or active-passive database replication?",
			answer:
				"Start active-passive. Active-active sounds ideal but introduces conflict resolution complexity that breaks most teams. Move to active-active only when you can handle CRDTs or app-level conflict resolution.",
		},
		{
			question: "How much latency does cross-region traffic actually add?",
			answer:
				"New York to London: ~28ms one way, ~55ms round trip in perfect conditions. Singapore to us-east-1: 250-300ms round trip. Every DB query, every API call, every WebSocket ping pays that tax.",
		},
	],

	"neo-brutalism-developer-guide": [
		{
			question: "What defines neo-brutalist web design?",
			answer:
				"Hard shadows (4px 4px 0px #000), thick borders (3-4px), high contrast colors, monospace typography, and exposed box model geometry. No soft shadows, excessive rounding, or gradients.",
		},
		{
			question: "When should a product use neo-brutalism?",
			answer:
				"Portfolios, creative tools, indie products, developer tools. Skip it for enterprise B2B, healthcare, or finance where trust signals favor conservative design conventions.",
		},
		{
			question: "How does second-wave neo-brutalism differ from first-wave?",
			answer:
				"First-wave (Craigslist, Hacker News) was anti-design: deliberately ugly. Second-wave (Gumroad, Linear, Figma Config) is deliberate and polished, using brutalist elements with thoughtful typography.",
		},
	],

	"nodejs-memory-leaks": [
		{
			question: "Where do memory leaks hide in Node.js applications?",
			answer:
				"In Old Space, V8's Mark-Sweep-Compact region for long-lived objects. Short-lived objects die in New Space within milliseconds. Leaks are objects that survive to Old Space and never get collected.",
		},
		{
			question: "What is the Three-Snapshot Technique for finding memory leaks?",
			answer:
				"Take a baseline heap snapshot, perform the suspect action, take a second snapshot, repeat the action, take a third. Objects present in all three snapshots are likely leaks.",
		},
		{
			question: "How should I set max-old-space-size in a container?",
			answer:
				"Container RAM multiplied by 0.75. V8 needs headroom for stack, code, and external memory. Setting it to 100% of container RAM triggers OOM kills before garbage collection can run.",
		},
	],

	"optimistic-ui": [
		{
			question: "When should I use optimistic UI updates?",
			answer:
				"For high-confidence actions like likes, saves, and form submissions where success is expected. Never for financial transactions, scarce inventory, or operations with real-world side effects.",
		},
		{
			question: "How do I implement optimistic UI in React 19?",
			answer:
				"Use the useOptimistic hook for server actions, React Query's onMutate + onError for mutations, or SWR's optimisticData parameter. All three handle rollback on failure automatically.",
		},
		{
			question: "What latency threshold triggers user perception of slowness?",
			answer:
				"Under 100ms feels instant (direct manipulation). 100ms-1s is noticeable but flow continues. Over 1 second breaks flow. Over 10 seconds triggers abandonment. Optimistic UI eliminates the wait entirely.",
		},
	],

	"prompt-engineering-developers": [
		{
			question: "What are the five components of an effective prompt?",
			answer:
				"Role (who the AI should be), Context (what it needs to know), Task (what to do), Format (output structure), Constraints (what to avoid). Omitting any forces the LLM to guess.",
		},
		{
			question: "What temperature should I use for production LLM tasks?",
			answer:
				"Temperature 0 for deterministic tasks (classification, extraction, factual Q&A). Temperature 0.7 for creative generation. Never leave it at default 1.0 for production systems.",
		},
		{
			question: "How do I prevent AI outputs from drifting between releases?",
			answer:
				"Version prompts in git, build eval suites that run on every change, use regression tests with fixed inputs and expected output shapes. Treat prompts as code, not configuration.",
		},
	],

	"real-time-performance-monitoring": [
		{
			question: "Why do averages hide real SaaS performance problems?",
			answer:
				"A 200ms average can mask a P99 of 8 seconds affecting 100 requests per minute. Those 100 users often correlate with enterprise customers on complex dashboards, your highest-paying segment.",
		},
		{
			question: "What are the four pillars of SaaS performance monitoring?",
			answer:
				"Percentile-based latency (P50/P95/P99 per endpoint), Real User Monitoring with device/network segmentation, error budget burn rate alerting (not static thresholds), and distributed tracing.",
		},
		{
			question: "How much can error-budget alerting improve MTTR?",
			answer:
				"One team cut MTTR from 45 minutes to under 8 minutes by switching from average-based alerting to percentile-based alerts with error budgets. Static thresholds fire too late or too often.",
		},
	],

	"rest-api-design-mistakes": [
		{
			question: "What are the most common REST API design mistakes?",
			answer:
				"Inconsistent naming, leaking database IDs, broken pagination, missing idempotency, poor error responses, no versioning strategy, and bolted-on authentication. All seven appeared in 90% of APIs I've audited.",
		},
		{
			question: "Why should API IDs not expose database primary keys?",
			answer:
				"Sequential integer IDs leak user count, enable enumeration attacks, and lock you into your current database. Use opaque ULIDs or UUIDs that stay stable across datastore migrations.",
		},
		{
			question: "When should I add idempotency keys to API mutations?",
			answer:
				"On every POST, PUT, PATCH, and DELETE that has side effects. Client-generated idempotency keys let retries be safe. Without them, network timeouts cause duplicate charges and double-created records.",
		},
	],

	"rsc-edge-death-of-waterfall": [
		{
			question: "How do React Server Components eliminate data fetching waterfalls?",
			answer:
				"Server Components query databases directly and stream HTML, skipping the HTML to JS to Fetch to Re-render cycle. Result: sub-50ms TTFB globally with zero client-side fetch waterfall.",
		},
		{
			question: "What JavaScript does a Server Component ship to the browser?",
			answer:
				"Zero. Server Components render on the server and send HTML plus a minimal RSC payload. Only Client Components (marked 'use client') ship JavaScript for hydration and interactivity.",
		},
		{
			question: "Can Server Components replace my entire SPA?",
			answer:
				"Mostly. Keep Client Components for anything needing useState, useEffect, event handlers, or browser APIs. Default everything else to Server Components. The rule: Server for data, Client for interactivity.",
		},
	],

	"saas-reliability-monitoring": [
		{
			question: "What does 99.9% uptime actually mean in real downtime?",
			answer:
				"8.76 hours per year. 43.8 minutes per month. 99.99% is 52.6 minutes per year. Most B2B SaaS contracts target 99.9%; the infrastructure to reach 99.99% is fundamentally different.",
		},
		{
			question: "What are the four golden signals of SaaS observability?",
			answer:
				"Latency (P50/P95/P99), traffic (requests per second), errors (rate and types), and saturation (CPU, memory, connections). Alert on user-impact symptoms, not on causes like high CPU.",
		},
		{
			question: "What observability stack does a seed-stage SaaS need?",
			answer:
				"Sentry for error tracking, Checkly for synthetic monitoring, PagerDuty for alerting. Add Grafana Cloud at Series A. Evaluate Datadog or self-hosted OpenTelemetry at Series B+.",
		},
	],

	"senior-developer-paradox": [
		{
			question: "Why does a senior developer at $150/hr cost less than a junior at $30/hr?",
			answer:
				"Effective cost calculation: junior at 50% rework is $90-100/hr effective. Senior at 10% rework is $175/hr. Factor architectural mistakes the junior makes and the senior saves money.",
		},
		{
			question: "What does poor software quality cost the US economy?",
			answer:
				"CISQ estimates $2.41 trillion annually. Accumulated technical debt alone accounts for $1.52 trillion. The cost is paid in operational failures and legacy system maintenance.",
		},
		{
			question: "Is the 10x developer a myth?",
			answer:
				"Not output-wise, but effectiveness-wise yes. The top 1% aren't 10x more code; they're 10x better at preventing bad code from reaching production via architecture and early review.",
		},
	],

	"soc2-compliance-startup-roadmap": [
		{
			question: "Can a seed-stage startup get SOC 2 in 90 days?",
			answer:
				"Yes for Type I. Total cost: $15-25K for compliance platform plus auditor. Engineering time: 2-4 weeks of focused effort. Skip the $200K consulting engagement; automate evidence collection instead.",
		},
		{
			question: "Should I start with SOC 2 Type I or Type II?",
			answer:
				"Type I. It proves controls exist as of a point in time. Enterprise buyers accept Type I from startups. Pursue Type II afterward with a 3-month observation window.",
		},
		{
			question: "How much time does SOC 2 save on enterprise sales?",
			answer:
				"Without SOC 2: 20-40 hours per 300-500 question security questionnaire. With SOC 2: 5 minutes ('here's our report'). One enterprise deal averages $50-200K ARR, often blocked by questionnaires.",
		},
	],

	"state-management-2026": [
		{
			question: "What is the right React state management stack in 2026?",
			answer:
				"TanStack Query for server state plus Zustand for everything else. Two libraries under 10KB each cover 90% of SaaS application needs. Stop reaching for Redux.",
		},
		{
			question: "Should I use signals instead of Zustand?",
			answer:
				"Not yet. Signals (Preact, SolidJS style) solve fine-grained reactivity without re-renders, but React's adoption story is incomplete and ecosystem support isn't there. Revisit in 12-18 months.",
		},
		{
			question: "Why is putting API data in Redux or Zustand a mistake?",
			answer:
				"You end up reimplementing caching, invalidation, retry logic, and optimistic updates from scratch. Server state has different characteristics than client state and needs TanStack Query or SWR.",
		},
	],

	"tailwind-vs-component-libraries": [
		{
			question: "What is the bundle size cost of Material UI vs Tailwind?",
			answer:
				"Material UI adds roughly 300ms to Time to Interactive through CSS-in-JS runtime overhead. Tailwind purged to just the classes you use ships around 10KB gzipped for a typical app.",
		},
		{
			question: "When should I use a component library over Tailwind?",
			answer:
				"Internal tools and admin dashboards where shipping speed beats customization. Consumer-facing products need Tailwind plus custom components to escape the generic 'looks like every SaaS' trap.",
		},
		{
			question: "What makes shadcn/ui different from component libraries?",
			answer:
				"Copy-paste components you own, built on Radix primitives. No runtime dependency, no version lock, full customization control. It's the middle ground between Tailwind and Material UI.",
		},
	],

	"technical-hiring-framework": [
		{
			question: "What hiring method best predicts engineering performance?",
			answer:
				"Work sample tests (validity coefficient r=0.54), 3x better than years of experience (r=0.18). Schmidt and Hunter's 85 years of personnel selection research is unambiguous.",
		},
		{
			question: "Do unstructured interviews work for hiring engineers?",
			answer:
				"Barely. Unstructured interviews score r=0.38. Structured interviews with consistent questions and rubric scoring hit r=0.51, a 34% improvement that compounds across every hire.",
		},
		{
			question: "What does a bad engineering hire actually cost?",
			answer:
				"30% of first-year salary plus the damage they do. Architectural decisions that need reversal, bugs that ship to production, and team morale erosion compound beyond the direct cost.",
		},
	],

	"tech-stack-capital-allocation": [
		{
			question: "Why treat a tech stack as a capital asset?",
			answer:
				"Labor costs are 50-70% of engineering opex, and your stack determines your hiring pool. Evaluate on TCO, liquidity (talent pool), and depreciation (tech debt rate) like any capital investment.",
		},
		{
			question: "What is the hiring cost of adopting Rust or Elixir?",
			answer:
				"Roles stay open 45-60+ days versus 30-40 for JavaScript or Python. Replacement cost when a critical engineer leaves is fundamentally higher. Constrained ecosystems need business justification.",
		},
		{
			question: "What stack should a seed-stage startup choose?",
			answer:
				"Optimize for speed: Rails, Django, or Next.js. Instagram scaled to 14 million users on PostgreSQL and Python with 3 engineers. Technical novelty is not a competitive advantage.",
		},
	],

	"testing-react-server-components": [
		{
			question: "Why doesn't React Testing Library work for Server Components?",
			answer:
				"RSCs are async, access server-only APIs (headers, cookies, databases), and don't produce a DOM in jsdom. render() was built for Client Components in a browser simulation.",
		},
		{
			question: "What testing strategy works for React Server Components?",
			answer:
				"Unit test data fetching and business logic as plain functions (no React). Integration test via HTTP to the Next.js server (test HTML output). E2E critical flows with Playwright.",
		},
		{
			question: "How much faster is the RSC-native testing approach?",
			answer:
				"Teams that adopted HTTP-based integration tests cut suite runtime by 40% while catching more real bugs. Stop mocking fetch; test actual server behavior through the actual request path.",
		},
	],

	"vector-database-selection": [
		{
			question: "Should I start with pgvector or a dedicated vector database?",
			answer:
				"Start with pgvector. It handles 80% of SaaS AI features up to 5-10M vectors. Dedicated vector DBs are liability overhead unless you need sub-10ms latency or 10M+ vectors.",
		},
		{
			question: "Pinecone, Qdrant, or Weaviate?",
			answer:
				"Pinecone for zero operational overhead. Qdrant for control and self-hosted performance. Weaviate for built-in hybrid search combining vector and keyword matching in one query.",
		},
		{
			question: "How many queries per day justify a dedicated vector database?",
			answer:
				"Thousands per day with strict latency requirements. If your AI feature gets 100 queries per day, pgvector on the database you already run is the right answer. Avoid premature infrastructure.",
		},
	],
};
