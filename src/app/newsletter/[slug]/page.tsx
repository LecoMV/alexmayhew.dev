import { newsletter } from "@/../.source/server";
import { notFound } from "next/navigation";
import { NewsletterSignup } from "@/components/newsletter";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo";
import { mdxComponents } from "@/components/mdx/mdx-components";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
	params: Promise<{ slug: string }>;
}

function getSlug(path: string): string {
	return path.replace(/^\//, "").replace(/\.mdx$/, "");
}

export function generateStaticParams() {
	return newsletter.map((issue) => ({ slug: getSlug(issue.info.path) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const issue = newsletter.find((i) => getSlug(i.info.path) === slug);
	if (!issue) return {};

	return {
		title: `${issue.title} | The Architect's Brief | Alex Mayhew`,
		description: issue.subject,
		openGraph: {
			title: issue.title,
			description: issue.subject,
			type: "article",
			publishedTime: issue.publishedAt.toISOString(),
		},
	};
}

export default async function NewsletterIssuePage({ params }: PageProps) {
	const { slug } = await params;
	const issue = newsletter.find((i) => getSlug(i.info.path) === slug);
	if (!issue) notFound();

	const MDX = issue.body;

	return (
		<>
			<ArticleJsonLd
				title={issue.title}
				description={issue.subject}
				publishedAt={issue.publishedAt}
				slug={`newsletter/${slug}`}
				category={issue.pillar || "architecture"}
			/>
			<BreadcrumbJsonLd
				items={[
					{ name: "Home", url: "/" },
					{ name: "Newsletter", url: "/newsletter" },
					{ name: issue.title, url: `/newsletter/${slug}` },
				]}
			/>
			<main className="min-h-screen px-6 pt-44 pb-24 sm:px-12 md:px-24">
				<div className="mx-auto max-w-[700px]">
					<Link
						href="/newsletter"
						className="text-slate-text hover:text-cyber-lime group mb-8 inline-flex items-center gap-2 font-mono text-sm transition-colors"
					>
						<ArrowLeft
							className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
							strokeWidth={1.5}
						/>
						All Issues
					</Link>

					<header className="mb-12">
						<p className="text-cyber-lime mb-2 font-mono text-xs tracking-wider uppercase">
							The Architect&apos;s Brief &mdash; Issue #{issue.issue}
						</p>
						<h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">{issue.title}</h1>
						<time
							className="text-slate-text font-mono text-xs"
							dateTime={issue.publishedAt.toISOString()}
						>
							{issue.publishedAt.toLocaleDateString("en-US", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</time>
					</header>

					<div className="mb-12 h-px bg-white/10" />

					<article className="prose-void">
						<MDX components={mdxComponents} />
					</article>

					<div className="mt-16">
						<NewsletterSignup variant="inline" source="newsletter-issue" />
					</div>
				</div>
			</main>
		</>
	);
}
