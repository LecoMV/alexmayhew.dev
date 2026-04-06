import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useVectorizer } from "@/lib/hooks/use-vectorizer";

const mockCreateObjectURL = vi.fn().mockReturnValue("blob:test-url");
const mockRevokeObjectURL = vi.fn();
Object.defineProperty(global.URL, "createObjectURL", {
	value: mockCreateObjectURL,
	writable: true,
});
Object.defineProperty(global.URL, "revokeObjectURL", {
	value: mockRevokeObjectURL,
	writable: true,
});

describe("useVectorizer", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		global.fetch = vi.fn();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("returns initial state", () => {
		const { result } = renderHook(() => useVectorizer());
		expect(result.current.status).toBe("idle");
		expect(result.current.taskId).toBeNull();
		expect(result.current.progress).toEqual([]);
		expect(result.current.result).toBeNull();
		expect(result.current.error).toBeNull();
		expect(result.current.previewUrl).toBeNull();
		expect(result.current.svgContent).toBeNull();
	});

	it("provides upload, process, reset, downloadSvg, getSvgPreview functions", () => {
		const { result } = renderHook(() => useVectorizer());
		expect(typeof result.current.upload).toBe("function");
		expect(typeof result.current.process).toBe("function");
		expect(typeof result.current.reset).toBe("function");
		expect(typeof result.current.downloadSvg).toBe("function");
		expect(typeof result.current.getSvgPreview).toBe("function");
	});

	it("reset returns to initial state", () => {
		const { result } = renderHook(() => useVectorizer());
		act(() => {
			result.current.reset();
		});
		expect(result.current.status).toBe("idle");
		expect(result.current.taskId).toBeNull();
	});

	it("upload sets status to uploading then uploaded on success", async () => {
		const mockFile = new File(["test"], "test.png", { type: "image/png" });
		(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ task_id: "task-123" }),
		});

		const { result } = renderHook(() => useVectorizer());

		await act(async () => {
			await result.current.upload(mockFile);
		});

		expect(result.current.status).toBe("uploaded");
		expect(result.current.taskId).toBe("task-123");
	});

	it("upload handles network error", async () => {
		const mockFile = new File(["test"], "test.png", { type: "image/png" });
		(global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("Network error"));

		const { result } = renderHook(() => useVectorizer());

		await act(async () => {
			await result.current.upload(mockFile);
		});

		expect(result.current.status).toBe("error");
		expect(result.current.error).toBeTruthy();
	});

	it("upload handles server error response", async () => {
		const mockFile = new File(["test"], "test.png", { type: "image/png" });
		(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
			ok: false,
			status: 500,
			statusText: "Internal Server Error",
			json: () => Promise.resolve({ detail: "Server error" }),
		});

		const { result } = renderHook(() => useVectorizer());

		await act(async () => {
			await result.current.upload(mockFile);
		});

		expect(result.current.status).toBe("error");
	});

	it("creates preview URL on upload", async () => {
		const mockFile = new File(["test"], "test.png", { type: "image/png" });
		(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ task_id: "task-456" }),
		});

		const { result } = renderHook(() => useVectorizer());

		await act(async () => {
			await result.current.upload(mockFile);
		});

		expect(mockCreateObjectURL).toHaveBeenCalledWith(mockFile);
		expect(result.current.previewUrl).toBe("blob:test-url");
	});

	it("process starts processing and sets status", async () => {
		const mockFile = new File(["test"], "test.png", { type: "image/png" });
		(global.fetch as ReturnType<typeof vi.fn>)
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ task_id: "task-789" }),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ status: "accepted" }),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () =>
					Promise.resolve({
						status: "completed",
						result: { success: true },
					}),
			});

		const { result } = renderHook(() => useVectorizer());

		await act(async () => {
			await result.current.upload(mockFile);
		});

		expect(result.current.taskId).toBe("task-789");
	});

	it("getSvgPreview returns null without taskId", async () => {
		const { result } = renderHook(() => useVectorizer());

		let preview: string | null = null;
		await act(async () => {
			preview = await result.current.getSvgPreview();
		});

		expect(preview).toBeNull();
	});

	it("downloadSvg does nothing without taskId", async () => {
		const { result } = renderHook(() => useVectorizer());

		await act(async () => {
			await result.current.downloadSvg();
		});

		expect(global.fetch).not.toHaveBeenCalled();
	});
});
