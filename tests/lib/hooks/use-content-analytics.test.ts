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
});
