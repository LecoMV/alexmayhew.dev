import type { Metadata } from "next";
import { inter, jetbrainsMono } from "./fonts";
import "./globals.css";
import { NoiseOverlay } from "@/components/ui/noise-overlay";
import { SmoothScroll } from "@/components/providers/smooth-scroll";

export const metadata: Metadata = {
	title: "Alex Mayhew | Creative Technologist",
	description: "Atmospheric Engineering. Creative Technologist.",
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
					<div className="relative z-10 flex min-h-screen flex-col">{children}</div>
				</SmoothScroll>
			</body>
		</html>
	);
}
