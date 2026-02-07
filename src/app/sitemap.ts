import type { MetadataRoute } from "next";
import { blog, newsletter } from "@/../.source/server";
import {
	getPublishedPages,
	getAllMigrationPages,
	getAllIntegrationPages,
	getAllComparisonPages,
} from "@/data/pseo";
import { getTechnologyIds } from "@/data/pseo/technologies";
import { getPublishedRolePages } from "@/data/roles";
import { getCaseStudyProjects } from "@/data/projects";

const siteUrl = "https://alexmayhew.dev";

// Extract slug from file path
function getSlug(path: string): string {
	return path.replace(/^\//, "").replace(/\.mdx$/, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
	// Static pages — use fixed dates to avoid Google distrust of constantly-changing lastmod
	const siteLastUpdated = new Date("2026-02-06");

	const staticPages: MetadataRoute.Sitemap = [
		{
			url: siteUrl,
			lastModified: siteLastUpdated,
			changeFrequency: "monthly",
			priority: 1,
		},
		{
			url: `${siteUrl}/work`,
			lastModified: siteLastUpdated,
			changeFrequency: "monthly",
			priority: 0.9,
		},
		{
			url: `${siteUrl}/about`,
			lastModified: siteLastUpdated,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${siteUrl}/contact`,
			lastModified: siteLastUpdated,
			changeFrequency: "yearly",
			priority: 0.7,
		},
		// Services hub page
		{
			url: `${siteUrl}/services`,
			lastModified: siteLastUpdated,
			changeFrequency: "monthly",
			priority: 0.95,
		},
		{
			url: `${siteUrl}/blog`,
			lastModified: siteLastUpdated,
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${siteUrl}/docs`,
			lastModified: siteLastUpdated,
			changeFrequency: "monthly",
			priority: 0.6,
		},
		// Tools pages
		{
			url: `${siteUrl}/tools`,
			lastModified: siteLastUpdated,
			changeFrequency: "monthly",
			priority: 0.9,
		},
		{
			url: `${siteUrl}/tools/traceforge`,
			lastModified: siteLastUpdated,
			changeFrequency: "monthly",
			priority: 0.95,
		},
		{
			url: `${siteUrl}/tools/pilot`,
			lastModified: siteLastUpdated,
			changeFrequency: "monthly",
			priority: 0.9,
		},
		{
			url: `${siteUrl}/privacy`,
			lastModified: new Date("2026-01-01"),
			changeFrequency: "yearly",
			priority: 0.3,
		},
		{
			url: `${siteUrl}/terms`,
			lastModified: new Date("2026-01-01"),
			changeFrequency: "yearly",
			priority: 0.3,
		},
	];

	// Blog posts — use updatedAt for recency signals (critical for AI citation)
	const blogPosts: MetadataRoute.Sitemap = blog
		.filter((post) => !post.draft)
		.map((post) => ({
			url: `${siteUrl}/blog/${getSlug(post.info.path)}`,
			lastModified: post.updatedAt ?? post.publishedAt,
			changeFrequency: "monthly" as const,
			priority: post.isHub ? 0.9 : 0.7,
		}));

	// Service pages (pSEO)
	const servicePages: MetadataRoute.Sitemap = getPublishedPages().map((page) => ({
		url: `${siteUrl}/services/${page.slug}`,
		lastModified: page.lastUpdated ?? siteLastUpdated,
		changeFrequency: "monthly" as const,
		priority: 0.9,
	}));

	// Migration pages (Legacy Tech → Modern Tech)
	const migrationPages: MetadataRoute.Sitemap = getAllMigrationPages()
		.filter((page) => page.published)
		.map((page) => ({
			url: `${siteUrl}/services/migrations/${page.slug}`,
			lastModified: siteLastUpdated,
			changeFrequency: "monthly" as const,
			priority: 0.85,
		}));

	// Integration pages (SaaS A ↔ SaaS B)
	const integrationPages: MetadataRoute.Sitemap = getAllIntegrationPages()
		.filter((page) => page.published)
		.map((page) => ({
			url: `${siteUrl}/services/integrations/${page.slug}`,
			lastModified: siteLastUpdated,
			changeFrequency: "monthly" as const,
			priority: 0.85,
		}));

	// Comparison pages (Tech A vs Tech B)
	const comparisonPages: MetadataRoute.Sitemap = getAllComparisonPages()
		.filter((page) => page.published)
		.map((page) => ({
			url: `${siteUrl}/services/comparisons/${page.slug}`,
			lastModified: siteLastUpdated,
			changeFrequency: "monthly" as const,
			priority: 0.85,
		}));

	// Technology hub pages
	const technologyPages: MetadataRoute.Sitemap = [
		{
			url: `${siteUrl}/technologies`,
			lastModified: siteLastUpdated,
			changeFrequency: "monthly" as const,
			priority: 0.9,
		},
		...getTechnologyIds().map((techId) => ({
			url: `${siteUrl}/technologies/${techId}`,
			lastModified: siteLastUpdated,
			changeFrequency: "monthly" as const,
			priority: 0.85,
		})),
	];

	// Newsletter archive pages
	const newsletterPages: MetadataRoute.Sitemap = [
		{
			url: `${siteUrl}/newsletter`,
			lastModified: siteLastUpdated,
			changeFrequency: "monthly" as const,
			priority: 0.7,
		},
		...newsletter.map((issue) => ({
			url: `${siteUrl}/newsletter/${getSlug(issue.info.path)}`,
			lastModified: issue.publishedAt,
			changeFrequency: "yearly" as const,
			priority: 0.5,
		})),
	];

	// Role-based pages (for CTOs, founders, etc.)
	const rolePages: MetadataRoute.Sitemap = [
		{
			url: `${siteUrl}/for`,
			lastModified: siteLastUpdated,
			changeFrequency: "monthly" as const,
			priority: 0.9,
		},
		...getPublishedRolePages().map((page) => ({
			url: `${siteUrl}/for/${page.slug}`,
			lastModified: page.lastUpdated ?? siteLastUpdated,
			changeFrequency: "monthly" as const,
			priority: 0.9,
		})),
	];

	// Work case study pages
	const caseStudyPages: MetadataRoute.Sitemap = getCaseStudyProjects().map((project) => ({
		url: `${siteUrl}/work/${project.id}`,
		lastModified: siteLastUpdated,
		changeFrequency: "monthly" as const,
		priority: 0.8,
	}));

	return [
		...staticPages,
		...blogPosts,
		...servicePages,
		...migrationPages,
		...integrationPages,
		...comparisonPages,
		...technologyPages,
		...rolePages,
		...newsletterPages,
		...caseStudyPages,
	];
}
