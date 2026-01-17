import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/api/", "/keystatic/", "/demo/"],
			},
		],
		sitemap: "https://alexmayhew.dev/sitemap.xml",
	};
}
