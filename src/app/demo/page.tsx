"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
	ArrowLeft,
	Terminal as TerminalIcon,
	Box,
	MessageSquare,
	Check,
	Clock,
	ArrowRight,
} from "lucide-react";
import { Terminal } from "@/components/terminal/terminal";

const springTransition = {
	type: "spring" as const,
	stiffness: 100,
	damping: 20,
	mass: 1,
};

interface FeatureCardProps {
	title: string;
	description: string;
	status: "demo" | "planned" | "discuss";
	icon: React.ReactNode;
	children?: React.ReactNode;
}

function FeatureCard({ title, description, status, icon, children }: FeatureCardProps) {
	const statusConfig = {
		demo: { label: "DEMO_READY", color: "text-cyber-lime", bgColor: "bg-cyber-lime/10" },
		planned: { label: "PLANNED", color: "text-amber-400", bgColor: "bg-amber-400/10" },
		discuss: { label: "DISCUSS_FIRST", color: "text-blue-400", bgColor: "bg-blue-400/10" },
	};

	const { label, color, bgColor } = statusConfig[status];

	return (
		<motion.div
			className="bg-gunmetal-glass/20 relative border border-white/10 p-6 backdrop-blur-sm"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={springTransition}
		>
			{/* Corner accents */}
			<div className="border-cyber-lime absolute top-0 right-0 h-4 w-4 border-t border-r" />
			<div className="border-cyber-lime absolute bottom-0 left-0 h-4 w-4 border-b border-l" />

			{/* Header */}
			<div className="mb-4 flex items-start justify-between">
				<div className="flex items-center gap-3">
					<div className="text-cyber-lime">{icon}</div>
					<h3 className="font-mono text-lg tracking-tight">{title}</h3>
				</div>
				<span className={`${bgColor} ${color} px-2 py-1 font-mono text-xs`}>{label}</span>
			</div>

			<p className="text-slate-text mb-6">{description}</p>

			{children}
		</motion.div>
	);
}

