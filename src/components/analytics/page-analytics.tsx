"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "./google-analytics";

/**
 * Page Analytics Component for Next.js App Router
 *
 * Automatically tracks page views and URL changes for SPA navigation.
 * Should be included in the root layout for app-wide page tracking.
 *
 * Handles:
 * - Route changes in App Router
 * - Search parameter changes
 * - UTM parameter tracking
 * - Referrer tracking
 */
export function PageAnalytics() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

		// Extract UTM parameters for campaign tracking
		const utm_source = searchParams?.get("utm_source");
		const utm_medium = searchParams?.get("utm_medium");
		const utm_campaign = searchParams?.get("utm_campaign");
		const utm_content = searchParams?.get("utm_content");
		const utm_term = searchParams?.get("utm_term");

		// Track page view with enhanced parameters
		if (typeof window !== "undefined" && window.gtag) {
			window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
				page_path: url,
				page_title: document.title,
				page_location: window.location.href,
				// Campaign parameters
				campaign_source: utm_source || undefined,
				campaign_medium: utm_medium || undefined,
				campaign_name: utm_campaign || undefined,
				campaign_content: utm_content || undefined,
				campaign_term: utm_term || undefined,
				// Custom dimensions for technical content site
				custom_map: {
					page_category: getPageCategory(pathname),
					content_type: getContentType(pathname),
					user_type: getUserType(),
				},
			});
		}

		// Also call the legacy trackPageView for compatibility
		trackPageView(url);
	}, [pathname, searchParams]);

	return null;
}

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
