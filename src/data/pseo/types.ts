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

/**
 * Expert approach content based on real project experience.
 * Differentiates from generic content by including specific outcomes,
 * observed mistakes, and quantified results.
 */
export interface ExpertApproach {
	/** High-level summary of the expert approach (2-3 sentences) */
	summary: string;
	/** Quantified outcomes from real projects (e.g., "337x performance improvement") */
	realOutcomes: string[];
	/** Common mistakes observed in this tech+industry combination */
	commonMistakes: string[];
	/** Specific decision frameworks used */
	decisionFrameworks?: string[];
	/** Reference to related project (from projects.ts) */
	relatedProjectId?: string;
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

	/**
	 * Expert approach content based on Alex's real experience.
	 * Differentiates from generic content with specific outcomes, mistakes observed,
	 * and quantified results from actual projects.
	 * Optional - pages without this will still render.
	 */
	expertApproach?: ExpertApproach;

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
// Topic Clusters
// =============================================================================

/**
 * Topic cluster definitions for internal linking structure.
 * Hub pages link to all spokes, spokes link back to hub and laterally.
 */
export type TopicCluster =
	| "saas-at-scale"
	| "compliance-heavy"
	| "startup-stack"
	| "ai-integration"
	| "performance-engineering";

export interface TopicClusterDefinition {
	/** Cluster identifier */
	id: TopicCluster;
	/** Display name for the cluster */
	name: string;
	/** Short description */
	description: string;
	/** Hub page slug (if exists) or primary page */
	hubSlug: string;
	/** All page slugs in this cluster */
	spokeSlugs: string[];
}

/**
 * Topic cluster definitions
 */
export const TOPIC_CLUSTERS: TopicClusterDefinition[] = [
	{
		id: "saas-at-scale",
		name: "SaaS at Scale",
		description: "Building and scaling multi-tenant SaaS platforms",
		hubSlug: "nextjs-developer-for-saas",
		spokeSlugs: [
			"nextjs-developer-for-saas",
			"react-developer-for-saas",
			"postgresql-fintech-database",
			"fractional-cto-startups",
			"ai-integration-developer",
		],
	},
	{
		id: "compliance-heavy",
		name: "Compliance-Heavy Industries",
		description: "Healthcare, fintech, and regulated sectors",
		hubSlug: "python-developer-for-healthcare",
		spokeSlugs: [
			"python-developer-for-healthcare",
			"react-developer-for-fintech",
			"nextjs-developer-for-fintech",
			"nextjs-developer-for-healthcare",
			"react-developer-for-healthcare",
			"ai-integration-healthcare",
		],
	},
	{
		id: "startup-stack",
		name: "Startup Tech Stacks",
		description: "From MVP to Series A and beyond",
		hubSlug: "technical-advisor-startups",
		spokeSlugs: [
			"technical-advisor-startups",
			"fractional-cto-startups",
			"fractional-cto-investor-ready",
			"technical-due-diligence",
		],
	},
	{
		id: "ai-integration",
		name: "AI/ML Integration",
		description: "LLMs, RAG systems, and intelligent features",
		hubSlug: "ai-integration-developer",
		spokeSlugs: ["ai-integration-developer", "ai-integration-healthcare"],
	},
	{
		id: "performance-engineering",
		name: "Performance Engineering",
		description: "Speed, scale, and reliability optimization",
		hubSlug: "performance-optimization-consultant",
		spokeSlugs: [
			"performance-optimization-consultant",
			"legacy-migration-architect",
			"nodejs-developer-for-logistics",
		],
	},
];

/**
 * Get clusters a page belongs to
 */
export function getPageClusters(pageSlug: string): TopicClusterDefinition[] {
	return TOPIC_CLUSTERS.filter((cluster) => cluster.spokeSlugs.includes(pageSlug));
}

/**
 * Get related pages from clusters (excluding self)
 */
export function getClusterRelatedPages(pageSlug: string): string[] {
	const clusters = getPageClusters(pageSlug);
	const related = new Set<string>();

	for (const cluster of clusters) {
		for (const spoke of cluster.spokeSlugs) {
			if (spoke !== pageSlug) {
				related.add(spoke);
			}
		}
	}

	return Array.from(related);
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
