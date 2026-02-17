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
});
