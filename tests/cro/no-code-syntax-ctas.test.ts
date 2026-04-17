import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

import { describe, expect, it } from "vitest";

const SRC_ROOT = join(process.cwd(), "src");

// Standalone line (whitespace-only surroundings) OR inside JSX text nodes like
// `>LABEL()<` or `>LABEL()`.  Avoid matches that look like real code.
const STANDALONE_LINE = /^\s*[A-Z][A-Z0-9_]{2,}\(\)\s*$/;
const JSX_TEXT_INLINE = />\s*([A-Z][A-Z0-9_]{2,}\(\))\s*</g;

// Demo routes are intentionally code-themed — exclude from the CTA copy rule.
const EXCLUDED_PATH_FRAGMENTS = [
	join("src", "app", "demo") + sep,
	// Owned by other waves / not in scope for this CRO pass.
	join("src", "app", "home-page.tsx"),
	join("src", "components", "pages", "about-page.tsx"),
	join("src", "components", "pages", "contact-page.tsx"),
	join("src", "components", "ui", "navigation.tsx"),
	join("src", "components", "ui", "footer.tsx"),
	join("src", "components", "blog", "share-buttons.tsx"),
	// pSEO migration / integration / comparison pages — separate wave.
	join("src", "app", "services", "migrations") + sep,
	join("src", "app", "services", "integrations") + sep,
	join("src", "app", "services", "comparisons") + sep,
	// Offline page CTA is a system retry button, not marketing copy.
	join("src", "app", "offline") + sep,
];

function collectFiles(dir: string, out: string[] = []): string[] {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		const stats = statSync(full);
		if (stats.isDirectory()) {
			collectFiles(full, out);
			continue;
		}
		if (/\.(tsx?|jsx?|mdx)$/.test(entry)) {
			out.push(full);
		}
	}
	return out;
}

function isExcluded(filePath: string): boolean {
	return EXCLUDED_PATH_FRAGMENTS.some((frag) => filePath.includes(frag));
}

function findCodeSyntaxCtas(filePath: string): Array<{ line: number; text: string }> {
	const source = readFileSync(filePath, "utf-8");
	const lines = source.split("\n");
	const hits: Array<{ line: number; text: string }> = [];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		if (STANDALONE_LINE.test(line)) {
			hits.push({ line: i + 1, text: line.trim() });
			continue;
		}

		for (const match of line.matchAll(JSX_TEXT_INLINE)) {
			hits.push({ line: i + 1, text: match[1] });
		}
	}

	return hits;
}

function readSrc(relativePath: string): string {
	return readFileSync(join(process.cwd(), relativePath), "utf-8");
}

describe("No code-syntax CTAs in user-facing copy", () => {
	it("src/ contains zero function-call-style CTA text nodes outside demo routes", () => {
		const files = collectFiles(SRC_ROOT).filter((f) => !isExcluded(f));
		const offenders: Array<{ file: string; line: number; text: string }> = [];

		for (const file of files) {
			for (const hit of findCodeSyntaxCtas(file)) {
				offenders.push({
					file: relative(process.cwd(), file),
					line: hit.line,
					text: hit.text,
				});
			}
		}

		expect(
			offenders,
			`Found code-syntax CTAs (replace with outcome-specific language):\n${offenders
				.map((o) => `  ${o.file}:${o.line}  "${o.text}"`)
				.join("\n")}`
		).toEqual([]);
	});
});

describe("Outcome-specific CTA copy (per-file assertions)", () => {
	it("services hub bottom CTA reads 'Book a working session'", () => {
		const content = readSrc("src/app/services/services-page-content.tsx");
		expect(content).toContain("Book a working session");
		expect(content).not.toContain("SCHEDULE_CONSULTATION()");
	});

	it("service detail hero CTA reads 'Book a working session'", () => {
		const content = readSrc("src/app/services/[slug]/service-page-content.tsx");
		expect(content).toContain("Book a working session");
	});

	it("service detail bottom CTA reads 'Talk through your project'", () => {
		const content = readSrc("src/app/services/[slug]/service-page-content.tsx");
		expect(content).toContain("Talk through your project");
		expect(content).not.toContain("START_CONVERSATION()");
	});

	it("case study hero links read 'See it running' and 'Read the code'", () => {
		const content = readSrc("src/components/pages/case-study-page.tsx");
		expect(content).toContain("See it running");
		expect(content).toContain("Read the code");
		expect(content).not.toContain("VIEW_LIVE()");
		expect(content).not.toContain("SOURCE_CODE()");
	});

	it("case study sidebar CTA reads 'Talk about a similar build'", () => {
		const content = readSrc("src/components/pages/case-study-page.tsx");
		expect(content).toContain("Talk about a similar build");
		expect(content).not.toContain("DISCUSS_PROJECT()");
	});

	it("case study bottom CTA reads 'Talk through your challenge'", () => {
		const content = readSrc("src/components/pages/case-study-page.tsx");
		expect(content).toContain("Talk through your challenge");
	});

	it("technology detail service-card CTA reads 'See the service'", () => {
		const content = readSrc("src/app/technologies/[slug]/technology-page-content.tsx");
		expect(content).toContain("See the service");
		expect(content).not.toContain("VIEW_SERVICE()");
	});

	it("technology detail bottom CTA reads 'Talk through your stack'", () => {
		const content = readSrc("src/app/technologies/[slug]/technology-page-content.tsx");
		expect(content).toContain("Talk through your stack");
	});

	it("technologies hub card CTA reads 'Read the playbook'", () => {
		const content = readSrc("src/app/technologies/technologies-page-content.tsx");
		expect(content).toContain("Read the playbook");
		expect(content).not.toContain("EXPLORE()");
	});

	it("technologies hub bottom CTA reads 'Talk through your stack'", () => {
		const content = readSrc("src/app/technologies/technologies-page-content.tsx");
		expect(content).toContain("Talk through your stack");
	});

	it("for-hub bottom CTA reads 'Start the conversation'", () => {
		const content = readSrc("src/app/for/for-hub-page.tsx");
		expect(content).toContain("Start the conversation");
	});

	it("role page hero CTA reads 'Start the conversation'", () => {
		const content = readSrc("src/app/for/[role]/role-page-content.tsx");
		expect(content).toContain("Start the conversation");
	});

	it("role page bottom CTA reads 'Book a call'", () => {
		const content = readSrc("src/app/for/[role]/role-page-content.tsx");
		expect(content).toContain("Book a call");
		expect(content).not.toContain("SCHEDULE_CALL()");
	});
});
