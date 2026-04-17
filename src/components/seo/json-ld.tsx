const SCHEMA_CONTEXT = "https://schema.org";
const SITE_URL = "https://alexmayhew.dev";
const PERSON_ID = "https://alexmayhew.dev/#person";
const ORGANIZATION_ID = "https://alexmayhew.dev/#organization";
const OG_IMAGE_URL = "https://alexmayhew.dev/og-image.png";
const TECHNICAL_DUE_DILIGENCE_LABEL = "Technical Due Diligence";
const SOCIAL_PROFILES = [
	"https://github.com/LecoMV",
	"https://www.linkedin.com/in/alexmmayhew",
	"https://x.com/alexmayhewdev",
	"https://bsky.app/profile/alexmayhewdev.bsky.social",
];

export function JsonLd() {
	const personSchema = {
		"@context": SCHEMA_CONTEXT,
		"@type": "Person",
		"@id": PERSON_ID,
		name: "Alex Mayhew",
		url: SITE_URL,
		image: OG_IMAGE_URL,
		sameAs: SOCIAL_PROFILES,
		jobTitle: "Technical Advisor & Systems Architect",
		worksFor: { "@id": ORGANIZATION_ID },
		description:
			"Technical advisor with 15+ years experience in software engineering leadership, helping founders and CTOs make architectural decisions that compound into competitive advantage. Specializing in system architecture, performance engineering, and strategic technology selection.",
		knowsLanguage: ["en"],
		hasCredential: [
			{
				"@type": "EducationalOccupationalCredential",
				credentialCategory: "Professional Experience",
				name: "15+ Years Software Engineering Leadership",
				description:
					"Principal-level engineering experience across fintech, healthcare, e-commerce, and B2B SaaS. 30+ startups advised.",
			},
			{
				"@type": "EducationalOccupationalCredential",
				credentialCategory: "Specialization",
				name: "Systems Architecture & Performance Engineering",
				description:
					"Technical due diligence, multi-tenant SaaS architecture, edge computing, and AI/ML integration.",
			},
		],
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
			TECHNICAL_DUE_DILIGENCE_LABEL,
		],
		award: [
			"337x performance improvement - TraceForge vectorization engine",
			"73% cost reduction - PhotoKeep Pro AI restoration",
			"400% revenue increase - e-commerce platform architecture overhaul",
			"$2M+ infrastructure savings - strategic cloud optimization",
		],
	};

	const organizationSchema = {
		"@context": SCHEMA_CONTEXT,
		"@type": "Organization",
		"@id": ORGANIZATION_ID,
		name: "Alex Mayhew",
		url: SITE_URL,
		logo: {
			"@type": "ImageObject",
			url: OG_IMAGE_URL,
			width: 1200,
			height: 630,
		},
		founder: { "@id": PERSON_ID },
		sameAs: SOCIAL_PROFILES,
	};

	const websiteSchema = {
		"@context": SCHEMA_CONTEXT,
		"@type": "WebSite",
		"@id": "https://alexmayhew.dev/#website",
		name: "Alex Mayhew",
		alternateName: "alexmayhew.dev",
		url: SITE_URL,
		description: "Portfolio and blog of Alex Mayhew - Technical Advisor & Systems Architect",
		author: { "@id": PERSON_ID },
		publisher: { "@id": ORGANIZATION_ID },
	};

	// Single unified business entity ... combines consulting service + local business signals
	const professionalServiceSchema = {
		"@context": SCHEMA_CONTEXT,
		"@type": "ConsultingService",
		"@id": "https://alexmayhew.dev/#business",
		name: "Alex Mayhew - Technical Advisory Services",
		alternateName: "Alex Mayhew Consulting",
		url: SITE_URL,
		logo: "https://alexmayhew.dev/favicon.svg",
		image: OG_IMAGE_URL,
		founder: { "@id": PERSON_ID },
		description:
			"Strategic technical guidance for founders and CTOs. Architecture decisions that compound into competitive advantage. Specializing in SaaS, Fintech, Healthcare, and high-growth startups.",
		// priceRange removed 2026-04-17: non-enum values like "$$$$" are ignored
		// by Google. Actual pricing lives in hasOfferCatalog.priceSpecification below.
		currenciesAccepted: "USD",
		paymentAccepted: "Bank Transfer, Credit Card",
		address: {
			"@type": "PostalAddress",
			addressLocality: "Boston",
			addressRegion: "MA",
			addressCountry: "US",
		},
		email: "alex@alexmayhew.dev",
		contactPoint: {
			"@type": "ContactPoint",
			contactType: "customer service",
			email: "alex@alexmayhew.dev",
			url: "https://alexmayhew.dev/contact",
			availableLanguage: ["English"],
		},
		knowsAbout: [
			"Software Architecture",
			"SaaS Development",
			"Next.js",
			"React",
			"TypeScript",
			"Node.js",
			"Python",
			"PostgreSQL",
			"AI/ML Integration",
			"Performance Engineering",
			"Cloud Architecture",
			TECHNICAL_DUE_DILIGENCE_LABEL,
		],
		areaServed: [
			{ "@type": "City", name: "Boston" },
			{ "@type": "State", name: "Massachusetts" },
			{ "@type": "Country", name: "United States" },
			{ "@type": "Country", name: "United Kingdom" },
			{ "@type": "Country", name: "Canada" },
			{ "@type": "Country", name: "Australia" },
			{ "@type": "Place", name: "Remote / Worldwide" },
		],
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
					name: TECHNICAL_DUE_DILIGENCE_LABEL,
					itemOffered: {
						"@type": "Service",
						name: TECHNICAL_DUE_DILIGENCE_LABEL,
						description:
							"Comprehensive technical assessment for investors and acquirers. Codebase audit, architecture review, team evaluation, risk identification.",
					},
				},
			],
		},
		sameAs: SOCIAL_PROFILES,
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
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
