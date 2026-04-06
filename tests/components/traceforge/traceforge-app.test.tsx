import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TraceForgeApp } from "@/components/traceforge/traceforge-app";

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

vi.mock("@/components/traceforge/preset-selector", () => ({
	PresetSelector: (props: Record<string, unknown>) => (
		<div data-testid="preset-selector" data-generator={props.generator as string} />
	),
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

describe("TraceForgeApp", () => {
	it("renders the main app with features", () => {
		render(<TraceForgeApp />);
		expect(screen.getByText("10+ Presets")).toBeTruthy();
		expect(screen.getByText("Dual Engines")).toBeTruthy();
		expect(screen.getByText("Open Source")).toBeTruthy();
		expect(screen.getByText("Clean Output")).toBeTruthy();
	});

	it("renders upload zone", () => {
		render(<TraceForgeApp />);
		expect(screen.getByTestId("upload-zone")).toBeTruthy();
	});

	it("renders preset selector", () => {
		render(<TraceForgeApp />);
		expect(screen.getByTestId("preset-selector")).toBeTruthy();
	});

	it("renders section headings", () => {
		render(<TraceForgeApp />);
		expect(screen.getByText("Upload Image")).toBeTruthy();
		expect(screen.getByText("Choose Preset")).toBeTruthy();
	});
});
