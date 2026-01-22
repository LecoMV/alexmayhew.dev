import type { Metadata } from "next";

export const metadata: Metadata = {
	title: {
		template: "%s | Tools | Alex Mayhew",
		default: "Tools | Alex Mayhew",
	},
	description:
		"Developer tools built with precision. Try TraceForge for instant SVG vectorization or download Claude Pilot for Claude Code management.",
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
