import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { GpuControl } from "@/components/traceforge/gpu-control";

describe("GpuControl", () => {
	const defaultProps = {
		apiUrl: "http://localhost:8000",
		isOnline: true,
		gpuEnabled: false,
		onToggleComplete: vi.fn(),
	};

	it("renders enable GPU text when GPU is disabled", () => {
		render(<GpuControl {...defaultProps} />);
		expect(screen.getByText("Enable GPU")).toBeTruthy();
	});

	it("renders disable GPU text when GPU is enabled", () => {
		render(<GpuControl {...defaultProps} gpuEnabled={true} />);
		expect(screen.getByText("Disable GPU")).toBeTruthy();
	});

	it("renders admin label", () => {
		render(<GpuControl {...defaultProps} />);
		expect(screen.getByText("Admin")).toBeTruthy();
	});
});
