import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
	getPageBySlug,
	getPublishedPages,
	TECHNOLOGY_LABELS,
	INDUSTRY_LABELS,
	getRelatedPages,
} from "@/data/pseo";
import { ServiceJsonLd } from "@/components/seo";
import { ServicePageContent } from "./service-page-content";

const siteUrl = "https://alexmayhew.dev";

interface PageProps {
	params: Promise<{ slug: string }>;
}

/**
 * Generate static params for all published pSEO pages.
 */
export function generateStaticParams() {
	return getPublishedPages().map((page) => ({
		slug: page.slug,
	}));
}

/**
 * Generate metadata for each service page.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const page = getPageBySlug(slug);

	if (!page || !page.published) {
		return {};
	}

	const techLabel = TECHNOLOGY_LABELS[page.technology];
	const industryLabel = INDUSTRY_LABELS[page.industry];
	const pageUrl = `${siteUrl}/services/${slug}`;

	const ogImage = `/og?title=${encodeURIComponent(page.seo.title)}&description=${encodeURIComponent(page.seo.description)}&category=${encodeURIComponent("Service")}`;

	return {
		title: page.seo.title,
		description: page.seo.description,
		keywords: page.seo.keywords,
		authors: [{ name: "Alex Mayhew", url: siteUrl }],
		openGraph: {
			title: page.seo.ogTitle || page.seo.title,
			description: page.seo.ogDescription || page.seo.description,
			type: "website",
			url: pageUrl,
			siteName: "Alex Mayhew",
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
					alt: `${techLabel} Development for ${industryLabel}`,
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
 * Service page for pSEO technology + industry combinations.
 */
export default async function ServicePage({ params }: PageProps) {
	const { slug } = await params;
	const page = getPageBySlug(slug);

	if (!page || !page.published) {
		notFound();
	}

	const relatedPages = getRelatedPages(slug, 4);

	return (
		<>
			<ServiceJsonLd page={page} />
			<ServicePageContent page={page} relatedPages={relatedPages} />
		</>
	);
}
