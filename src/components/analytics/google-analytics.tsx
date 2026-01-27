import Script from "next/script";

/**
 * Google Analytics 4 (GA4) via gtag.js
 *
 * Implements GA4 tracking with proper Next.js Script optimization.
 * The measurement ID should be set via NEXT_PUBLIC_GA_MEASUREMENT_ID.
 *
 * @see https://developers.google.com/analytics/devguides/collection/ga4
 */
export function GoogleAnalytics() {
	const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

	// Don't render in development or if no measurement ID
	if (!measurementId || process.env.NODE_ENV === "development") {
		return null;
	}

	return (
		<>
			<Script
				src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
				strategy="afterInteractive"
			/>
			<Script id="google-analytics" strategy="afterInteractive">
				{`
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					gtag('config', '${measurementId}', {
						page_path: window.location.pathname,
						send_page_view: true
					});
				`}
			</Script>
		</>
	);
}

/**
 * Track custom events in GA4
 * Usage: trackEvent('contact_form_submit', { form_type: 'consultation' })
 */
export function trackEvent(
	eventName: string,
	eventParams?: Record<string, string | number | boolean>
) {
	if (typeof window !== "undefined" && window.gtag) {
		window.gtag("event", eventName, eventParams);
	}
}

/**
 * Track page views (for SPA navigation)
 * Next.js App Router handles this automatically, but available if needed
 */
export function trackPageView(url: string) {
	if (typeof window !== "undefined" && window.gtag) {
		window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
			page_path: url,
		});
	}
}

// Type augmentation for window.gtag
declare global {
	interface Window {
		gtag: (
			command: "config" | "event" | "js" | "set",
			targetId: string | Date,
			config?: Record<string, unknown>
		) => void;
		dataLayer: unknown[];
	}
}
