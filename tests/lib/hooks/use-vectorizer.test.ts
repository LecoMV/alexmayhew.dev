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
		expect(result.current.error).toBe("Network error");
	});

	it("upload handles server error response with error field", async () => {
		const mockFile = new File(["test"], "test.png", { type: "image/png" });
		(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
			ok: false,
			status: 500,
			json: () => Promise.resolve({ error: "File too large" }),
		});

		const { result } = renderHook(() => useVectorizer());

		await act(async () => {
			await result.current.upload(mockFile);
		});

		expect(result.current.status).toBe("error");
		expect(result.current.error).toBe("File too large");
	});

	it("upload handles server error response without error field", async () => {
		const mockFile = new File(["test"], "test.png", { type: "image/png" });
		(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
			ok: false,
			status: 500,
			json: () => Promise.resolve({}),
		});

		const { result } = renderHook(() => useVectorizer());

		await act(async () => {
			await result.current.upload(mockFile);
		});

		expect(result.current.status).toBe("error");
		expect(result.current.error).toBe("Upload failed");
	});

	it("upload handles non-Error throw", async () => {
		const mockFile = new File(["test"], "test.png", { type: "image/png" });
		(global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce("string error");

		const { result } = renderHook(() => useVectorizer());

		await act(async () => {
			await result.current.upload(mockFile);
		});

		expect(result.current.status).toBe("error");
		expect(result.current.error).toBe("Upload failed");
	});

	it("upload returns null on AbortError", async () => {
		const mockFile = new File(["test"], "test.png", { type: "image/png" });
		const abortError = new Error("aborted");
		abortError.name = "AbortError";
		(global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(abortError);

		const { result } = renderHook(() => useVectorizer());

		let taskId: string | null = "not-null";
		await act(async () => {
			taskId = await result.current.upload(mockFile);
		});

		expect(taskId).toBeNull();
		// Status should NOT be error for abort
		expect(result.current.status).not.toBe("error");
	});

	it("upload returns task_id on success", async () => {
		const mockFile = new File(["test"], "test.png", { type: "image/png" });
		(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ task_id: "task-abc" }),
		});

		const { result } = renderHook(() => useVectorizer());

		let taskId: string | null = null;
		await act(async () => {
			taskId = await result.current.upload(mockFile);
		});

		expect(taskId).toBe("task-abc");
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

	it("revokes previous preview URL on re-upload", async () => {
		const mockFile1 = new File(["test1"], "test1.png", { type: "image/png" });
		const mockFile2 = new File(["test2"], "test2.png", { type: "image/png" });

		(global.fetch as ReturnType<typeof vi.fn>)
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ task_id: "task-1" }),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ task_id: "task-2" }),
			});

		mockCreateObjectURL.mockReturnValueOnce("blob:url-1").mockReturnValueOnce("blob:url-2");

		const { result } = renderHook(() => useVectorizer());

		await act(async () => {
			await result.current.upload(mockFile1);
		});

		await act(async () => {
			await result.current.upload(mockFile2);
		});

		// First URL should have been revoked
		expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:url-1");
	});

	it("upload records progress messages", async () => {
		const mockFile = new File(["test"], "test.png", { type: "image/png" });
		(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ task_id: "task-prog" }),
		});

		const { result } = renderHook(() => useVectorizer());

		await act(async () => {
			await result.current.upload(mockFile);
		});

		expect(result.current.progress).toContain("Uploading image...");
		expect(result.current.progress).toContain("Upload complete. Ready to vectorize.");
	});

	it("upload error includes error message in progress", async () => {
		const mockFile = new File(["test"], "test.png", { type: "image/png" });
		(global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
			new Error("Connection refused")
		);

		const { result } = renderHook(() => useVectorizer());

		await act(async () => {
			await result.current.upload(mockFile);
		});

		expect(result.current.progress).toContain("Error: Connection refused");
	});
});

