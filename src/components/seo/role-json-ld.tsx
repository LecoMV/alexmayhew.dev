import { ROLE_LABELS, SERVICE_TIER_LABELS } from "@/data/roles";

import {
	AREA_SERVED,
	breadcrumbSchema,
	faqSchema,
	JsonLdScript,
	SCHEMA_CONTEXT,
	SITE_URL,
	webPageSchema,
} from "./schema-utils";

import type { RolePage } from "@/data/roles";

interface RoleJsonLdProps {
	page: RolePage;
}

export function RoleJsonLd({ page }: RoleJsonLdProps) {
	const roleLabel = ROLE_LABELS[page.role];
	const pageUrl = `${SITE_URL}/for/${page.slug}`;

	const serviceSchema = {
		"@context": SCHEMA_CONTEXT,
		"@type": "Service",
		"@id": pageUrl,
		name: `Technical Advisory for ${roleLabel}`,
		description: page.seo.description,
		provider: {
			"@type": "Person",
			name: "Alex Mayhew",
			url: SITE_URL,
			image: `${SITE_URL}/og-image.png`,
			jobTitle: "Technical Advisor & Software Architect",
		},
		serviceType: "Technical Consulting",
		areaServed: AREA_SERVED,
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

	return (
		<>
			<JsonLdScript data={serviceSchema} />
			<JsonLdScript data={faqSchema(page.faqs)} />
			<JsonLdScript
				data={webPageSchema({
					pageUrl,
					title: page.seo.title,
					description: page.seo.description,
					aboutName: `Technical Advisory for ${roleLabel}`,
					keywords: page.seo.keywords,
					dateModified: page.lastUpdated?.toISOString() ?? new Date().toISOString(),
				})}
			/>
			<JsonLdScript
				data={breadcrumbSchema([
					{ name: "Home", item: SITE_URL },
					{ name: `For ${roleLabel}`, item: pageUrl },
				])}
			/>
		</>
	);
}
