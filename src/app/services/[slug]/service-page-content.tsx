"use client";

import { m } from "framer-motion";
import Link from "next/link";
import {
	ArrowRight,
	Lightbulb,
	Shield,
	Wrench,
	Code2,
	DollarSign,
	HelpCircle,
	ChevronDown,
	ExternalLink,
	AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import type { PseoPage, ExpertApproach } from "@/data/pseo";
import { TECHNOLOGY_LABELS, INDUSTRY_LABELS } from "@/data/pseo";
import { TopicClusterNav } from "@/components/seo";
import { cn } from "@/lib/utils";

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

interface ServicePageContentProps {
	page: PseoPage;
	relatedPages: PseoPage[];
}

export function ServicePageContent({ page, relatedPages }: ServicePageContentProps) {
	const techLabel = TECHNOLOGY_LABELS[page.technology];
	const industryLabel = INDUSTRY_LABELS[page.industry];

	return (
		<main className="min-h-screen px-6 pt-44 pb-24 sm:px-12 md:px-24">
			<div className="mx-auto max-w-[1400px]">
				{/* Breadcrumbs */}
				<Breadcrumbs techLabel={techLabel} industryLabel={industryLabel} />

				{/* Hero Section */}
				<HeroSection page={page} techLabel={techLabel} industryLabel={industryLabel} />

				{/* Unique Insights */}
				<UniqueInsightsSection insights={page.uniqueInsights} />

				{/* Industry Regulations */}
				{page.industryRegulations.length > 0 && (
					<RegulationsSection
						regulations={page.industryRegulations}
						industryLabel={industryLabel}
					/>
				)}

				{/* Pain Points */}
				<PainPointsSection painPoints={page.commonPainPoints} />

				{/* Tech Stack Recommendations */}
				<TechStackSection
					recommendations={page.techStackRecommendations}
					techLabel={techLabel}
					industryLabel={industryLabel}
				/>

				{/* Why This Stack */}
				<WhyThisStackSection content={page.whyThisStack} techLabel={techLabel} />

				{/* Project Approach */}
				<ProjectApproachSection content={page.projectApproach} />

				{/* Expert Approach (if available) */}
				{page.expertApproach && <ExpertApproachSection expertApproach={page.expertApproach} />}

				{/* Budget Guidance */}
				<BudgetSection
					budget={page.budgetGuidance}
					techLabel={techLabel}
					industryLabel={industryLabel}
				/>

				{/* FAQs */}
				<FaqSection faqs={page.faqs} />

				{/* Related Services */}
				{relatedPages.length > 0 && <RelatedServicesSection relatedPages={relatedPages} />}

				{/* Topic Cluster Navigation */}
				<TopicClusterNav currentSlug={page.slug} basePath="/services" />

				{/* CTA Section */}
				<CtaSection />
			</div>
		</main>
	);
}

// =============================================================================
// Sub-Components
// =============================================================================

function Breadcrumbs({ techLabel, industryLabel }: { techLabel: string; industryLabel: string }) {
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
				<li>
					<Link href="/services" className="hover:text-cyber-lime transition-colors">
						Services
					</Link>
				</li>
				<li aria-hidden="true">/</li>
				<li className="text-mist-white" aria-current="page">
					{techLabel} for {industryLabel}
				</li>
			</ol>
		</m.nav>
	);
}

function HeroSection({
	page,
	techLabel,
	industryLabel,
}: {
	page: PseoPage;
	techLabel: string;
	industryLabel: string;
}) {
	return (
		<m.section className="mb-20" variants={staggerContainer} initial="hidden" animate="visible">
			<m.div variants={fadeInUp}>
				<h1 className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
					<span className="mr-2 animate-pulse">●</span>
					{techLabel} + {industryLabel}
				</h1>
			</m.div>

			<m.h2
				className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
				variants={fadeInUp}
			>
				{techLabel} Developer
				<br />
				<span className="text-slate-text">for {industryLabel}</span>
			</m.h2>

			<m.div className="my-6 h-px w-full max-w-xl bg-white/10" variants={fadeInUp} />

			<m.p className="text-slate-text mb-8 max-w-2xl text-lg leading-relaxed" variants={fadeInUp}>
				{page.seo.description}
			</m.p>

			<m.div className="flex flex-wrap items-center gap-4" variants={fadeInUp}>
				<Link
					href="/contact"
					className="group hover:border-cyber-lime relative border border-white/20 px-6 py-3 transition-colors duration-300"
				>
					<span className="group-hover:text-cyber-lime font-mono text-sm tracking-tight transition-colors">
						SCHEDULE_CONSULTATION()
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

function UniqueInsightsSection({ insights }: { insights: string[] }) {
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
				Key Insights
			</h2>

			<div className="grid gap-4 md:grid-cols-2 lg:gap-6">
				{insights.map((insight, index) => (
					<m.article
						key={index}
						className="group bg-gunmetal-glass/10 hover:border-cyber-lime/50 relative border border-white/10 p-6 backdrop-blur-sm transition-colors duration-300"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ ...springTransition, delay: index * 0.05 }}
					>
						<div className="border-cyber-lime absolute top-0 right-0 h-3 w-3 border-t border-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
						<div className="border-cyber-lime absolute bottom-0 left-0 h-3 w-3 border-b border-l opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

						<div className="mb-3 flex items-start gap-3">
							<Lightbulb className="text-cyber-lime mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.5} />
							<span className="text-slate-text font-mono text-xs opacity-50">
								{String(index + 1).padStart(2, "0")}
							</span>
						</div>
						<p className="text-mist-white text-sm leading-relaxed">{insight}</p>
					</m.article>
				))}
			</div>
		</m.section>
	);
}

