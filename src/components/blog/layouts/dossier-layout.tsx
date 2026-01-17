"use client";

import { m } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useBlogTheme } from "@/lib/blog-themes";
import type { Post } from "../types";

interface DossierLayoutProps {
	posts: Post[];
}

// Generate file ID from post date: AM-YYYY-NNN
function getFileId(post: Post, index: number): string {
	const year = post.data.publishedAt.getFullYear();
	return `AM-${year}-${String(index + 1).padStart(3, "0")}`;
}

export function DossierLayout({ posts }: DossierLayoutProps) {
	const { theme, springTransition } = useBlogTheme();

	return (
		<div className="space-y-6">
			{/* Header Bar */}
			<div
				className="flex items-center justify-between border-b pb-4 font-mono text-xs"
				style={{ borderColor: theme.colors.border }}
			>
				<span style={{ color: theme.colors.accent }}>
					{theme.typography.headingPrefix} DOCUMENT INDEX
				</span>
				<span style={{ color: theme.colors.textMuted }}>CLEARANCE: LEVEL 5</span>
			</div>

			{/* Dossier Cards */}
			<div className="space-y-4">
				{posts.map((post, index) => (
					<m.div
						key={post.slug}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ ...springTransition, delay: index * 0.08 }}
					>
						<Link href={`/blog/${post.slug}`} className="group relative block">
							{/* File Container */}
							<div
								className="border transition-colors duration-300"
								style={{
									backgroundColor: theme.colors.surface,
									borderColor: theme.colors.border,
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.borderColor = theme.colors.borderHover;
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.borderColor = theme.colors.border;
								}}
							>
								{/* File Tab */}
								<div
									className="flex items-center justify-between border-b px-4 py-2 font-mono text-xs"
									style={{ borderColor: theme.colors.border }}
								>
									<span style={{ color: theme.colors.textMuted }}>
										FILE: {getFileId(post, index)}
									</span>
									<span
										className="px-2 py-0.5"
										style={{
											backgroundColor: theme.colors.accentFaint,
											color: theme.colors.accent,
										}}
									>
										{post.data.publishedAt.toLocaleDateString("en-US", theme.typography.dateFormat)}
									</span>
								</div>

								<div className="flex">
									{/* Image Panel */}
									{theme.layout.showImages && post.data.image && (
										<div className="relative hidden h-40 w-48 flex-shrink-0 overflow-hidden md:block">
											<Image
												src={post.data.image}
												alt={post.data.title}
												fill
												className="object-cover transition-transform duration-500 group-hover:scale-105"
												sizes="192px"
											/>
											<div
												className="absolute inset-0"
												style={{
													background: `linear-gradient(to right, transparent, ${theme.colors.surface})`,
												}}
											/>
										</div>
									)}

									{/* Content Panel */}
									<div className="flex-1 p-4">
										{/* Subject Line */}
										<div
											className="mb-2 font-mono text-xs"
											style={{ color: theme.colors.textMuted }}
										>
											SUBJECT:
										</div>
										<h3
											className="mb-2 text-lg font-medium tracking-tight transition-colors"
											style={{ color: theme.colors.text }}
										>
											{post.data.title}
										</h3>

										{/* Classification */}
										<div className="mb-3 font-mono text-xs" style={{ color: theme.colors.accent }}>
											CLASS: {theme.typography.categoryFormat(post.data.category)}
										</div>

										{/* Brief */}
										<p
											className="line-clamp-2 text-sm leading-relaxed"
											style={{ color: theme.colors.textMuted }}
										>
											{post.data.description}
										</p>
									</div>
								</div>

								{/* Corner Accents */}
								<div
									className="absolute top-0 left-0 h-3 w-3 border-t border-l transition-opacity duration-300"
									style={{ borderColor: theme.colors.accent, opacity: 0 }}
								/>
								<div
									className="absolute right-0 bottom-0 h-3 w-3 border-r border-b transition-opacity duration-300"
									style={{ borderColor: theme.colors.accent, opacity: 0 }}
								/>
							</div>

							{/* Hover accent corners */}
							<div
								className="absolute -top-px -left-px h-4 w-4 border-t-2 border-l-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
								style={{ borderColor: theme.colors.accent }}
							/>
							<div
								className="absolute -right-px -bottom-px h-4 w-4 border-r-2 border-b-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
								style={{ borderColor: theme.colors.accent }}
							/>
						</Link>
					</m.div>
				))}
			</div>

			{/* Footer */}
			<div
				className="flex items-center justify-between border-t pt-4 font-mono text-xs"
				style={{ borderColor: theme.colors.border, color: theme.colors.textMuted }}
			>
				<span>{posts.length} DOCUMENTS RETRIEVED</span>
				<span>{theme.typography.headingPrefix} END OF INDEX</span>
			</div>
		</div>
	);
}
