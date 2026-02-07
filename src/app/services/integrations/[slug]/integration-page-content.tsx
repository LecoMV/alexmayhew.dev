"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { NewsletterSignup } from "@/components/newsletter/newsletter-signup";
import {
	ArrowRight,
	ArrowLeftRight,
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
	RefreshCw,
	Link2,
	Key,
	Gauge,
	Webhook,
	TestTube,
} from "lucide-react";
import { useState } from "react";
import type { IntegrationPage, PseoPage } from "@/data/pseo";
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

interface IntegrationPageContentProps {
	page: IntegrationPage;
}

export function IntegrationPageContent({ page }: IntegrationPageContentProps) {
	return (
		<main className="min-h-dvh px-6 pt-44 pb-24 sm:px-12 md:px-24">
			<div className="mx-auto max-w-[1400px]">
				{/* Breadcrumbs */}
				<Breadcrumbs page={page} />

				{/* Hero Section */}
				<HeroSection page={page} />

				{/* Platform Comparison */}
				<PlatformComparisonSection page={page} />

				{/* Unique Insights */}
				<UniqueInsightsSection insights={page.uniqueInsights} />

				{/* Integration Patterns */}
				<IntegrationPatternsSection patterns={page.patterns} />

				{/* Data Sync Strategies */}
				<DataSyncStrategiesSection strategies={page.dataSyncStrategies} />

				{/* Challenges & Solutions */}
				<ChallengesSection challenges={page.challenges} />

				{/* Integration Approach */}
				<IntegrationApproachSection content={page.integrationApproach} />

				{/* Benefits Narrative */}
				<BenefitsSection content={page.benefitsNarrative} page={page} />

				{/* Timeline */}
				<TimelineSection timeline={page.timeline} />

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

function Breadcrumbs({ page }: { page: IntegrationPage }) {
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
						Integrations
					</Link>
				</li>
				<li aria-hidden="true">/</li>
				<li className="text-mist-white" aria-current="page">
					{page.saasA.name} + {page.saasB.name}
				</li>
			</ol>
		</m.nav>
	);
}

function HeroSection({ page }: { page: IntegrationPage }) {
	return (
		<m.section className="mb-20" initial="hidden" animate="visible" variants={staggerContainer}>
			<m.div variants={fadeInUp} className="mb-6">
				<span className="text-cyber-lime font-mono text-xs tracking-wider uppercase">
					<span className="mr-2 animate-pulse">●</span>
					SaaS_Integration
				</span>
			</m.div>

			<m.h1
				variants={fadeInUp}
				className="text-mist-white mb-6 font-mono text-4xl leading-tight tracking-tight sm:text-5xl md:text-6xl"
			>
				<span className="text-cyber-lime">{page.saasA.name}</span>
				<span className="text-slate-text mx-4">
					<ArrowLeftRight className="inline h-8 w-8 sm:h-10 sm:w-10" />
				</span>
				<span className="text-cyber-lime">{page.saasB.name}</span>
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

function PlatformComparisonSection({ page }: { page: IntegrationPage }) {
	const authMethodLabels: Record<string, string> = {
		oauth2: "OAuth 2.0",
		api_key: "API Key",
		jwt: "JWT",
		basic: "Basic Auth",
		webhook_signature: "Webhook Signature",
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
				Platform_Specifications
			</m.h2>

			<m.div variants={fadeInUp} className="grid gap-6 md:grid-cols-2">
				{/* SaaS A Card */}
				<div className="bg-gunmetal-glass/20 relative border border-white/10 p-6 backdrop-blur-md">
					<div className="border-cyber-lime absolute top-0 right-0 h-3 w-3 border-t border-r" />
					<div className="border-cyber-lime absolute bottom-0 left-0 h-3 w-3 border-b border-l" />

					<div className="mb-4 flex items-center gap-3">
						<Link2 className="text-cyber-lime h-5 w-5" />
						<h3 className="text-mist-white font-mono text-sm tracking-tight">{page.saasA.name}</h3>
						<span className="text-slate-text ml-auto text-xs">{page.saasA.category}</span>
					</div>

					<div className="space-y-4">
						<div>
							<div className="mb-2 flex items-center gap-2">
								<Key className="text-slate-text h-4 w-4" />
								<span className="text-slate-text text-xs uppercase">Authentication</span>
							</div>
							<div className="flex flex-wrap gap-2">
								{page.saasA.authMethods.map((method) => (
									<span
										key={method}
										className="border-cyber-lime/30 text-cyber-lime border px-2 py-0.5 font-mono text-xs"
									>
										{authMethodLabels[method]}
									</span>
								))}
							</div>
						</div>

						<div>
							<div className="mb-2 flex items-center gap-2">
								<Gauge className="text-slate-text h-4 w-4" />
								<span className="text-slate-text text-xs uppercase">Rate Limits</span>
							</div>
							<p className="text-mist-white font-mono text-sm">
								{page.saasA.rateLimit.requestsPerMinute} req/min
							</p>
							<p className="text-slate-text mt-1 text-xs">{page.saasA.rateLimit.notes}</p>
						</div>

						<div className="flex gap-4">
							<div className="flex items-center gap-2">
								<Webhook
									className={cn(
										"h-4 w-4",
										page.saasA.webhookSupport ? "text-cyber-lime" : "text-slate-text"
									)}
								/>
								<span
									className={cn(
										"text-xs",
										page.saasA.webhookSupport ? "text-cyber-lime" : "text-slate-text"
									)}
								>
									Webhooks
								</span>
							</div>
							<div className="flex items-center gap-2">
								<TestTube
									className={cn(
										"h-4 w-4",
										page.saasA.sandboxAvailable ? "text-cyber-lime" : "text-slate-text"
									)}
								/>
								<span
									className={cn(
										"text-xs",
										page.saasA.sandboxAvailable ? "text-cyber-lime" : "text-slate-text"
									)}
								>
									Sandbox
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* SaaS B Card */}
				<div className="bg-gunmetal-glass/20 relative border border-white/10 p-6 backdrop-blur-md">
					<div className="border-cyber-lime absolute top-0 right-0 h-3 w-3 border-t border-r" />
					<div className="border-cyber-lime absolute bottom-0 left-0 h-3 w-3 border-b border-l" />

					<div className="mb-4 flex items-center gap-3">
						<Link2 className="text-cyber-lime h-5 w-5" />
						<h3 className="text-mist-white font-mono text-sm tracking-tight">{page.saasB.name}</h3>
						<span className="text-slate-text ml-auto text-xs">{page.saasB.category}</span>
					</div>

					<div className="space-y-4">
						<div>
							<div className="mb-2 flex items-center gap-2">
								<Key className="text-slate-text h-4 w-4" />
								<span className="text-slate-text text-xs uppercase">Authentication</span>
							</div>
							<div className="flex flex-wrap gap-2">
								{page.saasB.authMethods.map((method) => (
									<span
										key={method}
										className="border-cyber-lime/30 text-cyber-lime border px-2 py-0.5 font-mono text-xs"
									>
										{authMethodLabels[method]}
									</span>
								))}
							</div>
						</div>

						<div>
							<div className="mb-2 flex items-center gap-2">
								<Gauge className="text-slate-text h-4 w-4" />
								<span className="text-slate-text text-xs uppercase">Rate Limits</span>
							</div>
							<p className="text-mist-white font-mono text-sm">
								{page.saasB.rateLimit.requestsPerMinute} req/min
							</p>
							<p className="text-slate-text mt-1 text-xs">{page.saasB.rateLimit.notes}</p>
						</div>

						<div className="flex gap-4">
							<div className="flex items-center gap-2">
								<Webhook
									className={cn(
										"h-4 w-4",
										page.saasB.webhookSupport ? "text-cyber-lime" : "text-slate-text"
									)}
								/>
								<span
									className={cn(
										"text-xs",
										page.saasB.webhookSupport ? "text-cyber-lime" : "text-slate-text"
									)}
								>
									Webhooks
								</span>
							</div>
							<div className="flex items-center gap-2">
								<TestTube
									className={cn(
										"h-4 w-4",
										page.saasB.sandboxAvailable ? "text-cyber-lime" : "text-slate-text"
									)}
								/>
								<span
									className={cn(
										"text-xs",
										page.saasB.sandboxAvailable ? "text-cyber-lime" : "text-slate-text"
									)}
								>
									Sandbox
								</span>
							</div>
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
				Integration_Intelligence
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

function IntegrationPatternsSection({ patterns }: { patterns: IntegrationPage["patterns"] }) {
	const [expandedPattern, setExpandedPattern] = useState<number | null>(0);

	const complexityColors = {
		low: "text-green-400 border-green-400 bg-green-400/10",
		medium: "text-yellow-400 border-yellow-400 bg-yellow-400/10",
		high: "text-orange-400 border-orange-400 bg-orange-400/10",
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
				Integration_Patterns
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
									<div className="flex items-center gap-3">
										<h3 className="text-mist-white font-mono text-sm tracking-tight">
											{pattern.name}
										</h3>
										<span
											className={cn(
												"px-2 py-0.5 font-mono text-xs uppercase",
												complexityColors[pattern.complexity]
											)}
										>
											{pattern.complexity}
										</span>
									</div>
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
								<div>
									<h4 className="text-cyber-lime mb-3 font-mono text-xs uppercase">When to Use</h4>
									<ul className="space-y-2">
										{pattern.whenToUse.map((use, i) => (
											<li key={i} className="flex items-start gap-2">
												<CheckCircle2 className="text-cyber-lime mt-0.5 h-4 w-4 flex-shrink-0" />
												<span className="text-slate-text text-sm">{use}</span>
											</li>
										))}
									</ul>
								</div>

								<div className="mt-6">
									<h4 className="text-slate-text mb-3 font-mono text-xs uppercase">Architecture</h4>
									<p className="text-mist-white bg-gunmetal-glass/30 p-4 font-mono text-sm">
										{pattern.architecture}
									</p>
								</div>
							</m.div>
						)}
					</div>
				))}
			</m.div>
		</m.section>
	);
}