describe("useVectorizer process", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.useFakeTimers();
		global.fetch = vi.fn();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it("sets processing status and starts polling", async () => {
		(global.fetch as ReturnType<typeof vi.fn>)
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ task_id: "task-proc" }),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ status: "accepted" }),
			});

		const { result } = renderHook(() => useVectorizer());
		const mockFile = new File(["test"], "test.png", { type: "image/png" });

		await act(async () => {
			await result.current.upload(mockFile);
		});

		await act(async () => {
			await result.current.process("task-proc", {
				generator: "potrace",
				preset: "default",
			});
		});

		expect(result.current.status).toBe("processing");
		expect(result.current.progress).toContain("Starting vectorization with potrace (default)...");
	});

	it("polls until SUCCESS and sets completed state", async () => {
		(global.fetch as ReturnType<typeof vi.fn>)
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ task_id: "task-poll" }),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ status: "accepted" }),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () =>
					Promise.resolve({
						status: "PROCESSING",
						logs: ["Step 1: Upscaling"],
					}),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () =>
					Promise.resolve({
						status: "SUCCESS",
						result: {
							success: true,
							final_svg: "<svg>test</svg>",
							total_duration: 5.2,
						},
					}),
			});

		const { result } = renderHook(() => useVectorizer());
		const mockFile = new File(["test"], "test.png", { type: "image/png" });

		await act(async () => {
			await result.current.upload(mockFile);
		});

		await act(async () => {
			await result.current.process("task-poll", {
				generator: "vtracer",
				preset: "photo",
			});
		});

		// First poll — PROCESSING
		await act(async () => {
			vi.advanceTimersByTime(2000);
		});
		// Need to flush promises after timer
		await act(async () => {
			await Promise.resolve();
		});

		expect(result.current.progress).toContain("Step 1: Upscaling");

		// Second poll — SUCCESS
		await act(async () => {
			vi.advanceTimersByTime(2000);
		});
		await act(async () => {
			await Promise.resolve();
		});

		expect(result.current.status).toBe("completed");
		expect(result.current.result).toEqual({
			success: true,
			final_svg: "<svg>test</svg>",
			total_duration: 5.2,
		});
	});

	it("polls until FAILURE and sets error state", async () => {
		(global.fetch as ReturnType<typeof vi.fn>)
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ task_id: "task-fail" }),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ status: "accepted" }),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ status: "FAILURE" }),
			});

		const { result } = renderHook(() => useVectorizer());
		const mockFile = new File(["test"], "test.png", { type: "image/png" });

		await act(async () => {
			await result.current.upload(mockFile);
		});

		await act(async () => {
			await result.current.process("task-fail", {
				generator: "potrace",
				preset: "default",
			});
		});

		// Poll triggers FAILURE
		await act(async () => {
			vi.advanceTimersByTime(2000);
		});
		await act(async () => {
			await Promise.resolve();
		});

		expect(result.current.status).toBe("error");
		expect(result.current.error).toBe("Vectorization failed");
	});

	it("handles process API error response", async () => {
		(global.fetch as ReturnType<typeof vi.fn>)
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ task_id: "task-err" }),
			})
			.mockResolvedValueOnce({
				ok: false,
				json: () => Promise.resolve({ error: "Invalid generator" }),
			});

		const { result } = renderHook(() => useVectorizer());
		const mockFile = new File(["test"], "test.png", { type: "image/png" });

		await act(async () => {
			await result.current.upload(mockFile);
		});

		await act(async () => {
			await result.current.process("task-err", {
				generator: "potrace",
				preset: "default",
			});
		});

		expect(result.current.status).toBe("error");
		expect(result.current.error).toBe("Invalid generator");
	});

	it("handles process API error without error field", async () => {
		(global.fetch as ReturnType<typeof vi.fn>)
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ task_id: "task-nofield" }),
			})
			.mockResolvedValueOnce({
				ok: false,
				json: () => Promise.resolve({}),
			});

		const { result } = renderHook(() => useVectorizer());
		const mockFile = new File(["test"], "test.png", { type: "image/png" });

		await act(async () => {
			await result.current.upload(mockFile);
		});

		await act(async () => {
			await result.current.process("task-nofield", {
				generator: "potrace",
				preset: "default",
			});
		});

		expect(result.current.status).toBe("error");
		expect(result.current.error).toBe("Process request failed");
	});

	it("handles process network error", async () => {
		(global.fetch as ReturnType<typeof vi.fn>)
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ task_id: "task-net" }),
			})
			.mockRejectedValueOnce(new Error("Network timeout"));

		const { result } = renderHook(() => useVectorizer());
		const mockFile = new File(["test"], "test.png", { type: "image/png" });

		await act(async () => {
			await result.current.upload(mockFile);
		});

		await act(async () => {
			await result.current.process("task-net", {
				generator: "potrace",
				preset: "default",
			});
		});

		expect(result.current.status).toBe("error");
		expect(result.current.error).toBe("Network timeout");
	});

	it("handles process non-Error throw", async () => {
		(global.fetch as ReturnType<typeof vi.fn>)
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ task_id: "task-str" }),
			})
			.mockRejectedValueOnce("unknown error");

		const { result } = renderHook(() => useVectorizer());
		const mockFile = new File(["test"], "test.png", { type: "image/png" });

		await act(async () => {
			await result.current.upload(mockFile);
		});

		await act(async () => {
			await result.current.process("task-str", {
				generator: "potrace",
				preset: "default",
			});
		});

		expect(result.current.status).toBe("error");
		expect(result.current.error).toBe("Process failed");
	});

	it("silently ignores AbortError during process", async () => {
		const abortError = new Error("aborted");
		abortError.name = "AbortError";
		(global.fetch as ReturnType<typeof vi.fn>)
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ task_id: "task-abort" }),
			})
			.mockRejectedValueOnce(abortError);

		const { result } = renderHook(() => useVectorizer());
		const mockFile = new File(["test"], "test.png", { type: "image/png" });

		await act(async () => {
			await result.current.upload(mockFile);
		});

		await act(async () => {
			await result.current.process("task-abort", {
				generator: "potrace",
				preset: "default",
			});
		});

		// Should NOT set error for abort
		expect(result.current.status).not.toBe("error");
	});

	it("deduplicates progress logs from polling", async () => {
		(global.fetch as ReturnType<typeof vi.fn>)
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ task_id: "task-dedup" }),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ status: "accepted" }),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () =>
					Promise.resolve({
						status: "PROCESSING",
						logs: ["Step 1: Upscaling"],
					}),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () =>
					Promise.resolve({
						status: "PROCESSING",
						logs: ["Step 1: Upscaling", "Step 2: Generating"],
					}),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () =>
					Promise.resolve({
						status: "SUCCESS",
						result: { success: true },
					}),
			});

		const { result } = renderHook(() => useVectorizer());
		const mockFile = new File(["test"], "test.png", { type: "image/png" });

		await act(async () => {
			await result.current.upload(mockFile);
		});

		await act(async () => {
			await result.current.process("task-dedup", {
				generator: "potrace",
				preset: "default",
			});
		});

		// First poll
		await act(async () => {
			vi.advanceTimersByTime(2000);
		});
		await act(async () => {
			await Promise.resolve();
		});

		// Second poll (duplicate "Step 1" should not be re-added)
		await act(async () => {
			vi.advanceTimersByTime(2000);
		});
		await act(async () => {
			await Promise.resolve();
		});

		const upscaleCount = result.current.progress.filter((p) => p === "Step 1: Upscaling").length;
		expect(upscaleCount).toBe(1);
		expect(result.current.progress).toContain("Step 2: Generating");
	});

	it("handles poll status check failure gracefully", async () => {
		(global.fetch as ReturnType<typeof vi.fn>)
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ task_id: "task-pollerr" }),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ status: "accepted" }),
			})
			.mockResolvedValueOnce({
				ok: false,
				status: 500,
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () =>
					Promise.resolve({
						status: "SUCCESS",
						result: { success: true },
					}),
			});

		const { result } = renderHook(() => useVectorizer());
		const mockFile = new File(["test"], "test.png", { type: "image/png" });

		await act(async () => {
			await result.current.upload(mockFile);
		});

		await act(async () => {
			await result.current.process("task-pollerr", {
				generator: "potrace",
				preset: "default",
			});
		});

		// First poll fails — should keep processing
		await act(async () => {
			vi.advanceTimersByTime(2000);
		});
		await act(async () => {
			await Promise.resolve();
		});

		expect(result.current.status).toBe("processing");

		// Second poll succeeds
		await act(async () => {
			vi.advanceTimersByTime(2000);
		});
		await act(async () => {
			await Promise.resolve();
		});

		expect(result.current.status).toBe("completed");
	});

	it("handles poll with empty logs gracefully", async () => {
		(global.fetch as ReturnType<typeof vi.fn>)
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ task_id: "task-nologs" }),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ status: "accepted" }),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () =>
					Promise.resolve({
						status: "PROCESSING",
						logs: [],
					}),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () =>
					Promise.resolve({
						status: "SUCCESS",
						result: { success: true },
					}),
			});

		const { result } = renderHook(() => useVectorizer());
		const mockFile = new File(["test"], "test.png", { type: "image/png" });

		await act(async () => {
			await result.current.upload(mockFile);
		});

		await act(async () => {
			await result.current.process("task-nologs", {
				generator: "potrace",
				preset: "default",
			});
		});

		// Poll with empty logs
		await act(async () => {
			vi.advanceTimersByTime(2000);
		});
		await act(async () => {
			await Promise.resolve();
		});

		// Still processing, no crash
		expect(result.current.status).toBe("processing");

		// Complete
		await act(async () => {
			vi.advanceTimersByTime(2000);
		});
		await act(async () => {
			await Promise.resolve();
		});

		expect(result.current.status).toBe("completed");
	});

	it("handles poll with no logs field", async () => {
		(global.fetch as ReturnType<typeof vi.fn>)
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ task_id: "task-undef" }),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ status: "accepted" }),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () =>
					Promise.resolve({
						status: "PROCESSING",
					}),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () =>
					Promise.resolve({
						status: "SUCCESS",
						result: { success: true },
					}),
			});

		const { result } = renderHook(() => useVectorizer());
		const mockFile = new File(["test"], "test.png", { type: "image/png" });

		await act(async () => {
			await result.current.upload(mockFile);
		});

		await act(async () => {
			await result.current.process("task-undef", {
				generator: "potrace",
				preset: "default",
			});
		});

		// Poll with no logs
		await act(async () => {
			vi.advanceTimersByTime(2000);
		});
		await act(async () => {
			await Promise.resolve();
		});

		expect(result.current.status).toBe("processing");

		await act(async () => {
			vi.advanceTimersByTime(2000);
		});
		await act(async () => {
			await Promise.resolve();
		});

		expect(result.current.status).toBe("completed");
	});
});

