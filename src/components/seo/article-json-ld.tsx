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
		image: image ? `${siteUrl}${image}` : `${siteUrl}/og-image.png`,
		datePublished: publishedAt.toISOString(),
		dateModified: (updatedAt ?? publishedAt).toISOString(),
		author: {
			"@type": "Person",
			name: "Alex Mayhew",
			url: siteUrl,
			jobTitle: "Technical Advisor & Systems Architect",
			sameAs: [
				"https://github.com/alexmayhew",
				"https://linkedin.com/in/alexmayhew",
				"https://x.com/alexmayhewdev",
			],
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
		isAccessibleForFree: true,
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
		/>
	);
}
