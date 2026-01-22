"use client";

import { m } from "framer-motion";
import { ArrowUpRight, Sparkles, Terminal, Layers, Download } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const springTransition = {
	type: "spring" as const,
	stiffness: 100,
	damping: 20,
	mass: 1,
};

interface Tool {
	id: string;
	name: string;
	tagline: string;
	description: string;
	href: string;
	icon: React.ReactNode;
	badge: string;
	badgeColor: "lime" | "blue" | "amber";
	status: "demo" | "download" | "coming-soon";
	featured?: boolean;
}

const tools: Tool[] = [
	{
		id: "traceforge",
		name: "TraceForge",
		tagline: "Raster to Vector in Seconds",
		description:
			"GPU-accelerated vectorization engine with neural upscaling and precision tracing. 10+ presets for logos, illustrations, and line art. Full source available.",
		href: "/tools/traceforge",
		icon: <Layers className="h-6 w-6" strokeWidth={1.5} />,
		badge: "Demo",
		badgeColor: "lime",
		status: "demo",
		featured: true,
	},
	{
		id: "pilot",
		name: "Claude Pilot",
		tagline: "Command Your Claude Code Sessions",
		description:
			"Desktop control center for Claude Code developers. Session management, memory browser, MCP configuration, and integrated terminal. Cross-platform.",
		href: "/tools/pilot",
		icon: <Terminal className="h-6 w-6" strokeWidth={1.5} />,
		badge: "Download",
		badgeColor: "blue",
		status: "download",
		featured: true,
	},
];

export function ToolsPage() {
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
						Developer Tools
					</h1>
					<h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
						Precision Instruments
						<br />
						<span className="text-slate-text">Built for Developers.</span>
					</h2>
					<p className="text-slate-text max-w-2xl text-lg">
						Tools I built to solve real problems. Try them instantly in your browser or download for
						your desktop.
					</p>
				</m.div>

				{/* Tools Grid */}
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					{tools.map((tool, index) => (
						<m.article
							key={tool.id}
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ ...springTransition, delay: index * 0.1 }}
							className={cn("group relative", tool.featured && "lg:col-span-1")}
						>
							<Link
								href={tool.href}
								className="bg-gunmetal-glass/10 hover:border-cyber-lime/50 relative flex h-full flex-col border border-white/10 p-6 backdrop-blur-sm transition-all duration-300"
							>
								{/* Corner accents */}
								<div className="border-cyber-lime absolute top-0 right-0 h-4 w-4 border-t border-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
								<div className="border-cyber-lime absolute bottom-0 left-0 h-4 w-4 border-b border-l opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

								{/* Header */}
								<div className="mb-4 flex items-start justify-between">
									<div className="flex items-center gap-3">
										<div className="text-cyber-lime">{tool.icon}</div>
										<div>
											<h3 className="font-mono text-xl tracking-tight">{tool.name}</h3>
											<p className="text-slate-text font-mono text-xs">{tool.tagline}</p>
										</div>
									</div>
									<span
										className={cn(
											"border px-2 py-1 font-mono text-[10px] tracking-wider uppercase",
											tool.badgeColor === "lime"
												? "border-cyber-lime text-cyber-lime"
												: "border-blue-400 text-blue-400"
										)}
									>
										{tool.badge}
									</span>
								</div>

								{/* Description */}
								<p className="text-slate-text mb-6 flex-grow text-sm leading-relaxed">
									{tool.description}
								</p>

								{/* CTA */}
								<div className="flex items-center gap-2 font-mono text-xs">
									{tool.status === "demo" ? (
										<>
											<Sparkles className="text-cyber-lime h-4 w-4" strokeWidth={1.5} />
											<span className="text-cyber-lime">View Demo</span>
										</>
									) : tool.status === "download" ? (
										<>
											<Download className="h-4 w-4 text-blue-400" strokeWidth={1.5} />
											<span className="text-blue-400">Download</span>
										</>
									) : (
										<span className="text-slate-text">Coming Soon</span>
									)}
									<ArrowUpRight
										className="text-slate-text h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
										strokeWidth={1.5}
									/>
								</div>
							</Link>
						</m.article>
					))}
				</div>

				{/* Coming Soon Teaser */}
				<m.div
					className="mt-12 border-t border-white/10 pt-12"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ ...springTransition, delay: 0.3 }}
				>
					<p className="text-slate-text font-mono text-xs tracking-wider uppercase">
						More tools in development...
					</p>
					<p className="text-slate-text/60 mt-2 text-sm">
						AEVP (AI-powered Electron testing platform) coming soon.
					</p>
				</m.div>
			</div>
		</main>
	);
}
