import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@sentry/nextjs", () => ({
	captureException: vi.fn(),
}));

import TraceForgeError from "@/app/tools/traceforge/error";

describe("TraceForgeError", () => {
	it("renders traceforge crashed message and calls reset on button click", () => {
		const reset = vi.fn();
		render(<TraceForgeError error={new Error("test")} reset={reset} />);

		expect(screen.getByText("TraceForge crashed")).toBeTruthy();
		fireEvent.click(screen.getByText("Try again"));
		expect(reset).toHaveBeenCalled();
	});
});
