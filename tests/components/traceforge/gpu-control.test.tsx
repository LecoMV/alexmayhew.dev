import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GpuControl } from "@/components/traceforge/gpu-control";

describe("GpuControl", () => {
	const defaultProps = {
		apiUrl: "http://localhost:8000",
		isOnline: true,
		gpuEnabled: false,
		onToggleComplete: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
		global.fetch = vi.fn();
	});

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

	it("shows password form when button is clicked", async () => {
		render(<GpuControl {...defaultProps} />);
		fireEvent.click(screen.getByText("Enable GPU"));

		await waitFor(() => {
			expect(screen.getByPlaceholderText("Admin password...")).toBeTruthy();
		});
	});

	it("hides password form and resets state on cancel", async () => {
		render(<GpuControl {...defaultProps} />);
		fireEvent.click(screen.getByText("Enable GPU"));

		await waitFor(() => {
			expect(screen.getByText("Cancel")).toBeTruthy();
		});

		fireEvent.click(screen.getByText("Cancel"));

		await waitFor(() => {
			expect(screen.getByText("Enable GPU")).toBeTruthy();
		});
	});
	it("submits enable request with password and calls onToggleComplete", async () => {
		vi.mocked(global.fetch).mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({}),
		} as Response);

		const onToggleComplete = vi.fn();
		render(<GpuControl {...defaultProps} onToggleComplete={onToggleComplete} />);

		fireEvent.click(screen.getByText("Enable GPU"));
		await waitFor(() => {
			expect(screen.getByPlaceholderText("Admin password...")).toBeTruthy();
		});

		const input = screen.getByPlaceholderText("Admin password...");
		fireEvent.change(input, { target: { value: "secret123" } });
		fireEvent.submit(input.closest("form")!);

		await waitFor(() => {
			expect(global.fetch).toHaveBeenCalledWith("http://localhost:8000/gpu/enable", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ password: "secret123" }),
				signal: expect.any(AbortSignal),
			});
			expect(onToggleComplete).toHaveBeenCalled();
		});
	});

	it("shows error on failed authentication response", async () => {
		vi.mocked(global.fetch).mockResolvedValueOnce({
			ok: false,
			json: () => Promise.resolve({ detail: "Invalid password" }),
		} as Response);

		render(<GpuControl {...defaultProps} />);
		fireEvent.click(screen.getByText("Enable GPU"));
		await waitFor(() => expect(screen.getByPlaceholderText("Admin password...")).toBeTruthy());

		const input = screen.getByPlaceholderText("Admin password...");
		fireEvent.change(input, { target: { value: "wrong" } });
		fireEvent.submit(input.closest("form")!);

		await waitFor(() => {
			expect(screen.getByText("Invalid password")).toBeTruthy();
		});
	});

	it("shows connection failed on fetch error", async () => {
		vi.mocked(global.fetch).mockRejectedValueOnce(new Error("Network error"));

		render(<GpuControl {...defaultProps} />);
		fireEvent.click(screen.getByText("Enable GPU"));
		await waitFor(() => expect(screen.getByPlaceholderText("Admin password...")).toBeTruthy());

		const input = screen.getByPlaceholderText("Admin password...");
		fireEvent.change(input, { target: { value: "pass" } });
		fireEvent.submit(input.closest("form")!);

		await waitFor(() => {
			expect(screen.getByText("Connection failed")).toBeTruthy();
		});
	});

	it("sends disable request when GPU is enabled", async () => {
		vi.mocked(global.fetch).mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({}),
		} as Response);

		render(<GpuControl {...defaultProps} gpuEnabled={true} />);
		fireEvent.click(screen.getByText("Disable GPU"));
		await waitFor(() => expect(screen.getByPlaceholderText("Admin password...")).toBeTruthy());

		const input = screen.getByPlaceholderText("Admin password...");
		fireEvent.change(input, { target: { value: "pass" } });
		fireEvent.submit(input.closest("form")!);

		await waitFor(() => {
			expect(global.fetch).toHaveBeenCalledWith(
				"http://localhost:8000/gpu/disable",
				expect.any(Object)
			);
		});
	});
});
