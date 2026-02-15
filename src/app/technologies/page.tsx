import { TechnologiesPageContent } from "./technologies-page-content";

import type { Metadata } from "next";

const siteUrl = "https://alexmayhew.dev";

export const metadata: Metadata = {
	title: "Technology Expertise | Technical Advisor",
	description:
		"Deep expertise in React, Next.js, TypeScript, Node.js, PostgreSQL, Python, FastAPI, and AI/ML. Production experience from startups to enterprise scale.",
	keywords: [
		"react developer",
		"next.js developer",
		"typescript developer",
		"node.js developer",
		"postgresql developer",
		"python developer",
		"fastapi developer",
		"ai ml developer",
		"technical advisor",
		"systems architect",
	],
	openGraph: {
		type: "website",
		locale: "en_US",
		url: `${siteUrl}/technologies`,
		siteName: "Alex Mayhew",
		title: "Technology Expertise | Technical Advisor",
		description:
			"Deep expertise in React, Next.js, TypeScript, Node.js, PostgreSQL, Python, FastAPI, and AI/ML.",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Technology Expertise",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Technology Expertise | Alex Mayhew",
		description: "Deep expertise in modern web technologies and AI/ML integration.",
		images: ["/og-image.png"],
		creator: "@alexmayhew",
	},
	alternates: {
		canonical: `${siteUrl}/technologies`,
	},
};

// JSON-LD for the hub page
function TechnologiesHubJsonLd() {
	const schema = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		"@id": `${siteUrl}/technologies`,
		url: `${siteUrl}/technologies`,
		name: "Technology Expertise",
		description:
			"Deep expertise in React, Next.js, TypeScript, Node.js, PostgreSQL, Python, FastAPI, and AI/ML.",
		isPartOf: {
			"@type": "WebSite",
			"@id": `${siteUrl}#website`,
			url: siteUrl,
			name: "Alex Mayhew",
		},
		mainEntity: {
			"@type": "ItemList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					name: "React & Next.js",
					url: `${siteUrl}/technologies/react-nextjs`,
				},
				{
					"@type": "ListItem",
					position: 2,
					name: "TypeScript",
					url: `${siteUrl}/technologies/typescript`,
				},
				{
					"@type": "ListItem",
					position: 3,
					name: "Node.js & Express",
					url: `${siteUrl}/technologies/nodejs-express`,
				},
				{
					"@type": "ListItem",
					position: 4,
					name: "PostgreSQL",
					url: `${siteUrl}/technologies/postgresql`,
				},
				{
					"@type": "ListItem",
					position: 5,
					name: "Python & FastAPI",
					url: `${siteUrl}/technologies/python-fastapi`,
				},
				{
					"@type": "ListItem",
					position: 6,
					name: "AI/ML Integration",
					url: `${siteUrl}/technologies/ai-ml-integration`,
				},
				{
					"@type": "ListItem",
					position: 7,
					name: "Cloud Architecture",
					url: `${siteUrl}/technologies/cloud-architecture`,
				},
				{
					"@type": "ListItem",
					position: 8,
					name: "GraphQL",
					url: `${siteUrl}/technologies/graphql`,
				},
			],
		},
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	);
}

export default function TechnologiesPage() {
	return (
		<>
			<TechnologiesHubJsonLd />
			<TechnologiesPageContent />
		</>
	);
}
