import fs from "fs";
import path from "path";

import { describe, expect, it } from "vitest";

const ROOT = path.resolve(__dirname, "../..");

const TECHS_PAGE = "src/app/technologies/technologies-page-content.tsx";
const TECH_PAGE = "src/app/technologies/[slug]/technology-page-content.tsx";
const DECORATIVE_BULLET_MSG = "every decorative ● span has aria-hidden";
const ARIA_HIDDEN_ATTR = 'aria-hidden="true"';

function read(rel: string): string {
	return fs.readFileSync(path.resolve(ROOT, rel), "utf-8");
}

describe("Sprint 1 a11y — services-page-content heading hierarchy", () => {
	it("eyebrow 'Technical_Advisory' is not inside <h1>", () => {
		const source = read("src/app/services/services-page-content.tsx");
		const h1Pattern = /<(m\.)?h1[^>]*>[\s\S]*?Technical_Advisory[\s\S]*?<\/(m\.)?h1>/;
		expect(h1Pattern.test(source)).toBe(false);
	});
});

describe("Sprint 1 a11y — technologies-page-content heading hierarchy", () => {
	it("eyebrow 'Technology Expertise' is not inside <h1> and title 'Deep expertise in' is inside <h1>", () => {
		const source = read(TECHS_PAGE);
		const eyebrowPattern = /<(m\.)?h1[^>]*>[\s\S]*?Technology Expertise[\s\S]*?<\/(m\.)?h1>/;
		expect(eyebrowPattern.test(source)).toBe(false);
		const titlePattern = /<(m\.)?h1[^>]*>[\s\S]*?Deep expertise in[\s\S]*?<\/(m\.)?h1>/;
		expect(titlePattern.test(source)).toBe(true);
	});
});

describe("Sprint 1 a11y — technologies-page-content no h1→h3 skip (Core Technologies)", () => {
	it("'Core Technologies' section uses <h2> not <h3>", () => {
		const source = read(TECHS_PAGE);
		const h2Pattern = /<h2[^>]*>[\s\S]*?Core Technologies[\s\S]*?<\/h2>/;
		expect(h2Pattern.test(source)).toBe(true);
	});
});

describe("Sprint 1 a11y — technologies-page-content no h1→h3 skip (CTA)", () => {
	it("'Have a Project in Mind?' CTA uses <h2> not <h3>", () => {
		const source = read(TECHS_PAGE);
		const h2Pattern = /<h2[^>]*>[\s\S]*?Have a Project in Mind\?[\s\S]*?<\/h2>/;
		expect(h2Pattern.test(source)).toBe(true);
	});
});

describe("Sprint 1 a11y — technologies-page-content tech card uses <h3>", () => {
	it("tech card displayName is <h3> under h2 section (no skip)", () => {
		const source = read(TECHS_PAGE);
		const pattern = /<h3[^>]*>[\s\S]*?tech\.displayName[\s\S]*?<\/h3>/;
		expect(pattern.test(source)).toBe(true);
	});
});

describe("Sprint 1 a11y — technology-page-content hero heading hierarchy", () => {
	it("eyebrow 'Technology Expertise' is not inside <h1>, title '{technology.displayName}' is", () => {
		const source = read(TECH_PAGE);
		const eyebrowPattern = /<(m\.)?h1[^>]*>[\s\S]*?Technology Expertise[\s\S]*?<\/(m\.)?h1>/;
		expect(eyebrowPattern.test(source)).toBe(false);
		const titlePattern = /<(m\.)?h1[^>]*>[\s\S]*?\{technology\.displayName\}[\s\S]*?<\/(m\.)?h1>/;
		expect(titlePattern.test(source)).toBe(true);
	});
});

describe("Sprint 1 a11y — technology-page-content section headings use <h2>", () => {
	it("'Expertise Level' section uses <h2> not <h3>", () => {
		const source = read(TECH_PAGE);
		const h2Pattern = /<h2[^>]*>[\s\S]*?Expertise Level[\s\S]*?<\/h2>/;
		expect(h2Pattern.test(source)).toBe(true);
	});
});

describe("Sprint 1 a11y — technology-page-content 'When to Use' uses <h2>", () => {
	it("'When to Use' section uses <h2> not <h3>", () => {
		const source = read(TECH_PAGE);
		const h2Pattern = /<h2[^>]*>[\s\S]*?When to Use[\s\S]*?<\/h2>/;
		expect(h2Pattern.test(source)).toBe(true);
	});
});

