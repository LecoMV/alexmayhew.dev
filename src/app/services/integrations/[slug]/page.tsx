import { notFound } from "next/navigation";

import { IntegrationJsonLd } from "@/components/seo/integration-json-ld";
import { getAllIntegrationSlugs, getIntegrationPageBySlug } from "@/data/pseo";

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
	const page = getIntegrationPageBySlug(slug);

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
	};
}

/**
 * Integration page for SaaS A ↔ SaaS B integration solutions.
 */
export default async function IntegrationPage({ params }: PageProps) {
	const { slug } = await params;
	const page = getIntegrationPageBySlug(slug);

	if (!page || !page.published) {
		notFound();
	}

	return (
		<>
			<IntegrationJsonLd page={page} />
			<IntegrationPageContent page={page} />
		</>
	);
}
