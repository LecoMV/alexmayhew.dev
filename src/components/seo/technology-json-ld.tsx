import {
	AREA_SERVED,
	breadcrumbSchema,
	JsonLdScript,
	SCHEMA_CONTEXT,
	SITE_URL,
	WEBSITE_REF,
} from "./schema-utils";

import type { Technology } from "@/data/pseo/technologies";

interface TechnologyJsonLdProps {
	technology: Technology;
}

export function TechnologyJsonLd({ technology }: TechnologyJsonLdProps) {
	const pageUrl = `${SITE_URL}/technologies/${technology.id}`;

	const serviceSchema = {
		"@context": SCHEMA_CONTEXT,
		"@type": "Service",
		"@id": `${pageUrl}#service`,
		name: `${technology.displayName} Development`,
		description: technology.expertiseLevel,
		provider: {
			"@type": "Person",
			name: "Alex Mayhew",
			url: SITE_URL,
			jobTitle: "Technical Advisor & Systems Architect",
		},
		serviceType: "Software Development",
		areaServed: AREA_SERVED,
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: `${technology.displayName} Services`,
			itemListElement: technology.projectTypes.map((projectType, index) => ({
				"@type": "Offer",
				itemOffered: {
					"@type": "Service",
					name: `${technology.displayName} for ${projectType}`,
				},
				position: index + 1,
			})),
		},
	};

	const bestPracticesSchema = {
		"@context": SCHEMA_CONTEXT,
		"@type": "ItemList",
		name: `${technology.displayName} Best Practices`,
		description: `Expert best practices for ${technology.displayName} development`,
		itemListElement: technology.bestPractices.map((practice, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: practice.slice(0, 100),
			description: practice,
		})),
	};

	const pitfallsSchema = {
		"@context": SCHEMA_CONTEXT,
		"@type": "ItemList",
		name: `${technology.displayName} Common Pitfalls`,
		description: `Common mistakes to avoid in ${technology.displayName} development`,
		itemListElement: technology.commonPitfalls.map((pitfall, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: pitfall.slice(0, 100),
			description: pitfall,
		})),
	};

	const webPageSchema = {
		"@context": SCHEMA_CONTEXT,
		"@type": "WebPage",
		"@id": pageUrl,
		url: pageUrl,
		name: `${technology.displayName} Developer | Technical Advisor`,
		description: technology.expertiseLevel,
		isPartOf: {
			...WEBSITE_REF,
			"@id": `${SITE_URL}#website`,
		},
		about: {
			"@type": "Thing",
			name: technology.displayName,
		},
		mainEntity: {
			"@id": `${pageUrl}#service`,
		},
	};

	return (
		<>
			<JsonLdScript data={serviceSchema} />
			<JsonLdScript data={bestPracticesSchema} />
			<JsonLdScript data={pitfallsSchema} />
			<JsonLdScript data={webPageSchema} />
			<JsonLdScript
				data={breadcrumbSchema([
					{ name: "Home", item: SITE_URL },
					{ name: "Technologies", item: `${SITE_URL}/technologies` },
					{ name: technology.displayName, item: pageUrl },
				])}
			/>
		</>
	);
}
