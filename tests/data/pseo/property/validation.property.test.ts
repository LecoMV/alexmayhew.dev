import { fc, test } from "@fast-check/vitest";
import { describe } from "vitest";

import {
	budgetRangeSchema,
	countWords,
	SEO_DESCRIPTION_MAX,
	SEO_DESCRIPTION_MIN,
	SEO_TITLE_MAX,
	SEO_TITLE_MIN,
	seoMetaSchema,
	validateSlugFormat,
} from "@/data/pseo/validation";

describe("countWords properties", () => {
	test.prop([fc.string()])("always returns non-negative", (text) => {
		return countWords(text) >= 0;
	});

	test.prop([fc.constant("")])("empty string returns 0", (text) => {
		return countWords(text) === 0;
	});

	test.prop([fc.stringMatching(/^[ \t\n]*$/)])("whitespace-only returns 0", (text) => {
		return countWords(text) === 0;
	});
});

describe("seoMetaSchema properties", () => {
	const validDescArb = fc.string({
		minLength: SEO_DESCRIPTION_MIN,
		maxLength: SEO_DESCRIPTION_MAX,
	});
	const validKeywordsArb = fc.array(fc.string({ minLength: 1, maxLength: 30 }), {
		minLength: 3,
		maxLength: 10,
	});

	test.prop([
		fc.string({ minLength: SEO_TITLE_MIN, maxLength: SEO_TITLE_MAX }),
		validDescArb,
		validKeywordsArb,
	])("titles in valid range always pass", (title, description, keywords) => {
		const result = seoMetaSchema.safeParse({ title, description, keywords });
		return result.success === true;
	});

	test.prop([fc.string({ maxLength: SEO_TITLE_MIN - 1 }), validDescArb, validKeywordsArb])(
		"titles below min always fail",
		(title, description, keywords) => {
			const result = seoMetaSchema.safeParse({ title, description, keywords });
			return result.success === false;
		}
	);

	test.prop([
		fc.string({ minLength: SEO_TITLE_MAX + 1, maxLength: SEO_TITLE_MAX + 100 }),
		validDescArb,
		validKeywordsArb,
	])("titles above max always fail", (title, description, keywords) => {
		const result = seoMetaSchema.safeParse({ title, description, keywords });
		return result.success === false;
	});

	test.prop([
		fc.string({ minLength: SEO_TITLE_MIN, maxLength: SEO_TITLE_MAX }),
		fc.string({ maxLength: SEO_DESCRIPTION_MIN - 1 }),
		validKeywordsArb,
	])("descriptions below min always fail", (title, description, keywords) => {
		const result = seoMetaSchema.safeParse({ title, description, keywords });
		return result.success === false;
	});
});

describe("budgetRangeSchema properties", () => {
	const validFactorsArb = fc.array(fc.string({ minLength: 1 }), { minLength: 2, maxLength: 5 });
	const currencyArb = fc.constantFrom("USD" as const, "GBP" as const, "EUR" as const);

	test.prop([
		fc.integer({ min: 1, max: 1000 }),
		fc.integer({ min: 1, max: 1000 }),
		fc.integer({ min: 1, max: 1000 }),
		fc.integer({ min: 1, max: 1000 }),
		currencyArb,
		validFactorsArb,
	])("valid ordering always passes", (a, b, c, d, currency, factors) => {
		const sorted = [a, b, c, d].sort((x, y) => x - y);
		// Need strict ordering: mvpMin < mvpMax <= fullMin < fullMax
		fc.pre(sorted[0] < sorted[1] && sorted[1] <= sorted[2] && sorted[2] < sorted[3]);
		const result = budgetRangeSchema.safeParse({
			mvpMin: sorted[0],
			mvpMax: sorted[1],
			fullMin: sorted[2],
			fullMax: sorted[3],
			currency,
			factors,
		});
		return result.success === true;
	});

	test.prop([fc.integer({ min: 100, max: 1000 }), currencyArb, validFactorsArb])(
		"mvpMin >= mvpMax always fails",
		(base, currency, factors) => {
			const result = budgetRangeSchema.safeParse({
				mvpMin: base + 100,
				mvpMax: base,
				fullMin: base + 200,
				fullMax: base + 300,
				currency,
				factors,
			});
			return result.success === false;
		}
	);
});

describe("validateSlugFormat properties", () => {
	test.prop([fc.string().filter((s) => !s.includes("-"))])(
		"slugs without hyphens always return false",
		(slug) => {
			return validateSlugFormat(slug) === false;
		}
	);
});
