// Technology specialization data for pSEO pages
// Demonstrates deep expertise for each technology area

export interface Technology {
	id: string;
	displayName: string;
	whenToUse: string[];
	commonPitfalls: string[];
	bestPractices: string[];
	projectTypes: string[];
	complementaryTech: string[];
	expertiseLevel: string;
	realWorldExample: string;
	targetKeywords: string[];
}

export const technologies: Record<string, Technology> = {
	"react-nextjs": {
		id: "react-nextjs",
		displayName: "React & Next.js",
		whenToUse: [
			"Building SEO-critical marketing sites that need server-side rendering and static generation for optimal Core Web Vitals scores",
			"Developing complex SPAs with nested layouts, parallel routes, and intercepting routes (Next.js 14+ App Router patterns)",
			"Creating hybrid applications that mix static pages (blog, docs) with dynamic authenticated sections (dashboard, admin)",
			"Projects requiring incremental static regeneration (ISR) for content that updates hourly/daily without full rebuilds",
			"Applications needing edge runtime deployment for sub-50ms TTFB globally via Vercel Edge or Cloudflare Pages",
			"Teams wanting a unified full-stack framework with API routes, middleware, and server actions in one codebase",
			"Building design systems where React Server Components reduce client bundle size by 40-60% vs traditional SPAs",
		],
		commonPitfalls: [
			"Mixing 'use client' and server components incorrectly—putting client boundaries too high in the tree negates RSC benefits entirely",
			"Using useEffect for data fetching in App Router when server components or the fetch API with caching would be more efficient",
			"Forgetting that Next.js 14+ fetch requests are cached by default—add { cache: 'no-store' } or revalidate options explicitly",
			"Over-relying on useState/useReducer for server state—React Query or SWR handle cache invalidation, optimistic updates, and background refetching",
			"Not understanding the streaming/suspense model—wrapping dynamic content in Suspense boundaries prevents blocking the entire page",
			"Deploying to Vercel without understanding the 10-second function timeout on Hobby tier (use edge functions or upgrade for long operations)",
			"Using next/image without proper sizing hints causes layout shift; always specify width/height or use fill with aspect-ratio CSS",
		],
		bestPractices: [
			"Structure components as Server Components by default; only add 'use client' when you need hooks, event handlers, or browser APIs",
			"Use generateStaticParams for dynamic routes that can be pre-rendered at build time—reduces server load and improves TTFB",
			"Implement parallel data fetching with Promise.all or parallel route segments instead of waterfall requests",
			"Leverage server actions for mutations—they provide built-in CSRF protection and eliminate the need for separate API routes",
			"Use next/dynamic with { ssr: false } for heavy client-only libraries (charts, rich text editors) to keep initial bundle lean",
			"Configure next.config.js with strict image domains, security headers, and bundle analyzer for production audits",
			"Implement error.tsx and loading.tsx at each route segment for granular error boundaries and loading states",
		],
		projectTypes: [
			"SaaS applications with marketing site + authenticated dashboard",
			"E-commerce platforms requiring SEO and dynamic inventory",
			"Content-heavy sites (blogs, documentation, news portals)",
			"Multi-tenant platforms with subdomain routing",
			"Progressive web apps with offline-first capabilities",
			"Developer tools and internal dashboards",
		],
		complementaryTech: [
			"TypeScript (essential for type-safe props and API contracts)",
			"Tailwind CSS (utility-first styling with excellent tree-shaking)",
			"Prisma or Drizzle (type-safe database access)",
			"React Query/TanStack Query (server state management)",
			"Zustand or Jotai (lightweight client state)",
			"Vercel or Cloudflare Pages (optimized deployment)",
		],
		expertiseLevel:
			"Production experience since Next.js 9 (2019), migrated multiple codebases through Pages Router to App Router. Deep understanding of React 18 concurrent features, RSC streaming, and the compile-time optimizations in Next.js 14/15. Built systems handling 10M+ monthly page views with perfect Lighthouse scores.",
		realWorldExample:
			"PhotoKeep Pro's marketing site demonstrates advanced Next.js patterns. The public pages use static generation with ISR (revalidate: 3600) for pricing and feature content that updates without deployments. The authenticated dashboard uses React Server Components for the photo gallery—thumbnails render server-side while the interactive editor loads client-side with dynamic imports. I implemented parallel route segments so users can open a photo detail modal (/gallery/@modal/[photoId]) without losing scroll position in the gallery. The API routes handle multipart uploads with streaming to R2 storage, with edge middleware performing JWT validation before requests hit the origin. Build time dropped from 8 minutes to 90 seconds after migrating from Pages Router by leveraging partial prerendering and on-demand ISR for user-generated content. The result: 98 Lighthouse performance score, 180ms LCP, and zero CLS.",
		targetKeywords: [
			"next.js developer",
			"react developer for hire",
			"next.js app router expert",
			"react server components consultant",
			"next.js 14 migration",
			"react performance optimization",
			"next.js seo specialist",
			"full stack react developer",
		],
	},

	"python-fastapi": {
		id: "python-fastapi",
		displayName: "Python & FastAPI",
		whenToUse: [
			"Building high-performance async APIs that need to handle 10K+ concurrent connections with minimal resource usage",
			"AI/ML inference servers where Python's ecosystem (PyTorch, TensorFlow, transformers) is non-negotiable",
			"Data processing pipelines that benefit from NumPy, Pandas, and scientific computing libraries",
			"Projects requiring automatic OpenAPI/Swagger documentation generated from type hints",
			"Microservices that need sub-millisecond routing overhead (FastAPI uses Starlette, one of the fastest ASGI frameworks)",
			"Teams with data scientists who need to deploy models without learning a new language",
			"Real-time applications using WebSockets with proper async handling and connection management",
		],
		commonPitfalls: [
			"Blocking the event loop with synchronous code—use run_in_executor or dedicated thread pools for CPU-bound work",
			"Not understanding that FastAPI's dependency injection runs per-request; use lifespan handlers for app-level resources",
			"Forgetting that Pydantic v2 has breaking changes from v1—model_dump() replaces dict(), model_validate() replaces parse_obj()",
			"Using global database connections without proper async session management causes connection pool exhaustion under load",
			"Deploying with uvicorn --reload in production instead of gunicorn with uvicorn workers for proper process management",
			"Not setting up proper CORS middleware early—preflight requests fail silently, causing confusing frontend errors",
			"Ignoring the GIL for CPU-bound ML inference—use multiprocessing, Celery workers, or dedicated inference servers",
		],
		bestPractices: [
			"Use async def for I/O-bound endpoints (database, HTTP calls) and def for CPU-bound operations (FastAPI handles threading)",
			"Implement proper dependency injection for database sessions, authentication, and rate limiting—makes testing trivial",
			"Structure projects with routers (APIRouter) for domain separation: /api/v1/users, /api/v1/auth, /api/v1/ml",
			"Use Pydantic's Field() for validation constraints, examples, and OpenAPI schema customization in one place",
			"Implement background tasks for non-blocking operations; use Celery/Redis for anything taking >30 seconds",
			"Set up proper logging with structlog or loguru, including request IDs for distributed tracing",
			"Use httpx.AsyncClient for outbound HTTP with connection pooling instead of requests (which blocks)",
		],
		projectTypes: [
			"AI/ML inference APIs and model serving",
			"Data processing and ETL pipelines",
			"Real-time WebSocket applications",
			"High-throughput microservices",
			"Scientific computing backends",
			"Automation and scraping orchestration",
		],
		complementaryTech: [
			"PyTorch/TensorFlow (ML model training and inference)",
			"Celery + Redis (distributed task queues)",
			"SQLAlchemy 2.0 or Tortoise ORM (async database)",
			"Pydantic (data validation and serialization)",
			"Docker (containerization for ML dependencies)",
			"NVIDIA Triton (production ML inference)",
		],
		expertiseLevel:
			"Building FastAPI services since 0.60.0 (2020), contributed to open-source FastAPI projects. Expert in async Python patterns, GPU memory management for ML inference, and building systems that handle thousands of concurrent connections. Deployed FastAPI services processing 50M+ API calls monthly.",
		realWorldExample:
			"PhotoKeep Pro's backend exemplifies production FastAPI architecture. The service orchestrates 14 deep learning models (SUPIR, HAT, CodeFormer, GFPGAN, DDColor) on a 49GB VRAM GPU, requiring careful memory management. I implemented a lazy-loading model registry with LRU eviction—models load on first request and unload when VRAM pressure exceeds 80%. The API uses FastAPI's dependency injection for GPU semaphores, ensuring only one inference runs per model at a time to prevent OOM crashes. Background tasks handle the actual processing: the endpoint returns a job ID immediately, Celery workers pick up the task, and clients poll or receive webhooks on completion. For real-time progress, I implemented SSE (Server-Sent Events) endpoints streaming processing stages. The result: 99.95% uptime, 28.5dB PSNR restoration quality (beating Magnific AI), and P95 latency under 200ms for the API layer while ML inference runs asynchronously.",
		targetKeywords: [
			"fastapi developer",
			"python api developer",
			"python backend developer",
			"fastapi consultant",
			"python ml engineer",
			"async python expert",
			"python microservices developer",
			"ai api development",
		],
	},

	"nodejs-express": {
		id: "nodejs-express",
		displayName: "Node.js & Express",
		whenToUse: [
			"Building real-time applications (chat, collaboration, live updates) where WebSocket integration is critical",
			"JavaScript/TypeScript fullstack projects where sharing types and validation logic between frontend and backend reduces bugs",
			"Rapid prototyping where npm's ecosystem provides pre-built solutions for authentication, payments, and integrations",
			"BFF (Backend For Frontend) layers that aggregate multiple microservices into client-specific APIs",
			"Serverless deployments on AWS Lambda, Vercel Edge Functions, or Cloudflare Workers where cold start matters",
			"I/O-heavy applications (file uploads, API proxies, webhooks) that benefit from Node's non-blocking model",
			"Projects with junior teams familiar with JavaScript who need to ship backend features quickly",
		],
		commonPitfalls: [
			"Blocking the event loop with synchronous operations—never use fs.readFileSync or heavy JSON parsing in request handlers",
			"Not handling promise rejections properly—unhandled rejections crash Node 15+ by default, use express-async-errors middleware",
			"Memory leaks from unclosed event listeners, database connections, or caching without TTL—use clinic.js for diagnosis",
			"Using callback-based patterns in 2024—async/await is standard, but mixing with callbacks creates 'callback hell 2.0'",
			"Not implementing proper graceful shutdown—SIGTERM handlers must drain connections before exiting",
			"Trusting req.body without validation—always use Zod, Joi, or class-validator before processing input",
			"Running CPU-intensive tasks (image processing, encryption) in the main thread instead of worker_threads",
		],
		bestPractices: [
			"Use TypeScript with strict mode—Node.js type errors at runtime are the #1 cause of production incidents",
			"Structure with controllers, services, and repositories layers; avoid fat controllers with business logic",
			"Implement centralized error handling middleware that logs errors and returns consistent API responses",
			"Use helmet.js for security headers, cors for CORS, and express-rate-limit for DDoS protection",
			"Leverage Node 20+ built-in test runner and --experimental-vm-modules for ESM compatibility in tests",
			"Use pino for logging (10x faster than winston) with correlation IDs for distributed tracing",
			"Implement health check endpoints (/health, /ready) that verify database and external service connectivity",
		],
		projectTypes: [
			"Real-time collaboration platforms",
			"API gateways and BFF services",
			"Webhook processors and integrations",
			"Rapid MVP prototypes",
			"Serverless functions and edge workers",
			"Internal tools and admin dashboards",
		],
		complementaryTech: [
			"TypeScript (type safety for large codebases)",
			"Socket.io or ws (WebSocket handling)",
			"Prisma or Drizzle (type-safe ORM)",
			"Zod (runtime type validation)",
			"Redis (caching, sessions, pub/sub)",
			"Docker (consistent deployment environments)",
		],
		expertiseLevel:
			"Node.js developer since v0.12 (2015), witnessed the ES6 revolution, CommonJS to ESM migration, and callback hell to async/await evolution. Built systems handling 100K+ concurrent WebSocket connections, optimized Node.js memory usage for long-running processes, and debugged production memory leaks with V8 heap snapshots.",
		realWorldExample:
			"Claude Pilot's tRPC backend demonstrates modern Node.js patterns. The Electron app uses a Node.js backend with 25 tRPC controllers handling session management, memory browsing (PostgreSQL, Memgraph, Qdrant), and MCP server orchestration. I chose tRPC over REST/GraphQL for end-to-end type safety—changing a procedure's return type immediately shows TypeScript errors in the React frontend. The system manages multiple long-running MCP server processes, requiring careful child_process handling with proper stdio piping and graceful shutdown. For the memory browser, I implemented connection pooling across three different databases, with health checks ensuring the UI shows accurate connection status. WebSocket channels provide real-time log streaming from MCP servers to the terminal component. The codebase achieves 80% test coverage using Vitest, with integration tests spinning up actual database containers via testcontainers-node.",
		targetKeywords: [
			"node.js developer",
			"express.js developer",
			"javascript backend developer",
			"typescript backend developer",
			"node.js consultant",
			"real-time app developer",
			"websocket developer",
			"trpc developer",
		],
	},

	postgresql: {
		id: "postgresql",
		displayName: "PostgreSQL",
		whenToUse: [
			"Applications requiring ACID compliance where data integrity is non-negotiable (financial, healthcare, legal)",
			"Complex queries with JOINs across multiple tables—Postgres query planner handles 10-way joins efficiently",
			"Full-text search requirements using tsvector/tsquery before reaching for Elasticsearch",
			"Geospatial applications with PostGIS extension for location queries, polygon intersections, and routing",
			"Time-series data with TimescaleDB extension when you need relational features alongside time-series optimization",
			"JSON document storage with JSONB when you need NoSQL flexibility with relational guarantees",
			"Multi-tenant SaaS applications using row-level security (RLS) for tenant isolation",
		],
		commonPitfalls: [
			"Not understanding MVCC—UPDATE creates new row versions, leading to table bloat without regular VACUUM",
			"Using SELECT * in production—always specify columns to avoid fetching unnecessary data and breaking on schema changes",
			"Forgetting that LIKE '%term%' can't use indexes—use trigram indexes (pg_trgm) or full-text search instead",
			"Creating indexes without CONCURRENTLY flag—blocks writes on large tables for minutes or hours",
			"Not setting connection pool size correctly—max_connections default (100) is too low for production",
			"Using ORM-generated queries without EXPLAIN ANALYZE—ORMs generate N+1 queries and inefficient JOINs",
			"Storing large blobs in tables instead of external storage—bloats WAL and slows backups",
		],
		bestPractices: [
			"Use UUIDs (uuid_generate_v4) for primary keys in distributed systems; BIGSERIAL for single-instance performance",
			"Implement proper indexing strategy: B-tree for equality/range, GIN for arrays/JSONB/full-text, GiST for geometry",
			"Use CTEs (WITH clauses) for complex queries but understand they're optimization fences in Postgres <12",
			"Leverage LISTEN/NOTIFY for real-time updates instead of polling; pairs well with pg_notify triggers",
			"Configure pgBouncer for connection pooling—transaction mode for serverless, session mode for prepared statements",
			"Use pg_stat_statements extension to identify slow queries and index opportunities",
			"Implement database migrations with version control (Prisma Migrate, golang-migrate, or Flyway)",
		],
		projectTypes: [
			"Financial applications requiring ACID guarantees",
			"Multi-tenant SaaS platforms",
			"Geospatial and mapping applications",
			"Analytics and reporting systems",
			"Content management systems",
			"E-commerce platforms with complex inventory",
		],
		complementaryTech: [
			"pgBouncer (connection pooling)",
			"TimescaleDB (time-series extension)",
			"PostGIS (geospatial extension)",
			"pg_cron (scheduled jobs)",
			"Prisma or Drizzle (type-safe ORM)",
			"Supabase or Neon (managed Postgres)",
		],
		expertiseLevel:
			"PostgreSQL administrator and developer since version 9.4 (2014). Experience with logical replication, partitioning strategies, and performance tuning for billion-row tables. Designed schemas handling 50K+ transactions per second, optimized queries from minutes to milliseconds using EXPLAIN ANALYZE, and implemented zero-downtime migrations for production systems.",
		realWorldExample:
			"The PhotoKeep Pro billing system showcases PostgreSQL's strengths. The schema uses row-level security (RLS) for multi-tenant isolation—each customer's data is automatically filtered by tenant_id without application code changes. Credits and transactions use SERIALIZABLE isolation level to prevent double-spending race conditions. I implemented a JSONB column for storing ML model parameters, allowing flexible configuration per restoration job while maintaining queryability (CREATE INDEX ON jobs USING GIN (params jsonb_path_ops)). For usage analytics, I partitioned the events table by month using declarative partitioning, with a pg_cron job that creates future partitions and drops old ones. The subscription status uses a materialized view refreshed every 15 minutes, joining Stripe webhook events with internal user data. Query times for the admin dashboard dropped from 12 seconds to 80ms after adding partial indexes on status columns where status = 'active'.",
		targetKeywords: [
			"postgresql developer",
			"postgres consultant",
			"database architect",
			"postgresql performance tuning",
			"postgres migration specialist",
			"sql database developer",
			"postgresql dba",
			"database optimization expert",
		],
	},

	"ai-ml-integration": {
		id: "ai-ml-integration",
		displayName: "AI/ML Integration",
		whenToUse: [
			"Adding intelligent features to existing applications—search enhancement, content generation, anomaly detection",
			"Building RAG (Retrieval-Augmented Generation) systems that combine LLMs with proprietary knowledge bases",
			"Implementing semantic search using vector embeddings when keyword matching fails for natural language queries",
			"Automating workflows with AI agents that can reason, plan, and execute multi-step tasks",
			"Processing unstructured data (documents, images, audio) at scale using purpose-built ML models",
			"Creating conversational interfaces where context understanding and response quality matter",
			"Enhancing user experience with personalization, recommendations, or predictive features",
		],
		commonPitfalls: [
			"Using GPT-4 for everything—smaller models (GPT-3.5, Claude Haiku, Mistral) are 10-100x cheaper for simple tasks",
			"Not implementing proper prompt versioning—prompt changes can break production without tracking",
			"Ignoring embedding model choice—text-embedding-3-small vs ada-002 have different dimension/quality tradeoffs",
			"Building RAG without hybrid search—combine vector similarity with BM25 keyword matching for better recall",
			"Not chunking documents properly—512-1024 tokens with 50-100 token overlap prevents context splitting",
			"Forgetting that LLM outputs are non-deterministic—use seed parameter and temperature=0 for reproducibility",
			"Underestimating inference costs—a viral feature using GPT-4 can cost $10K/day without rate limiting",
		],
		bestPractices: [
			"Use structured outputs (function calling, JSON mode) instead of parsing free-form LLM text—eliminates regex failures",
			"Implement tiered model routing: fast/cheap models for classification, expensive models for complex reasoning",
			"Cache embeddings and LLM responses aggressively—identical inputs should hit cache, not API",
			"Build evaluation pipelines before production—measure accuracy, latency, and cost on representative datasets",
			"Use streaming responses for chat interfaces—perceived latency drops dramatically with token-by-token display",
			"Implement fallback chains: primary model fails → retry with higher temperature → fallback model → human escalation",
			"Version prompts like code: git-tracked templates with variable injection, not hardcoded strings",
		],
		projectTypes: [
			"Intelligent search and knowledge retrieval",
			"Content generation and summarization",
			"Conversational AI and chatbots",
			"Document processing and extraction",
			"AI-powered automation workflows",
			"Recommendation and personalization systems",
		],
		complementaryTech: [
			"OpenAI API or Anthropic Claude (LLM providers)",
			"Pinecone, Qdrant, or pgvector (vector databases)",
			"LangChain or LlamaIndex (LLM orchestration)",
			"Hugging Face Transformers (open models)",
			"Redis (caching embeddings and responses)",
			"Celery/Redis (async inference queues)",
		],
		expertiseLevel:
			"Building AI-integrated systems since GPT-3 (2020). Deep experience with LLM prompt engineering, RAG architectures, and embedding-based search. Trained custom models using LoRA/QLoRA fine-tuning, deployed inference servers handling 1M+ daily requests, and built evaluation frameworks measuring AI quality at scale.",
		realWorldExample:
			"PenQWEN demonstrates advanced AI/ML integration. The project required a custom cybersecurity LLM that could understand domain terminology, execute tool calls, and maintain operational security awareness. I implemented a two-stage fine-tuning pipeline: first, continued pre-training on 12GB of curated security corpus (CVE databases, penetration testing guides, threat intelligence reports) to inject domain knowledge. Second, supervised fine-tuning for agentic behavior—the model learned to call tools (nmap, metasploit modules) and reason about OPSEC implications. The training used Qwen2.5-7B as the base with LoRA adapters (rank=64, alpha=128), resulting in 3.6GB of trainable weights. For deployment, I built a FastAPI inference server with dynamic LoRA loading—the base model stays in VRAM while task-specific adapters swap in 200ms. The RAG component uses Qdrant for retrieval over exploit databases, with hybrid search combining dense embeddings (bge-large-en-v1.5) and sparse BM25. The result: a specialized model that outperforms GPT-4 on cybersecurity tasks at 1/10th the inference cost.",
		targetKeywords: [
			"ai integration developer",
			"llm engineer",
			"rag developer",
			"ai/ml consultant",
			"chatbot developer",
			"vector database specialist",
			"ai api integration",
			"machine learning engineer",
		],
	},

	"cloud-architecture": {
		id: "cloud-architecture",
		displayName: "Cloud Architecture",
		whenToUse: [
			"Designing systems that must scale from 100 to 100,000 users without architecture changes",
			"Implementing multi-region deployments for disaster recovery and latency optimization",
			"Building serverless architectures where pay-per-use economics outweigh always-on servers",
			"Creating edge-first applications that serve content from 200+ global PoPs for sub-50ms latency",
			"Designing microservices that need independent scaling, deployment, and technology choices",
			"Implementing hybrid cloud strategies for compliance (data residency) or cost optimization",
			"Building event-driven architectures with async processing and decoupled services",
		],
		commonPitfalls: [
			"Over-engineering: starting with Kubernetes when a single VPS handles your traffic—complexity has maintenance cost",
			"Ignoring egress costs—moving data between regions or clouds can cost more than compute",
			"Not understanding cold starts—Lambda/Cloud Functions add 100-500ms latency on first invocation",
			"Using managed services without understanding pricing tiers—Aurora Serverless v1 scales to $0 but can also scale to $10K/day",
			"Neglecting observability—distributed systems need distributed tracing, not just logs",
			"Assuming cloud providers are always available—design for AZ failures and have runbooks ready",
			"Not implementing proper IAM—overly permissive roles are the #1 cloud security vulnerability",
		],
		bestPractices: [
			"Start simple: monolith on managed services (RDS, Cloud Run) → extract services only when scaling demands",
			"Use infrastructure as code (Terraform, Pulumi) from day one—manual console changes don't scale",
			"Implement the 12-factor app principles: config in environment, stateless processes, port binding",
			"Design for failure: circuit breakers, retry with exponential backoff, graceful degradation",
			"Use CDN edge caching aggressively—static assets, API responses with proper Cache-Control headers",
			"Implement cost monitoring and alerts—cloud bills can 10x overnight from a bug or attack",
			"Choose regions based on customer location, compliance requirements, and service availability",
		],
		projectTypes: [
			"Global SaaS platforms",
			"High-traffic consumer applications",
			"Enterprise integration platforms",
			"Real-time data processing pipelines",
			"Multi-tenant B2B platforms",
			"Edge computing applications",
		],
		complementaryTech: [
			"Terraform or Pulumi (infrastructure as code)",
			"Docker and Kubernetes (containerization)",
			"Cloudflare (CDN, Workers, R2)",
			"AWS Lambda or Cloud Run (serverless)",
			"DataDog or Grafana Cloud (observability)",
			"GitHub Actions or GitLab CI (CI/CD)",
		],
		expertiseLevel:
			"Cloud architect with certifications in AWS (Solutions Architect Professional) and hands-on experience across AWS, GCP, and Cloudflare. Designed systems handling 50M+ monthly requests, implemented zero-downtime deployments with blue-green strategies, and reduced cloud costs by 60% through right-sizing and reserved capacity planning.",
		realWorldExample:
			"The TraceForge deployment showcases pragmatic cloud architecture. The service runs on Cloudflare Pages (frontend) with a Python FastAPI backend on a dedicated GPU server. Rather than over-engineering with Kubernetes, I chose a simple architecture: Cloudflare handles global CDN, DDoS protection, and edge caching for the static Next.js app. The API runs behind Cloudflare Tunnel (zero-trust access without public IP), with R2 for file storage (no egress fees). For the GPU-intensive vectorization, requests go through a Redis queue, allowing the single GPU server to process jobs without timeout issues. The clever part: Cloudflare Workers handle request validation and queue submission at the edge, returning job IDs in <50ms globally, while the actual processing happens asynchronously. Cost breakdown: $0 for Pages hosting, $5/month for Workers, $0.015/GB for R2 storage—total cloud bill under $20/month despite serving 100K+ conversions. The architecture handles traffic spikes gracefully because the queue absorbs bursts while the GPU processes at constant throughput.",
		targetKeywords: [
			"cloud architect",
			"aws developer",
			"cloud infrastructure consultant",
			"devops engineer",
			"serverless developer",
			"cloudflare developer",
			"cloud migration specialist",
			"infrastructure engineer",
		],
	},

	typescript: {
		id: "typescript",
		displayName: "TypeScript",
		whenToUse: [
			"Any JavaScript project larger than a single file—the tooling benefits pay off immediately",
			"Teams with more than one developer where code contracts prevent integration bugs",
			"Projects with complex data structures (API responses, database models, state shapes)",
			"Refactoring legacy JavaScript codebases where types reveal hidden bugs",
			"Building libraries or SDKs where consumers need accurate type definitions",
			"Full-stack projects where sharing types between frontend and backend eliminates entire bug classes",
			"Long-lived codebases where future maintainers need to understand data flow",
		],
		commonPitfalls: [
			"Using 'any' as an escape hatch—it spreads virally, defeating the purpose of TypeScript",
			"Not enabling strict mode from the start—retrofitting strictNullChecks to a large codebase is painful",
			"Over-engineering types with excessive generics—readability matters more than type gymnastics",
			"Forgetting that TypeScript types are erased at runtime—use Zod/io-ts for runtime validation",
			"Using enums when const objects or union types would be simpler and more tree-shakeable",
			"Not understanding type narrowing—TypeScript can infer types after conditionals, use it",
			"Ignoring strict function types—bivariance in function parameters causes subtle bugs",
		],
		bestPractices: [
			"Enable strict mode and all strict flags: strictNullChecks, noImplicitAny, strictFunctionTypes",
			"Use type inference where possible—don't annotate variables when TypeScript can figure it out",
			"Prefer interfaces for object shapes, type aliases for unions, functions, and complex types",
			"Use const assertions (as const) for literal types and readonly arrays",
			"Leverage utility types: Partial<T>, Required<T>, Pick<T, K>, Omit<T, K>, Record<K, V>",
			"Use discriminated unions for state machines and API responses with different shapes",
			"Implement branded types for IDs to prevent mixing user IDs with post IDs at compile time",
		],
		projectTypes: [
			"Large-scale web applications",
			"Node.js backend services",
			"React component libraries",
			"CLI tools and developer utilities",
			"Shared packages in monorepos",
			"API clients and SDKs",
		],
		complementaryTech: [
			"ESLint with @typescript-eslint (linting)",
			"Zod (runtime validation with type inference)",
			"Prisma (database types generated from schema)",
			"tRPC (end-to-end type safety)",
			"Vitest (TypeScript-native testing)",
			"ts-node or tsx (TypeScript execution)",
		],
		expertiseLevel:
			"TypeScript developer since version 2.0 (2016), witnessed the evolution from optional typing to strict mode becoming standard. Expert in advanced type system features: conditional types, mapped types, template literal types, and type inference. Built type-safe codebases with 500K+ lines and zero 'any' types in strict mode.",
		realWorldExample:
			"Claude Pilot's codebase demonstrates TypeScript's power for developer tools. The Electron app shares types between main process, renderer, and tRPC backend—changing a database schema updates types across the entire stack instantly. I implemented branded types for different ID types: type UserId = string & { __brand: 'UserId' }. This catches bugs at compile time where you'd accidentally pass a SessionId to a function expecting a UserId. The tRPC procedures use Zod schemas that TypeScript infers types from: const input = z.object({ sessionId: SessionId }), and the return type is inferred from the procedure implementation. For the memory browser, I used discriminated unions to model different database connections: type Connection = PostgresConnection | MemgraphConnection | QdrantConnection, with each having specific properties. TypeScript narrows the type after checking connection.type, providing autocomplete for database-specific methods. The result: 80% test coverage but honestly the type system catches more bugs than tests do—refactoring is fearless because the compiler validates everything.",
		targetKeywords: [
			"typescript developer",
			"typescript consultant",
			"javascript to typescript migration",
			"type-safe api developer",
			"typescript architect",
			"frontend typescript expert",
			"typescript trainer",
			"strict typescript development",
		],
	},

	graphql: {
		id: "graphql",
		displayName: "GraphQL",
		whenToUse: [
			"Mobile applications where minimizing network payload and round trips directly impacts battery and data usage",
			"Frontend-heavy teams that need to iterate on data requirements without backend changes",
			"Applications with complex, interconnected data where REST would require multiple round trips",
			"Building public APIs where clients have diverse data needs you can't predict",
			"Microservices architectures using Apollo Federation to compose a unified graph from multiple services",
			"Real-time features requiring subscriptions with typed, selective data streaming",
			"Internal tools where rapid iteration matters more than caching simplicity",
		],
		commonPitfalls: [
			"N+1 query problem—naive resolvers fetch data per-item instead of batching; always use DataLoader",
			"Allowing unbounded queries—without depth limiting and complexity analysis, clients can DoS your server",
			"Over-fetching at the resolver level—resolving fields that aren't requested wastes database queries",
			"Not understanding the performance implications of resolver chains—each field can trigger a database call",
			"Using GraphQL for simple CRUD where REST would be simpler with better HTTP caching",
			"Ignoring persisted queries for production—parsing and validating queries on every request is expensive",
			"Exposing database schema directly—GraphQL schema should model domain concepts, not tables",
		],
		bestPractices: [
			"Use DataLoader for batching and caching database fetches within a single request",
			"Implement query complexity analysis to reject expensive queries before execution",
			"Design schema with domain modeling principles—don't expose internal implementation details",
			"Use code-first schema generation (TypeGraphQL, Pothos) for type safety between schema and resolvers",
			"Implement field-level authorization, not just query-level—some fields may be restricted",
			"Use persisted queries in production to improve performance and security (no arbitrary queries)",
			"Leverage fragments for reusable field selections in client code",
		],
		projectTypes: [
			"Mobile applications with complex data needs",
			"Dashboard and analytics platforms",
			"E-commerce with complex product relationships",
			"Social platforms with interconnected data",
			"Developer APIs and platforms",
			"Federated microservices architectures",
		],
		complementaryTech: [
			"Apollo Server/Client (full-stack GraphQL)",
			"Pothos or TypeGraphQL (code-first schemas)",
			"DataLoader (N+1 prevention)",
			"GraphQL Code Generator (type generation)",
			"Apollo Federation (microservices composition)",
			"urql (lightweight alternative to Apollo Client)",
		],
		expertiseLevel:
			"GraphQL developer since the GitHub API v4 launch (2017). Built schemas serving 10M+ queries daily, implemented Federation gateways composing 8 subgraphs, and optimized resolver performance using DataLoader patterns and query analysis. Experience with both schema-first (SDL) and code-first approaches.",
		realWorldExample:
			"A marketplace platform I built demonstrates GraphQL's strengths and pitfalls. The schema modeled products, sellers, reviews, and orders—highly interconnected data where REST would require N+1 endpoints or bloated nested responses. I implemented Apollo Federation with three subgraphs: catalog (products, categories), users (profiles, authentication), and orders (transactions, payments). The gateway composes these into a unified schema, but each team owns their subgraph independently. The key optimization was DataLoader everywhere: a query for 50 products with their sellers and average ratings batches into three database queries instead of 150. I implemented query complexity limits (max cost: 1000) calculated from field weights—fetching all products with all reviews could cost millions, so we reject those queries. For the mobile app, persisted queries reduced payload size by 60% (sending a hash instead of the full query string) and allowed us to deprecate fields without breaking older app versions. The subscription system handles real-time order updates using Redis pub/sub behind GraphQL subscriptions, delivering updates to 10K concurrent connections.",
		targetKeywords: [
			"graphql developer",
			"graphql api developer",
			"apollo developer",
			"graphql consultant",
			"graphql schema designer",
			"federated graphql architect",
			"graphql optimization expert",
			"api developer",
		],
	},
};

// Helper: get all technology IDs
export function getTechnologyIds(): string[] {
	return Object.keys(technologies);
}

// Helper: get technology by ID
export function getTechnology(id: string): Technology | undefined {
	return technologies[id];
}

// Helper: search technologies by keyword
export function searchTechnologies(keyword: string): Technology[] {
	const lowercaseKeyword = keyword.toLowerCase();
	return Object.values(technologies).filter(
		(tech) =>
			tech.displayName.toLowerCase().includes(lowercaseKeyword) ||
			tech.targetKeywords.some((kw) => kw.includes(lowercaseKeyword)) ||
			tech.projectTypes.some((pt) => pt.toLowerCase().includes(lowercaseKeyword))
	);
}

// Helper: get technologies for a project type
export function getTechnologiesForProjectType(projectType: string): Technology[] {
	const lowercaseType = projectType.toLowerCase();
	return Object.values(technologies).filter((tech) =>
		tech.projectTypes.some((pt) => pt.toLowerCase().includes(lowercaseType))
	);
}
