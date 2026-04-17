"use client";

import { useEffect } from "react";

import { trackEvent } from "@/components/analytics/google-analytics";

/**
 * Fires a GA4 `page_not_found` event with the current path so 404s from
 * broken internal links surface in analytics. Default page_view still
 * lands on the 404 URL but doesn't distinguish it from a planned route.
 */
export function NotFoundTracker() {
	useEffect(() => {
		if (typeof window === "undefined") return;
		trackEvent("page_not_found", {
			page_path: window.location.pathname,
			page_referrer: document.referrer || "(direct)",
		});
	}, []);

	return null;
}
