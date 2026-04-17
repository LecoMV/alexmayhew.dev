import { describe, expect, it } from "vitest";

import { GET } from "@/app/llms-full.txt/route";

describe("GET /llms-full.txt", () => {
	it("returns 200 status", async () => {
		const response = await GET();
		expect(response.status).toBe(200);
	});

	it("returns text/plain content type", async () => {
		const response = await GET();
		expect(response.headers.get("Content-Type")).toContain("text/plain");
	});

	it("sets a public Cache-Control header", async () => {
		const response = await GET();
		const cacheControl = response.headers.get("Cache-Control");
		expect(cacheControl).toContain("public");
		expect(cacheControl).toMatch(/max-age=\d+/);
	});

	it("includes the site title", async () => {
		const response = await GET();
		const body = await response.text();
		expect(body).toContain("alexmayhew.dev");
	});

	it("includes the About section", async () => {
		const response = await GET();
		const body = await response.text();
		expect(body).toMatch(/About Alex Mayhew/i);
	});

	it("includes glossary terms", async () => {
		const response = await GET();
		const body = await response.text();
		expect(body).toContain("Cognitive Debt");
		expect(body).toContain("METR Paradox");
	});

	it("includes hub post FAQs", async () => {
		const response = await GET();
		const body = await response.text();
		expect(body).toMatch(/Frequently Asked Questions/i);
	});

	it("includes a link to the regular llms.txt", async () => {
		const response = await GET();
		const body = await response.text();
		expect(body).toContain("/llms.txt");
	});
});
