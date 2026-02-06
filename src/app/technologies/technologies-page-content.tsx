"use client";

import { m } from "framer-motion";
import Link from "next/link";
import {
	Code2,
	ArrowRight,
	Database,
	Server,
	Brain,
	Cloud,
	FileCode,
	Workflow,
	Layers,
} from "lucide-react";
import { technologies, getTechnologyIds } from "@/data/pseo/technologies";
import { trackCTAClick } from "@/components/analytics";

const springTransition = {
	type: "spring" as const,
	stiffness: 100,
	damping: 20,
	mass: 1,
};

// Map technology IDs to icons
const technologyIcons: Record<
	string,
	React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
	"react-nextjs": Layers,
	"python-fastapi": Server,
	"nodejs-express": Server,
	postgresql: Database,
	"ai-ml-integration": Brain,
	"cloud-architecture": Cloud,
	typescript: FileCode,
	graphql: Workflow,
};

export function TechnologiesPageContent() {
	const techIds = getTechnologyIds();

	return (
		<main className="min-h-dvh px-6 pt-44 pb-24 sm:px-12 md:px-24">
			<div className="mx-auto max-w-[1400px]">
				{/* Hero Section */}
				<m.section
					className="mb-20"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={springTransition}
				>
					<div className="mb-6 flex items-center gap-4">
						<Code2 className="text-cyber-lime h-8 w-8" strokeWidth={1.5} />
						<h1 className="text-cyber-lime font-mono text-xs tracking-wider uppercase">
							<span className="mr-2 animate-pulse">●</span>
							Technology Expertise
						</h1>
					</div>

					<h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
						Deep expertise in
						<br />
						<span className="text-slate-text">modern technologies.</span>
					</h2>

					<p className="text-slate-text max-w-3xl text-lg leading-relaxed">
						Production experience across the full stack—from React and Next.js on the frontend to
						PostgreSQL and Python on the backend. I don&apos;t just use these technologies; I
						understand their internals, trade-offs, and when each one is the right choice.
					</p>
				</m.section>

				{/* Technologies Grid */}
				<m.section
					className="mb-20"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ ...springTransition, delay: 0.1 }}
				>
					<h3 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
						<span className="mr-2">●</span>
						Core Technologies
					</h3>

					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{techIds.map((techId, index) => {
							const tech = technologies[techId];
							const Icon = technologyIcons[techId] || Code2;

							return (
								<m.div
									key={techId}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ ...springTransition, delay: 0.15 + index * 0.05 }}
								>
									<Link
										href={`/technologies/${techId}`}
										className="bg-gunmetal-glass/20 group relative flex h-full flex-col border border-white/10 p-6 transition-colors hover:border-white/20"
									>
										<div className="border-cyber-lime absolute top-0 right-0 h-3 w-3 border-t border-r opacity-0 transition-opacity group-hover:opacity-100" />
										<div className="border-cyber-lime absolute bottom-0 left-0 h-3 w-3 border-b border-l opacity-0 transition-opacity group-hover:opacity-100" />

										<div className="mb-4 flex items-center gap-3">
											<Icon className="text-cyber-lime h-6 w-6" strokeWidth={1.5} />
											<h4 className="text-mist-white group-hover:text-cyber-lime font-mono text-sm transition-colors">
												{tech.displayName}
											</h4>
										</div>

										<p className="text-slate-text mb-4 flex-grow text-xs leading-relaxed">
											{tech.expertiseLevel.slice(0, 150)}...
										</p>

										<div className="mb-4 flex flex-wrap gap-1">
											{tech.targetKeywords.slice(0, 3).map((keyword) => (
												<span
													key={keyword}
													className="bg-gunmetal-glass/50 text-slate-text px-2 py-0.5 font-mono text-[10px]"
												>
													{keyword}
												</span>
											))}
										</div>

										<div className="text-cyber-lime flex items-center gap-2 font-mono text-xs opacity-0 transition-opacity group-hover:opacity-100">
											EXPLORE()
											<ArrowRight className="h-3 w-3" />
										</div>
									</Link>
								</m.div>
							);
						})}
					</div>
				</m.section>

				{/* Stats Section */}
				<m.section
					className="mb-20"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ ...springTransition, delay: 0.3 }}
				>
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{[
							{ label: "Years of Experience", value: "10+" },
							{ label: "Technologies Mastered", value: "8" },
							{ label: "Projects Delivered", value: "50+" },
							{ label: "Lines of Production Code", value: "1M+" },
						].map((stat, index) => (
							<m.div
								key={stat.label}
								className="bg-gunmetal-glass/10 border border-white/10 p-6 text-center"
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ ...springTransition, delay: 0.35 + index * 0.05 }}
							>
								<div className="text-cyber-lime mb-2 font-mono text-3xl font-bold">
									{stat.value}
								</div>
								<div className="text-slate-text font-mono text-xs tracking-wider uppercase">
									{stat.label}
								</div>
							</m.div>
						))}
					</div>
				</m.section>

				{/* CTA Section */}
				<m.section
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ ...springTransition, delay: 0.4 }}
				>
					<div className="bg-gunmetal-glass/20 relative border border-white/10 p-8 text-center backdrop-blur-sm md:p-12">
						<div className="border-cyber-lime absolute top-0 right-0 h-6 w-6 border-t border-r" />
						<div className="border-cyber-lime absolute bottom-0 left-0 h-6 w-6 border-b border-l" />

						<h3 className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
							<span className="mr-2">●</span>
							Have a Project in Mind?
						</h3>

						<h4 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
							Let&apos;s discuss your
							<br />
							<span className="text-cyber-lime">technology needs.</span>
						</h4>

						<p className="text-slate-text mx-auto mb-8 max-w-2xl">
							Whether you&apos;re choosing a tech stack, migrating systems, or need architectural
							guidance, I can help you make decisions that scale.
						</p>

						<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
							<Link
								href="/contact"
								onClick={() =>
									trackCTAClick("start_conversation", { cta_location: "technologies_hub_cta" })
								}
								className="group hover:border-cyber-lime relative inline-flex items-center gap-3 border border-white/20 px-8 py-4 transition-colors duration-300"
							>
								<span className="group-hover:text-cyber-lime font-mono text-sm tracking-tight transition-colors">
									START_CONVERSATION()
								</span>
								<ArrowRight
									className="text-slate-text group-hover:text-cyber-lime h-4 w-4 transition-colors duration-300"
									strokeWidth={1.5}
								/>
								<m.div
									className="bg-cyber-lime/5 absolute inset-0"
									initial={{ opacity: 0 }}
									whileHover={{ opacity: 1 }}
									transition={{ duration: 0.3 }}
								/>
							</Link>

							<Link
								href="/services"
								className="text-slate-text hover:text-cyber-lime font-mono text-sm transition-colors"
							>
								Browse Services →
							</Link>
						</div>
					</div>
				</m.section>
			</div>
		</main>
	);
}
