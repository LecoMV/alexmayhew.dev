import { ViewTransitions } from "next-view-transitions";
import dynamic from "next/dynamic";

import { MotionProvider, SmoothScroll } from "@/components/providers";
import { JsonLd, LocalBusinessJsonLd } from "@/components/seo";
import { LazyCommandPaletteServer } from "@/components/ui/command-palette-server";

import "./globals.css";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Footer } from "@/components/ui/footer";
import { Navigation } from "@/components/ui/navigation";
import { NoiseOverlay } from "@/components/ui/noise-overlay";

import { inter, jetbrainsMono } from "./fonts";

import type { Metadata, Viewport } from "next";
const GoogleAnalytics = dynamic(() =>
	import("@/components/analytics/google-analytics").then((m) => m.GoogleAnalytics)
);
const CloudflareAnalytics = dynamic(() =>
	import("@/components/analytics/cloudflare-analytics").then((m) => m.CloudflareAnalytics)
);
const PageAnalytics = dynamic(() =>
	import("@/components/analytics/page-analytics").then((m) => m.PageAnalytics)
);

const WebVitalsReporter = dynamic(() =>
	import("@/components/analytics/web-vitals").then((mod) => mod.WebVitalsReporter)
);
const ChatWidget = dynamic(() =>
	import("@/components/chat/chat-widget").then((mod) => mod.ChatWidget)
);
const CookieConsent = dynamic(() =>
	import("@/components/ui/cookie-consent").then((mod) => mod.CookieConsent)
);
const ServiceWorkerRegister = dynamic(() =>
	import("@/components/pwa/service-worker-register").then((mod) => mod.ServiceWorkerRegister)
);

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
		creator: "@alexmayhewdev",
	},
	alternates: {
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
				{/* Consent Mode v2 — region-specific defaults per Google docs
				     EEA+UK+CH: denied (GDPR opt-in required)
				     Everyone else: analytics granted, ads denied
				     All values are static string literals — no user input, no XSS risk */}
				<script
					dangerouslySetInnerHTML={{
						__html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500,'region':['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','CH','GB']});gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});try{var s=localStorage.getItem('cookie-consent');if(s){var c=JSON.parse(s);if(c.version==='1'&&c.analytics){gtag('consent','update',{analytics_storage:'granted'});}}}catch(e){}`,
					}}
				/>
			</head>
			<body className="relative min-h-dvh overflow-x-clip">
				<ViewTransitions>
					<MotionProvider>
						<NoiseOverlay />
						<SmoothScroll>
							<Navigation />
							<main id="main-content" className="relative z-10 flex min-h-dvh flex-col">
								{children}
								<Footer />
							</main>
						</SmoothScroll>
						<ErrorBoundary>
							<ChatWidget />
						</ErrorBoundary>
						<CookieConsent />
						<LazyCommandPaletteServer />
					</MotionProvider>
					<ServiceWorkerRegister />
					<GoogleAnalytics />
					<PageAnalytics />
					<CloudflareAnalytics />
					<WebVitalsReporter />
				</ViewTransitions>
			</body>
		</html>
	);
}
