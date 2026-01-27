/**
 * Programmatic SEO Data Validation
 *
 * Zod schemas with quality gates to ensure all pSEO pages
 * meet minimum content standards.
 */

import { z } from "zod";
import type {
	Technology,
	Industry,
	Regulation,
	PainPoint,
	Recommendation,
	CaseStudy,
	BudgetRange,
	FaqItem,
	SeoMeta,
	PseoPage,
} from "./types";
import { TECHNOLOGY_LABELS, INDUSTRY_LABELS } from "./types";

// =============================================================================
// Constants - Quality Gates
// =============================================================================

/** Minimum number of unique insights required */
export const MIN_UNIQUE_INSIGHTS = 5;

/** Minimum word count for long-form content sections */
export const MIN_LONG_FORM_WORDS = 150;

/** Minimum number of FAQs */
export const MIN_FAQS = 3;

/** Minimum number of pain points */
export const MIN_PAIN_POINTS = 3;

/** Minimum number of tech recommendations */
export const MIN_TECH_RECOMMENDATIONS = 3;

/** SEO title length limits */
export const SEO_TITLE_MIN = 30;
export const SEO_TITLE_MAX = 70;

/** SEO description length limits */
export const SEO_DESCRIPTION_MIN = 100;
export const SEO_DESCRIPTION_MAX = 170;

// =============================================================================
// Helper Schemas
// =============================================================================

/**
 * Validate word count meets minimum
 */
function minWords(min: number) {
	return z.string().refine(
		(text) => {
			const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
			return wordCount >= min;
		},
		{
			message: `Content must be at least ${min} words`,
		}
	);
}

/**
 * Non-empty string validation (no transform to preserve type compatibility)
 */
const nonEmptyString = z.string().min(1, "Required");

// =============================================================================
// Enum Schemas
// =============================================================================

const technologyValues = Object.keys(TECHNOLOGY_LABELS) as [Technology, ...Technology[]];
const industryValues = Object.keys(INDUSTRY_LABELS) as [Industry, ...Industry[]];

export const technologySchema = z.enum(technologyValues);
export const industrySchema = z.enum(industryValues);

// =============================================================================
// Supporting Type Schemas
// =============================================================================

export const regulationSchema: z.ZodType<Regulation> = z.object({
	name: nonEmptyString,
	fullName: nonEmptyString,
	technicalImplications: z
		.string()
		.min(50, "Technical implications must be at least 50 characters"),
	requirements: z.array(nonEmptyString).min(1, "At least one requirement is needed"),
});

export const painPointSchema: z.ZodType<PainPoint> = z.object({
	title: nonEmptyString,
	description: z.string().min(30, "Description must be at least 30 characters"),
	solution: z.string().min(50, "Solution must be at least 50 characters"),
});

export const recommendationSchema: z.ZodType<Recommendation> = z.object({
	component: nonEmptyString,
	technology: nonEmptyString,
	rationale: z.string().min(30, "Rationale must be at least 30 characters"),
});

export const caseStudySchema: z.ZodType<CaseStudy> = z.object({
	clientName: nonEmptyString,
	industry: industrySchema,
	challenge: z.string().min(50, "Challenge must be at least 50 characters"),
	solution: z.string().min(50, "Solution must be at least 50 characters"),
	results: z.array(nonEmptyString).min(2, "At least 2 results are required"),
	techUsed: z.array(technologySchema).min(1, "At least 1 technology is required"),
});

export const budgetRangeSchema: z.ZodType<BudgetRange> = z
	.object({
		mvpMin: z.number().positive("MVP min must be positive"),
		mvpMax: z.number().positive("MVP max must be positive"),
		fullMin: z.number().positive("Full min must be positive"),
		fullMax: z.number().positive("Full max must be positive"),
		currency: z.enum(["USD", "GBP", "EUR"]),
		factors: z.array(nonEmptyString).min(2, "At least 2 pricing factors are required"),
	})
	.refine((data) => data.mvpMin < data.mvpMax, {
		message: "MVP min must be less than max",
		path: ["mvpMin"],
	})
	.refine((data) => data.fullMin < data.fullMax, {
		message: "Full min must be less than max",
		path: ["fullMin"],
	})
	.refine((data) => data.mvpMax <= data.fullMin, {
		message: "MVP max should not exceed full solution min",
		path: ["mvpMax"],
	});

export const faqItemSchema: z.ZodType<FaqItem> = z.object({
	question: nonEmptyString,
	answer: z.string().min(50, "Answer must be at least 50 characters"),
});

