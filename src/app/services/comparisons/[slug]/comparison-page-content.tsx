"use client";

import { m } from "framer-motion";
import {
	ArrowRight,
	Award,
	CheckCircle2,
	ChevronDown,
	DollarSign,
	HelpCircle,
	Lightbulb,
	Scale,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { CtaSection } from "@/components/pseo/cta-section";
import { RelatedBlogPostsSection } from "@/components/seo";
import { fadeInUp, springTransition, staggerContainer } from "@/lib/motion-constants";
import { cn } from "@/lib/utils";

import type { ComparisonPage } from "@/data/pseo";

interface RelatedServiceLink {
	slug: string;
	title: string;
	description: string;
}

interface ComparisonPageContentProps {
	page: ComparisonPage;
	industryLabelMap: Record<string, string>;
	relatedServicePages: RelatedServiceLink[];
}

export function ComparisonPageContent({
	page,
	industryLabelMap,
	relatedServicePages,
}: ComparisonPageContentProps) {
	return (
		<section className="page-layout">
			<div className="max-w-content mx-auto">
				{/* Breadcrumbs */}
				<Breadcrumbs page={page} />

				{/* Hero Section */}
				<HeroSection page={page} industryLabelMap={industryLabelMap} />

				{/* Quick Verdict */}
				<QuickVerdictSection page={page} />

				{/* Side-by-Side Overview */}
				<SideBySideSection page={page} />

				{/* Comparison Criteria */}
				<CriteriaSection criteria={page.criteria} page={page} />

				{/* Decision Matrix */}
				<DecisionMatrixSection matrix={page.decisionMatrix} page={page} />

				{/* Unique Insights */}
				<UniqueInsightsSection insights={page.uniqueInsights} />

				{/* When to Choose A */}
				<WhenToChooseSection
					title={`When to Choose ${page.optionA.name}`}
					content={page.whenToChooseA}
					variant="A"
				/>

				{/* When to Choose B */}
				<WhenToChooseSection
					title={`When to Choose ${page.optionB.name}`}
					content={page.whenToChooseB}
					variant="B"
				/>

				{/* Expert Verdict */}
				<ExpertVerdictSection verdict={page.expertVerdict} page={page} />

				{/* Budget Comparison */}
				<BudgetComparisonSection page={page} />

				{/* FAQs */}
				<FaqSection faqs={page.faqs} />

				{/* Related Blog Posts */}
				<RelatedBlogPostsSection slugs={page.relatedBlogPosts} />

				{/* Related Services */}
				{relatedServicePages.length > 0 && (
					<RelatedServicesSection relatedServicePages={relatedServicePages} />
				)}

				{/* CTA Section */}
				<CtaSection
					title="Need help deciding?"
					description={`I help technical leaders evaluate technology choices for their specific context. Let's discuss whether ${page.optionA.name} or ${page.optionB.name} is right for your project.`}
					ctaLabel="SCHEDULE_CONSULTATION()"
					ctaEventName="schedule_consultation"
					ctaLocation="comparison_bottom_cta"
				/>
			</div>
		</section>
	);
}

// =============================================================================
// Sub-Components
// =============================================================================

function Breadcrumbs({ page }: { page: ComparisonPage }) {
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
						Comparisons
					</Link>
				</li>
				<li aria-hidden="true">/</li>
				<li className="text-mist-white" aria-current="page">
					{page.optionA.name} vs {page.optionB.name}
				</li>
			</ol>
		</m.nav>
	);
}

