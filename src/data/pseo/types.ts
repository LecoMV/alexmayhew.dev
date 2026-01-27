/**
 * Programmatic SEO Data Schema - Type Definitions
 *
 * Defines the data structures for dynamically generated
 * technology + industry landing pages.
 */

// =============================================================================
// Technology Types
// =============================================================================

/**
 * Supported technology stacks for pSEO pages.
 * Each technology generates pages for all industries.
 */
export type Technology =
	| "nextjs"
	| "react"
	| "nodejs"
	| "python"
	| "typescript"
	| "postgresql"
	| "prisma"
	| "tailwindcss"
	| "cloudflare"
	| "vercel"
	| "stripe"
	| "auth0"
	| "supabase";

/**
 * Human-readable technology names for display
 */
export const TECHNOLOGY_LABELS: Record<Technology, string> = {
	nextjs: "Next.js",
	react: "React",
	nodejs: "Node.js",
	python: "Python",
	typescript: "TypeScript",
	postgresql: "PostgreSQL",
	prisma: "Prisma ORM",
	tailwindcss: "Tailwind CSS",
	cloudflare: "Cloudflare",
	vercel: "Vercel",
	stripe: "Stripe",
	auth0: "Auth0",
	supabase: "Supabase",
};

/**
 * Technology categories for grouping
 */
export type TechnologyCategory =
	| "frontend"
	| "backend"
	| "database"
	| "deployment"
	| "payments"
	| "auth";

export const TECHNOLOGY_CATEGORIES: Record<Technology, TechnologyCategory> = {
	nextjs: "frontend",
	react: "frontend",
	tailwindcss: "frontend",
	nodejs: "backend",
	python: "backend",
	typescript: "backend",
	postgresql: "database",
	prisma: "database",
	supabase: "database",
	cloudflare: "deployment",
	vercel: "deployment",
	stripe: "payments",
	auth0: "auth",
};

// =============================================================================
// Industry Types
// =============================================================================

/**
 * Target industries for pSEO pages.
 * Each industry has unique regulations, pain points, and requirements.
 */
export type Industry =
	| "healthcare"
	| "fintech"
	| "ecommerce"
	| "saas"
	| "real-estate"
	| "legal"
	| "education"
	| "logistics"
	| "hospitality"
	| "manufacturing";

/**
 * Human-readable industry names for display
 */
export const INDUSTRY_LABELS: Record<Industry, string> = {
	healthcare: "Healthcare",
	fintech: "Fintech",
	ecommerce: "E-commerce",
	saas: "SaaS",
	"real-estate": "Real Estate",
	legal: "Legal",
	education: "Education",
	logistics: "Logistics",
	hospitality: "Hospitality",
	manufacturing: "Manufacturing",
};

// =============================================================================
// Supporting Types
// =============================================================================

/**
 * Industry-specific regulation that affects technical implementation
 */
export interface Regulation {
	/** Short identifier (e.g., "HIPAA", "PCI-DSS", "GDPR") */
	name: string;
	/** Full regulatory name */
	fullName: string;
	/** How this regulation impacts the tech stack choice */
	technicalImplications: string;
	/** Key compliance requirements */
	requirements: string[];
}

/**
 * Common pain point in the industry
 */
export interface PainPoint {
	/** Brief title of the pain point */
	title: string;
	/** Detailed description of the problem */
	description: string;
	/** How the technology addresses this pain point */
	solution: string;
}

/**
 * Technology stack recommendation
 */
export interface Recommendation {
	/** Component of the stack (e.g., "Database", "Auth", "Hosting") */
	component: string;
	/** Recommended technology for this component */
	technology: string;
	/** Why this is recommended for this industry + stack combination */
	rationale: string;
}

/**
 * Case study snippet for social proof
 */
export interface CaseStudy {
	/** Client/project name (can be anonymized) */
	clientName: string;
	/** Industry context */
	industry: Industry;
	/** Problem statement */
	challenge: string;
	/** Solution overview */
	solution: string;
	/** Measurable results */
	results: string[];
	/** Technologies used */
	techUsed: Technology[];
}

/**
 * Budget range for project guidance
 */
export interface BudgetRange {
	/** Minimum budget for MVP */
	mvpMin: number;
	/** Maximum budget for MVP */
	mvpMax: number;
	/** Minimum budget for full-featured solution */
	fullMin: number;
	/** Maximum budget for full-featured solution */
	fullMax: number;
	/** Currency code */
	currency: "USD" | "GBP" | "EUR";
	/** Factors that affect pricing */
	factors: string[];
}

/**
 * FAQ item for the page
 */
export interface FaqItem {
	question: string;
	answer: string;
}

