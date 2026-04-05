import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

describe("Deploy workflow safety", () => {
	it("deploy.yml should have concurrency control", () => {
		const content = readFileSync(join(process.cwd(), ".github/workflows/deploy.yml"), "utf-8");
		expect(content).toContain("concurrency:");
	});

	it("preview deploy should not fallback to opennextjs-cloudflare deploy", () => {
		const content = readFileSync(join(process.cwd(), ".github/workflows/deploy.yml"), "utf-8");
		expect(content).not.toMatch(/wrangler deploy.*\|\|.*opennextjs-cloudflare deploy/);
	});
});

describe("Next.js config security", () => {
	it("next.config should disable poweredByHeader", () => {
		const content = readFileSync(join(process.cwd(), "next.config.mjs"), "utf-8");
		expect(content).toContain("poweredByHeader: false");
	});
});
