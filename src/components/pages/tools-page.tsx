import { ArrowUpRight, BarChart3, Download, Layers, Mic, Sparkles, Terminal } from "lucide-react";
import Link from "next/link";

import { FadeInUp } from "@/components/pages/tools-page-client";
import { cn } from "@/lib/utils";

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
		id: "voice-cloner",
		name: "Voice Cloner",
		tagline: "TTS, Conversations & Audiobook Studio",
		description:
			"Neural text-to-speech powered by Qwen3-TTS with zero-shot voice cloning. Single voice TTS, multi-speaker conversations with per-line effects, and a full audiobook studio ... upload manuscripts, assign character voices, and export distribution-ready M4B or MP3. 41 curated voices, free during beta.",
		href: "/tools/voice-cloner",
		icon: <Mic className="h-6 w-6" strokeWidth={1.5} />,
		badge: "Live",
		badgeColor: "lime",
		status: "demo",
		featured: true,
	},
	{
		id: "saas-readiness",
		name: "SaaS Readiness",
		tagline: "Scaling Readiness Assessment",
		description:
			"Evaluate your SaaS architecture maturity across 8 dimensions. Get a readiness score and actionable recommendations in under 3 minutes. No email required.",
		href: "/tools/saas-readiness",
		icon: <BarChart3 className="h-6 w-6" strokeWidth={1.5} />,
		badge: "Free",
		badgeColor: "lime",
		status: "demo",
		featured: true,
	},
	{
		id: "pilot",
		name: "Claude Pilot",
		tagline: "All-in-One Claude Code Manager",
		description:
			"Unified management app for Claude Code workflows. Session monitoring, memory browser, MCP server configuration, and integrated terminal. Cross-platform, open source.",
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
		<section className="page-layout">
			<div className="max-w-content mx-auto">
				{/* Header */}
				<FadeInUp className="mb-16">
					<p className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
						<span className="mr-2 animate-pulse" aria-hidden="true">
							●
						</span>
						Developer Tools
					</p>
					<h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
						Precision Instruments
						<br />
						<span className="text-slate-text">Built for Developers.</span>
					</h1>
					<p className="text-slate-text max-w-2xl text-lg">
						Tools I built to solve real problems. Try them instantly in your browser or download for
						your desktop.
					</p>
				</FadeInUp>

				{/* Tools Grid */}
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					{tools.map((tool, index) => (
						<article
							key={tool.id}
							className={cn("group relative", tool.featured && "lg:col-span-1")}
						>
							<FadeInUp delay={index * 0.1}>
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
												"text-micro border px-2 py-1 font-mono tracking-wider uppercase",
												tool.badgeColor === "lime"
													? "border-cyber-lime text-cyber-lime"
													: "border-signal-info text-signal-info"
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
												<Download className="text-signal-info h-4 w-4" strokeWidth={1.5} />
												<span className="text-signal-info">Download</span>
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
							</FadeInUp>
						</article>
					))}
				</div>

				{/* Coming Soon Teaser */}
				<FadeInUp className="mt-12 border-t border-white/10 pt-12" delay={0.3}>
					<p className="text-slate-text font-mono text-xs tracking-wider uppercase">
						More tools in development...
					</p>
					<p className="text-slate-text/80 mt-2 text-sm">
						AEVP (AI-powered Electron testing platform) coming soon.
					</p>
				</FadeInUp>
			</div>
		</section>
	);
}
