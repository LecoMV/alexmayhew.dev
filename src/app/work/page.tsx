import { WorkPage } from "@/components/pages";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Work",
	description:
		"Selected projects and experiments in AI/ML, SaaS platforms, and web applications. Enterprise-grade solutions built with precision.",
	openGraph: {
		title: "Work | Alex Mayhew",
		description:
			"Selected projects in AI/ML, SaaS, and web applications. Enterprise-grade solutions built with precision.",
		type: "website",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Alex Mayhew - Portfolio",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Work | Alex Mayhew",
		description: "Selected projects in AI/ML, SaaS, and web applications.",
		images: ["/og-image.png"],
	},
};

export default function Page() {
	return <WorkPage />;
}
