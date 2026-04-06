import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PresetSelector } from "@/components/traceforge/preset-selector";

describe("PresetSelector", () => {
	it("renders potrace presets and engine toggle", () => {
		render(
			<PresetSelector
				generator="potrace"
				selectedPreset="logo_smooth"
				onPresetChange={vi.fn()}
				onGeneratorChange={vi.fn()}
			/>
		);

		expect(screen.getByText("Potrace")).toBeTruthy();
		expect(screen.getByText("VTracer")).toBeTruthy();
		expect(screen.getByText("Logo Smooth")).toBeTruthy();
		expect(screen.getByText("Geometric")).toBeTruthy();
		expect(screen.getByText("Preset Guide")).toBeTruthy();
	});

	it("toggles preset guide on click", () => {
		render(
			<PresetSelector
				generator="potrace"
				selectedPreset="logo_smooth"
				onPresetChange={vi.fn()}
				onGeneratorChange={vi.fn()}
			/>
		);

		fireEvent.click(screen.getByText("Preset Guide"));
		expect(screen.getByText("When to use Potrace")).toBeTruthy();
		expect(screen.getByText("When to use VTracer")).toBeTruthy();
	});

	it("calls onGeneratorChange when VTracer is clicked", () => {
		const onGeneratorChange = vi.fn();
		render(
			<PresetSelector
				generator="potrace"
				selectedPreset="logo_smooth"
				onPresetChange={vi.fn()}
				onGeneratorChange={onGeneratorChange}
			/>
		);

		fireEvent.click(screen.getByText("VTracer"));
		expect(onGeneratorChange).toHaveBeenCalledWith("vtracer");
	});
});
