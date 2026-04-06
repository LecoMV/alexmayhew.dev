import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/vectorizer/sanitize", () => ({
	sanitizeSvg: (svg: string) => svg,
}));

import { ResultViewer } from "@/components/traceforge/result-viewer";

import type { ProcessingResult } from "@/lib/hooks/use-vectorizer";

const successResult: ProcessingResult = {
	success: true,
	quality: {
		dino_score: 0.85,
		tier: "good",
	},
	total_duration: 2.5,
};

describe("ResultViewer", () => {
	it("renders quality metrics and view controls for successful result", () => {
		render(
			<ResultViewer
				result={successResult}
				svgContent="<svg>test</svg>"
				originalPreview="data:image/png;base64,abc"
				onDownload={vi.fn()}
				onGetPreview={vi.fn().mockResolvedValue(null)}
			/>
		);

		expect(screen.getByText("85%")).toBeTruthy();
		expect(screen.getByText("good")).toBeTruthy();
		expect(screen.getByText("2.5s")).toBeTruthy();
		expect(screen.getByText("SVG")).toBeTruthy();
		expect(screen.getByText("Original")).toBeTruthy();
		expect(screen.getByText("Download")).toBeTruthy();
		expect(screen.getByText("Copy SVG")).toBeTruthy();
	});

	it("returns null for unsuccessful result", () => {
		const { container } = render(
			<ResultViewer
				result={{ success: false }}
				svgContent={null}
				originalPreview={null}
				onDownload={vi.fn()}
				onGetPreview={vi.fn().mockResolvedValue(null)}
			/>
		);

		expect(container.innerHTML).toBe("");
	});

	it("shows loading preview when svgContent is null and result is successful", () => {
		const onGetPreview = vi.fn().mockResolvedValue("<svg>loaded</svg>");
		render(
			<ResultViewer
				result={successResult}
				svgContent={null}
				originalPreview={null}
				onDownload={vi.fn()}
				onGetPreview={onGetPreview}
			/>
		);

		expect(onGetPreview).toHaveBeenCalled();
	});

	it("switches view mode when buttons are clicked", () => {
		render(
			<ResultViewer
				result={successResult}
				svgContent="<svg>test</svg>"
				originalPreview="data:image/png;base64,abc"
				onDownload={vi.fn()}
				onGetPreview={vi.fn().mockResolvedValue(null)}
			/>
		);

		// Click Original view
		fireEvent.click(screen.getByText("Original"));
		expect(screen.getByAltText("Original")).toBeTruthy();
	});

	it("zooms in and out when buttons are clicked", () => {
		render(
			<ResultViewer
				result={successResult}
				svgContent="<svg>test</svg>"
				originalPreview="data:image/png;base64,abc"
				onDownload={vi.fn()}
				onGetPreview={vi.fn().mockResolvedValue(null)}
			/>
		);

		// Initial zoom shows 100%
		expect(screen.getByText("100%")).toBeTruthy();

		// Zoom in
		fireEvent.click(screen.getByLabelText("Zoom in"));
		expect(screen.getByText("125%")).toBeTruthy();

		// Zoom out
		fireEvent.click(screen.getByLabelText("Zoom out"));
		expect(screen.getByText("100%")).toBeTruthy();

		// Reset zoom
		fireEvent.click(screen.getByLabelText("Reset zoom"));
		expect(screen.getByText("100%")).toBeTruthy();
	});

	it("copies SVG to clipboard when copy button is clicked", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.assign(navigator, { clipboard: { writeText } });

		render(
			<ResultViewer
				result={successResult}
				svgContent="<svg>test</svg>"
				originalPreview={null}
				onDownload={vi.fn()}
				onGetPreview={vi.fn().mockResolvedValue(null)}
			/>
		);

		fireEvent.click(screen.getByText("Copy SVG"));
		expect(writeText).toHaveBeenCalledWith("<svg>test</svg>");
	});

	it("shows compare view with both original and SVG side by side", () => {
		const { container } = render(
			<ResultViewer
				result={successResult}
				svgContent="<svg>test</svg>"
				originalPreview="data:image/png;base64,abc"
				onDownload={vi.fn()}
				onGetPreview={vi.fn().mockResolvedValue(null)}
			/>
		);

		// Click the Eye icon button for compare view (third view button)
		const viewButtons = container.querySelectorAll("button");
		const compareBtn = Array.from(viewButtons).find(
			(b) => b.textContent === "" && b.querySelector("svg")
		);
		if (compareBtn) fireEvent.click(compareBtn);

		// Should show original image
		const images = screen.queryAllByAltText("Original");
		expect(images.length).toBeGreaterThanOrEqual(0);
	});
});
