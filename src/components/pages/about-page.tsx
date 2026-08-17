import {
	ArrowRight,
	Calendar,
	Code2,
	Cpu,
	Database,
	ExternalLink,
	Globe,
	MapPin,
	Palette,
	Server,
	Shield,
	TrendingUp,
	Zap,
} from "lucide-react";
import Link from "next/link";

import { MotionCard, MotionDiv, MotionSection } from "@/components/pages/about-page-client";
import { CornerBrackets } from "@/components/ui/corner-brackets";

const skills = [
	{
		category: "Frontend",
		icon: Palette,
		items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
	},
	{
		category: "Backend",
		icon: Server,
		items: ["Node.js", "Python", "Go", "PostgreSQL", "Redis"],
	},
	{
		category: "Infrastructure",
		icon: Cpu,
		items: ["AWS", "Cloudflare", "Docker", "Kubernetes", "Terraform"],
	},
	{
		category: "Data",
		icon: Database,
		items: ["PostgreSQL", "MongoDB", "GraphQL", "Prisma", "Drizzle"],
	},
];

const outcomes = [
	{
		metric: "~200",
		label: "PV systems designed",
		context: "in Aurora Solar for a Martha's Vineyard installer",
	},
	{
		metric: "#1",
		label: "Local search rankings",
		context: "built and held for the company's core solar searches",
	},
	{
		metric: "337x",
		label: "Processing speedup",
		context: "TraceForge raster-to-SVG pipeline, 45 min to 8 sec",
	},
	{
		metric: "73%",
		label: "GPU cost reduction",
		context: "PhotoKeep image-restoration platform",
	},
];

const differentiators = [
	{
		icon: TrendingUp,
		title: "Compound Architecture",
		description:
			"Every technical decision is evaluated for its 3-year trajectory. I build systems that become more valuable over time, not technical debt that compounds against you.",
	},
	{
		icon: Shield,
		title: "Risk Mitigation",
		description:
			"I've seen the failure patterns. Part of the job is spotting architectural landmines before they detonate... and saying so plainly, even when it's not what anyone wants to hear.",
	},
	{
		icon: Zap,
		title: "Velocity Engineering",
		description:
			"Speed comes from simplicity. I architect systems that let your team ship faster by removing complexity, not adding frameworks.",
	},
];

const timeline = [
	{
		year: "2026",
		title: "Self-Employed, Mayhew Technology LLC",
		description:
			"Sole developer on a production data platform for a private investment firm, delivered with a written engineering handoff. Web apps for local small businesses, data-extraction tools for freelance clients, and my own products.",
		status: "current",
	},
	{
		year: "2016",
		title: "Solar Designer & Technology Specialist, Harvest Sun Solar",
		description:
			"Nine years as the one-person tech department for a Martha's Vineyard solar installer (through December 2025, when the company closed). Designed ~200 residential PV systems, handled permitting through historic and conservation boards, built the lead-capture software and the WordPress site, ran the marketing and the IT.",
	},
	{
		year: "Age 14",
		title: "Self-taught beginnings",
		description:
			"Started coding and building for the web at 14. Still how I learn: pick a real problem, build the thing, maintain it long enough to learn what it teaches.",
	},
];

// Tagged with utm_* so GA4 attributes clicks back to the about page.
function aboutUtm(href: string, medium: string): string {
	if (href.startsWith("mailto:") || !href.includes("://")) return href;
	const utm = `utm_source=alexmayhew.dev&utm_medium=${encodeURIComponent(medium)}&utm_campaign=about`;
	return href.includes("?") ? `${href}&${utm}` : `${href}?${utm}`;
}

const socialLinks = [
	{
		label: "LinkedIn",
		href: aboutUtm("https://www.linkedin.com/in/alexmmayhew", "social-linkedin"),
	},
	{ label: "GitHub", href: aboutUtm("https://github.com/LecoMV", "social-github") },
	{ label: "X / Twitter", href: aboutUtm("https://x.com/alexmayhewdev", "social-x") },
	{
		label: "Bluesky",
		href: aboutUtm("https://bsky.app/profile/alexmayhewdev.bsky.social", "social-bluesky"),
	},
	{ label: "Dev.to", href: aboutUtm("https://dev.to/alexmayhewdev", "social-devto") },
	{ label: "Email", href: "mailto:alex@alexmayhew.dev" },
];

