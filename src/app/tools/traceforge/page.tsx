import { ArrowLeft, Layers, Zap } from "lucide-react";
import Link from "next/link";

import { TraceForgeApp } from "@/components/traceforge";
import { SystemStatus } from "@/components/traceforge/system-status";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "TraceForge",
	description:
		"GPU-accelerated vectorization engine combining Real-ESRGAN neural upscaling with Potrace and VTracer. 10+ presets for logos, illustrations, and line art. Open source portfolio project.",
	keywords: [
		"SVG converter",
		"image to SVG",
		"vectorization",
		"PNG to SVG",
		"logo vectorizer",
		"raster to vector",
		"image tracing",
		"potrace",
		"vtracer",
		"Real-ESRGAN",
		"neural upscaling",
	],
	openGraph: {
		title: "TraceForge | GPU-Accelerated Vectorization Engine",
		description:
			"Neural upscaling meets precision tracing. Transform raster images into clean, optimized SVG vectors with 10+ presets.",
		type: "website",
		images: [
			{
				url: "/og-traceforge.png",
				width: 1200,
				height: 630,
				alt: "TraceForge - GPU-Accelerated Vectorization Engine",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "TraceForge | GPU-Accelerated Vectorization",
		description: "Neural upscaling meets precision tracing. Open source portfolio project.",
	},
};

export default function TraceForgePageRoute() {
	return <TraceForgePageContent />;
}

function TraceForgePageContent() {
	return (
		<main id="main-content" className="min-h-dvh px-6 pt-32 pb-24 sm:px-12 md:px-24">
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
							<Layers className="h-8 w-8" strokeWidth={1.5} />
						</div>
						<div className="flex items-center gap-2">
							<span className="border-cyber-lime/50 text-cyber-lime border px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase">
								Demo
							</span>
							<span className="text-slate-text border border-white/20 px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase">
								Portfolio Project
							</span>
						</div>
					</div>

					<h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
						TraceForge
						<br />
						<span className="text-slate-text">Raster to Vector in Seconds.</span>
					</h1>

					<p className="text-slate-text max-w-2xl text-lg">
						GPU-accelerated vectorization engine combining neural upscaling (Real-ESRGAN) with
						precision tracing algorithms (Potrace, VTracer). 10+ presets optimized for logos,
						illustrations, and line art.
					</p>

					{/* Status Grid */}
					<div className="mt-8 grid gap-6 lg:grid-cols-2">
						{/* System Status Panel */}
						<SystemStatus />

						{/* Demo notice */}
						<div className="relative flex h-full flex-col justify-between border border-amber-400/20 bg-amber-400/5 p-5">
							{/* Corner accents */}
							<div className="absolute top-0 left-0 h-4 w-4 border-t border-l border-amber-400/40" />
							<div className="absolute top-0 right-0 h-4 w-4 border-t border-r border-amber-400/40" />
							<div className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-amber-400/40" />
							<div className="absolute right-0 bottom-0 h-4 w-4 border-r border-b border-amber-400/40" />

							<div className="flex items-start gap-3">
								<div className="mt-0.5 text-amber-400">
									<Zap className="h-4 w-4" strokeWidth={1.5} />
								</div>
								<div>
									<p className="font-mono text-sm tracking-tight text-amber-400">
										Neural Upscaling
									</p>
									<p className="text-slate-text mt-2 text-xs leading-relaxed">
										Full vectorization is functional — Potrace, VTracer, all presets, and SVGO
										optimization work as expected. Real-ESRGAN neural upscaling requires GPU backend
										to be online.
									</p>
								</div>
							</div>

							<div className="mt-4 border-t border-amber-400/10 pt-3">
								<p className="text-slate-text font-mono text-[10px] tracking-wide uppercase">
									<span className="text-amber-400/60">●</span> GPU not required for vectorizer
								</p>
							</div>
						</div>
					</div>
				</header>

				{/* Main App */}
				<TraceForgeApp />

				{/* Technical specs */}
				<section className="mt-16 border-t border-white/10 pt-12">
					<h2 className="text-mist-white mb-6 font-mono text-sm tracking-wider uppercase">
						Technical Architecture
					</h2>
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
						<div className="space-y-2">
							<h3 className="text-cyber-lime font-mono text-sm">Tracing Engines</h3>
							<p className="text-slate-text text-xs">
								Potrace (classic bitmap tracing) + VTracer (modern multi-color vectorization)
							</p>
						</div>
						<div className="space-y-2">
							<h3 className="text-cyber-lime font-mono text-sm">Neural Upscaling</h3>
							<p className="text-slate-text text-xs">
								Real-ESRGAN 4x super-resolution with CUDA acceleration
							</p>
						</div>
						<div className="space-y-2">
							<h3 className="text-cyber-lime font-mono text-sm">Optimization</h3>
							<p className="text-slate-text text-xs">
								SVGO pipeline for production-ready, minified SVG output
							</p>
						</div>
						<div className="space-y-2">
							<h3 className="text-cyber-lime font-mono text-sm">Stack</h3>
							<p className="text-slate-text text-xs">
								Python/FastAPI backend, React frontend, Docker deployment
							</p>
						</div>
					</div>

					{/* Source code link */}
					<div className="mt-8 flex items-center gap-4">
						<a
							href="https://github.com/alexmayhew/vectorizer"
							target="_blank"
							rel="noopener noreferrer"
							className="text-slate-text hover:text-cyber-lime flex items-center gap-2 border border-white/10 px-4 py-2 font-mono text-xs transition-colors hover:border-white/30"
						>
							<span>View Source on GitHub</span>
							<span className="text-[10px] opacity-50">→</span>
						</a>
					</div>
				</section>
			</div>
		</main>
	);
}
