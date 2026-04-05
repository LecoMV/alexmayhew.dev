import { describe, expect, it } from "vitest";

import { getPublishedPages } from "@/data/pseo";

describe("pSEO title lengths", () => {
	it("all seo.title values should be 45 chars or less to avoid truncation with suffix", () => {
		const pages = getPublishedPages();
		const tooLong = pages
			.filter((p) => p.seo.title.length > 45)
			.map((p) => `${p.seo.title.length} chars: "${p.seo.title}"`);
		expect(tooLong).toEqual([]);
	});
});
