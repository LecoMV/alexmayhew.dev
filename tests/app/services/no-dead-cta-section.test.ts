import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

describe("service-page-content has no dead CtaSection function", () => {
	it("local CtaSection function (superseded by ServiceCtaSplit) is removed", () => {
		const source = readFileSync("src/app/services/[slug]/service-page-content.tsx", "utf-8");
		expect(source).not.toMatch(/function\s+CtaSection\s*\(/);
	});
});
