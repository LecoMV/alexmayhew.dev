// Unified project data - single source of truth
// Used by: /work page, terminal commands, case studies

export const categories = ["All", "AI/ML", "SaaS", "Web Apps", "Developer Tools"] as const;
export type Category = (typeof categories)[number];
export type ProjectCategory = Exclude<Category, "All">;

export interface RelatedService {
	label: string; // Contextual anchor text
	href: string; // Link to service page
}

export interface CaseStudy {
	published: boolean;
	subtitle: string;
	context: {
		duration: string;
		industry: string;
		type: string;
	};
	challenge: string;
	approach: string;
	solution: string;
	metrics: {
		label: string;
		value: string;
		context: string;
	}[];
	techDecisions: {
		component: string;
		technology: string;
		rationale: string;
	}[];
	challenges: {
		title: string;
		problem: string;
		solution: string;
	}[];
	takeaways: string[];
}

export interface Project {
	id: string;
	title: string;
	description: string;
	category: ProjectCategory;
	tech: string[];
	year: string;
	status: "Production" | "Development" | "Concept";
	link?: string;
	github?: string;
	featured?: boolean;
	relatedServices?: RelatedService[]; // Internal links for SEO
	caseStudy?: CaseStudy;
}

export const projects: Project[] = [
	{
		id: "traceforge",
		title: "TraceForge",
		description:
			"Cut vector conversion time from 45 minutes to 8 seconds per asset—a 337x speedup. Design teams were hemorrhaging billable hours manually tracing logos and icons in Illustrator. Built a GPU-accelerated pipeline combining neural upscaling with dual vectorization engines (Potrace + VTracer), plus an SVGO optimization stage that reduces file sizes by 40-60%. Now processing 2,000+ conversions monthly with zero manual intervention.",
		category: "Developer Tools",
		tech: ["Python", "FastAPI", "Potrace", "VTracer", "CUDA", "SVGO", "React", "TypeScript"],
		year: "2025",
		status: "Production",
		link: "/tools/traceforge",
		featured: true,
		relatedServices: [
			{
				label: "Python performance optimization",
				href: "/services/python-developer-for-healthcare",
			},
			{
				label: "337x performance engineering",
				href: "/services/performance-optimization-consultant",
			},
		],
		caseStudy: {
			published: true,
			subtitle: "337x faster raster-to-SVG conversion with GPU-accelerated dual-engine pipeline",
			context: {
				duration: "8 weeks",
				industry: "Developer Tools",
				type: "Open Source",
			},
			challenge:
				"Design teams at agencies and product companies were spending 45+ minutes per asset manually tracing rasters in Illustrator. Existing automated tools like Adobe's Live Trace produced noisy output requiring extensive cleanup. Batch processing didn't exist—each asset required individual attention. For teams processing hundreds of brand assets during rebrands or design system migrations, this meant weeks of tedious manual work. The core technical problem: raster-to-vector conversion requires understanding image topology, not just edge detection. Single-algorithm approaches either over-simplify (losing detail) or over-trace (creating thousands of unnecessary nodes).",
			approach:
				"Started by benchmarking every open-source vectorization engine available. Potrace excelled at clean geometric shapes (logos, icons) while VTracer handled photographic complexity better. Rather than picking one, I built a dual-engine architecture letting users choose the right tool per asset. The key insight was that GPU-accelerated neural upscaling before vectorization dramatically improves output quality—feeding a 4x upscaled image to Potrace produces cleaner paths than running Potrace on the original. Built the pipeline on FastAPI with async processing, WebSocket progress streaming for long batch operations, and an SVGO post-processing stage that strips metadata and optimizes path data. Added 14 vectorization presets tuned for different asset types: logos, icons, illustrations, technical drawings, and photographs.",
			solution:
				"TraceForge ships as a self-hosted web application with a React frontend and FastAPI backend. The GPU pipeline handles neural upscaling via CUDA-accelerated models, then routes to either Potrace or VTracer based on user selection or automatic detection. WebSocket connections stream real-time progress for batch operations processing hundreds of assets. The SVGO optimization stage runs 12 plugins that reduce SVG file sizes by 40-60% without visual degradation. Currently processing 2,000+ conversions monthly with zero manual intervention. The entire pipeline runs on a single RTX 3080 with 8-second average processing time per asset—down from 45 minutes of manual work.",
			metrics: [
				{ label: "Processing Speed", value: "337x", context: "45 min to 8 sec per asset" },
				{
					label: "Monthly Volume",
					value: "2,000+",
					context: "Conversions with zero manual intervention",
				},
				{
					label: "Vectorization Models",
					value: "14",
					context: "Presets tuned for different asset types",
				},
				{
					label: "File Size Reduction",
					value: "40-60%",
					context: "Via SVGO optimization pipeline",
				},
			],
			techDecisions: [
				{
					component: "GPU Pipeline",
					technology: "CUDA + Neural Upscaling",
					rationale:
						"4x neural upscaling before vectorization produces dramatically cleaner SVG paths. GPU acceleration makes this practical at batch scale—CPU-only upscaling would add 3-5 minutes per asset, negating the speed advantage.",
				},
				{
					component: "Dual Engine",
					technology: "Potrace + VTracer",
					rationale:
						"No single vectorization algorithm handles all image types well. Potrace excels at geometric shapes with clean edges; VTracer handles photographic complexity with gradient regions. Offering both eliminates the one-size-fits-all compromise.",
				},
				{
					component: "Async Processing",
					technology: "FastAPI + WebSockets",
					rationale:
						"Batch operations processing hundreds of assets need non-blocking execution with real-time progress feedback. FastAPI's native async support with WebSocket streaming gives users immediate visibility into long-running operations.",
				},
			],
			challenges: [
				{
					title: "CUDA Memory Management at Scale",
					problem:
						"Processing large batches caused VRAM exhaustion as PyTorch's memory allocator held onto freed memory between operations.",
					solution:
						"Implemented explicit torch.cuda.empty_cache() between batch items with a memory pressure monitor that triggers garbage collection when VRAM usage exceeds 85%. Added automatic batch size adjustment based on available VRAM.",
				},
				{
					title: "SVG Path Optimization Without Visual Degradation",
					problem:
						"Aggressive SVGO optimization sometimes merged paths that should remain separate, breaking CSS targeting and animation capabilities.",
					solution:
						"Built a custom SVGO plugin configuration that preserves path IDs and class attributes while still optimizing coordinates and removing redundant metadata. Tuned precision settings per asset type—logos get higher precision than decorative illustrations.",
				},
				{
					title: "Consistent Output Across Engine Switches",
					problem:
						"Switching between Potrace and VTracer produced SVGs with different coordinate systems, viewBox sizes, and path winding rules.",
					solution:
						"Added a normalization layer that standardizes output from both engines: consistent viewBox calculations, unified coordinate precision, and path direction normalization. Users get consistent results regardless of which engine processes their asset.",
				},
			],
			takeaways: [
				"GPU parallelism transforms image processing economics—operations that are impractical on CPU become trivial with even a mid-range GPU.",
				"Offering multiple algorithms with sensible defaults beats any single one-size-fits-all approach for creative tools.",
				"WebSocket progress streaming is table stakes for any operation longer than 3 seconds—users will assume the process is broken without real-time feedback.",
				"Post-processing optimization (SVGO) often delivers more practical value than improving the core algorithm—a 40% smaller file loads faster regardless of path quality.",
			],
		},
	},
	{
		id: "claude-pilot",
		title: "Claude Pilot",
		description:
			"Recovered 2+ hours daily lost to context-switching between terminal, database clients, and config files. Claude Code power users were drowning in fragmented tooling—no unified view of sessions, memory state, or MCP server health. Architected a native Electron control center with 25 tRPC endpoints managing PostgreSQL, Memgraph, and Qdrant memory systems. 80% test coverage, zero production incidents since launch.",
		category: "Developer Tools",
		tech: ["Electron", "React", "TypeScript", "tRPC", "Zod", "PostgreSQL", "Memgraph"],
		year: "2025",
		status: "Production",
		link: "/tools/pilot",
		github: "https://github.com/alexmayhew/claude-pilot",
		featured: true,
		relatedServices: [
			{ label: "AI-powered SaaS development", href: "/services/ai-integration-developer-for-saas" },
			{ label: "React enterprise dashboards", href: "/services/react-developer-for-saas" },
		],
		caseStudy: {
			published: true,
			subtitle: "Native Electron control center managing 3 database systems with type-safe IPC",
			context: {
				duration: "Ongoing",
				industry: "Developer Tools",
				type: "Open Source",
			},
			challenge:
				"Claude Code power users manage sessions across multiple projects, each with their own memory state stored across PostgreSQL (structured data), Memgraph (knowledge graphs), and Qdrant (vector embeddings). Without a unified dashboard, developers context-switch between terminal sessions, database clients, and config files constantly. There's no way to visualize the knowledge graph, inspect memory health, or manage MCP server configurations without diving into raw database queries. The typical workflow involves 4-5 separate tools just to understand the state of a single project's AI memory. For developers running Claude Code 8+ hours daily, this fragmentation costs 2+ hours of productive time.",
			approach:
				"Chose Electron deliberately—this tool needs native OS access for process management, file system watching, and system tray integration that web apps can't provide. The critical architecture decision was using tRPC for all IPC communication between main and renderer processes. This gives full type safety from the database query layer through to the React UI without any serialization boundaries or manual type definitions. Built 25 tRPC endpoints covering session management, memory inspection, MCP health monitoring, and configuration. Zod schemas validate every message crossing the IPC bridge, catching type mismatches at runtime that TypeScript can't catch at compile time.",
			solution:
				"Claude Pilot runs as a native desktop application with a React frontend communicating through tRPC to the Electron main process. The dashboard provides real-time views of all active Claude Code sessions, memory utilization across all three database systems, and MCP server health status. The knowledge graph visualizer renders Memgraph data as an interactive force-directed graph, letting developers see relationship patterns in their project's AI memory. Configuration management handles MCP server setup, memory retention policies, and session preferences through a unified interface. 80% test coverage across both main and renderer processes, with zero production incidents since launch.",
			metrics: [
				{
					label: "Time Saved",
					value: "2+ hrs/day",
					context: "Eliminated multi-tool context switching",
				},
				{
					label: "tRPC Endpoints",
					value: "25",
					context: "Type-safe IPC across 3 database systems",
				},
				{ label: "Test Coverage", value: "80%", context: "Main + renderer process coverage" },
				{ label: "Production Incidents", value: "0", context: "Zero incidents since launch" },
			],
			techDecisions: [
				{
					component: "Desktop Runtime",
					technology: "Electron",
					rationale:
						"Native OS access is non-negotiable for process management, file system watchers, and system tray integration. Web alternatives (Tauri) lack mature Node.js ecosystem access needed for database drivers. Electron's overhead is acceptable for a developer tool that runs alongside resource-heavy AI workloads.",
				},
				{
					component: "IPC Layer",
					technology: "tRPC + Zod",
					rationale:
						"Type-safe communication between Electron main and renderer processes eliminates an entire category of serialization bugs. Zod runtime validation catches edge cases that compile-time TypeScript misses—critical when database queries return dynamic shapes.",
				},
				{
					component: "Knowledge Graph",
					technology: "Memgraph over Neo4j",
					rationale:
						"Memgraph's in-memory architecture delivers sub-millisecond query latency for the interactive graph visualizer. Neo4j's disk-based storage adds 10-50ms per query—noticeable when rendering force-directed graphs with hundreds of nodes updating in real-time.",
				},
			],
			challenges: [
				{
					title: "Electron IPC Type Safety",
					problem:
						"Standard Electron IPC (ipcMain/ipcRenderer) is completely untyped—any message shape can be sent or received without compile-time checks, leading to subtle serialization bugs.",
					solution:
						"Replaced raw IPC with tRPC, treating the main process as a server and renderer as a client. Every endpoint has input/output Zod schemas. TypeScript errors surface immediately when database schema changes would break the UI layer.",
				},
				{
					title: "Real-time Graph Rendering Performance",
					problem:
						"Force-directed graph layouts with 500+ nodes caused frame drops below 30fps when updating positions each animation frame.",
					solution:
						"Moved graph physics calculations to a Web Worker, only sending position updates to the main thread at 60fps intervals. Added level-of-detail rendering that simplifies distant nodes and reduces edge rendering for large graphs.",
				},
				{
					title: "Multi-Database Connection Management",
					problem:
						"Maintaining persistent connections to PostgreSQL, Memgraph, and Qdrant simultaneously caused resource contention and connection pool exhaustion during heavy usage.",
					solution:
						"Implemented lazy connection initialization with health-check-based keepalive. Connections only open when their respective features are accessed and auto-close after 5 minutes of inactivity. Pool sizes tuned per database based on typical query patterns.",
				},
			],
			takeaways: [
				"Type-safe IPC via tRPC eliminates an entire error category in Electron apps—the overhead of setting it up pays for itself within the first week of development.",
				"Graph databases are the right tool for relationship-heavy data that needs real-time traversal, but the visualization layer needs careful performance engineering.",
				"Electron is still the pragmatic choice for developer tools that need native OS integration—the resource overhead is negligible next to the AI workloads it manages.",
				"Zod runtime validation catches bugs that TypeScript's compile-time checks miss, especially at serialization boundaries where data shapes can drift.",
			],
		},
	},
	{
		id: "photokeep-pro",
		title: "PhotoKeep Pro",
		description:
			"Slashed cloud GPU costs by 73% while boosting restoration quality by 4dB over commercial alternatives. A restoration startup was burning $12k/month on fragmented API calls with inconsistent results. Engineered a unified orchestration layer managing 14+ deep learning models (SUPIR, HAT, CodeFormer) with thread-safe VRAM allocation and LRU eviction across 49GB. Now delivering 28.5dB PSNR quality at 99.95% uptime—outperforming Magnific AI and Topaz on blind tests.",
		category: "AI/ML",
		tech: ["Python", "FastAPI", "PyTorch", "React", "TypeScript", "Celery", "Redis", "Stripe"],
		year: "2024",
		status: "Production",
		featured: true,
		relatedServices: [
			{ label: "AI/ML integration for SaaS", href: "/services/ai-integration-developer-for-saas" },
			{ label: "Python backend architecture", href: "/services/python-developer-for-healthcare" },
			{
				label: "Performance-critical systems",
				href: "/services/performance-optimization-consultant",
			},
		],
		caseStudy: {
			published: true,
			subtitle: "73% GPU cost reduction while outperforming Magnific AI on blind quality tests",
			context: {
				duration: "12 weeks",
				industry: "Photo Restoration",
				type: "SaaS Product",
			},
			challenge:
				"A photo restoration startup was spending $12,000/month on fragmented cloud GPU API calls—Replicate for upscaling, a separate service for face restoration, another for colorization. Each API had different quality levels, inconsistent processing times, and no coordination between stages. Results varied wildly between runs. Customers receiving professionally restored family photos expected consistency, but the patchwork architecture couldn't deliver it. The core technical challenge: orchestrating 14+ deep learning models with different VRAM requirements, processing characteristics, and failure modes into a single reliable pipeline. Models ranged from 2GB (CodeFormer for faces) to 12GB (SUPIR for general restoration), and naive sequential loading would exhaust even 49GB of GPU memory.",
			approach:
				"Rejected the multi-cloud API approach entirely. Instead, consolidated all models onto dedicated GPU infrastructure with a custom orchestration layer. The key insight was treating VRAM like a managed memory pool—building an LRU eviction system that keeps frequently-used models loaded while swapping cold models to CPU memory. This eliminated the 15-30 second model loading penalty for common workflows. Built the orchestration on Celery with Redis for distributed task queuing, allowing horizontal scaling across multiple GPU nodes. Each restoration job gets decomposed into a dependency graph: analyze → denoise → upscale → face restore → colorize (optional). Failed stages retry independently without reprocessing the entire pipeline.",
			solution:
				"PhotoKeep Pro runs a unified pipeline managing SUPIR, HAT, Real-ESRGAN, CodeFormer, GFPGAN, and 8 other specialized models through a thread-safe VRAM allocator. The LRU eviction system maintains a working set of 3-4 models in GPU memory while keeping the rest warm in CPU RAM. Average restoration completes in 45 seconds for a 12MP image—down from 3-5 minutes with the previous API-chaining approach. Quality improved to 28.5dB PSNR on our benchmark suite, a 4dB improvement over commercial alternatives. The Stripe-integrated billing system charges per restoration with volume discounts, aligning costs directly with usage. Running at 99.95% uptime with automatic failover between GPU nodes.",
			metrics: [
				{ label: "Cost Reduction", value: "73%", context: "$12k/mo to $3.2k/mo GPU costs" },
				{
					label: "Quality Score",
					value: "28.5dB PSNR",
					context: "+4dB over commercial alternatives",
				},
				{
					label: "AI Models",
					value: "14+",
					context: "Orchestrated with thread-safe VRAM allocation",
				},
				{ label: "Uptime", value: "99.95%", context: "With automatic GPU node failover" },
			],
			techDecisions: [
				{
					component: "Model Orchestration",
					technology: "Custom VRAM Allocator + LRU Eviction",
					rationale:
						"Off-the-shelf model serving (Triton, TorchServe) doesn't handle the dynamic multi-model loading pattern well. Our custom allocator treats VRAM as a managed pool, keeping hot models loaded and swapping cold ones to CPU RAM. Eliminates the 15-30 second model loading penalty for common workflows.",
				},
				{
					component: "Task Queue",
					technology: "Celery + Redis",
					rationale:
						"Restoration pipelines are CPU/GPU-bound with unpredictable runtimes. Celery's task decomposition lets us retry failed stages independently without reprocessing the entire pipeline. Redis provides the low-latency broker needed for real-time progress updates.",
				},
				{
					component: "Billing",
					technology: "Stripe Usage-Based",
					rationale:
						"Per-restoration billing with volume tiers aligns cost directly with value delivered. Customers paying for 10 restorations/month shouldn't subsidize enterprise users processing thousands. Stripe's metered billing handles the complexity of tiered pricing without custom billing logic.",
				},
			],
			challenges: [
				{
					title: "Thread-Safe VRAM Allocation",
					problem:
						"Multiple Celery workers competing for GPU memory caused CUDA out-of-memory errors and corrupted model states when two workers tried to load models simultaneously.",
					solution:
						"Built a VRAM semaphore system using Redis distributed locks. Each worker acquires a VRAM lease before model loading, specifying required memory. The allocator either grants the lease or triggers LRU eviction of cold models. Prevents contention while maximizing GPU utilization.",
				},
				{
					title: "Model Quality Consistency",
					problem:
						"The same input image produced visibly different results between runs due to non-deterministic operations in PyTorch and model-specific preprocessing variations.",
					solution:
						"Pinned random seeds for all stochastic operations and standardized preprocessing pipelines per model. Added a quality verification step that compares output metrics (PSNR, SSIM) against expected ranges and flags anomalies for manual review.",
				},
				{
					title: "Pipeline Failure Recovery",
					problem:
						"A failure in stage 4 of 6 (e.g., face restoration) would lose all progress from prior stages, requiring full reprocessing from scratch.",
					solution:
						"Implemented checkpoint storage for intermediate results at each pipeline stage. Failed stages retry from their checkpoint without reprocessing upstream. Customers see real-time progress with per-stage completion indicators.",
				},
			],
			takeaways: [
				"Custom GPU memory management delivers order-of-magnitude cost improvements over cloud API chaining—the engineering investment pays for itself within 2 months.",
				"Async job queues with stage-level checkpointing are essential for ML pipelines—any stage can fail, and full reprocessing is unacceptable for production workloads.",
				"Usage-based billing aligns incentives perfectly for compute-heavy SaaS—customers pay for value received, and revenue scales linearly with infrastructure costs.",
				"LRU model eviction between GPU and CPU memory eliminates the cold-start penalty that makes multi-model architectures impractical for real-time workloads.",
			],
		},
	},
	{
		id: "penqwen",
		title: "PenQWEN",
		description:
			"Reduced security assessment setup time from 4 hours to 12 minutes with zero hallucinated commands. Pentesting teams were wasting senior hours on boilerplate reconnaissance while generic LLMs generated dangerous garbage. Built a domain-adapted Qwen2.5 model through two-stage LoRA training: cybersecurity corpus adaptation, then agentic fine-tuning for tool calling and OPSEC. 3.6GB adapters trained on 12GB curated security data now automate 60% of routine enumeration tasks.",
		category: "AI/ML",
		tech: ["Python", "PyTorch", "LoRA", "Qwen2.5", "Transformers", "PEFT", "Cybersecurity"],
		year: "2024",
		status: "Production",
		featured: true,
		relatedServices: [
			{ label: "Custom LLM fine-tuning", href: "/services/ai-integration-developer-for-saas" },
			{
				label: "Domain-specific AI systems",
				href: "/services/ai-integration-developer-for-healthcare",
			},
		],
		caseStudy: {
			published: true,
			subtitle: "Domain-adapted LLM reducing security assessment setup from 4 hours to 12 minutes",
			context: {
				duration: "10 weeks",
				industry: "Cybersecurity",
				type: "Open Source",
			},
			challenge:
				"Penetration testing teams spend the first 4+ hours of every engagement on boilerplate reconnaissance: port scanning, service enumeration, vulnerability identification, and report scaffolding. Senior pentesters doing $200/hour work were wasting time on tasks that should be automated. General-purpose LLMs (GPT-4, Claude) produce plausible-looking but technically dangerous output—recommending tools that don't exist, generating commands with wrong flags, or suggesting techniques that violate scope agreements. The security domain requires extreme precision: a hallucinated Nmap flag could scan out-of-scope networks, and a fabricated CVE reference wastes hours of investigation time. No existing LLM solution understood OPSEC constraints, tool-specific syntax, or the structured methodology (PTES) that professional assessments follow.",
			approach:
				"Built a two-stage fine-tuning pipeline on Qwen2.5-7B. Stage one: cybersecurity corpus adaptation using 12GB of curated data—MITRE ATT&CK techniques, CVE databases, tool documentation (Nmap, Burp Suite, Metasploit, BloodHound), and penetration testing methodology guides. This gives the model domain vocabulary and factual grounding. Stage two: agentic fine-tuning for structured tool calling with OPSEC awareness. Trained on real engagement workflows to output properly formatted commands, respect scope constraints, and flag when a requested action might violate rules of engagement. Used LoRA (Low-Rank Adaptation) to keep adapter size at 3.6GB—practical for deployment on consumer GPUs.",
			solution:
				"PenQWEN deploys as a 3.6GB LoRA adapter on top of Qwen2.5-7B, runnable on any GPU with 12GB+ VRAM. The model handles reconnaissance automation, vulnerability prioritization, and report generation following PTES methodology. It generates syntactically correct tool commands with proper flags, understands scope constraints, and refuses to suggest techniques outside the defined engagement rules. The two-stage training approach means the model has both factual knowledge (CVEs, techniques, tool syntax) and procedural understanding (when to use which tool, how to chain findings, OPSEC considerations). Currently automating 60% of routine enumeration tasks with zero hallucinated commands in production use.",
			metrics: [
				{ label: "Setup Time", value: "4h to 12min", context: "Reconnaissance automation" },
				{ label: "Training Data", value: "12GB", context: "Curated cybersecurity corpus" },
				{ label: "Adapter Size", value: "3.6GB", context: "LoRA adapters on Qwen2.5-7B" },
				{ label: "Automation Rate", value: "60%", context: "Routine enumeration tasks" },
			],
			techDecisions: [
				{
					component: "Base Model",
					technology: "Qwen2.5-7B",
					rationale:
						"Best balance of capability and deployment size for domain-specific tasks. Larger models (70B) offer marginal accuracy gains but require multi-GPU setups. Qwen2.5's strong instruction-following and code generation capabilities provide a solid foundation for tool-calling fine-tuning.",
				},
				{
					component: "Fine-Tuning",
					technology: "LoRA / PEFT",
					rationale:
						"Full fine-tuning a 7B model requires 4x A100s and risks catastrophic forgetting. LoRA trains only 0.1% of parameters, produces a 3.6GB adapter instead of a 14GB full model, and runs on a single RTX 3080. Training completes in 8 hours versus 3+ days for full fine-tuning.",
				},
				{
					component: "Training Pipeline",
					technology: "Two-Stage Curriculum",
					rationale:
						"Single-stage training conflates domain knowledge with behavioral patterns. Stage one (corpus adaptation) builds factual grounding; stage two (agentic fine-tuning) teaches structured tool-calling and OPSEC constraints. This separation produces more reliable outputs than mixing both objectives.",
				},
			],
			challenges: [
				{
					title: "Hallucination Prevention in Security Context",
					problem:
						"Early training runs produced confident-sounding but fabricated CVE numbers, non-existent tool flags, and plausible-but-wrong exploit chains. In penetration testing, hallucinations waste hours and can violate scope.",
					solution:
						"Added a verification layer to training data: every CVE reference cross-checked against NVD, every tool command validated against actual --help output. Introduced a confidence calibration objective that trains the model to output uncertainty markers when operating outside its training distribution.",
				},
				{
					title: "OPSEC Constraint Enforcement",
					problem:
						"The model would suggest network-noisy techniques (full port scans, active exploitation) without considering detection risk or scope boundaries.",
					solution:
						"Fine-tuned with explicit OPSEC metadata in training examples: noise level classification, scope boundary checks, and detection probability estimates. The model now prefixes suggestions with risk assessments and refuses techniques that would violate provided scope constraints.",
				},
				{
					title: "Tool Command Syntax Accuracy",
					problem:
						"Generated commands often had correct structure but wrong flags—Nmap syntax that was plausible but wouldn't actually work as intended.",
					solution:
						"Built a synthetic training dataset by programmatically generating valid command combinations from official tool documentation, then training against these verified examples. Post-generation validation checks command syntax against known-good patterns before presenting to the user.",
				},
			],
			takeaways: [
				"Domain fine-tuning consistently beats prompt engineering for specialized tasks—a 7B fine-tuned model outperforms a 70B general model in its specific domain.",
				"LoRA makes fine-tuning practical on consumer GPUs, democratizing domain adaptation that previously required cloud compute budgets.",
				"Dataset quality matters more than quantity for domain-specific LLMs—12GB of curated, verified data outperforms 100GB of scraped, unverified content.",
				"Two-stage curriculum learning (knowledge then behavior) produces more reliable outputs than single-stage training that conflates both objectives.",
				"In safety-critical domains, hallucination prevention must be an explicit training objective, not an afterthought.",
			],
		},
	},
	{
		id: "voice-cloner",
		title: "Voice Cloner",
		description:
			"Built a production zero-shot voice cloning SaaS handling 41+ curated voices and custom voice uploads with 12-second P50 latency on a single RTX 3080. Studios were paying $500+/hour for professional voice talent while AI TTS solutions produced robotic output. Engineered a Qwen3-TTS 1.7B inference pipeline with Redis priority queuing, VRAM fragmentation mitigation (worker recycling every 500 generations), and crossfade audio merging with LUFS normalization for multi-voice conversations. 99.95% uptime, 0.03% error rate, Stripe subscription billing across Free/Pro/Enterprise tiers.",
		category: "AI/ML",
		tech: [
			"Python",
			"FastAPI",
			"PyTorch",
			"Qwen3-TTS",
			"Redis",
			"Next.js",
			"TypeScript",
			"Stripe",
			"Cloudflare",
		],
		year: "2025",
		status: "Production",
		link: "https://voicecloner.alexmayhew.dev",
		featured: true,
		relatedServices: [
			{
				label: "AI inference pipeline architecture",
				href: "/services/ai-integration-developer-for-saas",
			},
			{
				label: "GPU-optimized Python systems",
				href: "/services/python-developer-for-healthcare",
			},
			{
				label: "Real-time performance engineering",
				href: "/services/performance-optimization-consultant",
			},
		],
		caseStudy: {
			published: true,
			subtitle: "Production voice cloning SaaS with 12s P50 latency on a single RTX 3080",
			context: {
				duration: "6 weeks",
				industry: "AI/ML SaaS",
				type: "SaaS Product",
			},
			challenge:
				"Professional voice talent costs $500+/hour with minimum session fees, booking lead times, and re-recording costs for script changes. Existing AI TTS solutions (ElevenLabs, Play.ht) produce serviceable but detectable synthetic speech—fine for prototypes, insufficient for production content. Zero-shot voice cloning from short reference audio samples was technically possible but no solution offered multi-voice conversation support, priority-based queue management for different pricing tiers, or reliable single-server deployment. The core engineering challenge: running a 1.7B parameter TTS model in bfloat16 on a single RTX 3080 (10GB VRAM) with consistent sub-15-second latency while handling concurrent requests from multiple subscription tiers without GPU memory degradation over time.",
			approach:
				"Chose Qwen3-TTS 1.7B as the inference model after benchmarking against XTTS, Bark, and Tortoise—it delivered the best quality-to-VRAM ratio for zero-shot cloning from 10-30 second reference samples. Built the inference pipeline on FastAPI with a 4-tier Redis priority queue (admin > enterprise > pro > free) ensuring paid users never wait behind free-tier requests. The critical insight was that PyTorch's CUDA memory allocator fragments over extended operation periods. Rather than fighting the allocator, implemented proactive worker recycling every 500 generations—the worker process terminates and a fresh one spawns, resetting the memory allocator state. This maintains consistent 12-second P50 latency instead of degrading to 45+ seconds after thousands of generations.",
			solution:
				"Voice Cloner runs a FastAPI backend with Redis-orchestrated inference workers serving Qwen3-TTS 1.7B in bfloat16. The frontend is Next.js 15 deployed on Cloudflare Workers with wavesurfer.js for audio visualization and real-time SSE progress updates. 41+ curated voices are available immediately; custom voice uploads undergo SNR analysis with a rejection threshold ensuring minimum reference audio quality. Multi-voice conversations use a crossfade audio merger with LUFS normalization for consistent loudness across different voice profiles. Stripe handles subscription billing (Free/Pro/Enterprise) with usage tracking, Clerk manages authentication, and Sentry + Amplitude provide observability. Running at 99.95% uptime with 0.03% error rate on a single server.",
			metrics: [
				{ label: "P50 Latency", value: "12s", context: "Short text generation on RTX 3080" },
				{ label: "Uptime", value: "99.95%", context: "Single-server production deployment" },
				{ label: "Error Rate", value: "0.03%", context: "Across all generation requests" },
				{ label: "Curated Voices", value: "41+", context: "Plus custom voice upload support" },
			],
			techDecisions: [
				{
					component: "TTS Model",
					technology: "Qwen3-TTS 1.7B (bfloat16)",
					rationale:
						"Best quality-to-VRAM ratio for zero-shot voice cloning on 10GB VRAM. XTTS requires more memory for comparable quality; Bark and Tortoise are slower with inferior zero-shot capabilities. bfloat16 precision halves memory usage with negligible quality impact.",
				},
				{
					component: "Queue System",
					technology: "Redis 4-Tier Priority Queue",
					rationale:
						"Subscription tiers need differentiated service levels without separate infrastructure. Redis sorted sets with tier-based scoring ensure Enterprise requests process before Pro, Pro before Free—all on the same GPU. Simple, fast, and observable.",
				},
				{
					component: "VRAM Management",
					technology: "Worker Recycling (500 generations)",
					rationale:
						"PyTorch's CUDA memory allocator fragments over time, degrading latency from 12s to 45s+ after thousands of generations. Proactive worker recycling every 500 generations resets allocator state. The 3-second restart penalty is invisible to users compared to gradual degradation.",
				},
				{
					component: "Frontend",
					technology: "Next.js 15 + Cloudflare Workers",
					rationale:
						"Edge-deployed frontend eliminates latency between user interaction and API calls. wavesurfer.js provides production-quality audio visualization. SSE for progress updates is simpler and more reliable than WebSockets for unidirectional status streaming.",
				},
			],
			challenges: [
				{
					title: "GPU VRAM Fragmentation",
					problem:
						"PyTorch's CUDA memory allocator fragments over time. After 1,000+ generations, P50 latency degrades from 12 seconds to 45+ seconds as the allocator struggles to find contiguous memory blocks.",
					solution:
						"Worker processes recycle every 500 generations, spawning a fresh process with a clean memory allocator. The 3-second restart is invisible to users since queued requests simply wait for the next worker. Monitoring alerts if any worker exceeds 600 generations without recycling.",
				},
				{
					title: "DB Pool Exhaustion from SSE",
					problem:
						"Server-Sent Events for real-time generation progress held database connections open for the duration of each generation (12-38 seconds). Under load, this exhausted the connection pool and caused cascading failures.",
					solution:
						"Separated SSE connections from the main database pool. SSE endpoints use a dedicated connection pool sized for concurrent stream count rather than request rate. Added connection timeouts and graceful degradation—if the SSE pool is exhausted, clients fall back to polling.",
				},
				{
					title: "Rate Limit Bypass via IP Spoofing",
					problem:
						"Attackers sent fake X-Forwarded-For headers to bypass per-IP rate limits, consuming free-tier generation capacity at scale.",
					solution:
						"Implemented Cloudflare IP validation to only trust the CF-Connecting-IP header, which Cloudflare sets from the actual client connection. All other forwarded headers are ignored for rate limiting. Combined with per-account rate limits that apply regardless of IP.",
				},
				{
					title: "Stripe Webhook Race Conditions",
					problem:
						"Concurrent Stripe webhooks for the same subscription (e.g., payment_intent.succeeded + invoice.paid firing simultaneously) caused duplicate subscription records and billing inconsistencies.",
					solution:
						"Implemented idempotent upserts keyed on Stripe event ID. Each webhook handler checks if the event has been processed before executing business logic. Database operations use ON CONFLICT clauses to handle concurrent writes gracefully.",
				},
				{
					title: "Reference Audio Quality Variance",
					problem:
						"User-uploaded reference audio ranged from studio recordings to phone captures with heavy background noise. Low-quality references produced unusable voice clones, leading to support tickets and refund requests.",
					solution:
						"Added an SNR (signal-to-noise ratio) analysis pipeline that evaluates uploaded audio before accepting it. References below the quality threshold are rejected with specific feedback about what to improve. This eliminated 90% of quality-related support tickets.",
				},
			],
			takeaways: [
				"GPU inference services need proactive VRAM management—memory fragmentation is silent and cumulative, degrading latency gradually until the service appears broken.",
				"SSE long-lived connections break traditional connection pooling assumptions. Size pools for concurrent stream count, not request rate.",
				"Zero-shot voice cloning quality is bounded by reference audio quality. Input validation on uploads is the highest-ROI investment for user satisfaction.",
				"Priority queue systems with paid tier separation deliver both better UX for paying users and revenue alignment for the business.",
				"Single-server GPU deployments can serve production SaaS workloads at 99.95% uptime with proper queue management and proactive maintenance.",
			],
		},
	},
	{
		id: "audiokeep",
		title: "AudioKeep",
		description:
			"Professional AI audio restoration platform for archival preservation and forensics. Orchestrates Resemble Enhance, AudioSR, DeepFilterNet, and Demucs v4 for noise reduction, spectral repair, audio super-resolution (up to 192kHz), and source separation. Credit-based SaaS with forensic analysis tools.",
		category: "AI/ML",
		tech: ["Python", "FastAPI", "PyTorch", "React", "TypeScript", "Celery", "Redis", "Stripe"],
		year: "2024",
		status: "Production",
		github: "https://github.com/LecoMV/audiokeep",
	},
	{
		id: "donedays",
		title: "DoneDays",
		description:
			"AI-powered productivity platform with autonomous task orchestration. Multi-agent system with intelligent scheduling and adaptive workflows.",
		category: "AI/ML",
		tech: ["TypeScript", "Next.js", "LLM Agents", "PostgreSQL"],
		year: "2024",
		status: "Development",
	},
	{
		id: "marksman-pro",
		title: "MarksmanPro",
		description:
			"Precision ballistics calculator for long-range shooting. Physics simulation engine accounting for atmospheric conditions, Coriolis effect, spin drift, and projectile aerodynamics. Real-time trajectory visualization.",
		category: "Web Apps",
		tech: ["TypeScript", "React", "WebGL", "Physics Engine", "PWA"],
		year: "2024",
		status: "Production",
	},
	{
		id: "webscraper-pro",
		title: "WebScraperPro",
		description:
			"Enterprise-grade web scraping platform with intelligent rate limiting, proxy rotation, and anti-detection measures. Headless browser automation with structured data extraction pipelines.",
		category: "SaaS",
		tech: ["Python", "Playwright", "FastAPI", "PostgreSQL", "Redis", "Docker"],
		year: "2024",
		status: "Production",
	},
	{
		id: "sovereign-cbam",
		title: "Sovereign CBAM",
		description:
			"Carbon Border Adjustment compliance platform for EU importers. Local-first architecture with offline-capable data processing.",
		category: "SaaS",
		tech: ["Next.js", "PostgreSQL", "Edge Functions", "AI/ML"],
		year: "2025",
		status: "Development",
	},
	{
		id: "inkos",
		title: "InkOS",
		description:
			"Tattoo studio management system with real-time collaboration, appointment scheduling, and digital consent workflows.",
		category: "SaaS",
		tech: ["React", "Supabase", "WebGL", "Procreate Integration"],
		year: "2025",
		status: "Development",
	},
];

// Helper for terminal: get projects as a record keyed by id
export function getProjectsRecord(): Record<
	string,
	{
		name: string;
		description: string;
		tech: string[];
		status: string;
		url: string | null;
	}
> {
	return Object.fromEntries(
		projects.map((p) => [
			p.id,
			{
				name: p.title,
				description: p.description,
				tech: p.tech,
				status: p.status,
				url: p.link || null,
			},
		])
	);
}

// Helper: get projects by category
export function getProjectsByCategory(category: Category): Project[] {
	if (category === "All") return projects;
	return projects.filter((p) => p.category === category);
}

// Helper: get featured projects
export function getFeaturedProjects(): Project[] {
	return projects.filter((p) => p.featured);
}

// Helper: get projects with published case studies
export function getCaseStudyProjects(): Project[] {
	return projects.filter((p) => p.caseStudy?.published);
}

// Helper: get a single project by id
export function getProjectById(id: string): Project | undefined {
	return projects.find((p) => p.id === id);
}
