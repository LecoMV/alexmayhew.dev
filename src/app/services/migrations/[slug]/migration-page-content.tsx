"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { NewsletterSignup } from "@/components/newsletter/newsletter-signup";
import {
	ArrowRight,
	AlertTriangle,
	Shield,
	Clock,
	DollarSign,
	HelpCircle,
	ChevronDown,
	TrendingUp,
	Zap,
	Target,
	CheckCircle2,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import type { MigrationPage, PseoPage } from "@/data/pseo";
import { INDUSTRY_LABELS, TECHNOLOGY_LABELS, getPageBySlug } from "@/data/pseo";
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

interface MigrationPageContentProps {
	page: MigrationPage;
}

export function MigrationPageContent({ page }: MigrationPageContentProps) {
	return (
		<main className="min-h-dvh px-6 pt-44 pb-24 sm:px-12 md:px-24">
			<div className="mx-auto max-w-[1400px]">
				{/* Breadcrumbs */}
				<Breadcrumbs page={page} />

				{/* Hero Section */}
				<HeroSection page={page} />

				{/* Risk Dashboard */}
				<RiskDashboard page={page} />

				{/* Unique Insights */}
				<UniqueInsightsSection insights={page.uniqueInsights} />

				{/* Urgency Drivers */}
				<UrgencyDriversSection drivers={page.urgencyDrivers} />

				{/* Migration Patterns */}
				<MigrationPatternsSection patterns={page.patterns} />

				{/* Challenges & Solutions */}
				<ChallengesSection challenges={page.challenges} />

				{/* Migration Approach */}
				<MigrationApproachSection content={page.migrationApproach} />

				{/* ROI Narrative */}
				<RoiSection content={page.roiNarrative} modernTech={page.modernTech.name} />

				{/* Timeline */}
				<TimelineSection timeline={page.timeline} page={page} />

				{/* Budget Guidance */}
				<BudgetSection budget={page.budgetGuidance} />

				{/* Compliance */}
				{page.complianceConsiderations.length > 0 && (
					<ComplianceSection regulations={page.complianceConsiderations} />
				)}

				{/* FAQs */}
				<FaqSection faqs={page.faqs} />

				{/* Related Services */}
				{page.relatedServices.length > 0 && (
					<RelatedServicesSection relatedSlugs={page.relatedServices} />
				)}

				{/* CTA Section */}
				<CtaSection page={page} />
			</div>
		</main>
	);
}

// =============================================================================
// Sub-Components
// =============================================================================

function Breadcrumbs({ page }: { page: MigrationPage }) {
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
				<li>
					<Link href="/services" className="hover:text-cyber-lime transition-colors">
						Migrations
					</Link>
				</li>
				<li aria-hidden="true">/</li>
				<li className="text-mist-white" aria-current="page">
					{page.legacyTech.name} to {page.modernTech.name}
				</li>
			</ol>
		</m.nav>
	);
}

function HeroSection({ page }: { page: MigrationPage }) {
	return (
		<m.section className="mb-20" initial="hidden" animate="visible" variants={staggerContainer}>
			<m.div variants={fadeInUp} className="mb-6">
				<span className="text-cyber-lime font-mono text-xs tracking-wider uppercase">
					<span className="mr-2 animate-pulse">●</span>
					Legacy_Migration
				</span>
			</m.div>

			<m.h1
				variants={fadeInUp}
				className="text-mist-white mb-6 font-mono text-4xl leading-tight tracking-tight sm:text-5xl md:text-6xl"
			>
				Architecting the Migration:
				<br />
				<span className="text-slate-text decoration-burnt-ember/50 line-through">
					{page.legacyTech.name}
				</span>
				<span className="text-cyber-lime mx-4">→</span>
				<span className="text-cyber-lime">{page.modernTech.name}</span>
			</m.h1>

			<m.p
				variants={fadeInUp}
				className="text-slate-text max-w-3xl text-lg leading-relaxed sm:text-xl"
			>
				{page.seo.description}
			</m.p>

			<m.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-3">
				{page.targetIndustries.map((industry) => (
					<span
						key={industry}
						className="bg-gunmetal-glass/30 text-slate-text border border-white/10 px-3 py-1 font-mono text-xs"
					>
						{INDUSTRY_LABELS[industry]}
					</span>
				))}
			</m.div>
		</m.section>
	);
}

