interface SoftwareJsonLdProps {
	name: string;
	description: string;
	url: string;
	applicationCategory: string;
	operatingSystem: string;
	price?: string;
	priceCurrency?: string;
	featureList?: string[];
	softwareVersion?: string;
	downloadUrl?: string;
}

const siteUrl = "https://alexmayhew.dev";

export function SoftwareJsonLd({
	name,
	description,
	url,
	applicationCategory,
	operatingSystem,
	price = "0",
	priceCurrency = "USD",
	featureList,
	softwareVersion,
	downloadUrl,
}: SoftwareJsonLdProps) {
	const schema = {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name,
		description,
		url: `${siteUrl}${url}`,
		applicationCategory,
		operatingSystem,
		offers: {
			"@type": "Offer",
			price,
			priceCurrency,
			// availability is a rich-result gate for SoftwareApplication per
			// Google Search Central 2024+. Without it, the offers block is
			// ignored and the card loses price/free eligibility.
			availability: "https://schema.org/InStock",
		},
		author: { "@id": `${siteUrl}/#person` },
		publisher: { "@id": `${siteUrl}/#organization` },
		...(featureList && featureList.length > 0 && { featureList }),
		...(softwareVersion && { softwareVersion }),
		...(downloadUrl && { downloadUrl }),
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	);
}
