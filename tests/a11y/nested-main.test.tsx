import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@sentry/nextjs", () => ({
	captureException: vi.fn(),
}));

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

describe("Nested main — error.tsx", () => {
	it("does not render a <main> element (layout already provides one)", async () => {
		const { default: ErrorPage } = await import("@/app/error");
		const { container } = render(<ErrorPage error={new Error("test")} reset={() => {}} />);

		const mainElements = container.querySelectorAll("main");
		expect(mainElements).toHaveLength(0);
	});
});

describe("Nested main — not-found.tsx", () => {
	it("does not render a <main> element (layout already provides one)", async () => {
		const { default: NotFoundPage } = await import("@/app/not-found");
		const { container } = render(<NotFoundPage />);

		const mainElements = container.querySelectorAll("main");
		expect(mainElements).toHaveLength(0);
	});
});

describe("Nested main — offline/page.tsx", () => {
	it("does not render a <main> element (layout already provides one)", async () => {
		const { default: OfflinePage } = await import("@/app/offline/page");
		const { container } = render(<OfflinePage />);

		const mainElements = container.querySelectorAll("main");
		expect(mainElements).toHaveLength(0);
	});
});

describe("Nested main — demo/error.tsx", () => {
	it("does not render a <main> element (layout already provides one)", async () => {
		const { default: DemoError } = await import("@/app/demo/error");
		const { container } = render(<DemoError error={new Error("test")} reset={() => {}} />);

		const mainElements = container.querySelectorAll("main");
		expect(mainElements).toHaveLength(0);
	});
});

describe("Nested main — tools/traceforge/error.tsx", () => {
	it("does not render a <main> element (layout already provides one)", async () => {
		const { default: TraceForgeError } = await import("@/app/tools/traceforge/error");
		const { container } = render(<TraceForgeError error={new Error("test")} reset={() => {}} />);

		const mainElements = container.querySelectorAll("main");
		expect(mainElements).toHaveLength(0);
	});
});
