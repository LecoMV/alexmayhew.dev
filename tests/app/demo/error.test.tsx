import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@sentry/nextjs", () => ({
	captureException: vi.fn(),
}));

import DemoError from "@/app/demo/error";

describe("DemoError", () => {
	it("renders terminal crashed message and calls reset on button click", () => {
		const reset = vi.fn();
		render(<DemoError error={new Error("test")} reset={reset} />);

		expect(screen.getByText("Terminal crashed")).toBeTruthy();
		fireEvent.click(screen.getByText("Try again"));
		expect(reset).toHaveBeenCalled();
	});
});
