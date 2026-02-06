"use client";

import { m } from "framer-motion";
import Link from "next/link";
import {
	ArrowRight,
	Target,
	Wrench,
	CheckCircle,
	HelpCircle,
	ChevronDown,
	ExternalLink,
	Users,
	Clock,
	Zap,
} from "lucide-react";
import { useState } from "react";
import type { RolePage } from "@/data/roles";
import { ROLE_LABELS, SERVICE_TIER_LABELS, SERVICE_TIER_DESCRIPTIONS } from "@/data/roles";
import { cn } from "@/lib/utils";
import { trackCTAClick } from "@/components/analytics";

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
			staggerChildren: 0.08,
			delayChildren: 0.1,
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

interface RolePageContentProps {
	page: RolePage;
}

export function RolePageContent({ page }: RolePageContentProps) {
	const roleLabel = ROLE_LABELS[page.role];

	return (
		<main className="min-h-dvh px-6 pt-44 pb-24 sm:px-12 md:px-24">
			<div className="mx-auto max-w-[1400px]">
				{/* Breadcrumbs */}
				<Breadcrumbs roleLabel={roleLabel} />

				{/* Hero Section */}
				<HeroSection page={page} roleLabel={roleLabel} />

				{/* Proof Metrics */}
				<ProofMetricsSection metrics={page.proofMetrics} />

				{/* Pain Points */}
				<PainPointsSection painPoints={page.painPoints} />

				{/* Positioning */}
				<PositioningSection content={page.positioning} />

				{/* Ideal Tiers */}
				<ServiceTiersSection tiers={page.idealTiers} roleLabel={roleLabel} />

				{/* Timeline Expectations */}
				<TimelineSection content={page.timelineExpectations} />

				{/* Related Services */}
				{page.relatedServices.length > 0 && (
					<RelatedServicesSection services={page.relatedServices} />
				)}

				{/* FAQs */}
				<FaqSection faqs={page.faqs} />

				{/* CTA Section */}
				<CtaSection />
			</div>
		</main>
	);
}

// =============================================================================
// Sub-Components
// =============================================================================

function Breadcrumbs({ roleLabel }: { roleLabel: string }) {
	return (
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
					For {roleLabel}
				</li>
			</ol>
		</m.nav>
	);
}

function HeroSection({ page, roleLabel }: { page: RolePage; roleLabel: string }) {
	return (
		<m.section className="mb-20" variants={staggerContainer} initial="hidden" animate="visible">
			<m.div variants={fadeInUp}>
				<h1 className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
					<span className="mr-2 animate-pulse">●</span>
					For {roleLabel}
				</h1>
			</m.div>

			<m.h2
				className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
				variants={fadeInUp}
			>
				{page.headline}
			</m.h2>

			<m.div className="my-6 h-px w-full max-w-xl bg-white/10" variants={fadeInUp} />

			<m.p className="text-slate-text mb-8 max-w-3xl text-lg leading-relaxed" variants={fadeInUp}>
				{page.subheadline}
			</m.p>

			<m.div className="flex flex-wrap items-center gap-4" variants={fadeInUp}>
				<Link
					href="/contact"
					onClick={() => trackCTAClick("start_conversation", { cta_location: "role_hero" })}
					className="group hover:border-cyber-lime relative border border-white/20 px-6 py-3 transition-colors duration-300"
				>
					<span className="group-hover:text-cyber-lime font-mono text-sm tracking-tight transition-colors">
						START_CONVERSATION()
					</span>
					<m.div
						className="bg-cyber-lime/5 absolute inset-0"
						initial={{ opacity: 0 }}
						whileHover={{ opacity: 1 }}
						transition={{ duration: 0.3 }}
					/>
				</Link>
				<Link
					href="/work"
					className="text-slate-text hover:text-cyber-lime group flex items-center gap-2 font-mono text-sm transition-colors duration-300"
				>
					View Case Studies
					<ArrowRight
						className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
						strokeWidth={1.5}
					/>
				</Link>
			</m.div>
		</m.section>
	);
}

function ProofMetricsSection({ metrics }: { metrics: string[] }) {
	return (
		<m.section
			className="mb-20"
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-100px" }}
			transition={springTransition}
		>
			<h2 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
				<span className="mr-2 animate-pulse">●</span>
				Track Record
			</h2>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{metrics.map((metric, index) => (
					<m.div
						key={index}
						className="group bg-gunmetal-glass/10 hover:border-cyber-lime/50 relative border border-white/10 p-5 backdrop-blur-sm transition-colors duration-300"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ ...springTransition, delay: index * 0.05 }}
					>
						<div className="border-cyber-lime absolute top-0 right-0 h-3 w-3 border-t border-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
						<div className="border-cyber-lime absolute bottom-0 left-0 h-3 w-3 border-b border-l opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

						<div className="flex items-start gap-3">
							<CheckCircle className="text-cyber-lime mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.5} />
							<p className="text-mist-white text-sm leading-relaxed">{metric}</p>
						</div>
					</m.div>
				))}
			</div>
		</m.section>
	);
}

