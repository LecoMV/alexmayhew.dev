"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Code2, Building2, CheckCircle2, ChevronRight } from "lucide-react";
import type { PseoPage } from "@/data/pseo";
import { TECHNOLOGY_LABELS, INDUSTRY_LABELS } from "@/data/pseo";
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

// Service tiers for the framework section
const serviceTiers = [
	{
		tier: "Tier 1",
		name: "Advisory Retainer",
		description:
			"Ongoing strategic guidance for founders and CTOs. Architecture reviews, hiring support, and decision validation.",
		commitment: "10-20 hours/month",
		ideal: "Startups with technical decisions to make",
		features: [
			"Weekly architecture reviews",
			"Async Slack/Loom access",
			"Hiring interview support",
			"Vendor evaluation",
			"Due diligence prep",
		],
	},
	{
		tier: "Tier 2",
		name: "Strategic Implementation",
		description:
			"Hands-on architectural work for critical projects. Building foundations that scale.",
		commitment: "Project-based",
		ideal: "Teams building MVPs or major features",
		features: [
			"Architecture design & documentation",
			"Core infrastructure setup",
			"Performance optimization",
			"Security hardening",
			"Team mentorship",
		],
	},
	{
		tier: "Tier 3",
		name: "Technical Due Diligence",
		description:
			"Comprehensive technical assessment for investors, acquirers, or pre-raise founders.",
		commitment: "1-2 weeks",
		ideal: "Fundraising or M&A preparation",
		features: [
			"Codebase audit & report",
			"Architecture assessment",
			"Security review",
			"Team capability evaluation",
			"Risk identification",
		],
	},
];

// Trust metrics
const trustMetrics = [
	{ value: "400%", label: "Revenue increase", context: "e-commerce overhaul" },
	{ value: "337x", label: "Performance gain", context: "TraceForge engine" },
	{ value: "$2M+", label: "Infrastructure saved", context: "cloud optimization" },
	{ value: "0", label: "Critical incidents", context: "18 months production" },
];

interface ServicesPageProps {
	pages: PseoPage[];
}

