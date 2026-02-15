import { getPublishedRolePages, ROLE_LABELS } from "@/data/roles";

import { ForHubPage } from "./for-hub-page";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Technical Advisory by Role | Alex Mayhew",
	description:
		"Strategic technical partnership tailored to your role. CTOs, Technical Founders, Seed Founders, and VPs of Engineering all have unique challenges. Find guidance designed for you.",
	openGraph: {
		title: "Technical Advisory by Role | Alex Mayhew",
		description:
			"Strategic technical partnership tailored to your role. Find guidance designed for CTOs, Technical Founders, Seed Founders, and Engineering Leaders.",
		type: "website",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Alex Mayhew - Technical Advisory by Role",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Technical Advisory by Role | Alex Mayhew",
		description:
			"Strategic technical partnership tailored to your role. Find guidance designed for your specific challenges.",
		images: ["/og-image.png"],
	},
};

// Generate JSON-LD for the roles hub page
function RolesHubJsonLd() {
	const pages = getPublishedRolePages();
	const siteUrl = "https://alexmayhew.dev";

	// ItemList schema for all role pages
	const itemListSchema = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: "Technical Advisory Services by Role",
		description:
			"Strategic technical partnership tailored to your role as a technology leader or founder.",
		numberOfItems: pages.length,
		itemListElement: pages.map((page, index) => ({
			"@type": "ListItem",
			position: index + 1,
			item: {
				"@type": "Service",
				name: `Technical Advisory for ${ROLE_LABELS[page.role]}`,
				description: page.seo.description,
				url: `${siteUrl}/for/${page.slug}`,
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
				name: "For Leaders",
				item: `${siteUrl}/for`,
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
	const pages = getPublishedRolePages();

	return (
		<>
			<RolesHubJsonLd />
			<ForHubPage pages={pages} />
		</>
	);
}
