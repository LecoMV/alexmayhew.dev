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

import type { MigrationPage } from "@/data/pseo";

interface MigrationJsonLdProps {
	page: MigrationPage;
}

export function MigrationJsonLd({ page }: MigrationJsonLdProps) {
	const pageUrl = `${SITE_URL}/services/migrations/${page.slug}`;
	const serviceName = `${page.legacyTech.name} to ${page.modernTech.name} Migration`;

	const serviceSchema = {
		"@context": SCHEMA_CONTEXT,
		"@type": "Service",
		"@id": pageUrl,
		name: serviceName,
		description: page.seo.description,
		provider: PROVIDER_PERSON,
		serviceType: "Software Migration Services",
		areaServed: AREA_SERVED,
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: `${serviceName} Services`,
			itemListElement: [
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: "Migration Assessment",
						description: `Comprehensive audit of ${page.legacyTech.name} codebase with migration roadmap`,
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
						name: "Full Migration",
						description: `Complete migration from ${page.legacyTech.name} to ${page.modernTech.name}`,
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
			audienceType: `CTOs and engineering leaders managing ${page.legacyTech.name} applications`,
		},
		url: pageUrl,
	};

	const howToSchema = {
		"@context": SCHEMA_CONTEXT,
		"@type": "HowTo",
		name: `How to Migrate from ${page.legacyTech.name} to ${page.modernTech.name}`,
		description: page.migrationApproach,
		totalTime: `P${page.timeline.fullMigrationWeeks}W`,
		estimatedCost: {
			"@type": "MonetaryAmount",
			currency: page.budgetGuidance.currency,
			minValue: page.budgetGuidance.mvpMin,
			maxValue: page.budgetGuidance.fullMax,
		},
		step: [
			{
				"@type": "HowToStep",
				name: "Assessment Phase",
				text: `Comprehensive audit of existing ${page.legacyTech.name} codebase, identifying dependencies, technical debt, and migration complexity.`,
				position: 1,
				estimatedTime: `P${page.timeline.assessmentWeeks}W`,
			},
			{
				"@type": "HowToStep",
				name: "Architecture Design",
				text: `Design modern ${page.modernTech.name} architecture with migration patterns: ${page.patterns.map((p) => p.name).join(", ")}.`,
				position: 2,
			},
			{
				"@type": "HowToStep",
				name: "MVP Migration",
				text: `Migrate core functionality to ${page.modernTech.name}, establishing patterns and validating approach.`,
				position: 3,
				estimatedTime: `P${page.timeline.mvpWeeks}W`,
			},
			{
				"@type": "HowToStep",
				name: "Incremental Migration",
				text: "Systematically migrate remaining components using chosen migration pattern while maintaining system stability.",
				position: 4,
			},
			{
				"@type": "HowToStep",
				name: "Cutover & Decommission",
				text: `Complete migration, redirect traffic to ${page.modernTech.name} application, and safely decommission legacy system.`,
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
					{ name: "Migrations", item: `${SITE_URL}/services/migrations` },
					{ name: `${page.legacyTech.name} to ${page.modernTech.name}`, item: pageUrl },
				])}
			/>
		</>
	);
}
