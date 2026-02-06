import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/api/", "/keystatic/", "/demo/"],
			},
			// OpenAI crawlers
			{
				userAgent: "GPTBot",
				allow: "/",
			},
			{
				userAgent: "OAI-SearchBot",
				allow: "/",
			},
			{
				userAgent: "ChatGPT-User",
				allow: "/",
			},
			// Anthropic crawlers
			{
				userAgent: "ClaudeBot",
				allow: "/",
			},
			{
				userAgent: "Claude-SearchBot",
				allow: "/",
			},
			// Google AI crawlers
			{
				userAgent: "Google-Extended",
				allow: "/",
			},
			{
				userAgent: "GoogleOther",
				allow: "/",
			},
			// Perplexity crawlers
			{
				userAgent: "PerplexityBot",
				allow: "/",
			},
			{
				userAgent: "Perplexity-User",
				allow: "/",
			},
			// Other AI crawlers
			{
				userAgent: "CCBot",
				allow: "/",
			},
			{
				userAgent: "Meta-ExternalAgent",
				allow: "/",
			},
			{
				userAgent: "AI2Bot",
				allow: "/",
			},
			{
				userAgent: "Applebot-Extended",
				allow: "/",
			},
		],
		sitemap: "https://alexmayhew.dev/sitemap.xml",
	};
}
