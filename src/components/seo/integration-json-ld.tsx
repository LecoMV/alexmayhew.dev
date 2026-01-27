import type { IntegrationPage } from "@/data/pseo";

interface IntegrationJsonLdProps {
	page: IntegrationPage;
}

const siteUrl = "https://alexmayhew.dev";

/**
 * JSON-LD structured data for integration service pages.
 * Implements Service, HowTo, FAQ, WebPage, and Breadcrumb schemas.
 */
export function IntegrationJsonLd({ page }: IntegrationJsonLdProps) {
	const pageUrl = `${siteUrl}/services/integrations/${page.slug}`;
	const serviceName = `${page.saasA.name} + ${page.saasB.name} Integration`;

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
			jobTitle: "Full-Stack Developer & Software Architect",
		},
		serviceType: "API Integration Services",
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

	// HowTo schema for integration process
	const howToSchema = {
		"@context": "https://schema.org",
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
				name: "Integrations",
				item: `${siteUrl}/services/integrations`,
			},
			{
				"@type": "ListItem",
				position: 4,
				name: `${page.saasA.name} + ${page.saasB.name}`,
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
