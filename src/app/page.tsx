"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Terminal, Layers, Zap } from "lucide-react";
import { NewsletterSignup } from "@/components/newsletter";
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
			staggerChildren: 0.1,
			delayChildren: 0.2,
		},
	},
};

const fadeInUp = {
	hidden: { opacity: 0, y: 30 },
	visible: {
		opacity: 1,
		y: 0,
		transition: springTransition,
	},
};

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

export default function Home() {
	return (
		<>
			{/* Hero Section */}
			<main className="flex min-h-screen flex-col justify-center px-6 pt-36 pb-12 sm:px-12 md:px-24">
				<div className="mx-auto grid w-full max-w-[1400px] grid-cols-12 gap-6">
					{/* Text Content */}
					<m.section
						className="col-span-12 flex flex-col justify-center gap-8 md:col-span-7 md:col-start-2 lg:col-span-6"
						variants={staggerContainer}
						initial="hidden"
						animate="visible"
					>
						<m.div className="flex flex-col gap-2" variants={fadeInUp}>
							<p className="text-cyber-lime mb-2 font-mono text-xs tracking-wider uppercase sm:text-sm">
								<span className="mr-2 animate-pulse">●</span>
								Technical Advisor
							</p>
							<h1 className="text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
								Strategic
								<br />
								<span className="text-slate-text">Architecture.</span>
							</h1>
						</m.div>

						<m.div className="my-4 h-px w-full bg-white/10" variants={fadeInUp} />

						<m.p
							className="text-slate-text max-w-xl text-lg leading-relaxed font-normal sm:text-xl"
							variants={fadeInUp}
						>
							I architect production systems that scale from MVP to millions. When your tech
							decisions have business consequences, you need strategic guidance—not just code.
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
									transition={{ duration: 0.3 }}
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
							<div className="border-cyber-lime absolute top-0 right-0 h-3 w-3 border-t border-r" />
							<div className="border-cyber-lime absolute bottom-0 left-0 h-3 w-3 border-b border-l" />

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
									precision: <span className="text-purple-400">0.9999</span>,
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

						<div className="absolute right-0 -bottom-12 origin-right translate-x-full rotate-90 transform font-mono text-[10px] tracking-[0.2em] text-white/10 uppercase">
							Sector 09 / Visual
						</div>
					</m.div>
				</div>
			</main>

			{/* Services Section */}
			<section className="border-t border-white/10 px-6 py-24 sm:px-12 md:px-24">
				<div className="mx-auto max-w-[1400px]">
					<m.div
						className="mb-12"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={springTransition}
					>
						<h2 className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
							<span className="mr-2 animate-pulse">●</span>
							Services
						</h2>
						<p className="text-slate-text max-w-2xl text-lg">
							Specialized capabilities engineered for digital excellence.
						</p>
					</m.div>

					<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
						{services.map((service, index) => (
							<m.article
								key={service.title}
								className="group bg-gunmetal-glass/10 hover:border-cyber-lime/50 relative border border-white/10 p-6 backdrop-blur-sm transition-colors duration-300"
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-50px" }}
								transition={{ ...springTransition, delay: index * 0.1 }}
							>
								{/* Corner accents */}
								<div className="border-cyber-lime absolute top-0 right-0 h-3 w-3 border-t border-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
								<div className="border-cyber-lime absolute bottom-0 left-0 h-3 w-3 border-b border-l opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

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
						))}
					</div>
				</div>
			</section>

			{/* Newsletter Section */}
			<section className="border-t border-white/10 px-6 py-24 sm:px-12 md:px-24">
				<m.div
					className="mx-auto max-w-[1400px]"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={springTransition}
				>
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
						<div>
							<h2 className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
								<span className="mr-2 animate-pulse">●</span>
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
					className="mx-auto max-w-[1400px]"
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
									transition={{ duration: 0.3 }}
								/>
							</Link>
						</div>
					</div>
				</m.div>
			</section>
		</>
	);
}
