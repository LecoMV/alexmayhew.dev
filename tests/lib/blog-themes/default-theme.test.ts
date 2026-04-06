import { describe, expect, it } from "vitest";

import { defaultTheme } from "@/lib/blog-themes/themes/default";

describe("defaultTheme", () => {
	it("formats category names through categoryFormat function", () => {
		expect(defaultTheme.typography.categoryFormat("engineering")).toBe("engineering");
		expect(defaultTheme.typography.categoryFormat("architecture")).toBe("architecture");
	});
});
