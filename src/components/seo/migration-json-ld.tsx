import type { MigrationPage } from "@/data/pseo";

interface MigrationJsonLdProps {
	page: MigrationPage;
}

const siteUrl = "https://alexmayhew.dev";

/**
 * JSON-LD structured data for migration service pages.
 * Implements Service, HowTo, FAQ, WebPage, and Breadcrumb schemas.
 */
export function MigrationJsonLd({ page }: MigrationJsonLdProps) {
	const pageUrl = `${siteUrl}/services/migrations/${page.slug}`;
	const serviceName = `${page.legacyTech.name} to ${page.modernTech.name} Migration`;

	// Service schema
	const serviceSchema = {
		"@context": "https://schema.org",
		"@type": "Service",
		"@id": pageUrl,
		name: serviceName,
		description: page.seo.description,
		provider: {
			"@type": "Person",
			name: "Alex Mayhew",
			url: siteUrl,
			image: `${siteUrl}/og-image.png`,
			jobTitle: "Technical Advisor & Systems Architect",
		},
		serviceType: "Software Migration Services",
		areaServed: {
			"@type": "Place",
			name: "Worldwide",
		},
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

	// HowTo schema for migration process
	const howToSchema = {
		"@context": "https://schema.org",
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

	// FAQ schema
	const faqSchema = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: page.faqs.map((faq) => ({
			"@type": "Question",
			name: faq.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: faq.answer,
			},
		})),
	};

	// WebPage schema
	const webPageSchema = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		"@id": pageUrl,
		url: pageUrl,
		name: page.seo.title,
		description: page.seo.description,
		inLanguage: "en-US",
		isPartOf: {
			"@type": "WebSite",
			"@id": siteUrl,
			url: siteUrl,
			name: "Alex Mayhew",
		},
		about: {
			"@type": "Thing",
			name: serviceName,
		},
		mainEntity: {
			"@id": pageUrl,
		},
		keywords: page.seo.keywords.join(", "),
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
			{
				"@type": "ListItem",
				position: 3,
				name: "Migrations",
				item: `${siteUrl}/services/migrations`,
			},
			{
				"@type": "ListItem",
				position: 4,
				name: `${page.legacyTech.name} to ${page.modernTech.name}`,
				item: pageUrl,
			},
		],
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
			/>
		</>
	);
}