export const expertApproachSchema = z.object({
	summary: z.string().min(50, "Summary must be at least 50 characters"),
	realOutcomes: z.array(nonEmptyString).min(1, "At least 1 real outcome is required"),
	commonMistakes: z.array(nonEmptyString).min(1, "At least 1 common mistake is required"),
	decisionFrameworks: z.array(nonEmptyString).optional(),
	relatedProjectId: z.string().optional(),
});

export const seoMetaSchema: z.ZodType<SeoMeta> = z.object({
	title: z
		.string()
		.min(SEO_TITLE_MIN, `Title must be at least ${SEO_TITLE_MIN} characters`)
		.max(SEO_TITLE_MAX, `Title should be under ${SEO_TITLE_MAX} characters for SEO`),
	description: z
		.string()
		.min(SEO_DESCRIPTION_MIN, `Description must be at least ${SEO_DESCRIPTION_MIN} characters`)
		.max(
			SEO_DESCRIPTION_MAX,
			`Description should be under ${SEO_DESCRIPTION_MAX} characters for SEO`
		),
	keywords: z.array(nonEmptyString).min(3, "At least 3 keywords are required"),
	ogTitle: z.string().optional(),
	ogDescription: z.string().optional(),
});

// =============================================================================
// Main Page Schema
// =============================================================================

export const pseoPageSchema: z.ZodType<PseoPage> = z.object({
	// Identifiers
	slug: z
		.string()
		.min(1, "Slug is required")
		.regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
	technology: technologySchema,
	industry: industrySchema,

	// SEO
	seo: seoMetaSchema,

	// Unique Insights - Quality Gate: min 5
	uniqueInsights: z
		.array(z.string().min(50, "Each insight must be at least 50 characters"))
		.min(MIN_UNIQUE_INSIGHTS, `At least ${MIN_UNIQUE_INSIGHTS} unique insights are required`),

	// Industry Context
	industryRegulations: z.array(regulationSchema),
	commonPainPoints: z
		.array(painPointSchema)
		.min(MIN_PAIN_POINTS, `At least ${MIN_PAIN_POINTS} pain points are required`),

	// Technical Recommendations
	techStackRecommendations: z
		.array(recommendationSchema)
		.min(
			MIN_TECH_RECOMMENDATIONS,
			`At least ${MIN_TECH_RECOMMENDATIONS} tech recommendations are required`
		),

	// Long-form Content - Quality Gate: 150+ words each
	whyThisStack: minWords(MIN_LONG_FORM_WORDS),
	projectApproach: minWords(MIN_LONG_FORM_WORDS),

	// Expert Approach (optional - pages without this still render)
	expertApproach: expertApproachSchema.optional(),

	// Social Proof
	caseStudySnippet: caseStudySchema.optional(),

	// Practical Guidance
	budgetGuidance: budgetRangeSchema,
	faqs: z.array(faqItemSchema).min(MIN_FAQS, `At least ${MIN_FAQS} FAQs are required`),

	// Cross-linking
	relatedServices: z.array(nonEmptyString),
	relatedBlogPosts: z.array(nonEmptyString),
	relatedPages: z.array(nonEmptyString).optional(),

	// Metadata
	lastUpdated: z.date(),
	published: z.boolean(),
});

// =============================================================================
// Validation Functions
// =============================================================================

/**
 * Validation result type
 */
export type ValidationResult<T> =
	| { success: true; data: T }
	| { success: false; errors: ValidationError[] };

/**
 * Structured validation error
 */
export interface ValidationError {
	path: string;
	message: string;
	code?: string;
}

/**
 * Validate a complete pSEO page
 */
export function validatePseoPage(data: unknown): ValidationResult<PseoPage> {
	const result = pseoPageSchema.safeParse(data);

	if (result.success) {
		return { success: true, data: result.data };
	}

	return {
		success: false,
		errors: formatZodErrors(result.error),
	};
}

/**
 * Validate page data without requiring all fields (for drafts)
 */
