"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

import { trackContentEvent, trackEvent, trackServiceEvent } from "@/components/analytics";

interface UseContentAnalyticsOptions {
	contentId?: string;
	contentType?: "blog_post" | "service_page" | "technology_page" | "case_study";
	contentCategory?: string;
	serviceType?: string;
	technology?: string;
	industry?: string;
}

/**
 * Hook for tracking content engagement analytics in GA4
 * Tracks scroll depth, engagement time, and content interactions
 * Following GA4 2026 best practices for technical content sites
 */
export function useContentAnalytics(options: UseContentAnalyticsOptions = {}) {
	const pathname = usePathname();
	const startTime = useRef<number>(Date.now());
	const maxScrollDepth = useRef<number>(0);
	const hasTrackedView = useRef<boolean>(false);
	const engagementIntervals = useRef<NodeJS.Timeout[]>([]);

	const {
		contentId = pathname.split("/").pop() || "unknown",
		contentType = "page",
		contentCategory = "general",
		serviceType,
		technology,
		industry,
	} = options;

	// Track initial content view
	useEffect(() => {
		if (!hasTrackedView.current) {
			hasTrackedView.current = true;
			startTime.current = Date.now();

			// Track page view with enhanced content data
			trackContentEvent("content_view", {
				content_id: contentId,
				content_type: contentType,
				content_category: contentCategory,
				content_group: pathname.split("/")[1] || "home",
			});

			// For service pages, also track as item view (ecommerce)
			if (contentType === "service_page") {
				trackServiceEvent("view_item", {
					item_id: contentId,
					item_name: contentId.replace(/-/g, " "),
					item_category: "service",
					service_type: serviceType,
					technology: technology,
					industry: industry,
				});
			}
		}
	}, [contentId, contentType, contentCategory, pathname, serviceType, technology, industry]);

	// Track scroll depth
	const trackedMilestones = useRef<Set<number>>(new Set());

	const trackScrollDepth = useCallback(() => {
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		const windowHeight = window.innerHeight;
		const documentHeight = document.documentElement.scrollHeight;

		const scrollPercent = Math.min(
			100,
			Math.round(((scrollTop + windowHeight) / documentHeight) * 100)
		);

		if (scrollPercent > maxScrollDepth.current) {
			maxScrollDepth.current = scrollPercent;
		}

		// Track scroll milestones (25%, 50%, 75%, 90%)
		const milestones = [25, 50, 75, 90];
		for (const milestone of milestones) {
			if (scrollPercent >= milestone && !trackedMilestones.current.has(milestone)) {
				trackedMilestones.current.add(milestone);
				trackContentEvent("scroll", {
					content_id: contentId,
					content_type: contentType,
					scroll_depth: milestone,
					content_category: contentCategory,
				});
			}
		}
	}, [contentId, contentType, contentCategory]);

	// Track engagement time at milestones (30s, 60s, 2min, 5min)
	const setupEngagementTracking = useCallback(() => {
		const milestones = [30000, 60000, 120000, 300000];

		milestones.forEach((milestone) => {
			const timeoutId = setTimeout(() => {
				trackContentEvent("engagement_time", {
					content_id: contentId,
					content_type: contentType,
					engagement_time_msec: milestone,
					content_category: contentCategory,
				});
			}, milestone);

			engagementIntervals.current.push(timeoutId);
		});
	}, [contentId, contentType, contentCategory]);

	// Set up scroll tracking
	useEffect(() => {
		let timeoutId: NodeJS.Timeout;

		const handleScroll = () => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(trackScrollDepth, 100);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", handleScroll);
			clearTimeout(timeoutId);
		};
	}, [trackScrollDepth]);

	// Set up engagement time tracking
	useEffect(() => {
		setupEngagementTracking();

		return () => {
			engagementIntervals.current.forEach(clearTimeout);
			engagementIntervals.current = [];
		};
	}, [setupEngagementTracking]);

	// Track exit engagement time on unmount
	useEffect(() => {
		return () => {
			const totalEngagementTime = Date.now() - startTime.current;
			if (totalEngagementTime > 5000) {
				// Only track if engaged for >5 seconds
				trackContentEvent("engagement_time", {
					content_id: contentId,
					content_type: contentType,
					engagement_time_msec: totalEngagementTime,
					content_category: contentCategory,
					scroll_depth: maxScrollDepth.current,
				});
			}
		};
	}, [contentId, contentType, contentCategory]);

	return {
		/** Manually track a content interaction event */
		trackInteraction: useCallback(
			(interaction: string, details: Record<string, string | number | boolean> = {}) => {
				trackEvent("content_interaction", {
					content_id: contentId,
					content_type: contentType,
					content_category: contentCategory,
					interaction_type: interaction,
					event_category: "content_engagement",
					...details,
				});
			},
			[contentId, contentType, contentCategory]
		),

		/** Current scroll depth percentage */
		scrollDepth: maxScrollDepth.current,

		/** Current engagement time in milliseconds */
		engagementTime: Date.now() - startTime.current,
	};
}
