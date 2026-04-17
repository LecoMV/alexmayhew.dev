import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

describe("offline page noindex", () => {
	it("offline route has metadata robots.index: false", () => {
		// Offline page is a client component, so metadata must live in a sibling
		// layout.tsx (or the page.tsx if the page becomes a server component).
		const pagePath = join(process.cwd(), "src/app/offline/page.tsx");
		const layoutPath = join(process.cwd(), "src/app/offline/layout.tsx");

		let foundNoindex = false;
		if (existsSync(pagePath)) {
			const content = readFileSync(pagePath, "utf-8");
			if (/robots:\s*{\s*index:\s*false/.test(content)) foundNoindex = true;
		}
		if (existsSync(layoutPath)) {
			const content = readFileSync(layoutPath, "utf-8");
			if (/robots:\s*{\s*index:\s*false/.test(content)) foundNoindex = true;
		}
		expect(foundNoindex).toBe(true);
	});
});
