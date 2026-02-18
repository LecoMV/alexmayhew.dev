import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { logger } from "@/lib/logger";

describe("logger", () => {
	let logSpy: ReturnType<typeof vi.spyOn>;
	let errorSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
		errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should output structured object with level, message, and ts", () => {
		logger.info("test message");

		expect(logSpy).toHaveBeenCalledOnce();
		const entry = logSpy.mock.calls[0][0];
		expect(entry).toMatchObject({ level: "info", message: "test message" });
		expect(typeof entry.ts).toBe("number");
	});

	it("should route debug to console.log", () => {
		logger.debug("debug msg");

		expect(logSpy).toHaveBeenCalledOnce();
		expect(errorSpy).not.toHaveBeenCalled();
		expect(logSpy.mock.calls[0][0].level).toBe("debug");
	});

	it("should route info to console.log", () => {
		logger.info("info msg");

		expect(logSpy).toHaveBeenCalledOnce();
		expect(errorSpy).not.toHaveBeenCalled();
	});

	it("should route warn to console.error", () => {
		logger.warn("warn msg");

		expect(errorSpy).toHaveBeenCalledOnce();
		expect(logSpy).not.toHaveBeenCalled();
		expect(errorSpy.mock.calls[0][0].level).toBe("warn");
	});

	it("should route error to console.error", () => {
		logger.error("error msg");

		expect(errorSpy).toHaveBeenCalledOnce();
		expect(logSpy).not.toHaveBeenCalled();
		expect(errorSpy.mock.calls[0][0].level).toBe("error");
	});

	it("should pass through extra fields", () => {
		logger.error("request failed", {
			requestId: "abc-123",
			route: "/api/test",
			method: "POST",
			status: 500,
			durationMs: 42,
		});

		const entry = errorSpy.mock.calls[0][0];
		expect(entry).toMatchObject({
			level: "error",
			message: "request failed",
			requestId: "abc-123",
			route: "/api/test",
			method: "POST",
			status: 500,
			durationMs: 42,
		});
	});

	it("should include ts as a number from Date.now()", () => {
		const before = Date.now();
		logger.info("timing test");
		const after = Date.now();

		const entry = logSpy.mock.calls[0][0];
		expect(entry.ts).toBeGreaterThanOrEqual(before);
		expect(entry.ts).toBeLessThanOrEqual(after);
	});

	it("should not allow fields to override level", () => {
		logger.error("real error", { level: "debug" } as never);
		const entry = errorSpy.mock.calls[0][0];
		expect(entry.level).toBe("error");
	});

	it("should not allow fields to override ts", () => {
		const before = Date.now();
		logger.info("real info", { ts: 0 } as never);
		const entry = logSpy.mock.calls[0][0];
		expect(entry.ts).toBeGreaterThanOrEqual(before);
	});
});
