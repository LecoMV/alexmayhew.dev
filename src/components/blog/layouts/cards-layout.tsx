"use client";

import { m } from "framer-motion";
import { ArrowUpRight, Calendar, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useBlogTheme } from "@/lib/blog-themes";

import type { Post } from "../types";

interface CardsLayoutProps {
	posts: Post[];
}

export function CardsLayout({ posts }: CardsLayoutProps) {
	if (posts.length === 0) return null;

	// Split posts into sections for magazine layout
	const heroPost = posts[0];
	const secondaryPosts = posts.slice(1, 3);
	const gridPosts = posts.slice(3);

	return (
		<div className="space-y-6">
			{/* Hero Article */}
			<HeroCard post={heroPost} index={0} />

			{/* Secondary Row - 60/40 split */}
			{secondaryPosts.length > 0 && (
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
					{secondaryPosts[0] && (
						<div className="lg:col-span-3">
							<SecondaryCard post={secondaryPosts[0]} index={1} />
						</div>
					)}
					{secondaryPosts[1] && (
						<div className="lg:col-span-2">
							<SecondaryCard post={secondaryPosts[1]} index={2} />
						</div>
					)}
				</div>
			)}

			{/* Compact Grid - 3 columns */}
			{gridPosts.length > 0 && (
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{gridPosts.map((post, idx) => (
						<CompactCard key={post.slug} post={post} index={idx + 3} />
					))}
				</div>
			)}
		</div>
	);
}

