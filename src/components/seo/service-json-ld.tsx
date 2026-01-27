import type { PseoPage } from "@/data/pseo";
import { TECHNOLOGY_LABELS, INDUSTRY_LABELS } from "@/data/pseo";

interface ServiceJsonLdProps {
	page: PseoPage;
}

const siteUrl = "https://alexmayhew.dev";

/**
 * JSON-LD structured data for pSEO service pages.
 * Implements ServicePage schema with FAQ and pricing information.
 */
export function ServiceJsonLd({ page }: ServiceJsonLdProps) {
	const techLabel = TECHNOLOGY_LABELS[page.technology];
	const industryLabel = INDUSTRY_LABELS[page.industry];
	const pageUrl = `${siteUrl}/services/${page.slug}`;

	// Service schema
	const serviceSchema = {
		"@context": "https://schema.org",
		"@type": "Service",
		"@id": pageUrl,
		name: `${techLabel} Development for ${industryLabel}`,
		description: page.seo.description,
		provider: {
			"@type": "Person",
			name: "Alex Mayhew",
			url: siteUrl,
			image: `${siteUrl}/og-image.png`,
			jobTitle: "Technical Advisor & Systems Architect",
		},
		serviceType: "Web Development",
		areaServed: {
			"@type": "Place",
			name: "Worldwide",
		},
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
			name: `${techLabel} ${industryLabel} Development`,
		},
		mainEntity: {
			"@id": pageUrl,
		},
		dateModified: page.lastUpdated?.toISOString() ?? new Date().toISOString(),
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
				name: `${techLabel} for ${industryLabel}`,
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
