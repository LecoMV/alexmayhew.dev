import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from "vitest";

// Mock next/navigation
vi.mock("next/navigation", () => ({
	usePathname: () => "/blog/test-post",
}));

// Mock analytics module
vi.mock("@/components/analytics", () => ({
	trackContentEvent: vi.fn(),
	trackEvent: vi.fn(),
	trackServiceEvent: vi.fn(),
}));

import { trackContentEvent, trackEvent, trackServiceEvent } from "@/components/analytics";
import { useContentAnalytics } from "@/lib/hooks/use-content-analytics";

type IntersectionCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

describe("useContentAnalytics scroll tracking", () => {
	let observerCallback: IntersectionCallback;
	let observedElements: Element[];
	let disconnectSpy: Mock;
	let unobserveSpy: Mock;

	beforeEach(() => {
		vi.clearAllMocks();
		observedElements = [];
		disconnectSpy = vi.fn();
		unobserveSpy = vi.fn();

		// Override the global mock with a class that captures the callback
		class MockObserver implements IntersectionObserver {
			readonly root: Element | null = null;
			readonly rootMargin: string = "";
			readonly thresholds: ReadonlyArray<number> = [];
			constructor(callback: IntersectionObserverCallback) {
				observerCallback = callback as IntersectionCallback;
			}
			observe(el: Element) {
				observedElements.push(el);
			}
			disconnect() {
				disconnectSpy();
			}
			unobserve(el: Element) {
				unobserveSpy(el);
			}
			takeRecords(): IntersectionObserverEntry[] {
				return [];
			}
		}
		window.IntersectionObserver = MockObserver;

		const article = document.createElement("article");
		Object.defineProperty(article, "scrollHeight", { value: 4000, configurable: true });
		document.body.appendChild(article);
	});

	afterEach(() => {
		// Clean up DOM
		const article = document.querySelector("article");
		if (article) article.remove();
		// Remove any sentinels left over
		document.querySelectorAll("[data-scroll-depth]").forEach((el) => el.remove());
	});

	it("creates sentinel elements at 25%, 50%, 75%, 90% of article height", () => {
		renderHook(() => useContentAnalytics({ contentType: "blog_post" }));

		const sentinels = document.querySelectorAll("[data-scroll-depth]");
		expect(sentinels).toHaveLength(4);

		const milestones = Array.from(sentinels).map((s) =>
			Number(s.getAttribute("data-scroll-depth"))
		);
		expect(milestones).toEqual([25, 50, 75, 90]);
	});

	it("positions sentinels at correct offsets based on article scrollHeight", () => {
		renderHook(() => useContentAnalytics({ contentType: "blog_post" }));

		const sentinels = document.querySelectorAll("[data-scroll-depth]") as NodeListOf<HTMLElement>;
		expect(sentinels[0].style.top).toBe("1000px");
		expect(sentinels[1].style.top).toBe("2000px");
		expect(sentinels[2].style.top).toBe("3000px");
		expect(sentinels[3].style.top).toBe("3600px");
	});

	it("sentinels are invisible and non-interactive", () => {
		renderHook(() => useContentAnalytics({ contentType: "blog_post" }));

		const sentinels = document.querySelectorAll("[data-scroll-depth]") as NodeListOf<HTMLElement>;
		for (const sentinel of sentinels) {
			expect(sentinel.style.opacity).toBe("0");
			expect(sentinel.style.pointerEvents).toBe("none");
			expect(sentinel.getAttribute("aria-hidden")).toBe("true");
			expect(sentinel.style.width).toBe("1px");
			expect(sentinel.style.height).toBe("1px");
		}
	});

	it("tracks scroll milestone when sentinel enters viewport", () => {
		renderHook(() =>
			useContentAnalytics({
				contentId: "test-post",
				contentType: "blog_post",
				contentCategory: "engineering",
			})
		);

		const sentinel25 = document.querySelector('[data-scroll-depth="25"]')!;

		act(() => {
			observerCallback([{ isIntersecting: true, target: sentinel25 }]);
		});

		expect(trackContentEvent).toHaveBeenCalledWith("scroll", {
			content_id: "test-post",
			content_type: "blog_post",
			scroll_depth: 25,
			content_category: "engineering",
		});
	});

	it("unobserves sentinel after milestone is tracked", () => {
		renderHook(() => useContentAnalytics({ contentType: "blog_post" }));

		const sentinel50 = document.querySelector('[data-scroll-depth="50"]')!;

		act(() => {
			observerCallback([{ isIntersecting: true, target: sentinel50 }]);
		});

		expect(unobserveSpy).toHaveBeenCalledWith(sentinel50);
	});

	it("does not track when sentinel is not intersecting", () => {
		renderHook(() => useContentAnalytics({ contentType: "blog_post" }));

		const sentinel25 = document.querySelector('[data-scroll-depth="25"]')!;

		act(() => {
			observerCallback([{ isIntersecting: false, target: sentinel25 }]);
		});

		// content_view fires on mount, but scroll should NOT fire
		const scrollCalls = (trackContentEvent as Mock).mock.calls.filter(
			(call: unknown[]) => call[0] === "scroll"
		);
		expect(scrollCalls).toHaveLength(0);
	});

	it("does not double-track the same milestone", () => {
		renderHook(() => useContentAnalytics({ contentType: "blog_post" }));

		const sentinel75 = document.querySelector('[data-scroll-depth="75"]')!;

		act(() => {
			observerCallback([{ isIntersecting: true, target: sentinel75 }]);
		});
		act(() => {
			observerCallback([{ isIntersecting: true, target: sentinel75 }]);
		});

		const scrollCalls = (trackContentEvent as Mock).mock.calls.filter(
			(call: unknown[]) => call[0] === "scroll"
		);
		expect(scrollCalls).toHaveLength(1);
	});

	it("cleans up sentinels and disconnects observer on unmount", () => {
		const { unmount } = renderHook(() => useContentAnalytics({ contentType: "blog_post" }));

		expect(document.querySelectorAll("[data-scroll-depth]")).toHaveLength(4);

		unmount();

		expect(disconnectSpy).toHaveBeenCalled();
		expect(document.querySelectorAll("[data-scroll-depth]")).toHaveLength(0);
	});

	it("observes all sentinels with IntersectionObserver", () => {
		renderHook(() => useContentAnalytics({ contentType: "blog_post" }));

		expect(observedElements).toHaveLength(4);
		for (const el of observedElements) {
			expect(el.hasAttribute("data-scroll-depth")).toBe(true);
		}
	});

	it("sets article position to relative when it is static", () => {
		const article = document.querySelector("article")!;
		// jsdom defaults to static for getComputedStyle
		expect(window.getComputedStyle(article).position).toBe("");

		renderHook(() => useContentAnalytics({ contentType: "blog_post" }));

		expect((article as HTMLElement).style.position).toBe("relative");
	});

	it("falls back to main element when no article exists", () => {
		// Remove article, add main
		document.querySelector("article")?.remove();
		const main = document.createElement("main");
		Object.defineProperty(main, "scrollHeight", { value: 2000, configurable: true });
		document.body.appendChild(main);

		renderHook(() => useContentAnalytics({ contentType: "blog_post" }));

		const sentinels = main.querySelectorAll("[data-scroll-depth]");
		expect(sentinels).toHaveLength(4);

		// 25% of 2000 = 500
		expect((sentinels[0] as HTMLElement).style.top).toBe("500px");

		main.remove();
	});
});

