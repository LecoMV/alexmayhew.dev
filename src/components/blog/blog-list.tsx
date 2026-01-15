"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Calendar, Tag } from "lucide-react";

const springTransition = {
	type: "spring" as const,
	stiffness: 100,
	damping: 20,
	mass: 1,
};

interface Post {
	slug: string;
	data: {
		title: string;
		description: string;
		publishedAt: Date;
		category: string;
		tags: string[];
	};
}

interface BlogListProps {
	posts: Post[];
}

export function BlogList({ posts }: BlogListProps) {
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
						Technical Articles
					</h1>
					<h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
						Engineering
						<br />
						<span className="text-slate-text">& Architecture.</span>
					</h2>
					<p className="text-slate-text max-w-2xl text-lg">
						Deep dives into system design, performance optimization, and modern web development
						patterns.
					</p>
				</motion.div>

				{/* Posts Grid */}
				<div className="space-y-6">
					{posts.map((post, index) => (
						<motion.article
							key={post.slug}
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ ...springTransition, delay: index * 0.1 }}
							className="group"
						>
							<Link
								href={`/blog/${post.slug}`}
								className="bg-gunmetal-glass/10 hover:border-cyber-lime/50 relative block border border-white/10 p-6 backdrop-blur-sm transition-colors duration-300"
							>
								{/* Corner accents */}
								<div className="border-cyber-lime absolute top-0 right-0 h-4 w-4 border-t border-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
								<div className="border-cyber-lime absolute bottom-0 left-0 h-4 w-4 border-b border-l opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

								<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
									<div className="flex-1">
										{/* Meta */}
										<div className="text-slate-text mb-3 flex flex-wrap items-center gap-4 font-mono text-xs">
											<span className="flex items-center gap-1">
												<Calendar className="h-3 w-3" strokeWidth={1.5} />
												{post.data.publishedAt.toLocaleDateString("en-US", {
													year: "numeric",
													month: "short",
													day: "numeric",
												})}
											</span>
											<span className="text-cyber-lime/60">{post.data.category}</span>
										</div>

										{/* Title */}
										<h3 className="group-hover:text-cyber-lime mb-2 font-mono text-xl tracking-tight transition-colors md:text-2xl">
											{post.data.title}
										</h3>

										{/* Description */}
										<p className="text-slate-text mb-4 text-sm leading-relaxed">
											{post.data.description}
										</p>

										{/* Tags */}
										<div className="flex flex-wrap gap-2">
											{post.data.tags.map((tag) => (
												<span
													key={tag}
													className="flex items-center gap-1 bg-white/5 px-2 py-1 font-mono text-xs text-white/60"
												>
													<Tag className="h-2.5 w-2.5" strokeWidth={1.5} />
													{tag}
												</span>
											))}
										</div>
									</div>

									{/* Arrow */}
									<ArrowUpRight
										className="text-slate-text group-hover:text-cyber-lime h-5 w-5 flex-shrink-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
										strokeWidth={1.5}
									/>
								</div>
							</Link>
						</motion.article>
					))}
				</div>

				{/* Empty State */}
				{posts.length === 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="py-12 text-center"
					>
						<p className="text-slate-text font-mono text-sm">
							No articles published yet. Check back soon.
						</p>
					</motion.div>
				)}
			</div>
		</main>
	);
}
