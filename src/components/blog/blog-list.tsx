"use client";

import { m } from "framer-motion";
import { useBlogTheme } from "@/lib/blog-themes";
import { CardsLayout, TerminalLayout, DossierLayout } from "./layouts";
import type { Post } from "./types";

interface BlogListProps {
	posts: Post[];
}

export function BlogList({ posts }: BlogListProps) {
	const { theme, springTransition } = useBlogTheme();

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
				</m.div>

				{/* Posts - rendered by selected layout */}
				<LayoutComponent posts={posts} />

				{/* Empty State */}
				{posts.length === 0 && (
					<m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center">
						<p className="font-mono text-sm" style={{ color: theme.colors.textMuted }}>
							No articles published yet. Check back soon.
						</p>
					</m.div>
				)}
			</div>
		</main>
	);
}
