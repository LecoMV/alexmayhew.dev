"use client";

import { m } from "framer-motion";
import { ArrowRight, BookOpen, Layers, Terminal, Zap } from "lucide-react";
import Link from "next/link";

import { trackCTAClick } from "@/components/analytics";
import { NewsletterSignup } from "@/components/newsletter";
import { CornerBrackets } from "@/components/ui/corner-brackets";
import { fadeInUp, gentleSpring, springTransition, staggerContainer } from "@/lib/motion-constants";

const services = [
	{
		icon: Terminal,
		title: "Full-Stack Development",
		description:
			"End-to-end web applications architected for scale, security, and long-term maintainability.",
		code: "dev.fullstack()",
	},
	{
		icon: Layers,
		title: "System Architecture",
		description: "Production systems designed to scale from MVP to millions without rewrites.",
		code: "sys.architect()",
	},
	{
		icon: Zap,
		title: "Performance Engineering",
		description: "Optimized experiences that convert users and reduce infrastructure costs.",
		code: "perf.optimize()",
	},
];

const featuredInsights = [
	{
		title: "SaaS Architecture Decision Framework",
		slug: "saas-architecture-decision-framework",
		category: "architecture",
	},
	{
		title: "Engineering Leadership: Founder to CTO",
		slug: "engineering-leadership-founder-to-cto",
		category: "business",
	},
	{
		title: "Modern Frontend Architecture Guide",
		slug: "modern-frontend-architecture",
		category: "frontend",
	},
	{
		title: "Performance Engineering Playbook",
		slug: "performance-engineering-playbook",
		category: "infrastructure",
	},
	{
		title: "AI-Assisted Development Guide",
		slug: "ai-assisted-development-guide",
		category: "architecture",
	},
];

