import type { Metadata } from "next";
import { ServicesPage } from "./services-page-content";
import { getPublishedPages, TECHNOLOGY_LABELS, INDUSTRY_LABELS } from "@/data/pseo";

export const metadata: Metadata = {
	title: "Technical Advisory Services",
	description:
		"Strategic technical guidance for founders and CTOs. Architecture decisions that compound into competitive advantage. Next.js, React, TypeScript, and enterprise systems.",
	openGraph: {
		title: "Technical Advisory Services | Alex Mayhew",
		description:
			"Strategic technical guidance for founders and CTOs. Architecture decisions that compound into competitive advantage.",
		type: "website",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Alex Mayhew - Technical Advisory Services",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Technical Advisory Services | Alex Mayhew",
		description:
			"Strategic technical guidance for founders and CTOs. Architecture decisions that compound into competitive advantage.",
		images: ["/og-image.png"],
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
		name: "Technical Advisory Services",
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
				provider: {
					"@type": "Person",
					name: "Alex Mayhew",
					url: siteUrl,
				},
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