function RegulationsSection({
	regulations,
	industryLabel,
}: {
	regulations: PseoPage["industryRegulations"];
	industryLabel: string;
}) {
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
				{industryLabel} Regulations
			</h2>
			<p className="text-slate-text mb-8 text-sm">
				Compliance requirements that shape technical architecture
			</p>

			<div className="space-y-4">
				{regulations.map((reg, index) => (
					<m.div
						key={reg.name}
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
							<div className="flex items-center gap-4">
								<Shield className="text-cyber-lime h-5 w-5" strokeWidth={1.5} />
								<div>
									<h3 className="font-mono text-base tracking-tight">{reg.name}</h3>
									<p className="text-slate-text text-xs">{reg.fullName}</p>
								</div>
							</div>
							<ChevronDown
								className={cn(
									"text-slate-text h-5 w-5 transition-transform duration-200",
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
								<p className="text-slate-text mb-4 text-sm leading-relaxed">
									{reg.technicalImplications}
								</p>
								<h4 className="text-cyber-lime mb-3 font-mono text-xs tracking-wider uppercase">
									Key Requirements
								</h4>
								<ul className="space-y-2">
									{reg.requirements.map((req, i) => (
										<li key={i} className="text-slate-text flex items-start gap-2 text-sm">
											<span className="text-cyber-lime mt-1.5 h-1.5 w-1.5 shrink-0 bg-current" />
											{req}
										</li>
									))}
								</ul>
							</m.div>
						)}
					</m.div>
				))}
			</div>
		</m.section>
	);
}

function PainPointsSection({ painPoints }: { painPoints: PseoPage["commonPainPoints"] }) {
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
				Common Challenges
			</h2>
			<p className="text-slate-text mb-8 text-sm">Problems I solve for clients in this space</p>

			<div className="space-y-6">
				{painPoints.map((point, index) => (
					<m.article
						key={point.title}
						className="group bg-gunmetal-glass/10 relative grid gap-6 border border-white/10 p-6 md:grid-cols-2"
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ ...springTransition, delay: index * 0.1 }}
					>
						<div className="border-cyber-lime absolute top-0 right-0 h-4 w-4 border-t border-r" />
						<div className="border-cyber-lime absolute bottom-0 left-0 h-4 w-4 border-b border-l" />

						{/* Problem */}
						<div>
							<div className="mb-3 flex items-center gap-2">
								<AlertTriangle className="text-burnt-ember h-4 w-4" strokeWidth={1.5} />
								<span className="text-burnt-ember font-mono text-xs uppercase">Challenge</span>
							</div>
							<h3 className="mb-2 font-mono text-lg tracking-tight">{point.title}</h3>
							<p className="text-slate-text text-sm leading-relaxed">{point.description}</p>
						</div>

						{/* Solution */}
						<div className="border-t border-white/10 pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-6">
							<div className="mb-3 flex items-center gap-2">
								<Wrench className="text-cyber-lime h-4 w-4" strokeWidth={1.5} />
								<span className="text-cyber-lime font-mono text-xs uppercase">Solution</span>
							</div>
							<p className="text-mist-white text-sm leading-relaxed">{point.solution}</p>
						</div>
					</m.article>
				))}
			</div>
		</m.section>
	);
}

