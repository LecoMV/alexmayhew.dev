import { ServicesJsonLd } from "@/components/seo/json-ld";

import { ServicesPage } from "./services-page-content";

import type { Metadata } from "next";

const PAGE_TITLE = "Services";
const OG_IMAGE_PATH = "/og-image-2026.png";

const DESCRIPTION =
	"Web development, workflow automation, and applied AI. Available for contract and part-time work. WordPress, Next.js, Python, and the systems a business runs on.";

export const metadata: Metadata = {
	title: PAGE_TITLE,
	description: DESCRIPTION,
	openGraph: {
		title: PAGE_TITLE,
		description:
			"Web development, workflow automation, and applied AI. Available for contract and part-time work.",
		type: "website",
		images: [
			{
				url: OG_IMAGE_PATH,
				width: 1200,
				height: 630,
				alt: "Alex Mayhew - Services",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: PAGE_TITLE,
		description: "Web development, workflow automation, and applied AI.",
		images: [OG_IMAGE_PATH],
	},
	alternates: {
		canonical: "/services",
	},
};

export default function Page() {
	return (
		<>
			<ServicesJsonLd />
			<ServicesPage />
		</>
	);
}
