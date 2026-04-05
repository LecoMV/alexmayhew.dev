import { blog } from "@/../.source/server";
import { BlogList } from "@/components/blog/blog-list";
import { JsonLdScript, SCHEMA_CONTEXT, SITE_URL } from "@/components/seo/schema-utils";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Blog",
	description:
		"Technical articles on engineering, architecture, and modern web development patterns.",
	openGraph: {
		title: "Blog",
		description: "Technical articles on engineering, architecture, and modern web development.",
		type: "website",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Alex Mayhew - Blog",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Blog",
		description: "Technical articles on engineering, architecture, and modern web development.",
		images: ["/og-image.png"],
	},
	alternates: {
		canonical: "/blog",
		types: {
			"application/rss+xml": "/blog/rss.xml",
		},
	},
};

// Extract slug from file path (e.g., "hello-world" from "/hello-world")
function getSlug(path: string): string {
	return path.replace(/^\//, "").replace(/\.mdx$/, "");
}

function BlogCollectionJsonLd({
	posts,
}: {
	posts: Array<{ slug: string; data: { title: string } }>;
}) {
	const schema = {
		"@context": SCHEMA_CONTEXT,
		"@type": "CollectionPage",
		"@id": `${SITE_URL}/blog`,
		url: `${SITE_URL}/blog`,
		name: "Blog",
		description:
			"Technical articles on engineering, architecture, and modern web development patterns.",
		mainEntity: {
			"@type": "ItemList",
			numberOfItems: posts.length,
			itemListElement: posts.map((post, index) => ({
				"@type": "ListItem",
				position: index + 1,
				url: `${SITE_URL}/blog/${post.slug}`,
				name: post.data.title,
			})),
		},
	};
	return <JsonLdScript data={schema} />;
}

export default function BlogPage() {
	// Frontmatter is spread at top level of entry, file info is in entry.info
	const allPosts = blog
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
				isHub: post.isHub,
				series: post.series,
			},
		}));

	// Separate hub posts for featured section
	const hubPosts = allPosts.filter((post) => post.data.isHub);
	const posts = allPosts.filter((post) => !post.data.isHub);

	return (
		<>
			<BlogCollectionJsonLd posts={allPosts} />
			<BlogList posts={posts} hubPosts={hubPosts} />
			<BlogPostNav posts={allPosts} />
		</>
	);
}

/**
 * Server-rendered navigation with links to ALL blog posts.
 * Ensures Googlebot can discover every post from the listing page
 * without needing to click the client-side "Load More" button.
 */
function BlogPostNav({ posts }: { posts: Array<{ slug: string; data: { title: string } }> }) {
	return (
		<nav
			aria-label="All blog posts"
			className="mx-auto max-w-[1400px] border-t border-white/10 px-6 py-12 sm:px-12 md:px-24"
		>
			<h2 className="text-cyber-lime mb-6 font-mono text-xs tracking-wider uppercase">
				<span className="mr-2 animate-pulse">●</span>
				All Articles
			</h2>
			<ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
				{posts.map((post) => (
					<li key={post.slug}>
						<a
							href={`/blog/${post.slug}`}
							className="text-slate-text hover:text-cyber-lime block truncate font-mono text-xs transition-colors"
						>
							{post.data.title}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}
