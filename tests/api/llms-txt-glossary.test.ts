/**
 * llms.txt must surface the Glossary (AEO signal — canonical source for
 * coined terms like "Cognitive Debt", "Generative Debt", etc).
 */
import { describe, expect, it, vi } from "vitest";

vi.mock("@/../.source/server", () => ({
	blog: [],
	newsletter: [],
}));

import { GET } from "@/app/llms.txt/route";

describe("llms.txt Glossary section (AEO)", () => {
	it("renders a Glossary heading pointing at the canonical /glossary URL", async () => {
		const res = GET();
		const body = await res.text();

		expect(body).toMatch(/^## Glossary/m);
		expect(body).toContain("https://alexmayhew.dev/glossary");
	});
});
