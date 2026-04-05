import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { BlogList } from "@/components/blog/blog-list";

import type { Post } from "@/components/blog/types";

// Mock dependencies
vi.mock("@/lib/blog-themes", () => ({
	useBlogTheme: () => ({
		theme: {
			colors: {
				background: "#0B0E14",
				surface: "#1E293B",
				text: "#E2E8F0",
				textMuted: "#94A3B8",
				accent: "#CCF381",
				border: "rgba(255,255,255,0.1)",
			},
			typography: {
				headingPrefix: "//",
			},
			layout: {
				variant: "cards",
			},
		},
		springTransition: { type: "spring", stiffness: 100, damping: 20, mass: 1 },
	}),
}));

vi.mock("@/components/blog/layouts", () => ({
	CardsLayout: ({ posts }: { posts: Post[] }) => (
		<div data-testid="cards-layout">
			{posts.map((p) => (
				<div key={p.slug} data-testid={`post-${p.slug}`}>
					{p.data.title}
				</div>
			))}
		</div>
	),
	TerminalLayout: ({ posts }: { posts: Post[] }) => (
		<div data-testid="terminal-layout">
			{posts.map((p) => (
				<div key={p.slug}>{p.data.title}</div>
			))}
		</div>
	),
	DossierLayout: ({ posts }: { posts: Post[] }) => (
		<div data-testid="dossier-layout">
			{posts.map((p) => (
				<div key={p.slug}>{p.data.title}</div>
			))}
		</div>
	),
}));

vi.mock("@/components/analytics", () => ({
	trackEvent: vi.fn(),
}));

vi.mock("next-view-transitions", () => ({
	Link: ({
		children,
		href,
		...props
	}: {
		children: React.ReactNode;
		href: string;
		[key: string]: unknown;
	}) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}));

vi.mock("next/image", () => ({
	default: (props: Record<string, unknown>) => <img {...props} />,
}));

function createPosts(count: number, category = "architecture"): Post[] {
	return Array.from({ length: count }, (_, i) => ({
		slug: `post-${i + 1}`,
		data: {
			title: `Post ${i + 1}`,
			description: `Description for post ${i + 1}`,
			publishedAt: new Date(`2026-01-${String(i + 1).padStart(2, "0")}`),
			category,
			tags: ["test"],
		},
	}));
}

describe("BlogList pagination", () => {
	it("shows only 12 posts initially when more than 12 exist", () => {
		const posts = createPosts(20);
		render(<BlogList posts={posts} />);

		const layout = screen.getByTestId("cards-layout");
		const renderedPosts = layout.querySelectorAll("[data-testid^='post-']");
		expect(renderedPosts).toHaveLength(12);
	});

	it("shows Load More button when there are more posts to show", () => {
		const posts = createPosts(20);
		render(<BlogList posts={posts} />);

		const loadMoreButton = screen.getByRole("button", { name: /load more/i });
		expect(loadMoreButton).toBeDefined();
		expect(loadMoreButton.textContent).toContain("8 remaining");
	});

	it("shows 12 more posts when Load More is clicked", () => {
		const posts = createPosts(30);
		render(<BlogList posts={posts} />);

		const loadMoreButton = screen.getByRole("button", { name: /load more/i });
		fireEvent.click(loadMoreButton);

		const layout = screen.getByTestId("cards-layout");
		const renderedPosts = layout.querySelectorAll("[data-testid^='post-']");
		expect(renderedPosts).toHaveLength(24);
	});

	it("hides Load More button when all posts are loaded", () => {
		const posts = createPosts(20);
		render(<BlogList posts={posts} />);

		const loadMoreButton = screen.getByRole("button", { name: /load more/i });
		fireEvent.click(loadMoreButton);

		const hiddenButton = screen.queryByRole("button", { name: /load more/i });
		expect(hiddenButton).toBeNull();
	});

	it("resets visible count when category changes", () => {
		const archPosts = createPosts(15, "architecture");
		const frontendPosts = Array.from({ length: 10 }, (_, i) => ({
			slug: `fe-post-${i + 1}`,
			data: {
				title: `Frontend Post ${i + 1}`,
				description: `Frontend description ${i + 1}`,
				publishedAt: new Date(`2026-02-${String(i + 1).padStart(2, "0")}`),
				category: "frontend",
				tags: ["test"],
			},
		})) as Post[];
		const allPosts = [...archPosts, ...frontendPosts];
		render(<BlogList posts={allPosts} />);

		// Initially 12 of 25 visible in "all" category
		let layout = screen.getByTestId("cards-layout");
		expect(layout.querySelectorAll("[data-testid^='post-']")).toHaveLength(12);

		// Load more to show 24
		const loadMoreButton = screen.getByRole("button", { name: /load more/i });
		fireEvent.click(loadMoreButton);
		layout = screen.getByTestId("cards-layout");
		expect(layout.querySelectorAll("[data-testid^='post-']")).toHaveLength(24);

		// Switch to frontend category -- should reset to showing up to 12
		const frontendTab = screen.getByRole("button", { name: /frontend/i });
		fireEvent.click(frontendTab);
		layout = screen.getByTestId("cards-layout");
		// Only 10 frontend posts exist, so all 10 should show
		expect(layout.querySelectorAll("[data-testid^='post-']")).toHaveLength(10);

		// No Load More button since all 10 frontend posts visible
		expect(screen.queryByRole("button", { name: /load more/i })).toBeNull();
	});

	it("shows post count indicator with partial visibility", () => {
		const posts = createPosts(20);
		render(<BlogList posts={posts} />);

		expect(screen.getByText(/showing 12 of 20 articles/i)).toBeDefined();
	});

	it("shows total count when all posts visible", () => {
		const posts = createPosts(8);
		render(<BlogList posts={posts} />);

		expect(screen.getByText("8 articles")).toBeDefined();
	});

	it("does not show Load More button when all posts fit on first page", () => {
		const posts = createPosts(10);
		render(<BlogList posts={posts} />);

		const loadMoreButton = screen.queryByRole("button", { name: /load more/i });
		expect(loadMoreButton).toBeNull();
	});

	it("resets to 12 visible when switching to a category with more than 12 posts", () => {
		const archPosts = createPosts(15, "architecture");
		const frontendPosts = Array.from({ length: 15 }, (_, i) => ({
			slug: `fe-post-${i + 1}`,
			data: {
				title: `Frontend Post ${i + 1}`,
				description: `Frontend description ${i + 1}`,
				publishedAt: new Date(`2026-02-${String(i + 1).padStart(2, "0")}`),
				category: "frontend",
				tags: ["test"],
			},
		})) as Post[];
		const allPosts = [...archPosts, ...frontendPosts];
		render(<BlogList posts={allPosts} />);

		// Load more in "all" category (12 -> 24)
		fireEvent.click(screen.getByRole("button", { name: /load more/i }));

		// Switch to architecture (15 posts) -- should reset to 12 visible
		const archTab = screen.getByRole("button", { name: /architecture/i });
		fireEvent.click(archTab);
		const layout = screen.getByTestId("cards-layout");
		expect(layout.querySelectorAll("[data-testid^='post-']")).toHaveLength(12);
	});
});
