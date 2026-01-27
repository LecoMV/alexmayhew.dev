export function JsonLd() {
	const personSchema = {
		"@context": "https://schema.org",
		"@type": "Person",
		name: "Alex Mayhew",
		url: "https://alexmayhew.dev",
		image: "https://alexmayhew.dev/og-image.png",
		sameAs: [
			"https://github.com/LecoMV",
			"https://www.linkedin.com/in/alexmmayhew",
			"https://x.com/alexmayhewdev",
			"https://bsky.app/profile/alexmayhewdev.bsky.social",
		],
		jobTitle: "Technical Advisor & Systems Architect",
		worksFor: {
			"@type": "Organization",
			name: "Alex Mayhew Consulting",
		},
		description:
			"Technical advisor helping founders and CTOs make architectural decisions that compound into competitive advantage. Specializing in system architecture, performance engineering, and strategic technology selection.",
		knowsAbout: [
			// Core Technologies
			"Next.js",
			"React",
			"TypeScript",
			"Node.js",
			"Python",
			"PostgreSQL",
			"Redis",
			"GraphQL",
			"REST APIs",
			// Infrastructure
			"AWS",
			"Cloudflare Workers",
			"Docker",
			"Kubernetes",
			"Edge Computing",
			"Serverless Architecture",
			// Specializations
			"System Architecture",
			"Performance Optimization",
			"Legacy Migration",
			"AI/ML Integration",
			"Core Web Vitals",
			"SaaS Development",
			"Multi-tenant Architecture",
			// Domains
			"Fintech Development",
			"Healthcare Technology",
			"E-commerce Platforms",
			"B2B SaaS",
			"Technical Due Diligence",
		],
		award: [
			"337x performance improvement - TraceForge vectorization engine",
			"73% cost reduction - PhotoKeep Pro AI restoration",
			"400% revenue increase - e-commerce platform architecture overhaul",
			"$2M+ infrastructure savings - strategic cloud optimization",
		],
	};

	const websiteSchema = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "Alex Mayhew",
		alternateName: "alexmayhew.dev",
		url: "https://alexmayhew.dev",
		description: "Portfolio and blog of Alex Mayhew - Technical Advisor & Systems Architect",
		author: {
			"@type": "Person",
			name: "Alex Mayhew",
		},
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: "https://alexmayhew.dev/blog?q={search_term_string}",
			},
			"query-input": "required name=search_term_string",
		},
	};

	const professionalServiceSchema = {
		"@context": "https://schema.org",
		"@type": "ProfessionalService",
		name: "Alex Mayhew - Technical Advisory Services",
		url: "https://alexmayhew.dev",
		logo: "https://alexmayhew.dev/favicon.svg",
		description:
			"Strategic technical guidance for founders and CTOs. Architecture decisions that compound into competitive advantage. Specializing in SaaS, Fintech, Healthcare, and high-growth startups.",
		priceRange: "$$$$",
		areaServed: {
			"@type": "Place",
			name: "Worldwide",
		},
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: "Technical Advisory Services",
			itemListElement: [
				{
					"@type": "Offer",
					name: "Advisory Retainer",
					itemOffered: {
						"@type": "Service",
						name: "Advisory Retainer",
						description:
							"Ongoing strategic guidance: architecture reviews, hiring support, vendor evaluation, and due diligence preparation. 10-20 hours monthly.",
					},
					priceSpecification: {
						"@type": "PriceSpecification",
						priceCurrency: "USD",
						minPrice: 2000,
						maxPrice: 8000,
						unitText: "MONTH",
					},
				},
				{
					"@type": "Offer",
					name: "Strategic Implementation",
					itemOffered: {
						"@type": "Service",
						name: "Strategic Implementation",
						description:
							"Hands-on architectural work for critical projects. MVP development, infrastructure setup, performance optimization, security hardening.",
					},
					priceSpecification: {
						"@type": "PriceSpecification",
						priceCurrency: "USD",
						minPrice: 15000,
						maxPrice: 200000,
					},
				},
				{
					"@type": "Offer",
					name: "Technical Due Diligence",
					itemOffered: {
						"@type": "Service",
						name: "Technical Due Diligence",
						description:
							"Comprehensive technical assessment for investors and acquirers. Codebase audit, architecture review, team evaluation, risk identification.",
					},
				},
			],
		},
		// Service areas for local SEO signals
		serviceArea: [
			{ "@type": "Country", name: "United States" },
			{ "@type": "Country", name: "United Kingdom" },
			{ "@type": "Country", name: "Canada" },
			{ "@type": "Country", name: "Australia" },
		],
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
			/>
		</>
	);
}
