import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TechSpecs } from "@/components/pilot/tech-specs";

describe("TechSpecs", () => {
	it("renders spec labels", () => {
		render(<TechSpecs />);
		expect(screen.getByText("Framework")).toBeTruthy();
		expect(screen.getByText("Frontend")).toBeTruthy();
		expect(screen.getByText("IPC Layer")).toBeTruthy();
	});

	it("renders spec values", () => {
		render(<TechSpecs />);
		expect(screen.getByText("Electron 40")).toBeTruthy();
		expect(screen.getByText("React 19 + TypeScript")).toBeTruthy();
	});

	it("renders system requirements heading", () => {
		render(<TechSpecs />);
		expect(screen.getByText("System Requirements")).toBeTruthy();
	});

	it("renders all platform sections", () => {
		render(<TechSpecs />);
		expect(screen.getByText("macos")).toBeTruthy();
		expect(screen.getByText("linux")).toBeTruthy();
		expect(screen.getByText("windows")).toBeTruthy();
	});
});
