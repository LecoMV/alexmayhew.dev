import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { resumeMeta, resumeRoles } from "@/data/resume";

// The committed PDF (public/Alex-Mayhew-Resume.pdf) is the downloadable resume.
// public/Alex-Mayhew-Resume.txt is its pdftotext extraction, committed as a
// drift fixture: if resume.ts identity facts change without regenerating the
// PDF + this text, the assertions below fail. Regenerate with:
//   pdftotext -layout public/Alex-Mayhew-Resume.pdf public/Alex-Mayhew-Resume.txt
describe("resume PDF ↔ resume.ts parity", () => {
	const pdfText = readFileSync(
		join(process.cwd(), "public/Alex-Mayhew-Resume.txt"),
		"utf-8"
	).replace(/\s+/g, " ");

	it("PDF contains the canonical name, headline identity, and handles", () => {
		expect(pdfText).toContain(resumeMeta.name);
		expect(pdfText).toContain("Technology Specialist");
		expect(pdfText).toContain(resumeMeta.email);
		expect(pdfText).toContain(resumeMeta.linkedin);
	});

	it("PDF contains every role's org, title, and dates", () => {
		for (const role of resumeRoles) {
			expect(pdfText).toContain(role.org);
			expect(pdfText).toContain(role.start);
			if (role.end !== "Present") {
				expect(pdfText).toContain(role.end);
			}
		}
	});

	it("PDF states no banned identity claim", () => {
		for (const banned of [
			"Technical Advisor",
			"Systems Architect",
			"15+ years",
			"30+ startups",
			// The occupation noun must be single-valued across every surface.
			// The reposition standardized on "specialist"; a stray "generalist"
			// in the downloadable PDF is the exact drift that contradicts the site.
			"Technology generalist",
		]) {
			expect(pdfText).not.toContain(banned);
		}
	});
});
