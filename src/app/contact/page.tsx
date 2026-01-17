import type { Metadata } from "next";
import { ContactPage } from "@/components/pages";
import { ContactJsonLd } from "@/components/seo";

export const metadata: Metadata = {
	title: "Contact",
	description:
		"Get in touch for web development projects, technical consulting, or collaboration opportunities. Available for freelance work worldwide.",
	openGraph: {
		title: "Contact | Alex Mayhew",
		description:
			"Get in touch for web development projects, consulting, or collaboration. Available worldwide.",
		type: "website",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Contact Alex Mayhew",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Contact | Alex Mayhew",
		description: "Get in touch for web development projects and consulting.",
		images: ["/og-image.png"],
	},
};

export default function Page() {
	return (
		<>
			<ContactJsonLd />
			<ContactPage />
		</>
	);
}
