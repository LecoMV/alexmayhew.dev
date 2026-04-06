import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@sentry/nextjs", () => ({
	captureException: vi.fn(),
}));

import ErrorPage from "@/app/error";

describe("ErrorPage", () => {
	it("renders error message and try again button that calls reset", () => {
		const reset = vi.fn();
		render(<ErrorPage error={new Error("test error")} reset={reset} />);

		expect(screen.getByText("Something went wrong")).toBeTruthy();
		expect(screen.getByText("Try again")).toBeTruthy();
		expect(screen.getByText("Return home")).toBeTruthy();

		fireEvent.click(screen.getByText("Try again"));
		expect(reset).toHaveBeenCalled();
	});
});
