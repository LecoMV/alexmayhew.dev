import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/api/", "/keystatic/", "/demo/"],
			},
			{
				userAgent: "PerplexityBot",
				allow: "/",
			},
			{
				userAgent: "ChatGPT-User",
				allow: "/",
			},
			{
				userAgent: "Claude-Web",
				allow: "/",
			},
			{
				userAgent: "Google-Extended",
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
