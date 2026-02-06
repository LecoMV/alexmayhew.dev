const siteUrl = "https://alexmayhew.dev";

interface BreadcrumbItem {
	name: string;
	url: string;
}

interface BreadcrumbJsonLdProps {
	items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
	const breadcrumbSchema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`,
		})),
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
		/>
	);
}