function RiskDashboard({ page }: { page: MigrationPage }) {
	const securityRiskColors = {
		critical: "text-burnt-ember border-burnt-ember bg-burnt-ember/10",
		high: "text-orange-400 border-orange-400 bg-orange-400/10",
		medium: "text-yellow-400 border-yellow-400 bg-yellow-400/10",
		low: "text-green-400 border-green-400 bg-green-400/10",
	};

	return (
		<m.section
			className="mb-20"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-100px" }}
			variants={staggerContainer}
		>
			<m.h2
				variants={fadeInUp}
				className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase"
			>
				<span className="mr-2 animate-pulse">●</span>
				Risk_Assessment
			</m.h2>

			<m.div variants={fadeInUp} className="grid gap-6 md:grid-cols-2">
				{/* Legacy Tech Card */}
				<div className="bg-gunmetal-glass/20 relative border border-white/10 p-6 backdrop-blur-md">
					<div className="border-burnt-ember absolute top-0 right-0 h-3 w-3 border-t border-r" />
					<div className="border-burnt-ember absolute bottom-0 left-0 h-3 w-3 border-b border-l" />

					<div className="mb-4 flex items-center gap-3">
						<AlertTriangle className="text-burnt-ember h-5 w-5" />
						<h3 className="text-mist-white font-mono text-sm tracking-tight">
							{page.legacyTech.name}
						</h3>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<span className="text-slate-text text-sm">End of Life</span>
							<span className="text-burnt-ember font-mono text-sm">{page.legacyTech.eolDate}</span>
						</div>

						<div className="flex items-center justify-between">
							<span className="text-slate-text text-sm">Known CVEs</span>
							<span className="text-burnt-ember font-mono text-sm">
								{page.legacyTech.cveCount}+
							</span>
						</div>

						<div className="flex items-center justify-between">
							<span className="text-slate-text text-sm">Security Risk</span>
							<span
								className={cn(
									"px-2 py-0.5 font-mono text-xs uppercase",
									securityRiskColors[page.legacyTech.securityRisk]
								)}
							>
								{page.legacyTech.securityRisk}
							</span>
						</div>

						<div className="flex items-center justify-between">
							<span className="text-slate-text text-sm">Talent Availability</span>
							<span className="text-burnt-ember font-mono text-sm">
								{page.legacyTech.talentAvailability}% of developers
							</span>
						</div>

						<div className="flex items-center justify-between">
							<span className="text-slate-text text-sm">Salary Premium</span>
							<span className="text-slate-text font-mono text-sm">
								{page.legacyTech.salaryPremium}
							</span>
						</div>
					</div>
				</div>

				{/* Modern Tech Card */}
				<div className="bg-gunmetal-glass/20 relative border border-white/10 p-6 backdrop-blur-md">
					<div className="border-cyber-lime absolute top-0 right-0 h-3 w-3 border-t border-r" />
					<div className="border-cyber-lime absolute bottom-0 left-0 h-3 w-3 border-b border-l" />

					<div className="mb-4 flex items-center gap-3">
						<Zap className="text-cyber-lime h-5 w-5" />
						<h3 className="text-mist-white font-mono text-sm tracking-tight">
							{page.modernTech.name}
						</h3>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<span className="text-slate-text text-sm">Current Version</span>
							<span className="text-cyber-lime font-mono text-sm">
								{page.modernTech.currentVersion}
							</span>
						</div>

						<div className="flex items-center justify-between">
							<span className="text-slate-text text-sm">LTS Status</span>
							<span className="text-cyber-lime font-mono text-sm">{page.modernTech.ltsStatus}</span>
						</div>

						<div className="flex items-center justify-between">
							<span className="text-slate-text text-sm">Performance Gain</span>
							<span className="text-cyber-lime font-mono text-sm">
								{page.modernTech.performanceGain}
							</span>
						</div>

						<div className="flex items-center justify-between">
							<span className="text-slate-text text-sm">Talent Availability</span>
							<span className="text-cyber-lime font-mono text-sm">
								{page.modernTech.talentAvailability}% of developers
							</span>
						</div>

						<div className="flex items-center justify-between">
							<span className="text-slate-text text-sm">Ecosystem</span>
							<span className="text-cyber-lime font-mono text-sm">Active</span>
						</div>
					</div>
				</div>
			</m.div>
		</m.section>
	);
}