// Hero Card - Large featured article
function HeroCard({ post, index }: { post: Post; index: number }) {
	const { theme, springTransition } = useBlogTheme();

	return (
		<m.article
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ ...springTransition, delay: index * 0.1 }}
			className="group"
		>
			<Link
				href={`/blog/${post.slug}`}
				className="relative block overflow-hidden backdrop-blur-sm transition-colors duration-300"
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
				{/* Corner accents - always visible on hero */}
				<div
					className="absolute top-0 right-0 z-10 h-6 w-6 border-t-2 border-r-2"
					style={{ borderColor: theme.colors.accent }}
				/>
				<div
					className="absolute bottom-0 left-0 z-10 h-6 w-6 border-b-2 border-l-2"
					style={{ borderColor: theme.colors.accent }}
				/>

				<div className="flex flex-col lg:flex-row">
					{/* Large Featured Image - 16:9 aspect ratio preserved */}
					{theme.layout.showImages && post.data.image && (
						<div className="relative aspect-[16/9] w-full flex-shrink-0 overflow-hidden lg:aspect-auto lg:h-auto lg:min-h-[320px] lg:w-1/2">
							<Image
								src={post.data.image}
								alt={post.data.title}
								fill
								className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
								sizes="(max-width: 1024px) 100vw, 50vw"
								priority
							/>
							<div
								className="absolute inset-0"
								style={{
									background: `linear-gradient(to right, transparent 70%, ${theme.colors.surface})`,
								}}
							/>
						</div>
					)}

					<div className="flex flex-1 flex-col justify-center gap-4 p-8 lg:p-10">
						{/* Featured badge */}
						<span
							className="w-fit border px-3 py-1 font-mono text-[10px] tracking-wider uppercase"
							style={{
								borderColor: theme.colors.accent,
								color: theme.colors.accent,
							}}
						>
							Featured
						</span>

						{/* Meta */}
						<div
							className="flex flex-wrap items-center gap-4 font-mono text-xs"
							style={{ color: theme.colors.textMuted }}
						>
							<span className="flex items-center gap-1">
								<Calendar className="h-3 w-3" strokeWidth={1.5} />
								{post.data.publishedAt.toLocaleDateString("en-US", theme.typography.dateFormat)}
							</span>
							<span style={{ color: theme.colors.accentMuted }}>
								{theme.typography.categoryFormat(post.data.category)}
							</span>
						</div>

						{/* Title */}
						<h3
							className="font-mono text-2xl tracking-tight transition-colors md:text-3xl lg:text-4xl"
							style={{ color: theme.colors.text }}
						>
							{post.data.title}
						</h3>

						{/* Description */}
						<p
							className="text-base leading-relaxed lg:text-lg"
							style={{ color: theme.colors.textMuted }}
						>
							{post.data.description}
						</p>

						{/* Tags */}
						{theme.layout.showTags && (
							<div className="flex flex-wrap gap-2">
								{post.data.tags.slice(0, 4).map((tag) => (
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

						{/* Read more */}
						<div className="mt-2 flex items-center gap-2">
							<span
								className="font-mono text-sm transition-colors"
								style={{ color: theme.colors.accent }}
							>
								Read Article
							</span>
							<ArrowUpRight
								className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
								style={{ color: theme.colors.accent }}
								strokeWidth={1.5}
							/>
						</div>
					</div>
				</div>
			</Link>
		</m.article>
	);
}

// Secondary Card - Medium size for second row
function SecondaryCard({ post, index }: { post: Post; index: number }) {
	const { theme, springTransition } = useBlogTheme();

	return (
		<m.article
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ ...springTransition, delay: index * 0.1 }}
			className="group h-full"
		>
			<Link
				href={`/blog/${post.slug}`}
				className="relative flex h-full flex-col overflow-hidden backdrop-blur-sm transition-colors duration-300"
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
					className="absolute top-0 right-0 z-10 h-4 w-4 border-t border-r opacity-0 transition-opacity duration-300 group-hover:opacity-100"
					style={{ borderColor: theme.colors.accent }}
				/>
				<div
					className="absolute bottom-0 left-0 z-10 h-4 w-4 border-b border-l opacity-0 transition-opacity duration-300 group-hover:opacity-100"
					style={{ borderColor: theme.colors.accent }}
				/>

				{/* Image - preserve aspect ratio */}
				{theme.layout.showImages && post.data.image && (
					<div className="relative aspect-[16/9] w-full flex-shrink-0 overflow-hidden">
						<Image
							src={post.data.image}
							alt={post.data.title}
							fill
							className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
							sizes="(max-width: 1024px) 100vw, 40vw"
						/>
						<div
							className="absolute inset-0"
							style={{
								background: `linear-gradient(to top, ${theme.colors.surface}, transparent 50%)`,
							}}
						/>
					</div>
				)}

				<div className="flex flex-1 flex-col justify-between gap-3 p-5">
					{/* Meta */}
					<div>
						<div
							className="mb-2 flex flex-wrap items-center gap-3 font-mono text-xs"
							style={{ color: theme.colors.textMuted }}
						>
							<span className="flex items-center gap-1">
								<Calendar className="h-3 w-3" strokeWidth={1.5} />
								{post.data.publishedAt.toLocaleDateString("en-US", theme.typography.dateFormat)}
							</span>
							<span style={{ color: theme.colors.accentMuted }}>
								{theme.typography.categoryFormat(post.data.category)}
							</span>
						</div>

						{/* Title */}
						<h3
							className="mb-2 font-mono text-lg tracking-tight transition-colors md:text-xl"
							style={{ color: theme.colors.text }}
						>
							{post.data.title}
						</h3>

						{/* Description - truncated */}
						<p
							className="line-clamp-2 text-sm leading-relaxed"
							style={{ color: theme.colors.textMuted }}
						>
							{post.data.description}
						</p>
					</div>

					{/* Arrow */}
					<div className="flex items-center justify-end">
						<ArrowUpRight
							className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
							style={{ color: theme.colors.textMuted }}
							strokeWidth={1.5}
						/>
					</div>
				</div>
			</Link>
		</m.article>
	);
}

// Compact Card - Small cards for grid
function CompactCard({ post, index }: { post: Post; index: number }) {
	const { theme, springTransition } = useBlogTheme();

	return (
		<m.article
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ ...springTransition, delay: index * 0.05 }}
			className="group"
		>
			<Link
				href={`/blog/${post.slug}`}
				className="relative flex h-full flex-col overflow-hidden backdrop-blur-sm transition-colors duration-300"
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
					className="absolute top-0 right-0 z-10 h-3 w-3 border-t border-r opacity-0 transition-opacity duration-300 group-hover:opacity-100"
					style={{ borderColor: theme.colors.accent }}
				/>
				<div
					className="absolute bottom-0 left-0 z-10 h-3 w-3 border-b border-l opacity-0 transition-opacity duration-300 group-hover:opacity-100"
					style={{ borderColor: theme.colors.accent }}
				/>

				{/* Compact Image - preserve aspect ratio */}
				{theme.layout.showImages && post.data.image && (
					<div className="relative aspect-[16/9] w-full flex-shrink-0 overflow-hidden">
						<Image
							src={post.data.image}
							alt={post.data.title}
							fill
							className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
							sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
						/>
						<div
							className="absolute inset-0"
							style={{
								background: `linear-gradient(to top, ${theme.colors.surface}, transparent 40%)`,
							}}
						/>
					</div>
				)}

				<div className="flex flex-1 flex-col justify-between gap-2 p-4">
					{/* Meta - minimal */}
					<div>
						<div
							className="mb-2 flex items-center gap-2 font-mono text-[10px]"
							style={{ color: theme.colors.textMuted }}
						>
							<span>
								{post.data.publishedAt.toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								})}
							</span>
							<span style={{ color: theme.colors.accentMuted }}>{theme.typography.listMarker}</span>
							<span style={{ color: theme.colors.accentMuted }}>{post.data.category}</span>
						</div>

						{/* Title */}
						<h3
							className="font-mono text-sm leading-tight tracking-tight transition-colors"
							style={{ color: theme.colors.text }}
						>
							{post.data.title}
						</h3>
					</div>

					{/* Arrow */}
					<div className="flex items-center justify-end">
						<ArrowUpRight
							className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
							style={{ color: theme.colors.textMuted }}
							strokeWidth={1.5}
						/>
					</div>
				</div>
			</Link>
		</m.article>
	);
}
