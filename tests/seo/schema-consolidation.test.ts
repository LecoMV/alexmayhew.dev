import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { SITE_URL, WEBSITE_REF } from "@/components/seo/schema-utils";

describe("WEBSITE_REF @id uses fragment identifier", () => {
	it("WEBSITE_REF @id should be SITE_URL/#website, not bare SITE_URL", () => {
		expect(WEBSITE_REF["@id"]).toBe(`${SITE_URL}/#website`);
	});

	it("technology-json-ld should not spread WEBSITE_REF to override @id", () => {
		const content = readFileSync(
			join(process.cwd(), "src/components/seo/technology-json-ld.tsx"),
			"utf-8"
		);
		expect(content).not.toMatch(/\.\.\.WEBSITE_REF/);
	});
});

describe("No inline Person objects in JSON-LD components", () => {
	it("contact-json-ld.tsx should not contain inline Person objects", () => {
		const content = readFileSync(
			join(process.cwd(), "src/components/seo/contact-json-ld.tsx"),
			"utf-8"
		);
		expect(content).not.toMatch(/"@type":\s*"Person"/);
	});

	it("role-json-ld.tsx should not contain inline Person objects", () => {
		const content = readFileSync(
			join(process.cwd(), "src/components/seo/role-json-ld.tsx"),
			"utf-8"
		);
		expect(content).not.toMatch(/"@type":\s*"Person"/);
	});

	it("technology-json-ld.tsx should not contain inline Person objects", () => {
		const content = readFileSync(
			join(process.cwd(), "src/components/seo/technology-json-ld.tsx"),
			"utf-8"
		);
		expect(content).not.toMatch(/"@type":\s*"Person"/);
	});

	it("case-study-json-ld.tsx should not contain inline Person objects", () => {
		const content = readFileSync(
			join(process.cwd(), "src/components/seo/case-study-json-ld.tsx"),
			"utf-8"
		);
		expect(content).not.toMatch(/"@type":\s*"Person"/);
	});

	it("comparison-json-ld.tsx should not contain inline Person objects", () => {
		const content = readFileSync(
			join(process.cwd(), "src/components/seo/comparison-json-ld.tsx"),
			"utf-8"
		);
		expect(content).not.toMatch(/"@type":\s*"Person"/);
	});

	it("services/page.tsx should not contain inline Person objects", () => {
		const content = readFileSync(join(process.cwd(), "src/app/services/page.tsx"), "utf-8");
		expect(content).not.toMatch(/"@type":\s*"Person"/);
	});

	it("for/page.tsx should not contain inline Person objects", () => {
		const content = readFileSync(join(process.cwd(), "src/app/for/page.tsx"), "utf-8");
		expect(content).not.toMatch(/"@type":\s*"Person"/);
	});
});

describe("PROVIDER_PERSON is removed", () => {
	it("schema-utils should not export PROVIDER_PERSON", async () => {
		const source = await import("@/components/seo/schema-utils");
		expect(source).not.toHaveProperty("PROVIDER_PERSON");
	});
});

describe("Missing schema types", () => {
	it("about/page.tsx should contain ProfilePage JSON-LD", () => {
		const content = readFileSync(join(process.cwd(), "src/app/about/page.tsx"), "utf-8");
		expect(content).toContain("ProfilePage");
	});

	it("blog/page.tsx should contain CollectionPage JSON-LD", () => {
		const content = readFileSync(join(process.cwd(), "src/app/blog/page.tsx"), "utf-8");
		expect(content).toContain("CollectionPage");
	});

	it("comparison-json-ld.tsx should use TechArticle not Article", () => {
		const content = readFileSync(
			join(process.cwd(), "src/components/seo/comparison-json-ld.tsx"),
			"utf-8"
		);
		expect(content).toContain("TechArticle");
		expect(content).not.toMatch(/"@type": "Article"/);
	});
});