function UniqueInsightsSection({ insights }: { insights: string[] }) {
	return (
		<m.section
			className="mb-20"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-100px" }}
			variants={staggerContainer}
		>
			<m.h2
				variants={fadeInUp}
				className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase"
			>
				<span className="mr-2 animate-pulse">●</span>
				Migration_Intelligence
			</m.h2>

			<m.div variants={fadeInUp} className="grid gap-4 md:grid-cols-2">
				{insights.map((insight, index) => (
					<div key={index} className="bg-gunmetal-glass/10 border-l-cyber-lime/50 border-l-2 p-4">
						<p className="text-mist-white text-sm leading-relaxed">{insight}</p>
					</div>
				))}
			</m.div>
		</m.section>
	);
}

function UrgencyDriversSection({ drivers }: { drivers: string[] }) {
	return (
		<m.section
			className="mb-20"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-100px" }}
			variants={staggerContainer}
		>
			<m.h2
				variants={fadeInUp}
				className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase"
			>
				<span className="mr-2 animate-pulse">●</span>
				Why_Migrate_Now
			</m.h2>

			<m.div variants={fadeInUp} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{drivers.map((driver, index) => (
					<div
						key={index}
						className="group bg-gunmetal-glass/20 hover:border-burnt-ember/50 relative border border-white/10 p-4 transition-colors"
					>
						<AlertTriangle className="text-burnt-ember mb-3 h-4 w-4" />
						<p className="text-slate-text text-sm leading-relaxed">{driver}</p>
					</div>
				))}
			</m.div>
		</m.section>
	);
}

function MigrationPatternsSection({ patterns }: { patterns: MigrationPage["patterns"] }) {
	const [expandedPattern, setExpandedPattern] = useState<number | null>(0);

	return (
		<m.section
			className="mb-20"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-100px" }}
			variants={staggerContainer}
		>
			<m.h2
				variants={fadeInUp}
				className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase"
			>
				<span className="mr-2 animate-pulse">●</span>
				Migration_Patterns
			</m.h2>

			<m.div variants={fadeInUp} className="space-y-4">
				{patterns.map((pattern, index) => (
					<div key={index} className="bg-gunmetal-glass/20 overflow-hidden border border-white/10">
						<button
							onClick={() => setExpandedPattern(expandedPattern === index ? null : index)}
							className="flex w-full items-center justify-between p-6 text-left"
							aria-expanded={expandedPattern === index}
						>
							<div className="flex items-center gap-4">
								<Target className="text-cyber-lime h-5 w-5 flex-shrink-0" />
								<div>
									<h3 className="text-mist-white font-mono text-sm tracking-tight">
										{pattern.name}
									</h3>
									<p className="text-slate-text mt-1 text-sm">{pattern.description}</p>
								</div>
							</div>
							<ChevronDown
								className={cn(
									"text-slate-text h-5 w-5 flex-shrink-0 transition-transform duration-300",
									expandedPattern === index && "rotate-180"
								)}
							/>
						</button>

						{expandedPattern === index && (
							<m.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: "auto", opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={springTransition}
								className="border-t border-white/10 p-6"
							>
								<div className="grid gap-6 md:grid-cols-2">
									<div>
										<h4 className="text-cyber-lime mb-3 font-mono text-xs uppercase">
											When to Use
										</h4>
										<ul className="space-y-2">
											{pattern.whenToUse.map((use, i) => (
												<li key={i} className="flex items-start gap-2">
													<CheckCircle2 className="text-cyber-lime mt-0.5 h-4 w-4 flex-shrink-0" />
													<span className="text-slate-text text-sm">{use}</span>
												</li>
											))}
										</ul>
									</div>
									<div>
										<h4 className="text-burnt-ember mb-3 font-mono text-xs uppercase">
											Risks to Consider
										</h4>
										<ul className="space-y-2">
											{pattern.risks.map((risk, i) => (
												<li key={i} className="flex items-start gap-2">
													<XCircle className="text-burnt-ember mt-0.5 h-4 w-4 flex-shrink-0" />
													<span className="text-slate-text text-sm">{risk}</span>
												</li>
											))}
										</ul>
									</div>
								</div>
								<div className="mt-4 flex items-center gap-2">
									<Clock className="text-slate-text h-4 w-4" />
									<span className="text-slate-text text-sm">
										Duration multiplier: {pattern.durationMultiplier}x baseline
									</span>
								</div>
							</m.div>
						)}
					</div>
				))}
			</m.div>
		</m.section>
	);
}

