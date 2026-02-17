import { describe, expect, it } from "vitest";

import {
	generateSlug,
	getClusterRelatedPages,
	getPageClusters,
	parseSlug,
	TOPIC_CLUSTERS,
} from "@/data/pseo/types";

describe("generateSlug", () => {
	it("combines technology and industry with hyphen", () => {
		expect(generateSlug("nextjs", "healthcare")).toBe("nextjs-healthcare");
	});

	it("handles single-word industry", () => {
		expect(generateSlug("python", "fintech")).toBe("python-fintech");
	});

	it("handles multi-word industry", () => {
		expect(generateSlug("react", "real-estate")).toBe("react-real-estate");
	});
});

describe("parseSlug", () => {
	it("parses valid single-word industry slug", () => {
		const result = parseSlug("nextjs-healthcare");
		expect(result).toEqual({ technology: "nextjs", industry: "healthcare" });
	});

	it("parses valid multi-word industry slug", () => {
		const result = parseSlug("react-real-estate");
		expect(result).toEqual({ technology: "react", industry: "real-estate" });
	});

	it("returns null for invalid technology", () => {
		expect(parseSlug("invalid-healthcare")).toBeNull();
	});

	it("returns null for invalid industry", () => {
		expect(parseSlug("nextjs-invalid")).toBeNull();
	});

	it("returns null for slug without hyphen", () => {
		expect(parseSlug("nohyphen")).toBeNull();
	});
});

describe("getPageClusters", () => {
	it("returns clusters containing the page slug", () => {
		const clusters = getPageClusters("nextjs-developer-for-saas");
		const clusterIds = clusters.map((c) => c.id);
		expect(clusterIds).toContain("saas-at-scale");
	});

	it("returns compliance-heavy cluster for healthcare page", () => {
		const clusters = getPageClusters("python-developer-for-healthcare");
		const clusterIds = clusters.map((c) => c.id);
		expect(clusterIds).toContain("compliance-heavy");
	});

	it("returns empty array for nonexistent page", () => {
		expect(getPageClusters("nonexistent-page")).toEqual([]);
	});
});

describe("getClusterRelatedPages", () => {
	it("returns related pages excluding self", () => {
		const related = getClusterRelatedPages("nextjs-developer-for-saas");
		expect(related.length).toBeGreaterThan(0);
		expect(related).not.toContain("nextjs-developer-for-saas");
	});

	it("returns empty array for nonexistent page", () => {
		expect(getClusterRelatedPages("nonexistent-page")).toEqual([]);
	});

	it("includes other spokes from the same cluster", () => {
		const related = getClusterRelatedPages("nextjs-developer-for-saas");
		expect(related).toContain("react-developer-for-saas");
	});
});

describe("TOPIC_CLUSTERS", () => {
	it("is a non-empty array", () => {
		expect(Array.isArray(TOPIC_CLUSTERS)).toBe(true);
		expect(TOPIC_CLUSTERS.length).toBeGreaterThan(0);
	});

	it("each cluster has required fields", () => {
		for (const cluster of TOPIC_CLUSTERS) {
			expect(cluster).toHaveProperty("id");
			expect(cluster).toHaveProperty("name");
			expect(cluster).toHaveProperty("description");
			expect(cluster).toHaveProperty("hubSlug");
			expect(cluster).toHaveProperty("spokeSlugs");
			expect(Array.isArray(cluster.spokeSlugs)).toBe(true);
		}
	});
});
