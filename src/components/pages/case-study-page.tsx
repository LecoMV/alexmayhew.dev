"use client";

import { useState } from "react";
import { m } from "framer-motion";
import Link from "next/link";
import {
	ExternalLink,
	Github,
	ArrowRight,
	ChevronDown,
	Clock,
	Building2,
	Briefcase,
	CheckCircle2,
	Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/data/projects";
import { NewsletterSignup } from "@/components/newsletter/newsletter-signup";

const springTransition = {
	type: "spring" as const,
	stiffness: 100,
	damping: 20,
	mass: 1,
};

interface CaseStudyPageProps {
	project: Project;
	relatedProjects: Project[];
}

export function CaseStudyPage({ project, relatedProjects }: CaseStudyPageProps) {
	const [expandedChallenge, setExpandedChallenge] = useState<number | null>(null);
	const cs = project.caseStudy!;

	return (
		<main className="min-h-dvh px-6 pt-44 pb-24 sm:px-12 md:px-24">
			<div className="mx-auto max-w-[1400px]">
				{/* Breadcrumbs */}
				<m.nav
					className="text-slate-text mb-8 font-mono text-xs"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ ...springTransition, delay: 0 }}
				>
					<Link href="/" className="hover:text-cyber-lime transition-colors duration-300">
						Home
					</Link>
					<span className="mx-2">/</span>
					<Link href="/work" className="hover:text-cyber-lime transition-colors duration-300">
						Work
					</Link>
					<span className="mx-2">/</span>
					<span className="text-mist-white">{project.title}</span>
				</m.nav>

				{/* Hero */}
				<m.div
					className="mb-16"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={springTransition}
				>
					<span className="text-cyber-lime mb-4 inline-block border border-white/10 px-3 py-1 font-mono text-xs tracking-wider uppercase">
						{project.category}
					</span>
					<h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
						{project.title}
					</h1>
					<p className="text-slate-text mb-8 max-w-3xl text-lg">{cs.subtitle}</p>
					<div className="flex flex-wrap gap-4">
						{project.link && (
							<a
								href={project.link}
								target={project.link.startsWith("http") ? "_blank" : undefined}
								rel={project.link.startsWith("http") ? "noopener noreferrer" : undefined}
								className="group hover:border-cyber-lime relative border border-white/20 px-6 py-3 transition-colors duration-300"
							>
								<span className="group-hover:text-cyber-lime flex items-center gap-2 font-mono text-sm tracking-tight transition-colors">
									<ExternalLink className="h-4 w-4" strokeWidth={1.5} />
									VIEW_LIVE()
								</span>
							</a>
						)}
						{project.github && (
							<a
								href={project.github}
								target="_blank"
								rel="noopener noreferrer"
								className="group hover:border-cyber-lime relative border border-white/20 px-6 py-3 transition-colors duration-300"
							>
								<span className="group-hover:text-cyber-lime flex items-center gap-2 font-mono text-sm tracking-tight transition-colors">
									<Github className="h-4 w-4" strokeWidth={1.5} />
									SOURCE_CODE()
								</span>
							</a>
						)}
					</div>
				</m.div>

				{/* Metrics Bar */}
				<m.section
					className="mb-20 border-y border-white/10 py-8"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ ...springTransition, delay: 0.1 }}
				>
					<div className="grid grid-cols-2 gap-6 md:grid-cols-4">
						{cs.metrics.map((metric, index) => (
							<m.div
								key={metric.label}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ ...springTransition, delay: index * 0.05 }}
							>
								<div className="text-cyber-lime text-3xl font-bold">{metric.value}</div>
								<div className="mt-1 font-mono text-sm tracking-tight">{metric.label}</div>
								<div className="text-slate-text mt-1 text-xs">{metric.context}</div>
							</m.div>
						))}
					</div>
				</m.section>

				{/* Context Sidebar + Challenge */}
				<div className="mb-20 grid grid-cols-1 gap-12 lg:grid-cols-3">
					{/* Challenge - Main Column */}
					<m.section
						className="lg:col-span-2"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={springTransition}
					>
						<h2 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
							<span className="mr-2 animate-pulse">●</span>
							The Challenge
						</h2>
						<p className="text-slate-text text-base leading-relaxed">{cs.challenge}</p>
					</m.section>

					{/* Context Sidebar */}
					<m.aside
						className="lg:sticky lg:top-32 lg:self-start"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={{ ...springTransition, delay: 0.1 }}
					>
						<div className="bg-gunmetal-glass/10 border border-white/10 p-6">
							<h3 className="mb-6 font-mono text-xs tracking-wider uppercase">Project Details</h3>
							<div className="space-y-4">
								<div className="flex items-center gap-3">
									<Clock className="text-cyber-lime h-4 w-4 shrink-0" strokeWidth={1.5} />
									<div>
										<div className="text-slate-text font-mono text-[10px] tracking-wider uppercase">
											Duration
										</div>
										<div className="text-sm">{cs.context.duration}</div>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<Building2 className="text-cyber-lime h-4 w-4 shrink-0" strokeWidth={1.5} />
									<div>
										<div className="text-slate-text font-mono text-[10px] tracking-wider uppercase">
											Industry
										</div>
										<div className="text-sm">{cs.context.industry}</div>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<Briefcase className="text-cyber-lime h-4 w-4 shrink-0" strokeWidth={1.5} />
									<div>
										<div className="text-slate-text font-mono text-[10px] tracking-wider uppercase">
											Type
										</div>
										<div className="text-sm">{cs.context.type}</div>
									</div>
								</div>
							</div>

							{/* Tech Stack */}
							<div className="mt-6 border-t border-white/10 pt-6">
								<div className="text-slate-text mb-3 font-mono text-[10px] tracking-wider uppercase">
									Tech Stack
								</div>
								<div className="flex flex-wrap gap-2">
									{project.tech.map((tech) => (
										<span
											key={tech}
											className="bg-white/5 px-2 py-1 font-mono text-xs text-white/60"
										>
											{tech}
										</span>
									))}
								</div>
							</div>

							{/* CTA */}
							<div className="mt-6 border-t border-white/10 pt-6">
								<Link
									href="/contact"
									className="group hover:border-cyber-lime block border border-white/20 px-4 py-3 text-center transition-colors duration-300"
								>
									<span className="group-hover:text-cyber-lime font-mono text-xs tracking-tight transition-colors">
										DISCUSS_PROJECT()
									</span>
								</Link>
							</div>
						</div>
					</m.aside>
				</div>

				{/* The Approach */}
				<m.section
					className="mb-20"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={springTransition}
				>
					<h2 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
						<span className="mr-2 animate-pulse">●</span>
						The Approach
					</h2>
					<div className="max-w-3xl">
						<p className="text-slate-text text-base leading-relaxed">{cs.approach}</p>
					</div>
				</m.section>

				{/* Tech Decisions */}
				<m.section
					className="mb-20"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={springTransition}
				>
					<h2 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
						<span className="mr-2 animate-pulse">●</span>
						Tech Decisions
					</h2>
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{cs.techDecisions.map((decision, index) => (
							<m.div
								key={decision.component}
								className="group bg-gunmetal-glass/10 hover:border-cyber-lime/50 relative border border-white/10 p-6 transition-colors duration-300"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ ...springTransition, delay: index * 0.05 }}
							>
								<div className="border-cyber-lime absolute top-0 right-0 h-4 w-4 border-t border-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
								<div className="border-cyber-lime absolute bottom-0 left-0 h-4 w-4 border-b border-l opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
								<div className="text-slate-text mb-1 font-mono text-[10px] tracking-wider uppercase">
									{decision.component}
								</div>
								<div className="text-cyber-lime mb-3 font-mono text-sm">{decision.technology}</div>
								<p className="text-slate-text text-sm leading-relaxed">{decision.rationale}</p>
							</m.div>
						))}
					</div>
				</m.section>

				{/* Technical Challenges */}
				<m.section
					className="mb-20"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={springTransition}
				>
					<h2 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
						<span className="mr-2 animate-pulse">●</span>
						Technical Challenges
					</h2>
					<div className="space-y-4">
						{cs.challenges.map((challenge, index) => (
							<m.div
								key={challenge.title}
								className="bg-gunmetal-glass/10 border border-white/10"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ ...springTransition, delay: index * 0.05 }}
							>
								<button
									onClick={() => setExpandedChallenge(expandedChallenge === index ? null : index)}
									className="flex w-full items-center justify-between p-6 text-left"
								>
									<span className="font-mono text-sm tracking-tight">{challenge.title}</span>
									<ChevronDown
										className={cn(
											"text-slate-text h-5 w-5 shrink-0 transition-transform duration-200",
											expandedChallenge === index && "rotate-180"
										)}
										strokeWidth={1.5}
									/>
								</button>
								{expandedChallenge === index && (
									<div className="border-t border-white/10 p-6">
										<div className="grid gap-6 md:grid-cols-2">
											<div>
												<div className="text-burnt-ember mb-2 font-mono text-[10px] tracking-wider uppercase">
													Problem
												</div>
												<p className="text-slate-text text-sm leading-relaxed">
													{challenge.problem}
												</p>
											</div>
											<div>
												<div className="text-cyber-lime mb-2 font-mono text-[10px] tracking-wider uppercase">
													Solution
												</div>
												<p className="text-slate-text text-sm leading-relaxed">
													{challenge.solution}
												</p>
											</div>
										</div>
									</div>
								)}
							</m.div>
						))}
					</div>
				</m.section>

				{/* The Solution */}
				<m.section
					className="mb-20"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={springTransition}
				>
					<h2 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
						<span className="mr-2 animate-pulse">●</span>
						The Solution
					</h2>
					<div className="max-w-3xl">
						<p className="text-slate-text text-base leading-relaxed">{cs.solution}</p>
					</div>
				</m.section>

				{/* Key Takeaways */}
				<m.section
					className="mb-20"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={springTransition}
				>
					<h2 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
						<span className="mr-2 animate-pulse">●</span>
						Key Takeaways
					</h2>
					<div className="bg-gunmetal-glass/10 border border-white/10 p-8">
						<div className="mb-6 flex items-center gap-2">
							<Lightbulb className="text-cyber-lime h-5 w-5" strokeWidth={1.5} />
							<span className="font-mono text-sm tracking-tight">Reusable Insights</span>
						</div>
						<ul className="space-y-4">
							{cs.takeaways.map((takeaway, index) => (
								<li key={index} className="flex gap-3">
									<CheckCircle2
										className="text-cyber-lime mt-0.5 h-4 w-4 shrink-0"
										strokeWidth={1.5}
									/>
									<span className="text-slate-text text-sm leading-relaxed">{takeaway}</span>
								</li>
							))}
						</ul>
					</div>
				</m.section>

				{/* Related Projects */}
				{relatedProjects.length > 0 && (
					<m.section
						className="mb-20"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={springTransition}
					>
						<h2 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
							<span className="mr-2 animate-pulse">●</span>
							Related Projects
						</h2>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							{relatedProjects.map((related, index) => (
								<m.div
									key={related.id}
									className="group bg-gunmetal-glass/10 hover:border-cyber-lime/50 relative border border-white/10 p-6 transition-colors duration-300"
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ ...springTransition, delay: index * 0.05 }}
								>
									<div className="border-cyber-lime absolute top-0 right-0 h-4 w-4 border-t border-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
									<div className="border-cyber-lime absolute bottom-0 left-0 h-4 w-4 border-b border-l opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
									<span className="text-slate-text mb-2 block font-mono text-xs">
										{related.year} / {related.category}
									</span>
									<h3 className="mb-2 font-mono text-xl tracking-tight">{related.title}</h3>
									<p className="text-slate-text mb-4 line-clamp-3 text-sm leading-relaxed">
										{related.description}
									</p>
									<div className="mb-4 flex flex-wrap gap-2">
										{related.tech.slice(0, 5).map((tech) => (
											<span
												key={tech}
												className="bg-white/5 px-2 py-1 font-mono text-xs text-white/60"
											>
												{tech}
											</span>
										))}
									</div>
									{related.caseStudy?.published && (
										<Link
											href={`/work/${related.id}`}
											className="text-slate-text hover:text-cyber-lime group/link inline-flex items-center gap-2 font-mono text-xs transition-colors duration-300"
										>
											Case Study
											<ArrowRight
												className="h-3 w-3 transition-transform duration-300 group-hover/link:translate-x-1"
												strokeWidth={1.5}
											/>
										</Link>
									)}
								</m.div>
							))}
						</div>
					</m.section>
				)}

				{/* CTA Section */}
				<m.section
					className="border-t border-white/10 pt-16"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={springTransition}
				>
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="mb-4 text-3xl font-bold tracking-tight">Have a similar challenge?</h2>
						<p className="text-slate-text mb-8">
							I help teams solve complex technical problems. Let&apos;s discuss your project.
						</p>
						<div className="flex flex-col items-center gap-6">
							<Link
								href="/contact"
								className="group hover:border-cyber-lime relative border border-white/20 px-8 py-4 transition-colors duration-300"
							>
								<span className="group-hover:text-cyber-lime font-mono text-sm tracking-tight transition-colors">
									START_CONVERSATION()
								</span>
							</Link>
							<div className="w-full max-w-md">
								<NewsletterSignup variant="minimal" />
							</div>
						</div>
					</div>
				</m.section>
			</div>
		</main>
	);
}