function ChallengesSection({ challenges }: { challenges: MigrationPage["challenges"] }) {
	return (
		<m.section
			className="mb-20"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-100px" }}
			variants={staggerContainer}
		>
			<m.h2
				variants={fadeInUp}
				className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase"
			>
				<span className="mr-2 animate-pulse">●</span>
				Challenges_And_Solutions
			</m.h2>

			<m.div variants={fadeInUp} className="space-y-6">
				{challenges.map((item, index) => (
					<div key={index} className="bg-gunmetal-glass/20 relative border border-white/10 p-6">
						<div className="grid gap-6 md:grid-cols-3">
							<div>
								<h4 className="text-burnt-ember mb-2 font-mono text-xs uppercase">Challenge</h4>
								<p className="text-mist-white text-sm">{item.challenge}</p>
							</div>
							<div>
								<h4 className="text-slate-text mb-2 font-mono text-xs uppercase">Impact</h4>
								<p className="text-slate-text text-sm">{item.impact}</p>
							</div>
							<div>
								<h4 className="text-cyber-lime mb-2 font-mono text-xs uppercase">Solution</h4>
								<p className="text-mist-white text-sm">{item.solution}</p>
							</div>
						</div>
					</div>
				))}
			</m.div>
		</m.section>
	);
}

function MigrationApproachSection({ content }: { content: string }) {
	return (
		<m.section
			className="mb-20"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-100px" }}
			variants={staggerContainer}
		>
			<m.h2
				variants={fadeInUp}
				className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase"
			>
				<span className="mr-2 animate-pulse">●</span>
				Migration_Approach
			</m.h2>

			<m.div
				variants={fadeInUp}
				className="bg-gunmetal-glass/20 relative border border-white/10 p-8"
			>
				<div className="border-cyber-lime absolute top-0 right-0 h-3 w-3 border-t border-r" />
				<div className="border-cyber-lime absolute bottom-0 left-0 h-3 w-3 border-b border-l" />

				<p className="text-mist-white text-base leading-relaxed whitespace-pre-line">{content}</p>
			</m.div>
		</m.section>
	);
}

function RoiSection({ content, modernTech }: { content: string; modernTech: string }) {
	return (
		<m.section
			className="mb-20"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-100px" }}
			variants={staggerContainer}
		>
			<m.h2
				variants={fadeInUp}
				className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase"
			>
				<span className="mr-2 animate-pulse">●</span>
				ROI_Projection
			</m.h2>

			<m.div
				variants={fadeInUp}
				className="bg-gunmetal-glass/20 relative border border-white/10 p-8"
			>
				<TrendingUp className="text-cyber-lime mb-4 h-8 w-8" />
				<h3 className="text-mist-white mb-4 font-mono text-lg tracking-tight">
					The {modernTech} Advantage
				</h3>
				<p className="text-slate-text text-base leading-relaxed whitespace-pre-line">{content}</p>
			</m.div>
		</m.section>
	);
}

