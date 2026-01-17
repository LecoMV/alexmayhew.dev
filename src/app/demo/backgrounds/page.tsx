"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
	ArrowLeft,
	Check,
	Layers,
	Zap,
	Grid3X3,
	Terminal,
	Binary,
	Network,
	Sparkles,
} from "lucide-react";
import {
	AsciiField,
	BlueprintGrid,
	CircuitTraces,
	CodeRain,
	CRTEffect,
	DataFlow,
	HybridAtmospheric,
} from "@/components/backgrounds";

const springTransition = {
	type: "spring" as const,
	stiffness: 100,
	damping: 20,
	mass: 1,
};

interface BackgroundOption {
	id: string;
	name: string;
	description: string;
	icon: React.ReactNode;
	tech: string[];
	unique: string;
	component: React.ReactNode;
}

const backgrounds: BackgroundOption[] = [
	{
		id: "hybrid",
		name: "Hybrid Atmospheric",
		description:
			"Combines ASCII noise, circuit traces, and CRT scanlines into one cohesive effect. Mouse-reactive with phosphor glow.",
		icon: <Sparkles className="h-5 w-5" strokeWidth={1.5} />,
		tech: ["Canvas 2D", "Procedural Noise", "Multi-layer Compositing"],
		unique: "This combination is genuinely unique - I haven't seen it elsewhere.",
		component: <HybridAtmospheric className="absolute inset-0" />,
	},
	{
		id: "ascii",
		name: "ASCII Noise Field",
		description:
			"Converts visual noise into terminal characters. Creates a subtle, technical texture that reinforces the developer brand.",
		icon: <Terminal className="h-5 w-5" strokeWidth={1.5} />,
		tech: ["Canvas 2D", "Perlin-like Noise", "Monospace Rendering"],
		unique: "Matches your terminal theme perfectly. Characters morph based on noise values.",
		component: <AsciiField className="absolute inset-0" color="#CCF381" fontSize={11} />,
	},
	{
		id: "circuit",
		name: "Circuit Traces",
		description:
			"Animated PCB-style traces that grow and pulse. Data flows through the connections like electricity through hardware.",
		icon: <Zap className="h-5 w-5" strokeWidth={1.5} />,
		tech: ["Canvas 2D", "Path Animation", "Glow Effects"],
		unique: "Reinforces 'engineering' literally. Traces animate with data pulses.",
		component: <CircuitTraces className="absolute inset-0" density={20} animated />,
	},
	{
		id: "blueprint",
		name: "Blueprint Grid",
		description:
			"Technical drawing aesthetic with precise grid lines. Mouse proximity reveals coordinate markers like CAD software.",
		icon: <Grid3X3 className="h-5 w-5" strokeWidth={1.5} />,
		tech: ["Canvas 2D", "Mouse Tracking", "Measurement Lines"],
		unique: "Very brutalist - precision and structure without decoration.",
		component: <BlueprintGrid className="absolute inset-0" gridSize={50} animate />,
	},
	{
		id: "coderain",
		name: "Code Rain",
		description:
			"Falling code terms and symbols. Not generic Matrix style - uses real tech terminology from your stack.",
		icon: <Binary className="h-5 w-5" strokeWidth={1.5} />,
		tech: ["Canvas 2D", "Typography Animation", "Trail Effect"],
		unique: "Uses actual programming terms: async, useState, GraphQL, etc.",
		component: <CodeRain className="absolute inset-0" speed={0.4} density={0.025} />,
	},
	{
		id: "dataflow",
		name: "Data Flow Network",
		description:
			"Interactive node graph with your actual tech stack as labels. Data pulses flow between connected nodes.",
		icon: <Network className="h-5 w-5" strokeWidth={1.5} />,
		tech: ["Canvas 2D", "Physics Simulation", "Mouse Repulsion"],
		unique: "Nodes labeled with your real skills. Mouse interaction reveals labels.",
		component: <DataFlow className="absolute inset-0" nodeCount={25} />,
	},
	{
		id: "crt",
		name: "CRT Monitor Effect",
		description:
			"Overlay that adds scanlines, vignette, and subtle phosphor flicker. Best combined with other effects.",
		icon: <Layers className="h-5 w-5" strokeWidth={1.5} />,
		tech: ["Canvas 2D", "Post-processing", "Blend Modes"],
		unique: "Like viewing through precision test equipment. High-tech instrument feel.",
		component: (
			<CRTEffect className="absolute inset-0 flex items-center justify-center">
				<div className="text-center">
					<p className="text-cyber-lime font-mono text-lg">CRT OVERLAY EFFECT</p>
					<p className="text-slate-text mt-2 font-mono text-sm">
						Scanlines + Vignette + Phosphor Glow
					</p>
				</div>
			</CRTEffect>
		),
	},
];

