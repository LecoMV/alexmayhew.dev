interface ArticleJsonLdProps {
	title: string;
	description: string;
	publishedAt: Date;
	updatedAt?: Date;
	image?: string;
	slug: string;
	category: string;
	tags?: string[];
	isHub?: boolean;
}

const siteUrl = "https://alexmayhew.dev";

export function ArticleJsonLd({
	title,
	description,
	publishedAt,
	updatedAt,
	image,
	slug,
	category,
	tags = [],
	isHub = false,
}: ArticleJsonLdProps) {
	const articleSchema = {
		"@context": "https://schema.org",
		"@type": isHub ? "TechArticle" : "Article",
		headline: title,
		description: description,
		image: {
			"@type": "ImageObject",
			url: image ? `${siteUrl}${image}` : `${siteUrl}/og-image.png`,
			width: 1200,
			height: 630,
		},
		datePublished: publishedAt.toISOString(),
		dateModified: (updatedAt ?? publishedAt).toISOString(),
		author: { "@id": "https://alexmayhew.dev/#person" },
		publisher: { "@id": "https://alexmayhew.dev/#person" },
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `${siteUrl}/blog/${slug}`,
		},
		articleSection: category,
		keywords: tags.join(", "),
		inLanguage: "en-US",
		isAccessibleForFree: true,
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
		/>
	);
}