export default function DemoPage() {
	const [showTerminal, setShowTerminal] = useState(true);

	return (
		<main className="min-h-screen px-6 pt-44 pb-24 sm:px-12 md:px-24">
			<div className="mx-auto max-w-[1400px]">
				{/* Back Link */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={springTransition}
				>
					<Link
						href="/"
						className="group text-slate-text hover:text-cyber-lime mb-8 inline-flex items-center gap-2 font-mono text-sm transition-colors"
					>
						<ArrowLeft
							className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
							strokeWidth={1.5}
						/>
						Back to Home
					</Link>
				</motion.div>

				{/* Header */}
				<motion.div
					className="mb-12"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={springTransition}
				>
					<h1 className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
						<span className="mr-2 animate-pulse">●</span>
						Feature Demo
					</h1>
					<h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
						Atmospheric
						<br />
						<span className="text-slate-text">Engineering Lab.</span>
					</h2>
					<p className="text-slate-text max-w-2xl text-lg">
						Preview the cutting-edge features planned for alexmayhew.dev. Each demo showcases the
						latest web technologies with precision and excellence.
					</p>
				</motion.div>

				{/* Feature Status Overview */}
				<motion.div
					className="mb-12 flex flex-wrap gap-4"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
				>
					<div className="flex items-center gap-2 font-mono text-xs">
						<Check className="text-cyber-lime h-4 w-4" strokeWidth={1.5} />
						<span className="text-slate-text">Phase 1: Email + Share Buttons</span>
						<span className="text-cyber-lime">COMPLETE</span>
					</div>
					<div className="flex items-center gap-2 font-mono text-xs">
						<TerminalIcon className="h-4 w-4 text-amber-400" strokeWidth={1.5} />
						<span className="text-slate-text">Phase 2: Interactive Terminal</span>
						<span className="text-amber-400">IN_PROGRESS</span>
					</div>
					<div className="flex items-center gap-2 font-mono text-xs">
						<Clock className="h-4 w-4 text-blue-400" strokeWidth={1.5} />
						<span className="text-slate-text">Phase 3: WebGL + AI Chat</span>
						<span className="text-blue-400">PENDING</span>
					</div>
				</motion.div>

				{/* Feature Demos */}
				<div className="space-y-12">
					{/* Terminal Demo */}
					<FeatureCard
						title="Interactive Terminal"
						description="A fully functional terminal interface that visitors can use to explore the site. Commands include whoami, ls, cat, skills, and easter eggs."
						status="demo"
						icon={<TerminalIcon className="h-6 w-6" strokeWidth={1.5} />}
					>
						<div className="mb-4 flex gap-2">
							<button
								onClick={() => setShowTerminal(true)}
								className={`border px-3 py-1.5 font-mono text-xs transition-colors ${
									showTerminal
										? "border-cyber-lime bg-cyber-lime/10 text-cyber-lime"
										: "text-slate-text hover:border-cyber-lime border-white/20"
								}`}
							>
								SHOW_TERMINAL()
							</button>
							<button
								onClick={() => setShowTerminal(false)}
								className={`border px-3 py-1.5 font-mono text-xs transition-colors ${
									!showTerminal
										? "border-cyber-lime bg-cyber-lime/10 text-cyber-lime"
										: "text-slate-text hover:border-cyber-lime border-white/20"
								}`}
							>
								HIDE_TERMINAL()
							</button>
						</div>

						{showTerminal && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								transition={springTransition}
							>
								<Terminal className="mt-4" />

								<div className="mt-4 border-t border-white/10 pt-4">
									<p className="text-slate-text font-mono text-xs">
										<span className="text-cyber-lime">TRY:</span> help, whoami, ls projects/, cat
										README, skills, neofetch, sudo hire alex
									</p>
								</div>
							</motion.div>
						)}
					</FeatureCard>

					{/* WebGL Background Demo */}
					<FeatureCard
						title="Atmospheric Background Effects"
						description="7 unique background effects crafted for the brand. ASCII fields, circuit traces, CRT overlays, and more. No generic particle clouds."
						status="demo"
						icon={<Box className="h-6 w-6" strokeWidth={1.5} />}
					>
						<div className="bg-void-navy relative h-48 overflow-hidden border border-white/10">
							{/* Preview of effects */}
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="text-center">
									<div className="text-cyber-lime mb-4 font-mono text-sm">
										7 UNIQUE EFFECTS AVAILABLE
									</div>
									<div className="text-slate-text/70 space-y-1 font-mono text-xs">
										<p>Hybrid Atmospheric • ASCII Noise Field</p>
										<p>Circuit Traces • Blueprint Grid</p>
										<p>Code Rain • Data Flow Network</p>
										<p>CRT Monitor Overlay</p>
									</div>
								</div>
							</div>

							{/* Animated preview dots */}
							<div className="absolute inset-0 opacity-30">
								{Array.from({ length: 30 }).map((_, i) => (
									<motion.div
										key={i}
										className="bg-cyber-lime absolute h-1 w-1"
										style={{
											left: `${Math.random() * 100}%`,
											top: `${Math.random() * 100}%`,
										}}
										animate={{
											opacity: [0.2, 0.8, 0.2],
											scale: [0.8, 1.2, 0.8],
										}}
										transition={{
											duration: 2 + Math.random() * 2,
											repeat: Infinity,
											delay: Math.random() * 2,
										}}
									/>
								))}
							</div>
						</div>

						<div className="mt-4">
							<Link
								href="/demo/backgrounds"
								className="group border-cyber-lime bg-cyber-lime/10 text-cyber-lime hover:bg-cyber-lime/20 inline-flex items-center gap-2 border px-4 py-2 font-mono text-xs transition-colors"
							>
								VIEW_BACKGROUNDS_LAB()
								<ArrowRight
									className="h-3 w-3 transition-transform group-hover:translate-x-1"
									strokeWidth={2}
								/>
							</Link>
							<p className="text-slate-text mt-3 font-mono text-xs">
								<span className="text-cyber-lime">TECH:</span> Canvas 2D, Procedural Noise, No
								Three.js dependency (~15KB)
							</p>
						</div>
					</FeatureCard>

					{/* AI Chat Demo */}
					<FeatureCard
						title="AI Chat Assistant"
						description="An AI-powered assistant that can answer questions about services, tech stack, and availability. Multiple deployment options to consider."
						status="discuss"
						icon={<MessageSquare className="h-6 w-6" strokeWidth={1.5} />}
					>
						{/* Chat preview */}
						<div className="bg-void-navy border border-white/10">
							{/* Title bar */}
							<div className="bg-gunmetal-glass/50 flex items-center gap-2 border-b border-white/10 px-4 py-2">
								<span className="text-cyber-lime animate-pulse text-xs">●</span>
								<span className="font-mono text-xs">ALEX_AI // Technical Assistant</span>
							</div>

							{/* Chat messages */}
							<div className="space-y-4 p-4">
								<div className="flex gap-3">
									<span className="text-cyber-lime font-mono text-xs">[AI]</span>
									<p className="text-slate-text text-sm">How can I help with your project today?</p>
								</div>
								<div className="flex gap-3">
									<span className="text-mist-white font-mono text-xs">[YOU]</span>
									<p className="text-mist-white text-sm">
										What&apos;s your experience with SaaS platforms?
									</p>
								</div>
								<div className="flex gap-3">
									<span className="text-cyber-lime font-mono text-xs">[AI]</span>
									<p className="text-slate-text text-sm">
										I&apos;ve built multiple SaaS platforms handling 100k+ users, including
										real-time analytics dashboards and subscription billing systems...
									</p>
								</div>
							</div>

							{/* Input bar */}
							<div className="border-t border-white/10 px-4 py-3">
								<div className="text-slate-text flex items-center gap-2">
									<span className="font-mono text-sm">&gt;</span>
									<span className="font-mono text-sm">Type message...</span>
									<span className="ml-auto font-mono text-xs">[↵]</span>
								</div>
							</div>
						</div>

						{/* Options to discuss */}
						<div className="mt-6 space-y-4">
							<h4 className="text-mist-white font-mono text-sm">Deployment Options:</h4>

							<div className="grid gap-4 md:grid-cols-2">
								{/* Option 1: Cloudflare Workers AI */}
								<div className="border border-white/10 p-4">
									<div className="mb-2 flex items-center gap-2">
										<span className="bg-blue-400/10 px-2 py-0.5 font-mono text-xs text-blue-400">
											OPTION_A
										</span>
										<span className="font-mono text-sm">Cloudflare Workers AI</span>
									</div>
									<ul className="text-slate-text space-y-1 font-mono text-xs">
										<li>+ Free: 10,000 neurons/day</li>
										<li>+ Edge deployment (&lt;50ms latency)</li>
										<li>+ Models: Llama 3.2, DeepSeek-R1</li>
										<li>- Requires Cloudflare account</li>
									</ul>
								</div>

								{/* Option 2: WebLLM (Browser) */}
								<div className="border border-white/10 p-4">
									<div className="mb-2 flex items-center gap-2">
										<span className="bg-cyber-lime/10 text-cyber-lime px-2 py-0.5 font-mono text-xs">
											OPTION_B
										</span>
										<span className="font-mono text-sm">WebLLM (Browser)</span>
									</div>
									<ul className="text-slate-text space-y-1 font-mono text-xs">
										<li>+ 100% Free: No server costs</li>
										<li>+ Privacy: Data never leaves device</li>
										<li>+ Offline capable after download</li>
										<li>- Initial download: 360MB-2GB</li>
										<li>- Requires WebGPU browser</li>
									</ul>
								</div>

								{/* Option 3: Hybrid */}
								<div className="border-cyber-lime/50 border p-4 md:col-span-2">
									<div className="mb-2 flex items-center gap-2">
										<span className="bg-cyber-lime/20 text-cyber-lime px-2 py-0.5 font-mono text-xs">
											RECOMMENDED
										</span>
										<span className="font-mono text-sm">Hybrid Approach</span>
									</div>
									<p className="text-slate-text font-mono text-xs">
										Primary: Cloudflare Workers AI (fast, free tier) <br />
										Optional: WebLLM toggle for privacy-conscious visitors
									</p>
								</div>
							</div>

							<p className="font-mono text-xs text-blue-400">
								→ Let&apos;s discuss which approach fits best before implementation
							</p>
						</div>
					</FeatureCard>
				</div>

				{/* Summary Section */}
				<motion.div
					className="mt-16 border-t border-white/10 pt-12"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
				>
					<h3 className="text-cyber-lime mb-6 font-mono text-xs tracking-wider uppercase">
						<span className="mr-2">●</span>
						Implementation Summary
					</h3>

					<div className="grid gap-6 md:grid-cols-3">
						<div className="border border-white/10 p-4">
							<h4 className="text-mist-white mb-2 font-mono text-sm">Phase 1 - Complete</h4>
							<ul className="text-slate-text space-y-1 font-mono text-xs">
								<li>✓ Resend email integration</li>
								<li>✓ Branded email template</li>
								<li>✓ Blog share buttons</li>
								<li>✓ Web Share API support</li>
							</ul>
						</div>

						<div className="border border-amber-400/50 p-4">
							<h4 className="text-mist-white mb-2 font-mono text-sm">Phase 2 - In Progress</h4>
							<ul className="text-slate-text space-y-1 font-mono text-xs">
								<li>● Interactive terminal (demo above)</li>
								<li>○ Command completion refinement</li>
								<li>○ Draggable/resizable window</li>
								<li>○ Integration with home page</li>
							</ul>
						</div>

						<div className="border border-white/10 p-4">
							<h4 className="text-mist-white mb-2 font-mono text-sm">Phase 3 - Pending</h4>
							<ul className="text-slate-text space-y-1 font-mono text-xs">
								<li>○ WebGL neural field background</li>
								<li>○ AI chat assistant (discuss first)</li>
								<li>○ Performance optimization</li>
								<li>○ Mobile refinements</li>
							</ul>
						</div>
					</div>
				</motion.div>
			</div>
		</main>
	);
}
