import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getComparisonPageBySlug, getAllComparisonSlugs } from "@/data/pseo";
import { ComparisonJsonLd } from "@/components/seo/comparison-json-ld";
import { ComparisonPageContent } from "./comparison-page-content";

const siteUrl = "https://alexmayhew.dev";

interface PageProps {
	params: Promise<{ slug: string }>;
}

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
					url: `${siteUrl}/og-image.png`,
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
			images: [`${siteUrl}/og-image.png`],
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

	return (
		<>
			<ComparisonJsonLd page={page} />
			<ComparisonPageContent page={page} />
		</>
	);
}
