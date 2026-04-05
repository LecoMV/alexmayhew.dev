import { describe, expect, it } from "vitest";

import { getClusterRelatedPages, getPageClusters } from "@/data/pseo/types";

describe("TopicClusterNav data functions", () => {
	it("getPageClusters returns clusters containing the given slug", () => {
		const clusters = getPageClusters("nextjs-developer-for-saas");
		expect(clusters.length).toBeGreaterThan(0);
		expect(clusters[0].spokeSlugs).toContain("nextjs-developer-for-saas");
	});

	it("getClusterRelatedPages returns related slugs excluding the current one", () => {
		const related = getClusterRelatedPages("nextjs-developer-for-saas");
		expect(related.length).toBeGreaterThan(0);
		expect(related).not.toContain("nextjs-developer-for-saas");
	});

	it("returns empty clusters for a slug not in any cluster", () => {
		const clusters = getPageClusters("nonexistent-page-slug");
		expect(clusters).toEqual([]);
		const related = getClusterRelatedPages("nonexistent-page-slug");
		expect(related).toEqual([]);
	});
});
