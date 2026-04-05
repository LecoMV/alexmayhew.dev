import { PERSON_REF, SCHEMA_CONTEXT, SITE_URL } from "./schema-utils";

export function ContactJsonLd() {
	const contactPageSchema = {
		"@context": SCHEMA_CONTEXT,
		"@type": "ContactPage",
		name: "Contact Alex Mayhew",
		description:
			"Get in touch for web development projects, technical consulting, or collaboration opportunities.",
		url: `${SITE_URL}/contact`,
		mainEntity: PERSON_REF,
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
		/>
	);
}
