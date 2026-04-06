import { describe, expect, it } from "vitest";

import {
	getAllIndustryIds,
	getIndustryData,
	getIndustryKeywords,
	getIndustryPainPoints,
	getIndustryRegulations,
	industries,
	searchIndustries,
} from "@/data/pseo/industries";

describe("pSEO Industries", () => {
	it("getAllIndustryIds returns array matching industries keys", () => {
		const ids = getAllIndustryIds();
		expect(Array.isArray(ids)).toBe(true);
		expect(ids.length).toBeGreaterThan(0);
		expect(ids).toEqual(Object.keys(industries));
	});

	it("getIndustryData returns data for valid industry", () => {
		const ids = getAllIndustryIds();
		const data = getIndustryData(ids[0]);
		expect(data).toBeDefined();
		expect(data!.displayName).toBeTruthy();
	});

	it("getIndustryData returns undefined for invalid industry", () => {
		expect(getIndustryData("nonexistent" as never)).toBeUndefined();
	});

	it("getIndustryRegulations returns array for valid industry", () => {
		const ids = getAllIndustryIds();
		const regs = getIndustryRegulations(ids[0]);
		expect(Array.isArray(regs)).toBe(true);
	});

	it("getIndustryRegulations returns empty for invalid industry", () => {
		expect(getIndustryRegulations("nonexistent" as never)).toEqual([]);
	});

	it("getIndustryPainPoints returns array for valid industry", () => {
		const ids = getAllIndustryIds();
		const pains = getIndustryPainPoints(ids[0]);
		expect(Array.isArray(pains)).toBe(true);
	});

	it("getIndustryPainPoints returns empty for invalid industry", () => {
		expect(getIndustryPainPoints("nonexistent" as never)).toEqual([]);
	});

	it("getIndustryKeywords returns string array", () => {
		const ids = getAllIndustryIds();
		const keywords = getIndustryKeywords(ids[0]);
		expect(Array.isArray(keywords)).toBe(true);
		keywords.forEach((kw) => expect(typeof kw).toBe("string"));
	});

	it("getIndustryKeywords returns empty for invalid industry", () => {
		expect(getIndustryKeywords("nonexistent" as never)).toEqual([]);
	});

	it("searchIndustries finds by display name", () => {
		const ids = getAllIndustryIds();
		const firstIndustry = getIndustryData(ids[0])!;
		const word = firstIndustry.displayName.split(" ")[0];
		const results = searchIndustries(word);
		expect(results.length).toBeGreaterThan(0);
	});

	it("searchIndustries is case-insensitive", () => {
		const ids = getAllIndustryIds();
		const firstIndustry = getIndustryData(ids[0])!;
		const upper = searchIndustries(firstIndustry.displayName.toUpperCase());
		const lower = searchIndustries(firstIndustry.displayName.toLowerCase());
		expect(upper.length).toBe(lower.length);
	});

	it("searchIndustries returns empty for unmatched query", () => {
		expect(searchIndustries("zzzzxyznonexistent")).toEqual([]);
	});

	it("searchIndustries finds by keyword", () => {
		const ids = getAllIndustryIds();
		const firstIndustry = getIndustryData(ids[0])!;
		if (firstIndustry.targetKeywords.length > 0) {
			const results = searchIndustries(firstIndustry.targetKeywords[0]);
			expect(results.length).toBeGreaterThan(0);
		}
	});

	it("every industry has required fields", () => {
		const ids = getAllIndustryIds();
		ids.forEach((id) => {
			const data = getIndustryData(id)!;
			expect(data.displayName).toBeTruthy();
			expect(data.description).toBeTruthy();
			expect(Array.isArray(data.targetKeywords)).toBe(true);
			expect(Array.isArray(data.painPoints)).toBe(true);
			expect(Array.isArray(data.regulations)).toBe(true);
		});
	});
});