describe("useVectorizer downloadSvg", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		global.fetch = vi.fn();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("returns null without taskId", async () => {
		const { result } = renderHook(() => useVectorizer());

		let svg: string | null = "not-null";
		await act(async () => {
			svg = await result.current.downloadSvg();
		});

		expect(svg).toBeNull();
		expect(global.fetch).not.toHaveBeenCalled();
	});

	it("downloads SVG, creates blob, triggers download link, and cleans up", async () => {
		const svgContent = '<svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>';

		(global.fetch as ReturnType<typeof vi.fn>)
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ task_id: "task-dl" }),
			})
			.mockResolvedValueOnce({
				ok: true,
				text: () => Promise.resolve(svgContent),
			});

		const mockClick = vi.fn();
		const mockAppendChild = vi.spyOn(document.body, "appendChild").mockImplementation((node) => {
			// Simulate the anchor element
			return node;
		});
		const mockRemoveChild = vi.spyOn(document.body, "removeChild").mockImplementation((node) => {
			return node;
		});

		// Mock createElement to capture the anchor
		const originalCreateElement = document.createElement.bind(document);
		vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
			const el = originalCreateElement(tag);
			if (tag === "a") {
				el.click = mockClick;
			}
			return el;
		});

		const { result } = renderHook(() => useVectorizer());
		const mockFile = new File(["test"], "test.png", { type: "image/png" });

		await act(async () => {
			await result.current.upload(mockFile);
		});

		let svg: string | null = null;
		await act(async () => {
			svg = await result.current.downloadSvg();
		});

		expect(svg).toBe(svgContent);
		expect(result.current.svgContent).toBe(svgContent);
		expect(mockClick).toHaveBeenCalled();
		expect(mockAppendChild).toHaveBeenCalled();
		expect(mockRemoveChild).toHaveBeenCalled();
		// Blob URL should be revoked after download
		expect(mockRevokeObjectURL).toHaveBeenCalled();

		mockAppendChild.mockRestore();
		mockRemoveChild.mockRestore();
		(document.createElement as ReturnType<typeof vi.spyOn>).mockRestore();
	});

	it("returns null on download failure", async () => {
		(global.fetch as ReturnType<typeof vi.fn>)
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ task_id: "task-dlerr" }),
			})
			.mockResolvedValueOnce({
				ok: false,
				status: 404,
			});

		const { result } = renderHook(() => useVectorizer());
		const mockFile = new File(["test"], "test.png", { type: "image/png" });

		await act(async () => {
			await result.current.upload(mockFile);
		});

		let svg: string | null = "not-null";
		await act(async () => {
			svg = await result.current.downloadSvg();
		});

		expect(svg).toBeNull();
	});

	it("returns null on download network error", async () => {
		(global.fetch as ReturnType<typeof vi.fn>)
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ task_id: "task-dlnet" }),
			})
			.mockRejectedValueOnce(new Error("Network error"));

		const { result } = renderHook(() => useVectorizer());
		const mockFile = new File(["test"], "test.png", { type: "image/png" });

		await act(async () => {
			await result.current.upload(mockFile);
		});

		let svg: string | null = "not-null";
		await act(async () => {
			svg = await result.current.downloadSvg();
		});

		expect(svg).toBeNull();
	});
});