describe("Sprint 1 a11y — technology-page-content well-formed heading tags", () => {
	it("open and close tag counts match for each heading level", () => {
		const source = read(TECH_PAGE);
		for (const level of ["h1", "h2", "h3"] as const) {
			const opens = source.match(new RegExp(`<${level}(\\s[^>]*)?>`, "g"))?.length ?? 0;
			const closes = source.match(new RegExp(`</${level}>`, "g"))?.length ?? 0;
			expect(opens, `${level} open/close counts`).toBe(closes);
		}
	});
});

describe("Sprint 1 a11y — for-hub-page heading hierarchy", () => {
	it("title 'Built for Your Role' is inside <h1>, eyebrow not", () => {
		const source = read("src/app/for/for-hub-page.tsx");
		const eyebrowPattern = /<(m\.)?h1[^>]*>[\s\S]*?Technical Advisory[\s\S]*?<\/(m\.)?h1>/;
		expect(eyebrowPattern.test(source)).toBe(false);
		const titlePattern = /<(m\.)?h1[^>]*>[\s\S]*?Built for Your Role[\s\S]*?<\/(m\.)?h1>/;
		expect(titlePattern.test(source)).toBe(true);
	});
});

describe("Sprint 1 a11y — role-page-content heading hierarchy", () => {
	it("eyebrow 'For {roleLabel}' is not inside <h1>, title '{page.headline}' is inside <h1>", () => {
		const source = read("src/app/for/[role]/role-page-content.tsx");
		const eyebrowPattern = /<(m\.)?h1[^>]*>[\s\S]*?For \{roleLabel\}[\s\S]*?<\/(m\.)?h1>/;
		expect(eyebrowPattern.test(source)).toBe(false);
		const titlePattern = /<(m\.)?h1[^>]*>[\s\S]*?\{page\.headline\}[\s\S]*?<\/(m\.)?h1>/;
		expect(titlePattern.test(source)).toBe(true);
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

describe("Sprint 1 a11y — role-page-content decorative bullets", () => {
	it(DECORATIVE_BULLET_MSG, () => {
		const source = read("src/app/for/[role]/role-page-content.tsx");
		const bulletSpanPattern = /<span([^>]*)>\s*●\s*<\/span>/g;
		const matches = Array.from(source.matchAll(bulletSpanPattern));
		expect(matches.length).toBeGreaterThan(0);
		for (const match of matches) {
			const attrs = match[1];
			expect(attrs.includes(ARIA_HIDDEN_ATTR), `Missing aria-hidden: ${match[0]}`).toBe(true);
		}
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

describe("Sprint 1 a11y — technologies-page-content decorative bullets", () => {
	it(DECORATIVE_BULLET_MSG, () => {
		const source = read(TECHS_PAGE);
		const bulletSpanPattern = /<span([^>]*)>\s*●\s*<\/span>/g;
		const matches = Array.from(source.matchAll(bulletSpanPattern));
		if (matches.length === 0) return;
		for (const match of matches) {
			const attrs = match[1];
			expect(attrs.includes(ARIA_HIDDEN_ATTR), `Missing aria-hidden: ${match[0]}`).toBe(true);
		}
	});
});

describe("Sprint 1 a11y — technology-page-content decorative bullets", () => {
	it(DECORATIVE_BULLET_MSG, () => {
		const source = read(TECH_PAGE);
		const bulletSpanPattern = /<span([^>]*)>\s*●\s*<\/span>/g;
		const matches = Array.from(source.matchAll(bulletSpanPattern));
		if (matches.length === 0) return;
		for (const match of matches) {
			const attrs = match[1];
			expect(attrs.includes(ARIA_HIDDEN_ATTR), `Missing aria-hidden: ${match[0]}`).toBe(true);
		}
	});
});

describe("Sprint 1 a11y — service-page-content decorative bullets", () => {
	it(DECORATIVE_BULLET_MSG, () => {
		const source = read("src/app/services/[slug]/service-page-content.tsx");
		const bulletSpanPattern = /<span([^>]*)>\s*●\s*<\/span>/g;
		const matches = Array.from(source.matchAll(bulletSpanPattern));
		expect(matches.length).toBeGreaterThan(0);
		for (const match of matches) {
			const attrs = match[1];
			expect(
				attrs.includes(ARIA_HIDDEN_ATTR) || attrs.includes("aria-hidden={true}"),
				`Missing aria-hidden in span: ${match[0]}`
			).toBe(true);
		}
	});
});
