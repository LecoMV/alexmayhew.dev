import {
	AREA_SERVED,
	breadcrumbSchema,
	faqSchema,
	JsonLdScript,
	PROVIDER_PERSON,
	SCHEMA_CONTEXT,
	SITE_URL,
	webPageSchema,
} from "./schema-utils";

import type { ComparisonPage } from "@/data/pseo";

interface ComparisonJsonLdProps {
	page: ComparisonPage;
}

export function ComparisonJsonLd({ page }: ComparisonJsonLdProps) {
	const pageUrl = `${SITE_URL}/services/comparisons/${page.slug}`;
	const serviceName = `${page.optionA.name} vs ${page.optionB.name} ${page.useCase}`;

	const serviceSchema = {
		"@context": SCHEMA_CONTEXT,
		"@type": "Service",
		"@id": pageUrl,
		name: `${page.optionA.name} vs ${page.optionB.name} Technical Advisory`,
		description: page.seo.description,
		provider: PROVIDER_PERSON,
		serviceType: "Technology Selection Advisory",
		areaServed: AREA_SERVED,
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: `${serviceName} Services`,
			itemListElement: [
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: `${page.optionA.name} Development`,
						description: `Custom ${page.optionA.name} development ${page.useCase.toLowerCase()}`,
					},
					priceSpecification: {
						"@type": "PriceSpecification",
						priceCurrency: page.budgetGuidance.optionA.currency,
						minPrice: page.budgetGuidance.optionA.mvpMin,
						maxPrice: page.budgetGuidance.optionA.fullMax,
					},
				},
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: `${page.optionB.name} Development`,
						description: `Custom ${page.optionB.name} development ${page.useCase.toLowerCase()}`,
					},
					priceSpecification: {
						"@type": "PriceSpecification",
						priceCurrency: page.budgetGuidance.optionB.currency,
						minPrice: page.budgetGuidance.optionB.mvpMin,
						maxPrice: page.budgetGuidance.optionB.fullMax,
					},
				},
			],
		},
		audience: {
			"@type": "Audience",
			audienceType: `CTOs and engineering leaders evaluating ${page.optionA.name} and ${page.optionB.name}`,
		},
		url: pageUrl,
	};

	const comparisonSchema = {
		"@context": SCHEMA_CONTEXT,
		"@type": "Article",
		headline: page.seo.title,
		description: page.seo.description,
		author: {
			"@type": "Person",
			name: "Alex Mayhew",
			url: SITE_URL,
		},
		publisher: {
			"@type": "Person",
			name: "Alex Mayhew",
			url: SITE_URL,
		},
		mainEntityOfPage: pageUrl,
		articleSection: "Technology Comparison",
		keywords: page.seo.keywords.join(", "),
		about: [
			{
				"@type": "SoftwareApplication",
				name: page.optionA.name,
				applicationCategory: "DeveloperApplication",
			},
			{
				"@type": "SoftwareApplication",
				name: page.optionB.name,
				applicationCategory: "DeveloperApplication",
			},
		],
	};

	return (
		<>
			<JsonLdScript data={serviceSchema} />
			<JsonLdScript data={faqSchema(page.faqs)} />
			<JsonLdScript
				data={webPageSchema({
					pageUrl,
					title: page.seo.title,
					description: page.seo.description,
					aboutName: serviceName,
					keywords: page.seo.keywords,
				})}
			/>
			<JsonLdScript
				data={breadcrumbSchema([
					{ name: "Home", item: SITE_URL },
					{ name: "Services", item: `${SITE_URL}/services` },
					{ name: "Comparisons", item: `${SITE_URL}/services/comparisons` },
					{ name: `${page.optionA.name} vs ${page.optionB.name}`, item: pageUrl },
				])}
			/>
			<JsonLdScript data={comparisonSchema} />
		</>
	);
}
