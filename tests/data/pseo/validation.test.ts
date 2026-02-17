import { describe, expect, it } from "vitest";
import { z } from "zod";

import {
	budgetRangeSchema,
	checkQualityGates,
	countWords,
	formatZodErrors,
	formatZodErrorString,
	MIN_FAQS,
	MIN_LONG_FORM_WORDS,
	MIN_PAIN_POINTS,
	MIN_TECH_RECOMMENDATIONS,
	MIN_UNIQUE_INSIGHTS,
	SEO_DESCRIPTION_MAX,
	SEO_DESCRIPTION_MIN,
	SEO_TITLE_MAX,
	SEO_TITLE_MIN,
	seoMetaSchema,
	validatePartialPage,
	validatePseoPage,
	validateSlugFormat,
} from "@/data/pseo/validation";

import type { PseoPage } from "@/data/pseo/types";

// =============================================================================
// Test Fixtures
// =============================================================================

function makeValidPage(overrides: Partial<PseoPage> = {}): PseoPage {
	return {
		slug: "nextjs-healthcare",
		technology: "nextjs",
		industry: "healthcare",
		seo: {
			title: "A".repeat(40),
			description: "B".repeat(120),
			keywords: ["keyword1", "keyword2", "keyword3"],
		},
		uniqueInsights: Array(5).fill("X".repeat(60)),
		industryRegulations: [],
		commonPainPoints: Array(3).fill({
			title: "Pain Point",
			description: "D".repeat(30),
			solution: "S".repeat(50),
		}),
		techStackRecommendations: Array(3).fill({
			component: "Component",
			technology: "Technology",
			rationale: "R".repeat(30),
		}),
		whyThisStack: Array(160).fill("word").join(" "),
		projectApproach: Array(160).fill("word").join(" "),
		budgetGuidance: {
			mvpMin: 5000,
			mvpMax: 10000,
			fullMin: 10000,
			fullMax: 50000,
			currency: "USD",
			factors: ["complexity", "timeline"],
		},
		faqs: Array(3).fill({
			question: "What is this?",
			answer: "A".repeat(50),
		}),
		relatedServices: ["service1"],
		relatedBlogPosts: ["blog1"],
		published: true,
		lastUpdated: new Date(),
		...overrides,
	};
}

// =============================================================================
// countWords
// =============================================================================

describe("countWords", () => {
	it("returns 0 for an empty string", () => {
		expect(countWords("")).toBe(0);
	});

	it("returns 1 for a single word", () => {
		expect(countWords("hello")).toBe(1);
	});

	it("returns correct count for multiple words", () => {
		expect(countWords("hello world foo")).toBe(3);
	});

	it("returns 0 for whitespace-only string", () => {
		expect(countWords("   ")).toBe(0);
	});

	it("handles multiple spaces between words", () => {
		expect(countWords("hello   world   foo")).toBe(3);
	});

	it("handles leading and trailing whitespace", () => {
		expect(countWords("  hello world  ")).toBe(2);
	});

	it("handles tabs and newlines as separators", () => {
		expect(countWords("hello\tworld\nfoo")).toBe(3);
	});
});

// =============================================================================
// validateSlugFormat
// =============================================================================

describe("validateSlugFormat", () => {
	it("returns true for a valid tech + industry slug", () => {
		expect(validateSlugFormat("nextjs-healthcare")).toBe(true);
	});

	it("returns true for a multi-word industry slug", () => {
		expect(validateSlugFormat("react-real-estate")).toBe(true);
	});

	it("returns false for an invalid technology", () => {
		expect(validateSlugFormat("invalid-healthcare")).toBe(false);
	});

	it("returns false for an invalid industry", () => {
		expect(validateSlugFormat("nextjs-invalid")).toBe(false);
	});

	it("returns false when no hyphen present", () => {
		expect(validateSlugFormat("nohyphen")).toBe(false);
	});

	it("returns false for an empty string", () => {
		expect(validateSlugFormat("")).toBe(false);
	});

	it("returns true for all valid technology keys", () => {
		const techs = [
			"nextjs",
			"react",
			"nodejs",
			"python",
			"typescript",
			"postgresql",
			"prisma",
			"tailwindcss",
			"cloudflare",
			"vercel",
			"stripe",
			"auth0",
			"supabase",
		];
		for (const tech of techs) {
			expect(validateSlugFormat(`${tech}-healthcare`)).toBe(true);
		}
	});
});

