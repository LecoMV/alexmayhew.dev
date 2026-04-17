import { WorkPage } from "@/components/pages";
import { WEBSITE_REF } from "@/components/seo/schema-utils";
import { getCaseStudyProjects } from "@/data/projects";

import type { Metadata } from "next";

const siteUrl = "https://alexmayhew.dev";

export const metadata: Metadata = {
	title: "Work",
	description:
		"Selected projects and experiments in AI/ML, SaaS platforms, and web applications. Enterprise-grade solutions built with precision.",
	openGraph: {
		title: "Work",
		description:
			"Selected projects in AI/ML, SaaS, and web applications. Enterprise-grade solutions built with precision.",
		type: "website",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Alex Mayhew - Portfolio",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Work",
		description: "Selected projects in AI/ML, SaaS, and web applications.",
		images: ["/og-image.png"],
	},
	alternates: {
		canonical: "/work",
	},
};

function WorkCollectionJsonLd() {
	const projects = getCaseStudyProjects();
	const schema = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		"@id": `${siteUrl}/work`,
		url: `${siteUrl}/work`,
		name: "Work",
		description:
			"Selected projects and experiments in AI/ML, SaaS platforms, and web applications.",
		isPartOf: WEBSITE_REF,
		mainEntity: {
			"@type": "ItemList",
			itemListElement: projects.map((project, index) => ({
				"@type": "ListItem",
				position: index + 1,
				name: project.title,
				url: `${siteUrl}/work/${project.id}`,
			})),
		},
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	);
}

export default function Page() {
	return (
		<>
			<WorkCollectionJsonLd />
			<WorkPage />
		</>
	);
}