describe("useVectorizer getSvgPreview", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		global.fetch = vi.fn();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("returns null without taskId", async () => {
		const { result } = renderHook(() => useVectorizer());

		let preview: string | null = "not-null";
		await act(async () => {
			preview = await result.current.getSvgPreview();
		});

		expect(preview).toBeNull();
	});

	it("fetches SVG preview and stores it", async () => {
		const svgContent = '<svg xmlns="http://www.w3.org/2000/svg"><circle/></svg>';

		(global.fetch as ReturnType<typeof vi.fn>)
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ task_id: "task-preview" }),
			})
			.mockResolvedValueOnce({
				ok: true,
				text: () => Promise.resolve(svgContent),
			});

		const { result } = renderHook(() => useVectorizer());
		const mockFile = new File(["test"], "test.png", { type: "image/png" });

		await act(async () => {
			await result.current.upload(mockFile);
		});

		let preview: string | null = null;
		await act(async () => {
			preview = await result.current.getSvgPreview();
		});

		expect(preview).toBe(svgContent);
		expect(result.current.svgContent).toBe(svgContent);
	});

	it("returns cached svgContent if already fetched", async () => {
		const svgContent = "<svg><rect/></svg>";

		(global.fetch as ReturnType<typeof vi.fn>)
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ task_id: "task-cached" }),
			})
			.mockResolvedValueOnce({
				ok: true,
				text: () => Promise.resolve(svgContent),
			});

		const { result } = renderHook(() => useVectorizer());
		const mockFile = new File(["test"], "test.png", { type: "image/png" });

		await act(async () => {
			await result.current.upload(mockFile);
		});

		// First call fetches
		await act(async () => {
			await result.current.getSvgPreview();
		});

		// Second call should return cached — no extra fetch
		const fetchCallCount = (global.fetch as ReturnType<typeof vi.fn>).mock.calls.length;

		let preview: string | null = null;
		await act(async () => {
			preview = await result.current.getSvgPreview();
		});

		expect(preview).toBe(svgContent);
		// No additional fetch calls
		expect((global.fetch as ReturnType<typeof vi.fn>).mock.calls.length).toBe(fetchCallCount);
	});

	it("returns null on preview fetch failure", async () => {
		(global.fetch as ReturnType<typeof vi.fn>)
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ task_id: "task-prevfail" }),
			})
			.mockResolvedValueOnce({
				ok: false,
				status: 404,
			});

		const { result } = renderHook(() => useVectorizer());
		const mockFile = new File(["test"], "test.png", { type: "image/png" });

		await act(async () => {
			await result.current.upload(mockFile);
		});

		let preview: string | null = "not-null";
		await act(async () => {
			preview = await result.current.getSvgPreview();
		});

		expect(preview).toBeNull();
	});

	it("returns null on preview network error", async () => {
		(global.fetch as ReturnType<typeof vi.fn>)
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ task_id: "task-prevnet" }),
			})
			.mockRejectedValueOnce(new Error("Network error"));

		const { result } = renderHook(() => useVectorizer());
		const mockFile = new File(["test"], "test.png", { type: "image/png" });

		await act(async () => {
			await result.current.upload(mockFile);
		});

		let preview: string | null = "not-null";
		await act(async () => {
			preview = await result.current.getSvgPreview();
		});

		expect(preview).toBeNull();
	});
});