// =============================================================================
// budgetRangeSchema
// =============================================================================

describe("budgetRangeSchema", () => {
	const validBudget = {
		mvpMin: 5000,
		mvpMax: 10000,
		fullMin: 10000,
		fullMax: 50000,
		currency: "USD" as const,
		factors: ["complexity", "timeline"],
	};

	it("accepts a valid budget range", () => {
		const result = budgetRangeSchema.safeParse(validBudget);
		expect(result.success).toBe(true);
	});

	it("rejects when mvpMin > mvpMax", () => {
		const result = budgetRangeSchema.safeParse({
			...validBudget,
			mvpMin: 15000,
			mvpMax: 10000,
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			const messages = result.error.issues.map((i) => i.message);
			expect(messages).toContain("MVP min must be less than max");
		}
	});

	it("rejects when mvpMax > fullMin", () => {
		const result = budgetRangeSchema.safeParse({
			...validBudget,
			mvpMax: 20000,
			fullMin: 15000,
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			const messages = result.error.issues.map((i) => i.message);
			expect(messages).toContain("MVP max should not exceed full solution min");
		}
	});

	it("rejects when fullMin > fullMax", () => {
		const result = budgetRangeSchema.safeParse({
			...validBudget,
			fullMin: 60000,
			fullMax: 50000,
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			const messages = result.error.issues.map((i) => i.message);
			expect(messages).toContain("Full min must be less than max");
		}
	});

	it("accepts when mvpMax equals fullMin (boundary)", () => {
		const result = budgetRangeSchema.safeParse({
			...validBudget,
			mvpMax: 10000,
			fullMin: 10000,
		});
		expect(result.success).toBe(true);
	});

	it("rejects fewer than 2 pricing factors", () => {
		const result = budgetRangeSchema.safeParse({
			...validBudget,
			factors: ["only-one"],
		});
		expect(result.success).toBe(false);
	});
});

// =============================================================================
// seoMetaSchema
// =============================================================================

describe("seoMetaSchema", () => {
	const validSeo = {
		title: "A".repeat(40),
		description: "B".repeat(120),
		keywords: ["a", "b", "c"],
	};

	it("accepts valid SEO metadata", () => {
		const result = seoMetaSchema.safeParse(validSeo);
		expect(result.success).toBe(true);
	});

	it("accepts title at minimum boundary (30 chars)", () => {
		const result = seoMetaSchema.safeParse({
			...validSeo,
			title: "A".repeat(SEO_TITLE_MIN),
		});
		expect(result.success).toBe(true);
	});

	it("rejects title below minimum (29 chars)", () => {
		const result = seoMetaSchema.safeParse({
			...validSeo,
			title: "A".repeat(SEO_TITLE_MIN - 1),
		});
		expect(result.success).toBe(false);
	});

	it("accepts title at maximum boundary (70 chars)", () => {
		const result = seoMetaSchema.safeParse({
			...validSeo,
			title: "A".repeat(SEO_TITLE_MAX),
		});
		expect(result.success).toBe(true);
	});

	it("rejects title above maximum (71 chars)", () => {
		const result = seoMetaSchema.safeParse({
			...validSeo,
			title: "A".repeat(SEO_TITLE_MAX + 1),
		});
		expect(result.success).toBe(false);
	});

	it("accepts description at minimum boundary (100 chars)", () => {
		const result = seoMetaSchema.safeParse({
			...validSeo,
			description: "B".repeat(SEO_DESCRIPTION_MIN),
		});
		expect(result.success).toBe(true);
	});

	it("rejects description below minimum (99 chars)", () => {
		const result = seoMetaSchema.safeParse({
			...validSeo,
			description: "B".repeat(SEO_DESCRIPTION_MIN - 1),
		});
		expect(result.success).toBe(false);
	});

	it("accepts description at maximum boundary (170 chars)", () => {
		const result = seoMetaSchema.safeParse({
			...validSeo,
			description: "B".repeat(SEO_DESCRIPTION_MAX),
		});
		expect(result.success).toBe(true);
	});

	it("rejects description above maximum (171 chars)", () => {
		const result = seoMetaSchema.safeParse({
			...validSeo,
			description: "B".repeat(SEO_DESCRIPTION_MAX + 1),
		});
		expect(result.success).toBe(false);
	});

	it("accepts 3 or more keywords", () => {
		const result = seoMetaSchema.safeParse({
			...validSeo,
			keywords: ["a", "b", "c"],
		});
		expect(result.success).toBe(true);
	});

	it("rejects fewer than 3 keywords", () => {
		const result = seoMetaSchema.safeParse({
			...validSeo,
			keywords: ["a", "b"],
		});
		expect(result.success).toBe(false);
	});

	it("accepts optional ogTitle and ogDescription", () => {
		const result = seoMetaSchema.safeParse({
			...validSeo,
			ogTitle: "OG Title",
			ogDescription: "OG Description",
		});
		expect(result.success).toBe(true);
	});
});

// =============================================================================
// checkQualityGates
// =============================================================================

describe("checkQualityGates", () => {
	it("passes when all gates are met", () => {
		const page = makeValidPage();
		const result = checkQualityGates(page);
		expect(result.passed).toBe(true);
		expect(result.issues).toHaveLength(0);
	});

	it("fails when uniqueInsights count is below minimum", () => {
		const page = makeValidPage({
			uniqueInsights: Array(MIN_UNIQUE_INSIGHTS - 1).fill("X".repeat(60)),
		});
		const result = checkQualityGates(page);
		expect(result.passed).toBe(false);
		expect(result.issues.some((i) => i.gate === "uniqueInsights")).toBe(true);
	});

	it("fails when whyThisStack has fewer than 150 words", () => {
		const page = makeValidPage({
			whyThisStack: Array(MIN_LONG_FORM_WORDS - 1)
				.fill("word")
				.join(" "),
		});
		const result = checkQualityGates(page);
		expect(result.passed).toBe(false);
		expect(result.issues.some((i) => i.gate === "whyThisStack")).toBe(true);
	});

	it("fails when projectApproach has fewer than 150 words", () => {
		const page = makeValidPage({
			projectApproach: Array(MIN_LONG_FORM_WORDS - 1)
				.fill("word")
				.join(" "),
		});
		const result = checkQualityGates(page);
		expect(result.passed).toBe(false);
		expect(result.issues.some((i) => i.gate === "projectApproach")).toBe(true);
	});

	it("fails when faqs count is below minimum", () => {
		const page = makeValidPage({
			faqs: Array(MIN_FAQS - 1).fill({
				question: "Q?",
				answer: "A".repeat(50),
			}),
		});
		const result = checkQualityGates(page);
		expect(result.passed).toBe(false);
		expect(result.issues.some((i) => i.gate === "faqs")).toBe(true);
	});

	it("fails when commonPainPoints count is below minimum", () => {
		const page = makeValidPage({
			commonPainPoints: Array(MIN_PAIN_POINTS - 1).fill({
				title: "T",
				description: "D".repeat(30),
				solution: "S".repeat(50),
			}),
		});
		const result = checkQualityGates(page);
		expect(result.passed).toBe(false);
		expect(result.issues.some((i) => i.gate === "commonPainPoints")).toBe(true);
	});

	it("fails when techStackRecommendations count is below minimum", () => {
		const page = makeValidPage({
			techStackRecommendations: Array(MIN_TECH_RECOMMENDATIONS - 1).fill({
				component: "C",
				technology: "T",
				rationale: "R".repeat(30),
			}),
		});
		const result = checkQualityGates(page);
		expect(result.passed).toBe(false);
		expect(result.issues.some((i) => i.gate === "techStackRecommendations")).toBe(true);
	});

	it("reports multiple failures simultaneously", () => {
		const page = makeValidPage({
			uniqueInsights: [],
			faqs: [],
			commonPainPoints: [],
		});
		const result = checkQualityGates(page);
		expect(result.passed).toBe(false);
		expect(result.issues.length).toBeGreaterThanOrEqual(3);
	});

	it("includes correct required and actual counts in issue", () => {
		const page = makeValidPage({
			uniqueInsights: Array(2).fill("X".repeat(60)),
		});
		const result = checkQualityGates(page);
		const issue = result.issues.find((i) => i.gate === "uniqueInsights");
		expect(issue).toBeDefined();
		expect(issue!.required).toBe(MIN_UNIQUE_INSIGHTS);
		expect(issue!.actual).toBe(2);
	});
});

// =============================================================================
// validatePseoPage
// =============================================================================

describe("validatePseoPage", () => {
	it("succeeds for a complete valid page", () => {
		const page = makeValidPage();
		const result = validatePseoPage(page);
		expect(result.success).toBe(true);
	});

	it("fails for missing required fields", () => {
		const result = validatePseoPage({});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.errors.length).toBeGreaterThan(0);
		}
	});

	it("fails for an invalid technology value", () => {
		const page = makeValidPage({ technology: "invalid-tech" as never });
		const result = validatePseoPage(page);
		expect(result.success).toBe(false);
	});

	it("fails for an invalid industry value", () => {
		const page = makeValidPage({ industry: "invalid-industry" as never });
		const result = validatePseoPage(page);
		expect(result.success).toBe(false);
	});

	it("fails when unique insights have fewer than 50 characters each", () => {
		const page = makeValidPage({
			uniqueInsights: Array(5).fill("short"),
		});
		const result = validatePseoPage(page);
		expect(result.success).toBe(false);
	});
});

// =============================================================================
// validatePartialPage
// =============================================================================

describe("validatePartialPage", () => {
	it("succeeds for partial data with only slug", () => {
		const result = validatePartialPage({ slug: "nextjs-healthcare" });
		expect(result.success).toBe(true);
	});

	it("succeeds for an empty object", () => {
		const result = validatePartialPage({});
		expect(result.success).toBe(true);
	});

	it("fails for an invalid slug format", () => {
		const result = validatePartialPage({ slug: "INVALID SLUG!" });
		expect(result.success).toBe(false);
	});

	it("fails for an invalid technology", () => {
		const result = validatePartialPage({ technology: "nonexistent" });
		expect(result.success).toBe(false);
	});

	it("succeeds with valid optional fields", () => {
		const result = validatePartialPage({
			slug: "react-fintech",
			technology: "react",
			industry: "fintech",
			published: false,
		});
		expect(result.success).toBe(true);
	});
});

// =============================================================================
// formatZodErrors
// =============================================================================

describe("formatZodErrors", () => {
	it("returns structured ValidationError array", () => {
		const schema = z.object({ name: z.string().min(1, "Required") });
		const result = schema.safeParse({ name: "" });
		if (!result.success) {
			const errors = formatZodErrors(result.error);
			expect(errors).toHaveLength(1);
			expect(errors[0]).toHaveProperty("path", "name");
			expect(errors[0]).toHaveProperty("message", "Required");
			expect(errors[0]).toHaveProperty("code");
		}
	});

	it("handles nested paths", () => {
		const schema = z.object({
			seo: z.object({ title: z.string().min(1, "Title required") }),
		});
		const result = schema.safeParse({ seo: { title: "" } });
		if (!result.success) {
			const errors = formatZodErrors(result.error);
			expect(errors[0].path).toBe("seo.title");
		}
	});

	it("returns multiple errors for multiple failures", () => {
		const schema = z.object({
			a: z.string().min(1, "A required"),
			b: z.number().min(0, "B must be positive"),
		});
		const result = schema.safeParse({ a: "", b: -1 });
		if (!result.success) {
			const errors = formatZodErrors(result.error);
			expect(errors).toHaveLength(2);
		}
	});
});

// =============================================================================
// formatZodErrorString
// =============================================================================

describe("formatZodErrorString", () => {
	it("formats errors as a semicolon-separated string", () => {
		const schema = z.object({
			name: z.string().min(1, "Name required"),
			age: z.number().min(0, "Age must be positive"),
		});
		const result = schema.safeParse({ name: "", age: -1 });
		if (!result.success) {
			const formatted = formatZodErrorString(result.error);
			expect(formatted).toContain("name: Name required");
			expect(formatted).toContain("age: Age must be positive");
			expect(formatted).toContain("; ");
		}
	});

	it("formats a single error without separator", () => {
		const schema = z.object({ name: z.string().min(1, "Required") });
		const result = schema.safeParse({ name: "" });
		if (!result.success) {
			const formatted = formatZodErrorString(result.error);
			expect(formatted).toBe("name: Required");
			expect(formatted).not.toContain("; ");
		}
	});
});
