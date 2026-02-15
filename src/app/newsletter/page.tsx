import Link from "next/link";

import { newsletter } from "@/../.source/server";
import { NewsletterSignup } from "@/components/newsletter";

import type { Metadata } from "next";

const siteUrl = "https://alexmayhew.dev";

export const metadata: Metadata = {
	title: "The Architect's Brief | Alex Mayhew",
	description:
		"Weekly newsletter on SaaS architecture decisions, engineering leadership, and technical strategy. Real patterns from advising startups at $0-$10M ARR.",
	openGraph: {
		title: "The Architect's Brief",
		description:
			"Weekly newsletter on SaaS architecture decisions, engineering leadership, and technical strategy.",
		url: `${siteUrl}/newsletter`,
		type: "website",
	},
	alternates: {
		types: {
			"application/rss+xml": `${siteUrl}/feed.xml`,
		},
	},
};

function getSlug(path: string): string {
	return path.replace(/^\//, "").replace(/\.mdx$/, "");
}

export default function NewsletterArchivePage() {
	const issues = newsletter
		.sort((a, b) => b.issue - a.issue)
		.map((issue) => ({
			slug: getSlug(issue.info.path),
			issue: issue.issue,
			title: issue.title,
			subject: issue.subject,
			publishedAt: issue.publishedAt,
			pillar: issue.pillar,
		}));

	return (
		<main className="min-h-dvh px-6 pt-44 pb-24 sm:px-12 md:px-24">
			<div className="mx-auto max-w-[900px]">
				<header className="mb-16">
					<h1 className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
						<span className="mr-2 animate-pulse" aria-hidden="true">
							●
						</span>
						Newsletter Archive
					</h1>
					<h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
						The Architect&apos;s
						<br />
						<span className="text-slate-text">Brief.</span>
					</h2>
					<p className="text-slate-text max-w-2xl text-lg">
						Weekly decisions on SaaS architecture, engineering leadership, and technical strategy.
						Real patterns from advising startups at $0-$10M ARR.
					</p>
				</header>

				<NewsletterSignup variant="inline" source="newsletter-archive" />

				<div className="mt-16 space-y-1">
					{issues.map((issue) => (
						<Link
							key={issue.slug}
							href={`/newsletter/${issue.slug}`}
							className="group flex items-baseline justify-between border-b border-white/10 py-4 transition-colors hover:border-white/20"
						>
							<div className="min-w-0 flex-1">
								<span className="text-slate-text mr-3 font-mono text-xs">#{issue.issue}</span>
								<span className="group-hover:text-cyber-lime text-mist-white transition-colors">
									{issue.title}
								</span>
							</div>
							<time
								className="text-slate-text ml-4 shrink-0 font-mono text-xs"
								dateTime={issue.publishedAt.toISOString()}
							>
								{issue.publishedAt.toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
									year: "numeric",
								})}
							</time>
						</Link>
					))}
				</div>

				{issues.length === 0 && (
					<p className="text-slate-text mt-8 text-center font-mono text-sm">
						First issue coming soon. Subscribe above to get it delivered.
					</p>
				)}
			</div>
		</main>
	);
}
