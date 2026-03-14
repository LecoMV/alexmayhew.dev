import * as Sentry from "@sentry/nextjs";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ErrorBoundary } from "@/components/ui/error-boundary";

vi.mock("@sentry/nextjs", () => ({
	captureException: vi.fn(),
}));

function ThrowingComponent(): never {
	throw new Error("Test error");
}

function SafeComponent() {
	return <div>Safe content</div>;
}

describe("ErrorBoundary", () => {
	beforeEach(() => {
		vi.spyOn(console, "error").mockImplementation(() => {});
	});

	it("renders children normally when no error occurs", () => {
		render(
			<ErrorBoundary>
				<SafeComponent />
			</ErrorBoundary>
		);
		expect(screen.getByText("Safe content")).toBeDefined();
	});

	it("renders custom fallback when child throws an error", () => {
		render(
			<ErrorBoundary fallback={<div>Something went wrong</div>}>
				<ThrowingComponent />
			</ErrorBoundary>
		);
		expect(screen.getByText("Something went wrong")).toBeDefined();
	});

	it("renders null when child throws and no fallback is provided", () => {
		const { container } = render(
			<ErrorBoundary>
				<ThrowingComponent />
			</ErrorBoundary>
		);
		expect(container.innerHTML).toBe("");
	});

	it("reports error to Sentry via componentDidCatch", () => {
		render(
			<ErrorBoundary fallback={<div>Fallback</div>}>
				<ThrowingComponent />
			</ErrorBoundary>
		);
		expect(Sentry.captureException).toHaveBeenCalledWith(
			expect.any(Error),
			expect.objectContaining({
				contexts: { react: { componentStack: expect.any(String) } },
			})
		);
	});

	it("does not render children after an error is caught", () => {
		render(
			<ErrorBoundary fallback={<div>Error UI</div>}>
				<ThrowingComponent />
			</ErrorBoundary>
		);
		expect(screen.queryByText("Test error")).toBeNull();
		expect(screen.getByText("Error UI")).toBeDefined();
	});
});