function DataSyncStrategiesSection({
	strategies,
}: {
	strategies: IntegrationPage["dataSyncStrategies"];
}) {
	const [expandedStrategy, setExpandedStrategy] = useState<number | null>(null);

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
				Data_Sync_Strategies
			</m.h2>

			<m.div variants={fadeInUp} className="space-y-4">
				{strategies.map((strategy, index) => (
					<div key={index} className="bg-gunmetal-glass/20 overflow-hidden border border-white/10">
						<button
							onClick={() => setExpandedStrategy(expandedStrategy === index ? null : index)}
							className="flex w-full items-center justify-between p-6 text-left"
							aria-expanded={expandedStrategy === index}
						>
							<div className="flex items-center gap-4">
								<RefreshCw className="text-cyber-lime h-5 w-5 flex-shrink-0" />
								<div>
									<h3 className="text-mist-white font-mono text-sm tracking-tight">
										{strategy.strategy}
									</h3>
									<p className="text-slate-text mt-1 text-sm">{strategy.description}</p>
								</div>
							</div>
							<ChevronDown
								className={cn(
									"text-slate-text h-5 w-5 flex-shrink-0 transition-transform duration-300",
									expandedStrategy === index && "rotate-180"
								)}
							/>
						</button>

						{expandedStrategy === index && (
							<m.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: "auto", opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={springTransition}
								className="border-t border-white/10 p-6"
							>
								<div className="grid gap-6 md:grid-cols-2">
									<div>
										<h4 className="text-cyber-lime mb-3 font-mono text-xs uppercase">Advantages</h4>
										<ul className="space-y-2">
											{strategy.pros.map((pro, i) => (
												<li key={i} className="flex items-start gap-2">
													<CheckCircle2 className="text-cyber-lime mt-0.5 h-4 w-4 flex-shrink-0" />
													<span className="text-slate-text text-sm">{pro}</span>
												</li>
											))}
										</ul>
									</div>
									<div>
										<h4 className="text-burnt-ember mb-3 font-mono text-xs uppercase">
											Trade-offs
										</h4>
										<ul className="space-y-2">
											{strategy.cons.map((con, i) => (
												<li key={i} className="flex items-start gap-2">
													<XCircle className="text-burnt-ember mt-0.5 h-4 w-4 flex-shrink-0" />
													<span className="text-slate-text text-sm">{con}</span>
												</li>
											))}
										</ul>
									</div>
								</div>
							</m.div>
						)}
					</div>
				))}
			</m.div>
		</m.section>
	);
}

