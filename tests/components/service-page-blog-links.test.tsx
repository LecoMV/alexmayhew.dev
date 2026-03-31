import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RelatedBlogPostsSection } from "@/components/seo/related-blog-posts";
import { getPageBySlug } from "@/data/pseo";
import { comparisonPages } from "@/data/pseo/comparisons";
import { integrationPages } from "@/data/pseo/integrations";
import { migrationPages } from "@/data/pseo/migrations";

describe("pSEO page relatedBlogPosts integration", () => {
	it("renders blog links from a service page data source", () => {
		const page = getPageBySlug("nextjs-developer-for-fintech");
		expect(page).toBeDefined();
		expect(page!.relatedBlogPosts.length).toBeGreaterThan(0);

		render(<RelatedBlogPostsSection slugs={page!.relatedBlogPosts} />);
		expect(screen.getByText("Related Insights")).toBeDefined();

		const links = screen.getAllByRole("link");
		expect(links.length).toBe(page!.relatedBlogPosts.length);
		for (const link of links) {
			expect(link.getAttribute("href")).toMatch(/^\/blog\//);
		}
	});

	it("renders blog links from a migration page data source", () => {
		const page = migrationPages.find((p) => p.relatedBlogPosts.length > 0);
		expect(page).toBeDefined();

		const { unmount } = render(<RelatedBlogPostsSection slugs={page!.relatedBlogPosts} />);
		expect(screen.getByText("Related Insights")).toBeDefined();
		unmount();
	});

	it("renders blog links from an integration page data source", () => {
		const page = integrationPages.find((p) => p.relatedBlogPosts.length > 0);
		expect(page).toBeDefined();

		const { unmount } = render(<RelatedBlogPostsSection slugs={page!.relatedBlogPosts} />);
		expect(screen.getByText("Related Insights")).toBeDefined();
		unmount();
	});

	it("renders blog links from a comparison page data source", () => {
		const page = comparisonPages.find((p) => p.relatedBlogPosts.length > 0);
		expect(page).toBeDefined();

		const { unmount } = render(<RelatedBlogPostsSection slugs={page!.relatedBlogPosts} />);
		expect(screen.getByText("Related Insights")).toBeDefined();
		unmount();
	});
});
