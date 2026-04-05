import { describe, expect, it } from "vitest";

import { getGeoDataForClient, getGeoFromHeaders, isEUCountry, isGDPRCountry } from "@/lib/geo";

function makeHeaders(entries: Record<string, string> = {}): Headers {
	const h = new Headers();
	for (const [key, value] of Object.entries(entries)) {
		h.set(key, value);
	}
	return h;
}

describe("getGeoFromHeaders", () => {
	it("should detect EU country correctly", () => {
		const result = getGeoFromHeaders(makeHeaders({ "cf-ipcountry": "DE" }));
		expect(result.country).toBe("DE");
		expect(result.isEU).toBe(true);
	});

	it("should detect non-EU country correctly", () => {
		const result = getGeoFromHeaders(makeHeaders({ "cf-ipcountry": "US" }));
		expect(result.country).toBe("US");
		expect(result.isEU).toBe(false);
	});

	it("should handle missing cf-ipcountry header", () => {
		const result = getGeoFromHeaders(makeHeaders());
		expect(result.country).toBeNull();
		expect(result.isEU).toBe(false);
	});

	it("should extract city from cf-ipcity header", () => {
		const result = getGeoFromHeaders(
			makeHeaders({ "cf-ipcountry": "US", "cf-ipcity": "San Francisco" })
		);
		expect(result.city).toBe("San Francisco");
	});

	it("should extract region from cf-region header", () => {
		const result = getGeoFromHeaders(
			makeHeaders({ "cf-ipcountry": "US", "cf-region": "California" })
		);
		expect(result.region).toBe("California");
	});

	it("should extract timezone from cf-timezone header", () => {
		const result = getGeoFromHeaders(
			makeHeaders({ "cf-ipcountry": "US", "cf-timezone": "America/Los_Angeles" })
		);
		expect(result.timezone).toBe("America/Los_Angeles");
	});

	it("should return null for missing optional headers", () => {
		const result = getGeoFromHeaders(makeHeaders({ "cf-ipcountry": "US" }));
		expect(result.city).toBeNull();
		expect(result.region).toBeNull();
		expect(result.timezone).toBeNull();
	});

	it("should set countryName to null", () => {
		const result = getGeoFromHeaders(makeHeaders({ "cf-ipcountry": "DE" }));
		expect(result.countryName).toBeNull();
	});
});

describe("isGDPRCountry", () => {
	it.each(["DE", "FR", "IT"])("should return true for EU country %s", (code) => {
		expect(isGDPRCountry(code)).toBe(true);
	});

	it.each(["IS", "LI", "NO"])("should return true for EEA-only country %s", (code) => {
		expect(isGDPRCountry(code)).toBe(true);
	});

	it("should return true for UK (GB)", () => {
		expect(isGDPRCountry("GB")).toBe(true);
	});

	it("should return true for Switzerland (CH)", () => {
		expect(isGDPRCountry("CH")).toBe(true);
	});

	it("should return false for US", () => {
		expect(isGDPRCountry("US")).toBe(false);
	});

	it("should return false for null", () => {
		expect(isGDPRCountry(null)).toBe(false);
	});

	it("should handle lowercase input", () => {
		expect(isGDPRCountry("de")).toBe(true);
	});
});

describe("isEUCountry", () => {
	it("should return true for EU member DE", () => {
		expect(isEUCountry("DE")).toBe(true);
	});

	it("should return false for EEA-only country IS", () => {
		expect(isEUCountry("IS")).toBe(false);
	});

	it("should return false for UK (GB)", () => {
		expect(isEUCountry("GB")).toBe(false);
	});

	it("should return false for US", () => {
		expect(isEUCountry("US")).toBe(false);
	});

	it("should return false for null", () => {
		expect(isEUCountry(null)).toBe(false);
	});

	it("should handle lowercase input", () => {
		expect(isEUCountry("de")).toBe(true);
	});
});

describe("getGeoDataForClient", () => {
	it("should return EU data for EU country", () => {
		const result = getGeoDataForClient(makeHeaders({ "cf-ipcountry": "DE" }));
		expect(result).toEqual({
			country: "DE",
			isEU: true,
			requiresCookieConsent: true,
		});
	});

	it("should return non-EU data for US", () => {
		const result = getGeoDataForClient(makeHeaders({ "cf-ipcountry": "US" }));
		expect(result).toEqual({
			country: "US",
			isEU: false,
			requiresCookieConsent: false,
		});
	});

	it("should handle missing header", () => {
		const result = getGeoDataForClient(makeHeaders());
		expect(result).toEqual({
			country: null,
			isEU: false,
			requiresCookieConsent: false,
		});
	});

	it("should require cookie consent for UK (GDPR but not EU)", () => {
		const result = getGeoDataForClient(makeHeaders({ "cf-ipcountry": "GB" }));
		expect(result).toEqual({
			country: "GB",
			isEU: false,
			requiresCookieConsent: true,
		});
	});

	it("should require cookie consent for EEA country (GDPR but not EU)", () => {
		const result = getGeoDataForClient(makeHeaders({ "cf-ipcountry": "NO" }));
		expect(result).toEqual({
			country: "NO",
			isEU: false,
			requiresCookieConsent: true,
		});
	});
});