function HeroSection({
	page,
	industryLabelMap,
}: {
	page: ComparisonPage;
	industryLabelMap: Record<string, string>;
}) {
	return (
		<m.section className="mb-20" initial="hidden" animate="visible" variants={staggerContainer}>
			<m.div variants={fadeInUp} className="mb-6">
				<span className="text-cyber-lime font-mono text-xs tracking-wider uppercase">
					<span className="mr-2 animate-pulse" aria-hidden="true">
						●
					</span>
					Technology Comparison
				</span>
			</m.div>

			<m.h1
				variants={fadeInUp}
				className="text-mist-white mb-6 font-mono text-4xl leading-tight tracking-tight md:text-5xl lg:text-6xl"
			>
				{page.optionA.name} <span className="text-slate-text">vs</span> {page.optionB.name}
			</m.h1>

			<m.p variants={fadeInUp} className="text-cyber-lime mb-8 font-mono text-lg md:text-xl">
				{page.useCase}
			</m.p>

			<m.p variants={fadeInUp} className="text-slate-text max-w-3xl text-lg leading-relaxed">
				{page.introduction}
			</m.p>

			{/* Target Industries */}
			<m.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-2">
				{page.targetIndustries.map((industry) => (
					<span
						key={industry}
						className="bg-gunmetal-glass/30 text-slate-text border border-white/10 px-3 py-1 font-mono text-xs"
					>
						{industryLabelMap[industry]}
					</span>
				))}
			</m.div>
		</m.section>
	);
}

function QuickVerdictSection({ page }: { page: ComparisonPage }) {
	const { expertVerdict } = page;
	const winner =
		expertVerdict.defaultRecommendation === "A"
			? page.optionA.name
			: expertVerdict.defaultRecommendation === "B"
				? page.optionB.name
				: "It Depends";

	return (
		<m.section
			className="mb-20"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-100px" }}
			variants={staggerContainer}
		>
			<m.div
				variants={fadeInUp}
				className="bg-gunmetal-glass/30 relative border border-white/10 p-8"
			>
				<div className="border-cyber-lime absolute top-0 right-0 h-4 w-4 border-t border-r" />
				<div className="border-cyber-lime absolute bottom-0 left-0 h-4 w-4 border-b border-l" />

				<div className="flex items-start gap-4">
					<Award className="text-cyber-lime mt-1 h-6 w-6 shrink-0" />
					<div>
						<h2 className="text-mist-white mb-2 font-mono text-sm tracking-wider uppercase">
							Quick Verdict
						</h2>
						<p className="text-mist-white mb-4 text-2xl font-medium">
							{expertVerdict.defaultRecommendation === "depends" ? (
								<>It depends on your specific situation</>
							) : (
								<>
									<span className="text-cyber-lime">{winner}</span> for most use cases
								</>
							)}
						</p>
						<p className="text-slate-text">{expertVerdict.summary}</p>
					</div>
				</div>
			</m.div>
		</m.section>
	);
}