describe("useVectorizer cleanup", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.useFakeTimers();
		global.fetch = vi.fn();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it("cleans up polling on unmount", async () => {
		(global.fetch as ReturnType<typeof vi.fn>)
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ task_id: "task-cleanup" }),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ status: "accepted" }),
			})
			.mockResolvedValue({
				ok: true,
				json: () =>
					Promise.resolve({
						status: "PROCESSING",
						logs: ["Still working..."],
					}),
			});

		const { result, unmount } = renderHook(() => useVectorizer());
		const mockFile = new File(["test"], "test.png", { type: "image/png" });

		await act(async () => {
			await result.current.upload(mockFile);
		});

		await act(async () => {
			await result.current.process("task-cleanup", {
				generator: "potrace",
				preset: "default",
			});
		});

		// Unmount while polling
		unmount();

		// Further timer advances should not cause errors
		const fetchCount = (global.fetch as ReturnType<typeof vi.fn>).mock.calls.length;
		vi.advanceTimersByTime(10000);

		// No additional fetches after unmount cleanup
		expect((global.fetch as ReturnType<typeof vi.fn>).mock.calls.length).toBe(fetchCount);
	});

	it("reset cleans up polling, abort controller, and preview URL", async () => {
		(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ task_id: "task-reset" }),
		});

		mockCreateObjectURL.mockReturnValueOnce("blob:reset-url");

		const { result } = renderHook(() => useVectorizer());
		const mockFile = new File(["test"], "test.png", { type: "image/png" });

		await act(async () => {
			await result.current.upload(mockFile);
		});

		expect(result.current.status).toBe("uploaded");

		act(() => {
			result.current.reset();
		});

		expect(result.current.status).toBe("idle");
		expect(result.current.taskId).toBeNull();
		expect(result.current.progress).toEqual([]);
		expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:reset-url");
	});

	it("cleans up preview URL on unmount", async () => {
		(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ task_id: "task-unmount" }),
		});

		mockCreateObjectURL.mockReturnValueOnce("blob:unmount-url");

		const { result, unmount } = renderHook(() => useVectorizer());
		const mockFile = new File(["test"], "test.png", { type: "image/png" });

		await act(async () => {
			await result.current.upload(mockFile);
		});

		unmount();

		expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:unmount-url");
	});
});
