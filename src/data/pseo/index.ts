/**
 * Programmatic SEO Data Schema
 *
 * Export all types, schemas, and utilities for pSEO page management.
 */

// =============================================================================
// Types
// =============================================================================

export type {
	// Core enums/unions
	Technology,
	TechnologyCategory,
	Industry,
	// Supporting types
	Regulation,
	PainPoint,
	Recommendation,
	CaseStudy,
	BudgetRange,
	FaqItem,
	SeoMeta,
	ExpertApproach,
	// Main page type
	PseoPage,
	PseoPageInput,
	PseoPageUpdate,
	PseoPageSummary,
} from "./types";

// =============================================================================
// Constants
// =============================================================================

export {
	TECHNOLOGY_LABELS,
	TECHNOLOGY_CATEGORIES,
	INDUSTRY_LABELS,
	// Utility functions
	generateSlug,
	parseSlug,
} from "./types";

// =============================================================================
// Validation
// =============================================================================

export {
	// Quality gate constants
	MIN_UNIQUE_INSIGHTS,
	MIN_LONG_FORM_WORDS,
	MIN_FAQS,
	MIN_PAIN_POINTS,
	MIN_TECH_RECOMMENDATIONS,
	SEO_TITLE_MIN,
	SEO_TITLE_MAX,
	SEO_DESCRIPTION_MIN,
	SEO_DESCRIPTION_MAX,
	// Schemas
	technologySchema,
	industrySchema,
	regulationSchema,
	painPointSchema,
	recommendationSchema,
	caseStudySchema,
	budgetRangeSchema,
	faqItemSchema,
	seoMetaSchema,
	pseoPageSchema,
	// Validation functions
	validatePseoPage,
	validatePartialPage,
	checkQualityGates,
	validateSlugFormat,
	// Utilities
	countWords,
	formatZodErrors,
	formatZodErrorString,
} from "./validation";

export type {
	ValidationResult,
	ValidationError,
	QualityGateResult,
	QualityIssue,
} from "./validation";

// =============================================================================
// Industry Data
// =============================================================================

export {
	// Main industry database
	industries,
	// Helper functions
	getAllIndustryIds,
	getIndustryData,
	getIndustryRegulations,
	getIndustryPainPoints,
	getIndustryKeywords,
	searchIndustries,
} from "./industries";

export type { IndustryData, TechStackRecommendation, TimelineExpectation } from "./industries";

// =============================================================================
// Page Data
// =============================================================================

export {
	// Page data
	pseoPages,
	// Helper functions
	getPageBySlug,
	getPublishedPages,
	getAllPageSlugs,
	getPagesByTechnology,
	getPagesByIndustry,
	getRelatedPages,
} from "./pages";

// =============================================================================
// Migration Data (Legacy Tech → Modern Tech)
// =============================================================================

export {
	// Migration page data
	migrationPages,
	// Helper functions
	getAllMigrationSlugs,
	getMigrationPageBySlug,
	getMigrationPagesByIndustry,
	getAllMigrationPages,
} from "./migrations";

export type { LegacyTech, ModernTech, MigrationPattern, MigrationPage } from "./migrations";

// =============================================================================
// Integration Data (SaaS A ↔ SaaS B)
// =============================================================================

export {
	// Integration page data
	integrationPages,
	// Helper functions
	getAllIntegrationSlugs,
	getIntegrationPageBySlug,
	getIntegrationPagesByIndustry,
	getAllIntegrationPages,
} from "./integrations";

export type { SaasProduct, IntegrationPattern, IntegrationPage } from "./integrations";
