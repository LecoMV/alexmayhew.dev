"use client";

import { m } from "framer-motion";
import Link from "next/link";
import {
	MapPin,
	Calendar,
	Code2,
	Cpu,
	Database,
	Globe,
	Palette,
	Server,
	ArrowRight,
	TrendingUp,
	Shield,
	Zap,
} from "lucide-react";

const springTransition = {
	type: "spring" as const,
	stiffness: 100,
	damping: 20,
	mass: 1,
};

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
		metric: "400%",
		label: "Revenue increase",
		context: "for e-commerce platform after architecture overhaul",
	},
	{
		metric: "2.1s → 0.3s",
		label: "Load time reduction",
		context: "for SaaS dashboard serving 100k+ users",
	},
	{
		metric: "$2M+",
		label: "Infrastructure saved",
		context: "through strategic cloud architecture decisions",
	},
	{
		metric: "Zero",
		label: "Critical incidents",
		context: "across 18 months of production deployments",
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
			"I've seen the failure patterns. My advisory includes identifying architectural landmines before they detonate—saving months of rework and millions in opportunity cost.",
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
		year: "2024",
		title: "Technical Advisor",
		description:
			"Partnering with select clients to architect high-precision digital instruments. Advisory engagements focused on enterprise-grade systems and strategic technical decisions.",
		status: "current",
	},
	{
		year: "2022",
		title: "Principal Engineer",
		description:
			"Led architecture for enterprise SaaS platforms. Scaled systems from 10k to 500k+ users. Reduced infrastructure costs by 60% while improving performance 8x.",
	},
	{
		year: "2020",
		title: "Senior Full-Stack Engineer",
		description:
			"Architected e-commerce solutions processing $50M+ annually. Introduced performance optimization practices that became team standards.",
	},
	{
		year: "2018",
		title: "Full-Stack Developer",
		description:
			"Built the foundation. Learned that exceptional user experience is an engineering discipline, not just design polish.",
	},
];

