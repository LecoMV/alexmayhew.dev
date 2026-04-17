import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

describe("CTA copy on services hub", () => {
	it("services-page-content.tsx uses outcome-specific CTA text (no code-syntax)", () => {
		const content = readFileSync(
			join(process.cwd(), "src/app/services/services-page-content.tsx"),
			"utf-8"
		);
		expect(content).not.toContain("SCHEDULE_CONSULTATION()");
		expect(content).not.toContain("Schedule_Consultation()");
		expect(content).toContain("Book a working session");
	});
});

describe("Contact form CRO", () => {
	it("budget enum should include a not-sure option", () => {
		const content = readFileSync(join(process.cwd(), "src/lib/schemas/contact.ts"), "utf-8");
		expect(content).toContain("not-sure");
	});

	it("contact form should say 'How did you find me?' not 'about us'", () => {
		const content = readFileSync(
			join(process.cwd(), "src/components/pages/contact-page.tsx"),
			"utf-8"
		);
		expect(content).not.toContain("about us");
		expect(content).toContain("find me");
	});
});

describe("Copy fixes", () => {
	it("homepage should not have buzzword services copy", () => {
		const content = readFileSync(join(process.cwd(), "src/app/home-page.tsx"), "utf-8");
		expect(content).not.toContain("engineered for digital excellence");
	});

	it("work page should say Case Studies not Experiments", () => {
		const content = readFileSync(
			join(process.cwd(), "src/components/pages/work-page.tsx"),
			"utf-8"
		);
		expect(content).not.toContain("Experiments");
		expect(content).toContain("Case Studies");
	});
});

describe("Navigation CTA", () => {
	it("navigation should have a highlighted Book a Call CTA linking to /contact", () => {
		const content = readFileSync(join(process.cwd(), "src/components/ui/navigation.tsx"), "utf-8");
		expect(content).toContain("Book a Call");
	});
});
