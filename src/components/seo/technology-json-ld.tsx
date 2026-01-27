import type { Technology } from "@/data/pseo/technologies";

interface TechnologyJsonLdProps {
	technology: Technology;
}

export function TechnologyJsonLd({ technology }: TechnologyJsonLdProps) {
	const siteUrl = "https://alexmayhew.dev";
	const pageUrl = `${siteUrl}/technologies/${technology.id}`;

	// Service schema - represents the development service offered
	const serviceSchema = {
		"@context": "https://schema.org",
		"@type": "Service",
		"@id": `${pageUrl}#service`,
		name: `${technology.displayName} Development`,
		description: technology.expertiseLevel,
		provider: {
			"@type": "Person",
			name: "Alex Mayhew",
			url: siteUrl,
			jobTitle: "Technical Advisor & Systems Architect",
		},
		serviceType: "Software Development",
		areaServed: {
			"@type": "Place",
			name: "Worldwide",
		},
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: `${technology.displayName} Services`,
			itemListElement: technology.projectTypes.map((projectType, index) => ({
				"@type": "Offer",
				itemOffered: {
					"@type": "Service",
					name: `${technology.displayName} for ${projectType}`,
				},
				position: index + 1,
			})),
		},
	};

	// ItemList schema for best practices - helps with featured snippets
	const bestPracticesSchema = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: `${technology.displayName} Best Practices`,
		description: `Expert best practices for ${technology.displayName} development`,
		itemListElement: technology.bestPractices.map((practice, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: practice.slice(0, 100),
			description: practice,
		})),
	};

	// ItemList schema for common pitfalls
	const pitfallsSchema = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: `${technology.displayName} Common Pitfalls`,
		description: `Common mistakes to avoid in ${technology.displayName} development`,
		itemListElement: technology.commonPitfalls.map((pitfall, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: pitfall.slice(0, 100),
			description: pitfall,
		})),
	};

	// WebPage schema
	const webPageSchema = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		"@id": pageUrl,
		url: pageUrl,
		name: `${technology.displayName} Developer | Technical Advisor`,
		description: technology.expertiseLevel,
		isPartOf: {
			"@type": "WebSite",
			"@id": `${siteUrl}#website`,
			url: siteUrl,
			name: "Alex Mayhew",
		},
		about: {
			"@type": "Thing",
			name: technology.displayName,
		},
		mainEntity: {
			"@id": `${pageUrl}#service`,
		},
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
				name: "Technologies",
				item: `${siteUrl}/technologies`,
			},
			{
				"@type": "ListItem",
				position: 3,
				name: technology.displayName,
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
				dangerouslySetInnerHTML={{ __html: JSON.stringify(bestPracticesSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(pitfallsSchema) }}
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
