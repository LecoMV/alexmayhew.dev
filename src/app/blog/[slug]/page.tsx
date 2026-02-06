import { blog } from "@/../.source/server";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/blog/blog-article";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo";
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

export function generateStaticParams() {
	return blog.map((post) => ({ slug: getSlug(post.info.path) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const post = blog.find((p) => getSlug(p.info.path) === slug);
	if (!post) return {};

	const ogImage = post.image ? `${siteUrl}${post.image}` : `${siteUrl}/og-image.png`;

	return {
		title: `${post.title} | Alex Mayhew`,
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

	// Create data object for BlogArticle component
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

	const faqs = hubFaqs[slug];

	return (
		<>
			<ArticleJsonLd
				title={post.title}
				description={post.description}
				publishedAt={post.publishedAt}
				updatedAt={post.updatedAt}
				image={post.image}
				slug={slug}
				category={post.category}
				tags={post.tags}
				isHub={post.isHub}
			/>
			<BreadcrumbJsonLd
				items={[
					{ name: "Home", url: "/" },
					{ name: "Blog", url: "/blog" },
					{ name: post.title, url: `/blog/${slug}` },
				]}
			/>
			{faqs && <FaqJsonLd faqs={faqs} />}
			<BlogArticle post={postData}>
				<MDX components={mdxComponents} />
			</BlogArticle>
		</>
	);
}
