import type { ComparisonPage } from "@/data/pseo";

interface ComparisonJsonLdProps {
	page: ComparisonPage;
}

const siteUrl = "https://alexmayhew.dev";

/**
 * JSON-LD structured data for comparison pages.
 * Implements Service, FAQPage, WebPage, and BreadcrumbList schemas.
 */
export function ComparisonJsonLd({ page }: ComparisonJsonLdProps) {
	const pageUrl = `${siteUrl}/services/comparisons/${page.slug}`;
	const serviceName = `${page.optionA.name} vs ${page.optionB.name} ${page.useCase}`;

	// Service schema - positions this as a consulting service for technology selection
	const serviceSchema = {
		"@context": "https://schema.org",
		"@type": "Service",
		"@id": pageUrl,
		name: `${page.optionA.name} vs ${page.optionB.name} Technical Advisory`,
		description: page.seo.description,
		provider: {
			"@type": "Person",
			name: "Alex Mayhew",
			url: siteUrl,
			image: `${siteUrl}/og-image.png`,
			jobTitle: "Technical Advisor & Systems Architect",
		},
		serviceType: "Technology Selection Advisory",
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
				name: "Comparisons",
				item: `${siteUrl}/services/comparisons`,
			},
			{
				"@type": "ListItem",
				position: 4,
				name: `${page.optionA.name} vs ${page.optionB.name}`,
				item: pageUrl,
			},
		],
	};

	// Comparison/Review schema for rich snippets
	const comparisonSchema = {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: page.seo.title,
		description: page.seo.description,
		author: {
			"@type": "Person",
			name: "Alex Mayhew",
			url: siteUrl,
		},
		publisher: {
			"@type": "Person",
			name: "Alex Mayhew",
			url: siteUrl,
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
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
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
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonSchema) }}
			/>
		</>
	);
}
