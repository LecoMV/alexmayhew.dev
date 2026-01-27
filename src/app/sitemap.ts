import type { MetadataRoute } from "next";
import { blog } from "@/../.source/server";
import { getPublishedPages, getAllMigrationPages, getAllIntegrationPages } from "@/data/pseo";

const siteUrl = "https://alexmayhew.dev";

// Extract slug from file path
function getSlug(path: string): string {
	return path.replace(/^\//, "").replace(/\.mdx$/, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
	// Static pages
	const staticPages: MetadataRoute.Sitemap = [
		{
			url: siteUrl,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 1,
		},
		{
			url: `${siteUrl}/work`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.9,
		},
		{
			url: `${siteUrl}/about`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${siteUrl}/contact`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.7,
		},
		// Services hub page
		{
			url: `${siteUrl}/services`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.95,
		},
		{
			url: `${siteUrl}/blog`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${siteUrl}/docs`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.6,
		},
		// Tools pages
		{
			url: `${siteUrl}/tools`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.9,
		},
		{
			url: `${siteUrl}/tools/traceforge`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.95,
		},
		{
			url: `${siteUrl}/tools/pilot`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.9,
		},
		{
			url: `${siteUrl}/privacy`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.3,
		},
		{
			url: `${siteUrl}/terms`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.3,
		},
	];

	// Blog posts
	const blogPosts: MetadataRoute.Sitemap = blog
		.filter((post) => !post.draft)
		.map((post) => ({
			url: `${siteUrl}/blog/${getSlug(post.info.path)}`,
			lastModified: post.publishedAt,
			changeFrequency: "monthly" as const,
			priority: 0.7,
		}));

	// Service pages (pSEO)
	const servicePages: MetadataRoute.Sitemap = getPublishedPages().map((page) => ({
		url: `${siteUrl}/services/${page.slug}`,
		lastModified: page.lastUpdated ?? new Date(),
		changeFrequency: "monthly" as const,
		priority: 0.9,
	}));

	// Migration pages (Legacy Tech → Modern Tech)
	const migrationPages: MetadataRoute.Sitemap = getAllMigrationPages()
		.filter((page) => page.published)
		.map((page) => ({
			url: `${siteUrl}/services/migrations/${page.slug}`,
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.85,
		}));

	// Integration pages (SaaS A ↔ SaaS B)
	const integrationPages: MetadataRoute.Sitemap = getAllIntegrationPages()
		.filter((page) => page.published)
		.map((page) => ({
			url: `${siteUrl}/services/integrations/${page.slug}`,
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.85,
		}));

	return [...staticPages, ...blogPosts, ...servicePages, ...migrationPages, ...integrationPages];
}
