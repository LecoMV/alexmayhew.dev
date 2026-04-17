import { blog, newsletter } from "@/../.source/server";
import { getCaseStudyProjects } from "@/data/projects";
import { getAllComparisonPages } from "@/data/pseo/comparisons";
import { getAllIntegrationPages } from "@/data/pseo/integrations";
import { getAllMigrationPages } from "@/data/pseo/migrations";
import { getPublishedPages } from "@/data/pseo/pages";
import { getTechnologyIds } from "@/data/pseo/technologies";
import { getPublishedRolePages } from "@/data/roles";
import { publicEnv } from "@/lib/env";

import type { MetadataRoute } from "next";

const siteUrl = "https://alexmayhew.dev";

// Extract slug from file path
function getSlug(path: string): string {
	return path.replace(/^\//, "").replace(/\.mdx$/, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
	// Static pages ... use fixed dates to avoid Google distrust of constantly-changing lastmod
	const siteLastUpdated = new Date(publicEnv.NEXT_PUBLIC_BUILD_TIME ?? new Date().toISOString());

	// Priority tiers (retier to avoid priority inflation):
	// 1.0   => root only
	// 0.9   => hub pages (main navigation entry points)
	// 0.7   => most content (blog posts, case studies, role pages, services)
	// 0.5   => secondary/archive content
	// 0.3   => low-value technical pages (privacy, terms)
	const staticPages: MetadataRoute.Sitemap = [
		{
			url: siteUrl,
			lastModified: siteLastUpdated,
			changeFrequency: "monthly",
			priority: 1,
		},
		// Hub pages at 0.9
		{
			url: `${siteUrl}/work`,
			lastModified: siteLastUpdated,
			changeFrequency: "monthly",
			priority: 0.9,
		},
		{
			url: `${siteUrl}/services`,
			lastModified: siteLastUpdated,
			changeFrequency: "monthly",
			priority: 0.9,
		},
		{
			url: `${siteUrl}/blog`,
			lastModified: siteLastUpdated,
			// Actual cadence is 2 posts/month; Google weights declared changeFreq
			// against observed crawl data, so keep these aligned.
			changeFrequency: "monthly",
			priority: 0.9,
		},
		{
			url: `${siteUrl}/tools`,
			lastModified: siteLastUpdated,
			changeFrequency: "monthly",
			priority: 0.9,
		},
		// Standard content pages at 0.7
		{
			url: `${siteUrl}/about`,
			lastModified: siteLastUpdated,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${siteUrl}/contact`,
			lastModified: siteLastUpdated,
			changeFrequency: "yearly",
			priority: 0.7,
		},
		{
			url: `${siteUrl}/tools/traceforge`,
			lastModified: siteLastUpdated,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${siteUrl}/tools/pilot`,
			lastModified: siteLastUpdated,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${siteUrl}/tools/voice-cloner`,
			lastModified: siteLastUpdated,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${siteUrl}/tools/saas-readiness`,
			lastModified: siteLastUpdated,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${siteUrl}/glossary`,
			lastModified: siteLastUpdated,
			changeFrequency: "monthly",
			priority: 0.5,
		},
		// Low-priority technical pages
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

	// Blog posts ... use updatedAt for recency signals (critical for AI citation)
	const blogPosts: MetadataRoute.Sitemap = blog
		.filter((post) => !post.draft)
		.map((post) => ({
			url: `${siteUrl}/blog/${getSlug(post.info.path)}`,
			lastModified: post.updatedAt ?? post.publishedAt,
			changeFrequency: "monthly" as const,
			priority: post.isHub ? 0.9 : 0.7,
			images: post.image ? [`${siteUrl}${post.image}`] : [],
		}));

	// Service pages (pSEO) ... standard content tier
	const servicePages: MetadataRoute.Sitemap = getPublishedPages().map((page) => ({
		url: `${siteUrl}/services/${page.slug}`,
		lastModified: page.lastUpdated ?? siteLastUpdated,
		changeFrequency: "monthly" as const,
		priority: 0.7,
	}));

	// Migration pages (Legacy Tech → Modern Tech).
	// lastModified omitted: no per-page update tracking (see technologyPages note).
	const migrationPages: MetadataRoute.Sitemap = getAllMigrationPages()
		.filter((page) => page.published)
		.map((page) => ({
			url: `${siteUrl}/services/migrations/${page.slug}`,
			changeFrequency: "monthly" as const,
			priority: 0.6,
		}));

	// Integration pages (SaaS A ↔ SaaS B).
	const integrationPages: MetadataRoute.Sitemap = getAllIntegrationPages()
		.filter((page) => page.published)
		.map((page) => ({
			url: `${siteUrl}/services/integrations/${page.slug}`,
			changeFrequency: "monthly" as const,
			priority: 0.6,
		}));

	// Comparison pages (Tech A vs Tech B).
	const comparisonPages: MetadataRoute.Sitemap = getAllComparisonPages()
		.filter((page) => page.published)
		.map((page) => ({
			url: `${siteUrl}/services/comparisons/${page.slug}`,
			changeFrequency: "monthly" as const,
			priority: 0.6,
		}));

	// Technology hub pages.
	// lastModified omitted on routes without per-page update tracking: Google's
	// 2026 sitemap guidance treats build-timestamp churn as noise and devalues
	// the signal. Better to omit than to emit a lie.
	const technologyPages: MetadataRoute.Sitemap = [
		{
			url: `${siteUrl}/technologies`,
			changeFrequency: "monthly" as const,
			priority: 0.9,
		},
		...getTechnologyIds().map((techId) => ({
			url: `${siteUrl}/technologies/${techId}`,
			changeFrequency: "monthly" as const,
			priority: 0.7,
		})),
	];

	// Newsletter archive pages ... only include issues that have actually been SENT.
	// Date filter alone is insufficient: 36 drafts have past sendDate values but are unpublished.
	const _newsletterPages: MetadataRoute.Sitemap = [
		{
			url: `${siteUrl}/newsletter`,
			lastModified: siteLastUpdated,
			changeFrequency: "monthly" as const,
			priority: 0.7,
		},
		...newsletter
			.filter((issue) => issue.status === "sent" && issue.publishedAt <= new Date())
			.map((issue) => ({
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
			priority: 0.7,
		})),
	];

	// Work case study pages. lastModified omitted: no per-project update
	// tracking, and build-timestamp churn devalues the lastmod signal
	// (see technologyPages comment above).
	const caseStudyPages: MetadataRoute.Sitemap = getCaseStudyProjects().map((project) => ({
		url: `${siteUrl}/work/${project.id}`,
		changeFrequency: "monthly" as const,
		priority: 0.7,
	}));

	// Sitemap composition (2026-04-17):
	// - /docs excluded: Fumadocs stub pages lack authority and risk
	//   "scaled content abuse" signals.
	// - Migration / integration / comparison pSEO now included: the original
	//   "DR>20 first" gate was blocking quality-gated content while near-zero
	//   backlinks are the real indexing bottleneck.
	// - Newsletter archive still excluded until open-rate + send volume
	//   justify discoverability.
	return [
		...staticPages,
		...blogPosts,
		...servicePages,
		...migrationPages,
		...integrationPages,
		...comparisonPages,
		...technologyPages,
		...rolePages,
		...caseStudyPages,
	];
}