function PainPointsSection({ painPoints }: { painPoints: RolePage["painPoints"] }) {
	const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

	return (
		<m.section
			className="mb-20"
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-100px" }}
			transition={springTransition}
		>
			<h2 className="text-cyber-lime mb-2 font-mono text-xs tracking-wider uppercase">
				<span className="mr-2 animate-pulse">●</span>
				Challenges I Solve
			</h2>
			<p className="text-slate-text mb-8 text-sm">
				Common problems I help leaders in your position navigate
			</p>

			<div className="space-y-4">
				{painPoints.map((point, index) => (
					<m.div
						key={point.title}
						className="bg-gunmetal-glass/10 border border-white/10"
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ ...springTransition, delay: index * 0.1 }}
					>
						<button
							onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
							className="flex w-full items-center justify-between p-5 text-left"
							aria-expanded={expandedIndex === index}
						>
							<div className="flex items-start gap-4">
								<Target className="text-cyber-lime mt-1 h-5 w-5 shrink-0" strokeWidth={1.5} />
								<div className="pr-4">
									<h3 className="mb-1 font-mono text-base tracking-tight">{point.title}</h3>
									<p className="text-slate-text text-sm">{point.description}</p>
								</div>
							</div>
							<ChevronDown
								className={cn(
									"text-slate-text h-5 w-5 shrink-0 transition-transform duration-200",
									expandedIndex === index && "rotate-180"
								)}
								strokeWidth={1.5}
							/>
						</button>

						{expandedIndex === index && (
							<m.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								className="border-t border-white/10 p-5"
							>
								<div className="grid gap-6 md:grid-cols-2">
									{/* Why it matters */}
									<div>
										<div className="mb-3 flex items-center gap-2">
											<Zap className="text-burnt-ember h-4 w-4" strokeWidth={1.5} />
											<span className="text-burnt-ember font-mono text-xs uppercase">
												Why It Matters
											</span>
										</div>
										<p className="text-slate-text text-sm leading-relaxed">{point.whyMatters}</p>
									</div>

									{/* Solution */}
									<div>
										<div className="mb-3 flex items-center gap-2">
											<Wrench className="text-cyber-lime h-4 w-4" strokeWidth={1.5} />
											<span className="text-cyber-lime font-mono text-xs uppercase">
												My Approach
											</span>
										</div>
										<p className="text-mist-white text-sm leading-relaxed">{point.solution}</p>
									</div>
								</div>
							</m.div>
						)}
					</m.div>
				))}
			</div>
		</m.section>
	);
}

function PositioningSection({ content }: { content: string }) {
	return (
		<m.section
			className="mb-20"
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-100px" }}
			transition={springTransition}
		>
			<h2 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
				<span className="mr-2 animate-pulse">●</span>
				How I Work With You
			</h2>

			<div className="bg-gunmetal-glass/20 relative border border-white/10 p-8 backdrop-blur-sm md:p-10">
				<div className="border-cyber-lime absolute top-0 right-0 h-5 w-5 border-t border-r" />
				<div className="border-cyber-lime absolute bottom-0 left-0 h-5 w-5 border-b border-l" />

				<div className="prose-invert prose-sm max-w-none">
					{content.split("\n\n").map((paragraph, i) => (
						<p key={i} className="text-slate-text mb-4 leading-relaxed last:mb-0">
							{paragraph}
						</p>
					))}
				</div>
			</div>
		</m.section>
	);
}

function ServiceTiersSection({
	tiers,
	roleLabel,
}: {
	tiers: RolePage["idealTiers"];
	roleLabel: string;
}) {
	return (
		<m.section
			className="mb-20"
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-100px" }}
			transition={springTransition}
		>
			<h2 className="text-cyber-lime mb-2 font-mono text-xs tracking-wider uppercase">
				<span className="mr-2 animate-pulse">●</span>
				Recommended Engagements
			</h2>
			<p className="text-slate-text mb-8 text-sm">Service tiers most relevant for {roleLabel}s</p>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{tiers.map((tier, index) => (
					<m.div
						key={tier}
						className="group bg-gunmetal-glass/10 hover:border-cyber-lime/50 relative border border-white/10 p-6 transition-colors duration-300"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ ...springTransition, delay: index * 0.05 }}
					>
						<div className="border-cyber-lime absolute top-0 right-0 h-3 w-3 border-t border-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
						<div className="border-cyber-lime absolute bottom-0 left-0 h-3 w-3 border-b border-l opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

						<div className="mb-4 flex items-center gap-3">
							<Users className="text-cyber-lime h-5 w-5" strokeWidth={1.5} />
							<h3 className="text-cyber-lime font-mono text-sm tracking-tight">
								{SERVICE_TIER_LABELS[tier]}
							</h3>
						</div>
						<p className="text-slate-text text-sm leading-relaxed">
							{SERVICE_TIER_DESCRIPTIONS[tier]}
						</p>
					</m.div>
				))}
			</div>
		</m.section>
	);
}

