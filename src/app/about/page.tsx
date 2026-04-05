import { AboutPage } from "@/components/pages";
import { JsonLdScript, PERSON_REF, SCHEMA_CONTEXT, SITE_URL } from "@/components/seo/schema-utils";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "About",
	description:
		"Technical advisor helping founders make architectural decisions that compound into competitive advantage. Specializing in React, Next.js, TypeScript, and enterprise-grade systems.",
	openGraph: {
		title: "About",
		description:
			"Technical advisor partnering with select clients to architect enterprise-grade solutions. Specializing in React, Next.js, and system architecture.",
		type: "profile",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "About Alex Mayhew",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "About",
		description:
			"Technical advisor specializing in React, Next.js, and enterprise system architecture.",
		images: ["/og-image.png"],
	},
	alternates: {
		canonical: "/about",
	},
};

function AboutProfileJsonLd() {
	const schema = {
		"@context": SCHEMA_CONTEXT,
		"@type": "ProfilePage",
		"@id": `${SITE_URL}/about`,
		url: `${SITE_URL}/about`,
		name: "About Alex Mayhew",
		description:
			"Technical advisor helping founders make architectural decisions that compound into competitive advantage.",
		mainEntity: PERSON_REF,
		dateModified:
			process.env.NEXT_PUBLIC_BUILD_TIME?.split("T")[0] || new Date().toISOString().split("T")[0],
	};
	return <JsonLdScript data={schema} />;
}

export default function Page() {
	return (
		<>
			<AboutProfileJsonLd />
			<AboutPage />
		</>
	);
}