describe("useContentAnalytics content view tracking", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		const article = document.createElement("article");
		Object.defineProperty(article, "scrollHeight", { value: 2000, configurable: true });
		document.body.appendChild(article);
	});

	afterEach(() => {
		document.querySelector("article")?.remove();
		document.querySelectorAll("[data-scroll-depth]").forEach((el) => el.remove());
	});

	it("tracks content_view on mount with correct parameters", () => {
		renderHook(() =>
			useContentAnalytics({
				contentId: "my-post",
				contentType: "blog_post",
				contentCategory: "engineering",
			})
		);

		expect(trackContentEvent).toHaveBeenCalledWith("content_view", {
			content_id: "my-post",
			content_type: "blog_post",
			content_category: "engineering",
			content_group: "blog",
		});
	});

	it("tracks view_item for service_page contentType", () => {
		renderHook(() =>
			useContentAnalytics({
				contentId: "web-development",
				contentType: "service_page",
				contentCategory: "services",
				serviceType: "consulting",
				technology: "react",
				industry: "saas",
			})
		);

		expect(trackServiceEvent).toHaveBeenCalledWith("view_item", {
			item_id: "web-development",
			item_name: "web development",
			item_category: "service",
			service_type: "consulting",
			technology: "react",
			industry: "saas",
		});
	});

	it("does not track view_item for non-service contentType", () => {
		renderHook(() =>
			useContentAnalytics({
				contentId: "my-post",
				contentType: "blog_post",
			})
		);

		expect(trackServiceEvent).not.toHaveBeenCalled();
	});

	it("uses defaults when no options provided", () => {
		renderHook(() => useContentAnalytics());

		expect(trackContentEvent).toHaveBeenCalledWith("content_view", {
			content_id: "test-post",
			content_type: "page",
			content_category: "general",
			content_group: "blog",
		});
	});
});

