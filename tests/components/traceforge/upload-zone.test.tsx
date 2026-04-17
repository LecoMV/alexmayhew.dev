import { fireEvent, render, screen } from "@testing-library/react";
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

	it("calls onFileSelect when a valid file is dropped", () => {
		const onFileSelect = vi.fn();
		const { container } = render(<UploadZone {...defaultProps} onFileSelect={onFileSelect} />);

		const dropZone = container.querySelector("[class*='cursor-pointer']")!;
		const file = new File(["pixels"], "test.png", { type: "image/png" });

		fireEvent.dragOver(dropZone, { dataTransfer: { files: [file] } });
		fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });

		expect(onFileSelect).toHaveBeenCalledWith(file);
	});

	it("shows error for invalid file type", () => {
		const { container } = render(<UploadZone {...defaultProps} />);

		const dropZone = container.querySelector("[class*='cursor-pointer']")!;
		const file = new File(["data"], "test.pdf", { type: "application/pdf" });

		fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });

		expect(screen.getByText(/Invalid file type/)).toBeTruthy();
	});

	it("shows error for file exceeding 20MB", () => {
		const { container } = render(<UploadZone {...defaultProps} />);

		const dropZone = container.querySelector("[class*='cursor-pointer']")!;
		const largeContent = new ArrayBuffer(21 * 1024 * 1024);
		const file = new File([largeContent], "huge.png", { type: "image/png" });

		fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });

		expect(screen.getByText(/File too large/)).toBeTruthy();
	});

	it("calls onFileSelect when file is selected via input", () => {
		const onFileSelect = vi.fn();
		const { container } = render(<UploadZone {...defaultProps} onFileSelect={onFileSelect} />);

		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		const file = new File(["pixels"], "test.jpg", { type: "image/jpeg" });

		fireEvent.change(input, { target: { files: [file] } });

		expect(onFileSelect).toHaveBeenCalledWith(file);
	});

	it("exposes the dropzone with a button role and aria-label", () => {
		render(<UploadZone {...defaultProps} />);
		const dropzone = screen.getByRole("button", { name: /upload file for trace analysis/i });
		expect(dropzone).toBeTruthy();
		expect(dropzone.getAttribute("tabindex")).toBe("0");
	});

	it("triggers file input click when Enter is pressed on the dropzone", () => {
		const { container } = render(<UploadZone {...defaultProps} />);
		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		const clickSpy = vi.spyOn(input, "click");

		const dropzone = screen.getByRole("button", { name: /upload file for trace analysis/i });
		fireEvent.keyDown(dropzone, { key: "Enter" });

		expect(clickSpy).toHaveBeenCalled();
	});

	it("does not call onFileSelect when disabled and file is dropped", () => {
		const onFileSelect = vi.fn();
		const { container } = render(
			<UploadZone {...defaultProps} onFileSelect={onFileSelect} disabled />
		);

		const dropZone = container.querySelector("[class*='cursor-']")!;
		const file = new File(["pixels"], "test.png", { type: "image/png" });

		fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });

		expect(onFileSelect).not.toHaveBeenCalled();
	});
});
