import { ROLE_LABELS, SERVICE_TIER_LABELS } from "@/data/roles";

import type { RolePage } from "@/data/roles";

interface RoleJsonLdProps {
	page: RolePage;
}

const siteUrl = "https://alexmayhew.dev";

/**
 * JSON-LD structured data for role-based landing pages.
 * Implements Service, FAQPage, WebPage, and BreadcrumbList schemas.
 */
export function RoleJsonLd({ page }: RoleJsonLdProps) {
	const roleLabel = ROLE_LABELS[page.role];
	const pageUrl = `${siteUrl}/for/${page.slug}`;

	// Service schema - positioned as consulting service
	const serviceSchema = {
		"@context": "https://schema.org",
		"@type": "Service",
		"@id": pageUrl,
		name: `Technical Advisory for ${roleLabel}`,
		description: page.seo.description,
		provider: {
			"@type": "Person",
			name: "Alex Mayhew",
			url: siteUrl,
			image: `${siteUrl}/og-image.png`,
			jobTitle: "Technical Advisor & Software Architect",
		},
		serviceType: "Technical Consulting",
		areaServed: {
			"@type": "Place",
			name: "Worldwide",
		},
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: `Services for ${roleLabel}`,
			itemListElement: page.idealTiers.map((tier, index) => ({
				"@type": "Offer",
				position: index + 1,
				itemOffered: {
					"@type": "Service",
					name: SERVICE_TIER_LABELS[tier],
				},
			})),
		},
		audience: {
			"@type": "Audience",
			audienceType: roleLabel,
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
			name: `Technical Advisory for ${roleLabel}`,
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
				name: `For ${roleLabel}`,
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
