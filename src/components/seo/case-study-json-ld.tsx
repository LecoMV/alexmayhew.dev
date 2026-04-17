import { ORG_REF, PERSON_REF } from "./schema-utils";

import type { Project } from "@/data/projects";

const siteUrl = "https://alexmayhew.dev";
const OG_IMAGE_URL = `${siteUrl}/og-image.png`;

interface CaseStudyJsonLdProps {
	project: Project;
}

export function CaseStudyJsonLd({ project }: CaseStudyJsonLdProps) {
	const pageUrl = `${siteUrl}/work/${project.id}`;

	// When the project has an external production URL (e.g. voicekeep.io),
	// don't redeclare a SoftwareApplication on alexmayhew.dev -- that
	// fragments the entity graph. Instead reference the canonical product
	// entity via @id and link with sameAs. The marketing domain owns the
	// canonical SoftwareApplication; the portfolio just describes the work.
	const isExternalProduct = Boolean(project.link && /^https?:\/\//i.test(project.link));
	const externalProductUrl = isExternalProduct ? project.link!.replace(/\/$/, "") : undefined;

	// TechArticle gives Google rich-result eligibility that bare CreativeWork
	// lacks. publisher + mainEntityOfPage + image are the three gates that
	// Search Central flags as required for Article-family schemas.
	const articleSchema: Record<string, unknown> = {
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
		about: externalProductUrl
			? { "@id": `${externalProductUrl}/#software` }
			: {
					"@type": "SoftwareApplication",
					name: project.title,
					applicationCategory: project.category,
					operatingSystem: "Web",
				},
	};
	if (externalProductUrl) {
		articleSchema.sameAs = [externalProductUrl];
	}

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