function TechStackSection({
	recommendations,
	techLabel,
	industryLabel,
}: {
	recommendations: PseoPage["techStackRecommendations"];
	techLabel: string;
	industryLabel: string;
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
				Recommended Stack
			</h2>
			<p className="text-slate-text mb-8 text-sm">
				Optimal technology choices for {techLabel} + {industryLabel}
			</p>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{recommendations.map((rec, index) => (
					<m.div
						key={rec.component}
						className="group bg-gunmetal-glass/10 hover:border-cyber-lime/50 relative border border-white/10 p-5 transition-colors duration-300"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ ...springTransition, delay: index * 0.05 }}
					>
						<div className="border-cyber-lime absolute top-0 right-0 h-3 w-3 border-t border-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
						<div className="border-cyber-lime absolute bottom-0 left-0 h-3 w-3 border-b border-l opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

						<div className="mb-3 flex items-center justify-between">
							<Code2 className="text-cyber-lime h-5 w-5" strokeWidth={1.5} />
							<span className="text-slate-text font-mono text-xs opacity-50">{rec.component}</span>
						</div>
						<h3 className="text-cyber-lime mb-2 font-mono text-sm tracking-tight">
							{rec.technology}
						</h3>
						<p className="text-slate-text text-xs leading-relaxed">{rec.rationale}</p>
					</m.div>
				))}
			</div>
		</m.section>
	);
}

function WhyThisStackSection({ content, techLabel }: { content: string; techLabel: string }) {
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
				Why {techLabel}?
			</h2>

			<div className="bg-gunmetal-glass/20 relative border border-white/10 p-8 backdrop-blur-sm md:p-10">
				<div className="border-cyber-lime absolute top-0 right-0 h-5 w-5 border-t border-r" />
				<div className="border-cyber-lime absolute bottom-0 left-0 h-5 w-5 border-b border-l" />

				<div className="prose-invert prose-sm max-w-none">
					{content.split("\n").map((paragraph, i) => (
						<p key={i} className="text-slate-text mb-4 leading-relaxed last:mb-0">
							{paragraph}
						</p>
					))}
				</div>
			</div>
		</m.section>
	);
}

function ProjectApproachSection({ content }: { content: string }) {
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
				My Approach
			</h2>

			<div className="bg-gunmetal-glass/20 relative border border-white/10 p-8 backdrop-blur-sm md:p-10">
				<div className="border-cyber-lime absolute top-0 right-0 h-5 w-5 border-t border-r" />
				<div className="border-cyber-lime absolute bottom-0 left-0 h-5 w-5 border-b border-l" />

				<div className="prose-invert prose-sm max-w-none">
					{content.split("\n").map((paragraph, i) => (
						<p key={i} className="text-slate-text mb-4 leading-relaxed last:mb-0">
							{paragraph}
						</p>
					))}
				</div>
			</div>
		</m.section>
	);
}

