const SCHEMA_CONTEXT = "https://schema.org";
const SITE_URL = "https://alexmayhew.dev";
const PERSON_ID = "https://alexmayhew.dev/#person";
const ORGANIZATION_ID = "https://alexmayhew.dev/#organization";
const OG_IMAGE_URL = "https://alexmayhew.dev/og-image-2026.png";
const TECHNICAL_DUE_DILIGENCE_LABEL = "Technical Due Diligence";
const SOCIAL_PROFILES = [
	"https://github.com/LecoMV",
	"https://www.linkedin.com/in/alexmmayhew",
	"https://x.com/alexmayhewdev",
	"https://bsky.app/profile/alexmayhewdev.bsky.social",
	"https://dev.to/alexmayhewdev",
];

export function JsonLd() {
	const personSchema = {
		"@context": SCHEMA_CONTEXT,
		"@type": "Person",
		"@id": PERSON_ID,
		name: "Alex Mayhew",
		url: SITE_URL,
		sameAs: SOCIAL_PROFILES,
		jobTitle: "Technology Specialist",
		worksFor: { "@id": ORGANIZATION_ID },
		description:
			"Technology specialist working across web development, SEO, workflow automation, applied AI, and solar PV design. Nine years as the one-person tech department for a Massachusetts solar company; now building products at Mayhew Technology LLC and available for remote work.",
		// Exact-axis disambiguation for a common name: positive, unique facts
		// only. "Alex Mayhew" collides with a well-known new-media artist; the
		// 2026-08 entity research is explicit that NAMING the namesake would
		// co-occur the two entities in the graph, so we assert identity by
		// distinct attributes (software focus, the LLC, the MA solar history).
		disambiguatingDescription:
			"Software and web technology specialist and founder of Mayhew Technology LLC in Massachusetts. Nine years as the solo technologist for a Martha's Vineyard solar company; works in WordPress, Next.js, Python, workflow automation, and applied AI.",
		knowsLanguage: ["en"],
		// Career history, machine-readable. Dates must mirror /resume and LinkedIn;
		// the Role wrapper is the schema.org pattern for dated occupations.
		hasOccupation: [
			{
				"@type": "Role",
				startDate: "2025-08",
				description:
					"Self-employed: web, automation, and AI services. Operating as Mayhew Technology LLC since 2026-03-30.",
				hasOccupation: {
					"@type": "Occupation",
					name: "Technology Specialist (Self-Employed)",
					occupationLocation: { "@type": "Country", name: "United States" },
				},
			},
			{
				"@type": "Role",
				startDate: "2016-03",
				endDate: "2025-12",
				description:
					"Harvest Sun Solar, Martha's Vineyard and Cape Cod, MA (company closed 2025). Solar design, permitting, internal software, marketing, and IT.",
				hasOccupation: {
					"@type": "Occupation",
					name: "Senior PV Systems Designer & Technology Specialist",
					occupationLocation: { "@type": "State", name: "Massachusetts" },
				},
			},
		],
		knowsAbout: [
			// Web
			"WordPress",
			"Next.js",
			"React",
			"TypeScript",
			"Node.js",
			"Python",
			"PostgreSQL",
			"Redis",
			"REST APIs",
			// Infrastructure
			"AWS",
			"Cloudflare Workers",
			"Docker",
			"Linux Server Administration",
			// Practice areas
			"Technical SEO",
			"Workflow Automation",
			"Web Scraping",
			"AI/ML Integration",
			"Self-hosted LLMs",
			"System Architecture",
			"Performance Optimization",
			"SaaS Development",
			"Solar PV Design",
		],
	};

	const organizationSchema = {
		"@context": SCHEMA_CONTEXT,
		"@type": "Organization",
		"@id": ORGANIZATION_ID,
		name: "Mayhew Technology LLC",
		url: SITE_URL,
		logo: {
			"@type": "ImageObject",
			url: OG_IMAGE_URL,
			width: 1200,
			height: 630,
		},
		founder: { "@id": PERSON_ID },
		description:
			"Independent product and web studio of Alex Mayhew: web applications, automations, and AI tools, plus selected client work.",
		foundingDate: "2026-03-30",
		areaServed: [
			{ "@type": "Country", name: "United States" },
			{ "@type": "Place", name: "Remote / Worldwide" },
		],
		knowsAbout: [
			"Web Development",
			"Workflow Automation",
			"AI/ML Integration",
			"SaaS Development",
			"Technical SEO",
		],
	};

	const websiteSchema = {
		"@context": SCHEMA_CONTEXT,
		"@type": "WebSite",
		"@id": "https://alexmayhew.dev/#website",
		name: "Alex Mayhew",
		alternateName: "alexmayhew.dev",
		url: SITE_URL,
		description: "Portfolio and blog of Alex Mayhew - Technology Specialist",
		author: { "@id": PERSON_ID },
		publisher: { "@id": ORGANIZATION_ID },
		// SearchAction unlocks the sitelinks searchbox in Google SERP. Target
		// points at the blog listing (closest thing we have to a sitewide
		// search surface); Google substitutes {search_term_string} at crawl time.
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
			},
			"query-input": "required name=search_term_string",
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
				dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
			/>
		</>
	);
}

// Rendered ONLY on /services: business/commerce signals stay scoped to the
// route that sells instead of shipping on every page of a personal site.
export function ServicesJsonLd() {
	const professionalServiceSchema = {
		"@context": SCHEMA_CONTEXT,
		"@type": "ProfessionalService",
		"@id": "https://alexmayhew.dev/#business",
		name: "Mayhew Technology LLC",
		url: `${SITE_URL}/services`,
		logo: "https://alexmayhew.dev/favicon.svg",
		image: OG_IMAGE_URL,
		founder: { "@id": PERSON_ID },
		description:
			"Web development, workflow automation, and applied-AI services by Alex Mayhew. Available for contract and fractional engagements.",
		address: {
			"@type": "PostalAddress",
			addressLocality: "East Falmouth",
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
			"Web Development",
			"WordPress",
			"Next.js",
			"Workflow Automation",
			"AI/ML Integration",
			"Technical SEO",
			"Web Scraping",
			TECHNICAL_DUE_DILIGENCE_LABEL,
		],
		areaServed: [
			{ "@type": "State", name: "Massachusetts" },
			{ "@type": "Country", name: "United States" },
			{ "@type": "Place", name: "Remote / Worldwide" },
		],
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: "Services",
			itemListElement: [
				{
					"@type": "Offer",
					name: "Web Development & Maintenance",
					itemOffered: {
						"@type": "Service",
						name: "Web Development & Maintenance",
						description:
							"Sites and small web applications: WordPress, Next.js, and Python. Builds, migrations, hosting, and ongoing support.",
					},
				},
				{
					"@type": "Offer",
					name: "Automation & Integrations",
					itemOffered: {
						"@type": "Service",
						name: "Automation & Integrations",
						description:
							"Workflow automation and systems integration: n8n, REST APIs, data extraction, and AI-assisted pipelines.",
					},
				},
				{
					"@type": "Offer",
					name: TECHNICAL_DUE_DILIGENCE_LABEL,
					itemOffered: {
						"@type": "Service",
						name: TECHNICAL_DUE_DILIGENCE_LABEL,
						description:
							"Technical assessment of codebases and infrastructure: audit, architecture review, and risk identification.",
					},
				},
			],
		},
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
		/>
	);
}
