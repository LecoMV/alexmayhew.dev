import { blog } from "@/../.source/server";
import { BlogList } from "@/components/blog/blog-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Blog | Alex Mayhew",
	description:
		"Technical articles on engineering, architecture, and modern web development patterns.",
	openGraph: {
		title: "Blog | Alex Mayhew",
		description: "Technical articles on engineering, architecture, and modern web development.",
		type: "website",
	},
};

// Extract slug from file path (e.g., "hello-world" from "/hello-world")
function getSlug(path: string): string {
	return path.replace(/^\//, "").replace(/\.mdx$/, "");
}

export default function BlogPage() {
	// Frontmatter is spread at top level of entry, file info is in entry.info
	const posts = blog
		.filter((post) => !post.draft)
		.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
		.map((post) => ({
			slug: getSlug(post.info.path),
			data: {
				title: post.title,
				description: post.description,
				publishedAt: post.publishedAt,
				category: post.category,
				tags: post.tags,
				image: post.image,
			},
		}));

	return <BlogList posts={posts} />;
}
