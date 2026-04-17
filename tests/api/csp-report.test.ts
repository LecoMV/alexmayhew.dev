import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/logger", () => ({
	logger: {
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
	},
}));

describe("POST /api/csp-report", () => {
	it("returns 204 on an empty body", async () => {
		const { POST } = await import("@/app/api/csp-report/route");
		const req = new Request("https://example.com/api/csp-report", {
			method: "POST",
			body: "",
		});
		const res = await POST(req);
		expect(res.status).toBe(204);
	});

	it("logs a legacy csp-report payload and returns 204", async () => {
		const { POST } = await import("@/app/api/csp-report/route");
		const { logger } = await import("@/lib/logger");
		const spy = logger.warn as ReturnType<typeof vi.fn>;

		const body = JSON.stringify({
			"csp-report": {
				"document-uri": "https://alexmayhew.dev/blog/x",
				"violated-directive": "script-src",
				"blocked-uri": "https://evil.example/x.js",
			},
		});
		const req = new Request("https://example.com/api/csp-report", {
			method: "POST",
			body,
			headers: { "content-type": "application/csp-report" },
		});
		const res = await POST(req);
		expect(res.status).toBe(204);
		expect(spy).toHaveBeenCalledWith(
			"csp-violation",
			expect.objectContaining({
				format: "legacy",
				documentURL: "https://alexmayhew.dev/blog/x",
				violatedDirective: "script-src",
				blockedURL: "https://evil.example/x.js",
			})
		);
	});

	it("logs Reporting API payloads (array of csp-violation entries)", async () => {
		const { POST } = await import("@/app/api/csp-report/route");
		const { logger } = await import("@/lib/logger");
		const spy = logger.warn as ReturnType<typeof vi.fn>;
		spy.mockClear();

		const body = JSON.stringify([
			{
				type: "csp-violation",
				body: {
					documentURL: "https://alexmayhew.dev/",
					violatedDirective: "img-src",
					blockedURL: "https://tracker.example/pixel.gif",
					disposition: "enforce",
				},
			},
		]);
		const req = new Request("https://example.com/api/csp-report", {
			method: "POST",
			body,
			headers: { "content-type": "application/reports+json" },
		});
		const res = await POST(req);
		expect(res.status).toBe(204);
		expect(spy).toHaveBeenCalledWith(
			"csp-violation",
			expect.objectContaining({
				format: "reports-api",
				documentURL: "https://alexmayhew.dev/",
				violatedDirective: "img-src",
			})
		);
	});

	it("silently returns 204 on malformed JSON (does not 500 on noisy browsers)", async () => {
		const { POST } = await import("@/app/api/csp-report/route");
		const req = new Request("https://example.com/api/csp-report", {
			method: "POST",
			body: "not-json{{",
		});
		const res = await POST(req);
		expect(res.status).toBe(204);
	});
});
