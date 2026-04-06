import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PageAnalytics } from "@/components/analytics/page-analytics";

let mockPathname = "/";
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
	usePathname: () => mockPathname,
	useSearchParams: () => mockSearchParams,
}));

describe("PageAnalytics", () => {
	let mockGtag: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockGtag = vi.fn();
		Object.defineProperty(window, "gtag", {
			value: mockGtag,
			writable: true,
			configurable: true,
		});
		mockPathname = "/";
		mockSearchParams = new URLSearchParams();
	});

	it("renders without crashing", () => {
		const { container } = render(<PageAnalytics />);
		expect(container).toBeTruthy();
	});

	it("calls gtag with page_view event on mount", () => {
		mockPathname = "/about";
		render(<PageAnalytics />);
		expect(mockGtag).toHaveBeenCalledWith(
			"event",
			"page_view",
			expect.objectContaining({
				page_path: "/about",
				page_category: "about",
				content_type: "static_page",
			})
		);
	});

	it("categorizes homepage correctly", () => {
		mockPathname = "/";
		render(<PageAnalytics />);
		expect(mockGtag).toHaveBeenCalledWith(
			"event",
			"page_view",
			expect.objectContaining({
				page_category: "homepage",
				content_type: "landing_page",
			})
		);
	});

	it("categorizes blog posts correctly", () => {
		mockPathname = "/blog/test-post";
		render(<PageAnalytics />);
		expect(mockGtag).toHaveBeenCalledWith(
			"event",
			"page_view",
			expect.objectContaining({
				page_category: "content",
				content_type: "blog_post",
			})
		);
	});

	it("categorizes service pages correctly", () => {
		mockPathname = "/services/nextjs-saas";
		render(<PageAnalytics />);
		expect(mockGtag).toHaveBeenCalledWith(
			"event",
			"page_view",
			expect.objectContaining({
				page_category: "services",
				content_type: "service_page",
			})
		);
	});

	it("categorizes contact page as conversion", () => {
		mockPathname = "/contact";
		render(<PageAnalytics />);
		expect(mockGtag).toHaveBeenCalledWith(
			"event",
			"page_view",
			expect.objectContaining({
				page_category: "conversion",
				content_type: "contact_form",
			})
		);
	});

	it("categorizes tools pages correctly", () => {
		mockPathname = "/tools/traceforge";
		render(<PageAnalytics />);
		expect(mockGtag).toHaveBeenCalledWith(
			"event",
			"page_view",
			expect.objectContaining({
				page_category: "tools",
				content_type: "product_page",
			})
		);
	});

	it("categorizes work pages as portfolio", () => {
		mockPathname = "/work";
		render(<PageAnalytics />);
		expect(mockGtag).toHaveBeenCalledWith(
			"event",
			"page_view",
			expect.objectContaining({
				page_category: "portfolio",
				content_type: "case_study",
			})
		);
	});

	it("categorizes technology pages correctly", () => {
		mockPathname = "/technologies/react";
		render(<PageAnalytics />);
		expect(mockGtag).toHaveBeenCalledWith(
			"event",
			"page_view",
			expect.objectContaining({
				page_category: "technologies",
				content_type: "technology_page",
			})
		);
	});

	it("categorizes role pages correctly", () => {
		mockPathname = "/for/cto";
		render(<PageAnalytics />);
		expect(mockGtag).toHaveBeenCalledWith(
			"event",
			"page_view",
			expect.objectContaining({
				page_category: "roles",
			})
		);
	});

	it("categorizes unknown pages as other", () => {
		mockPathname = "/random-page";
		render(<PageAnalytics />);
		expect(mockGtag).toHaveBeenCalledWith(
			"event",
			"page_view",
			expect.objectContaining({
				page_category: "other",
				content_type: "static_page",
			})
		);
	});

	it("includes UTM params from search params", () => {
		mockPathname = "/";
		mockSearchParams = new URLSearchParams("utm_source=linkedin&utm_medium=social");
		render(<PageAnalytics />);
		expect(mockGtag).toHaveBeenCalledWith(
			"event",
			"page_view",
			expect.objectContaining({
				page_path: "/?utm_source=linkedin&utm_medium=social",
				campaign_source: "linkedin",
				campaign_medium: "social",
			})
		);
	});

	it("does not call gtag when gtag is undefined", () => {
		Object.defineProperty(window, "gtag", {
			value: undefined,
			writable: true,
			configurable: true,
		});
		render(<PageAnalytics />);
		// No error thrown
	});

	it("detects direct visitors when no referrer", () => {
		mockPathname = "/";
		render(<PageAnalytics />);
		expect(mockGtag).toHaveBeenCalledWith(
			"event",
			"page_view",
			expect.objectContaining({
				user_type: "direct_visitor",
			})
		);
	});
});
