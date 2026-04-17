import { beforeEach, describe, expect, it, vi } from "vitest";

const { getCloudflareContextMock } = vi.hoisted(() => ({
	getCloudflareContextMock: vi.fn(),
}));

vi.mock("@opennextjs/cloudflare", () => ({
	getCloudflareContext: getCloudflareContextMock,
}));

vi.mock("@/lib/logger", () => ({
	logger: {
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
	},
}));

describe("POST /api/chat rate limiting (KV-based)", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns 429 when RATE_LIMIT_KV reports over limit", async () => {
		getCloudflareContextMock.mockResolvedValue({
			env: {
				RATE_LIMIT_KV: {
					get: vi.fn().mockResolvedValue("999"),
					put: vi.fn().mockResolvedValue(undefined),
				},
			},
		});
		const { POST } = await import("@/app/api/chat/route");
		const req = new Request("https://example.com/api/chat", {
			method: "POST",
			headers: { "cf-connecting-ip": "1.2.3.4" },
			body: JSON.stringify({ messages: [{ role: "user", content: "hi" }] }),
		});
		const res = await POST(req);
		expect(res.status).toBe(429);
		expect(res.headers.get("Retry-After")).toBe("60");
	});
});