describe("useContentAnalytics engagement time tracking", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.useFakeTimers();
		const article = document.createElement("article");
		Object.defineProperty(article, "scrollHeight", { value: 2000, configurable: true });
		document.body.appendChild(article);
	});

	afterEach(() => {
		vi.useRealTimers();
		document.querySelector("article")?.remove();
		document.querySelectorAll("[data-scroll-depth]").forEach((el) => el.remove());
	});

	it("fires engagement milestone at 30s", () => {
		renderHook(() =>
			useContentAnalytics({
				contentId: "timer-post",
				contentType: "blog_post",
				contentCategory: "engineering",
			})
		);

		act(() => {
			vi.advanceTimersByTime(30000);
		});

		expect(trackContentEvent).toHaveBeenCalledWith("user_engagement", {
			content_id: "timer-post",
			content_type: "blog_post",
			engagement_time_msec: 30000,
			content_category: "engineering",
		});
	});

	it("fires engagement milestone at 60s", () => {
		renderHook(() =>
			useContentAnalytics({
				contentId: "timer-post",
				contentType: "blog_post",
				contentCategory: "engineering",
			})
		);

		act(() => {
			vi.advanceTimersByTime(60000);
		});

		const calls = (trackContentEvent as Mock).mock.calls.filter(
			(call: unknown[]) =>
				call[0] === "user_engagement" &&
				(call[1] as Record<string, unknown>).engagement_time_msec === 60000
		);
		expect(calls).toHaveLength(1);
	});

	it("clears engagement timers on unmount", () => {
		const { unmount } = renderHook(() =>
			useContentAnalytics({
				contentId: "timer-post",
				contentType: "blog_post",
			})
		);

		unmount();

		// Advance past all milestones — no engagement events should fire after unmount
		const callsBefore = (trackContentEvent as Mock).mock.calls.filter(
			(call: unknown[]) => call[0] === "user_engagement"
		).length;

		act(() => {
			vi.advanceTimersByTime(300000);
		});

		const callsAfter = (trackContentEvent as Mock).mock.calls.filter(
			(call: unknown[]) => call[0] === "user_engagement"
		).length;

		// The unmount cleanup fires one user_engagement event (exit tracking).
		// After that, no additional engagement milestone events should fire.
		expect(callsAfter).toBe(callsBefore);
	});
});

