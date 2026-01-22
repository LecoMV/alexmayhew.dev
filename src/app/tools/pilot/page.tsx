import type { Metadata } from "next";
import { Terminal, ArrowLeft, Github, ExternalLink } from "lucide-react";
import Link from "next/link";
import { DownloadButtons, FeatureGrid, SecuritySection, TechSpecs } from "@/components/pilot";

export const metadata: Metadata = {
	title: "Claude Pilot",
	description:
		"All-in-one management app for Claude Code workflows. Session monitoring, memory browser, MCP server configuration, and integrated terminal. Cross-platform, open source.",
	keywords: [
		"Claude Code",
		"Claude CLI",
		"desktop app",
		"session management",
		"MCP server",
		"Electron app",
		"developer tools",
		"AI coding assistant",
		"Claude Code manager",
	],
	openGraph: {
		title: "Claude Pilot | All-in-One Claude Code Manager",
		description:
			"Unified management app for Claude Code development. Session monitoring, memory browser, MCP configuration, integrated terminal.",
		type: "website",
		images: [
			{
				url: "/og-pilot.png",
				width: 1200,
				height: 630,
				alt: "Claude Pilot - All-in-One Claude Code Manager",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Claude Pilot | All-in-One Claude Code Manager",
		description: "The missing UI for Claude Code. Cross-platform, open source.",
	},
};

export default function ClaudePilotPage() {
	return (
		<main id="main-content" className="min-h-screen px-6 pt-32 pb-24 sm:px-12 md:px-24">
			<div className="mx-auto max-w-[1400px]">
				{/* Breadcrumb */}
				<nav className="mb-8">
					<Link
						href="/tools"
						className="text-slate-text hover:text-cyber-lime inline-flex items-center gap-2 font-mono text-xs transition-colors"
					>
						<ArrowLeft className="h-3 w-3" strokeWidth={1.5} />
						<span>Back to Tools</span>
					</Link>
				</nav>

				{/* Hero section */}
				<header className="mb-12">
					<div className="mb-4 flex items-center gap-3">
						<div className="text-cyber-lime">
							<Terminal className="h-8 w-8" strokeWidth={1.5} />
						</div>
						<div className="flex items-center gap-2">
							<span className="border border-blue-400/50 px-2 py-0.5 font-mono text-[10px] tracking-wider text-blue-400 uppercase">
								Download
							</span>
							<span className="text-slate-text border border-white/20 px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase">
								Open Source
							</span>
						</div>
					</div>

					<h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
						Claude Pilot
						<br />
						<span className="text-slate-text">All-in-One Claude Code Manager.</span>
					</h1>

					<p className="text-slate-text mb-8 max-w-2xl text-lg">
						The unified management app for Claude Code power users. Monitor active sessions, browse
						memory systems, configure MCP servers, and streamline your AI-assisted development — all
						from one interface.
					</p>

					{/* Download buttons */}
					<DownloadButtons />
				</header>

				{/* App preview placeholder */}
				<section className="mb-16">
					<div className="bg-gunmetal-glass/20 relative aspect-video overflow-hidden border border-white/10">
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="text-center">
								<Terminal className="text-slate-text mx-auto mb-4 h-16 w-16" strokeWidth={1} />
								<p className="text-slate-text font-mono text-sm">App preview coming soon</p>
								<p className="text-slate-text/60 mt-2 text-xs">
									Screenshots will be added after next release
								</p>
							</div>
						</div>
						{/* Decorative corners */}
						<div className="border-cyber-lime/30 absolute top-0 left-0 h-8 w-8 border-t border-l" />
						<div className="border-cyber-lime/30 absolute top-0 right-0 h-8 w-8 border-t border-r" />
						<div className="border-cyber-lime/30 absolute bottom-0 left-0 h-8 w-8 border-b border-l" />
						<div className="border-cyber-lime/30 absolute right-0 bottom-0 h-8 w-8 border-r border-b" />
					</div>
				</section>

				{/* Features */}
				<section className="mb-16">
					<h2 className="text-mist-white mb-8 font-mono text-sm tracking-wider uppercase">
						Features
					</h2>
					<FeatureGrid />
				</section>

				{/* Tech specs and requirements */}
				<section className="mb-16">
					<TechSpecs />
				</section>

				{/* Security */}
				<section className="mb-16">
					<SecuritySection />
				</section>

				{/* Call to action */}
				<section className="border-t border-white/10 pt-12">
					<div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h3 className="text-mist-white mb-2 font-mono text-lg">Ready to take control?</h3>
							<p className="text-slate-text text-sm">
								Download Claude Pilot and upgrade your Claude Code workflow.
							</p>
						</div>
						<div className="flex items-center gap-4">
							<a
								href="https://github.com/alexmayhew/claude-pilot"
								target="_blank"
								rel="noopener noreferrer"
								className="text-slate-text hover:text-mist-white flex items-center gap-2 border border-white/10 px-4 py-2 font-mono text-xs transition-colors hover:border-white/30"
							>
								<Github className="h-4 w-4" strokeWidth={1.5} />
								<span>Source Code</span>
								<ExternalLink className="h-3 w-3" strokeWidth={1.5} />
							</a>
							<a
								href="https://github.com/alexmayhew/claude-pilot/releases"
								target="_blank"
								rel="noopener noreferrer"
								className="text-slate-text hover:text-mist-white flex items-center gap-2 border border-white/10 px-4 py-2 font-mono text-xs transition-colors hover:border-white/30"
							>
								<span>All Releases</span>
								<ExternalLink className="h-3 w-3" strokeWidth={1.5} />
							</a>
						</div>
					</div>
				</section>

				{/* Attribution */}
				<footer className="mt-16 border-t border-white/5 pt-8">
					<p className="text-slate-text/60 font-mono text-xs">
						Built by a Claude Code power user, for Claude Code power users.
					</p>
				</footer>
			</div>
		</main>
	);
}
