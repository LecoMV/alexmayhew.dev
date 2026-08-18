import { AboutPage } from "@/components/pages";
import { JsonLdScript, PERSON_REF, SCHEMA_CONTEXT, SITE_URL } from "@/components/seo/schema-utils";
import { publicEnv } from "@/lib/env";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "About",
	description:
		"Alex Mayhew, technology specialist: nine years running technology for a Massachusetts solar company, now building products and available for remote work.",
	openGraph: {
		title: "About",
		description:
			"Technology specialist: web, SEO, automation, and applied AI. Nine years as a one-person tech department; now building products at Mayhew Technology LLC.",
		type: "profile",
		images: [
			{
				url: "/og-image-2026.png",
				width: 1200,
				height: 630,
				alt: "About Alex Mayhew",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "About",
		description: "Technology specialist: web, SEO, automation, and applied AI.",
		images: ["/og-image-2026.png"],
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
			"Technology specialist: web, SEO, automation, and applied AI. Nine years as a one-person tech department for a Massachusetts solar company; now building products and available for remote work.",
		mainEntity: PERSON_REF,
		dateModified:
			publicEnv.NEXT_PUBLIC_BUILD_TIME?.split("T")[0] || new Date().toISOString().split("T")[0],
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