export function validatePartialPage(data: unknown): ValidationResult<Partial<PseoPage>> {
	const partialSchema = z.object({
		slug: z
			.string()
			.min(1)
			.regex(/^[a-z0-9-]+$/)
			.optional(),
		technology: technologySchema.optional(),
		industry: industrySchema.optional(),
		seo: seoMetaSchema.optional(),
		uniqueInsights: z.array(z.string().min(50)).optional(),
		industryRegulations: z.array(regulationSchema).optional(),
		commonPainPoints: z.array(painPointSchema).optional(),
		techStackRecommendations: z.array(recommendationSchema).optional(),
		whyThisStack: z.string().optional(),
		projectApproach: z.string().optional(),
		caseStudySnippet: caseStudySchema.optional(),
		budgetGuidance: budgetRangeSchema.optional(),
		faqs: z.array(faqItemSchema).optional(),
		relatedServices: z.array(nonEmptyString).optional(),
		relatedBlogPosts: z.array(nonEmptyString).optional(),
		relatedPages: z.array(nonEmptyString).optional(),
		lastUpdated: z.date().optional(),
		published: z.boolean().optional(),
	});

	const result = partialSchema.safeParse(data);

	if (result.success) {
		return { success: true, data: result.data as Partial<PseoPage> };
	}

	return {
		success: false,
		errors: formatZodErrors(result.error),
	};
}

/**
 * Check if a page meets all quality gates
 */
export function checkQualityGates(page: PseoPage): QualityGateResult {
	const issues: QualityIssue[] = [];

	// Check unique insights count
	if (page.uniqueInsights.length < MIN_UNIQUE_INSIGHTS) {
		issues.push({
			gate: "uniqueInsights",
			required: MIN_UNIQUE_INSIGHTS,
			actual: page.uniqueInsights.length,
			message: `Need ${MIN_UNIQUE_INSIGHTS - page.uniqueInsights.length} more unique insights`,
		});
	}

	// Check long-form content word counts
	const whyThisStackWords = countWords(page.whyThisStack);
	if (whyThisStackWords < MIN_LONG_FORM_WORDS) {
		issues.push({
			gate: "whyThisStack",
			required: MIN_LONG_FORM_WORDS,
			actual: whyThisStackWords,
			message: `whyThisStack needs ${MIN_LONG_FORM_WORDS - whyThisStackWords} more words`,
		});
	}

	const projectApproachWords = countWords(page.projectApproach);
	if (projectApproachWords < MIN_LONG_FORM_WORDS) {
		issues.push({
			gate: "projectApproach",
			required: MIN_LONG_FORM_WORDS,
			actual: projectApproachWords,
			message: `projectApproach needs ${MIN_LONG_FORM_WORDS - projectApproachWords} more words`,
		});
	}

	// Check FAQs
	if (page.faqs.length < MIN_FAQS) {
		issues.push({
			gate: "faqs",
			required: MIN_FAQS,
			actual: page.faqs.length,
			message: `Need ${MIN_FAQS - page.faqs.length} more FAQs`,
		});
	}

	// Check pain points
	if (page.commonPainPoints.length < MIN_PAIN_POINTS) {
		issues.push({
			gate: "commonPainPoints",
			required: MIN_PAIN_POINTS,
			actual: page.commonPainPoints.length,
			message: `Need ${MIN_PAIN_POINTS - page.commonPainPoints.length} more pain points`,
		});
	}

	// Check tech recommendations
	if (page.techStackRecommendations.length < MIN_TECH_RECOMMENDATIONS) {
		issues.push({
			gate: "techStackRecommendations",
			required: MIN_TECH_RECOMMENDATIONS,
			actual: page.techStackRecommendations.length,
			message: `Need ${MIN_TECH_RECOMMENDATIONS - page.techStackRecommendations.length} more tech recommendations`,
		});
	}

	return {
		passed: issues.length === 0,
		issues,
	};
}

/**
 * Quality gate check result
 */
export interface QualityGateResult {
	passed: boolean;
	issues: QualityIssue[];
}

/**
 * Individual quality issue
 */
export interface QualityIssue {
	gate: string;
	required: number;
	actual: number;
	message: string;
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Count words in a string
 */
export function countWords(text: string): number {
	return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Format Zod errors into structured ValidationErrors
 */
export function formatZodErrors(error: z.ZodError): ValidationError[] {
	return error.issues.map((issue) => ({
		path: issue.path.map(String).join("."),
		message: issue.message,
		code: issue.code,
	}));
}

/**
 * Format Zod errors as a single string (for API responses)
 */
export function formatZodErrorString(error: z.ZodError): string {
	return error.issues
		.map((issue) => `${issue.path.map(String).join(".")}: ${issue.message}`)
		.join("; ");
}

/**
 * Validate slug format matches technology-industry pattern
 */
export function validateSlugFormat(slug: string): boolean {
	const parts = slug.split("-");
	if (parts.length < 2) return false;

	const tech = parts[0];
	const industry = parts.slice(1).join("-");

	return tech in TECHNOLOGY_LABELS && industry in INDUSTRY_LABELS;
}
