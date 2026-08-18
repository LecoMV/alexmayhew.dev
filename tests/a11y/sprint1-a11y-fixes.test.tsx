import fs from "fs";
import path from "path";

import { describe, expect, it } from "vitest";

const ROOT = path.resolve(__dirname, "../..");

const DECORATIVE_BULLET_MSG = "every decorative ● span has aria-hidden";
const ARIA_HIDDEN_ATTR = 'aria-hidden="true"';

function read(rel: string): string {
	return fs.readFileSync(path.resolve(ROOT, rel), "utf-8");
}

// The technologies / technology / for-hub / role-page a11y blocks were removed
// in the 2026-08 reposition when those pages were deleted.

describe("Sprint 1 a11y — services-page-content heading hierarchy", () => {
	it("eyebrow 'Technical_Advisory' is not inside <h1>", () => {
		const source = read("src/app/services/services-page-content.tsx");
		const h1Pattern = /<(m\.)?h1[^>]*>[\s\S]*?Technical_Advisory[\s\S]*?<\/(m\.)?h1>/;
		expect(h1Pattern.test(source)).toBe(false);
	});
});

describe("Sprint 1 a11y — newsletter page heading hierarchy", () => {
	it("eyebrow 'Newsletter Archive' is not inside <h1>, title 'The Architect' is inside <h1>", () => {
		const source = read("src/app/newsletter/page.tsx");
		const eyebrowPattern = /<h1[^>]*>[\s\S]*?Newsletter Archive[\s\S]*?<\/h1>/;
		expect(eyebrowPattern.test(source)).toBe(false);
		const titlePattern = /<h1[^>]*>[\s\S]*?The Architect[\s\S]*?<\/h1>/;
		expect(titlePattern.test(source)).toBe(true);
	});
});

describe("Sprint 1 a11y — demo page heading hierarchy", () => {
	it("eyebrow 'Feature Demo' is not inside <h1>, title 'Atmospheric' is inside <h1>", () => {
		const source = read("src/app/demo/page.tsx");
		const eyebrowPattern = /<h1[^>]*>[\s\S]*?Feature Demo[\s\S]*?<\/h1>/;
		expect(eyebrowPattern.test(source)).toBe(false);
		const titlePattern = /<h1[^>]*>[\s\S]*?Atmospheric[\s\S]*?<\/h1>/;
		expect(titlePattern.test(source)).toBe(true);
	});
});

describe("Sprint 1 a11y — demo backgrounds page heading hierarchy", () => {
	it("eyebrow 'Background Effects Lab' is not inside <h1>, title 'Atmospheric' is inside <h1>", () => {
		const source = read("src/app/demo/backgrounds/page.tsx");
		const eyebrowPattern = /<h1[^>]*>[\s\S]*?Background Effects Lab[\s\S]*?<\/h1>/;
		expect(eyebrowPattern.test(source)).toBe(false);
		const titlePattern = /<h1[^>]*>[\s\S]*?Atmospheric[\s\S]*?<\/h1>/;
		expect(titlePattern.test(source)).toBe(true);
	});
});

describe("Sprint 1 a11y — services-page-content decorative bullets", () => {
	it(DECORATIVE_BULLET_MSG, () => {
		const source = read("src/app/services/services-page-content.tsx");
		const bulletSpanPattern = /<span([^>]*)>\s*●\s*<\/span>/g;
		const matches = Array.from(source.matchAll(bulletSpanPattern));
		if (matches.length === 0) return;
		for (const match of matches) {
			const attrs = match[1];
			expect(attrs.includes(ARIA_HIDDEN_ATTR), `Missing aria-hidden: ${match[0]}`).toBe(true);
		}
	});
});
