"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const springTransition = {
	type: "spring" as const,
	stiffness: 100,
	damping: 20,
	mass: 1,
};

const categories = ["All", "AI/ML", "SaaS", "Web Apps"] as const;
type Category = (typeof categories)[number];

interface Project {
	id: string;
	title: string;
	description: string;
	category: Exclude<Category, "All">;
	tech: string[];
	year: string;
	link?: string;
	github?: string;
	featured?: boolean;
}

const projects: Project[] = [
	{
		id: "photokeep-pro",
		title: "PhotoKeep Pro",
		description:
			"Enterprise AI photo restoration platform orchestrating 14+ deep learning models (SUPIR, HAT, CodeFormer, GFPGAN, DDColor) on 49GB VRAM. Built thread-safe GPU memory management with lazy loading and LRU eviction, achieving 99.95% uptime and 28.5dB PSNR quality—beating Magnific AI and Topaz.",
		category: "AI/ML",
		tech: ["Python", "FastAPI", "PyTorch", "React", "TypeScript", "Celery", "Redis", "Stripe"],
		year: "2024",
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
	},
	{
		id: "marksman-pro",
		title: "MarksmanPro",
		description:
			"Precision ballistics calculator for long-range shooting. Physics simulation engine accounting for atmospheric conditions, Coriolis effect, spin drift, and projectile aerodynamics. Real-time trajectory visualization.",
		category: "Web Apps",
		tech: ["TypeScript", "React", "WebGL", "Physics Engine", "PWA"],
		year: "2024",
	},
	{
		id: "webscraper-pro",
		title: "WebScraperPro",
		description:
			"Enterprise-grade web scraping platform with intelligent rate limiting, proxy rotation, and anti-detection measures. Headless browser automation with structured data extraction pipelines.",
		category: "SaaS",
		tech: ["Python", "Playwright", "FastAPI", "PostgreSQL", "Redis", "Docker"],
		year: "2024",
	},
	{
		id: "sovereign-cbam",
		title: "Sovereign CBAM",
		description:
			"Carbon Border Adjustment compliance platform for EU importers. Local-first architecture with offline-capable data processing. (In Development)",
		category: "SaaS",
		tech: ["Next.js", "PostgreSQL", "Edge Functions", "AI/ML"],
		year: "2025",
	},
	{
		id: "inkos",
		title: "InkOS",
		description:
			"Tattoo studio management system with real-time collaboration, appointment scheduling, and digital consent workflows. (In Development)",
		category: "SaaS",
		tech: ["React", "Supabase", "WebGL", "Procreate Integration"],
		year: "2025",
	},
];

export function WorkPage() {
	const [activeCategory, setActiveCategory] = useState<Category>("All");

	const filteredProjects =
		activeCategory === "All" ? projects : projects.filter((p) => p.category === activeCategory);

	return (
		<main className="min-h-screen px-6 pt-44 pb-24 sm:px-12 md:px-24">
			<div className="mx-auto max-w-[1400px]">
				{/* Header */}
				<m.div
					className="mb-16"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={springTransition}
				>
					<h1 className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
						<span className="mr-2 animate-pulse">●</span>
						Selected Work
					</h1>
					<h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
						Digital Instruments
						<br />
						<span className="text-slate-text">& Experiments.</span>
					</h2>
					<p className="text-slate-text max-w-2xl text-lg">
						A collection of projects that push boundaries, solve complex problems, and deliver
						exceptional user experiences.
					</p>
				</m.div>

				{/* Category Filter */}
				<m.div
					className="mb-12 flex flex-wrap gap-2"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ ...springTransition, delay: 0.1 }}
				>
					{categories.map((category) => (
						<button
							key={category}
							onClick={() => setActiveCategory(category)}
							className={cn(
								"relative px-4 py-2 font-mono text-xs tracking-wider uppercase transition-colors duration-300",
								activeCategory === category
									? "text-cyber-lime"
									: "text-slate-text hover:text-mist-white"
							)}
						>
							{category}
							{activeCategory === category && (
								<m.div
									layoutId="category-indicator"
									className="bg-cyber-lime absolute right-0 bottom-0 left-0 h-px"
									transition={springTransition}
								/>
							)}
						</button>
					))}
				</m.div>

				{/* Projects Grid */}
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<AnimatePresence mode="popLayout">
						{filteredProjects.map((project, index) => (
							<m.article
								key={project.id}
								layout
								initial={{ opacity: 0, y: 30 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95 }}
								transition={{ ...springTransition, delay: index * 0.05 }}
								className={cn(
									"group bg-gunmetal-glass/10 hover:border-cyber-lime/50 relative border border-white/10 p-6 backdrop-blur-sm transition-colors duration-300",
									project.featured && "lg:col-span-2"
								)}
							>
								{/* Corner accents */}
								<div className="border-cyber-lime absolute top-0 right-0 h-4 w-4 border-t border-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
								<div className="border-cyber-lime absolute bottom-0 left-0 h-4 w-4 border-b border-l opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

								{/* Featured badge */}
								{project.featured && (
									<div className="border-cyber-lime text-cyber-lime absolute top-4 right-4 border px-2 py-1 font-mono text-[10px] tracking-wider uppercase">
										Featured
									</div>
								)}

								<div className="flex flex-col gap-4">
									{/* Header */}
									<div className="flex items-start justify-between gap-4">
										<div>
											<span className="text-slate-text mb-2 block font-mono text-xs">
												{project.year} / {project.category}
											</span>
											<h3 className="font-mono text-xl tracking-tight md:text-2xl">
												{project.title}
											</h3>
										</div>
									</div>

									{/* Description */}
									<p className="text-slate-text text-sm leading-relaxed md:text-base">
										{project.description}
									</p>

									{/* Tech Stack */}
									<div className="flex flex-wrap gap-2">
										{project.tech.map((tech) => (
											<span
												key={tech}
												className="bg-white/5 px-2 py-1 font-mono text-xs text-white/60"
											>
												{tech}
											</span>
										))}
									</div>

									{/* Links */}
									<div className="mt-2 flex gap-4">
										{project.link && (
											<a
												href={project.link}
												target="_blank"
												rel="noopener noreferrer"
												className="text-slate-text hover:text-cyber-lime group/link flex items-center gap-2 font-mono text-xs transition-colors duration-300"
											>
												<ExternalLink className="h-3 w-3" strokeWidth={1.5} />
												View Project
												<ArrowUpRight
													className="h-3 w-3 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
													strokeWidth={1.5}
												/>
											</a>
										)}
										{project.github && (
											<a
												href={project.github}
												target="_blank"
												rel="noopener noreferrer"
												className="text-slate-text hover:text-cyber-lime group/link flex items-center gap-2 font-mono text-xs transition-colors duration-300"
											>
												<Github className="h-3 w-3" strokeWidth={1.5} />
												Source Code
												<ArrowUpRight
													className="h-3 w-3 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
													strokeWidth={1.5}
												/>
											</a>
										)}
									</div>
								</div>
							</m.article>
						))}
					</AnimatePresence>
				</div>

				{/* Empty State */}
				{filteredProjects.length === 0 && (
					<m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center">
						<p className="text-slate-text font-mono text-sm">No projects found in this category.</p>
					</m.div>
				)}
			</div>
		</main>
	);
}
