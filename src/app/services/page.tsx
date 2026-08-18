import { ServicesJsonLd } from "@/components/seo/json-ld";
import { PERSON_REF } from "@/components/seo/schema-utils";
import { INDUSTRY_LABELS, TECHNOLOGY_LABELS } from "@/data/pseo";
import { getPublishedPages } from "@/data/pseo/pages";

import { ServicesPage } from "./services-page-content";

import type { Metadata } from "next";

const PAGE_TITLE = "Services";
const OG_IMAGE_PATH = "/og-image-2026.png";

export const metadata: Metadata = {
	title: PAGE_TITLE,
	description:
		"Web development, workflow automation, and applied AI. Available for contract and fractional engagements. WordPress, Next.js, Python, and the systems a business runs on.",
	openGraph: {
		title: PAGE_TITLE,
		description:
			"Web development, workflow automation, and applied AI. Available for contract and fractional engagements.",
		type: "website",
		images: [
			{
				url: OG_IMAGE_PATH,
				width: 1200,
				height: 630,
				alt: "Alex Mayhew - Services",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: PAGE_TITLE,
		description: "Web development, workflow automation, and applied AI.",
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
		description: "Web development, workflow automation, and applied-AI services.",
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
			<ServicesJsonLd />
			<ServicesHubJsonLd />
			<ServicesPage pages={pages} />
		</>
	);
}