describe("useContentAnalytics visibility and unmount tracking", () => {
	let originalVisibilityState: PropertyDescriptor | undefined;

	beforeEach(() => {
		vi.clearAllMocks();
		const article = document.createElement("article");
		Object.defineProperty(article, "scrollHeight", { value: 2000, configurable: true });
		document.body.appendChild(article);
		originalVisibilityState = Object.getOwnPropertyDescriptor(document, "visibilityState");
	});

	afterEach(() => {
		document.querySelector("article")?.remove();
		document.querySelectorAll("[data-scroll-depth]").forEach((el) => el.remove());
		if (originalVisibilityState) {
			Object.defineProperty(document, "visibilityState", originalVisibilityState);
		} else {
			// Reset to default
			Object.defineProperty(document, "visibilityState", {
				value: "visible",
				writable: true,
				configurable: true,
			});
		}
		delete (window as unknown as Record<string, unknown>).gtag;
	});

	it("sends gtag engagement event when tab becomes hidden", () => {
		const mockGtag = vi.fn();
		(window as unknown as Record<string, unknown>).gtag = mockGtag;

		renderHook(() =>
			useContentAnalytics({
				contentId: "vis-post",
				contentType: "blog_post",
			})
		);

		// Simulate tab going hidden
		Object.defineProperty(document, "visibilityState", {
			value: "hidden",
			writable: true,
			configurable: true,
		});

		act(() => {
			document.dispatchEvent(new Event("visibilitychange"));
		});

		expect(mockGtag).toHaveBeenCalledWith(
			"event",
			"user_engagement",
			expect.objectContaining({
				engagement_time_msec: expect.any(Number),
			})
		);
	});

	it("does not send gtag event when tab becomes visible", () => {
		const mockGtag = vi.fn();
		(window as unknown as Record<string, unknown>).gtag = mockGtag;

		renderHook(() =>
			useContentAnalytics({
				contentId: "vis-post",
				contentType: "blog_post",
			})
		);

		// Simulate tab going visible (not hidden)
		Object.defineProperty(document, "visibilityState", {
			value: "visible",
			writable: true,
			configurable: true,
		});

		act(() => {
			document.dispatchEvent(new Event("visibilitychange"));
		});

		expect(mockGtag).not.toHaveBeenCalled();
	});

	it("does not crash when gtag is not defined", () => {
		delete (window as unknown as Record<string, unknown>).gtag;

		renderHook(() =>
			useContentAnalytics({
				contentId: "no-gtag",
				contentType: "blog_post",
			})
		);

		Object.defineProperty(document, "visibilityState", {
			value: "hidden",
			writable: true,
			configurable: true,
		});

		// Should not throw
		act(() => {
			document.dispatchEvent(new Event("visibilitychange"));
		});
	});

	it("tracks exit engagement on unmount when engaged >5s", () => {
		// Use fake timers to control Date.now
		const realDateNow = Date.now;
		let currentTime = 1000000;
		Date.now = vi.fn(() => currentTime);

		const { unmount } = renderHook(() =>
			useContentAnalytics({
				contentId: "exit-post",
				contentType: "blog_post",
				contentCategory: "engineering",
			})
		);

		// Advance time by 10 seconds
		currentTime += 10000;

		vi.clearAllMocks();
		unmount();

		expect(trackContentEvent).toHaveBeenCalledWith("user_engagement", {
			content_id: "exit-post",
			content_type: "blog_post",
			engagement_time_msec: expect.any(Number),
			content_category: "engineering",
			scroll_depth: 0,
		});

		// Verify the time is > 5000
		const call = (trackContentEvent as Mock).mock.calls.find(
			(c: unknown[]) => c[0] === "user_engagement"
		);
		expect((call![1] as Record<string, number>).engagement_time_msec).toBeGreaterThan(5000);

		Date.now = realDateNow;
	});

	it("does not track exit engagement on unmount when engaged <5s", () => {
		const realDateNow = Date.now;
		let currentTime = 1000000;
		Date.now = vi.fn(() => currentTime);

		const { unmount } = renderHook(() =>
			useContentAnalytics({
				contentId: "quick-exit",
				contentType: "blog_post",
			})
		);

		// Advance only 2 seconds (< 5000ms threshold)
		currentTime += 2000;

		vi.clearAllMocks();
		unmount();

		const engagementCalls = (trackContentEvent as Mock).mock.calls.filter(
			(call: unknown[]) => call[0] === "user_engagement"
		);
		expect(engagementCalls).toHaveLength(0);

		Date.now = realDateNow;
	});

	it("removes visibilitychange listener on unmount", () => {
		const removeListenerSpy = vi.spyOn(document, "removeEventListener");

		const { unmount } = renderHook(() =>
			useContentAnalytics({
				contentId: "listener-post",
				contentType: "blog_post",
			})
		);

		unmount();

		expect(removeListenerSpy).toHaveBeenCalledWith("visibilitychange", expect.any(Function));

		removeListenerSpy.mockRestore();
	});
});

