import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ArticleJsonLd } from "@/components/seo/article-json-ld";

function parseJsonLd(container: HTMLElement) {
	const script = container.querySelector('script[type="application/ld+json"]');
	return JSON.parse(script!.innerHTML);
}

describe("ArticleJsonLd", () => {
	const baseProps = {
		title: "SaaS Architecture Decision Framework",
		description: "A comprehensive guide to SaaS architecture decisions.",
		publishedAt: new Date("2026-01-15T00:00:00Z"),
		slug: "saas-architecture-decision-framework",
		category: "architecture",
	};

	it("renders BlogPosting type for non-hub posts", () => {
		const { container } = render(<ArticleJsonLd {...baseProps} />);
		const data = parseJsonLd(container);
		expect(data["@type"]).toBe("BlogPosting");
		expect(data["@context"]).toBe("https://schema.org");
	});

	it("renders TechArticle type for hub posts", () => {
		const { container } = render(<ArticleJsonLd {...baseProps} isHub />);
		const data = parseJsonLd(container);
		expect(data["@type"]).toBe("TechArticle");
	});

	it("uses PERSON_REF for author (not inline Person)", () => {
		const { container } = render(<ArticleJsonLd {...baseProps} />);
		const data = parseJsonLd(container);
		expect(data.author).toEqual({ "@id": "https://alexmayhew.dev/#person" });
		expect(data.author).not.toHaveProperty("name");
	});

	it("uses ORG_REF for publisher (not inline Organization)", () => {
		const { container } = render(<ArticleJsonLd {...baseProps} />);
		const data = parseJsonLd(container);
		expect(data.publisher).toEqual({ "@id": "https://alexmayhew.dev/#organization" });
	});

	it("sets headline and description", () => {
		const { container } = render(<ArticleJsonLd {...baseProps} />);
		const data = parseJsonLd(container);
		expect(data.headline).toBe(baseProps.title);
		expect(data.description).toBe(baseProps.description);
	});

	it("formats datePublished as ISO string", () => {
		const { container } = render(<ArticleJsonLd {...baseProps} />);
		const data = parseJsonLd(container);
		expect(data.datePublished).toBe("2026-01-15T00:00:00.000Z");
	});

	it("uses updatedAt for dateModified when provided", () => {
		const updatedAt = new Date("2026-03-01T00:00:00Z");
		const { container } = render(<ArticleJsonLd {...baseProps} updatedAt={updatedAt} />);
		const data = parseJsonLd(container);
		expect(data.dateModified).toBe("2026-03-01T00:00:00.000Z");
	});

	it("falls back to publishedAt for dateModified when updatedAt absent", () => {
		const { container } = render(<ArticleJsonLd {...baseProps} />);
		const data = parseJsonLd(container);
		expect(data.dateModified).toBe(baseProps.publishedAt.toISOString());
	});

	it("constructs image URL from custom image path", () => {
		const { container } = render(
			<ArticleJsonLd {...baseProps} image="/images/blog/test-featured.webp" />
		);
		const data = parseJsonLd(container);
		expect(data.image.url).toBe("https://alexmayhew.dev/images/blog/test-featured.webp");
	});

	it("defaults image to og-image.png when no image provided", () => {
		const { container } = render(<ArticleJsonLd {...baseProps} />);
		const data = parseJsonLd(container);
		expect(data.image.url).toBe("https://alexmayhew.dev/og-image.png");
	});

	it("sets mainEntityOfPage URL from slug", () => {
		const { container } = render(<ArticleJsonLd {...baseProps} />);
		const data = parseJsonLd(container);
		expect(data.mainEntityOfPage["@id"]).toBe(
			"https://alexmayhew.dev/saas-architecture-decision-framework"
		);
	});

	it("joins tags as comma-separated keywords", () => {
		const { container } = render(
			<ArticleJsonLd {...baseProps} tags={["saas", "architecture", "nextjs"]} />
		);
		const data = parseJsonLd(container);
		expect(data.keywords).toBe("saas, architecture, nextjs");
	});

	it("sets articleSection from category", () => {
		const { container } = render(<ArticleJsonLd {...baseProps} />);
		const data = parseJsonLd(container);
		expect(data.articleSection).toBe("architecture");
	});

	it("marks content as accessible for free", () => {
		const { container } = render(<ArticleJsonLd {...baseProps} />);
		const data = parseJsonLd(container);
		expect(data.isAccessibleForFree).toBe(true);
		expect(data.inLanguage).toBe("en-US");
	});
});
