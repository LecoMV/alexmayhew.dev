"use client";

import { useState, useMemo } from "react";
import { m } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useBlogTheme } from "@/lib/blog-themes";
import { trackEvent } from "@/components/analytics";
import { CardsLayout, TerminalLayout, DossierLayout } from "./layouts";
import type { Post } from "./types";

const CATEGORIES = ["all", "architecture", "business", "frontend", "infrastructure"] as const;
type Category = (typeof CATEGORIES)[number];

const CATEGORY_LABELS: Record<Category, string> = {
	all: "All Posts",
	architecture: "Architecture",
	business: "Business",
	frontend: "Frontend",
	infrastructure: "Infrastructure",
};

interface BlogListProps {
	posts: Post[];
	hubPosts?: Post[];
}

export function BlogList({ posts, hubPosts = [] }: BlogListProps) {
	const { theme, springTransition } = useBlogTheme();
	const [activeCategory, setActiveCategory] = useState<Category>("all");

	// Calculate post counts per category
	const categoryCounts = useMemo(() => {
		const counts: Record<Category, number> = {
			all: posts.length,
			architecture: 0,
			business: 0,
			frontend: 0,
			infrastructure: 0,
		};
		posts.forEach((post) => {
			const category = post.data.category as Category;
			if (category && category in counts) {
				counts[category]++;
			}
		});
		return counts;
	}, [posts]);

	// Filter posts by active category
	const filteredPosts = useMemo(() => {
		if (activeCategory === "all") return posts;
		return posts.filter((post) => post.data.category === activeCategory);
	}, [posts, activeCategory]);

	// Select layout component based on theme
	const LayoutComponent = {
		cards: CardsLayout,
		"terminal-list": TerminalLayout,
		dossier: DossierLayout,
	}[theme.layout.variant];

	return (
		<main
			className="min-h-screen px-6 pt-44 pb-24 sm:px-12 md:px-24"
			style={{ backgroundColor: theme.colors.background }}
		>
			<div className="mx-auto max-w-[1400px]">
				{/* Header */}
				<m.div
					className="mb-16"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={springTransition}
				>
					<h1
						className="mb-4 font-mono text-xs tracking-wider uppercase"
						style={{ color: theme.colors.accent }}
					>
						<span className="mr-2 animate-pulse">{theme.typography.headingPrefix}</span>
						Technical Articles
					</h1>
					<h2
						className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
						style={{ color: theme.colors.text }}
					>
						Engineering
						<br />
						<span style={{ color: theme.colors.textMuted }}>&amp; Architecture.</span>
					</h2>
					<p className="max-w-2xl text-lg" style={{ color: theme.colors.textMuted }}>
						Deep dives into system design, performance optimization, and modern web development
						patterns.
					</p>

					{/* Featured Guides Section */}
					{hubPosts.length > 0 && (
						<div className="mt-12">
							<h3
								className="mb-4 font-mono text-xs tracking-wider uppercase"
								style={{ color: theme.colors.accent }}
							>
								<span className="mr-2">◆</span>
								Comprehensive Guides
							</h3>
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
								{hubPosts.map((hub, index) => (
									<m.div
										key={hub.slug}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ ...springTransition, delay: index * 0.05 }}
									>
										<Link
											href={`/blog/${hub.slug}`}
											className="group hover:border-opacity-50 block overflow-hidden border transition-all duration-300"
											style={{
												backgroundColor: theme.colors.surface,
												borderColor: theme.colors.border,
											}}
										>
											{hub.data.image && (
												<div className="relative aspect-video overflow-hidden">
													<Image
														src={hub.data.image}
														alt={hub.data.title}
														fill
														className="object-cover transition-transform duration-500 group-hover:scale-105"
													/>
													<div
														className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-20"
														style={{ backgroundColor: theme.colors.accent }}
													/>
												</div>
											)}
											<div className="p-4">
												<h4
													className="mb-2 text-sm leading-tight font-semibold transition-colors duration-200 group-hover:text-[var(--accent)]"
													style={
														{
															color: theme.colors.text,
															"--accent": theme.colors.accent,
														} as React.CSSProperties
													}
												>
													{hub.data.title}
												</h4>
												<p
													className="line-clamp-2 text-xs"
													style={{ color: theme.colors.textMuted }}
												>
													{hub.data.description}
												</p>
											</div>
										</Link>
									</m.div>
								))}
							</div>
						</div>
					)}

					{/* Category Filter Tabs */}
					<div className="mt-8 flex flex-wrap gap-2">
						{CATEGORIES.map((category) => {
							const isActive = activeCategory === category;
							const count = categoryCounts[category];
							return (
								<button
									key={category}
									onClick={() => {
										setActiveCategory(category);
										trackEvent("blog_filter", { category });
									}}
									className="group relative px-4 py-2 font-mono text-xs tracking-wider uppercase transition-all duration-200"
									style={{
										backgroundColor: isActive ? theme.colors.accent : "transparent",
										color: isActive ? theme.colors.background : theme.colors.textMuted,
										border: `1px solid ${isActive ? theme.colors.accent : theme.colors.border}`,
									}}
								>
									<span className="relative z-10">
										{CATEGORY_LABELS[category]}
										<span
											className="ml-2 opacity-60"
											style={{
												color: isActive ? theme.colors.background : theme.colors.textMuted,
											}}
										>
											({count})
										</span>
									</span>
									{!isActive && (
										<span
											className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-10"
											style={{ backgroundColor: theme.colors.accent }}
										/>
									)}
								</button>
							);
						})}
					</div>
				</m.div>

				{/* Posts - rendered by selected layout */}
				<LayoutComponent posts={filteredPosts} />

				{/* Empty State */}
				{filteredPosts.length === 0 && (
					<m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center">
						<p className="font-mono text-sm" style={{ color: theme.colors.textMuted }}>
							{activeCategory === "all"
								? "No articles published yet. Check back soon."
								: `No articles in ${CATEGORY_LABELS[activeCategory]} yet.`}
						</p>
						{activeCategory !== "all" && (
							<button
								onClick={() => setActiveCategory("all")}
								className="mt-4 font-mono text-xs underline"
								style={{ color: theme.colors.accent }}
							>
								View all posts
							</button>
						)}
					</m.div>
				)}
			</div>
		</main>
	);
}
