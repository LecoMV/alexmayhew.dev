import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useSystemStatus } from "@/components/traceforge/use-system-status";

describe("useSystemStatus hook", () => {
	beforeEach(() => {
		global.fetch = vi.fn();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("fetches system status on mount and sets status data", async () => {
		const mockData = {
			api: { online: true, version: "1.0.0" },
			gpu: { available: true, enabled: true, name: "RTX 3080" },
			potrace: { available: true },
			vtracer: { available: true },
			worker: { online: true },
		};
		vi.mocked(global.fetch).mockResolvedValue({
			ok: true,
			json: () => Promise.resolve(mockData),
		} as Response);

		const { result } = renderHook(() => useSystemStatus("http://test:8000"));

		await waitFor(() => {
			expect(result.current.isChecking).toBe(false);
		});

		expect(global.fetch).toHaveBeenCalledWith("http://test:8000/system-status", {
			method: "GET",
			signal: expect.any(AbortSignal),
		});
		expect(result.current.status).toEqual(mockData);
		expect(result.current.isOnline).toBe(true);
		expect(result.current.lastChecked).toBeInstanceOf(Date);
	});

	it("calls onStatusChange with false when response is not ok", async () => {
		vi.mocked(global.fetch).mockResolvedValue({
			ok: false,
			status: 500,
		} as Response);

		const onStatusChange = vi.fn();
		const { result } = renderHook(() => useSystemStatus("http://test:8000", onStatusChange));

		await waitFor(() => {
			expect(result.current.isChecking).toBe(false);
		});

		expect(onStatusChange).toHaveBeenCalledWith(false);
	});

	it("calls onStatusChange with false on fetch error", async () => {
		vi.mocked(global.fetch).mockRejectedValue(new Error("Network error"));

		const onStatusChange = vi.fn();
		const { result } = renderHook(() => useSystemStatus("http://test:8000", onStatusChange));

		await waitFor(() => {
			expect(result.current.isChecking).toBe(false);
		});

		expect(onStatusChange).toHaveBeenCalledWith(false);
	});

	it("isOnline is false when worker is offline", async () => {
		vi.mocked(global.fetch).mockResolvedValue({
			ok: true,
			json: () =>
				Promise.resolve({
					api: { online: true },
					gpu: { available: false },
					potrace: { available: true },
					vtracer: { available: true },
					worker: { online: false },
				}),
		} as Response);

		const { result } = renderHook(() => useSystemStatus("http://test:8000"));

		await waitFor(() => {
			expect(result.current.isChecking).toBe(false);
		});

		expect(result.current.isOnline).toBe(false);
	});

	it("returns the resolved url from props", () => {
		vi.mocked(global.fetch).mockResolvedValue({
			ok: true,
			json: () =>
				Promise.resolve({
					api: { online: true },
					worker: { online: true },
					gpu: { available: false },
					potrace: { available: true },
					vtracer: { available: true },
				}),
		} as Response);

		const { result } = renderHook(() => useSystemStatus("http://custom:9000"));
		expect(result.current.url).toBe("http://custom:9000");
	});
});
