import Script from "next/script";

/**
 * Google Analytics 4 (GA4) via gtag.js
 *
 * Implements GA4 tracking with Consent Mode v2 for GDPR compliance.
 * PageAnalytics component handles SPA page views — initial page view disabled here.
 *
 * @see https://developers.google.com/analytics/devguides/collection/ga4
 * @see https://developers.google.com/tag-platform/security/guides/consent
 */
export function GoogleAnalytics() {
	const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

	if (!measurementId || process.env.NODE_ENV === "development") {
		return null;
	}

	return (
		<>
			<Script id="ga-consent-default" strategy="beforeInteractive">
				{`
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}

					// Consent Mode v2 — deny by default, update on user choice
					gtag('consent', 'default', {
						analytics_storage: 'denied',
						ad_storage: 'denied',
						ad_user_data: 'denied',
						ad_personalization: 'denied',
						wait_for_update: 500
					});

					// Check for existing consent
					try {
						var stored = localStorage.getItem('cookie-consent');
						if (stored) {
							var consent = JSON.parse(stored);
							if (consent.version === '1' && consent.analytics) {
								gtag('consent', 'update', {
									analytics_storage: 'granted'
								});
							}
						}
					} catch(e) {}
				`}
			</Script>
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
						send_page_view: false,
						conversion_linker: true,
						allow_google_signals: true,
						allow_ad_personalization_signals: false
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
 * Track CTA button clicks for conversion funnel analysis.
 * Use on "Book a Call", "Contact", and other conversion-intent clicks.
 */
export function trackCTAClick(
	ctaName: string,
	params: {
		cta_location?: string;
		cta_url?: string;
		page_path?: string;
	} = {}
) {
	if (typeof window !== "undefined" && window.gtag) {
		window.gtag("event", "cta_click", {
			event_category: "conversion",
			cta_name: ctaName,
			page_path: params.page_path || window.location.pathname,
			...params,
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
