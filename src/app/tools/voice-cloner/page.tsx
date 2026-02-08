import type { Metadata } from "next";
import {
	Mic,
	ArrowLeft,
	ExternalLink,
	Cpu,
	Zap,
	AudioWaveform,
	Users,
	BookOpen,
	MessageSquare,
	Settings2,
	Download,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Voice Cloner",
	description:
		"AI text-to-speech with zero-shot voice cloning and audiobook production. Powered by Qwen3-TTS 1.7B on RTX 3080. Multi-voice conversations, audiobook studio, and distribution-ready export.",
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
		"audiobook production",
		"audiobook studio",
		"AI audiobook",
		"manuscript to audiobook",
		"multi-voice narration",
		"text to audiobook",
	],
	openGraph: {
		title: "Voice Cloner | AI Text-to-Speech, Conversations & Audiobook Studio",
		description:
			"Neural TTS powered by Qwen3-TTS 1.7B. Zero-shot voice cloning, multi-voice conversations, and manuscript-to-audiobook production. GPU-accelerated on RTX 3080.",
		type: "website",
		images: [
			{
				url: "/og-voice-cloner.png",
				width: 1200,
				height: 630,
				alt: "Voice Cloner - AI Text-to-Speech with Voice Cloning & Audiobook Studio",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Voice Cloner | AI Text-to-Speech & Audiobook Studio",
		description:
			"Zero-shot voice cloning, multi-voice conversations, and manuscript-to-audiobook production. Try it free.",
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
		icon: <MessageSquare className="h-5 w-5" strokeWidth={1.5} />,
		title: "Multi-Voice Conversations",
		description:
			"Build multi-speaker scripts with drag-and-drop line ordering, per-line effects (speed, volume, gap), stage directions, and a waveform timeline editor.",
	},
	{
		icon: <BookOpen className="h-5 w-5" strokeWidth={1.5} />,
		title: "Audiobook Studio",
		description:
			"Upload a manuscript (DOCX, PDF, or TXT) and auto-parse it into chapters with dialogue detection. Assign voices to characters, add pronunciation overrides, and export distribution-ready M4B or MP3.",
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
		title: "Free During Beta",
		description:
			"Full access to 40+ curated voices plus 3 custom voice uploads — all free during beta. Conversations and audiobook production included.",
	},
];

const steps = [
	{
		step: "01",
		label: "Create your project",
		description:
			"Quick TTS, multi-speaker conversation, or full audiobook from a manuscript upload",
	},
	{
		step: "02",
		label: "Assign voices",
		description: "Choose from 40+ curated voices or upload your own for each speaker or character",
	},
	{
		step: "03",
		label: "Generate and export",
		description:
			"Generate audio with per-line effects, then download as WAV, MP3, or M4B audiobook",
	},
];

const specs = [
	{ label: "Model", value: "Qwen3-TTS 1.7B" },
	{ label: "GPU", value: "NVIDIA RTX 3080" },
	{ label: "Backend", value: "FastAPI + Redis" },
	{ label: "Frontend", value: "Next.js 15" },
];

const capabilities = [
	{
		icon: <Mic className="h-5 w-5" strokeWidth={1.5} />,
		title: "Single Voice TTS",
		description:
			"Type text, pick a voice, get natural speech. The fastest path from script to audio.",
	},
	{
		icon: <MessageSquare className="h-5 w-5" strokeWidth={1.5} />,
		title: "Conversations",
		description:
			"Multi-speaker scripts with drag-and-drop ordering, per-line speed/volume/gap controls, stage directions, takes, and a waveform timeline with ambient audio.",
	},
	{
		icon: <BookOpen className="h-5 w-5" strokeWidth={1.5} />,
		title: "Audiobook Studio",
		description:
			"Upload DOCX/PDF/TXT manuscripts. Auto-parse chapters, detect dialogue, assign character voices, set pronunciation overrides, and export as M4B with chapter markers or MP3 zip.",
	},
];

export default function VoiceClonerPage() {
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
						<span className="text-slate-text">TTS, Conversations & Audiobooks.</span>
					</h1>

					<p className="text-slate-text max-w-2xl text-lg">
						Type text, build multi-speaker conversations, or turn entire manuscripts into
						distribution-ready audiobooks — all powered by Qwen3-TTS with zero-shot voice cloning.
					</p>
				</header>

				{/* Three Modes */}
				<section className="mb-16">
					<h2 className="text-mist-white mb-8 font-mono text-sm tracking-wider uppercase">
						Three Ways to Create
					</h2>
					<div className="grid gap-6 sm:grid-cols-3">
						{capabilities.map((cap) => (
							<div
								key={cap.title}
								className="group relative border border-white/10 p-6 transition-colors hover:border-white/20"
							>
								<div className="border-cyber-lime absolute top-0 right-0 h-4 w-4 border-t border-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
								<div className="border-cyber-lime absolute bottom-0 left-0 h-4 w-4 border-b border-l opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
								<div className="text-cyber-lime mb-3">{cap.icon}</div>
								<h3 className="text-mist-white mb-2 font-mono text-sm">{cap.title}</h3>
								<p className="text-slate-text text-xs leading-relaxed">{cap.description}</p>
							</div>
						))}
					</div>
				</section>

				{/* Feature grid */}
				<section className="mb-16">
					<h2 className="text-mist-white mb-8 font-mono text-sm tracking-wider uppercase">
						Features
					</h2>
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{features.map((feature) => (
							<div
								key={feature.title}
								className="group relative border border-white/10 p-6 transition-colors hover:border-white/20"
							>
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

				{/* Audiobook Details */}
				<section className="mb-16 border-t border-white/10 pt-12">
					<h2 className="text-mist-white mb-6 font-mono text-sm tracking-wider uppercase">
						Audiobook Studio
					</h2>
					<div className="grid gap-6 sm:grid-cols-2">
						<div className="space-y-4">
							<div className="flex items-start gap-3">
								<Settings2 className="text-cyber-lime mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
								<div>
									<h3 className="text-mist-white mb-1 font-mono text-xs">Manuscript Parsing</h3>
									<p className="text-slate-text text-xs leading-relaxed">
										Upload DOCX, PDF, or TXT files. The parser auto-detects chapter breaks,
										identifies dialogue patterns, and extracts character names.
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<Users className="text-cyber-lime mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
								<div>
									<h3 className="text-mist-white mb-1 font-mono text-xs">
										Character Voice Casting
									</h3>
									<p className="text-slate-text text-xs leading-relaxed">
										Assign a unique AI voice to each character and narrator. Voice assignments
										propagate across all chapters automatically.
									</p>
								</div>
							</div>
						</div>
						<div className="space-y-4">
							<div className="flex items-start gap-3">
								<AudioWaveform
									className="text-cyber-lime mt-0.5 h-4 w-4 shrink-0"
									strokeWidth={1.5}
								/>
								<div>
									<h3 className="text-mist-white mb-1 font-mono text-xs">
										Pronunciation Dictionary
									</h3>
									<p className="text-slate-text text-xs leading-relaxed">
										Define custom pronunciations for character names, places, and terminology.
										Applied consistently across every chapter.
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<Download className="text-cyber-lime mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
								<div>
									<h3 className="text-mist-white mb-1 font-mono text-xs">
										Distribution-Ready Export
									</h3>
									<p className="text-slate-text text-xs leading-relaxed">
										Export as M4B with chapter markers and cover art, or MP3/WAV zip. LUFS
										normalization and loudness mastering included.
									</p>
								</div>
							</div>
						</div>
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
							<h3 className="text-mist-white mb-2 font-mono text-lg">Try it free during beta</h3>
							<p className="text-slate-text text-sm">
								TTS, conversations, and audiobook production — all included. No payment required.
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
