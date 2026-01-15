import { blog } from "@/../.source/server";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/blog/blog-article";
import { mdxComponents } from "@/components/mdx/mdx-components";
import type { Metadata } from "next";

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

	return {
		title: `${post.title} | Alex Mayhew`,
		description: post.description,
		openGraph: {
			title: post.title,
			description: post.description,
			type: "article",
			publishedTime: post.publishedAt.toISOString(),
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
			category: post.category,
			tags: post.tags,
		},
	};

	return (
		<BlogArticle post={postData}>
			<MDX components={mdxComponents} />
		</BlogArticle>
	);
}
