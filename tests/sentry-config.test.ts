import { readFileSync } from "fs";

import { describe, expect, it } from "vitest";

describe("sentry.server.config.ts", () => {
	const source = readFileSync("sentry.server.config.ts", "utf-8");

	it("sets sendDefaultPii to false", () => {
		expect(source).toMatch(/sendDefaultPii:\s*false/);
	});

	it("strips authorization and cookie headers in beforeSend", () => {
		expect(source).toMatch(/beforeSend/);
		expect(source).toMatch(/headers\.authorization|headers\?\.authorization|\["authorization"\]/);
		expect(source).toMatch(/headers\.cookie|headers\?\.cookie|\["cookie"\]/);
	});

	it("scrubs email-shaped values from request body in beforeSend", () => {
		expect(source).toMatch(/request\?\.data|request\.data/);
		expect(source).toContain("@");
		expect(source).toMatch(/\[REDACTED\]|\[redacted\]/);
	});

	it("release uses NEXT_PUBLIC_GIT_SHA when present", () => {
		expect(source).toMatch(/NEXT_PUBLIC_GIT_SHA/);
	});
});

describe("sentry.edge.config.ts", () => {
	const source = readFileSync("sentry.edge.config.ts", "utf-8");

	it("sets sendDefaultPii to false", () => {
		expect(source).toMatch(/sendDefaultPii:\s*false/);
	});

	it("strips authorization and cookie headers in beforeSend", () => {
		expect(source).toMatch(/beforeSend/);
		expect(source).toMatch(/authorization/);
		expect(source).toMatch(/cookie/);
	});

	it("scrubs email-shaped values from request body in beforeSend", () => {
		expect(source).toMatch(/request\?\.data|request\.data/);
		expect(source).toContain("@");
		expect(source).toMatch(/\[REDACTED\]|\[redacted\]/);
	});

	it("release uses NEXT_PUBLIC_GIT_SHA when present", () => {
		expect(source).toMatch(/NEXT_PUBLIC_GIT_SHA/);
	});
});
