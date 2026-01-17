"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, Code2, Cpu, Database, Globe, Palette, Server } from "lucide-react";

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

const timeline = [
	{
		year: "2024",
		title: "Freelance Developer",
		description: "Building high-precision digital instruments for select clients.",
		status: "current",
	},
	{
		year: "2022",
		title: "Senior Full-Stack Engineer",
		description: "Led development of enterprise SaaS platforms serving 100k+ users.",
	},
	{
		year: "2020",
		title: "Full-Stack Developer",
		description: "Built and scaled e-commerce solutions and web applications.",
	},
	{
		year: "2018",
		title: "Frontend Developer",
		description: "Started professional journey crafting user interfaces.",
	},
];

const stats = [
	{ label: "Years Experience", value: "6+", suffix: "" },
	{ label: "Projects Delivered", value: "50", suffix: "+" },
	{ label: "Lines of Code", value: "2", suffix: "M+" },
	{ label: "Cups of Coffee", value: "∞", suffix: "" },
];

export function AboutPage() {
	return (
		<main className="min-h-screen px-6 pt-44 pb-24 sm:px-12 md:px-24">
			<div className="mx-auto max-w-[1400px]">
				{/* Header */}
				<motion.div
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
						Architecting the
						<br />
						<span className="text-slate-text">Digital Frontier.</span>
					</h2>
				</motion.div>

				{/* Bio Section */}
				<div className="mb-24 grid grid-cols-1 gap-12 lg:grid-cols-12">
					<motion.div
						className="lg:col-span-7"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ ...springTransition, delay: 0.1 }}
					>
						<div className="space-y-6 text-lg leading-relaxed">
							<p>
								I&apos;m a full-stack developer with a passion for building high-precision digital
								instruments. My approach combines technical excellence with atmospheric
								design—creating experiences that feel{" "}
								<span className="text-cyber-lime">tactile, heavy, and responsive</span>.
							</p>
							<p className="text-slate-text">
								With over six years in the industry, I&apos;ve architected systems that serve
								hundreds of thousands of users, optimized performance to sub-second load times, and
								delivered products that push the boundaries of what&apos;s possible on the web.
							</p>
							<p className="text-slate-text">
								I reject generic solutions and cookie-cutter templates. Every project is an
								opportunity to craft something exceptional—something that stands apart from the
								noise of the modern web.
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
								Available for Projects
							</div>
							<div className="text-slate-text flex items-center gap-2 font-mono text-sm">
								<Globe className="text-cyber-lime h-4 w-4" strokeWidth={1.5} />
								English / Spanish
							</div>
						</div>
					</motion.div>

					{/* Stats */}
					<motion.div
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
								Stats
							</h3>

							<div className="grid grid-cols-2 gap-6">
								{stats.map((stat) => (
									<div key={stat.label}>
										<div className="mb-1 font-mono text-3xl tracking-tight">
											{stat.value}
											<span className="text-cyber-lime">{stat.suffix}</span>
										</div>
										<div className="text-slate-text text-sm">{stat.label}</div>
									</div>
								))}
							</div>
						</div>
					</motion.div>
				</div>

				{/* Skills Section */}
				<motion.section
					className="mb-24"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={springTransition}
				>
					<h2 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
						<span className="mr-2 animate-pulse">●</span>
						Tech Stack
					</h2>

					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
						{skills.map((skill, index) => (
							<motion.div
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
							</motion.div>
						))}
					</div>
				</motion.section>

				{/* Timeline Section */}
				<motion.section
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
								<motion.div
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
										<p className="text-slate-text text-sm">{item.description}</p>
									</div>
								</motion.div>
							))}
						</div>
					</div>
				</motion.section>
			</div>
		</main>
	);
}
