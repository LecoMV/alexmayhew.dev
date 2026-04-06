import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ResultViewer } from "@/components/traceforge/result-viewer";

import type { ProcessingResult } from "@/lib/hooks/use-vectorizer";

vi.mock("@/lib/vectorizer/sanitize", () => ({
	sanitizeSvg: (svg: string) => svg,
}));

const successResult: ProcessingResult = {
	success: true,
	final_svg: "<svg><rect/></svg>",
	total_duration: 500,
};

describe("ResultViewer", () => {
	const defaultProps = {
		result: null as ProcessingResult | null,
		svgContent: null as string | null,
		originalPreview: null as string | null,
		onDownload: vi.fn(),
		onGetPreview: vi.fn().mockResolvedValue(null),
	};

	it("renders null when no result", () => {
		const { container } = render(<ResultViewer {...defaultProps} />);
		expect(container.innerHTML).toBe("");
	});

	it("renders null when result is unsuccessful", () => {
		const { container } = render(<ResultViewer {...defaultProps} />);
		expect(container.innerHTML).toBe("");
	});

	it("renders view mode buttons with SVG content", () => {
		render(
			<ResultViewer
				{...defaultProps}
				result={successResult}
				svgContent='<svg><rect width="50" height="50"/></svg>'
			/>
		);
		expect(screen.getByText("SVG")).toBeTruthy();
		expect(screen.getByText("Original")).toBeTruthy();
	});

	it("renders download button", () => {
		render(
			<ResultViewer
				{...defaultProps}
				result={successResult}
				svgContent='<svg><rect width="50" height="50"/></svg>'
			/>
		);
		expect(screen.getByText("Download")).toBeTruthy();
	});

	it("renders copy button", () => {
		render(
			<ResultViewer
				{...defaultProps}
				result={successResult}
				svgContent='<svg><rect width="50" height="50"/></svg>'
			/>
		);
		expect(screen.getByText("Copy SVG")).toBeTruthy();
	});
});