function ExpertApproachSection({ expertApproach }: { expertApproach: ExpertApproach }) {
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
				Expert Insights
			</h2>

			<div className="space-y-6">
				{/* Summary */}
				<div className="bg-gunmetal-glass/20 relative border border-white/10 p-8 backdrop-blur-sm">
					<div className="border-cyber-lime absolute top-0 right-0 h-5 w-5 border-t border-r" />
					<div className="border-cyber-lime absolute bottom-0 left-0 h-5 w-5 border-b border-l" />
					<p className="text-mist-white leading-relaxed">{expertApproach.summary}</p>
				</div>

				{/* Real Outcomes */}
				{expertApproach.realOutcomes.length > 0 && (
					<div>
						<h3 className="text-slate-text mb-4 font-mono text-xs tracking-wider uppercase">
							Proven Results
						</h3>
						<div className="grid gap-3 sm:grid-cols-2">
							{expertApproach.realOutcomes.map((outcome, i) => (
								<div key={i} className="flex items-start gap-3 border border-white/10 p-4">
									<span className="text-cyber-lime font-mono text-xs">✓</span>
									<span className="text-slate-text text-sm">{outcome}</span>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Common Mistakes */}
				{expertApproach.commonMistakes.length > 0 && (
					<div>
						<h3 className="text-slate-text mb-4 font-mono text-xs tracking-wider uppercase">
							Mistakes I Help You Avoid
						</h3>
						<div className="space-y-3">
							{expertApproach.commonMistakes.map((mistake, i) => (
								<div
									key={i}
									className="border-burnt-ember/50 bg-burnt-ember/5 flex items-start gap-3 border-l-2 py-3 pr-4 pl-4"
								>
									<AlertTriangle
										className="text-burnt-ember mt-0.5 h-4 w-4 shrink-0"
										strokeWidth={1.5}
									/>
									<span className="text-slate-text text-sm">{mistake}</span>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Decision Frameworks */}
				{expertApproach.decisionFrameworks && expertApproach.decisionFrameworks.length > 0 && (
					<div>
						<h3 className="text-slate-text mb-4 font-mono text-xs tracking-wider uppercase">
							Decision Frameworks I Use
						</h3>
						<ul className="space-y-2">
							{expertApproach.decisionFrameworks.map((framework, i) => (
								<li key={i} className="text-slate-text flex items-center gap-2 text-sm">
									<span className="text-cyber-lime">→</span>
									{framework}
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</m.section>
	);
}

function BudgetSection({
	budget,
	techLabel,
	industryLabel,
}: {
	budget: PseoPage["budgetGuidance"];
	techLabel: string;
	industryLabel: string;
}) {
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: budget.currency,
			maximumFractionDigits: 0,
		}).format(amount);
	};

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
				Investment Guidance
			</h2>
			<p className="text-slate-text mb-8 text-sm">
				Typical budget ranges for {techLabel} {industryLabel.toLowerCase()} projects
			</p>

			<div className="grid gap-6 md:grid-cols-2">
				{/* MVP Tier */}
				<div className="group bg-gunmetal-glass/10 hover:border-cyber-lime/50 relative border border-white/10 p-6 transition-colors duration-300">
					<div className="border-cyber-lime absolute top-0 right-0 h-4 w-4 border-t border-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
					<div className="border-cyber-lime absolute bottom-0 left-0 h-4 w-4 border-b border-l opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

					<div className="mb-4 flex items-center gap-3">
						<DollarSign className="text-cyber-lime h-5 w-5" strokeWidth={1.5} />
						<h3 className="font-mono text-sm tracking-wider uppercase">MVP</h3>
					</div>
					<p className="mb-2 text-3xl font-bold tracking-tight">
						{formatCurrency(budget.mvpMin)} - {formatCurrency(budget.mvpMax)}
					</p>
					<p className="text-slate-text text-sm">
						Core functionality, essential features, production-ready foundation
					</p>
				</div>

				{/* Full Solution Tier */}
				<div className="group bg-gunmetal-glass/10 hover:border-cyber-lime/50 relative border border-white/10 p-6 transition-colors duration-300">
					<div className="border-cyber-lime absolute top-0 right-0 h-4 w-4 border-t border-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
					<div className="border-cyber-lime absolute bottom-0 left-0 h-4 w-4 border-b border-l opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

					<div className="mb-4 flex items-center gap-3">
						<DollarSign className="text-cyber-lime h-5 w-5" strokeWidth={1.5} />
						<DollarSign className="text-cyber-lime -ml-4 h-5 w-5" strokeWidth={1.5} />
						<h3 className="font-mono text-sm tracking-wider uppercase">Full Solution</h3>
					</div>
					<p className="mb-2 text-3xl font-bold tracking-tight">
						{formatCurrency(budget.fullMin)} - {formatCurrency(budget.fullMax)}
					</p>
					<p className="text-slate-text text-sm">
						Complete platform with advanced features, integrations, and scale
					</p>
				</div>
			</div>

			{/* Factors */}
			<div className="mt-6 border-t border-white/10 pt-6">
				<h4 className="text-slate-text mb-3 font-mono text-xs tracking-wider uppercase">
					Factors affecting scope
				</h4>
				<ul className="grid gap-2 sm:grid-cols-2">
					{budget.factors.map((factor, i) => (
						<li key={i} className="text-slate-text flex items-start gap-2 text-sm">
							<span className="text-cyber-lime mt-1.5 h-1.5 w-1.5 shrink-0 bg-current" />
							{factor}
						</li>
					))}
				</ul>
			</div>
		</m.section>
	);
}

function FaqSection({ faqs }: { faqs: PseoPage["faqs"] }) {
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

function RelatedServicesSection({ relatedPages }: { relatedPages: PseoPage[] }) {
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

			<div className="grid gap-4 sm:grid-cols-2">
				{relatedPages.map((page, index) => {
					const techLabel = TECHNOLOGY_LABELS[page.technology];
					const industryLabel = INDUSTRY_LABELS[page.industry];

					return (
						<m.div
							key={page.slug}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ ...springTransition, delay: index * 0.1 }}
						>
							<Link
								href={`/services/${page.slug}`}
								className="group bg-gunmetal-glass/10 hover:border-cyber-lime/50 relative flex items-center justify-between border border-white/10 p-5 transition-colors duration-300"
							>
								<div className="border-cyber-lime absolute top-0 right-0 h-3 w-3 border-t border-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
								<div className="border-cyber-lime absolute bottom-0 left-0 h-3 w-3 border-b border-l opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

								<div>
									<h3 className="group-hover:text-cyber-lime mb-1 font-mono text-sm tracking-tight transition-colors">
										{techLabel} for {industryLabel}
									</h3>
									<p className="text-slate-text line-clamp-1 text-xs">{page.seo.description}</p>
								</div>
								<ExternalLink
									className="text-slate-text group-hover:text-cyber-lime ml-4 h-4 w-4 shrink-0 transition-colors"
									strokeWidth={1.5}
								/>
							</Link>
						</m.div>
					);
				})}
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
							Ready to discuss your project?
						</h2>
						<p className="text-slate-text max-w-xl">
							Let&apos;s talk about how I can help architect a solution tailored to your specific
							requirements and constraints.
						</p>
					</div>

					<Link
						href="/contact"
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
	);
}
