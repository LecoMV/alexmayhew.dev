/**
 * Programmatic SEO Data Schema
 *
 * Export all types, schemas, and utilities for pSEO page management.
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

// =============================================================================
// Constants
// =============================================================================

export {
	// Utility functions
	generateSlug,
	INDUSTRY_LABELS,
	parseSlug,
	TECHNOLOGY_CATEGORIES,
	TECHNOLOGY_LABELS,
} from "./types";

// =============================================================================
// Validation
// =============================================================================

export {
	budgetRangeSchema,
	caseStudySchema,
	checkQualityGates,
	// Utilities
	countWords,
	faqItemSchema,
	formatZodErrors,
	formatZodErrorString,
	industrySchema,
	MIN_FAQS,
	MIN_LONG_FORM_WORDS,
	MIN_PAIN_POINTS,
	MIN_TECH_RECOMMENDATIONS,
	// Quality gate constants
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
	// Schemas
	technologySchema,
	validatePartialPage,
	// Validation functions
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
// Industry Data
// =============================================================================

export {
	// Helper functions
	getAllIndustryIds,
	getIndustryData,
	getIndustryKeywords,
	getIndustryPainPoints,
	getIndustryRegulations,
	// Main industry database
	industries,
	searchIndustries,
} from "./industries";

export type { IndustryData, TechStackRecommendation, TimelineExpectation } from "./industries";

// =============================================================================
// Page Data
// =============================================================================

export {
	getAllPageSlugs,
	// Helper functions
	getPageBySlug,
	getPagesByIndustry,
	getPagesByTechnology,
	getPublishedPages,
	getRelatedPages,
	// Page data
	pseoPages,
} from "./pages";

// =============================================================================
// Migration Data (Legacy Tech → Modern Tech)
// =============================================================================

export {
	getAllMigrationPages,
	// Helper functions
	getAllMigrationSlugs,
	getMigrationPageBySlug,
	getMigrationPagesByIndustry,
	// Migration page data
	migrationPages,
} from "./migrations";

export type { LegacyTech, MigrationPage, MigrationPattern, ModernTech } from "./migrations";

// =============================================================================
// Integration Data (SaaS A ↔ SaaS B)
// =============================================================================

export {
	getAllIntegrationPages,
	// Helper functions
	getAllIntegrationSlugs,
	getIntegrationPageBySlug,
	getIntegrationPagesByIndustry,
	// Integration page data
	integrationPages,
} from "./integrations";

export type { IntegrationPage, IntegrationPattern, SaasProduct } from "./integrations";

// =============================================================================
// Comparison Data (Tech A vs Tech B)
// =============================================================================

export {
	// Comparison page data
	comparisonPages,
	getAllComparisonPages,
	// Helper functions
	getAllComparisonSlugs,
	getComparisonPageBySlug,
	getComparisonPagesByIndustry,
} from "./comparisons";

export type {
	ComparisonCriterion,
	ComparisonPage,
	DecisionMatrix,
	TechOption,
} from "./comparisons";
