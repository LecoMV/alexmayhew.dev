import { notFound } from "next/navigation";

import { IntegrationJsonLd } from "@/components/seo/integration-json-ld";
import { INDUSTRY_LABELS, TECHNOLOGY_LABELS } from "@/data/pseo";
import { getAllIntegrationSlugs } from "@/data/pseo/integrations";
import { getIntegrationBySlug, getPseoPageBySlug } from "@/lib/cached-data";

import { IntegrationPageContent } from "./integration-page-content";

import type { Metadata } from "next";

const siteUrl = "https://alexmayhew.dev";

interface PageProps {
	params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

/**
 * Generate static params for all published integration pages.
 */
export function generateStaticParams() {
	return getAllIntegrationSlugs().map((slug) => ({
		slug,
	}));
}

/**
 * Generate metadata for each integration page.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const page = getIntegrationBySlug(slug);

	if (!page || !page.published) {
		return {};
	}

	const pageUrl = `${siteUrl}/services/integrations/${slug}`;
	const ogImage = `/og?title=${encodeURIComponent(page.seo.title)}&description=${encodeURIComponent(page.seo.description)}&category=${encodeURIComponent("Integration")}`;

	return {
		title: page.seo.title,
		description: page.seo.description,
		keywords: page.seo.keywords,
		authors: [{ name: "Alex Mayhew", url: siteUrl }],
		openGraph: {
			title: page.seo.title,
			description: page.seo.description,
			type: "website",
			url: pageUrl,
			siteName: "Alex Mayhew",
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
					alt: `${page.saasA.name} + ${page.saasB.name} Integration`,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: page.seo.title,
			description: page.seo.description,
			images: [ogImage],
			creator: "@alexmayhewdev",
		},
		alternates: {
			canonical: pageUrl,
		},
		// Indexable as of 2026-04-17: pages meet the same quality gates as
		// /services/[slug] (see .claude/rules/pseo.md) and withholding them
		// over a "wait for DR>20" rule was blocking ~20+ otherwise-valid pages
		// while near-zero backlinks are the real indexing bottleneck.
	};
}

/**
 * Integration page for SaaS A ↔ SaaS B integration solutions.
 */
export default async function IntegrationPage({ params }: PageProps) {
	const { slug } = await params;
	const page = getIntegrationBySlug(slug);

	if (!page || !page.published) {
		notFound();
	}

	const industryLabelMap: Record<string, string> = {};
	for (const industry of page.targetIndustries) {
		industryLabelMap[industry] = INDUSTRY_LABELS[industry] ?? industry;
	}

	const relatedServicePages = page.relatedServices
		.map((s) => getPseoPageBySlug(s))
		.filter((p) => p !== null && p.published)
		.slice(0, 4)
		.map((p) => ({
			slug: p!.slug,
			techLabel: TECHNOLOGY_LABELS[p!.technology],
			industryLabel: INDUSTRY_LABELS[p!.industry],
			description: p!.seo.description,
		}));

	return (
		<>
			<IntegrationJsonLd page={page} />
			<IntegrationPageContent
				page={page}
				industryLabelMap={industryLabelMap}
				relatedServicePages={relatedServicePages}
			/>
		</>
	);
}
