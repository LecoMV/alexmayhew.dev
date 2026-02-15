"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

/**
 * Page Analytics Component for Next.js App Router
 *
 * Tracks SPA page views via gtag event (not config call, to avoid duplicate PVs).
 * Custom dimensions are sent as event parameters — register them in GA4 admin.
 */
export function PageAnalytics() {
	return (
		<Suspense fallback={null}>
			<PageAnalyticsInner />
		</Suspense>
	);
}

function PageAnalyticsInner() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

		if (typeof window === "undefined" || !window.gtag) return;

		// Send page_view event with custom dimensions as parameters
		window.gtag("event", "page_view", {
			page_path: url,
			page_title: document.title,
			page_location: window.location.href,
			// UTM campaign parameters
			campaign_source: searchParams?.get("utm_source") || undefined,
			campaign_medium: searchParams?.get("utm_medium") || undefined,
			campaign_name: searchParams?.get("utm_campaign") || undefined,
			campaign_content: searchParams?.get("utm_content") || undefined,
			campaign_term: searchParams?.get("utm_term") || undefined,
			// Custom dimensions (register in GA4 Admin > Custom definitions)
			page_category: getPageCategory(pathname),
			content_type: getContentType(pathname),
			user_type: getUserType(),
		});
	}, [pathname, searchParams]);

	return null;
}

// Helper functions moved outside components for cleaner code

/**
 * Determine page category based on pathname for analytics segmentation
 */
function getPageCategory(pathname: string): string {
	if (pathname === "/") return "homepage";
	if (pathname.startsWith("/blog")) return "content";
	if (pathname.startsWith("/services")) return "services";
	if (pathname.startsWith("/technologies")) return "technologies";
	if (pathname.startsWith("/work")) return "portfolio";
	if (pathname.startsWith("/about")) return "about";
	if (pathname.startsWith("/contact")) return "conversion";
	if (pathname.startsWith("/tools")) return "tools";
	if (pathname.startsWith("/for")) return "roles";
	return "other";
}

/**
 * Determine content type for analytics
 */
function getContentType(pathname: string): string {
	if (pathname === "/") return "landing_page";
	if (pathname.match(/^\/blog\/[^/]+$/)) return "blog_post";
	if (pathname.match(/^\/services\/[^/]+$/)) return "service_page";
	if (pathname.match(/^\/technologies\/[^/]+$/)) return "technology_page";
	if (pathname.match(/^\/work/)) return "case_study";
	if (pathname === "/contact") return "contact_form";
	if (pathname.startsWith("/tools/")) return "product_page";
	return "static_page";
}

/**
 * Determine user type based on behavior and session data
 * This is a simple heuristic - could be enhanced with more sophisticated detection
 */
function getUserType(): string {
	if (typeof window === "undefined") return "unknown";

	const referrer = document.referrer;
	const userAgent = navigator.userAgent.toLowerCase();

	// Technical indicators
	if (userAgent.includes("bot") || userAgent.includes("crawler")) {
		return "bot";
	}

	// Referrer-based classification
	if (referrer.includes("linkedin")) return "linkedin_visitor";
	if (referrer.includes("twitter") || referrer.includes("t.co")) return "twitter_visitor";
	if (referrer.includes("google")) return "search_visitor";
	if (referrer.includes("github")) return "developer";

	// Direct traffic
	if (!referrer) return "direct_visitor";

	return "referral_visitor";
}
