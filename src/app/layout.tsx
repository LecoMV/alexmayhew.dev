import type { Metadata, Viewport } from "next";
import { inter, jetbrainsMono } from "./fonts";
import "./globals.css";
import { SmoothScroll, MotionProvider } from "@/components/providers";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { NoiseOverlay } from "@/components/ui/noise-overlay";
import { ChatWidget } from "@/components/chat";
import { JsonLd, LocalBusinessJsonLd } from "@/components/seo";
import { CloudflareAnalytics, GoogleAnalytics } from "@/components/analytics";
import { PageAnalytics } from "@/components/analytics/page-analytics";
import { WebVitalsReporter } from "@/components/analytics/web-vitals";
import { CookieConsent } from "@/components/ui/cookie-consent";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";

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
		default: "Alex Mayhew | Technical Advisor & Systems Architect",
		template: "%s | Alex Mayhew",
	},
	description:
		"Technical advisor architecting production systems that scale from MVP to millions. Strategic guidance for startups where tech decisions have business consequences.",
	keywords: [
		"technical advisor",
		"systems architect",
		"software architect",
		"react developer",
		"next.js developer",
		"typescript",
		"node.js",
		"startup technical advisor",
		"web application architecture",
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
	appleWebApp: {
		title: "Alex Mayhew",
	},

	manifest: "/site.webmanifest",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: siteUrl,
		siteName: "Alex Mayhew",
		title: "Alex Mayhew | Technical Advisor & Systems Architect",
		description:
			"Technical advisor architecting production systems that scale from MVP to millions.",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Alex Mayhew - Technical Advisor",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Alex Mayhew | Technical Advisor",
		description: "Architecting production systems that scale from MVP to millions.",
		images: ["/og-image.png"],
		creator: "@alexmayhew",
	},
	alternates: {
		canonical: siteUrl,
		types: {
			"application/rss+xml": `${siteUrl}/feed.xml`,
		},
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
				<LocalBusinessJsonLd />
			</head>
			<body className="relative min-h-screen overflow-x-hidden">
				<MotionProvider>
					<NoiseOverlay />
					<SmoothScroll>
						<Navigation />
						<main id="main-content" className="relative z-10 flex min-h-screen flex-col">
							{children}
							<Footer />
						</main>
					</SmoothScroll>
					<ChatWidget />
					<CookieConsent />
				</MotionProvider>
				<ServiceWorkerRegister />
				<GoogleAnalytics />
				<PageAnalytics />
				<CloudflareAnalytics />
				<WebVitalsReporter />
			</body>
		</html>
	);
}
