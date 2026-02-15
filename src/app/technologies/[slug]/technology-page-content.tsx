"use client";

import { m } from "framer-motion";
import {
	AlertTriangle,
	ArrowRight,
	Briefcase,
	CheckCircle2,
	ChevronRight,
	Code2,
	Layers,
	Lightbulb,
	Target,
} from "lucide-react";
import Link from "next/link";

import { trackCTAClick } from "@/components/analytics";
import { getPublishedPages } from "@/data/pseo";

import type { Technology } from "@/data/pseo/technologies";

interface TechnologyPageContentProps {
	technology: Technology;
}

const springTransition = {
	type: "spring" as const,
	stiffness: 100,
	damping: 20,
	mass: 1,
};

// Get related service pages for this technology
function getRelatedServicePages(technologyId: string) {
	const pages = getPublishedPages();
	// Map technology IDs to the technology slugs used in pages
	const technologyMap: Record<string, string[]> = {
		"react-nextjs": ["nextjs", "react"],
		"python-fastapi": ["python"],
		"nodejs-express": ["nodejs"],
		postgresql: ["postgresql"],
		"ai-ml-integration": ["ai-ml"],
		"cloud-architecture": [],
		typescript: ["typescript"],
		graphql: ["graphql"],
	};

	const matchingSlugs = technologyMap[technologyId] || [];
	return pages.filter((page) => matchingSlugs.some((slug) => page.technology === slug)).slice(0, 6);
}

export function TechnologyPageContent({ technology }: TechnologyPageContentProps) {
	const relatedPages = getRelatedServicePages(technology.id);

	return (
		<main className="min-h-dvh px-6 pt-44 pb-24 sm:px-12 md:px-24">
			<div className="mx-auto max-w-[1400px]">
				{/* Breadcrumb */}
				<m.nav
					className="text-slate-text mb-8 flex items-center gap-2 font-mono text-xs"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.3 }}
				>
					<Link href="/" className="hover:text-cyber-lime transition-colors">
						Home
					</Link>
					<ChevronRight className="h-3 w-3" />
					<Link href="/technologies" className="hover:text-cyber-lime transition-colors">
						Technologies
					</Link>
					<ChevronRight className="h-3 w-3" />
					<span className="text-mist-white">{technology.displayName}</span>
				</m.nav>

				{/* Hero Section */}
				<HeroSection technology={technology} />

				{/* Expertise Section */}
				<ExpertiseSection technology={technology} />

				{/* When to Use Section */}
				<WhenToUseSection technology={technology} />

				{/* Best Practices Section */}
				<BestPracticesSection technology={technology} />

				{/* Common Pitfalls Section */}
				<PitfallsSection technology={technology} />

				{/* Project Types Section */}
				<ProjectTypesSection technology={technology} />

				{/* Complementary Tech Section */}
				<ComplementaryTechSection technology={technology} />

				{/* Real World Example Section */}
				<RealWorldExampleSection technology={technology} />

				{/* Related Services Section */}
				{relatedPages.length > 0 && <RelatedServicesSection pages={relatedPages} />}

				{/* CTA Section */}
				<CtaSection technology={technology} />
			</div>
		</main>
	);
}

function HeroSection({ technology }: { technology: Technology }) {
	return (
		<m.section
			className="mb-20"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={springTransition}
		>
			<div className="mb-6 flex items-center gap-4">
				<Code2 className="text-cyber-lime h-8 w-8" strokeWidth={1.5} />
				<h1 className="text-cyber-lime font-mono text-xs tracking-wider uppercase">
					<span className="mr-2 animate-pulse">●</span>
					Technology Expertise
				</h1>
			</div>

			<h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
				{technology.displayName}
				<br />
				<span className="text-slate-text">Development.</span>
			</h2>

			<p className="text-slate-text max-w-3xl text-lg leading-relaxed">
				Expert {technology.displayName} development with deep production experience. From
				architecture decisions to performance optimization, I help teams build systems that scale.
			</p>

			{/* Target Keywords as Tags */}
			<div className="mt-8 flex flex-wrap gap-2">
				{technology.targetKeywords.slice(0, 6).map((keyword) => (
					<span
						key={keyword}
						className="bg-gunmetal-glass/30 text-slate-text border border-white/10 px-3 py-1 font-mono text-xs"
					>
						{keyword}
					</span>
				))}
			</div>
		</m.section>
	);
}

