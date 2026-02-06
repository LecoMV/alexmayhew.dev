import { blog } from "@/../.source/server";

const siteUrl = "https://alexmayhew.dev";

function getSlug(path: string): string {
	return path.replace(/^\//, "").replace(/\.mdx$/, "");
}

function escapeXml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

export function GET() {
	const posts = blog
		.filter((post) => !post.draft)
		.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

	const lastBuildDate = posts[0]?.publishedAt.toUTCString() ?? new Date().toUTCString();

	const items = posts
		.map((post) => {
			const slug = getSlug(post.info.path);
			const url = `${siteUrl}/blog/${slug}`;

			return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${post.publishedAt.toUTCString()}</pubDate>
      <category>${escapeXml(post.category)}</category>
      <author>alex@alexmayhew.dev (Alex Mayhew)</author>
    </item>`;
		})
		.join("\n");

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Alex Mayhew - Technical Advisory Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Architecture decisions, engineering leadership, and technical strategy for startup CTOs and founders. Insights from advising 30+ startups.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteUrl}/og-image.png</url>
      <title>Alex Mayhew</title>
      <link>${siteUrl}</link>
    </image>
${items}
  </channel>
</rss>`;

	return new Response(xml, {
		headers: {
			"Content-Type": "application/rss+xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
}
