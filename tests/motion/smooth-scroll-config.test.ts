import fs from "fs";
import path from "path";

import { describe, expect, it } from "vitest";

describe("smooth-scroll config", () => {
	const filePath = path.resolve(__dirname, "../../src/components/providers/smooth-scroll.tsx");
	const content = fs.readFileSync(filePath, "utf-8");

	it("uses duration: 0.8 for smoother scroll feel", () => {
		expect(content).toMatch(/duration:\s*0\.8/);
		expect(content).not.toMatch(/duration:\s*1\.2/);
	});

	it("uses wheelMultiplier: 1.2 for better scroll responsiveness", () => {
		expect(content).toMatch(/wheelMultiplier:\s*1\.2/);
		expect(content).not.toMatch(/wheelMultiplier:\s*1[,\s]/);
	});

	it("uses touchMultiplier: 1.5 for balanced touch scrolling", () => {
		expect(content).toMatch(/touchMultiplier:\s*1\.5/);
		expect(content).not.toMatch(/touchMultiplier:\s*2/);
	});
});
