export const SITE_URL = "https://alexmayhew.dev";
export const SCHEMA_CONTEXT = "https://schema.org" as const;

export const PROVIDER_PERSON = {
	"@type": "Person" as const,
	name: "Alex Mayhew",
	url: SITE_URL,
	image: `${SITE_URL}/og-image.png`,
	jobTitle: "Technical Advisor & Systems Architect",
};

export const AREA_SERVED = {
	"@type": "Place" as const,
	name: "Worldwide",
};

export const WEBSITE_REF = {
	"@type": "WebSite" as const,
	"@id": SITE_URL,
	url: SITE_URL,
	name: "Alex Mayhew",
};

interface Faq {
	question: string;
	answer: string;
}

export function faqSchema(faqs: Faq[]) {
	return {
		"@context": SCHEMA_CONTEXT,
		"@type": "FAQPage" as const,
		mainEntity: faqs.map((faq) => ({
			"@type": "Question" as const,
			name: faq.question,
			acceptedAnswer: {
				"@type": "Answer" as const,
				text: faq.answer,
			},
		})),
	};
}

interface BreadcrumbItem {
	name: string;
	item: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
	return {
		"@context": SCHEMA_CONTEXT,
		"@type": "BreadcrumbList" as const,
		itemListElement: items.map((crumb, index) => ({
			"@type": "ListItem" as const,
			position: index + 1,
			name: crumb.name,
			item: crumb.item,
		})),
	};
}

interface WebPageParams {
	pageUrl: string;
	title: string;
	description: string;
	aboutName: string;
	keywords: string[];
	dateModified?: string;
	mainEntityId?: string;
}

export function webPageSchema(params: WebPageParams) {
	return {
		"@context": SCHEMA_CONTEXT,
		"@type": "WebPage" as const,
		"@id": params.pageUrl,
		url: params.pageUrl,
		name: params.title,
		description: params.description,
		inLanguage: "en-US",
		isPartOf: WEBSITE_REF,
		about: {
			"@type": "Thing" as const,
			name: params.aboutName,
		},
		mainEntity: {
			"@id": params.mainEntityId ?? params.pageUrl,
		},
		...(params.dateModified && { dateModified: params.dateModified }),
		keywords: params.keywords.join(", "),
	};
}

export function JsonLdScript({ data }: { data: Record<string, unknown> }) {
	return (
		<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
	);
}
