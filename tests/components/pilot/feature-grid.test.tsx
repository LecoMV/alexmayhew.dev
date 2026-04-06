import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FeatureGrid, SecuritySection } from "@/components/pilot/feature-grid";

describe("FeatureGrid", () => {
	it("renders all feature titles", () => {
		render(<FeatureGrid />);
		expect(screen.getByText("Session Management")).toBeTruthy();
		expect(screen.getByText("Memory Browser")).toBeTruthy();
		expect(screen.getByText("MCP Control")).toBeTruthy();
		expect(screen.getByText("Integrated Terminal")).toBeTruthy();
		expect(screen.getByText("System Monitor")).toBeTruthy();
		expect(screen.getByText("Profile Manager")).toBeTruthy();
	});

	it("renders feature descriptions", () => {
		render(<FeatureGrid />);
		expect(screen.getByText(/Monitor, inspect, and clean up/)).toBeTruthy();
		expect(screen.getByText(/Search across PostgreSQL/)).toBeTruthy();
	});
});

describe("SecuritySection", () => {
	it("renders all security features", () => {
		render(<SecuritySection />);
		expect(screen.getByText("Context Isolation")).toBeTruthy();
		expect(screen.getByText("No Telemetry")).toBeTruthy();
		expect(screen.getByText("OS Keychain")).toBeTruthy();
	});
});
