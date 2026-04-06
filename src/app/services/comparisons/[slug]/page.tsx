import { notFound } from "next/navigation";

import { ComparisonJsonLd } from "@/components/seo/comparison-json-ld";
import {
	getAllComparisonSlugs,
	getComparisonPageBySlug,
	getPageBySlug,
	INDUSTRY_LABELS,
} from "@/data/pseo";

import { ComparisonPageContent } from "./comparison-page-content";

import type { Metadata } from "next";

const siteUrl = "https://alexmayhew.dev";

interface PageProps {
	params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

/**
 * Generate static params for all published comparison pages.
 */
export function generateStaticParams() {
	return getAllComparisonSlugs().map((slug) => ({
		slug,
	}));
}

/**
 * Generate metadata for each comparison page.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const page = getComparisonPageBySlug(slug);

	if (!page || !page.published) {
		return {};
	}

	const pageUrl = `${siteUrl}/services/comparisons/${slug}`;
	const ogImage = `/og?title=${encodeURIComponent(page.seo.title)}&description=${encodeURIComponent(page.seo.description)}&category=${encodeURIComponent("Comparison")}`;

	return {
		title: page.seo.title,
		description: page.seo.description,
		keywords: page.seo.keywords,
		authors: [{ name: "Alex Mayhew", url: siteUrl }],
		openGraph: {
			title: page.seo.title,
			description: page.seo.description,
			type: "article",
			url: pageUrl,
			siteName: "Alex Mayhew",
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
					alt: `${page.optionA.name} vs ${page.optionB.name} Comparison`,
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
	};
}

/**
 * Comparison page for Tech A vs Tech B evaluations.
 */
export default async function ComparisonPage({ params }: PageProps) {
	const { slug } = await params;
	const page = getComparisonPageBySlug(slug);

	if (!page || !page.published) {
		notFound();
	}

	const industryLabelMap: Record<string, string> = {};
	for (const industry of page.targetIndustries) {
		industryLabelMap[industry] = INDUSTRY_LABELS[industry] ?? industry;
	}

	const relatedServicePages = page.relatedServices
		.map((s) => getPageBySlug(s))
		.filter((p) => p !== undefined && p.published)
		.slice(0, 3)
		.map((p) => ({
			slug: p!.slug,
			title: p!.seo.title.split("|")[0].trim(),
			description: p!.seo.description,
		}));

	return (
		<>
			<ComparisonJsonLd page={page} />
			<ComparisonPageContent
				page={page}
				industryLabelMap={industryLabelMap}
				relatedServicePages={relatedServicePages}
			/>
		</>
	);
}
