import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProgressLog } from "@/components/traceforge/progress-log";

describe("ProgressLog", () => {
	it("renders process log header", () => {
		render(<ProgressLog logs={[]} status="idle" />);
		expect(screen.getByText("Process Log")).toBeTruthy();
	});

	it("renders log entries", () => {
		render(<ProgressLog logs={["Starting...", "Processing file..."]} status="processing" />);
		expect(screen.getByText("Starting...")).toBeTruthy();
		expect(screen.getByText("Processing file...")).toBeTruthy();
	});

	it("shows Ready status when idle", () => {
		render(<ProgressLog logs={[]} status="idle" />);
		expect(screen.getByText("Ready")).toBeTruthy();
	});

	it("shows Processing status", () => {
		render(<ProgressLog logs={["Working..."]} status="processing" />);
		expect(screen.getByText("Processing...")).toBeTruthy();
	});

	it("shows Complete status", () => {
		render(<ProgressLog logs={["Done"]} status="completed" />);
		expect(screen.getByText("Complete")).toBeTruthy();
	});

	it("shows Error status", () => {
		render(<ProgressLog logs={["Failed"]} status="error" />);
		expect(screen.getByText("Error")).toBeTruthy();
	});

	it("shows waiting message when no logs", () => {
		render(<ProgressLog logs={[]} status="idle" />);
		expect(screen.getByText("Waiting for input...")).toBeTruthy();
	});
});
