import { describe, expect, it } from "vitest";

import { pseoPages } from "@/data/pseo/pages";

const MIN_WORDS = 150;

function wordCount(text: string): number {
	return text.trim().split(/\s+/).filter(Boolean).length;
}

describe("pSEO Pages - 150-word minimum enforcement", () => {
	describe("whyThisStack field", () => {
		pseoPages
			.filter((p) => p.published)
			.forEach((page) => {
				it(`${page.slug} has >= ${MIN_WORDS} words in whyThisStack`, () => {
					const count = wordCount(page.whyThisStack);
					expect(count, `${page.slug} whyThisStack has ${count} words`).toBeGreaterThanOrEqual(
						MIN_WORDS
					);
				});
			});
	});

	describe("projectApproach field", () => {
		pseoPages
			.filter((p) => p.published)
			.forEach((page) => {
				it(`${page.slug} has >= ${MIN_WORDS} words in projectApproach`, () => {
					const count = wordCount(page.projectApproach);
					expect(count, `${page.slug} projectApproach has ${count} words`).toBeGreaterThanOrEqual(
						MIN_WORDS
					);
				});
			});
	});

	describe("em dash audit (voice rule)", () => {
		const FIELDS_TO_CHECK: Array<keyof (typeof pseoPages)[number]> = [
			"whyThisStack",
			"projectApproach",
		];

		pseoPages
			.filter((p) => p.published)
			.forEach((page) => {
				FIELDS_TO_CHECK.forEach((field) => {
					it(`${page.slug} ${String(field)} contains no em dashes`, () => {
						const text = page[field] as string;
						expect(text.includes("—"), `${page.slug}.${String(field)} has em dash`).toBe(false);
						expect(text.includes("--"), `${page.slug}.${String(field)} has double dash`).toBe(
							false
						);
					});
				});
			});
	});
});
