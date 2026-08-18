"use client";

import { m } from "framer-motion";
import { ArrowRight, Building2, CheckCircle2, ChevronRight, Code2 } from "lucide-react";
import Link from "next/link";

import { trackCTAClick } from "@/components/analytics";
import { NewsletterSignup } from "@/components/newsletter/newsletter-signup";
import { INDUSTRY_LABELS, TECHNOLOGY_LABELS } from "@/data/pseo";
import { fadeInUp, springTransition, staggerContainer } from "@/lib/motion-constants";
import { cn } from "@/lib/utils";

import type { PseoPage } from "@/data/pseo";

// Service areas. Pricing is deliberately not published: scope varies too much,
// and rates are quoted per engagement. Available for contract and fractional work.
const serviceTiers = [
	{
		tier: "01",
		name: "Web Development & Maintenance",
		description:
			"Sites and small web applications, built and kept running. WordPress, Next.js, and Python.",
		commitment: "Project or retainer",
		ideal: "Small businesses and teams that need a site that works",
		features: [
			"Site builds and migrations",
			"WordPress themes and plugins",
			"Hosting, DNS, and email setup",
			"Performance and SEO work",
			"Ongoing maintenance",
		],
	},
	{
		tier: "02",
		name: "Automation & Integrations",
		description:
			"Connect the tools you already use and stop doing the same task by hand. Workflows, APIs, and AI-assisted pipelines.",
		commitment: "Project or retainer",
		ideal: "Teams drowning in manual, repetitive work",
		features: [
			"n8n / Zapier / Make workflows",
			"REST API integration",
			"Data extraction and scraping",
			"CRM and form automation",
			"AI-assisted content and ops",
		],
	},
	{
		tier: "03",
		name: "Technical Due Diligence",
		description:
			"An honest read on a codebase or infrastructure: what is solid, what is risky, and what it would take to fix.",
		commitment: "1-2 weeks",
		ideal: "Investors, acquirers, and founders who need the truth",
		features: [
			"Codebase audit and report",
			"Architecture assessment",
			"Security review",
			"Risk identification",
			"Plain-language findings",
		],
	},
];

// Proof points ... shipped, verifiable work.
const trustMetrics = [
	{ value: "~200", label: "PV systems designed", context: "Aurora Solar" },
	{ value: "337x", label: "Processing speedup", context: "TraceForge pipeline" },
	{ value: "73%", label: "GPU cost reduction", context: "PhotoKeep platform" },
	{ value: "70+", label: "Articles published", context: "on this site" },
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
		<section className="page-layout">
			<div className="max-w-content mx-auto">
				{/* Breadcrumbs */}
				<m.nav
					className="text-slate-text mb-8 font-mono text-xs"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ ...springTransition, delay: 0.05 }}
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
					<p className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
						<span className="mr-2 animate-pulse" aria-hidden="true">
							●
						</span>
						Services
					</p>
					<h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
						Web, automation,
						<br />
						<span className="text-slate-text">and the systems in between.</span>
					</h1>
					<p className="text-slate-text max-w-2xl text-lg leading-relaxed">
						I build and maintain websites, automate the repetitive work, and integrate the tools a
						business already runs on. Available for contract and fractional engagements. If you need
						a hand, tell me what needs building.
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
						What I Do
					</m.h2>
					<m.p variants={fadeInUp} className="text-slate-text mb-8 max-w-2xl">
						Three ways I usually help. Scope and pricing are quoted per engagement.
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
						<span className="text-cyber-lime">Book a working session</span>
						<ArrowRight className="text-cyber-lime h-4 w-4 transition-transform group-hover:translate-x-1" />
					</Link>

					<div className="mt-8 border-t border-white/10 pt-8">
						<p className="text-slate-text mb-4 text-center font-mono text-xs tracking-wider uppercase">
							Not ready to talk? Stay in the loop.
						</p>
						<NewsletterSignup variant="minimal" />
					</div>
				</m.section>
			</div>
		</section>
	);
}