export function AboutPage() {
	return (
		<main className="min-h-screen px-6 pt-44 pb-24 sm:px-12 md:px-24">
			<div className="mx-auto max-w-[1400px]">
				{/* Header - Opening Hook */}
				<m.div
					className="mb-16"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={springTransition}
				>
					<h1 className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
						<span className="mr-2 animate-pulse">●</span>
						About
					</h1>
					<h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
						The difference between
						<br />
						<span className="text-slate-text">architecture and accidents.</span>
					</h2>
				</m.div>

				{/* Opening Hook - Problem Statement */}
				<div className="mb-24 grid grid-cols-1 gap-12 lg:grid-cols-12">
					<m.div
						className="lg:col-span-7"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ ...springTransition, delay: 0.1 }}
					>
						<div className="space-y-6 text-lg leading-relaxed">
							<p className="text-xl leading-relaxed">
								Every week, founders make technical decisions that will either compound into
								competitive advantage—or accumulate as crushing technical debt.{" "}
								<span className="text-cyber-lime">I help them choose wisely.</span>
							</p>
							<p className="text-slate-text">
								Six years of building systems that scale has taught me something counterintuitive:
								the best architecture isn&apos;t about choosing the right technology. It&apos;s
								about understanding which decisions can be reversed later, and which ones
								you&apos;re married to forever.
							</p>
							<p className="text-slate-text">
								I work with a select number of clients each quarter—founders and technical leaders
								who understand that a week of strategic advisory can save a year of rebuilding.
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
								Accepting Select Engagements
							</div>
							<div className="text-slate-text flex items-center gap-2 font-mono text-sm">
								<Globe className="text-cyber-lime h-4 w-4" strokeWidth={1.5} />
								English / Spanish
							</div>
						</div>
					</m.div>

					{/* Outcomes - Proof Points */}
					<m.div
						className="lg:col-span-5"
						initial={{ opacity: 0, x: 30 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ ...springTransition, delay: 0.2 }}
					>
						<div className="bg-gunmetal-glass/20 relative border border-white/10 p-6 backdrop-blur-sm">
							<div className="border-cyber-lime absolute top-0 right-0 h-4 w-4 border-t border-r" />
							<div className="border-cyber-lime absolute bottom-0 left-0 h-4 w-4 border-b border-l" />

							<h3 className="text-cyber-lime mb-6 font-mono text-xs tracking-wider uppercase">
								<span className="mr-2">●</span>
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
					</m.div>
				</div>

				{/* Philosophy / Differentiators Section */}
				<m.section
					className="mb-24"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={springTransition}
				>
					<h2 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
						<span className="mr-2 animate-pulse">●</span>
						My Approach
					</h2>

					<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
						{differentiators.map((diff, index) => (
							<m.div
								key={diff.title}
								className="group bg-gunmetal-glass/10 hover:border-cyber-lime/50 relative border border-white/10 p-6 backdrop-blur-sm transition-colors duration-300"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ ...springTransition, delay: index * 0.1 }}
							>
								<div className="border-cyber-lime absolute top-0 right-0 h-3 w-3 border-t border-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
								<div className="border-cyber-lime absolute bottom-0 left-0 h-3 w-3 border-b border-l opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

								<diff.icon className="text-cyber-lime mb-4 h-6 w-6" strokeWidth={1.5} />
								<h3 className="mb-3 font-mono text-lg tracking-tight">{diff.title}</h3>
								<p className="text-slate-text text-sm leading-relaxed">{diff.description}</p>
							</m.div>
						))}
					</div>
				</m.section>

				{/* Skills Section */}
				<m.section
					className="mb-24"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={springTransition}
				>
					<h2 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
						<span className="mr-2 animate-pulse">●</span>
						Technical Toolkit
					</h2>

					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
						{skills.map((skill, index) => (
							<m.div
								key={skill.category}
								className="group bg-gunmetal-glass/10 hover:border-cyber-lime/50 relative border border-white/10 p-6 backdrop-blur-sm transition-colors duration-300"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ ...springTransition, delay: index * 0.1 }}
							>
								<div className="border-cyber-lime absolute top-0 right-0 h-3 w-3 border-t border-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
								<div className="border-cyber-lime absolute bottom-0 left-0 h-3 w-3 border-b border-l opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

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
							</m.div>
						))}
					</div>
				</m.section>

				{/* Timeline Section - Emphasizing Outcomes */}
				<m.section
					className="mb-24"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={springTransition}
				>
					<h2 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
						<span className="mr-2 animate-pulse">●</span>
						Journey
					</h2>

					<div className="relative">
						{/* Timeline line */}
						<div className="absolute top-0 bottom-0 left-[7px] w-px bg-white/10 md:left-1/2 md:-translate-x-px" />

						<div className="space-y-8">
							{timeline.map((item, index) => (
								<m.div
									key={item.year}
									className="relative grid grid-cols-1 gap-4 pl-8 md:grid-cols-2 md:gap-8 md:pl-0"
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ ...springTransition, delay: index * 0.1 }}
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
								</m.div>
							))}
						</div>
					</div>
				</m.section>

				{/* Human Element */}
				<m.section
					className="mb-24"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={springTransition}
				>
					<h2 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
						<span className="mr-2 animate-pulse">●</span>
						Beyond the Terminal
					</h2>

					<div className="bg-gunmetal-glass/10 relative max-w-3xl border border-white/10 p-8 backdrop-blur-sm">
						<div className="border-cyber-lime absolute top-0 right-0 h-4 w-4 border-t border-r" />
						<div className="border-cyber-lime absolute bottom-0 left-0 h-4 w-4 border-b border-l" />

						<p className="text-slate-text text-lg leading-relaxed">
							When I&apos;m not architecting systems, you&apos;ll find me exploring the intersection
							of technology and craft. I believe the best technical work comes from understanding
							how things are made—whether that&apos;s coffee, furniture, or distributed systems.
							This philosophy shapes how I approach every engagement: with curiosity, precision, and
							respect for the craft.
						</p>
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

						<div className="max-w-2xl">
							<h2 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl">
								Ready to make your next technical decision count?
							</h2>
							<p className="text-slate-text mb-8 text-lg">
								I take on a limited number of advisory engagements each quarter. If you&apos;re
								facing an architectural crossroads—scaling challenges, performance bottlenecks, or
								strategic technical decisions—let&apos;s talk.
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
				</m.section>
			</div>
		</main>
	);
}
