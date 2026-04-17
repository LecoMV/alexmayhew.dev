import { ToolsPage } from "@/components/pages";
import { WEBSITE_REF } from "@/components/seo/schema-utils";

import type { Metadata } from "next";

const siteUrl = "https://alexmayhew.dev";

const tools = [
	{ name: "TraceForge", slug: "traceforge" },
	{ name: "Claude Pilot", slug: "pilot" },
	{ name: "Voice Cloner", slug: "voice-cloner" },
	{ name: "SaaS Scaling Readiness Assessment", slug: "saas-readiness" },
];

export const metadata: Metadata = {
	title: "Tools",
	description:
		"Developer tools built with precision. Try TraceForge for instant SVG vectorization or download Claude Pilot for Claude Code management.",
	openGraph: {
		title: "Tools",
		description: "Developer tools built with precision. TraceForge, Claude Pilot, and more.",
		type: "website",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Alex Mayhew - Tools",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Tools",
		description: "Developer tools built with precision. TraceForge, Claude Pilot, and more.",
		images: ["/og-image.png"],
	},
	alternates: {
		canonical: "/tools",
	},
};

function ToolsCollectionJsonLd() {
	const schema = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		"@id": `${siteUrl}/tools`,
		url: `${siteUrl}/tools`,
		name: "Tools",
		description: "Developer tools built with precision.",
		isPartOf: WEBSITE_REF,
		mainEntity: {
			"@type": "ItemList",
			itemListElement: tools.map((tool, index) => ({
				"@type": "ListItem",
				position: index + 1,
				name: tool.name,
				url: `${siteUrl}/tools/${tool.slug}`,
			})),
		},
	};
	// JSON.stringify emits a server-controlled object; no user input flows in.
	const html = JSON.stringify(schema);

	return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function Page() {
	return (
		<>
			<ToolsCollectionJsonLd />
			<ToolsPage />
		</>
	);
}