function TimelineSection({ content }: { content: string }) {
	return (
		<m.section
			className="mb-20"
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-100px" }}
			transition={springTransition}
		>
			<h2 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
				<span className="mr-2 animate-pulse">●</span>
				What to Expect
			</h2>

			<div className="bg-gunmetal-glass/10 relative border border-white/10 p-6 md:p-8">
				<div className="border-cyber-lime absolute top-0 right-0 h-4 w-4 border-t border-r" />
				<div className="border-cyber-lime absolute bottom-0 left-0 h-4 w-4 border-b border-l" />

				<div className="flex items-start gap-4">
					<Clock className="text-cyber-lime mt-1 h-5 w-5 shrink-0" strokeWidth={1.5} />
					<div className="prose-invert prose-sm max-w-none">
						{content.split("\n\n").map((paragraph, i) => (
							<p key={i} className="text-slate-text mb-3 leading-relaxed last:mb-0">
								{paragraph}
							</p>
						))}
					</div>
				</div>
			</div>
		</m.section>
	);
}

function RelatedServicesSection({ services }: { services: string[] }) {
	return (
		<m.section
			className="mb-20"
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-100px" }}
			transition={springTransition}
		>
			<h2 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
				<span className="mr-2 animate-pulse">●</span>
				Related Services
			</h2>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{services.map((serviceSlug, index) => (
					<m.div
						key={serviceSlug}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ ...springTransition, delay: index * 0.1 }}
					>
						<Link
							href={`/services/${serviceSlug}`}
							className="group bg-gunmetal-glass/10 hover:border-cyber-lime/50 relative flex items-center justify-between border border-white/10 p-5 transition-colors duration-300"
						>
							<div className="border-cyber-lime absolute top-0 right-0 h-3 w-3 border-t border-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
							<div className="border-cyber-lime absolute bottom-0 left-0 h-3 w-3 border-b border-l opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

							<span className="group-hover:text-cyber-lime font-mono text-sm tracking-tight transition-colors">
								{formatServiceSlug(serviceSlug)}
							</span>
							<ExternalLink
								className="text-slate-text group-hover:text-cyber-lime ml-4 h-4 w-4 shrink-0 transition-colors"
								strokeWidth={1.5}
							/>
						</Link>
					</m.div>
				))}
			</div>
		</m.section>
	);
}

function FaqSection({ faqs }: { faqs: RolePage["faqs"] }) {
	const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

	return (
		<m.section
			className="mb-20"
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-100px" }}
			transition={springTransition}
		>
			<h2 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
				<span className="mr-2 animate-pulse">●</span>
				Frequently Asked Questions
			</h2>

			<div className="space-y-3">
				{faqs.map((faq, index) => (
					<m.div
						key={index}
						className="bg-gunmetal-glass/10 border border-white/10"
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ ...springTransition, delay: index * 0.05 }}
					>
						<button
							onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
							className="flex w-full items-center justify-between p-5 text-left"
							aria-expanded={expandedIndex === index}
						>
							<div className="flex items-start gap-3">
								<HelpCircle className="text-cyber-lime mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.5} />
								<h3 className="text-mist-white pr-4 text-sm font-medium">{faq.question}</h3>
							</div>
							<ChevronDown
								className={cn(
									"text-slate-text h-5 w-5 shrink-0 transition-transform duration-200",
									expandedIndex === index && "rotate-180"
								)}
								strokeWidth={1.5}
							/>
						</button>

						{expandedIndex === index && (
							<m.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								className="border-t border-white/10 px-5 pt-4 pb-5 pl-13"
							>
								<p className="text-slate-text text-sm leading-relaxed">{faq.answer}</p>
							</m.div>
						)}
					</m.div>
				))}
			</div>
		</m.section>
	);
}

function CtaSection() {
	return (
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
							Let&apos;s discuss your challenges
						</h2>
						<p className="text-slate-text max-w-xl">
							Schedule a conversation to explore how I can support your technical leadership. No
							pitch, just a genuine discussion about what you&apos;re facing.
						</p>
					</div>

					<Link
						href="/contact"
						onClick={() => trackCTAClick("schedule_call", { cta_location: "role_bottom_cta" })}
						className="group hover:border-cyber-lime relative flex shrink-0 items-center gap-3 border border-white/20 px-6 py-4 transition-colors duration-300"
					>
						<span className="group-hover:text-cyber-lime font-mono text-sm tracking-tight transition-colors">
							SCHEDULE_CALL()
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
	);
}

// =============================================================================
// Utilities
// =============================================================================

/**
 * Format a service slug for display
 */
function formatServiceSlug(slug: string): string {
	return slug
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}
