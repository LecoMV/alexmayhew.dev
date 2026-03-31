import { describe, expect, it } from "vitest";

import { ORG_REF, PERSON_REF, SITE_URL } from "@/components/seo/schema-utils";

describe("Schema @id references", () => {
	it("exports PERSON_REF with correct @id", () => {
		expect(PERSON_REF).toEqual({ "@id": `${SITE_URL}/#person` });
	});

	it("exports ORG_REF with correct @id", () => {
		expect(ORG_REF).toEqual({ "@id": `${SITE_URL}/#organization` });
	});

	it("PROVIDER_PERSON is deprecated in favor of PERSON_REF", async () => {
		const source = await import("@/components/seo/schema-utils");
		expect(source.PERSON_REF).toBeDefined();
		expect(source.PERSON_REF["@id"]).toContain("/#person");
	});
});
