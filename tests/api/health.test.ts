import { beforeEach, describe, expect, it, vi } from "vitest";

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

import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
	beforeEach(() => {
		vi.stubEnv("NEXT_PUBLIC_GIT_SHA", "abc123");
		vi.stubEnv("NEXT_PUBLIC_BUILD_TIME", "2026-01-01T00:00:00.000Z");
		vi.stubEnv("NEXT_PUBLIC_SITE_VERSION", "1.0.0");
	});

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
});
