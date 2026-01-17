interface ArticleJsonLdProps {
	title: string;
	description: string;
	publishedAt: Date;
	image?: string;
	slug: string;
	category: string;
	tags?: string[];
}

const siteUrl = "https://alexmayhew.dev";

export function ArticleJsonLd({
	title,
	description,
	publishedAt,
	image,
	slug,
	category,
	tags = [],
}: ArticleJsonLdProps) {
	const articleSchema = {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: title,
		description: description,
		image: image ? `${siteUrl}${image}` : `${siteUrl}/og-image.png`,
		datePublished: publishedAt.toISOString(),
		dateModified: publishedAt.toISOString(),
		author: {
			"@type": "Person",
			name: "Alex Mayhew",
			url: siteUrl,
		},
		publisher: {
			"@type": "Person",
			name: "Alex Mayhew",
			url: siteUrl,
			logo: {
				"@type": "ImageObject",
				url: `${siteUrl}/favicon.svg`,
			},
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `${siteUrl}/blog/${slug}`,
		},
		articleSection: category,
		keywords: tags.join(", "),
		inLanguage: "en-US",
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
		/>
	);
}
