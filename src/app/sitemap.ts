import { blog, newsletter } from "@/../.source/server";
import { getCaseStudyProjects } from "@/data/projects";
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
	// 0.7   => most content (blog posts, case studies)
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
			url: `${siteUrl}/resume`,
			lastModified: siteLastUpdated,
			changeFrequency: "monthly",
			priority: 0.9,
		},
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
		// (Retired route 2026-04-17: the old VoiceKeep tools shell 301s
		// to voicekeep.io now; 3xx URLs in the sitemap would trigger GSC
		// warnings.)
		{
			url: `${siteUrl}/tools/saas-readiness`,
			lastModified: siteLastUpdated,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${siteUrl}/frameworks/saas-stage-fit-matrix`,
			lastModified: siteLastUpdated,
			changeFrequency: "monthly",
			priority: 0.8,
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

	// Work case study pages. lastModified omitted: no per-project update
	// tracking, and build-timestamp churn devalues the lastmod signal.
	const caseStudyPages: MetadataRoute.Sitemap = getCaseStudyProjects().map((project) => ({
		url: `${siteUrl}/work/${project.id}`,
		changeFrequency: "monthly" as const,
		priority: 0.7,
	}));

	// Sitemap composition (2026-08 reposition):
	// - The programmatic pSEO corpus (service / migration / integration /
	//   comparison / technology pages) and the /for role funnel were removed:
	//   thin, off-brand for a job-seeking portfolio, and a scaled-content-abuse
	//   liability. The site footprint is now the real editorial + portfolio set.
	// - /docs excluded: Fumadocs stub pages lack authority.
	// - Newsletter archive still excluded until send volume justifies it.
	return [...staticPages, ...blogPosts, ...caseStudyPages];
}
