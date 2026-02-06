import { blog } from "@/../.source/server";

function getSlug(path: string): string {
	return path.replace(/^\//, "").replace(/\.mdx$/, "");
}

export function GET() {
	const publishedPosts = blog
		.filter((post) => !post.draft)
		.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

	const hubs = publishedPosts.filter((post) => post.isHub);
	const spokes = publishedPosts.filter((post) => !post.isHub);

	const hubLines = hubs
		.map(
			(post) =>
				`- [${post.title}](https://alexmayhew.dev/blog/${getSlug(post.info.path)}): ${post.description}`
		)
		.join("\n");

	const spokeLines = spokes
		.slice(0, 20)
		.map(
			(post) =>
				`- [${post.title}](https://alexmayhew.dev/blog/${getSlug(post.info.path)}): ${post.description}`
		)
		.join("\n");

	const content = `# alexmayhew.dev

> Technical advisory and engineering leadership insights by Alex Mayhew.

## About

Alex Mayhew is a Technical Advisor who helps CTOs and startup founders avoid costly architecture mistakes. Content covers SaaS architecture, engineering leadership, frontend architecture, performance engineering, and AI-assisted development. All insights come from direct advisory experience with 30+ startups.

## Comprehensive Guides (Hub Posts)

${hubLines}

## Recent Articles

${spokeLines}

## Key Services

- [Technical Advisory](https://alexmayhew.dev/services): Strategic architecture guidance for startups
- [Technologies](https://alexmayhew.dev/technologies): Technology-specific expertise
- [Tools](https://alexmayhew.dev/tools): Free engineering tools (TraceForge, Pilot)

## Contact

- Website: https://alexmayhew.dev
- Contact: https://alexmayhew.dev/contact
- LinkedIn: https://linkedin.com/in/alexmayhew
- X/Twitter: https://x.com/alexmayhewdev
`;

	return new Response(content, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=86400",
		},
	});
}
