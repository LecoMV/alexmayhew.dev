import { ToolsPage } from "@/components/pages";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Tools",
	description:
		"Developer tools built with precision. Try TraceForge for instant SVG vectorization or download Claude Pilot for Claude Code management.",
	openGraph: {
		title: "Tools | Alex Mayhew",
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
};

export default function Page() {
	return <ToolsPage />;
}
