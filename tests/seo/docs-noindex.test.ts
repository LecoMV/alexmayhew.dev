import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

describe("docs stub page noindex", () => {
	it("generateMetadata emits robots.index: false", () => {
		const content = readFileSync(join(process.cwd(), "src/app/docs/[[...slug]]/page.tsx"), "utf-8");
		expect(content).toMatch(/robots:\s*{\s*index:\s*false/);
	});
});
