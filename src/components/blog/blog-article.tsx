"use client";

import { ReactNode, useEffect, useState } from "react";
import { m } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Tag, ArrowRight } from "lucide-react";
import { useBlogTheme } from "@/lib/blog-themes";
import { ShareButtons } from "./share-buttons";
import { NewsletterSignup } from "@/components/newsletter";
import { useContentAnalytics } from "@/lib/hooks/use-content-analytics";
import { trackCTAClick } from "@/components/analytics";
import type { Post } from "./types";

const seriesTopics: Record<string, string> = {
	"saas-architecture": "SaaS architecture",
	"SaaS Architecture": "SaaS architecture",
	"engineering-leadership": "engineering leadership",
	"frontend-architecture": "frontend architecture",
	"Frontend Architecture": "frontend architecture",
	"performance-engineering": "performance",
	"ai-development": "AI-assisted development",
};

interface BlogArticleProps {
	post: Post;
	children: ReactNode;
}

export function BlogArticle({ post, children }: BlogArticleProps) {
	const { theme, springTransition } = useBlogTheme();
	const [articleUrl, setArticleUrl] = useState("");

	// Track content analytics for blog posts
	useContentAnalytics({
		contentId: post.slug,
		contentType: "blog_post",
		contentCategory: post.data.category || "technical",
	});

	useEffect(() => {
		setArticleUrl(window.location.href);
	}, []);

	return (
		<main
			className="min-h-screen px-6 pt-44 pb-24 sm:px-12 md:px-24"
			style={{ backgroundColor: theme.colors.background }}
		>
			<div className="mx-auto max-w-[900px]">
				{/* Back Link */}
				<m.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={springTransition}
				>
					<Link
						href="/blog"
						className="group mb-8 inline-flex items-center gap-2 font-mono text-sm transition-colors"
						style={{ color: theme.colors.textMuted }}
						onMouseEnter={(e) => {
							e.currentTarget.style.color = theme.colors.accent;
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.color = theme.colors.textMuted;
						}}
					>
						<ArrowLeft
							className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
							strokeWidth={1.5}
						/>
						Back to Articles
					</Link>
				</m.div>

				{/* Header */}
				<m.header
					className="mb-12"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ ...springTransition, delay: 0.1 }}
				>
					<div
						className="mb-4 flex flex-wrap items-center gap-4 font-mono text-xs"
						style={{ color: theme.colors.textMuted }}
					>
						<span className="flex items-center gap-1">
							<Calendar className="h-3 w-3" strokeWidth={1.5} />
							{post.data.publishedAt.toLocaleDateString("en-US", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</span>
						<span style={{ color: theme.colors.accent }}>
							{theme.typography.categoryFormat(post.data.category)}
						</span>
					</div>

					<h1
						className="mb-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
						style={{ color: theme.colors.text }}
					>
						{post.data.title}
					</h1>

					<p className="text-lg leading-relaxed" style={{ color: theme.colors.textMuted }}>
						{post.data.description}
					</p>

					{/* Tags */}
					{theme.layout.showTags && (
						<div className="mt-6 flex flex-wrap gap-2">
							{post.data.tags.map((tag) => (
								<span
									key={tag}
									className="flex items-center gap-1 border px-3 py-1 font-mono text-xs"
									style={{
										borderColor: theme.colors.borderHover,
										backgroundColor: theme.colors.accentFaint,
										color: theme.colors.text,
									}}
								>
									<Tag className="h-2.5 w-2.5" strokeWidth={1.5} />
									{tag}
								</span>
							))}
						</div>
					)}
				</m.header>

				{/* Featured Image */}
				{post.data.image && (
					<m.div
						className="relative mb-12 aspect-video w-full overflow-hidden border"
						style={{ borderColor: theme.colors.border }}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ ...springTransition, delay: 0.2 }}
					>
						<Image
							src={post.data.image}
							alt={post.data.title}
							fill
							className="object-cover"
							sizes="(max-width: 900px) 100vw, 900px"
							priority
						/>
						{/* Corner accents */}
						<div
							className="absolute top-0 right-0 h-6 w-6 border-t-2 border-r-2"
							style={{ borderColor: theme.colors.accent }}
						/>
						<div
							className="absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2"
							style={{ borderColor: theme.colors.accent }}
						/>
					</m.div>
				)}

				{/* Divider */}
				<m.div
					className="mb-12 h-px"
					style={{ backgroundColor: theme.colors.border }}
					initial={{ scaleX: 0 }}
					animate={{ scaleX: 1 }}
					transition={{ ...springTransition, delay: 0.15 }}
				/>

				{/* Content */}
				<m.article
					className="prose-void"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.2, delay: 0.05 }}
				>
					{children}
				</m.article>

				{/* Newsletter Signup */}
				<m.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ ...springTransition, delay: 0.4 }}
				>
					<NewsletterSignup variant="inline" source={`blog-${post.slug}`} />
				</m.div>

				{/* Consultation CTA — secondary to newsletter */}
				{!post.data.isHub && (
					<m.div
						className="mt-6 border-t border-white/10 pt-6"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ ...springTransition, delay: 0.45 }}
					>
						<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
							<p className="text-sm" style={{ color: theme.colors.textMuted }}>
								{post.data.series && seriesTopics[post.data.series]
									? `Need help with ${seriesTopics[post.data.series]}?`
									: "Need expert guidance on a technical challenge?"}
							</p>
							<Link
								href="/contact"
								onClick={() =>
									trackCTAClick("schedule_consultation", {
										cta_location: "blog_post_secondary",
									})
								}
								className="group inline-flex items-center gap-2 font-mono text-xs transition-colors"
								style={{ color: theme.colors.textMuted }}
								onMouseEnter={(e) => {
									e.currentTarget.style.color = theme.colors.accent;
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.color = theme.colors.textMuted;
								}}
							>
								Let&apos;s talk strategy
								<ArrowRight
									className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
									strokeWidth={1.5}
								/>
							</Link>
						</div>
					</m.div>
				)}

				{/* Share Buttons */}
				{articleUrl && (
					<m.div
						className="mt-8"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ ...springTransition, delay: 0.5 }}
					>
						<ShareButtons
							title={post.data.title}
							url={articleUrl}
							description={post.data.description}
						/>
					</m.div>
				)}
			</div>
		</main>
	);
}
