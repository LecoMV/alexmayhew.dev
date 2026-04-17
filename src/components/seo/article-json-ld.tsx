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
	series?: string;
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
	series,
}: ArticleJsonLdProps) {
	const articleSchema = {
		"@context": "https://schema.org",
		"@type": isHub ? "TechArticle" : "BlogPosting",
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
		publisher: { "@id": "https://alexmayhew.dev/#organization" },
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `${siteUrl}/${slug}`,
		},
		articleSection: category,
		keywords: tags.join(", "),
		inLanguage: "en-US",
		isAccessibleForFree: true,
		...(series && {
			isPartOf: {
				"@type": "CreativeWorkSeries",
				name: series,
			},
		}),
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
		/>
	);
}
