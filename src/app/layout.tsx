import type { Metadata } from "next";
import { inter, jetbrainsMono } from "./fonts";
import "./globals.css";
import { NoiseOverlay } from "@/components/ui/noise-overlay";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";

export const metadata: Metadata = {
	title: "Alex Mayhew | Full-Stack Developer",
	description:
		"Atmospheric Engineering. Crafting high-precision digital instruments for the modern web.",
	keywords: ["web developer", "full-stack", "react", "next.js", "typescript"],
	authors: [{ name: "Alex Mayhew" }],
	openGraph: {
		title: "Alex Mayhew | Full-Stack Developer",
		description: "Atmospheric Engineering. High-precision digital instruments for the web.",
		type: "website",
		locale: "en_US",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
			<body className="relative min-h-screen overflow-x-hidden">
				<NoiseOverlay />
				<SmoothScroll>
					<Navigation />
					<div className="relative z-10 flex min-h-screen flex-col">
						{children}
						<Footer />
					</div>
				</SmoothScroll>
			</body>
		</html>
	);
}
