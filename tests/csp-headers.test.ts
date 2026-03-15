import { readFileSync } from "fs";

import { describe, expect, it } from "vitest";

describe("CSP headers in custom-worker.ts", () => {
	const workerSource = readFileSync("custom-worker.ts", "utf-8");

	it("connect-src allows Sentry US ingest endpoint", () => {
		expect(workerSource).toContain("*.ingest.us.sentry.io");
	});

	it("worker-src allows blob: URLs for Sentry session replay", () => {
		expect(workerSource).toMatch(/worker-src.*blob:/);
	});
});
