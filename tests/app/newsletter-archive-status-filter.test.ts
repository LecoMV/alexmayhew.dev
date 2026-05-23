/**
 * Newsletter archive page (/newsletter) must only show issues with
 * status="sent". Draft/scheduled/reviewed issues are hidden because we
 * have 36 drafts sitting in the repo and 25 of them are future-dated.
 * Showing them on the archive erodes trust ("why is there an Aug 2026
 * issue in April?").
 *
 * Today: 3 drafts + 1 sent issue → archive shows 1 link.
 */
import { describe, expect, it, vi } from "vitest";

vi.mock("@/../.source/server", () => ({
	newsletter: [
		{
			issue: 1,
			title: "Real issue",
			subject: "sent",
			pillar: "architecture",
			status: "sent",
			publishedAt: new Date("2026-02-04"),
			info: { path: "/001-real.mdx" },
		},
		{
			issue: 2,
			title: "Draft issue",
			subject: "draft",
			pillar: "architecture",
			status: "draft",
			publishedAt: new Date("2026-02-11"),
			info: { path: "/002-draft.mdx" },
		},
		{
			issue: 3,
			title: "Future draft",
			subject: "future",
			pillar: "architecture",
			status: "draft",
			publishedAt: new Date("2026-12-31"),
			info: { path: "/003-future.mdx" },
		},
		{
			issue: 4,
			title: "Scheduled issue",
			subject: "scheduled",
			pillar: "architecture",
			status: "scheduled",
			publishedAt: new Date("2026-05-01"),
			info: { path: "/004-scheduled.mdx" },
		},
	],
}));

vi.mock("@/components/newsletter", () => ({
	NewsletterSignup: () => null,
}));

// Next.js Link is a simple passthrough for this render test.
vi.mock("next/link", () => ({
	default: ({ children, href }: { children: unknown; href: string }) =>
		({ type: "a", props: { href, children } }) as unknown,
}));

describe("Newsletter archive status filter", () => {
	it("renders only issues with status='sent'", async () => {
		const { default: NewsletterArchivePage } = await import("@/app/newsletter/page");
		const tree = NewsletterArchivePage() as {
			props: { children: { props: { children: { props: { children: unknown[] } } } } };
		};
		const serialized = JSON.stringify(tree);

		expect(serialized).toContain("Real issue");
		expect(serialized).not.toContain("Draft issue");
		expect(serialized).not.toContain("Future draft");
		expect(serialized).not.toContain("Scheduled issue");
	});
});
