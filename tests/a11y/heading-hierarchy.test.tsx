import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { BlogList } from "@/components/blog/blog-list";
import { AboutPage } from "@/components/pages/about-page";
import { ContactPage } from "@/components/pages/contact-page";
import { ToolsPage } from "@/components/pages/tools-page";
import { WorkPage } from "@/components/pages/work-page";

import type { Post } from "@/components/blog/types";

vi.mock("next/link", () => ({
	default: ({
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

vi.mock("@/app/actions/contact", () => ({
	submitContactAction: vi.fn(),
}));

vi.mock("@/components/analytics", () => ({
	trackEvent: vi.fn(),
	trackLeadEvent: vi.fn(),
}));

vi.mock("@/components/ui/turnstile", () => ({
	Turnstile: vi.fn(() => null),
}));

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
			typography: { headingPrefix: "//" },
			layout: { variant: "cards" },
		},
		springTransition: { type: "spring", stiffness: 100, damping: 20, mass: 1 },
	}),
}));

vi.mock("@/components/blog/layouts", () => ({
	CardsLayout: ({ posts }: { posts: Post[] }) => (
		<div data-testid="cards-layout">
			{posts.map((p) => (
				<div key={p.slug}>{p.data.title}</div>
			))}
		</div>
	),
	TerminalLayout: () => <div />,
	DossierLayout: () => <div />,
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

vi.mock("react-dom", async () => {
	const actual = await vi.importActual("react-dom");
	return {
		...actual,
		useFormStatus: () => ({ pending: false }),
	};
});

describe("Heading hierarchy — AboutPage", () => {
	it("uses h1 for the main heading, not for the section label", () => {
		render(<AboutPage />);

		const h1Elements = screen.getAllByRole("heading", { level: 1 });
		expect(h1Elements).toHaveLength(1);

		// The h1 should be the main heading, not the small label "About"
		expect(h1Elements[0].textContent).toContain("The difference between");
	});
});

describe("Heading hierarchy — ContactPage", () => {
	it("uses h1 for the main heading, not for the section label", () => {
		render(<ContactPage />);

		const h1Elements = screen.getAllByRole("heading", { level: 1 });
		expect(h1Elements).toHaveLength(1);

		expect(h1Elements[0].textContent).toContain("Initialize");
	});
});

vi.mock("@/data/projects", () => ({
	categories: ["All", "SaaS"],
	projects: [
		{
			id: "test-project",
			title: "Test Project",
			description: "Test description",
			year: "2024",
			category: "SaaS",
			tech: ["React"],
			featured: false,
		},
	],
}));

describe("Heading hierarchy — WorkPage", () => {
	it("uses h1 for the main heading, not for the section label", () => {
		render(<WorkPage />);

		const h1Elements = screen.getAllByRole("heading", { level: 1 });
		expect(h1Elements).toHaveLength(1);

		expect(h1Elements[0].textContent).toContain("Digital Instruments");
	});
});

describe("Heading hierarchy — ToolsPage", () => {
	it("uses h1 for the main heading, not for the section label", () => {
		render(<ToolsPage />);

		const h1Elements = screen.getAllByRole("heading", { level: 1 });
		expect(h1Elements).toHaveLength(1);

		expect(h1Elements[0].textContent).toContain("Precision Instruments");
	});
});

describe("Heading hierarchy — PrivacyPage", () => {
	it("uses h1 for the main heading, not for the section label", async () => {
		const { default: PrivacyPage } = await import("@/app/privacy/page");
		render(<PrivacyPage />);

		const h1Elements = screen.getAllByRole("heading", { level: 1 });
		expect(h1Elements).toHaveLength(1);

		expect(h1Elements[0].textContent).toContain("Privacy Policy");
	});
});

describe("Heading hierarchy — TermsPage", () => {
	it("uses h1 for the main heading, not for the section label", async () => {
		const { default: TermsPage } = await import("@/app/terms/page");
		render(<TermsPage />);

		const h1Elements = screen.getAllByRole("heading", { level: 1 });
		expect(h1Elements).toHaveLength(1);

		expect(h1Elements[0].textContent).toContain("Terms of Service");
	});
});

describe("Heading hierarchy — BlogList", () => {
	it("uses h1 for the main heading, not for the section label", () => {
		const posts: Post[] = [
			{
				slug: "test-post",
				data: {
					title: "Test Post",
					description: "A test post",
					publishedAt: new Date("2026-01-01"),
					category: "architecture",
					tags: ["test"],
				},
			},
		];
		render(<BlogList posts={posts} />);

		const h1Elements = screen.getAllByRole("heading", { level: 1 });
		expect(h1Elements).toHaveLength(1);

		expect(h1Elements[0].textContent).toContain("Engineering");
	});
});
