import fs from "fs";
import path from "path";

import { describe, expect, it } from "vitest";

const root = path.resolve(__dirname, "../..");

function readFile(relPath: string): string {
	return fs.readFileSync(path.join(root, relPath), "utf-8");
}

describe("duration: 0.15 replacements (microSpring)", () => {
	const files = [
		"src/components/ui/navigation.tsx",
		"src/components/ui/command-palette.tsx",
		"src/components/terminal/terminal.tsx",
		"src/components/traceforge/progress-log.tsx",
	];

	for (const file of files) {
		it(`${file} imports microSpring and uses it instead of duration: 0.15`, () => {
			const content = readFile(file);
			expect(content).toMatch(/microSpring/);
			expect(content).not.toMatch(/duration:\s*0\.15/);
		});
	}
});

describe("duration: 0.2 replacements (microSpring)", () => {
	it("chat-widget.tsx uses microSpring for icon transitions and message animations", () => {
		const content = readFile("src/components/chat/chat-widget.tsx");
		expect(content).toMatch(/microSpring/);
		expect(content).not.toMatch(/duration:\s*0\.2/);
	});

	it("blog-article.tsx uses microSpring for content fade-in", () => {
		const content = readFile("src/components/blog/blog-article.tsx");
		expect(content).toMatch(/microSpring/);
		expect(content).not.toMatch(/duration:\s*0\.2/);
	});

	it("table-of-contents.tsx uses microSpring for non-reducedMotion branch only", () => {
		const content = readFile("src/components/blog/table-of-contents.tsx");
		expect(content).toMatch(/microSpring/);
		// The reduced motion branch { duration: 0 } must remain
		expect(content).toMatch(/duration:\s*0\s*}/);
		// But { duration: 0.2 } must NOT exist
		expect(content).not.toMatch(/duration:\s*0\.2/);
	});
});

describe("duration: 0.3 replacements (gentleSpring)", () => {
	const files = [
		"src/components/pages/contact-page.tsx",
		"src/app/home-page.tsx",
		"src/app/for/for-hub-page.tsx",
		"src/app/for/[role]/role-page-content.tsx",
		"src/app/technologies/technologies-page-content.tsx",
		"src/app/technologies/[slug]/technology-page-content.tsx",
		"src/app/services/[slug]/service-page-content.tsx",
	];

	for (const file of files) {
		it(`${file} imports gentleSpring and has no duration: 0.3`, () => {
			const content = readFile(file);
			expect(content).toMatch(/gentleSpring/);
			expect(content).not.toMatch(/duration:\s*0\.3/);
		});
	}

	it("demo/backgrounds/page.tsx uses springTransition for the background switcher", () => {
		const content = readFile("src/app/demo/backgrounds/page.tsx");
		// duration: 0.5 replaced with springTransition (already imported)
		expect(content).not.toMatch(/duration:\s*0\.5/);
	});
});

describe("duration: 0.5 replacement (springTransition)", () => {
	it("crt-effect.tsx uses springTransition instead of duration: 0.5", () => {
		const content = readFile("src/components/backgrounds/crt-effect.tsx");
		expect(content).toMatch(/springTransition/);
		expect(content).not.toMatch(/duration:\s*0\.5/);
	});
});

describe("duration: 1.0+ replacements (springTransition)", () => {
	const files = [
		"src/components/backgrounds/circuit-traces.tsx",
		"src/components/backgrounds/blueprint-grid.tsx",
		"src/components/backgrounds/ascii-field.tsx",
		"src/components/backgrounds/hybrid-atmospheric.tsx",
		"src/components/backgrounds/code-rain.tsx",
		"src/components/backgrounds/data-flow.tsx",
	];

	for (const file of files) {
		it(`${file} imports springTransition and has no duration-based transition`, () => {
			const content = readFile(file);
			expect(content).toMatch(/springTransition/);
			expect(content).not.toMatch(/duration:\s*[12]/);
		});
	}
});
