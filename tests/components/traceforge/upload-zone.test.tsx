import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { UploadZone } from "@/components/traceforge/upload-zone";

describe("UploadZone", () => {
	const defaultProps = {
		onFileSelect: vi.fn(),
		previewUrl: null,
		onClear: vi.fn(),
	};

	it("renders the upload zone with drag prompt", () => {
		render(<UploadZone {...defaultProps} />);
		expect(screen.getByText(/drag/i)).toBeTruthy();
	});

	it("renders hidden file input", () => {
		const { container } = render(<UploadZone {...defaultProps} />);
		const input = container.querySelector('input[type="file"]');
		expect(input).toBeTruthy();
	});

	it("shows preview when previewUrl is provided", () => {
		render(<UploadZone {...defaultProps} previewUrl="data:image/png;base64,abc" />);
		expect(screen.getByAltText("Upload preview")).toBeTruthy();
	});

	it("shows clear button with preview", () => {
		render(<UploadZone {...defaultProps} previewUrl="data:image/png;base64,abc" />);
		expect(screen.getByLabelText("Remove image")).toBeTruthy();
	});

	it("renders in disabled state without crashing", () => {
		const { container } = render(<UploadZone {...defaultProps} disabled />);
		expect(container).toBeTruthy();
	});
});
