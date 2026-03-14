import { describe, expect, it } from "vitest";

const siteUrl = "https://alexmayhew.dev";

describe("Canonical URL Configuration", () => {
	it("root layout should not set a canonical that cascades to all pages", async () => {
		// The root layout's metadata.alternates.canonical must NOT be set to the
		// homepage URL, because Next.js cascades this to ALL child pages.
		// This causes Google to treat every page as a duplicate of the homepage.
		const layoutSource = await import("fs").then((fs) =>
			fs.readFileSync("src/app/layout.tsx", "utf-8")
		);

		// The root layout should either have no canonical, or use a pattern
		// that doesn't cascade (like setting it only on the homepage page.tsx)
		const hasStaticCanonical = /alternates:\s*\{[^}]*canonical:\s*siteUrl/s.test(layoutSource);
		expect(hasStaticCanonical).toBe(false);
	});
});