function ExpertiseSection({ technology }: { technology: Technology }) {
	return (
		<m.section
			className="mb-20"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ ...springTransition, delay: 0.1 }}
		>
			<div className="bg-gunmetal-glass/20 relative border border-white/10 p-8 backdrop-blur-sm">
				<div className="border-cyber-lime absolute top-0 right-0 h-4 w-4 border-t border-r" />
				<div className="border-cyber-lime absolute bottom-0 left-0 h-4 w-4 border-b border-l" />

				<h3 className="text-cyber-lime mb-6 font-mono text-xs tracking-wider uppercase">
					<span className="mr-2">●</span>
					Expertise Level
				</h3>

				<p className="text-mist-white leading-relaxed">{technology.expertiseLevel}</p>
			</div>
		</m.section>
	);
}

function WhenToUseSection({ technology }: { technology: Technology }) {
	return (
		<m.section
			className="mb-20"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ ...springTransition, delay: 0.15 }}
		>
			<h3 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
				<span className="mr-2">●</span>
				When to Use {technology.displayName}
			</h3>

			<div className="grid gap-4 md:grid-cols-2">
				{technology.whenToUse.map((useCase, index) => (
					<m.div
						key={index}
						className="bg-gunmetal-glass/10 group relative border border-white/10 p-6 transition-colors hover:border-white/20"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ ...springTransition, delay: 0.2 + index * 0.05 }}
					>
						<div className="flex items-start gap-4">
							<Lightbulb className="text-cyber-lime mt-1 h-5 w-5 flex-shrink-0" strokeWidth={1.5} />
							<p className="text-slate-text text-sm leading-relaxed">{useCase}</p>
						</div>
					</m.div>
				))}
			</div>
		</m.section>
	);
}

function BestPracticesSection({ technology }: { technology: Technology }) {
	return (
		<m.section
			className="mb-20"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ ...springTransition, delay: 0.2 }}
		>
			<h3 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
				<span className="mr-2">●</span>
				Best Practices
			</h3>

			<div className="space-y-4">
				{technology.bestPractices.map((practice, index) => (
					<m.div
						key={index}
						className="bg-gunmetal-glass/10 border border-white/10 p-6"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ ...springTransition, delay: 0.25 + index * 0.05 }}
					>
						<div className="flex items-start gap-4">
							<CheckCircle2
								className="text-cyber-lime mt-1 h-5 w-5 flex-shrink-0"
								strokeWidth={1.5}
							/>
							<p className="text-mist-white text-sm leading-relaxed">{practice}</p>
						</div>
					</m.div>
				))}
			</div>
		</m.section>
	);
}

function PitfallsSection({ technology }: { technology: Technology }) {
	return (
		<m.section
			className="mb-20"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ ...springTransition, delay: 0.25 }}
		>
			<h3 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
				<span className="mr-2">●</span>
				Common Pitfalls to Avoid
			</h3>

			<div className="space-y-4">
				{technology.commonPitfalls.map((pitfall, index) => (
					<m.div
						key={index}
						className="bg-burnt-ember/5 border-burnt-ember/30 border p-6"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ ...springTransition, delay: 0.3 + index * 0.05 }}
					>
						<div className="flex items-start gap-4">
							<AlertTriangle
								className="text-burnt-ember mt-1 h-5 w-5 flex-shrink-0"
								strokeWidth={1.5}
							/>
							<p className="text-slate-text text-sm leading-relaxed">{pitfall}</p>
						</div>
					</m.div>
				))}
			</div>
		</m.section>
	);
}

function ProjectTypesSection({ technology }: { technology: Technology }) {
	return (
		<m.section
			className="mb-20"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ ...springTransition, delay: 0.3 }}
		>
			<h3 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
				<span className="mr-2">●</span>
				Ideal Project Types
			</h3>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{technology.projectTypes.map((projectType, index) => (
					<m.div
						key={index}
						className="bg-gunmetal-glass/20 border border-white/10 p-6 transition-colors hover:border-white/20"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ ...springTransition, delay: 0.35 + index * 0.05 }}
					>
						<div className="flex items-center gap-3">
							<Briefcase className="text-cyber-lime h-5 w-5" strokeWidth={1.5} />
							<span className="text-mist-white font-mono text-sm">{projectType}</span>
						</div>
					</m.div>
				))}
			</div>
		</m.section>
	);
}

function ComplementaryTechSection({ technology }: { technology: Technology }) {
	return (
		<m.section
			className="mb-20"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ ...springTransition, delay: 0.35 }}
		>
			<h3 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
				<span className="mr-2">●</span>
				Complementary Technologies
			</h3>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{technology.complementaryTech.map((tech, index) => (
					<m.div
						key={index}
						className="bg-gunmetal-glass/10 border border-white/10 p-4"
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ ...springTransition, delay: 0.4 + index * 0.05 }}
					>
						<div className="flex items-center gap-3">
							<Layers className="text-slate-text h-4 w-4" strokeWidth={1.5} />
							<span className="text-slate-text text-sm">{tech}</span>
						</div>
					</m.div>
				))}
			</div>
		</m.section>
	);
}

