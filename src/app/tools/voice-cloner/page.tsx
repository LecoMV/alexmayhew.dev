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
	Sparkles,
	Shield,
	Globe,
	FileText,
	Wand2,
	Headphones,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Voice Cloner — AI Text-to-Speech & Audiobook Studio",
	description:
		"Turn any text into professional audio with AI voice cloning. 41 curated voices, multi-voice conversations, and a full audiobook studio. Powered by Qwen3-TTS. Free during beta.",
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
		"free TTS",
		"AI narrator",
	],
	openGraph: {
		title: "Voice Cloner | AI Text-to-Speech, Conversations & Audiobook Studio",
		description:
			"41 curated voices. Zero-shot cloning. Multi-voice conversations. Full audiobook production. GPU-accelerated on RTX 3080. Free during beta.",
		type: "website",
		images: [
			{
				url: "/og-voice-cloner.png",
				width: 1200,
				height: 630,
				alt: "Voice Cloner — AI Text-to-Speech with Voice Cloning & Audiobook Studio",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Voice Cloner | AI Text-to-Speech & Audiobook Studio",
		description:
			"41 curated voices, zero-shot cloning, multi-voice conversations, and manuscript-to-audiobook production. Try it free.",
	},
};

const stats = [
	{ value: "41", label: "Curated Voices" },
	{ value: "<5s", label: "Generation Time" },
	{ value: "24kHz", label: "Audio Quality" },
	{ value: "Free", label: "During Beta" },
];

const capabilities = [
	{
		icon: <Mic className="h-6 w-6" strokeWidth={1.5} />,
		title: "Single Voice TTS",
		description:
			"Type or paste text, pick a voice, get natural speech. The fastest path from script to audio. Download as WAV or MP3.",
		badge: "Quick Start",
	},
	{
		icon: <MessageSquare className="h-6 w-6" strokeWidth={1.5} />,
		title: "Multi-Voice Conversations",
		description:
			"Build multi-speaker scripts with drag-and-drop line ordering, per-line speed/volume/gap controls, stage directions, takes, and ambient scene audio.",
		badge: "Advanced",
	},
	{
		icon: <BookOpen className="h-6 w-6" strokeWidth={1.5} />,
		title: "Audiobook Studio",
		description:
			"Upload DOCX/PDF/TXT manuscripts. Auto-parse chapters, detect dialogue, assign character voices, and export distribution-ready M4B with chapter markers or MP3.",
		badge: "Production",
	},
];

const features = [
	{
		icon: <AudioWaveform className="h-5 w-5" strokeWidth={1.5} />,
		title: "Zero-Shot Voice Cloning",
		description:
			"Clone any voice from a short audio sample. No fine-tuning — the model captures speaker identity from reference audio alone.",
	},
	{
		icon: <Sparkles className="h-5 w-5" strokeWidth={1.5} />,
		title: "AI Audio Enhancement",
		description:
			"Upload any quality audio. Our pipeline removes noise via Demucs vocal separation, enhances with DeepFilterNet3, and auto-transcribes.",
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
			"Runs on a dedicated RTX 3080 with 10GB VRAM. Speech generates in seconds, not minutes. Real-time streaming updates.",
	},
	{
		icon: <Wand2 className="h-5 w-5" strokeWidth={1.5} />,
		title: "AI Cast Director",
		description:
			"Upload a manuscript and let AI analyze characters, suggest voice assignments, and generate the entire audiobook with one click.",
	},
	{
		icon: <Headphones className="h-5 w-5" strokeWidth={1.5} />,
		title: "Per-Line Effects",
		description:
			"Fine-tune each line with speed, volume, and gap controls. Add stage directions for emotional context. Retake individual lines.",
	},
	{
		icon: <Globe className="h-5 w-5" strokeWidth={1.5} />,
		title: "Multi-Language",
		description:
			"Generate speech in English, Chinese, Japanese, Korean, and more. The model handles multilingual text natively.",
	},
	{
		icon: <Shield className="h-5 w-5" strokeWidth={1.5} />,
		title: "Content Moderation",
		description:
			"Built-in content safety checks. Rate limiting, abuse prevention, and secure audio storage on Cloudflare R2.",
	},
	{
		icon: <FileText className="h-5 w-5" strokeWidth={1.5} />,
		title: "Manuscript Converter",
		description:
			"Import DOCX, PDF, EPUB, or plain text. Auto-detect chapters, dialogue, and characters. Export scripts in any format.",
	},
];

const steps = [
	{
		step: "01",
		label: "Choose your workflow",
		description:
			"Quick TTS for short clips, conversations for multi-speaker scripts, or audiobook studio for full manuscripts.",
	},
	{
		step: "02",
		label: "Pick or clone voices",
		description:
			"Browse 41 curated voices (presidents, actors, narrators) or upload your own audio sample to clone a new voice.",
	},
	{
		step: "03",
		label: "Generate and download",
		description:
			"Generate audio with real-time progress. Download as WAV, MP3, or M4B audiobook. LUFS-normalized for consistent volume.",
	},
];

const audiobookFeatures = [
	{
		icon: <Settings2 className="text-cyber-lime mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />,
		title: "Manuscript Parsing",
		description:
			"Upload DOCX, PDF, or TXT files. The parser auto-detects chapter breaks, identifies dialogue patterns, and extracts character names.",
	},
	{
		icon: <Users className="text-cyber-lime mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />,
		title: "Character Voice Casting",
		description:
			"Assign a unique AI voice to each character and narrator. Voice assignments propagate across all chapters automatically.",
	},
	{
		icon: <AudioWaveform className="text-cyber-lime mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />,
		title: "Pronunciation Dictionary",
		description:
			"Define custom pronunciations for character names, places, and terminology. Applied consistently across every chapter.",
	},
	{
		icon: <Download className="text-cyber-lime mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />,
		title: "Distribution-Ready Export",
		description:
			"Export as M4B with chapter markers and cover art, or MP3/WAV zip. LUFS normalization and loudness mastering included.",
	},
];

const specs = [
	{ label: "Model", value: "Qwen3-TTS 1.7B" },
	{ label: "GPU", value: "NVIDIA RTX 3080 (10GB)" },
	{ label: "Backend", value: "FastAPI + Redis + PostgreSQL" },
	{ label: "Frontend", value: "Next.js 15 on Cloudflare Workers" },
	{ label: "Audio", value: "24kHz, -19 LUFS, WAV/MP3/M4B" },
	{ label: "Auth", value: "Clerk (JWT + JWKS)" },
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

				{/* Hero */}
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
								Public Beta
							</span>
						</div>
					</div>

					<h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
						Turn Any Text Into a
						<br />
						<span className="text-cyber-lime">Professional Audiobook</span>
					</h1>

					<p className="text-slate-text mb-8 max-w-2xl text-lg leading-relaxed">
						AI voices that sound human. 41 curated voices — presidents, actors, narrators. Upload
						your own voice to clone. Build conversations, produce full audiobooks, or generate quick
						clips. All free during beta.
					</p>

					<div className="flex flex-wrap items-center gap-4">
						<a
							href="https://voicecloner.alexmayhew.dev"
							target="_blank"
							rel="noopener noreferrer"
							className="bg-cyber-lime text-void-navy hover:bg-cyber-lime/90 flex items-center gap-2 px-6 py-3 font-mono text-sm font-bold tracking-tight transition-colors"
						>
							<span>Try Voice Cloner Free</span>
							<ExternalLink className="h-4 w-4" strokeWidth={2} />
						</a>
						<span className="text-slate-text/60 text-sm">No credit card required</span>
					</div>
				</header>

				{/* Stats */}
				<section className="mb-16">
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
						{stats.map((stat) => (
							<div
								key={stat.label}
								className="border-cyber-lime/20 bg-cyber-lime/5 border p-4 text-center"
							>
								<div className="text-cyber-lime text-2xl font-bold">{stat.value}</div>
								<div className="text-slate-text mt-1 font-mono text-xs">{stat.label}</div>
							</div>
						))}
					</div>
				</section>

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
								<div className="mb-3 flex items-center justify-between">
									<div className="text-cyber-lime">{cap.icon}</div>
									<span className="border-cyber-lime/30 text-cyber-lime/70 border px-2 py-0.5 font-mono text-[9px] tracking-wider uppercase">
										{cap.badge}
									</span>
								</div>
								<h3 className="text-mist-white mb-2 font-mono text-sm">{cap.title}</h3>
								<p className="text-slate-text text-xs leading-relaxed">{cap.description}</p>
							</div>
						))}
					</div>
				</section>

				{/* Feature Grid */}
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

				{/* Audiobook Studio Deep Dive */}
				<section className="mb-16 border-t border-white/10 pt-12">
					<h2 className="text-mist-white mb-2 font-mono text-sm tracking-wider uppercase">
						Audiobook Studio
					</h2>
					<p className="text-slate-text mb-8 max-w-2xl text-sm">
						Go from manuscript to distribution-ready audiobook. Upload your document, let AI detect
						chapters and characters, assign voices, and export with chapter markers.
					</p>
					<div className="grid gap-6 sm:grid-cols-2">
						{audiobookFeatures.map((af) => (
							<div key={af.title} className="flex items-start gap-3">
								{af.icon}
								<div>
									<h3 className="text-mist-white mb-1 font-mono text-xs">{af.title}</h3>
									<p className="text-slate-text text-xs leading-relaxed">{af.description}</p>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* Tech Specs */}
				<section className="mb-16 border-t border-white/10 pt-12">
					<h2 className="text-mist-white mb-6 font-mono text-sm tracking-wider uppercase">
						Technical Stack
					</h2>
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{specs.map((spec) => (
							<div key={spec.label} className="space-y-1">
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
								41 voices, conversations, audiobook production — all included. No credit card
								required.
							</p>
						</div>
						<a
							href="https://voicecloner.alexmayhew.dev"
							target="_blank"
							rel="noopener noreferrer"
							className="bg-cyber-lime text-void-navy hover:bg-cyber-lime/90 flex shrink-0 items-center gap-2 px-6 py-3 font-mono text-sm font-bold tracking-tight transition-colors"
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
