import { describe, expect, it, vi } from "vitest";

vi.mock("next/server", () => {
	return {
		NextResponse: {
			json: (body: unknown, init?: ResponseInit) => {
				const response = new Response(JSON.stringify(body), {
					status: init?.status ?? 200,
					headers: init?.headers,
				});
				return response;
			},
		},
	};
});

vi.mock("@/lib/env", () => ({
	publicEnv: {
		NODE_ENV: "test",
		NEXT_PUBLIC_GIT_SHA: "abc123",
		NEXT_PUBLIC_BUILD_TIME: "2026-01-01T00:00:00.000Z",
		NEXT_PUBLIC_SITE_VERSION: "1.0.0",
	},
}));

import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
	it("returns 200 status", async () => {
		const response = await GET();
		expect(response.status).toBe(200);
	});

	it("returns status ok in body", async () => {
		const response = await GET();
		const body = (await response.json()) as Record<string, unknown>;
		expect(body.status).toBe("ok");
	});

	it("returns a valid ISO timestamp", async () => {
		const response = await GET();
		const body = (await response.json()) as Record<string, unknown>;
		expect(body.timestamp).toBeDefined();
		const parsed = new Date(body.timestamp as string);
		expect(parsed.toISOString()).toBe(body.timestamp);
	});

	it("returns deployment info from env vars", async () => {
		const response = await GET();
		const body = (await response.json()) as Record<string, unknown>;
		expect(body.deployment).toEqual({
			sha: "abc123",
			buildTime: "2026-01-01T00:00:00.000Z",
			version: "1.0.0",
		});
	});

	it("sets Cache-Control to no-store, no-cache, must-revalidate", async () => {
		const response = await GET();
		expect(response.headers.get("Cache-Control")).toBe("no-store, no-cache, must-revalidate");
	});

	describe("dependency checks", () => {
		let originalFetch: typeof global.fetch;

		beforeEach(() => {
			originalFetch = global.fetch;
		});

		afterEach(() => {
			global.fetch = originalFetch;
		});

		it("returns dependencies.resend as reachable when Resend API responds 401", async () => {
			global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 401 });
			const response = await GET();
			const body = (await response.json()) as {
				status: string;
				dependencies: { resend: string };
			};
			expect(body.dependencies).toBeDefined();
			expect(body.dependencies.resend).toBe("reachable");
			expect(body.status).toBe("ok");
		});

		it("returns dependencies.resend as reachable when Resend API responds 200", async () => {
			global.fetch = vi.fn().mockResolvedValue({ ok: true, status: 200 });
			const response = await GET();
			const body = (await response.json()) as {
				status: string;
				dependencies: { resend: string };
			};
			expect(body.dependencies.resend).toBe("reachable");
			expect(body.status).toBe("ok");
		});

		it("returns dependencies.resend as unreachable when fetch throws", async () => {
			global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));
			const response = await GET();
			const body = (await response.json()) as {
				status: string;
				dependencies: { resend: string };
			};
			expect(body.dependencies.resend).toBe("unreachable");
			expect(body.status).toBe("degraded");
		});

		it("returns status degraded when Resend returns 500", async () => {
			global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });
			const response = await GET();
			const body = (await response.json()) as {
				status: string;
				dependencies: { resend: string };
			};
			expect(body.dependencies.resend).toBe("unreachable");
			expect(body.status).toBe("degraded");
		});

		it("calls Resend API with HEAD method and correct URL", async () => {
			global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 401 });
			await GET();
			expect(global.fetch).toHaveBeenCalledWith(
				"https://api.resend.com",
				expect.objectContaining({
					method: "HEAD",
				})
			);
		});
	});
});