// =============================================================================
// SEO Types
// =============================================================================

/**
 * SEO metadata for the page
 */
export interface SeoMeta {
	/** Page title (50-60 chars recommended) */
	title: string;
	/** Meta description (150-160 chars recommended) */
	description: string;
	/** Target keywords */
	keywords: string[];
	/** Open Graph title */
	ogTitle?: string;
	/** Open Graph description */
	ogDescription?: string;
}

// =============================================================================
// Main Page Type
// =============================================================================

/**
 * Complete pSEO page data structure.
 * Each page represents a unique Technology + Industry combination.
 */
export interface PseoPage {
	// ---------------------------------------------------------------------------
	// Identifiers
	// ---------------------------------------------------------------------------

	/** URL slug (e.g., "nextjs-healthcare", "react-fintech") */
	slug: string;

	/** Primary technology for this page */
	technology: Technology;

	/** Target industry for this page */
	industry: Industry;

	// ---------------------------------------------------------------------------
	// SEO
	// ---------------------------------------------------------------------------

	/** SEO metadata */
	seo: SeoMeta;

	// ---------------------------------------------------------------------------
	// Content - Unique Insights (REQUIRED: min 5)
	// ---------------------------------------------------------------------------

	/**
	 * Unique, non-generic insights specific to this tech + industry combination.
	 * These must NOT be applicable to other combinations.
	 * Minimum 5 required for quality gate.
	 */
	uniqueInsights: string[];

	// ---------------------------------------------------------------------------
	// Content - Industry Context
	// ---------------------------------------------------------------------------

	/** Regulations affecting this industry */
	industryRegulations: Regulation[];

	/** Common pain points in this industry */
	commonPainPoints: PainPoint[];

	// ---------------------------------------------------------------------------
	// Content - Technical Recommendations
	// ---------------------------------------------------------------------------

	/** Recommended tech stack additions */
	techStackRecommendations: Recommendation[];

	// ---------------------------------------------------------------------------
	// Content - Long-form Sections (150+ words each)
	// ---------------------------------------------------------------------------

	/**
	 * Explanation of why this tech stack is ideal for this industry.
	 * Must be 150+ words of substantive, unique content.
	 */
	whyThisStack: string;

	/**
	 * Description of project approach for this industry.
	 * Must be 150+ words of substantive, unique content.
	 */
	projectApproach: string;

	// ---------------------------------------------------------------------------
	// Content - Social Proof
	// ---------------------------------------------------------------------------

	/** Optional case study snippet */
	caseStudySnippet?: CaseStudy;

	// ---------------------------------------------------------------------------
	// Content - Practical Guidance
	// ---------------------------------------------------------------------------

	/** Budget guidance for this type of project */
	budgetGuidance: BudgetRange;

	/** Frequently asked questions */
	faqs: FaqItem[];

	// ---------------------------------------------------------------------------
	// Cross-linking
	// ---------------------------------------------------------------------------

	/** Related service page slugs */
	relatedServices: string[];

	/** Related blog post slugs */
	relatedBlogPosts: string[];

	/** Related pSEO page slugs */
	relatedPages?: string[];

	// ---------------------------------------------------------------------------
	// Metadata
	// ---------------------------------------------------------------------------

	/** When this page was last updated (optional, defaults to build time) */
	lastUpdated?: Date;

	/** Whether this page is ready for publishing */
	published: boolean;
}

// =============================================================================
// Utility Types
// =============================================================================

/**
 * Page data without computed fields (for content authoring)
 */
export type PseoPageInput = Omit<PseoPage, "slug" | "lastUpdated"> & {
	lastUpdated?: Date;
};

/**
 * Partial page data for updates
 */
export type PseoPageUpdate = Partial<PseoPageInput>;

/**
 * Page summary for listing/search
 */
export interface PseoPageSummary {
	slug: string;
	technology: Technology;
	industry: Industry;
	title: string;
	description: string;
	published: boolean;
	lastUpdated: Date;
}

/**
 * Generate a slug from technology and industry
 */
export function generateSlug(technology: Technology, industry: Industry): string {
	return `${technology}-${industry}`;
}

/**
 * Parse a slug into technology and industry
 */
export function parseSlug(slug: string): { technology: Technology; industry: Industry } | null {
	const parts = slug.split("-");
	if (parts.length < 2) return null;

	// Handle multi-word industries like "real-estate"
	const tech = parts[0] as Technology;
	const industry = parts.slice(1).join("-") as Industry;

	if (!(tech in TECHNOLOGY_LABELS)) return null;
	if (!(industry in INDUSTRY_LABELS)) return null;

	return { technology: tech, industry };
}
