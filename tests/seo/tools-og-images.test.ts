import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

describe("tools OG images use dynamic /og route", () => {
	it("traceforge page does not reference the broken /og-traceforge.png", () => {
		const content = readFileSync(join(process.cwd(), "src/app/tools/traceforge/page.tsx"), "utf-8");
		expect(content).not.toContain("/og-traceforge.png");
		expect(content).toMatch(/\/og\?title=/);
	});

	it("pilot page does not reference the broken /og-pilot.png", () => {
		const content = readFileSync(join(process.cwd(), "src/app/tools/pilot/page.tsx"), "utf-8");
		expect(content).not.toContain("/og-pilot.png");
		expect(content).toMatch(/\/og\?title=/);
	});

	it("voice-cloner page does not reference the broken /og-voice-cloner.png", () => {
		const content = readFileSync(
			join(process.cwd(), "src/app/tools/voice-cloner/page.tsx"),
			"utf-8"
		);
		expect(content).not.toContain("/og-voice-cloner.png");
		expect(content).toMatch(/\/og\?title=/);
	});
});
