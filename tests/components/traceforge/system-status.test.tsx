import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SystemStatus } from "@/components/traceforge/system-status";

vi.mock("@/components/traceforge/use-system-status", () => ({
	useSystemStatus: () => ({
		status: {
			api: { online: true, version: "1.0.0" },
			gpu: { available: true, enabled: true, name: "RTX 3080" },
			potrace: { available: true },
			vtracer: { available: true },
			worker: { online: true },
		},
		isChecking: false,
		lastChecked: new Date(),
		isOnline: true,
		checkStatus: vi.fn(),
		url: "http://localhost:8000",
	}),
}));

vi.mock("@/components/traceforge/gpu-control", () => ({
	GpuControl: () => <div data-testid="gpu-control">GPU Control Mock</div>,
}));

describe("SystemStatus", () => {
	it("renders system status header", () => {
		render(<SystemStatus />);
		expect(screen.getByText("System Status")).toBeTruthy();
	});

	it("renders status items for all services", () => {
		render(<SystemStatus />);
		expect(screen.getByText("API Backend")).toBeTruthy();
		expect(screen.getByText("GPU Acceleration")).toBeTruthy();
		expect(screen.getByText("Potrace Engine")).toBeTruthy();
		expect(screen.getByText("VTracer Engine")).toBeTruthy();
		expect(screen.getByText("Task Worker")).toBeTruthy();
	});

	it("renders GPU control component", () => {
		render(<SystemStatus />);
		expect(screen.getByTestId("gpu-control")).toBeTruthy();
	});

	it("renders refresh button", () => {
		render(<SystemStatus />);
		expect(screen.getByTitle("Refresh status")).toBeTruthy();
	});
});
