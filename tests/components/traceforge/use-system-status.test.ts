import { afterEach, describe, expect, it, vi } from "vitest";

import { resolveApiUrl } from "@/components/traceforge/use-system-status";

describe("resolveApiUrl", () => {
	const originalWindow = globalThis.window;

	afterEach(() => {
		// Restore original window.location
		if (originalWindow) {
			Object.defineProperty(window, "location", {
				value: originalWindow.location,
				writable: true,
				configurable: true,
			});
		}
	});

	it("returns explicit URL as-is when provided", () => {
		expect(resolveApiUrl("http://custom:9000")).toBe("http://custom:9000");
	});

	it("returns localhost URL when hostname is localhost", () => {
		Object.defineProperty(window, "location", {
			value: { hostname: "localhost" },
			writable: true,
			configurable: true,
		});
		expect(resolveApiUrl()).toBe("http://localhost:8000");
	});

	it("returns localhost URL when hostname is 127.0.0.1", () => {
		Object.defineProperty(window, "location", {
			value: { hostname: "127.0.0.1" },
			writable: true,
			configurable: true,
		});
		expect(resolveApiUrl()).toBe("http://localhost:8000");
	});

	it("returns production URL for non-localhost hostname", () => {
		Object.defineProperty(window, "location", {
			value: { hostname: "alexmayhew.dev" },
			writable: true,
			configurable: true,
		});
		expect(resolveApiUrl()).toBe("https://api.alexmayhew.dev");
	});

	it("returns production URL when window is undefined (SSR)", () => {
		const windowSpy = vi.spyOn(globalThis, "window", "get");
		windowSpy.mockReturnValue(undefined as unknown as Window & typeof globalThis);
		expect(resolveApiUrl()).toBe("https://api.alexmayhew.dev");
		windowSpy.mockRestore();
	});
});
