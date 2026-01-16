"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Calendar, Tag } from "lucide-react";
import { useBlogTheme } from "@/lib/blog-themes";
import type { Post } from "../types";

interface CardsLayoutProps {
	posts: Post[];
}

export function CardsLayout({ posts }: CardsLayoutProps) {
	const { theme, springTransition } = useBlogTheme();

	return (
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
						className="relative block backdrop-blur-sm transition-colors duration-300"
						style={{
							backgroundColor: theme.colors.surface,
							borderWidth: 1,
							borderStyle: "solid",
							borderColor: theme.colors.border,
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.borderColor = theme.colors.borderHover;
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.borderColor = theme.colors.border;
						}}
					>
						{/* Corner accents */}
						<div
							className="absolute top-0 right-0 h-4 w-4 border-t border-r opacity-0 transition-opacity duration-300 group-hover:opacity-100"
							style={{ borderColor: theme.colors.accent }}
						/>
						<div
							className="absolute bottom-0 left-0 h-4 w-4 border-b border-l opacity-0 transition-opacity duration-300 group-hover:opacity-100"
							style={{ borderColor: theme.colors.accent }}
						/>

						<div className="flex flex-col lg:flex-row">
							{/* Featured Image */}
							{theme.layout.showImages && post.data.image && (
								<div className="relative h-48 w-full flex-shrink-0 overflow-hidden lg:h-auto lg:w-72">
									<Image
										src={post.data.image}
										alt={post.data.title}
										fill
										className="object-cover transition-transform duration-500 group-hover:scale-105"
										sizes="(max-width: 1024px) 100vw, 288px"
									/>
									<div
										className="absolute inset-0 bg-gradient-to-r to-transparent lg:from-transparent lg:via-transparent"
										style={{
											background: `linear-gradient(to right, ${theme.colors.background}80, transparent)`,
										}}
									/>
								</div>
							)}

							<div className="flex flex-1 flex-col justify-between gap-4 p-6 md:flex-row md:items-start">
								<div className="flex-1">
									{/* Meta */}
									<div
										className="mb-3 flex flex-wrap items-center gap-4 font-mono text-xs"
										style={{ color: theme.colors.textMuted }}
									>
										<span className="flex items-center gap-1">
											<Calendar className="h-3 w-3" strokeWidth={1.5} />
											{post.data.publishedAt.toLocaleDateString(
												"en-US",
												theme.typography.dateFormat
											)}
										</span>
										<span style={{ color: theme.colors.accentMuted }}>
											{theme.typography.categoryFormat(post.data.category)}
										</span>
									</div>

									{/* Title */}
									<h3
										className="mb-2 font-mono text-xl tracking-tight transition-colors md:text-2xl"
										style={{ color: theme.colors.text }}
										onMouseEnter={(e) => {
											e.currentTarget.style.color = theme.colors.accent;
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.color = theme.colors.text;
										}}
									>
										{post.data.title}
									</h3>

									{/* Description */}
									<p
										className="mb-4 text-sm leading-relaxed"
										style={{ color: theme.colors.textMuted }}
									>
										{post.data.description}
									</p>

									{/* Tags */}
									{theme.layout.showTags && (
										<div className="flex flex-wrap gap-2">
											{post.data.tags.map((tag) => (
												<span
													key={tag}
													className="flex items-center gap-1 px-2 py-1 font-mono text-xs"
													style={{
														backgroundColor: theme.colors.accentFaint,
														color: theme.colors.textMuted,
													}}
												>
													<Tag className="h-2.5 w-2.5" strokeWidth={1.5} />
													{tag}
												</span>
											))}
										</div>
									)}
								</div>

								{/* Arrow */}
								<ArrowUpRight
									className="h-5 w-5 flex-shrink-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
									style={{ color: theme.colors.textMuted }}
									strokeWidth={1.5}
								/>
							</div>
						</div>
					</Link>
				</motion.article>
			))}
		</div>
	);
}
