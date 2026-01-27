const siteUrl = "https://alexmayhew.dev";

export function ContactJsonLd() {
	const contactPageSchema = {
		"@context": "https://schema.org",
		"@type": "ContactPage",
		name: "Contact Alex Mayhew",
		description:
			"Get in touch for web development projects, technical consulting, or collaboration opportunities.",
		url: `${siteUrl}/contact`,
		mainEntity: {
			"@type": "Person",
			name: "Alex Mayhew",
			email: "alex@alexmayhew.dev",
			url: siteUrl,
			jobTitle: "Technical Advisor & Systems Architect",
			sameAs: [
				"https://github.com/LecoMV",
				"https://linkedin.com/in/alexmmayhew",
				"https://x.com/alexmayhewdev",
				"https://bsky.app/profile/alexmayhewdev.bsky.social",
			],
			contactPoint: {
				"@type": "ContactPoint",
				contactType: "customer service",
				email: "alex@alexmayhew.dev",
				availableLanguage: ["English", "Spanish"],
				areaServed: "Worldwide",
			},
		},
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
		/>
	);
}
