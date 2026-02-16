import { INDUSTRY_LABELS, TECHNOLOGY_LABELS } from "@/data/pseo";

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

import type { PseoPage } from "@/data/pseo";

interface ServiceJsonLdProps {
	page: PseoPage;
}

export function ServiceJsonLd({ page }: ServiceJsonLdProps) {
	const techLabel = TECHNOLOGY_LABELS[page.technology];
	const industryLabel = INDUSTRY_LABELS[page.industry];
	const pageUrl = `${SITE_URL}/services/${page.slug}`;

	const serviceSchema = {
		"@context": SCHEMA_CONTEXT,
		"@type": "Service",
		"@id": pageUrl,
		name: `${techLabel} Development for ${industryLabel}`,
		description: page.seo.description,
		provider: PROVIDER_PERSON,
		serviceType: "Web Development",
		areaServed: AREA_SERVED,
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: `${techLabel} ${industryLabel} Services`,
			itemListElement: [
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: `${techLabel} MVP Development`,
						description: `Minimum viable product built with ${techLabel} for ${industryLabel.toLowerCase()} applications`,
					},
					priceSpecification: {
						"@type": "PriceSpecification",
						priceCurrency: page.budgetGuidance.currency,
						minPrice: page.budgetGuidance.mvpMin,
						maxPrice: page.budgetGuidance.mvpMax,
					},
				},
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: `${techLabel} Full Solution`,
						description: `Complete ${industryLabel.toLowerCase()} platform built with ${techLabel}`,
					},
					priceSpecification: {
						"@type": "PriceSpecification",
						priceCurrency: page.budgetGuidance.currency,
						minPrice: page.budgetGuidance.fullMin,
						maxPrice: page.budgetGuidance.fullMax,
					},
				},
			],
		},
		audience: {
			"@type": "Audience",
			audienceType: `${industryLabel} businesses and startups`,
		},
		url: pageUrl,
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
					aboutName: `${techLabel} ${industryLabel} Development`,
					keywords: page.seo.keywords,
					dateModified: page.lastUpdated?.toISOString() ?? new Date().toISOString(),
				})}
			/>
			<JsonLdScript
				data={breadcrumbSchema([
					{ name: "Home", item: SITE_URL },
					{ name: "Services", item: `${SITE_URL}/services` },
					{ name: `${techLabel} for ${industryLabel}`, item: pageUrl },
				])}
			/>
		</>
	);
}
