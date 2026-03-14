import { describe, expect, it } from "vitest";

import type { Metadata } from "next";

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

	it("homepage should export metadata with canonical '/'", async () => {
		const mod = (await import("@/app/page")) as { metadata: Metadata };
		expect(mod.metadata).toBeDefined();
		expect(mod.metadata.alternates).toBeDefined();
		const alternates = mod.metadata.alternates as { canonical: string };
		expect(alternates.canonical).toBe("/");
	});

	it("/about should have canonical", async () => {
		const { metadata } = (await import("@/app/about/page")) as { metadata: Metadata };
		expect(metadata.alternates).toBeDefined();
		const alternates = metadata.alternates as { canonical: string };
		expect(alternates.canonical).toBe("/about");
	});

	it("/contact should have canonical", async () => {
		const { metadata } = (await import("@/app/contact/page")) as { metadata: Metadata };
		expect(metadata.alternates).toBeDefined();
		const alternates = metadata.alternates as { canonical: string };
		expect(alternates.canonical).toBe("/contact");
	});

	it("/work should have canonical", async () => {
		const { metadata } = (await import("@/app/work/page")) as { metadata: Metadata };
		expect(metadata.alternates).toBeDefined();
		const alternates = metadata.alternates as { canonical: string };
		expect(alternates.canonical).toBe("/work");
	});

	it("/for should have canonical", async () => {
		const { metadata } = (await import("@/app/for/page")) as { metadata: Metadata };
		expect(metadata.alternates).toBeDefined();
		const alternates = metadata.alternates as { canonical: string };
		expect(alternates.canonical).toBe("/for");
	});

	it("/services should have canonical", async () => {
		const { metadata } = (await import("@/app/services/page")) as { metadata: Metadata };
		expect(metadata.alternates).toBeDefined();
		const alternates = metadata.alternates as { canonical: string };
		expect(alternates.canonical).toBe("/services");
	});

	it("/tools should have canonical", async () => {
		const { metadata } = (await import("@/app/tools/page")) as { metadata: Metadata };
		expect(metadata.alternates).toBeDefined();
		const alternates = metadata.alternates as { canonical: string };
		expect(alternates.canonical).toBe("/tools");
	});

	it("/privacy should have canonical", async () => {
		const { metadata } = (await import("@/app/privacy/page")) as { metadata: Metadata };
		expect(metadata.alternates).toBeDefined();
		const alternates = metadata.alternates as { canonical: string };
		expect(alternates.canonical).toBe("/privacy");
	});

	it("/terms should have canonical", async () => {
		const { metadata } = (await import("@/app/terms/page")) as { metadata: Metadata };
		expect(metadata.alternates).toBeDefined();
		const alternates = metadata.alternates as { canonical: string };
		expect(alternates.canonical).toBe("/terms");
	});

	it("root layout Twitter creator should be @alexmayhewdev", async () => {
		// Cannot import layout.tsx directly due to next-view-transitions module resolution
		// in test environment. Use source scanning instead (same pattern as cascading canonical test).
		const layoutSource = await import("fs").then((fs) =>
			fs.readFileSync("src/app/layout.tsx", "utf-8")
		);
		expect(layoutSource).toContain('creator: "@alexmayhewdev"');
		expect(layoutSource).not.toContain('creator: "@alexmayhew"');
	});
});
