import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/geo", async () => {
	const actual = await vi.importActual("@/lib/geo");
	return {
		...actual,
		getGeoDataForClient: vi.fn((...args: unknown[]) =>
			(actual as Record<string, (...args: unknown[]) => unknown>).getGeoDataForClient(...args)
		),
	};
});
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

import { GET } from "@/app/api/geo/route";

function createRequest(country?: string): Request {
	const headers = new Headers();
	if (country) headers.set("cf-ipcountry", country);
	return new Request("https://alexmayhew.dev/api/geo", { headers });
}

describe("GET /api/geo", () => {
	it("returns EU data for DE (Germany)", async () => {
		const response = await GET(createRequest("DE"));
		const body = await response.json();
		expect(body).toEqual({
			country: "DE",
			isEU: true,
			requiresCookieConsent: true,
		});
	});

	it("returns non-EU data for US", async () => {
		const response = await GET(createRequest("US"));
		const body = await response.json();
		expect(body).toEqual({
			country: "US",
			isEU: false,
			requiresCookieConsent: false,
		});
	});

	it("returns defaults when country header is missing", async () => {
		const response = await GET(createRequest());
		const body = await response.json();
		expect(body).toEqual({
			country: null,
			isEU: false,
			requiresCookieConsent: false,
		});
	});

	it("sets Cache-Control to private, max-age=3600", async () => {
		const response = await GET(createRequest("US"));
		expect(response.headers.get("Cache-Control")).toBe("private, max-age=3600");
	});

	it("returns requiresCookieConsent true for GB (GDPR but non-EU)", async () => {
		const response = await GET(createRequest("GB"));
		const body = await response.json();
		expect(body).toEqual({
			country: "GB",
			isEU: false,
			requiresCookieConsent: true,
		});
	});

	it("returns 500 when geo lookup throws an error", async () => {
		const request = new Request("https://alexmayhew.dev/api/geo");
		const { getGeoDataForClient } = await import("@/lib/geo");
		vi.mocked(getGeoDataForClient).mockImplementationOnce(() => {
			throw new Error("Lookup failed");
		});

		const response = await GET(request);
		expect(response.status).toBe(500);
		const body = (await response.json()) as { error: string };
		expect(body.error).toBe("Failed to determine location");
	});
});
