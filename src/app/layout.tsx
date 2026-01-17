import type { Metadata, Viewport } from "next";
import { inter, jetbrainsMono } from "./fonts";
import "./globals.css";
import { NoiseOverlay } from "@/components/ui/noise-overlay";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { ChatWidget } from "@/components/chat";
import { JsonLd } from "@/components/seo";
import { CloudflareAnalytics } from "@/components/analytics";

const siteUrl = "https://alexmayhew.dev";

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
	userScalable: true,
	themeColor: [
		{ media: "(prefers-color-scheme: dark)", color: "#0B0E14" },
		{ media: "(prefers-color-scheme: light)", color: "#0B0E14" },
	],
	colorScheme: "dark",
	viewportFit: "cover",
};

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: "Alex Mayhew | Full-Stack Developer & Software Architect",
		template: "%s | Alex Mayhew",
	},
	description:
		"Atmospheric Engineering. Crafting high-precision digital instruments for the modern web. Full-stack development, system architecture, and performance optimization.",
	keywords: [
		"web developer",
		"full-stack developer",
		"software architect",
		"react developer",
		"next.js developer",
		"typescript",
		"node.js",
		"freelance developer",
		"web application development",
		"SaaS development",
		"performance optimization",
	],
	authors: [{ name: "Alex Mayhew", url: siteUrl }],
	creator: "Alex Mayhew",
	publisher: "Alex Mayhew",
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	icons: {
		icon: "/favicon.svg",
		shortcut: "/favicon.svg",
		apple: "/apple-touch-icon.png",
	},
	manifest: "/site.webmanifest",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: siteUrl,
		siteName: "Alex Mayhew",
		title: "Alex Mayhew | Full-Stack Developer & Software Architect",
		description:
			"Atmospheric Engineering. Crafting high-precision digital instruments for the modern web.",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Alex Mayhew - Full-Stack Developer",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Alex Mayhew | Full-Stack Developer",
		description: "Atmospheric Engineering. High-precision digital instruments for the web.",
		images: ["/og-image.png"],
		creator: "@alexmayhew",
	},
	alternates: {
		canonical: siteUrl,
	},
	category: "technology",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${inter.variable} ${jetbrainsMono.variable}`}
			suppressHydrationWarning
		>
			<head>
				<JsonLd />
			</head>
			<body className="relative min-h-screen overflow-x-hidden">
				<NoiseOverlay />
				<SmoothScroll>
					<Navigation />
					<div className="relative z-10 flex min-h-screen flex-col">
						{children}
						<Footer />
					</div>
				</SmoothScroll>
				<ChatWidget />
				<CloudflareAnalytics />
			</body>
		</html>
	);
}
