import type { Metadata } from "next";
import { AboutPage } from "@/components/pages";

export const metadata: Metadata = {
	title: "About",
	description:
		"Full-stack developer with 6+ years of experience building high-precision digital instruments. Specializing in React, Next.js, TypeScript, and system architecture.",
	openGraph: {
		title: "About | Alex Mayhew",
		description:
			"Full-stack developer with 6+ years experience. Specializing in React, Next.js, and system architecture.",
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
		description: "Full-stack developer specializing in React, Next.js, and system architecture.",
		images: ["/og-image.png"],
	},
};

export default function Page() {
	return <AboutPage />;
}
