import { ORG_REF, PERSON_REF } from "./schema-utils";

import type { Project } from "@/data/projects";

const siteUrl = "https://alexmayhew.dev";
const OG_IMAGE_URL = `${siteUrl}/og-image.png`;

interface CaseStudyJsonLdProps {
	project: Project;
}

export function CaseStudyJsonLd({ project }: CaseStudyJsonLdProps) {
	const pageUrl = `${siteUrl}/work/${project.id}`;

	// TechArticle gives Google rich-result eligibility that bare CreativeWork
	// lacks. publisher + mainEntityOfPage + image are the three gates that
	// Search Central flags as required for Article-family schemas.
	const articleSchema = {
		"@context": "https://schema.org",
		"@type": "TechArticle",
		headline: `${project.title} ... Case Study`,
		name: `${project.title} ... Case Study`,
		description: project.description,
		url: pageUrl,
		author: PERSON_REF,
		publisher: ORG_REF,
		datePublished: `${project.year}-01-01`,
		keywords: project.tech.join(", "),
		image: {
			"@type": "ImageObject",
			url: OG_IMAGE_URL,
			width: 1200,
			height: 630,
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": pageUrl,
		},
		inLanguage: "en-US",
		about: {
			"@type": "SoftwareApplication",
			name: project.title,
			applicationCategory: project.category,
			operatingSystem: "Web",
		},
	};

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
				name: "Work",
				item: `${siteUrl}/work`,
			},
			{
				"@type": "ListItem",
				position: 3,
				name: project.title,
				item: pageUrl,
			},
		],
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
			/>
		</>
	);
}
