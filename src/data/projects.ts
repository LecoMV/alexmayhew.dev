// Unified project data - single source of truth
// Used by: /work page, terminal commands, future features

export const categories = ["All", "AI/ML", "SaaS", "Web Apps", "Developer Tools"] as const;
export type Category = (typeof categories)[number];
export type ProjectCategory = Exclude<Category, "All">;

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
}

export const projects: Project[] = [
	{
		id: "traceforge",
		title: "TraceForge",
		description:
			"GPU-accelerated raster-to-vector converter transforming PNG, JPG, and WebP images into clean, optimized SVGs. Neural upscaling with Potrace and VTracer engines, 10+ quality presets, SVGO optimization pipeline. Free to use, no signup required.",
		category: "Developer Tools",
		tech: ["Python", "FastAPI", "Potrace", "VTracer", "CUDA", "SVGO", "React", "TypeScript"],
		year: "2025",
		status: "Production",
		link: "/tools/traceforge",
		featured: true,
	},
	{
		id: "claude-pilot",
		title: "Claude Pilot",
		description:
			"Professional desktop control center for Claude Code developers. Session management, memory browser (PostgreSQL + Memgraph + Qdrant), MCP server configuration, integrated terminal, and system monitoring. 25 tRPC controllers, 80% test coverage.",
		category: "Developer Tools",
		tech: ["Electron", "React", "TypeScript", "tRPC", "Zod", "PostgreSQL", "Memgraph"],
		year: "2025",
		status: "Production",
		link: "/tools/pilot",
		github: "https://github.com/alexmayhew/claude-pilot",
		featured: true,
	},
	{
		id: "photokeep-pro",
		title: "PhotoKeep Pro",
		description:
			"Enterprise AI photo restoration platform orchestrating 14+ deep learning models (SUPIR, HAT, CodeFormer, GFPGAN, DDColor) on 49GB VRAM. Built thread-safe GPU memory management with lazy loading and LRU eviction, achieving 99.95% uptime and 28.5dB PSNR quality—beating Magnific AI and Topaz.",
		category: "AI/ML",
		tech: ["Python", "FastAPI", "PyTorch", "React", "TypeScript", "Celery", "Redis", "Stripe"],
		year: "2024",
		status: "Production",
		featured: true,
	},
	{
		id: "penqwen",
		title: "PenQWEN",
		description:
			"Custom cybersecurity LLM built on Qwen2.5 with domain-specific LoRA fine-tuning. Two-stage training: domain adaptation on cybersecurity corpus, then agentic fine-tuning for tool calling and OPSEC workflows. 3.6GB LoRA adapters trained on 12GB curated security data.",
		category: "AI/ML",
		tech: ["Python", "PyTorch", "LoRA", "Qwen2.5", "Transformers", "PEFT", "Cybersecurity"],
		year: "2024",
		status: "Production",
		featured: true,
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
