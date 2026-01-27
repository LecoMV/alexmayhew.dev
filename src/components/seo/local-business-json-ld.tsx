export function LocalBusinessJsonLd() {
	const localBusinessSchema = {
		"@context": "https://schema.org",
		"@type": "ProfessionalService",
		"@id": "https://alexmayhew.dev/#localbusiness",
		name: "Alex Mayhew - Technical Advisor",
		alternateName: "Alex Mayhew Consulting",
		url: "https://alexmayhew.dev",
		logo: "https://alexmayhew.dev/favicon.svg",
		image: "https://alexmayhew.dev/og-image.png",
		description:
			"Boston-based technical advisor helping startups and scale-ups make strategic technology decisions. Remote and on-site consulting for the Greater Boston area and worldwide.",

		// Boston address for local SEO
		address: {
			"@type": "PostalAddress",
			addressLocality: "Boston",
			addressRegion: "MA",
			addressCountry: "US",
		},

		// Geographic coverage
		areaServed: [
			{
				"@type": "City",
				name: "Boston",
				containedInPlace: {
					"@type": "State",
					name: "Massachusetts",
				},
			},
			{
				"@type": "State",
				name: "Massachusetts",
			},
			{
				"@type": "AdministrativeArea",
				name: "New England",
			},
			{
				"@type": "Country",
				name: "United States",
			},
			{
				"@type": "Place",
				name: "Remote / Worldwide",
			},
		],

		// Contact
		email: "alex@alexmayhew.dev",
		contactPoint: {
			"@type": "ContactPoint",
			contactType: "customer service",
			email: "alex@alexmayhew.dev",
			url: "https://alexmayhew.dev/contact",
			availableLanguage: ["English"],
		},

		// Business details
		priceRange: "$$$$",
		currenciesAccepted: "USD",
		paymentAccepted: "Bank Transfer, Credit Card",

		// Services offered
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: "Technical Advisory Services",
			itemListElement: [
				{
					"@type": "OfferCatalog",
					name: "Architecture & Strategy",
					itemListElement: [
						"System Architecture Design",
						"Technical Due Diligence",
						"Technology Stack Selection",
						"Performance Optimization",
					],
				},
				{
					"@type": "OfferCatalog",
					name: "Development Services",
					itemListElement: [
						"Next.js / React Development",
						"Node.js / Python Backend",
						"Legacy System Migration",
						"API Integration",
					],
				},
				{
					"@type": "OfferCatalog",
					name: "Advisory Retainer",
					itemListElement: [
						"Ongoing Technical Guidance",
						"Architecture Reviews",
						"Hiring Support",
						"Vendor Evaluation",
					],
				},
			],
		},

		// Knowledge areas for semantic matching
		knowsAbout: [
			"Software Architecture",
			"SaaS Development",
			"Fintech Technology",
			"Healthcare Technology",
			"Startup Technical Strategy",
			"Legacy Migration",
			"Performance Engineering",
			"AI/ML Integration",
		],

		// Social profiles
		sameAs: [
			"https://github.com/LecoMV",
			"https://www.linkedin.com/in/alexmmayhew",
			"https://x.com/alexmayhewdev",
		],
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
		/>
	);
}