function TimelineSection({
	timeline,
	page,
}: {
	timeline: MigrationPage["timeline"];
	page: MigrationPage;
}) {
	return (
		<m.section
			className="mb-20"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-100px" }}
			variants={staggerContainer}
		>
			<m.h2
				variants={fadeInUp}
				className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase"
			>
				<span className="mr-2 animate-pulse">●</span>
				Timeline_Expectations
			</m.h2>

			<m.div variants={fadeInUp} className="grid gap-6 md:grid-cols-3">
				<div className="bg-gunmetal-glass/20 relative border border-white/10 p-6">
					<Clock className="text-cyber-lime mb-3 h-5 w-5" />
					<h3 className="text-mist-white mb-2 font-mono text-sm">Assessment Phase</h3>
					<p className="text-cyber-lime font-mono text-2xl">{timeline.assessmentWeeks} weeks</p>
					<p className="text-slate-text mt-2 text-sm">Comprehensive audit and roadmap creation</p>
				</div>

				<div className="bg-gunmetal-glass/20 relative border border-white/10 p-6">
					<Zap className="text-cyber-lime mb-3 h-5 w-5" />
					<h3 className="text-mist-white mb-2 font-mono text-sm">MVP Migration</h3>
					<p className="text-cyber-lime font-mono text-2xl">{timeline.mvpWeeks} weeks</p>
					<p className="text-slate-text mt-2 text-sm">
						Core functionality in {page.modernTech.name}
					</p>
				</div>

				<div className="bg-gunmetal-glass/20 relative border border-white/10 p-6">
					<CheckCircle2 className="text-cyber-lime mb-3 h-5 w-5" />
					<h3 className="text-mist-white mb-2 font-mono text-sm">Full Migration</h3>
					<p className="text-cyber-lime font-mono text-2xl">{timeline.fullMigrationWeeks} weeks</p>
					<p className="text-slate-text mt-2 text-sm">Complete system with legacy decommission</p>
				</div>
			</m.div>

			<m.div variants={fadeInUp} className="mt-6">
				<h4 className="text-slate-text mb-3 font-mono text-xs uppercase">
					Factors Affecting Timeline
				</h4>
				<ul className="grid gap-2 sm:grid-cols-2">
					{timeline.factors.map((factor, index) => (
						<li key={index} className="text-slate-text flex items-center gap-2 text-sm">
							<span className="text-cyber-lime">*</span>
							{factor}
						</li>
					))}
				</ul>
			</m.div>
		</m.section>
	);
}

function BudgetSection({ budget }: { budget: MigrationPage["budgetGuidance"] }) {
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
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-100px" }}
			variants={staggerContainer}
		>
			<m.h2
				variants={fadeInUp}
				className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase"
			>
				<span className="mr-2 animate-pulse">●</span>
				Investment_Range
			</m.h2>

			<m.div variants={fadeInUp} className="grid gap-6 md:grid-cols-2">
				<div className="bg-gunmetal-glass/20 relative border border-white/10 p-6">
					<DollarSign className="text-cyber-lime mb-3 h-5 w-5" />
					<h3 className="text-mist-white mb-2 font-mono text-sm">Assessment + MVP</h3>
					<p className="text-cyber-lime font-mono text-2xl">
						{formatCurrency(budget.mvpMin)} - {formatCurrency(budget.mvpMax)}
					</p>
					<p className="text-slate-text mt-2 text-sm">
						Initial assessment and core migration proof-of-concept
					</p>
				</div>

				<div className="bg-gunmetal-glass/20 relative border border-white/10 p-6">
					<DollarSign className="text-cyber-lime mb-3 h-5 w-5" />
					<h3 className="text-mist-white mb-2 font-mono text-sm">Full Migration</h3>
					<p className="text-cyber-lime font-mono text-2xl">
						{formatCurrency(budget.fullMin)} - {formatCurrency(budget.fullMax)}
					</p>
					<p className="text-slate-text mt-2 text-sm">
						Complete migration with legacy decommission
					</p>
				</div>
			</m.div>

			<m.div variants={fadeInUp} className="mt-6">
				<h4 className="text-slate-text mb-3 font-mono text-xs uppercase">
					Factors Affecting Investment
				</h4>
				<ul className="grid gap-2 sm:grid-cols-2">
					{budget.factors.map((factor, index) => (
						<li key={index} className="text-slate-text flex items-center gap-2 text-sm">
							<span className="text-cyber-lime">*</span>
							{factor}
						</li>
					))}
				</ul>
			</m.div>
		</m.section>
	);
}