describe("useContentAnalytics trackInteraction", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		const article = document.createElement("article");
		Object.defineProperty(article, "scrollHeight", { value: 2000, configurable: true });
		document.body.appendChild(article);
	});

	afterEach(() => {
		document.querySelector("article")?.remove();
		document.querySelectorAll("[data-scroll-depth]").forEach((el) => el.remove());
	});

	it("tracks content_interaction event with provided interaction type", () => {
		const { result } = renderHook(() =>
			useContentAnalytics({
				contentId: "interact-post",
				contentType: "blog_post",
				contentCategory: "engineering",
			})
		);

		act(() => {
			result.current.trackInteraction("code_copy");
		});

		expect(trackEvent).toHaveBeenCalledWith("content_interaction", {
			content_id: "interact-post",
			content_type: "blog_post",
			content_category: "engineering",
			interaction_type: "code_copy",
			event_category: "content_engagement",
		});
	});

	it("merges additional details into event", () => {
		const { result } = renderHook(() =>
			useContentAnalytics({
				contentId: "detail-post",
				contentType: "blog_post",
				contentCategory: "engineering",
			})
		);

		act(() => {
			result.current.trackInteraction("link_click", {
				link_url: "https://example.com",
				link_position: 3,
				is_external: true,
			});
		});

		expect(trackEvent).toHaveBeenCalledWith("content_interaction", {
			content_id: "detail-post",
			content_type: "blog_post",
			content_category: "engineering",
			interaction_type: "link_click",
			event_category: "content_engagement",
			link_url: "https://example.com",
			link_position: 3,
			is_external: true,
		});
	});

	it("trackInteraction with empty details does not add extra fields", () => {
		const { result } = renderHook(() =>
			useContentAnalytics({
				contentId: "empty-detail",
				contentType: "blog_post",
			})
		);

		act(() => {
			result.current.trackInteraction("share");
		});

		expect(trackEvent).toHaveBeenCalledWith("content_interaction", {
			content_id: "empty-detail",
			content_type: "blog_post",
			content_category: "general",
			interaction_type: "share",
			event_category: "content_engagement",
		});
	});
});

describe("useContentAnalytics return values", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		const article = document.createElement("article");
		Object.defineProperty(article, "scrollHeight", { value: 2000, configurable: true });
		document.body.appendChild(article);
	});

	afterEach(() => {
		document.querySelector("article")?.remove();
		document.querySelectorAll("[data-scroll-depth]").forEach((el) => el.remove());
	});

	it("returns scrollDepth starting at 0", () => {
		const { result } = renderHook(() => useContentAnalytics());
		expect(result.current.scrollDepth).toBe(0);
	});

	it("returns engagementTime as a positive number", () => {
		const { result } = renderHook(() => useContentAnalytics());
		expect(result.current.engagementTime).toBeGreaterThanOrEqual(0);
	});

	it("returns a trackInteraction function", () => {
		const { result } = renderHook(() => useContentAnalytics());
		expect(typeof result.current.trackInteraction).toBe("function");
	});
});

describe("useContentAnalytics article positioning", () => {
	afterEach(() => {
		document.querySelector("article")?.remove();
		document.querySelector("main")?.remove();
		document.querySelectorAll("[data-scroll-depth]").forEach((el) => el.remove());
	});

	it("does not override article position if already non-static", () => {
		const article = document.createElement("article");
		Object.defineProperty(article, "scrollHeight", { value: 2000, configurable: true });
		article.style.position = "relative";
		document.body.appendChild(article);

		const originalGetComputedStyle = window.getComputedStyle;
		window.getComputedStyle = vi.fn().mockReturnValue({
			position: "relative",
		}) as unknown as typeof window.getComputedStyle;

		renderHook(() => useContentAnalytics({ contentType: "blog_post" }));

		// Position should still be relative (not overridden)
		expect(article.style.position).toBe("relative");

		window.getComputedStyle = originalGetComputedStyle;
	});

	it("does nothing when no article or main element exists", () => {
		// Remove any existing elements
		document.querySelector("article")?.remove();
		document.querySelector("main")?.remove();

		// Should not throw
		renderHook(() => useContentAnalytics({ contentType: "blog_post" }));

		// No sentinels created
		expect(document.querySelectorAll("[data-scroll-depth]")).toHaveLength(0);
	});
});
