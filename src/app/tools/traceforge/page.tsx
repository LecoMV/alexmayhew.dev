import type { Metadata } from "next";
import { Layers, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TraceForgeApp } from "@/components/traceforge";

export const metadata: Metadata = {
	title: "TraceForge",
	description:
		"Transform raster images into clean, optimized SVG vectors instantly. GPU-accelerated vectorization with 10+ presets for logos, illustrations, and line art. Free, no signup required.",
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
	],
	openGraph: {
		title: "TraceForge | Raster to Vector in Seconds",
		description:
			"Transform PNG, JPG, and WebP images into clean, optimized SVG vectors. GPU-accelerated with 10+ presets.",
		type: "website",
		images: [
			{
				url: "/og-traceforge.png",
				width: 1200,
				height: 630,
				alt: "TraceForge - Raster to Vector Converter",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "TraceForge | Raster to Vector in Seconds",
		description: "Transform images into clean SVG vectors instantly. Free, no signup.",
	},
};

export default function TraceForgePageRoute() {
	return <TraceForgePageContent />;
}

function TraceForgePageContent() {
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
							<Layers className="h-8 w-8" strokeWidth={1.5} />
						</div>
						<div>
							<span className="text-cyber-lime block font-mono text-xs tracking-wider uppercase">
								<span className="mr-2 animate-pulse">●</span>
								Live Tool
							</span>
						</div>
					</div>

					<h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
						TraceForge
						<br />
						<span className="text-slate-text">Raster to Vector in Seconds.</span>
					</h1>

					<p className="text-slate-text max-w-2xl text-lg">
						Transform PNG, JPG, and WebP images into clean, optimized SVG vectors. Powered by neural
						upscaling and precision tracing algorithms. No signup required.
					</p>
				</header>

				{/* Main App */}
				<TraceForgeApp />

				{/* Technical specs */}
				<section className="mt-16 border-t border-white/10 pt-12">
					<h2 className="text-mist-white mb-6 font-mono text-sm tracking-wider uppercase">
						Under the Hood
					</h2>
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
						<div className="space-y-2">
							<h3 className="text-cyber-lime font-mono text-sm">Engines</h3>
							<p className="text-slate-text text-xs">
								Potrace (classic bitmap tracing) + VTracer (modern multi-color)
							</p>
						</div>
						<div className="space-y-2">
							<h3 className="text-cyber-lime font-mono text-sm">Upscaling</h3>
							<p className="text-slate-text text-xs">
								Neural super-resolution with CUDA acceleration (RTX 3080)
							</p>
						</div>
						<div className="space-y-2">
							<h3 className="text-cyber-lime font-mono text-sm">Optimization</h3>
							<p className="text-slate-text text-xs">
								SVGO pipeline for production-ready, minified SVG output
							</p>
						</div>
						<div className="space-y-2">
							<h3 className="text-cyber-lime font-mono text-sm">Formats</h3>
							<p className="text-slate-text text-xs">
								Input: PNG, JPG, WebP, GIF, BMP (max 20MB, 8192×8192)
							</p>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}