export default function BackgroundsDemoPage() {
	const [activeBackground, setActiveBackground] = useState<string>("hybrid");
	const [fullscreen, setFullscreen] = useState(false);

	const currentBg = backgrounds.find((b) => b.id === activeBackground);

	return (
		<main className="bg-void-navy min-h-screen">
			{/* Fullscreen Preview */}
			<AnimatePresence>
				{fullscreen && currentBg && (
					<motion.div
						className="bg-void-navy fixed inset-0 z-50"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						{currentBg.component}
						<button
							onClick={() => setFullscreen(false)}
							className="bg-void-navy/80 hover:border-cyber-lime hover:text-cyber-lime absolute top-6 right-6 z-50 border border-white/20 px-4 py-2 font-mono text-xs backdrop-blur-sm transition-colors"
						>
							EXIT_FULLSCREEN()
						</button>
						<div className="bg-void-navy/90 absolute bottom-6 left-6 z-50 max-w-md border border-white/10 p-4 backdrop-blur-sm">
							<h3 className="text-cyber-lime mb-2 font-mono text-sm">{currentBg.name}</h3>
							<p className="text-slate-text font-mono text-xs">{currentBg.description}</p>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<div className="px-6 pt-44 pb-24 sm:px-12 md:px-24">
				<div className="mx-auto max-w-[1400px]">
					{/* Back Link */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={springTransition}
					>
						<Link
							href="/demo"
							className="group text-slate-text hover:text-cyber-lime mb-8 inline-flex items-center gap-2 font-mono text-sm transition-colors"
						>
							<ArrowLeft
								className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
								strokeWidth={1.5}
							/>
							Back to Feature Demo
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
							Background Effects Lab
						</h1>
						<h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
							Atmospheric
							<br />
							<span className="text-slate-text">Rendering.</span>
						</h2>
						<p className="text-slate-text max-w-2xl text-lg">
							Each effect is crafted for the &quot;Atmospheric Engineering&quot; brand. No generic
							particle clouds. Technical precision with visual impact.
						</p>
					</motion.div>

					{/* Main Preview */}
					<motion.div
						className="bg-void-navy relative mb-8 aspect-video overflow-hidden border border-white/10"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ ...springTransition, delay: 0.1 }}
					>
						{/* Corner accents */}
						<div className="border-cyber-lime absolute top-0 right-0 z-10 h-6 w-6 border-t-2 border-r-2" />
						<div className="border-cyber-lime absolute bottom-0 left-0 z-10 h-6 w-6 border-b-2 border-l-2" />

						{/* Active background */}
						<AnimatePresence mode="wait">
							<motion.div
								key={activeBackground}
								className="absolute inset-0"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.5 }}
							>
								{currentBg?.component}
							</motion.div>
						</AnimatePresence>

						{/* Overlay info */}
						<div className="absolute top-4 left-4 z-10">
							<div className="bg-void-navy/80 border border-white/10 px-3 py-2 backdrop-blur-sm">
								<span className="text-cyber-lime font-mono text-xs">{currentBg?.icon}</span>
								<span className="text-mist-white ml-2 font-mono text-xs">{currentBg?.name}</span>
							</div>
						</div>

						{/* Fullscreen button */}
						<button
							onClick={() => setFullscreen(true)}
							className="bg-void-navy/80 hover:border-cyber-lime hover:text-cyber-lime absolute top-4 right-4 z-10 border border-white/20 px-3 py-2 font-mono text-xs backdrop-blur-sm transition-colors"
						>
							FULLSCREEN()
						</button>
					</motion.div>

					{/* Effect Selector */}
					<motion.div
						className="mb-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ ...springTransition, delay: 0.2 }}
					>
						{backgrounds.map((bg) => (
							<button
								key={bg.id}
								onClick={() => setActiveBackground(bg.id)}
								className={`group relative border p-3 text-left transition-all ${
									activeBackground === bg.id
										? "border-cyber-lime bg-cyber-lime/5"
										: "border-white/10 hover:border-white/30"
								}`}
							>
								{activeBackground === bg.id && (
									<div className="border-cyber-lime absolute top-0 right-0 h-3 w-3 border-t border-r" />
								)}
								<div
									className={`mb-2 ${activeBackground === bg.id ? "text-cyber-lime" : "text-slate-text"}`}
								>
									{bg.icon}
								</div>
								<p
									className={`font-mono text-xs ${activeBackground === bg.id ? "text-cyber-lime" : "text-mist-white"}`}
								>
									{bg.name.split(" ")[0]}
								</p>
							</button>
						))}
					</motion.div>

					{/* Effect Details */}
					<AnimatePresence mode="wait">
						{currentBg && (
							<motion.div
								key={currentBg.id}
								className="grid gap-6 lg:grid-cols-2"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={springTransition}
							>
								{/* Description */}
								<div className="border border-white/10 p-6">
									<div className="border-cyber-lime absolute top-0 right-0 h-4 w-4 border-t border-r" />

									<h3 className="text-mist-white mb-4 font-mono text-lg">{currentBg.name}</h3>
									<p className="text-slate-text mb-6">{currentBg.description}</p>

									<div className="mb-6">
										<h4 className="text-cyber-lime mb-2 font-mono text-xs tracking-wider uppercase">
											Why It&apos;s Unique
										</h4>
										<p className="text-slate-text text-sm">{currentBg.unique}</p>
									</div>

									<div>
										<h4 className="text-cyber-lime mb-2 font-mono text-xs tracking-wider uppercase">
											Technologies Used
										</h4>
										<div className="flex flex-wrap gap-2">
											{currentBg.tech.map((tech) => (
												<span
													key={tech}
													className="text-slate-text border border-white/20 px-2 py-1 font-mono text-xs"
												>
													{tech}
												</span>
											))}
										</div>
									</div>
								</div>

								{/* Recommendation */}
								<div className="border-cyber-lime/30 bg-cyber-lime/5 border p-6">
									<h3 className="text-cyber-lime mb-4 flex items-center gap-2 font-mono text-sm">
										<Check className="h-4 w-4" strokeWidth={2} />
										Recommendation
									</h3>

									{currentBg.id === "hybrid" ? (
										<div className="text-slate-text space-y-4 text-sm">
											<p>
												<strong className="text-mist-white">Best choice for homepage.</strong>{" "}
												Combines all the unique elements without being overwhelming.
											</p>
											<p>
												The ASCII creates texture, circuits add movement, and CRT scanlines provide
												the high-precision instrument feel.
											</p>
											<p className="text-cyber-lime">
												Mouse interaction reveals the depth of the effect.
											</p>
										</div>
									) : currentBg.id === "crt" ? (
										<div className="text-slate-text space-y-4 text-sm">
											<p>
												<strong className="text-mist-white">Best as an overlay.</strong> Layer this
												on top of other effects or content for the CRT monitor aesthetic.
											</p>
											<p>
												Works great with the ASCII field or as a subtle effect on the entire page.
											</p>
										</div>
									) : (
										<div className="text-slate-text space-y-4 text-sm">
											<p>
												<strong className="text-mist-white">Good standalone option.</strong> Use
												this if you want a simpler, more focused effect.
											</p>
											<p>Consider combining with the CRT overlay for added depth.</p>
										</div>
									)}
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Performance Notes */}
					<motion.div
						className="mt-12 border-t border-white/10 pt-8"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5 }}
					>
						<h3 className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
							<span className="mr-2">●</span>
							Performance & Accessibility
						</h3>
						<div className="text-slate-text grid gap-4 text-sm md:grid-cols-3">
							<div>
								<strong className="text-mist-white">Reduced Motion:</strong> All effects respect{" "}
								<code className="text-cyber-lime">prefers-reduced-motion</code> and render
								statically when enabled.
							</div>
							<div>
								<strong className="text-mist-white">Frame Rate:</strong> Effects are optimized for
								smooth 60fps on modern devices. Heavy effects can be throttled to 30fps.
							</div>
							<div>
								<strong className="text-mist-white">Bundle Size:</strong> All effects use Canvas 2D
								(no Three.js dependency). Total added JS is under 15KB gzipped.
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</main>
	);
}
