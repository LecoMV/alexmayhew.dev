import { PERSON_REF } from "@/components/seo/schema-utils";
import { INDUSTRY_LABELS, TECHNOLOGY_LABELS } from "@/data/pseo";
import { getPublishedPages } from "@/data/pseo/pages";

import { ServicesPage } from "./services-page-content";

import type { Metadata } from "next";

const PAGE_TITLE = "Technical Advisory Services";
const OG_IMAGE_PATH = "/og-image.png";

export const metadata: Metadata = {
	title: PAGE_TITLE,
	description:
		"Strategic technical guidance for founders and CTOs. Architecture decisions that compound into competitive advantage. Next.js, React, TypeScript, and enterprise systems.",
	openGraph: {
		title: PAGE_TITLE,
		description:
			"Strategic technical guidance for founders and CTOs. Architecture decisions that compound into competitive advantage.",
		type: "website",
		images: [
			{
				url: OG_IMAGE_PATH,
				width: 1200,
				height: 630,
				alt: "Alex Mayhew - Technical Advisory Services",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: PAGE_TITLE,
		description:
			"Strategic technical guidance for founders and CTOs. Architecture decisions that compound into competitive advantage.",
		images: [OG_IMAGE_PATH],
	},
	alternates: {
		canonical: "/services",
	},
};

// Generate JSON-LD for the services hub page
function ServicesHubJsonLd() {
	const pages = getPublishedPages();
	const siteUrl = "https://alexmayhew.dev";

	// ItemList schema for all services
	const itemListSchema = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: PAGE_TITLE,
		description:
			"Strategic technical guidance for founders and CTOs building with modern web technologies.",
		numberOfItems: pages.length,
		itemListElement: pages.map((page, index) => ({
			"@type": "ListItem",
			position: index + 1,
			item: {
				"@type": "Service",
				name: `${TECHNOLOGY_LABELS[page.technology]} for ${INDUSTRY_LABELS[page.industry]}`,
				description: page.seo.description,
				url: `${siteUrl}/services/${page.slug}`,
				provider: PERSON_REF,
			},
		})),
	};

	// BreadcrumbList schema
	const breadcrumbSchema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: siteUrl,
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Services",
				item: `${siteUrl}/services`,
			},
		],
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
			/>
		</>
	);
}

export default function Page() {
	const pages = getPublishedPages();

	return (
		<>
			<ServicesHubJsonLd />
			<ServicesPage pages={pages} />
		</>
	);
}
