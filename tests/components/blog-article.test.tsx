import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { BlogArticle } from "@/components/blog/blog-article";

// LazyMotion/framer-motion needs jsdom-friendly stubbing.
vi.mock("framer-motion", async () => {
	const React = await import("react");
	const passthrough = (tag: string) => {
		const Component = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
			(props, ref) => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const Tag = tag as any;
				return <Tag ref={ref} {...props} />;
			}
		);
		Component.displayName = `Motion${tag}`;
		return Component;
	};
	return {
		m: new Proxy(
			{},
			{
				get: (_target, prop: string) => passthrough(prop),
			}
		),
		motion: new Proxy(
			{},
			{
				get: (_target, prop: string) => passthrough(prop),
			}
		),
		AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
	};
});

// Analytics/newsletter/theme hooks must not blow up in tests.
vi.mock("@/components/analytics", () => ({
	trackCTAClick: vi.fn(),
}));
vi.mock("@/components/newsletter", () => ({
	NewsletterSignup: () => <div data-testid="newsletter-signup" />,
}));
vi.mock("@/lib/blog-themes", () => ({
	useBlogTheme: () => ({
		theme: {
			colors: {
				background: "#000",
				text: "#fff",
				textMuted: "#888",
				accent: "#CCF381",
				accentFaint: "#333",
				border: "#222",
				borderHover: "#444",
			},
			layout: { showTags: true },
			typography: { categoryFormat: (c: string) => c },
		},
		springTransition: { duration: 0 },
	}),
}));
vi.mock("@/lib/hooks/use-content-analytics", () => ({
	useContentAnalytics: vi.fn(),
}));

const post = {
	slug: "test-post",
	data: {
		title: "A Test Post",
		description: "desc",
		publishedAt: new Date("2026-04-01T00:00:00Z"),
		readingTime: "5 min read",
		category: "architecture",
		tags: ["test"],
	},
};

describe("BlogArticle", () => {
	it("renders the relatedSection prop after the article body", () => {
		render(
			<BlogArticle
				post={post}
				relatedSection={<section data-testid="related-section">RELATED</section>}
			>
				<p>body</p>
			</BlogArticle>
		);
		expect(screen.getByTestId("related-section")).toBeDefined();
	});

	it("renders a visible author byline with 'By Alex Mayhew'", () => {
		render(
			<BlogArticle post={post}>
				<p>body</p>
			</BlogArticle>
		);
		expect(screen.getByText(/By Alex Mayhew/i)).toBeDefined();
	});
});
