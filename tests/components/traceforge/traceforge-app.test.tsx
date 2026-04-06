import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/hooks/use-vectorizer", () => ({
	useVectorizer: () => ({
		status: "idle",
		taskId: null,
		progress: [],
		result: null,
		error: null,
		previewUrl: null,
		svgContent: null,
		upload: vi.fn(),
		process: vi.fn(),
		reset: vi.fn(),
		downloadSvg: vi.fn(),
		getSvgPreview: vi.fn(),
	}),
}));

vi.mock("@/lib/motion-constants", () => ({
	springTransition: {},
}));

vi.mock("@/components/traceforge/preset-selector", () => ({
	PresetSelector: () => <div data-testid="preset-selector" />,
}));

vi.mock("@/components/traceforge/progress-log", () => ({
	ProgressLog: () => <div data-testid="progress-log" />,
}));

vi.mock("@/components/traceforge/result-viewer", () => ({
	ResultViewer: () => <div data-testid="result-viewer" />,
}));

vi.mock("@/components/traceforge/upload-zone", () => ({
	UploadZone: () => <div data-testid="upload-zone" />,
}));

import { TraceForgeApp } from "@/components/traceforge/traceforge-app";

describe("TraceForgeApp", () => {
	it("renders feature grid and main interface sections", () => {
		render(<TraceForgeApp />);

		expect(screen.getByText("10+ Presets")).toBeTruthy();
		expect(screen.getByText("Dual Engines")).toBeTruthy();
		expect(screen.getByText("Open Source")).toBeTruthy();
		expect(screen.getByText("Clean Output")).toBeTruthy();
		expect(screen.getByText("Upload Image")).toBeTruthy();
		expect(screen.getByText("Choose Preset")).toBeTruthy();
		expect(screen.getByText("Vectorize")).toBeTruthy();
	});
});