function ChallengesSection({ challenges }: { challenges: IntegrationPage["challenges"] }) {
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

function IntegrationApproachSection({ content }: { content: string }) {
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
				Integration_Approach
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

function BenefitsSection({ content, page }: { content: string; page: IntegrationPage }) {
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
				Business_Impact
			</m.h2>

			<m.div
				variants={fadeInUp}
				className="bg-gunmetal-glass/20 relative border border-white/10 p-8"
			>
				<TrendingUp className="text-cyber-lime mb-4 h-8 w-8" />
				<h3 className="text-mist-white mb-4 font-mono text-lg tracking-tight">
					The {page.saasA.name} + {page.saasB.name} Advantage
				</h3>
				<p className="text-slate-text text-base leading-relaxed whitespace-pre-line">{content}</p>
			</m.div>
		</m.section>
	);
}

function TimelineSection({ timeline }: { timeline: IntegrationPage["timeline"] }) {
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
					<h3 className="text-mist-white mb-2 font-mono text-sm">Discovery Phase</h3>
					<p className="text-cyber-lime font-mono text-2xl">{timeline.discoveryWeeks} weeks</p>
					<p className="text-slate-text mt-2 text-sm">
						API analysis, data mapping, architecture design
					</p>
				</div>

				<div className="bg-gunmetal-glass/20 relative border border-white/10 p-6">
					<Zap className="text-cyber-lime mb-3 h-5 w-5" />
					<h3 className="text-mist-white mb-2 font-mono text-sm">MVP Integration</h3>
					<p className="text-cyber-lime font-mono text-2xl">{timeline.mvpWeeks} weeks</p>
					<p className="text-slate-text mt-2 text-sm">Core sync workflows with error handling</p>
				</div>

				<div className="bg-gunmetal-glass/20 relative border border-white/10 p-6">
					<CheckCircle2 className="text-cyber-lime mb-3 h-5 w-5" />
					<h3 className="text-mist-white mb-2 font-mono text-sm">Production Ready</h3>
					<p className="text-cyber-lime font-mono text-2xl">{timeline.productionWeeks} weeks</p>
					<p className="text-slate-text mt-2 text-sm">Full integration with monitoring & docs</p>
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

function BudgetSection({ budget }: { budget: IntegrationPage["budgetGuidance"] }) {
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
					<h3 className="text-mist-white mb-2 font-mono text-sm">MVP Integration</h3>
					<p className="text-cyber-lime font-mono text-2xl">
						{formatCurrency(budget.mvpMin)} - {formatCurrency(budget.mvpMax)}
					</p>
					<p className="text-slate-text mt-2 text-sm">
						Core sync workflows with essential automation
					</p>
				</div>

				<div className="bg-gunmetal-glass/20 relative border border-white/10 p-6">
					<DollarSign className="text-cyber-lime mb-3 h-5 w-5" />
					<h3 className="text-mist-white mb-2 font-mono text-sm">Full Integration</h3>
					<p className="text-cyber-lime font-mono text-2xl">
						{formatCurrency(budget.fullMin)} - {formatCurrency(budget.fullMax)}
					</p>
					<p className="text-slate-text mt-2 text-sm">Complete solution with advanced automation</p>
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
	regulations: IntegrationPage["complianceConsiderations"];
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

function FaqSection({ faqs }: { faqs: IntegrationPage["faqs"] }) {
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
				Integration_FAQs
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

function CtaSection({ page }: { page: IntegrationPage }) {
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
					Ready to connect {page.saasA.name} + {page.saasB.name}?
				</h2>
				<p className="text-slate-text mx-auto mb-8 max-w-2xl">
					Every day of manual data entry is a day of lost productivity and potential errors.
					Let&apos;s build your integration architecture.
				</p>

				<Link
					href="/contact"
					onClick={() =>
						trackCTAClick("scope_integration", { cta_location: "integration_bottom_cta" })
					}
					className="group hover:border-cyber-lime relative inline-flex items-center gap-2 border border-white/20 px-8 py-4 transition-colors duration-300"
				>
					<span className="group-hover:text-cyber-lime font-mono text-sm tracking-tight transition-colors">
						SCOPE_INTEGRATION()
					</span>
					<ArrowRight className="group-hover:text-cyber-lime h-4 w-4 transition-colors" />
					<div className="bg-cyber-lime/5 absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
				</Link>

				<p className="text-slate-text mt-6 font-mono text-xs">
					Free 30-minute integration scoping call
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
