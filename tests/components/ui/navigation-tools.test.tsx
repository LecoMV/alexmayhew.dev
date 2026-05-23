import * as fs from "fs";

import { describe, expect, it } from "vitest";

describe("Navigation tools dropdown", () => {
	const source = fs.readFileSync("src/components/ui/navigation.tsx", "utf-8");

	it("includes SaaS Readiness in the tools dropdown", () => {
		expect(source).toContain('href: "/tools/saas-readiness"');
		expect(source).toContain('label: "SaaS Readiness"');
	});

	it("imports all icons used in the tools dropdown (no missing-import build break)", async () => {
		const mod = await import("@/components/ui/navigation");
		expect(mod.Navigation).toBeDefined();
	});

	it("does not include the retired Claude Pilot entry", () => {
		expect(source).not.toContain('label: "Claude Pilot"');
		expect(source).not.toContain('href: "/tools/pilot"');
	});
});

describe("Search index (cmdk)", () => {
	const source = fs.readFileSync("src/data/search-index.ts", "utf-8");

	it("includes SaaS Readiness in the search index", () => {
		expect(source).toContain('href: "/tools/saas-readiness"');
		expect(source).toContain('title: "SaaS Readiness"');
	});
});