function SideBySideSection({ page }: { page: ComparisonPage }) {
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
				<span className="mr-2 animate-pulse" aria-hidden="true">
					●
				</span>
				At a Glance
			</m.h2>

			<div className="grid gap-8 md:grid-cols-2">
				{/* Option A */}
				<m.div
					variants={fadeInUp}
					className="bg-gunmetal-glass/20 relative border border-white/10 p-6"
				>
					<div className="border-cyber-lime absolute top-0 left-0 h-full w-1" />

					<div className="mb-4 flex items-center justify-between">
						<h3 className="text-mist-white font-mono text-xl">{page.optionA.name}</h3>
						<span className="text-slate-text font-mono text-xs">v{page.optionA.version}</span>
					</div>

					<div className="text-slate-text mb-4 space-y-1 font-mono text-xs">
						<p>
							Since {page.optionA.yearReleased} • {page.optionA.maintainer}
						</p>
						<p>
							{page.optionA.githubStars} stars • {page.optionA.npmDownloads}
						</p>
					</div>

					<div className="mb-6">
						<h4 className="text-mist-white mb-3 font-mono text-sm">Strengths</h4>
						<ul className="space-y-2">
							{page.optionA.strengths.slice(0, 4).map((strength, i) => (
								<li key={i} className="text-slate-text flex items-start gap-2 text-sm">
									<CheckCircle2 className="text-cyber-lime mt-0.5 h-4 w-4 shrink-0" />
									<span>{strength}</span>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h4 className="text-mist-white mb-3 font-mono text-sm">Limitations</h4>
						<ul className="space-y-2">
							{page.optionA.limitations.slice(0, 3).map((limitation, i) => (
								<li key={i} className="text-slate-text flex items-start gap-2 text-sm">
									<XCircle className="text-signal-warn mt-0.5 h-4 w-4 shrink-0" />
									<span>{limitation}</span>
								</li>
							))}
						</ul>
					</div>
				</m.div>

				{/* Option B */}
				<m.div
					variants={fadeInUp}
					className="bg-gunmetal-glass/20 relative border border-white/10 p-6"
				>
					<div className="bg-signal-warn absolute top-0 left-0 h-full w-1" />

					<div className="mb-4 flex items-center justify-between">
						<h3 className="text-mist-white font-mono text-xl">{page.optionB.name}</h3>
						<span className="text-slate-text font-mono text-xs">v{page.optionB.version}</span>
					</div>

					<div className="text-slate-text mb-4 space-y-1 font-mono text-xs">
						<p>
							Since {page.optionB.yearReleased} • {page.optionB.maintainer}
						</p>
						<p>
							{page.optionB.githubStars} stars • {page.optionB.npmDownloads}
						</p>
					</div>

					<div className="mb-6">
						<h4 className="text-mist-white mb-3 font-mono text-sm">Strengths</h4>
						<ul className="space-y-2">
							{page.optionB.strengths.slice(0, 4).map((strength, i) => (
								<li key={i} className="text-slate-text flex items-start gap-2 text-sm">
									<CheckCircle2 className="text-signal-warn mt-0.5 h-4 w-4 shrink-0" />
									<span>{strength}</span>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h4 className="text-mist-white mb-3 font-mono text-sm">Limitations</h4>
						<ul className="space-y-2">
							{page.optionB.limitations.slice(0, 3).map((limitation, i) => (
								<li key={i} className="text-slate-text flex items-start gap-2 text-sm">
									<XCircle className="text-signal-warn mt-0.5 h-4 w-4 shrink-0" />
									<span>{limitation}</span>
								</li>
							))}
						</ul>
					</div>
				</m.div>
			</div>
		</m.section>
	);
}

function CriteriaSection({
	criteria,
	page,
}: {
	criteria: ComparisonPage["criteria"];
	page: ComparisonPage;
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
				<span className="mr-2 animate-pulse" aria-hidden="true">
					●
				</span>
				Detailed Comparison
			</m.h2>

			<m.div variants={fadeInUp} className="space-y-6">
				{criteria.map((criterion, index) => (
					<CriterionCard
						key={index}
						criterion={criterion}
						optionAName={page.optionA.name}
						optionBName={page.optionB.name}
					/>
				))}
			</m.div>
		</m.section>
	);
}

function CriterionCard({
	criterion,
	optionAName,
	optionBName,
}: {
	criterion: ComparisonPage["criteria"][0];
	optionAName: string;
	optionBName: string;
}) {
	const [isExpanded, setIsExpanded] = useState(false);
	const winner =
		criterion.optionAScore > criterion.optionBScore
			? "A"
			: criterion.optionBScore > criterion.optionAScore
				? "B"
				: "tie";

	return (
		<div className="bg-gunmetal-glass/20 border border-white/10">
			<button
				onClick={() => setIsExpanded(!isExpanded)}
				className="flex w-full items-center justify-between p-6 text-left"
			>
				<div className="flex-1">
					<h3 className="text-mist-white font-mono text-lg">{criterion.name}</h3>
					<p className="text-slate-text mt-1 text-sm">{criterion.description}</p>
				</div>

				<div className="ml-4 flex items-center gap-4">
					{/* Score visualization */}
					<div className="flex items-center gap-2">
						<div className="text-center">
							<div
								className={cn(
									"font-mono text-lg font-bold",
									winner === "A" ? "text-cyber-lime" : "text-slate-text"
								)}
							>
								{criterion.optionAScore}
							</div>
							<div className="text-slate-text text-xs">{optionAName.split(" ")[0]}</div>
						</div>
						<span className="text-slate-text">vs</span>
						<div className="text-center">
							<div
								className={cn(
									"font-mono text-lg font-bold",
									winner === "B" ? "text-signal-warn" : "text-slate-text"
								)}
							>
								{criterion.optionBScore}
							</div>
							<div className="text-slate-text text-xs">{optionBName.split(" ")[0]}</div>
						</div>
					</div>

					<ChevronDown
						className={cn(
							"text-slate-text h-5 w-5 transition-transform",
							isExpanded && "rotate-180"
						)}
					/>
				</div>
			</button>

			{isExpanded && (
				<m.div
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: "auto" }}
					className="border-t border-white/10 px-6 pb-6"
				>
					<p className="text-slate-text mt-4 leading-relaxed">{criterion.analysis}</p>
					{criterion.source && (
						<p className="text-slate-text/80 mt-3 font-mono text-xs">Source: {criterion.source}</p>
					)}
				</m.div>
			)}
		</div>
	);
}

function DecisionMatrixSection({
	matrix,
	page,
}: {
	matrix: ComparisonPage["decisionMatrix"];
	page: ComparisonPage;
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
				<span className="mr-2 animate-pulse" aria-hidden="true">
					●
				</span>
				Decision Matrix
			</m.h2>

			<m.p variants={fadeInUp} className="text-slate-text mb-8 max-w-3xl">
				Not all decisions are equal. Here&apos;s how different scenarios should influence your
				choice between {page.optionA.name} and {page.optionB.name}.
			</m.p>

			<m.div variants={fadeInUp} className="space-y-4">
				{matrix.map((scenario, index) => (
					<div key={index} className="bg-gunmetal-glass/20 border border-white/10 p-6">
						<div className="flex items-start justify-between gap-4">
							<div className="flex-1">
								<h3 className="text-mist-white mb-2 font-mono">{scenario.scenario}</h3>
								<p className="text-slate-text text-sm">{scenario.rationale}</p>
							</div>
							<div
								className={cn(
									"shrink-0 border px-4 py-2 font-mono text-sm",
									scenario.recommendation === "A"
										? "border-cyber-lime/30 bg-cyber-lime/10 text-cyber-lime"
										: scenario.recommendation === "B"
											? "border-signal-warn/30 bg-signal-warn/10 text-signal-warn"
											: "text-slate-text border-white/20 bg-white/5"
								)}
							>
								{scenario.recommendation === "A"
									? page.optionA.name
									: scenario.recommendation === "B"
										? page.optionB.name
										: "Either"}
							</div>
						</div>
					</div>
				))}
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
				<span className="mr-2 animate-pulse" aria-hidden="true">
					●
				</span>
				Expert Insights
			</m.h2>

			<m.div variants={fadeInUp} className="grid gap-4 md:grid-cols-2">
				{insights.map((insight, index) => (
					<div key={index} className="bg-gunmetal-glass/20 relative border border-white/10 p-6">
						<Lightbulb className="text-cyber-lime mb-4 h-5 w-5" />
						<p className="text-slate-text leading-relaxed">{insight}</p>
					</div>
				))}
			</m.div>
		</m.section>
	);
}

function WhenToChooseSection({
	title,
	content,
	variant,
}: {
	title: string;
	content: string;
	variant: "A" | "B";
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
				className={cn(
					"mb-8 font-mono text-xs tracking-wider uppercase",
					variant === "A" ? "text-cyber-lime" : "text-signal-warn"
				)}
			>
				<span className="mr-2 animate-pulse" aria-hidden="true">
					●
				</span>
				{title}
			</m.h2>

			<m.div
				variants={fadeInUp}
				className={cn(
					"bg-gunmetal-glass/20 relative border p-8",
					variant === "A" ? "border-cyber-lime/20" : "border-signal-warn/20"
				)}
			>
				<div
					className={cn(
						"absolute top-0 left-0 h-full w-1",
						variant === "A" ? "bg-cyber-lime" : "bg-signal-warn"
					)}
				/>

				<div className="prose prose-invert max-w-none">
					{content.split("\n\n").map((paragraph, index) => (
						<p key={index} className="text-slate-text mb-4 leading-relaxed last:mb-0">
							{paragraph}
						</p>
					))}
				</div>
			</m.div>
		</m.section>
	);
}

function ExpertVerdictSection({
	verdict,
	page,
}: {
	verdict: ComparisonPage["expertVerdict"];
	page: ComparisonPage;
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
				<span className="mr-2 animate-pulse" aria-hidden="true">
					●
				</span>
				Expert Verdict
			</m.h2>

			<m.div
				variants={fadeInUp}
				className="bg-gunmetal-glass/30 relative border border-white/10 p-8"
			>
				<div className="border-cyber-lime absolute top-0 right-0 h-6 w-6 border-t-2 border-r-2" />
				<div className="border-cyber-lime absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2" />

				<div className="mb-6 flex items-center gap-4">
					<Scale className="text-cyber-lime h-8 w-8" />
					<div>
						<p className="text-slate-text text-sm">My Recommendation</p>
						<p className="text-mist-white font-mono text-2xl">
							{verdict.defaultRecommendation === "A"
								? page.optionA.name
								: verdict.defaultRecommendation === "B"
									? page.optionB.name
									: "Context-Dependent"}
						</p>
					</div>
				</div>

				<div className="space-y-4">
					{verdict.rationale.split("\n\n").map((paragraph, index) => (
						<p key={index} className="text-slate-text leading-relaxed">
							{paragraph}
						</p>
					))}
				</div>
			</m.div>
		</m.section>
	);
}

function BudgetComparisonSection({ page }: { page: ComparisonPage }) {
	const formatCurrency = (amount: number, currency: string) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency,
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
				<span className="mr-2 animate-pulse" aria-hidden="true">
					●
				</span>
				Budget Comparison
			</m.h2>

			<div className="grid gap-8 md:grid-cols-2">
				{/* Option A Budget */}
				<m.div
					variants={fadeInUp}
					className="bg-gunmetal-glass/20 relative border border-white/10 p-6"
				>
					<div className="border-cyber-lime absolute top-0 left-0 h-full w-1" />

					<h3 className="text-mist-white mb-4 font-mono text-lg">
						{page.optionA.name} Development
					</h3>

					<div className="mb-6 space-y-3">
						<div className="flex justify-between">
							<span className="text-slate-text">MVP Range</span>
							<span className="text-mist-white font-mono">
								{formatCurrency(
									page.budgetGuidance.optionA.mvpMin,
									page.budgetGuidance.optionA.currency
								)}{" "}
								-{" "}
								{formatCurrency(
									page.budgetGuidance.optionA.mvpMax,
									page.budgetGuidance.optionA.currency
								)}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-text">Full Solution</span>
							<span className="text-mist-white font-mono">
								{formatCurrency(
									page.budgetGuidance.optionA.fullMin,
									page.budgetGuidance.optionA.currency
								)}{" "}
								-{" "}
								{formatCurrency(
									page.budgetGuidance.optionA.fullMax,
									page.budgetGuidance.optionA.currency
								)}
							</span>
						</div>
					</div>

					<h4 className="text-mist-white mb-3 font-mono text-sm">Cost Factors</h4>
					<ul className="space-y-2">
						{page.budgetGuidance.optionA.factors.map((factor, i) => (
							<li key={i} className="text-slate-text flex items-start gap-2 text-sm">
								<DollarSign className="text-cyber-lime mt-0.5 h-4 w-4 shrink-0" />
								<span>{factor}</span>
							</li>
						))}
					</ul>
				</m.div>

				{/* Option B Budget */}
				<m.div
					variants={fadeInUp}
					className="bg-gunmetal-glass/20 relative border border-white/10 p-6"
				>
					<div className="bg-signal-warn absolute top-0 left-0 h-full w-1" />

					<h3 className="text-mist-white mb-4 font-mono text-lg">
						{page.optionB.name} Development
					</h3>

					<div className="mb-6 space-y-3">
						<div className="flex justify-between">
							<span className="text-slate-text">MVP Range</span>
							<span className="text-mist-white font-mono">
								{formatCurrency(
									page.budgetGuidance.optionB.mvpMin,
									page.budgetGuidance.optionB.currency
								)}{" "}
								-{" "}
								{formatCurrency(
									page.budgetGuidance.optionB.mvpMax,
									page.budgetGuidance.optionB.currency
								)}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-text">Full Solution</span>
							<span className="text-mist-white font-mono">
								{formatCurrency(
									page.budgetGuidance.optionB.fullMin,
									page.budgetGuidance.optionB.currency
								)}{" "}
								-{" "}
								{formatCurrency(
									page.budgetGuidance.optionB.fullMax,
									page.budgetGuidance.optionB.currency
								)}
							</span>
						</div>
					</div>

					<h4 className="text-mist-white mb-3 font-mono text-sm">Cost Factors</h4>
					<ul className="space-y-2">
						{page.budgetGuidance.optionB.factors.map((factor, i) => (
							<li key={i} className="text-slate-text flex items-start gap-2 text-sm">
								<DollarSign className="text-signal-warn mt-0.5 h-4 w-4 shrink-0" />
								<span>{factor}</span>
							</li>
						))}
					</ul>
				</m.div>
			</div>
		</m.section>
	);
}

function FaqSection({ faqs }: { faqs: ComparisonPage["faqs"] }) {
	const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

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
				<span className="mr-2 animate-pulse" aria-hidden="true">
					●
				</span>
				Frequently Asked Questions
			</m.h2>

			<m.div variants={fadeInUp} className="space-y-4">
				{faqs.map((faq, index) => (
					<div key={index} className="border border-white/10">
						<button
							onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
							className="bg-gunmetal-glass/20 flex w-full items-center justify-between p-6 text-left"
						>
							<div className="flex items-start gap-4">
								<HelpCircle className="text-cyber-lime mt-1 h-5 w-5 shrink-0" />
								<span className="text-mist-white font-mono">{faq.question}</span>
							</div>
							<ChevronDown
								className={cn(
									"text-slate-text h-5 w-5 shrink-0 transition-transform",
									expandedIndex === index && "rotate-180"
								)}
							/>
						</button>
						{expandedIndex === index && (
							<m.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								className="border-t border-white/10 px-6 pb-6"
							>
								<p className="text-slate-text mt-4 leading-relaxed">{faq.answer}</p>
							</m.div>
						)}
					</div>
				))}
			</m.div>
		</m.section>
	);
}

function RelatedServicesSection({
	relatedServicePages,
}: {
	relatedServicePages: RelatedServiceLink[];
}) {
	if (relatedServicePages.length === 0) return null;

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
				<span className="mr-2 animate-pulse" aria-hidden="true">
					●
				</span>
				Related Services
			</m.h2>

			<m.div variants={fadeInUp} className="grid gap-4 md:grid-cols-3">
				{relatedServicePages.slice(0, 3).map((related) => (
					<Link
						key={related.slug}
						href={`/services/${related.slug}`}
						className="group bg-gunmetal-glass/20 relative block border border-white/10 p-6 transition-colors hover:border-white/20"
					>
						<h3 className="text-mist-white group-hover:text-cyber-lime mb-2 font-mono transition-colors">
							{related.title}
						</h3>
						<p className="text-slate-text line-clamp-2 text-sm">{related.description}</p>
						<ArrowRight className="text-slate-text group-hover:text-cyber-lime absolute right-4 bottom-4 h-4 w-4 transition-colors" />
					</Link>
				))}
			</m.div>
		</m.section>
	);
}
