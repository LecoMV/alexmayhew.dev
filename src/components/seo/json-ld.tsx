export function JsonLd() {
	const personSchema = {
		"@context": "https://schema.org",
		"@type": "Person",
		name: "Alex Mayhew",
		url: "https://alexmayhew.dev",
		image: "https://alexmayhew.dev/og-image.png",
		sameAs: [
			"https://github.com/LecoMV",
			"https://linkedin.com/in/alexmayhew",
			"https://twitter.com/alexmayhew",
		],
		jobTitle: "Full-Stack Developer & Software Architect",
		worksFor: {
			"@type": "Organization",
			name: "Freelance",
		},
		description:
			"Full-stack web developer specializing in modern web technologies, system architecture, and performance optimization.",
		knowsAbout: [
			"Web Development",
			"React",
			"Next.js",
			"TypeScript",
			"Node.js",
			"PostgreSQL",
			"System Architecture",
			"Performance Optimization",
			"Cloud Infrastructure",
		],
	};

	const websiteSchema = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "Alex Mayhew",
		alternateName: "alexmayhew.dev",
		url: "https://alexmayhew.dev",
		description: "Portfolio and blog of Alex Mayhew - Full-Stack Developer & Software Architect",
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
		name: "Alex Mayhew - Web Development Services",
		url: "https://alexmayhew.dev",
		logo: "https://alexmayhew.dev/favicon.svg",
		description:
			"Custom web application development, SaaS platform development, performance optimization, and technical consulting.",
		priceRange: "$$$$",
		areaServed: {
			"@type": "Place",
			name: "Worldwide",
		},
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: "Web Development Services",
			itemListElement: [
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: "Full-Stack Development",
						description: "End-to-end web applications built with modern frameworks",
					},
				},
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: "System Architecture",
						description: "Scalable, maintainable systems designed for growth",
					},
				},
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: "Performance Engineering",
						description: "Optimized experiences with sub-second load times",
					},
				},
			],
		},
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
