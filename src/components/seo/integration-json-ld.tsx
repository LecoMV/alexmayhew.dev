import {
	AREA_SERVED,
	breadcrumbSchema,
	faqSchema,
	JsonLdScript,
	PERSON_REF,
	SCHEMA_CONTEXT,
	SITE_URL,
	webPageSchema,
} from "./schema-utils";

import type { IntegrationPage } from "@/data/pseo";

interface IntegrationJsonLdProps {
	page: IntegrationPage;
}

export function IntegrationJsonLd({ page }: IntegrationJsonLdProps) {
	const pageUrl = `${SITE_URL}/services/integrations/${page.slug}`;
	const serviceName = `${page.saasA.name} + ${page.saasB.name} Integration`;

	const serviceSchema = {
		"@context": SCHEMA_CONTEXT,
		"@type": "Service",
		"@id": `${pageUrl}#service`,
		name: serviceName,
		description: page.seo.description,
		provider: PERSON_REF,
		serviceType: "API Integration Services",
		areaServed: AREA_SERVED,
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: `${serviceName} Services`,
			itemListElement: [
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: "Integration MVP",
						description: `Core ${page.saasA.name} to ${page.saasB.name} data sync with essential workflows`,
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
						name: "Full Integration Solution",
						description: `Complete ${page.saasA.name} + ${page.saasB.name} integration with advanced automation`,
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
			audienceType: `Operations and engineering teams using ${page.saasA.name} and ${page.saasB.name}`,
		},
		url: pageUrl,
	};

	const howToSchema = {
		"@context": SCHEMA_CONTEXT,
		"@type": "HowTo",
		name: `How to Integrate ${page.saasA.name} with ${page.saasB.name}`,
		description: page.integrationApproach,
		totalTime: `P${page.timeline.productionWeeks}W`,
		estimatedCost: {
			"@type": "MonetaryAmount",
			currency: page.budgetGuidance.currency,
			minValue: page.budgetGuidance.mvpMin,
			maxValue: page.budgetGuidance.fullMax,
		},
		step: [
			{
				"@type": "HowToStep",
				name: "Discovery & Architecture",
				text: `Analyze current ${page.saasA.name} and ${page.saasB.name} usage, map data flows, and design integration architecture.`,
				position: 1,
				estimatedTime: `P${page.timeline.discoveryWeeks}W`,
			},
			{
				"@type": "HowToStep",
				name: "Authentication Setup",
				text: `Configure secure API access with ${page.saasA.authMethods.join(", ")} for ${page.saasA.name} and ${page.saasB.authMethods.join(", ")} for ${page.saasB.name}.`,
				position: 2,
			},
			{
				"@type": "HowToStep",
				name: "MVP Integration",
				text: `Implement core data sync and workflows using ${page.patterns[0]?.name || "chosen"} pattern.`,
				position: 3,
				estimatedTime: `P${page.timeline.mvpWeeks}W`,
			},
			{
				"@type": "HowToStep",
				name: "Testing & Validation",
				text: "Comprehensive testing in sandbox environments, error handling validation, and data integrity verification.",
				position: 4,
			},
			{
				"@type": "HowToStep",
				name: "Production Deployment",
				text: "Gradual rollout with monitoring, alerting, and documentation for ongoing maintenance.",
				position: 5,
			},
		],
		tool: page.patterns.map((pattern) => ({
			"@type": "HowToTool",
			name: pattern.name,
			description: pattern.description,
		})),
	};

	return (
		<>
			<JsonLdScript data={serviceSchema} />
			<JsonLdScript data={howToSchema} />
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
					{ name: "Integrations", item: `${SITE_URL}/services/integrations` },
					{ name: `${page.saasA.name} + ${page.saasB.name}`, item: pageUrl },
				])}
			/>
		</>
	);
}
