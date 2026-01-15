"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

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

interface BlogArticleProps {
	post: Post;
	children: ReactNode;
}

export function BlogArticle({ post, children }: BlogArticleProps) {
	return (
		<main className="min-h-screen px-6 pt-44 pb-24 sm:px-12 md:px-24">
			<div className="mx-auto max-w-[900px]">
				{/* Back Link */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={springTransition}
				>
					<Link
						href="/blog"
						className="text-slate-text hover:text-cyber-lime group mb-8 inline-flex items-center gap-2 font-mono text-sm transition-colors"
					>
						<ArrowLeft
							className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
							strokeWidth={1.5}
						/>
						Back to Articles
					</Link>
				</motion.div>

				{/* Header */}
				<motion.header
					className="mb-12"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ ...springTransition, delay: 0.1 }}
				>
					<div className="text-slate-text mb-4 flex flex-wrap items-center gap-4 font-mono text-xs">
						<span className="flex items-center gap-1">
							<Calendar className="h-3 w-3" strokeWidth={1.5} />
							{post.data.publishedAt.toLocaleDateString("en-US", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</span>
						<span className="text-cyber-lime">{post.data.category}</span>
					</div>

					<h1 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
						{post.data.title}
					</h1>

					<p className="text-slate-text text-lg leading-relaxed">{post.data.description}</p>

					{/* Tags */}
					<div className="mt-6 flex flex-wrap gap-2">
						{post.data.tags.map((tag) => (
							<span
								key={tag}
								className="border-cyber-lime/30 bg-cyber-lime/5 flex items-center gap-1 border px-3 py-1 font-mono text-xs"
							>
								<Tag className="h-2.5 w-2.5" strokeWidth={1.5} />
								{tag}
							</span>
						))}
					</div>
				</motion.header>

				{/* Divider */}
				<motion.div
					className="mb-12 h-px bg-white/10"
					initial={{ scaleX: 0 }}
					animate={{ scaleX: 1 }}
					transition={{ ...springTransition, delay: 0.2 }}
				/>

				{/* Content */}
				<motion.article
					className="prose-void"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ ...springTransition, delay: 0.3 }}
				>
					{children}
				</motion.article>
			</div>
		</main>
	);
}
