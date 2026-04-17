"use client";

import { m } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, Clock, RefreshCw, Tag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

import { trackCTAClick } from "@/components/analytics";
import { NewsletterSignup } from "@/components/newsletter";
import { useBlogTheme } from "@/lib/blog-themes";
import { useContentAnalytics } from "@/lib/hooks/use-content-analytics";
import { microSpring } from "@/lib/motion-constants";

import { ReadingProgress } from "./reading-progress";
import { ShareButtons } from "./share-buttons";
import { TableOfContents } from "./table-of-contents";

import type { Post } from "./types";

const seriesTopics: Record<string, string> = {
	"saas-architecture": "SaaS architecture",
	"engineering-leadership": "engineering leadership",
	"frontend-architecture": "frontend architecture",
	"performance-engineering": "performance",
	"ai-development": "AI-assisted development",
};

interface BlogArticleProps {
	post: Post;
	children: ReactNode;
	/**
	 * Hub-and-spoke related posts block. Server-rendered in the page so it can
	 * access fumadocs' `blog` source. Rendered below the article body,
	 * above the newsletter CTA.
	 */
	relatedSection?: ReactNode;
}

export function BlogArticle({ post, children, relatedSection }: BlogArticleProps) {
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
		<>
			<ReadingProgress />
			<section className="page-layout" style={{ backgroundColor: theme.colors.background }}>
				<div className="max-w-article mx-auto">
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

					{/* Grid: Content + TOC sidebar */}
					<div className="grid grid-cols-1 gap-12 xl:grid-cols-[1fr_280px]">
						{/* Main Content Column */}
						<div className="min-w-0">
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
											timeZone: "UTC",
										})}
									</span>
									{post.data.readingTime && (
										<span className="flex items-center gap-1">
											<Clock className="h-3 w-3" strokeWidth={1.5} />
											{post.data.readingTime}
										</span>
									)}
									<span style={{ color: theme.colors.accent }}>
										{theme.typography.categoryFormat(post.data.category)}
									</span>
									{post.data.updatedAt &&
										post.data.updatedAt.getTime() !== post.data.publishedAt.getTime() && (
											<span
												className="flex items-center gap-1 border px-2 py-0.5"
												style={{
													borderColor: theme.colors.accent,
													color: theme.colors.accent,
												}}
											>
												<RefreshCw className="h-3 w-3" strokeWidth={1.5} />
												Updated{" "}
												{post.data.updatedAt.toLocaleDateString("en-US", {
													month: "short",
													day: "numeric",
													year: "numeric",
													timeZone: "UTC",
												})}
											</span>
										)}
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

								{/* Author byline ... E-E-A-T signal for AI/search extraction.
								    TODO: swap User icon for an optimized headshot at /images/alex-headshot.webp
								    once the asset ships. Avatar path currently placeholder. */}
								<div
									className="mt-8 flex items-center gap-3 border-t border-b py-4"
									style={{ borderColor: theme.colors.border }}
								>
									<div
										className="flex h-10 w-10 shrink-0 items-center justify-center border"
										style={{
											borderColor: theme.colors.borderHover,
											backgroundColor: theme.colors.accentFaint,
										}}
										aria-hidden="true"
									>
										<User
											className="h-5 w-5"
											strokeWidth={1.5}
											style={{ color: theme.colors.accent }}
										/>
									</div>
									<div className="flex flex-col">
										<span className="text-sm font-medium" style={{ color: theme.colors.text }}>
											By Alex Mayhew
										</span>
										<span className="font-mono text-xs" style={{ color: theme.colors.textMuted }}>
											{post.data.publishedAt.toLocaleDateString("en-US", {
												year: "numeric",
												month: "long",
												day: "numeric",
												timeZone: "UTC",
											})}
											{post.data.readingTime ? ` · ${post.data.readingTime}` : ""}
										</span>
									</div>
								</div>

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
									style={{
										borderColor: theme.colors.border,
										viewTransitionName: `blog-image-${post.slug}`,
									}}
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

							{/* Mobile TOC */}
							<TableOfContents />

							{/* Content */}
							<m.article
								className="prose-void"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ ...microSpring, delay: 0.05 }}
							>
								{children}
							</m.article>

							{/* Hub-and-spoke related posts ... rendered before newsletter + share */}
							{relatedSection && <div className="mt-16">{relatedSection}</div>}

							{/* Newsletter Signup */}
							<m.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ ...springTransition, delay: 0.4 }}
							>
								<NewsletterSignup variant="inline" source={`blog-${post.slug}`} />
							</m.div>

							{/* Consultation CTA ... secondary to newsletter */}
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

						{/* TOC Sidebar (desktop only) */}
						<aside className="hidden xl:block">
							<TableOfContents variant="desktop" />
						</aside>
					</div>
				</div>
			</section>
		</>
	);
}