function RealWorldExampleSection({ technology }: { technology: Technology }) {
	return (
		<m.section
			className="mb-20"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ ...springTransition, delay: 0.4 }}
		>
			<h3 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
				<span className="mr-2">●</span>
				Real-World Example
			</h3>

			<div className="bg-gunmetal-glass/20 relative border border-white/10 p-8 backdrop-blur-sm">
				<div className="border-cyber-lime absolute top-0 right-0 h-4 w-4 border-t border-r" />
				<div className="border-cyber-lime absolute bottom-0 left-0 h-4 w-4 border-b border-l" />

				<div className="mb-6 flex items-center gap-3">
					<Target className="text-cyber-lime h-5 w-5" strokeWidth={1.5} />
					<span className="text-mist-white font-mono text-sm">Case Study</span>
				</div>

				<p className="text-slate-text leading-relaxed">{technology.realWorldExample}</p>
			</div>
		</m.section>
	);
}

interface RelatedServicePage {
	slug: string;
	technology: string;
	industry: string;
	seo: {
		title: string;
		description: string;
	};
}

function RelatedServicesSection({ pages }: { pages: RelatedServicePage[] }) {
	return (
		<m.section
			className="mb-20"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ ...springTransition, delay: 0.45 }}
		>
			<h3 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
				<span className="mr-2">●</span>
				Related Services
			</h3>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{pages.map((page, index) => (
					<m.div
						key={page.slug}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ ...springTransition, delay: 0.5 + index * 0.05 }}
					>
						<Link
							href={`/services/${page.slug}`}
							className="bg-gunmetal-glass/10 group flex h-full flex-col border border-white/10 p-6 transition-colors hover:border-white/20"
						>
							<h4 className="text-mist-white group-hover:text-cyber-lime mb-2 font-mono text-sm transition-colors">
								{page.seo.title.replace(" | Technical Advisor", "")}
							</h4>
							<p className="text-slate-text mb-4 flex-grow text-xs leading-relaxed">
								{page.seo.description.slice(0, 120)}...
							</p>
							<div className="text-cyber-lime flex items-center gap-2 font-mono text-xs opacity-0 transition-opacity group-hover:opacity-100">
								VIEW_SERVICE()
								<ArrowRight className="h-3 w-3" />
							</div>
						</Link>
					</m.div>
				))}
			</div>
		</m.section>
	);
}

function CtaSection({ technology }: { technology: Technology }) {
	return (
		<m.section
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ ...springTransition, delay: 0.5 }}
		>
			<div className="bg-gunmetal-glass/20 relative border border-white/10 p-8 text-center backdrop-blur-sm md:p-12">
				<div className="border-cyber-lime absolute top-0 right-0 h-6 w-6 border-t border-r" />
				<div className="border-cyber-lime absolute bottom-0 left-0 h-6 w-6 border-b border-l" />

				<h3 className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
					<span className="mr-2">●</span>
					Ready to Build?
				</h3>

				<h4 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
					Let&apos;s discuss your
					<br />
					<span className="text-cyber-lime">{technology.displayName}</span> project.
				</h4>

				<p className="text-slate-text mx-auto mb-8 max-w-2xl">
					Whether you&apos;re starting fresh, migrating an existing system, or need architectural
					guidance, I can help you build with {technology.displayName} the right way.
				</p>

				<Link
					href="/contact"
					onClick={() =>
						trackCTAClick("start_conversation", { cta_location: "technology_bottom_cta" })
					}
					className="group hover:border-cyber-lime relative inline-flex items-center gap-3 border border-white/20 px-8 py-4 transition-colors duration-300"
				>
					<span className="group-hover:text-cyber-lime font-mono text-sm tracking-tight transition-colors">
						START_CONVERSATION()
					</span>
					<ArrowRight
						className="text-slate-text group-hover:text-cyber-lime h-4 w-4 transition-colors duration-300"
						strokeWidth={1.5}
					/>
					<m.div
						className="bg-cyber-lime/5 absolute inset-0"
						initial={{ opacity: 0 }}
						whileHover={{ opacity: 1 }}
						transition={{ duration: 0.3 }}
					/>
				</Link>
			</div>
		</m.section>
	);
}
