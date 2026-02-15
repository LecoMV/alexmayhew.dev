import { AboutPage } from "@/components/pages";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "About",
	description:
		"Technical advisor helping founders make architectural decisions that compound into competitive advantage. Specializing in React, Next.js, TypeScript, and enterprise-grade systems.",
	openGraph: {
		title: "About | Alex Mayhew",
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
		title: "About | Alex Mayhew",
		description:
			"Technical advisor specializing in React, Next.js, and enterprise system architecture.",
		images: ["/og-image.png"],
	},
};

export default function Page() {
	return <AboutPage />;
}
