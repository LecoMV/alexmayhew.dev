import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

import blogIndex from "@/data/blog-index.json";

interface BlogEntry {
	title: string;
	slug: string;
	category: string;
}

interface RelatedBlogPostsSectionProps {
	slugs: string[];
}

export function RelatedBlogPostsSection({ slugs }: RelatedBlogPostsSectionProps) {
	if (slugs.length === 0) return null;

	const posts = slugs
		.map((slug) => (blogIndex as BlogEntry[]).find((p) => p.slug === slug))
		.filter((p): p is BlogEntry => p !== undefined);

	if (posts.length === 0) return null;

	return (
		<section className="mb-20">
			<h2 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
				<span className="mr-2 animate-pulse" aria-hidden="true">
					●
				</span>
				Related Insights
			</h2>
			<div className="grid gap-3 sm:grid-cols-2">
				{posts.map((post) => (
					<Link
						key={post.slug}
						href={`/blog/${post.slug}`}
						className="group bg-gunmetal-glass/10 hover:border-cyber-lime/50 relative flex items-center gap-4 border border-white/10 p-4 transition-colors duration-300"
					>
						<BookOpen className="text-cyber-lime/60 h-5 w-5 shrink-0" strokeWidth={1.5} />
						<div className="min-w-0 flex-1">
							<p className="group-hover:text-cyber-lime truncate font-mono text-sm tracking-tight transition-colors">
								{post.title}
							</p>
							<p className="text-slate-text mt-1 text-xs capitalize">{post.category}</p>
						</div>
						<ArrowRight
							className="text-slate-text group-hover:text-cyber-lime h-4 w-4 shrink-0 transition-colors"
							strokeWidth={1.5}
						/>
					</Link>
				))}
			</div>
		</section>
	);
}