export function ServicesPage({ pages }: ServicesPageProps) {
	// Group pages by industry for display
	const pagesByIndustry = pages.reduce(
		(acc, page) => {
			const industry = page.industry;
			if (!acc[industry]) {
				acc[industry] = [];
			}
			acc[industry].push(page);
			return acc;
		},
		{} as Record<string, PseoPage[]>
	);

	return (
		<main className="min-h-screen px-6 pt-44 pb-24 sm:px-12 md:px-24">
			<div className="mx-auto max-w-[1400px]">
				{/* Breadcrumbs */}
				<m.nav
					className="text-slate-text mb-8 font-mono text-xs"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.05 }}
				>
					<Link href="/" className="hover:text-cyber-lime transition-colors">
						Home
					</Link>
					<span className="mx-2">/</span>
					<span className="text-mist-white">Services</span>
				</m.nav>

				{/* Hero Section */}
				<m.div
					className="mb-24"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={springTransition}
				>
					<h1 className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
						<span className="mr-2 animate-pulse">●</span>
						Technical_Advisory
					</h1>
					<h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
						Architecture decisions that
						<br />
						<span className="text-slate-text">compound into advantage.</span>
					</h2>
					<p className="text-slate-text max-w-2xl text-lg leading-relaxed">
						Every technical choice has a 3-year trajectory. I help founders and CTOs make the
						decisions that accelerate growth—and avoid the ones that silently accumulate into
						technical debt.
					</p>
				</m.div>

				{/* Trust Metrics */}
				<m.section
					className="mb-24"
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
				>
					<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
						{trustMetrics.map((metric, index) => (
							<m.div
								key={index}
								variants={fadeInUp}
								className="bg-gunmetal-glass/20 border border-white/10 p-6 backdrop-blur-md"
							>
								<div className="text-cyber-lime mb-1 font-mono text-3xl font-bold">
									{metric.value}
								</div>
								<div className="text-mist-white mb-1 text-sm font-medium">{metric.label}</div>
								<div className="text-slate-text text-xs">{metric.context}</div>
							</m.div>
						))}
					</div>
				</m.section>

				{/* Service Tiers Framework */}
				<m.section
					className="mb-24"
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
				>
					<m.h2
						variants={fadeInUp}
						className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase"
					>
						<span className="mr-2">▸</span>
						Engagement_Models
					</m.h2>
					<m.p variants={fadeInUp} className="text-slate-text mb-8 max-w-2xl">
						Three tiers of engagement, each designed for a specific phase of your technical journey.
					</m.p>

					<div className="grid gap-6 md:grid-cols-3">
						{serviceTiers.map((tier, index) => (
							<m.div
								key={tier.tier}
								variants={fadeInUp}
								className={cn(
									"bg-gunmetal-glass/20 relative border border-white/10 p-6 backdrop-blur-md",
									index === 1 && "border-cyber-lime/30"
								)}
							>
								{/* Corner accents */}
								<div className="border-cyber-lime/50 absolute top-0 right-0 h-3 w-3 border-t border-r" />
								<div className="border-cyber-lime/50 absolute bottom-0 left-0 h-3 w-3 border-b border-l" />

								<div className="text-cyber-lime mb-2 font-mono text-xs">{tier.tier}</div>
								<h3 className="text-mist-white mb-2 text-xl font-bold tracking-tight">
									{tier.name}
								</h3>
								<p className="text-slate-text mb-4 text-sm leading-relaxed">{tier.description}</p>

								<div className="mb-4 border-t border-white/10 pt-4">
									<div className="text-slate-text mb-1 text-xs uppercase">Commitment</div>
									<div className="text-mist-white text-sm font-medium">{tier.commitment}</div>
								</div>

								<div className="mb-4">
									<div className="text-slate-text mb-1 text-xs uppercase">Ideal for</div>
									<div className="text-mist-white text-sm">{tier.ideal}</div>
								</div>

								<ul className="space-y-2">
									{tier.features.map((feature, i) => (
										<li key={i} className="flex items-start gap-2 text-sm">
											<CheckCircle2 className="text-cyber-lime mt-0.5 h-4 w-4 flex-shrink-0" />
											<span className="text-slate-text">{feature}</span>
										</li>
									))}
								</ul>
							</m.div>
						))}
					</div>
				</m.section>

				{/* Services by Industry */}
				<m.section
					className="mb-24"
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
				>
					<m.h2
						variants={fadeInUp}
						className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase"
					>
						<span className="mr-2">▸</span>
						Industry_Expertise
					</m.h2>
					<m.p variants={fadeInUp} className="text-slate-text mb-8 max-w-2xl">
						Deep domain knowledge in regulated industries and high-growth verticals. Each service
						page contains unique insights, compliance guidance, and technology recommendations.
					</m.p>

					<div className="space-y-8">
						{Object.entries(pagesByIndustry).map(([industry, industryPages]) => (
							<m.div key={industry} variants={fadeInUp}>
								<h3 className="text-mist-white mb-4 flex items-center gap-2 font-mono text-sm font-medium">
									<Building2 className="text-cyber-lime h-4 w-4" />
									{INDUSTRY_LABELS[industry as keyof typeof INDUSTRY_LABELS]}
								</h3>
								<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
									{industryPages.map((page) => (
										<Link
											key={page.slug}
											href={`/services/${page.slug}`}
											className="bg-gunmetal-glass/10 group relative border border-white/10 p-5 transition-all duration-300 hover:border-white/20"
										>
											{/* Hover glow */}
											<div className="bg-cyber-lime/5 absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

											<div className="relative">
												<div className="mb-2 flex items-center justify-between">
													<div className="text-cyber-lime flex items-center gap-2 font-mono text-xs">
														<Code2 className="h-3 w-3" />
														{TECHNOLOGY_LABELS[page.technology]}
													</div>
													<ChevronRight className="text-slate-text h-4 w-4 transition-transform group-hover:translate-x-1" />
												</div>
												<h4 className="text-mist-white group-hover:text-cyber-lime mb-2 font-medium transition-colors">
													{page.seo.title.replace(" | Technical Advisor", "")}
												</h4>
												<p className="text-slate-text line-clamp-2 text-sm">
													{page.seo.description}
												</p>
											</div>
										</Link>
									))}
								</div>
							</m.div>
						))}
					</div>
				</m.section>

				{/* Technology Badges */}
				<m.section
					className="mb-24"
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
				>
					<m.h2
						variants={fadeInUp}
						className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase"
					>
						<span className="mr-2">▸</span>
						Core_Technologies
					</m.h2>
					<m.div variants={fadeInUp} className="flex flex-wrap gap-3">
						{[
							"Next.js 15",
							"React 19",
							"TypeScript",
							"Node.js",
							"Python",
							"PostgreSQL",
							"Redis",
							"Cloudflare",
							"AWS",
							"Docker",
							"Kubernetes",
							"Prisma",
							"GraphQL",
							"Stripe",
						].map((tech) => (
							<span
								key={tech}
								className="border border-white/20 px-3 py-1.5 font-mono text-xs text-white/80"
							>
								{tech}
							</span>
						))}
					</m.div>
				</m.section>

				{/* CTA Section */}
				<m.section
					className="border-cyber-lime/30 bg-gunmetal-glass/30 border p-8 text-center md:p-12"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={springTransition}
				>
					<h2 className="text-mist-white mb-4 text-2xl font-bold tracking-tight md:text-3xl">
						Ready to discuss your architecture?
					</h2>
					<p className="text-slate-text mx-auto mb-8 max-w-xl">
						Schedule a consultation to explore how strategic technical decisions can accelerate your
						product roadmap.
					</p>
					<Link
						href="/contact"
						onClick={() =>
							trackCTAClick("schedule_consultation", { cta_location: "services_bottom_cta" })
						}
						className="group border-cyber-lime bg-cyber-lime/10 hover:bg-cyber-lime/20 inline-flex items-center gap-2 border px-8 py-4 font-mono text-sm transition-colors"
					>
						<span className="text-cyber-lime">Schedule_Consultation()</span>
						<ArrowRight className="text-cyber-lime h-4 w-4 transition-transform group-hover:translate-x-1" />
					</Link>
				</m.section>
			</div>
		</main>
	);
}
