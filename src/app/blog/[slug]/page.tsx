import { notFound } from "next/navigation";

import { blog } from "@/../.source/server";
import { BlogArticle } from "@/components/blog/blog-article";
import { mdxComponents } from "@/components/mdx/mdx-components";
import {
	ArticleJsonLd,
	BreadcrumbJsonLd,
	FaqJsonLd,
	RelatedBlogPostsSection,
} from "@/components/seo";

import { hubFaqs } from "./hub-faqs";

import type { Metadata } from "next";

const siteUrl = "https://alexmayhew.dev";

interface PageProps {
	params: Promise<{ slug: string }>;
}

// Extract slug from file path
function getSlug(path: string): string {
	return path.replace(/^\//, "").replace(/\.mdx$/, "");
}

// Content frontmatter stores readingTime as e.g. "13 min read". Article
// schema needs an integer count of minutes, so pull the leading digits.
function parseReadingMinutes(raw: string | undefined): number | undefined {
	if (!raw) return undefined;
	const digits = /\d+/.exec(raw);
	if (!digits) return undefined;
	const minutes = Number.parseInt(digits[0], 10);
	return Number.isFinite(minutes) && minutes > 0 ? minutes : undefined;
}

export const dynamicParams = false;

export function generateStaticParams() {
	return blog.filter((post) => !post.draft).map((post) => ({ slug: getSlug(post.info.path) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const post = blog.find((p) => getSlug(p.info.path) === slug);
	if (!post) return {};

	const ogImage = `/og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.description || "")}&category=${encodeURIComponent(post.category || "Blog")}`;

	return {
		title: post.title,
		description: post.description,
		authors: [{ name: "Alex Mayhew", url: siteUrl }],
		openGraph: {
			title: post.title,
			description: post.description,
			type: "article",
			publishedTime: post.publishedAt.toISOString(),
			modifiedTime: post.updatedAt.toISOString(),
			authors: ["Alex Mayhew"],
			section: post.category,
			tags: post.tags,
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
					alt: post.title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: post.title,
			description: post.description,
			images: [ogImage],
			creator: "@alexmayhewdev",
		},
		alternates: {
			canonical: `/blog/${slug}`,
			types: {
				"application/rss+xml": `${siteUrl}/feed.xml`,
			},
		},
	};
}

export default async function BlogArticlePage({ params }: PageProps) {
	const { slug } = await params;
	const post = blog.find((p) => getSlug(p.info.path) === slug);
	if (!post || post.draft) notFound();

	const MDX = post.body;

	const postData = {
		slug,
		data: {
			title: post.title,
			description: post.description,
			publishedAt: post.publishedAt,
			updatedAt: post.updatedAt,
			readingTime: post.readingTime,
			category: post.category,
			tags: post.tags,
			image: post.image,
			isHub: post.isHub,
			series: post.series,
		},
	};

	// Build hub-and-spoke related posts.
	// Hub posts: surface ALL spokes in the series.
	// Spoke posts: surface the hub first, then up to 5 sibling spokes (total <= 6).
	const relatedSlugs: string[] = (() => {
		if (!post.series) return [];
		const seriesPeers = blog
			.filter((p) => !p.draft && p.series === post.series && getSlug(p.info.path) !== slug)
			.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

		if (post.isHub) {
			return seriesPeers.map((p) => getSlug(p.info.path));
		}

		const hub = seriesPeers.find((p) => p.isHub);
		const spokes = seriesPeers.filter((p) => !p.isHub).slice(0, 5);
		const ordered = hub ? [hub, ...spokes] : spokes;
		return ordered.map((p) => getSlug(p.info.path));
	})();

	const faqs = hubFaqs[slug];

	return (
		<>
			<ArticleJsonLd
				title={post.title}
				description={post.description}
				publishedAt={post.publishedAt}
				updatedAt={post.updatedAt}
				image={post.image}
				slug={`blog/${slug}`}
				category={post.category}
				tags={post.tags}
				isHub={post.isHub}
				readingTime={parseReadingMinutes(post.readingTime)}
			/>
			<BreadcrumbJsonLd
				items={[
					{ name: "Home", url: "/" },
					{ name: "Blog", url: "/blog" },
					{ name: post.title, url: `/blog/${slug}` },
				]}
			/>
			{faqs && <FaqJsonLd faqs={faqs} />}
			<BlogArticle
				post={postData}
				relatedSection={
					relatedSlugs.length > 0 ? <RelatedBlogPostsSection slugs={relatedSlugs} /> : null
				}
			>
				<MDX components={mdxComponents} />
			</BlogArticle>
		</>
	);
}
