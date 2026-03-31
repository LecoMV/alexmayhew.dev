import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RelatedBlogPostsSection } from "@/components/seo/related-blog-posts";

describe("RelatedBlogPostsSection", () => {
	it("renders nothing when slugs array is empty", () => {
		const { container } = render(<RelatedBlogPostsSection slugs={[]} />);
		expect(container.innerHTML).toBe("");
	});

	it("renders Related Insights heading for valid slugs", () => {
		render(<RelatedBlogPostsSection slugs={["boring-technology-wins", "build-vs-buy"]} />);
		expect(screen.getByText("Related Insights")).toBeDefined();
	});

	it("links to correct blog URLs", () => {
		render(<RelatedBlogPostsSection slugs={["boring-technology-wins"]} />);
		const link = screen.getByRole("link");
		expect(link.getAttribute("href")).toBe("/blog/boring-technology-wins");
	});

	it("renders nothing when all slugs are invalid", () => {
		const { container } = render(<RelatedBlogPostsSection slugs={["nonexistent-post-xyz"]} />);
		expect(container.innerHTML).toBe("");
	});

	it("is exported from the seo barrel file", async () => {
		const seoExports = await import("@/components/seo");
		expect(seoExports.RelatedBlogPostsSection).toBeDefined();
	});
});
