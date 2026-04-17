/**
 * Programmatic SEO Data Schema — Type-only barrel
 *
 * IMPORTANT (2026-04-16 performance fix):
 * This barrel previously re-exported ALL runtime data (pseoPages, migrationPages,
 * integrationPages, comparisonPages, industries, helper functions). That caused
 * chunk 9925 (~62 KB gzip) to ship on EVERY /services and /technologies route,
 * even routes that only needed a single helper or a label map.
 *
 * To restore chunk-splitting, runtime data/functions are no longer re-exported
 * from this index. Import them from their source module directly:
 *
 *   import { pseoPages, getPageBySlug }       from "@/data/pseo/pages";
 *   import { migrationPages }                 from "@/data/pseo/migrations";
 *   import { integrationPages }               from "@/data/pseo/integrations";
 *   import { comparisonPages }                from "@/data/pseo/comparisons";
 *   import { industries, getIndustryData }    from "@/data/pseo/industries";
 *
 * Lightweight constants (label maps, slug utilities) and Zod schemas remain
 * exported here because they are small and shared across most pSEO consumers.
 *
 * Types are always safe to re-export — TypeScript erases them at build time.
 */

// =============================================================================
// Types
// =============================================================================

export type {
	BudgetRange,
	CaseStudy,
	ExpertApproach,
	FaqItem,
	Industry,
	PainPoint,
	// Main page type
	PseoPage,
	PseoPageInput,
	PseoPageSummary,
	PseoPageUpdate,
	Recommendation,
	// Supporting types
	Regulation,
	SeoMeta,
	// Core enums/unions
	Technology,
	TechnologyCategory,
} from "./types";

// Lightweight constants + pure utilities (no page/industry data) — safe to re-export.
export {
	generateSlug,
	getClusterRelatedPages,
	getPageClusters,
	INDUSTRY_LABELS,
	parseSlug,
	TECHNOLOGY_CATEGORIES,
	TECHNOLOGY_LABELS,
} from "./types";

// =============================================================================
// Validation — schemas are tree-shakeable and shared widely; keep in barrel.
// =============================================================================

export {
	budgetRangeSchema,
	caseStudySchema,
	checkQualityGates,
	countWords,
	faqItemSchema,
	formatZodErrors,
	formatZodErrorString,
	industrySchema,
	MIN_FAQS,
	MIN_LONG_FORM_WORDS,
	MIN_PAIN_POINTS,
	MIN_TECH_RECOMMENDATIONS,
	MIN_UNIQUE_INSIGHTS,
	painPointSchema,
	pseoPageSchema,
	recommendationSchema,
	regulationSchema,
	SEO_DESCRIPTION_MAX,
	SEO_DESCRIPTION_MIN,
	SEO_TITLE_MAX,
	SEO_TITLE_MIN,
	seoMetaSchema,
	technologySchema,
	validatePartialPage,
	validatePseoPage,
	validateSlugFormat,
} from "./validation";

export type {
	QualityGateResult,
	QualityIssue,
	ValidationError,
	ValidationResult,
} from "./validation";

// =============================================================================
// Type-only re-exports for page data modules.
// Runtime values (pseoPages, industries, migrationPages, integrationPages,
// comparisonPages, and all their helper functions) MUST be imported from
// the specific file — see header comment above.
// =============================================================================

export type { IndustryData, TechStackRecommendation, TimelineExpectation } from "./industries";
export type { LegacyTech, MigrationPage, MigrationPattern, ModernTech } from "./migrations";
export type { IntegrationPage, IntegrationPattern, SaasProduct } from "./integrations";
export type {
	ComparisonCriterion,
	ComparisonPage,
	DecisionMatrix,
	TechOption,
} from "./comparisons";
