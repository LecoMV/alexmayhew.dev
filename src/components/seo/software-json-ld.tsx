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
		},
		author: { "@id": `${siteUrl}/#person` },
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