export default function Home() {
	return (
		<>
			{/* Hero Section */}
			<section className="flex flex-1 flex-col justify-center px-6 pt-36 pb-12 sm:px-12 md:px-24">
				<div className="max-w-content mx-auto grid w-full grid-cols-12 gap-6">
					{/* Text Content */}
					<m.section
						className="col-span-12 flex flex-col justify-center gap-8 md:col-span-7 md:col-start-2 lg:col-span-6"
						variants={staggerContainer}
						initial="hidden"
						animate="visible"
					>
						<m.div className="flex flex-col gap-2" variants={fadeInUp}>
							<p className="text-cyber-lime mb-2 font-mono text-xs tracking-wider uppercase sm:text-sm">
								<span className="mr-2 animate-pulse" aria-hidden="true">
									●
								</span>
								Technology Specialist
							</p>
							<h1 className="text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
								Build. Ship.
								<br />
								<span className="text-slate-text">Maintain.</span>
							</h1>
						</m.div>

						<m.aside
							className="border-cyber-lime/40 bg-cyber-lime/5 relative border-l-2 py-3 pr-4 pl-4"
							variants={fadeInUp}
							aria-label="Availability"
						>
							<p className="text-cyber-lime mb-1 font-mono text-xs tracking-wider uppercase">
								Available for remote work
							</p>
							<p className="text-mist-white font-mono text-base leading-snug sm:text-lg">
								Part-time, contract, or full-time...{" "}
								<Link
									href="/resume"
									className="decoration-cyber-lime/60 hover:text-cyber-lime underline underline-offset-4"
								>
									resume here
								</Link>
								.
							</p>
						</m.aside>

						<m.div className="my-2 h-px w-full bg-white/10" variants={fadeInUp} />

						<m.p
							className="text-slate-text max-w-xl text-lg leading-relaxed font-normal sm:text-xl"
							variants={fadeInUp}
						>
							I make technology work for real businesses: websites, automation, applied AI, and the
							unglamorous IT in between. Nine years as the one-person tech department for a solar
							company... now building products and writing about what I learn.
						</m.p>

						<m.div className="mt-4 flex items-center gap-6" variants={fadeInUp}>
							<Link
								href="/contact"
								onClick={() => trackCTAClick("start_conversation", { cta_location: "hero" })}
								className="group hover:border-cyber-lime relative border border-white/20 px-6 py-3 transition-colors duration-300"
							>
								<span className="group-hover:text-cyber-lime font-mono text-sm tracking-tight transition-colors">
									START_CONVERSATION()
								</span>
								<m.div
									className="bg-cyber-lime/5 absolute inset-0"
									initial={{ opacity: 0 }}
									whileHover={{ opacity: 1 }}
									transition={gentleSpring}
								/>
							</Link>
							<Link
								href="/work"
								className="text-slate-text hover:text-cyber-lime group flex items-center gap-2 font-mono text-sm transition-colors duration-300"
							>
								View Work
								<ArrowRight
									className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
									strokeWidth={1.5}
								/>
							</Link>
						</m.div>
					</m.section>

					{/* Visual Element */}
					<m.div
						className="relative col-span-4 col-start-9 hidden flex-col justify-center md:flex"
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ ...springTransition, delay: 0.4 }}
					>
						<div className="bg-gunmetal-glass/20 relative aspect-square w-full border-t border-b border-l border-white/10 p-6 backdrop-blur-sm">
							<CornerBrackets />

							<div className="space-y-2 font-mono text-xs leading-5 text-white/40 select-none">
								<p>
									<span className="text-cyber-lime">const</span>{" "}
									<span className="text-white">philosophy</span> ={" "}
									<span className="text-burnt-ember">{`{`}</span>
								</p>
								<p className="pl-4">
									core: <span className="text-green-300">&quot;Atmosphere&quot;</span>,
								</p>
								<p className="pl-4">
									precision: <span className="text-signal-info">0.9999</span>,
								</p>
								<p className="pl-4">
									style: <span className="text-blue-300">&quot;Void&quot;</span>,
								</p>
								<p className="pl-4">
									user: <span className="text-white">null</span>,
								</p>
								<p>
									<span className="text-burnt-ember">{`}`}</span>;
								</p>
								<br />
								<p className="text-white/20">{`// Awaiting input sequence...`}</p>
								<m.div
									className="bg-cyber-lime mt-1 h-4 w-2"
									animate={{ opacity: [1, 0] }}
									transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
								/>
							</div>
						</div>

						<div className="text-micro absolute right-0 -bottom-12 origin-right translate-x-full rotate-90 transform font-mono tracking-[0.2em] text-white/10 uppercase">
							Sector 09 / Visual
						</div>
					</m.div>
				</div>
			</section>

			{/* Services Section */}
			<section className="border-t border-white/10 px-6 py-24 sm:px-12 md:px-24">
				<div className="max-w-content mx-auto">
					<m.div
						className="mb-12"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={springTransition}
					>
						<h2 className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
							<span className="mr-2 animate-pulse" aria-hidden="true">
								●
							</span>
							What I Do
						</h2>
						<p className="text-slate-text max-w-2xl text-lg">
							Websites, automation, applied AI, and the systems that keep a business running.
						</p>
					</m.div>

					<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
						{services.map((service, index) => (
							<Link key={service.title} href="/services">
								<m.article
									className="group bg-gunmetal-glass/10 hover:border-cyber-lime/50 relative h-full border border-white/10 p-6 backdrop-blur-sm transition-colors duration-300"
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, margin: "-50px" }}
									transition={{ ...springTransition, delay: index * 0.1 }}
								>
									{/* Corner accents */}
									<CornerBrackets hover />

									<div className="mb-4 flex items-start justify-between">
										<service.icon className="text-cyber-lime h-8 w-8" strokeWidth={1.5} />
										<span className="text-slate-text font-mono text-xs opacity-50">
											{String(index + 1).padStart(2, "0")}
										</span>
									</div>

									<h3 className="mb-2 font-mono text-lg tracking-tight">{service.title}</h3>
									<p className="text-slate-text mb-4 text-sm leading-relaxed">
										{service.description}
									</p>

									<code className="text-cyber-lime/60 font-mono text-xs">{service.code}</code>
								</m.article>
							</Link>
						))}
					</div>

					<Link
						href="/services"
						className="text-cyber-lime mt-8 inline-flex items-center gap-2 font-mono text-sm hover:underline"
					>
						View all services
						<ArrowRight className="h-4 w-4" strokeWidth={1.5} />
					</Link>
				</div>
			</section>

			{/* About Snippet */}
			<section className="border-t border-white/10 px-6 py-24 sm:px-12 md:px-24">
				<div className="max-w-content mx-auto">
					<m.div
						className="grid grid-cols-1 items-center gap-12 md:grid-cols-2"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={springTransition}
					>
						<div>
							<h2 className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
								<span className="mr-2 animate-pulse" aria-hidden="true">
									●
								</span>
								About
							</h2>
							<p className="text-mist-white mb-4 text-lg leading-relaxed">
								Nine years as the one-person tech department for a Martha&apos;s Vineyard solar
								company: designing systems, walking permits through historic boards, building the
								website and the software behind the business, and fixing whatever broke.
							</p>
							<p className="text-slate-text mb-6 text-sm leading-relaxed">
								Since then I&apos;ve built and shipped my own products, delivered a production data
								platform for a client, and kept writing about the work. Self-taught since age 14,
								and still learning in public.
							</p>
							<Link
								href="/about"
								className="text-cyber-lime inline-flex items-center gap-2 font-mono text-sm hover:underline"
							>
								Full background
								<ArrowRight className="h-4 w-4" strokeWidth={1.5} />
							</Link>
						</div>
						<div className="bg-gunmetal-glass/10 border border-white/10 p-8">
							<div className="grid grid-cols-2 gap-6">
								<div>
									<p className="text-cyber-lime font-mono text-2xl font-bold">9</p>
									<p className="text-slate-text text-sm">Years as a One-Person Tech Dept</p>
								</div>
								<div>
									<p className="text-cyber-lime font-mono text-2xl font-bold">~200</p>
									<p className="text-slate-text text-sm">Solar PV Systems Designed</p>
								</div>
								<div>
									<p className="text-cyber-lime font-mono text-2xl font-bold">70+</p>
									<p className="text-slate-text text-sm">Technical Articles Published</p>
								</div>
								<div>
									<p className="text-cyber-lime font-mono text-2xl font-bold">337x</p>
									<p className="text-slate-text text-sm">Best Shipped Performance Gain</p>
								</div>
							</div>
						</div>
					</m.div>
				</div>
			</section>

			{/* Why Work With Me Section */}
			<section className="border-t border-white/10 px-6 py-24 sm:px-12 md:px-24">
				<div className="max-w-content mx-auto">
					<m.div
						className="grid grid-cols-1 gap-12 md:grid-cols-12"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={springTransition}
					>
						<div className="md:col-span-5">
							<h2 className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
								<span className="mr-2 animate-pulse" aria-hidden="true">
									●
								</span>
								How I Work
							</h2>
							<p className="font-mono text-2xl leading-tight tracking-tight md:text-3xl">
								Small teams don&apos;t need ten specialists. They need one person who ships.
							</p>
						</div>
						<div className="md:col-span-7">
							<div className="space-y-5 text-lg leading-relaxed">
								<p className="text-mist-white">
									For nine years I was the only technical person in the room: the designer, the
									developer, the sysadmin, the marketer, and the person who fixed the printer. When
									something needed building, there was nobody to hand it to.
								</p>
								<p className="text-slate-text">
									That constraint teaches a specific discipline. Pick boring technology that works.
									Automate what repeats. Document what you build, because future-you is the
									maintenance team. Measure before you optimize.
								</p>
								<p className="text-slate-text">
									Everything on this site follows that pattern: shipped things, documented honestly,
									still running or honestly retired.
								</p>
							</div>
						</div>
					</m.div>
				</div>
			</section>

			{/* Contrarian POV Section */}
			<section className="border-t border-white/10 px-6 py-24 sm:px-12 md:px-24">
				<div className="max-w-content mx-auto">
					<m.div
						className="bg-gunmetal-glass/10 relative border border-white/10 p-8 backdrop-blur-sm md:p-12"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={springTransition}
					>
						<div className="border-cyber-lime absolute top-0 right-0 h-4 w-4 border-t border-r" />
						<div className="border-cyber-lime absolute bottom-0 left-0 h-4 w-4 border-b border-l" />

						<h2 className="text-cyber-lime mb-6 font-mono text-xs tracking-wider uppercase">
							<span className="mr-2 animate-pulse" aria-hidden="true">
								●
							</span>
							What I Believe
						</h2>
						<p className="font-mono text-2xl leading-tight tracking-tight md:text-3xl">
							Opinions formed by maintaining what I built... not by conference talks.
						</p>
						<div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
							<div>
								<p className="text-cyber-lime mb-2 font-mono text-xs tracking-wider uppercase">
									01 / Boring Wins
								</p>
								<p className="text-slate-text text-sm leading-relaxed">
									I don&apos;t fill a seat on your team. If the problem is capacity, you need a
									recruiter. If it&apos;s judgment under uncertainty, we should talk.
								</p>
							</div>
							<div>
								<p className="text-cyber-lime mb-2 font-mono text-xs tracking-wider uppercase">
									02 / Automate The Repeats
								</p>
								<p className="text-slate-text text-sm leading-relaxed">
									The third full rewrite in four years isn&apos;t a technology problem. It&apos;s a
									decision-making problem... and no architect can fix that from the code layer.
								</p>
							</div>
							<div>
								<p className="text-cyber-lime mb-2 font-mono text-xs tracking-wider uppercase">
									03 / AI Is A Tool
								</p>
								<p className="text-slate-text text-sm leading-relaxed">
									Microservices because a conference talk said so. Rust because your CTO reads
									Hacker News. I optimize for your constraints, not industry fashion.
								</p>
							</div>
						</div>
					</m.div>
				</div>
			</section>

			{/* Featured Insights Section */}
			<section className="border-t border-white/10 px-6 py-24 sm:px-12 md:px-24">
				<div className="max-w-content mx-auto">
					<m.div
						className="mb-12"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={springTransition}
					>
						<h2 className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
							<span className="mr-2 animate-pulse" aria-hidden="true">
								●
							</span>
							Featured Insights
						</h2>
						<p className="text-slate-text max-w-2xl text-lg">
							Deep-dive guides on the decisions that define your architecture.
						</p>
					</m.div>

					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{featuredInsights.map((post, index) => (
							<m.div
								key={post.slug}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-50px" }}
								transition={{ ...springTransition, delay: index * 0.08 }}
							>
								<Link
									href={`/blog/${post.slug}`}
									className="group bg-gunmetal-glass/10 hover:border-cyber-lime/50 relative flex flex-col gap-3 border border-white/10 p-5 transition-colors duration-300"
								>
									<div className="border-cyber-lime absolute top-0 right-0 h-3 w-3 border-t border-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
									<div className="flex items-center gap-2">
										<BookOpen className="text-cyber-lime/60 h-4 w-4" strokeWidth={1.5} />
										<span className="text-slate-text font-mono text-xs capitalize">
											{post.category}
										</span>
									</div>
									<h3 className="group-hover:text-cyber-lime font-mono text-sm leading-snug tracking-tight transition-colors">
										{post.title}
									</h3>
								</Link>
							</m.div>
						))}
					</div>

					<Link
						href="/blog"
						className="text-cyber-lime mt-8 inline-flex items-center gap-2 font-mono text-sm hover:underline"
					>
						View all articles
						<ArrowRight className="h-4 w-4" strokeWidth={1.5} />
					</Link>
				</div>
			</section>

			{/* Newsletter Section */}
			<section className="border-t border-white/10 px-6 py-24 sm:px-12 md:px-24">
				<m.div
					className="max-w-content mx-auto"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={springTransition}
				>
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
						<div>
							<h2 className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
								<span className="mr-2 animate-pulse" aria-hidden="true">
									●
								</span>
								The Architect&apos;s Brief
							</h2>
							<p className="mb-2 font-mono text-2xl tracking-tight md:text-3xl">
								Weekly technical insights
							</p>
							<p className="text-slate-text max-w-md text-lg">
								One actionable architectural decision, pattern, or lesson every Tuesday. No fluff,
								just substance from real production systems.
							</p>
						</div>
						<div className="md:max-w-md md:justify-self-end">
							<NewsletterSignup variant="card" source="homepage" showDescription={false} />
						</div>
					</div>
				</m.div>
			</section>

			{/* CTA Section */}
			<section className="border-t border-white/10 px-6 py-24 sm:px-12 md:px-24">
				<m.div
					className="max-w-content mx-auto"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={springTransition}
				>
					<div className="bg-gunmetal-glass/20 relative border border-white/10 p-8 backdrop-blur-sm md:p-12">
						<div className="border-cyber-lime absolute top-0 right-0 h-4 w-4 border-t border-r" />
						<div className="border-cyber-lime absolute bottom-0 left-0 h-4 w-4 border-b border-l" />

						<div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
							<div>
								<h2 className="mb-2 font-mono text-2xl tracking-tight md:text-3xl">
									Ready to architect something exceptional?
								</h2>
								<p className="text-slate-text max-w-xl">
									Partner with me to transform your vision into enterprise-grade digital reality.
								</p>
							</div>

							<Link
								href="/contact"
								onClick={() =>
									trackCTAClick("initiate_partnership", { cta_location: "bottom_cta" })
								}
								className="group hover:border-cyber-lime relative flex items-center gap-3 border border-white/20 px-6 py-4 transition-colors duration-300"
							>
								<span className="group-hover:text-cyber-lime font-mono text-sm tracking-tight transition-colors">
									INITIATE_PARTNERSHIP()
								</span>
								<ArrowRight
									className="text-slate-text group-hover:text-cyber-lime h-4 w-4 transition-all duration-300 group-hover:translate-x-1"
									strokeWidth={1.5}
								/>
								<m.div
									className="bg-cyber-lime/5 absolute inset-0"
									initial={{ opacity: 0 }}
									whileHover={{ opacity: 1 }}
									transition={gentleSpring}
								/>
							</Link>
						</div>
					</div>
				</m.div>
			</section>
		</>
	);
}