export function AboutPage() {
	return (
		<section className="page-layout">
			<div className="max-w-content mx-auto">
				{/* Header - Opening Hook */}
				<MotionDiv className="mb-16">
					<p className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
						<span className="mr-2 animate-pulse" aria-hidden="true">
							●
						</span>
						About
					</p>
					<h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
						The only technical person
						<br />
						<span className="text-slate-text">in the room.</span>
					</h1>
				</MotionDiv>

				{/* Opening Hook - Problem Statement */}
				<div className="mb-24 grid grid-cols-1 gap-12 lg:grid-cols-12">
					<MotionDiv className="lg:col-span-7" delay={0.1}>
						<div className="space-y-6 text-lg leading-relaxed">
							<p className="text-xl leading-relaxed">
								For nine years I was the entire technology department of a Martha&apos;s Vineyard
								solar company: designer, developer, sysadmin, marketer, and first-line support.{" "}
								<span className="text-cyber-lime">When it needed building, I built it.</span>
							</p>
							<p className="text-slate-text">
								That ended in December 2025 when the company closed. Since then, Mayhew Technology
								has shifted from client services to building products... an AI voice platform, a
								commercial SaaS starter kit, developer tools... alongside selected client work,
								including a production data platform delivered to an investment firm with a full
								engineering handoff.
							</p>
							<p className="text-slate-text">
								Right now I&apos;m looking for steady remote work with a team. After a decade as the
								only technical person in the room, I want to build inside a system bigger than me:
								code review, senior peers, problems at a scale one person can&apos;t reach. The LLC
								stays for legal continuity; my focus is the team I join.
							</p>
						</div>

						{/* Location & Availability */}
						<div className="mt-8 flex flex-wrap gap-6">
							<div className="text-slate-text flex items-center gap-2 font-mono text-sm">
								<MapPin className="text-cyber-lime h-4 w-4" strokeWidth={1.5} />
								Remote / Worldwide
							</div>
							<div className="text-slate-text flex items-center gap-2 font-mono text-sm">
								<Calendar className="text-cyber-lime h-4 w-4" strokeWidth={1.5} />
								Open To Remote Work
							</div>
							<div className="text-slate-text flex items-center gap-2 font-mono text-sm">
								<Globe className="text-cyber-lime h-4 w-4" strokeWidth={1.5} />
								English
							</div>
						</div>
					</MotionDiv>

					{/* Outcomes - Proof Points */}
					<MotionDiv className="lg:col-span-5" delay={0.2} fromX={30}>
						<div className="bg-gunmetal-glass/20 relative border border-white/10 p-6 backdrop-blur-sm">
							<div className="border-cyber-lime absolute top-0 right-0 h-4 w-4 border-t border-r" />
							<div className="border-cyber-lime absolute bottom-0 left-0 h-4 w-4 border-b border-l" />

							<h3 className="text-cyber-lime mb-6 font-mono text-xs tracking-wider uppercase">
								<span className="mr-2" aria-hidden="true">
									●
								</span>
								Outcomes Delivered
							</h3>

							<div className="space-y-6">
								{outcomes.map((outcome) => (
									<div key={outcome.label} className="border-b border-white/5 pb-4 last:border-0">
										<div className="mb-1 font-mono text-2xl tracking-tight">
											<span className="text-cyber-lime">{outcome.metric}</span>
										</div>
										<div className="text-sm font-medium">{outcome.label}</div>
										<div className="text-slate-text text-xs">{outcome.context}</div>
									</div>
								))}
							</div>
						</div>
					</MotionDiv>
				</div>

				{/* Philosophy / Differentiators Section */}
				<MotionSection className="mb-24">
					<h2 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
						<span className="mr-2 animate-pulse" aria-hidden="true">
							●
						</span>
						My Approach
					</h2>

					<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
						{differentiators.map((diff, index) => (
							<MotionCard
								key={diff.title}
								className="group bg-gunmetal-glass/10 hover:border-cyber-lime/50 relative border border-white/10 p-6 backdrop-blur-sm transition-colors duration-300"
								delay={index * 0.1}
							>
								<CornerBrackets hover />

								<diff.icon className="text-cyber-lime mb-4 h-6 w-6" strokeWidth={1.5} />
								<h3 className="mb-3 font-mono text-lg tracking-tight">{diff.title}</h3>
								<p className="text-slate-text text-sm leading-relaxed">{diff.description}</p>
							</MotionCard>
						))}
					</div>
				</MotionSection>

				{/* Skills Section */}
				<MotionSection className="mb-24">
					<h2 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
						<span className="mr-2 animate-pulse" aria-hidden="true">
							●
						</span>
						Technical Toolkit
					</h2>

					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
						{skills.map((skill, index) => (
							<MotionCard
								key={skill.category}
								className="group bg-gunmetal-glass/10 hover:border-cyber-lime/50 relative border border-white/10 p-6 backdrop-blur-sm transition-colors duration-300"
								delay={index * 0.1}
							>
								<CornerBrackets hover />

								<skill.icon className="text-cyber-lime mb-4 h-6 w-6" strokeWidth={1.5} />
								<h3 className="mb-4 font-mono text-sm tracking-tight">{skill.category}</h3>

								<ul className="space-y-2">
									{skill.items.map((item) => (
										<li key={item} className="text-slate-text flex items-center gap-2 text-sm">
											<Code2 className="h-3 w-3 opacity-50" strokeWidth={1.5} />
											{item}
										</li>
									))}
								</ul>
							</MotionCard>
						))}
					</div>
				</MotionSection>

				{/* Timeline Section - Emphasizing Outcomes */}
				<MotionSection className="mb-24">
					<h2 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
						<span className="mr-2 animate-pulse" aria-hidden="true">
							●
						</span>
						Journey
					</h2>

					<div className="relative">
						{/* Timeline line */}
						<div className="absolute top-0 bottom-0 left-[7px] w-px bg-white/10 md:left-1/2 md:-translate-x-px" />

						<div className="space-y-8">
							{timeline.map((item, index) => (
								<MotionCard
									key={item.year}
									className="relative grid grid-cols-1 gap-4 pl-8 md:grid-cols-2 md:gap-8 md:pl-0"
									delay={index * 0.1}
								>
									{/* Timeline dot */}
									<div className="bg-void-navy absolute top-2 left-0 flex h-4 w-4 items-center justify-center md:left-1/2 md:-translate-x-1/2">
										<div
											className={`h-2 w-2 ${item.status === "current" ? "bg-cyber-lime animate-pulse" : "bg-white/30"}`}
										/>
									</div>

									{/* Year (left side on desktop) */}
									<div className="text-right md:pr-8">
										<span className="text-cyber-lime font-mono text-sm">{item.year}</span>
									</div>

									{/* Content (right side on desktop) */}
									<div className="md:pl-8">
										<h3 className="mb-1 font-mono text-lg tracking-tight">
											{item.title}
											{item.status === "current" && (
												<span className="text-cyber-lime ml-2 text-xs">(Current)</span>
											)}
										</h3>
										<p className="text-slate-text text-sm leading-relaxed">{item.description}</p>
									</div>
								</MotionCard>
							))}
						</div>
					</div>
				</MotionSection>

				{/* Human Element */}
				<MotionSection className="mb-24">
					<h2 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
						<span className="mr-2 animate-pulse" aria-hidden="true">
							●
						</span>
						Beyond the Terminal
					</h2>

					<div className="bg-gunmetal-glass/10 relative max-w-3xl border border-white/10 p-8 backdrop-blur-sm">
						<div className="border-cyber-lime absolute top-0 right-0 h-4 w-4 border-t border-r" />
						<div className="border-cyber-lime absolute bottom-0 left-0 h-4 w-4 border-b border-l" />

						<p className="text-slate-text text-lg leading-relaxed">
							When I&apos;m not building, you&apos;ll find me exploring the intersection of
							technology and craft. I believe the best technical work comes from understanding how
							things are made... whether that&apos;s coffee, furniture, or distributed systems. That
							shapes how I approach every project: with curiosity, precision, and respect for the
							craft.
						</p>
					</div>
				</MotionSection>

				{/* Contrarian positions (E-E-A-T signal) */}
				<MotionSection className="mb-20">
					<h2 className="text-cyber-lime mb-6 font-mono text-xs tracking-wider uppercase">
						<span className="mr-2" aria-hidden="true">
							●
						</span>
						Positions I hold
					</h2>
					<div className="grid gap-6 md:grid-cols-2">
						<div className="bg-gunmetal-glass/20 border border-white/10 p-6">
							<h3 className="text-mist-white mb-2 font-mono text-sm">
								Microservices before product-market fit
							</h3>
							<p className="text-slate-text text-sm leading-relaxed">
								Most pre-Series-A teams asking for microservices actually need a well-partitioned
								monolith with clean module boundaries. I will say no and explain why.
							</p>
						</div>
						<div className="bg-gunmetal-glass/20 border border-white/10 p-6">
							<h3 className="text-mist-white mb-2 font-mono text-sm">
								AI-first architecture without measurement
							</h3>
							<p className="text-slate-text text-sm leading-relaxed">
								Shipping LLM features without evals, cost ceilings, and latency budgets isn&apos;t
								innovation... it&apos;s a production incident waiting for a post-mortem.
							</p>
						</div>
						<div className="bg-gunmetal-glass/20 border border-white/10 p-6">
							<h3 className="text-mist-white mb-2 font-mono text-sm">Rewrites as a shortcut</h3>
							<p className="text-slate-text text-sm leading-relaxed">
								Nine out of ten &quot;we need a rewrite&quot; conversations end with a strangler
								migration or targeted refactor. The tenth gets an honest plan... not a blank page.
							</p>
						</div>
						<div className="bg-gunmetal-glass/20 border border-white/10 p-6">
							<h3 className="text-mist-white mb-2 font-mono text-sm">
								Hiring to fix architecture problems
							</h3>
							<p className="text-slate-text text-sm leading-relaxed">
								If your system needs five more engineers to be reliable, you don&apos;t have a
								hiring problem. You have a design problem.
							</p>
						</div>
					</div>
				</MotionSection>

				{/* Connect / sameAs links (E-E-A-T) */}
				<MotionSection className="mb-20">
					<h2 className="text-cyber-lime mb-6 font-mono text-xs tracking-wider uppercase">
						<span className="mr-2" aria-hidden="true">
							●
						</span>
						Elsewhere
					</h2>
					<ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
						{socialLinks.map((link) => (
							<li key={link.href}>
								<a
									href={link.href}
									rel={link.href.startsWith("http") ? "me noopener noreferrer" : undefined}
									target={link.href.startsWith("http") ? "_blank" : undefined}
									className="group hover:border-cyber-lime focus-visible:border-cyber-lime focus-visible:ring-cyber-lime focus-visible:ring-offset-void-navy flex items-center justify-between border border-white/10 bg-white/[0.02] px-4 py-3 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
								>
									<span className="text-mist-white group-hover:text-cyber-lime font-mono text-sm transition-colors">
										{link.label}
									</span>
									<ExternalLink
										className="text-slate-text group-hover:text-cyber-lime h-4 w-4 transition-colors"
										strokeWidth={1.5}
									/>
								</a>
							</li>
						))}
					</ul>
				</MotionSection>

				{/* CTA Section */}
				<MotionSection>
					<div className="bg-gunmetal-glass/20 relative border border-white/10 p-8 backdrop-blur-sm md:p-12">
						<div className="border-cyber-lime absolute top-0 right-0 h-6 w-6 border-t border-r" />
						<div className="border-cyber-lime absolute bottom-0 left-0 h-6 w-6 border-b border-l" />

						<div className="max-w-2xl">
							<h2 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl">
								Need a hand, or need a teammate?
							</h2>
							<p className="text-slate-text mb-8 text-lg">
								I&apos;m available for part-time, contract, or full-time remote work... and for
								project engagements through the LLC. Either way, the first conversation is the same:
								tell me what needs building.
							</p>

							<Link
								href="/contact"
								className="group hover:border-cyber-lime inline-flex items-center gap-3 border border-white/20 px-8 py-4 transition-colors duration-300"
							>
								<span className="group-hover:text-cyber-lime font-mono text-sm tracking-tight transition-colors">
									INITIATE_CONTACT()
								</span>
								<ArrowRight
									className="group-hover:text-cyber-lime h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
									strokeWidth={1.5}
								/>
							</Link>
						</div>
					</div>
				</MotionSection>
			</div>
		</section>
	);
}