function ComplianceSection({
	regulations,
}: {
	regulations: MigrationPage["complianceConsiderations"];
}) {
	return (
		<m.section
			className="mb-20"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-100px" }}
			variants={staggerContainer}
		>
			<m.h2
				variants={fadeInUp}
				className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase"
			>
				<span className="mr-2 animate-pulse">●</span>
				Compliance_Considerations
			</m.h2>

			<m.div variants={fadeInUp} className="grid gap-6 md:grid-cols-2">
				{regulations.map((reg, index) => (
					<div key={index} className="bg-gunmetal-glass/20 relative border border-white/10 p-6">
						<Shield className="text-cyber-lime mb-3 h-5 w-5" />
						<h3 className="text-mist-white mb-1 font-mono text-sm tracking-tight">{reg.name}</h3>
						<p className="text-slate-text mb-3 text-xs">{reg.fullName}</p>
						<p className="text-slate-text mb-4 text-sm">{reg.technicalImplications}</p>
						<ul className="space-y-1">
							{reg.requirements.slice(0, 3).map((req, i) => (
								<li key={i} className="text-slate-text flex items-start gap-2 text-xs">
									<span className="text-cyber-lime mt-1">*</span>
									{req}
								</li>
							))}
						</ul>
					</div>
				))}
			</m.div>
		</m.section>
	);
}

function FaqSection({ faqs }: { faqs: MigrationPage["faqs"] }) {
	const [openIndex, setOpenIndex] = useState<number | null>(0);

	return (
		<m.section
			className="mb-20"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-100px" }}
			variants={staggerContainer}
		>
			<m.h2
				variants={fadeInUp}
				className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase"
			>
				<span className="mr-2 animate-pulse">●</span>
				Migration_FAQs
			</m.h2>

			<m.div variants={fadeInUp} className="space-y-4">
				{faqs.map((faq, index) => (
					<div key={index} className="bg-gunmetal-glass/20 overflow-hidden border border-white/10">
						<button
							onClick={() => setOpenIndex(openIndex === index ? null : index)}
							className="flex w-full items-center justify-between p-6 text-left"
							aria-expanded={openIndex === index}
						>
							<div className="flex items-center gap-4">
								<HelpCircle className="text-cyber-lime h-5 w-5 flex-shrink-0" />
								<span className="text-mist-white font-mono text-sm">{faq.question}</span>
							</div>
							<ChevronDown
								className={cn(
									"text-slate-text h-5 w-5 flex-shrink-0 transition-transform duration-300",
									openIndex === index && "rotate-180"
								)}
							/>
						</button>

						{openIndex === index && (
							<m.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: "auto", opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={springTransition}
								className="border-t border-white/10 px-6 py-4"
							>
								<p className="text-slate-text pl-9 text-sm leading-relaxed">{faq.answer}</p>
							</m.div>
						)}
					</div>
				))}
			</m.div>
		</m.section>
	);
}

