// Unified project data - single source of truth
// Used by: /work page, terminal commands, future features

export const categories = ["All", "AI/ML", "SaaS", "Web Apps", "Developer Tools"] as const;
export type Category = (typeof categories)[number];
export type ProjectCategory = Exclude<Category, "All">;

export interface RelatedService {
	label: string; // Contextual anchor text
	href: string; // Link to service page
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
