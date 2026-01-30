import type { Metadata } from "next";
import { Mic, ArrowLeft, ExternalLink, Cpu, Zap, AudioWaveform, Users } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Voice Cloner",
	description:
		"AI text-to-speech with zero-shot voice cloning. Powered by Qwen3-TTS 1.7B on RTX 3080. Type text, pick a voice, get natural speech in seconds.",
	keywords: [
		"text to speech",
		"voice cloning",
		"TTS",
		"AI voice",
		"voice synthesis",
		"Qwen3-TTS",
		"neural TTS",
		"voice generator",
		"speech synthesis",
		"zero-shot cloning",
	],
	openGraph: {
		title: "Voice Cloner | AI Text-to-Speech with Voice Cloning",
		description:
			"Neural TTS powered by Qwen3-TTS 1.7B. Zero-shot voice cloning, GPU-accelerated on RTX 3080.",
		type: "website",
		images: [
			{
				url: "/og-voice-cloner.png",
				width: 1200,
				height: 630,
				alt: "Voice Cloner - AI Text-to-Speech with Voice Cloning",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Voice Cloner | AI Text-to-Speech",
		description: "Zero-shot voice cloning powered by Qwen3-TTS. Try it free.",
	},
};

const features = [
	{
		icon: <AudioWaveform className="h-5 w-5" strokeWidth={1.5} />,
		title: "Zero-Shot Voice Cloning",
		description:
			"Clone any voice from a short audio sample. No fine-tuning required — the model captures speaker identity from reference audio alone.",
	},
	{
		icon: <Zap className="h-5 w-5" strokeWidth={1.5} />,
		title: "Neural TTS Engine",
		description:
			"Qwen3-TTS 1.7B delivers natural, expressive speech with proper pacing, intonation, and emotion. Far beyond robotic TTS.",
	},
	{
		icon: <Cpu className="h-5 w-5" strokeWidth={1.5} />,
		title: "GPU-Accelerated",
		description:
			"Runs on a dedicated RTX 3080 for fast inference. Generate speech in seconds, not minutes.",
	},
	{
		icon: <Users className="h-5 w-5" strokeWidth={1.5} />,
		title: "Free Tier Available",
		description:
			"Access curated pre-cloned voices at no cost. Premium tier unlocks custom voice uploads and higher usage limits.",
	},
];

const steps = [
	{ step: "01", label: "Type your text", description: "Enter any text you want spoken aloud" },
	{
		step: "02",
		label: "Pick a voice",
		description: "Choose from curated voices or upload your own",
	},
	{ step: "03", label: "Get speech", description: "Download or stream your generated audio" },
];

const specs = [
	{ label: "Model", value: "Qwen3-TTS 1.7B" },
	{ label: "GPU", value: "NVIDIA RTX 3080" },
	{ label: "Backend", value: "FastAPI + Redis" },
	{ label: "Frontend", value: "Next.js 15" },
];

export default function VoiceClonerPage() {
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
				<header className="mb-16">
					<div className="mb-4 flex items-center gap-3">
						<div className="text-cyber-lime">
							<Mic className="h-8 w-8" strokeWidth={1.5} />
						</div>
						<div className="flex items-center gap-2">
							<span className="border-cyber-lime/50 text-cyber-lime border px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase">
								Live
							</span>
							<span className="text-slate-text border border-white/20 px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase">
								AI-Powered
							</span>
						</div>
					</div>

					<h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
						Voice Cloner
						<br />
						<span className="text-slate-text">Text to Speech, Any Voice.</span>
					</h1>

					<p className="text-slate-text max-w-2xl text-lg">
						Type any text, pick a voice, and get natural AI-generated speech in seconds. Powered by
						Qwen3-TTS with zero-shot voice cloning — no training required.
					</p>
				</header>

				{/* Feature grid */}
				<section className="mb-16">
					<h2 className="text-mist-white mb-8 font-mono text-sm tracking-wider uppercase">
						Features
					</h2>
					<div className="grid gap-6 sm:grid-cols-2">
						{features.map((feature) => (
							<div
								key={feature.title}
								className="group relative border border-white/10 p-6 transition-colors hover:border-white/20"
							>
								{/* Corner accents */}
								<div className="border-cyber-lime absolute top-0 right-0 h-4 w-4 border-t border-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
								<div className="border-cyber-lime absolute bottom-0 left-0 h-4 w-4 border-b border-l opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

								<div className="text-cyber-lime mb-3">{feature.icon}</div>
								<h3 className="text-mist-white mb-2 font-mono text-sm">{feature.title}</h3>
								<p className="text-slate-text text-xs leading-relaxed">{feature.description}</p>
							</div>
						))}
					</div>
				</section>

				{/* How It Works */}
				<section className="mb-16">
					<h2 className="text-mist-white mb-8 font-mono text-sm tracking-wider uppercase">
						How It Works
					</h2>
					<div className="grid gap-6 sm:grid-cols-3">
						{steps.map((item, index) => (
							<div key={item.step} className="relative border border-white/10 p-6">
								<div className="flex items-start gap-4">
									<span className="text-cyber-lime font-mono text-2xl leading-none font-bold opacity-40">
										{item.step}
									</span>
									<div>
										<h3 className="text-mist-white mb-1 font-mono text-sm">{item.label}</h3>
										<p className="text-slate-text text-xs leading-relaxed">{item.description}</p>
									</div>
								</div>
								{index < steps.length - 1 && (
									<div className="text-slate-text absolute top-1/2 -right-3 z-10 hidden -translate-y-1/2 font-mono text-xs sm:block">
										&rarr;
									</div>
								)}
							</div>
						))}
					</div>
				</section>

				{/* Tech Specs */}
				<section className="mb-16 border-t border-white/10 pt-12">
					<h2 className="text-mist-white mb-6 font-mono text-sm tracking-wider uppercase">
						Technical Specs
					</h2>
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{specs.map((spec) => (
							<div key={spec.label} className="space-y-2">
								<h3 className="text-cyber-lime font-mono text-sm">{spec.label}</h3>
								<p className="text-slate-text text-xs">{spec.value}</p>
							</div>
						))}
					</div>
				</section>

				{/* CTA */}
				<section className="border-t border-white/10 pt-12">
					<div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h3 className="text-mist-white mb-2 font-mono text-lg">Ready to try it?</h3>
							<p className="text-slate-text text-sm">
								Generate AI speech with any voice. Free tier available.
							</p>
						</div>
						<a
							href="https://voicecloner.alexmayhew.dev"
							target="_blank"
							rel="noopener noreferrer"
							className="bg-cyber-lime text-void-navy hover:bg-cyber-lime/90 flex items-center gap-2 px-6 py-3 font-mono text-sm font-bold tracking-tight transition-colors"
						>
							<span>Try Voice Cloner</span>
							<ExternalLink className="h-4 w-4" strokeWidth={2} />
						</a>
					</div>
				</section>
			</div>
		</main>
	);
}