function RelatedServicesSection({ relatedSlugs }: { relatedSlugs: string[] }) {
	// Resolve slugs to page data
	const relatedPages = relatedSlugs
		.map((slug) => getPageBySlug(slug))
		.filter((page): page is PseoPage => page !== null && page !== undefined && page.published)
		.slice(0, 4);

	if (relatedPages.length === 0) return null;

	return (
		<m.section
			className="mb-20"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-100px" }}
			variants={staggerContainer}
		>
			<m.h2
				variants={fadeInUp}
				className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase"
			>
				<span className="mr-2 animate-pulse">●</span>
				Related_Services
			</m.h2>

			<m.div variants={fadeInUp} className="grid gap-4 sm:grid-cols-2">
				{relatedPages.map((page) => {
					const techLabel = TECHNOLOGY_LABELS[page.technology];
					const industryLabel = INDUSTRY_LABELS[page.industry];

					return (
						<Link
							key={page.slug}
							href={`/services/${page.slug}`}
							className="group bg-gunmetal-glass/20 hover:border-cyber-lime/50 relative border border-white/10 p-6 transition-colors"
						>
							<div className="border-cyber-lime absolute top-0 right-0 h-3 w-3 border-t border-r opacity-0 transition-opacity group-hover:opacity-100" />
							<div className="border-cyber-lime absolute bottom-0 left-0 h-3 w-3 border-b border-l opacity-0 transition-opacity group-hover:opacity-100" />

							<h3 className="text-mist-white group-hover:text-cyber-lime mb-2 font-mono text-sm tracking-tight transition-colors">
								{techLabel} for {industryLabel}
							</h3>
							<p className="text-slate-text line-clamp-2 text-sm">{page.seo.description}</p>
							<div className="mt-4 flex items-center gap-2">
								<span className="group-hover:text-cyber-lime text-slate-text font-mono text-xs transition-colors">
									Learn more
								</span>
								<ArrowRight className="group-hover:text-cyber-lime text-slate-text h-3 w-3 transition-colors" />
							</div>
						</Link>
					);
				})}
			</m.div>
		</m.section>
	);
}

function CtaSection({ page }: { page: MigrationPage }) {
	return (
		<m.section
			className="mb-10"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-100px" }}
			variants={staggerContainer}
		>
			<m.div
				variants={fadeInUp}
				className="bg-gunmetal-glass/30 relative border border-white/10 p-8 text-center sm:p-12"
			>
				<div className="border-cyber-lime absolute top-0 right-0 h-4 w-4 border-t border-r" />
				<div className="border-cyber-lime absolute bottom-0 left-0 h-4 w-4 border-b border-l" />

				<h2 className="text-mist-white mb-4 font-mono text-2xl tracking-tight sm:text-3xl">
					Ready to escape {page.legacyTech.name}?
				</h2>
				<p className="text-slate-text mx-auto mb-8 max-w-2xl">
					Every week of delay means accumulating technical debt, security exposure, and missed
					opportunities. Let&apos;s architect your path to {page.modernTech.name}.
				</p>

				<Link
					href="/contact"
					onClick={() => trackCTAClick("audit_system", { cta_location: "migration_bottom_cta" })}
					className="group hover:border-cyber-lime relative inline-flex items-center gap-2 border border-white/20 px-8 py-4 transition-colors duration-300"
				>
					<span className="group-hover:text-cyber-lime font-mono text-sm tracking-tight transition-colors">
						AUDIT_SYSTEM()
					</span>
					<ArrowRight className="group-hover:text-cyber-lime h-4 w-4 transition-colors" />
					<div className="bg-cyber-lime/5 absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
				</Link>

				<p className="text-slate-text mt-6 font-mono text-xs">
					Free 30-minute migration assessment
				</p>

				<div className="mt-8 border-t border-white/10 pt-8">
					<p className="text-slate-text mb-4 text-center font-mono text-xs tracking-wider uppercase">
						Not ready to talk? Stay in the loop.
					</p>
					<NewsletterSignup variant="minimal" />
				</div>
			</m.div>
		</m.section>
	);
}
