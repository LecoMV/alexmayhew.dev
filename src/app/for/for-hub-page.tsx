"use client";

import { m } from "framer-motion";
import { ArrowRight, Briefcase, Building2, Rocket, Users } from "lucide-react";
import Link from "next/link";

import { trackCTAClick } from "@/components/analytics";
import { ROLE_LABELS } from "@/data/roles";

import type { Role, RolePage } from "@/data/roles";

const springTransition = {
	type: "spring" as const,
	stiffness: 100,
	damping: 20,
	mass: 1,
};

const staggerContainer = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.15,
		},
	},
};

const fadeInUp = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: springTransition,
	},
};

interface ForHubPageProps {
	pages: RolePage[];
}

// Map roles to icons
const roleIcons: Record<Role, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
	cto: Building2,
	"technical-founder": Rocket,
	"seed-founder": Briefcase,
	"vp-engineering": Users,
};

export function ForHubPage({ pages }: ForHubPageProps) {
	return (
		<main className="min-h-dvh px-6 pt-44 pb-24 sm:px-12 md:px-24">
			<div className="mx-auto max-w-[1400px]">
				{/* Breadcrumbs */}
				<m.nav
					className="mb-8"
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={springTransition}
					aria-label="Breadcrumb"
				>
					<ol className="text-slate-text flex items-center gap-2 font-mono text-xs">
						<li>
							<Link href="/" className="hover:text-cyber-lime transition-colors">
								Home
							</Link>
						</li>
						<li aria-hidden="true">/</li>
						<li className="text-mist-white" aria-current="page">
							For Leaders
						</li>
					</ol>
				</m.nav>

				{/* Hero Section */}
				<m.section className="mb-20" variants={staggerContainer} initial="hidden" animate="visible">
					<m.div variants={fadeInUp}>
						<h1 className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
							<span className="mr-2 animate-pulse">●</span>
							Technical Advisory
						</h1>
					</m.div>

					<m.h2
						className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
						variants={fadeInUp}
					>
						Built for Your Role
					</m.h2>

					<m.div className="my-6 h-px w-full max-w-xl bg-white/10" variants={fadeInUp} />

					<m.p
						className="text-slate-text mb-8 max-w-3xl text-lg leading-relaxed"
						variants={fadeInUp}
					>
						Different roles face different challenges. A CTO navigating technical debt needs
						different guidance than a seed-stage founder making first architecture decisions. Find
						the advisory relationship designed for your specific situation.
					</m.p>
				</m.section>

				{/* Role Cards */}
				<m.section
					className="mb-20"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={springTransition}
				>
					<div className="grid gap-6 md:grid-cols-2">
						{pages.map((page, index) => {
							const Icon = roleIcons[page.role];
							const roleLabel = ROLE_LABELS[page.role];

							return (
								<m.div
									key={page.slug}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ ...springTransition, delay: index * 0.1 }}
								>
									<Link
										href={`/for/${page.slug}`}
										className="group bg-gunmetal-glass/10 hover:border-cyber-lime/50 relative flex flex-col border border-white/10 p-8 backdrop-blur-sm transition-colors duration-300"
									>
										{/* Corner accents */}
										<div className="border-cyber-lime absolute top-0 right-0 h-4 w-4 border-t border-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
										<div className="border-cyber-lime absolute bottom-0 left-0 h-4 w-4 border-b border-l opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

										{/* Icon and label */}
										<div className="mb-4 flex items-center gap-3">
											<Icon className="text-cyber-lime h-6 w-6" strokeWidth={1.5} />
											<span className="text-cyber-lime font-mono text-xs tracking-wider uppercase">
												For {roleLabel}
											</span>
										</div>

										{/* Headline */}
										<h3 className="group-hover:text-cyber-lime mb-3 text-xl font-bold tracking-tight transition-colors md:text-2xl">
											{page.headline}
										</h3>

										{/* Subheadline */}
										<p className="text-slate-text mb-6 line-clamp-3 flex-grow text-sm leading-relaxed">
											{page.subheadline}
										</p>

										{/* Sample pain points */}
										<div className="mb-6 space-y-2">
											{page.painPoints.slice(0, 3).map((point, i) => (
												<div key={i} className="text-slate-text flex items-start gap-2 text-xs">
													<span className="text-cyber-lime mt-1.5 h-1.5 w-1.5 shrink-0 bg-current" />
													<span className="line-clamp-1">{point.title}</span>
												</div>
											))}
										</div>

										{/* CTA */}
										<div className="flex items-center gap-2">
											<span className="group-hover:text-cyber-lime font-mono text-sm tracking-tight transition-colors">
												Learn More
											</span>
											<ArrowRight
												className="text-slate-text group-hover:text-cyber-lime h-4 w-4 transition-all duration-300 group-hover:translate-x-1"
												strokeWidth={1.5}
											/>
										</div>
									</Link>
								</m.div>
							);
						})}
					</div>
				</m.section>

				{/* CTA Section */}
				<m.section
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={springTransition}
				>
					<div className="bg-gunmetal-glass/20 relative border border-white/10 p-8 backdrop-blur-sm md:p-12">
						<div className="border-cyber-lime absolute top-0 right-0 h-6 w-6 border-t border-r" />
						<div className="border-cyber-lime absolute bottom-0 left-0 h-6 w-6 border-b border-l" />

						<div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
							<div>
								<h2 className="mb-2 font-mono text-2xl tracking-tight md:text-3xl">
									Not sure which fits?
								</h2>
								<p className="text-slate-text max-w-xl">
									Let&apos;s have a conversation. We&apos;ll figure out the right engagement model
									based on your actual challenges, not role titles.
								</p>
							</div>

							<Link
								href="/contact"
								onClick={() => trackCTAClick("start_conversation", { cta_location: "for_hub_cta" })}
								className="group hover:border-cyber-lime relative flex shrink-0 items-center gap-3 border border-white/20 px-6 py-4 transition-colors duration-300"
							>
								<span className="group-hover:text-cyber-lime font-mono text-sm tracking-tight transition-colors">
									START_CONVERSATION()
								</span>
								<ArrowRight
									className="text-slate-text group-hover:text-cyber-lime h-4 w-4 transition-all duration-300 group-hover:translate-x-1"
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
					</div>
				</m.section>
			</div>
		</main>
	);
}
