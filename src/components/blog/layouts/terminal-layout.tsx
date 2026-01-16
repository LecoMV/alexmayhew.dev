"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useBlogTheme } from "@/lib/blog-themes";
import type { Post } from "../types";

interface TerminalLayoutProps {
	posts: Post[];
}

export function TerminalLayout({ posts }: TerminalLayoutProps) {
	const { theme, springTransition } = useBlogTheme();

	return (
		<div
			className="overflow-hidden border font-mono"
			style={{
				backgroundColor: theme.colors.surface,
				borderColor: theme.colors.border,
			}}
		>
			{/* Terminal Header */}
			<div
				className="flex items-center gap-2 border-b px-4 py-3"
				style={{ borderColor: theme.colors.border }}
			>
				<div className="flex gap-1.5">
					<div className="h-3 w-3 rounded-full bg-red-500/60" />
					<div className="h-3 w-3 rounded-full bg-yellow-500/60" />
					<div className="h-3 w-3 rounded-full bg-green-500/60" />
				</div>
				<span className="ml-2 text-xs" style={{ color: theme.colors.textMuted }}>
					{theme.typography.headingPrefix} blog --list
				</span>
			</div>

			{/* Posts List */}
			<div className="divide-y" style={{ borderColor: theme.colors.border }}>
				{posts.map((post, index) => (
					<motion.div
						key={post.slug}
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ ...springTransition, delay: index * 0.05 }}
					>
						<Link
							href={`/blog/${post.slug}`}
							className="group block px-4 py-4 transition-colors duration-200"
							style={{ backgroundColor: "transparent" }}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = theme.colors.accentFaint;
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = "transparent";
							}}
						>
							<div className="flex items-start gap-4">
								{/* Index Number */}
								<span
									className="flex-shrink-0 text-sm tabular-nums"
									style={{ color: theme.colors.accent }}
								>
									{theme.layout.indexPrefix?.(index) ?? String(index + 1).padStart(3, "0")}
								</span>

								<div className="min-w-0 flex-1">
									{/* Category + Date */}
									<div
										className="mb-1 flex items-center gap-3 text-xs"
										style={{ color: theme.colors.textMuted }}
									>
										<span style={{ color: theme.colors.accent }}>
											{theme.typography.categoryFormat(post.data.category)}
										</span>
										<span>
											{post.data.publishedAt.toLocaleDateString(
												"en-US",
												theme.typography.dateFormat
											)}
										</span>
									</div>

									{/* Title */}
									<h3
										className="mb-1 text-sm font-medium tracking-tight transition-colors"
										style={{ color: theme.colors.text }}
									>
										{post.data.title}
									</h3>

									{/* Description */}
									<p
										className="truncate text-xs leading-relaxed"
										style={{ color: theme.colors.textMuted }}
									>
										{theme.typography.listMarker} {post.data.description}
									</p>
								</div>

								{/* Hover indicator */}
								<span
									className="flex-shrink-0 text-sm opacity-0 transition-opacity group-hover:opacity-100"
									style={{ color: theme.colors.accent }}
								>
									{theme.typography.listMarker}
								</span>
							</div>
						</Link>
					</motion.div>
				))}
			</div>

			{/* Terminal Footer */}
			<div className="border-t px-4 py-2" style={{ borderColor: theme.colors.border }}>
				<span className="text-xs" style={{ color: theme.colors.textMuted }}>
					{posts.length} entries | {theme.typography.headingPrefix} _
					<span className="animate-pulse">|</span>
				</span>
			</div>
		</div>
	);
}
