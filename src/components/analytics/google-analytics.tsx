import Script from "next/script";

/**
 * Google Analytics 4 (GA4) via gtag.js
 *
 * Implements GA4 tracking optimized for B2B lead generation and technical content.
 * Includes enhanced ecommerce events and lead lifecycle tracking.
 * The measurement ID should be set via NEXT_PUBLIC_GA_MEASUREMENT_ID.
 *
 * @see https://developers.google.com/analytics/devguides/collection/ga4
 * @see https://support.google.com/analytics/answer/12944921 (Lead Generation)
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
						send_page_view: true,
						// Enhanced measurement for B2B sites
						enhanced_measurement_settings: {
							scrolls: true,
							outbound_clicks: true,
							site_search: true,
							video_engagement: true,
							file_downloads: true
						},
						// Lead generation optimizations
						conversion_linker: true,
						allow_google_signals: true,
						allow_ad_personalization_signals: true
					});

					// Set up enhanced ecommerce for consultation funnel
					gtag('config', '${measurementId}', {
						custom_map: {
							'custom_parameter_1': 'project_type',
							'custom_parameter_2': 'budget_range',
							'custom_parameter_3': 'lead_source',
							'custom_parameter_4': 'content_category'
						}
					});
				`}
			</Script>
		</>
	);
}

/**
 * Track lead generation events following GA4 2026 best practices
 * @see https://support.google.com/analytics/answer/12944921
 */
export function trackLeadEvent(
	eventName: "generate_lead" | "qualify_lead" | "close_convert_lead" | "close_unconvert_lead",
	params: {
		lead_source?: string;
		project_type?: string;
		budget_range?: string;
		form_type?: string;
		lead_value?: number;
		currency?: string;
		qualified_reason?: string;
		disqualified_reason?: string;
	} = {}
) {
	if (typeof window !== "undefined" && window.gtag) {
		window.gtag("event", eventName, {
			event_category: "lead_generation",
			...params,
		});
	}
}

/**
 * Track content engagement events for blog and technical content
 */
export function trackContentEvent(
	eventName: "page_view" | "scroll" | "engagement_time" | "content_view",
	params: {
		content_type?: string;
		content_id?: string;
		content_category?: string;
		engagement_time_msec?: number;
		scroll_depth?: number;
		content_group?: string;
	} = {}
) {
	if (typeof window !== "undefined" && window.gtag) {
		window.gtag("event", eventName, {
			event_category: "content_engagement",
			...params,
		});
	}
}

/**
 * Track service page interactions and conversion funnel
 */
export function trackServiceEvent(
	eventName: "view_item" | "begin_checkout" | "add_to_cart",
	params: {
		item_id?: string;
		item_name?: string;
		item_category?: string;
		item_brand?: string;
		price?: number;
		currency?: string;
		service_type?: string;
		technology?: string;
		industry?: string;
	} = {}
) {
	if (typeof window !== "undefined" && window.gtag) {
		window.gtag("event", eventName, {
			event_category: "service_engagement",
			...params,
		});
	}
}

/**
 * Track newsletter and email signup events
 */
export function trackNewsletterEvent(
	eventName: "sign_up" | "newsletter_subscribe",
	params: {
		method?: string;
		source?: string;
		location?: string;
	} = {}
) {
	if (typeof window !== "undefined" && window.gtag) {
		window.gtag("event", eventName, {
			event_category: "newsletter",
			...params,
		});
	}
}

/**
 * Track custom events in GA4 (general purpose)
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

// Type augmentation for window.gtag with enhanced GA4 support
declare global {
	interface Window {
		gtag: (
			command: "config" | "event" | "js" | "set" | "consent",
			targetId: string | Date,
			config?: Record<string, unknown>
		) => void;
		dataLayer: unknown[];
	}
}
