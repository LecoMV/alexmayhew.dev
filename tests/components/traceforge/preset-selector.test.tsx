import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PresetSelector } from "@/components/traceforge/preset-selector";

describe("PresetSelector", () => {
	const defaultProps = {
		generator: "potrace" as const,
		selectedPreset: "logo-smooth",
		onPresetChange: vi.fn(),
		onGeneratorChange: vi.fn(),
	};

	it("renders engine selector with Potrace and VTracer", () => {
		render(<PresetSelector {...defaultProps} />);
		expect(screen.getByText("Potrace")).toBeTruthy();
		expect(screen.getByText("VTracer")).toBeTruthy();
	});

	it("renders potrace preset options", () => {
		render(<PresetSelector {...defaultProps} />);
		expect(screen.getByText("Logo Smooth")).toBeTruthy();
		expect(screen.getByText("Geometric")).toBeTruthy();
	});

	it("renders in disabled state without crashing", () => {
		const { container } = render(<PresetSelector {...defaultProps} disabled />);
		expect(container).toBeTruthy();
	});

	it("renders vtracer presets when generator is vtracer", () => {
		render(<PresetSelector {...defaultProps} generator="vtracer" selectedPreset="logo" />);
		expect(screen.getByText("VTracer")).toBeTruthy();
	});
});
