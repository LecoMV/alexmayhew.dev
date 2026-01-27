/**
 * Role-Based Pages Data Schema - Type Definitions
 *
 * Defines the data structures for dynamically generated
 * role-based landing pages (CTO, Technical Founder, etc.)
 */

// =============================================================================
// Role Types
// =============================================================================

/**
 * Supported roles for role-based pages.
 * Each role generates a unique landing page at /for/[role].
 */
export type Role = "cto" | "technical-founder" | "seed-founder" | "vp-engineering";

/**
 * Human-readable role titles for display
 */
export const ROLE_TITLES: Record<Role, string> = {
	cto: "Chief Technology Officer",
	"technical-founder": "Technical Founder",
	"seed-founder": "Seed-Stage Founder",
	"vp-engineering": "VP of Engineering",
};

/**
 * Short role labels for navigation
 */
export const ROLE_LABELS: Record<Role, string> = {
	cto: "CTO",
	"technical-founder": "Technical Founder",
	"seed-founder": "Seed Founder",
	"vp-engineering": "VP Engineering",
};

// =============================================================================
// Supporting Types
// =============================================================================

/**
 * Role-specific pain point with solution
 */
export interface RolePainPoint {
	/** Brief title of the pain point */
	title: string;
	/** Detailed description of the problem */
	description: string;
	/** Why this matters to someone in this role */
	whyMatters: string;
	/** How I solve this problem */
	solution: string;
}

/**
 * Service tier that's ideal for this role
 */
export type ServiceTier =
	| "advisory-retainer"
	| "strategic-implementation"
	| "fractional-cto"
	| "project-based"
	| "technical-audit";

/**
 * Human-readable tier labels
 */
export const SERVICE_TIER_LABELS: Record<ServiceTier, string> = {
	"advisory-retainer": "Advisory Retainer",
	"strategic-implementation": "Strategic Implementation",
	"fractional-cto": "Fractional CTO",
	"project-based": "Project-Based Engagement",
	"technical-audit": "Technical Audit",
};

/**
 * Service tier descriptions
 */
export const SERVICE_TIER_DESCRIPTIONS: Record<ServiceTier, string> = {
	"advisory-retainer":
		"Ongoing strategic guidance with weekly calls and async access for architecture decisions, vendor evaluations, and team mentorship.",
	"strategic-implementation":
		"Hands-on development of critical systems combined with knowledge transfer to your team. Perfect for high-stakes projects.",
	"fractional-cto":
		"Part-time technical leadership for companies without a full-time CTO. Strategy, hiring, architecture, and vendor management.",
	"project-based":
		"Fixed-scope engagements for specific deliverables: MVPs, migrations, performance optimizations, or security audits.",
	"technical-audit":
		"Deep-dive analysis of your codebase, architecture, and infrastructure with actionable recommendations.",
};

/**
 * FAQ item for the page
 */
export interface RoleFaqItem {
	question: string;
	answer: string;
}

/**
 * SEO metadata for the page
 */
export interface RoleSeoMeta {
	/** Page title (50-70 chars recommended) */
	title: string;
	/** Meta description (100-170 chars recommended) */
	description: string;
	/** Target keywords */
	keywords: string[];
	/** Open Graph title (optional) */
	ogTitle?: string;
	/** Open Graph description (optional) */
	ogDescription?: string;
}

// =============================================================================
// Main Page Type
// =============================================================================

/**
 * Complete role-based page data structure.
 * Each page targets a specific executive/founder role.
 */
export interface RolePage {
	// ---------------------------------------------------------------------------
	// Identifiers
	// ---------------------------------------------------------------------------

	/** URL slug (e.g., "cto", "technical-founder") */
	slug: string;

	/** Role identifier */
	role: Role;

	/** Full role title (e.g., "Chief Technology Officer") */
	roleTitle: string;

	// ---------------------------------------------------------------------------
	// Hero Content
	// ---------------------------------------------------------------------------

	/** Main headline */
	headline: string;

	/** Supporting subheadline */
	subheadline: string;

	// ---------------------------------------------------------------------------
	// Pain Points (4-5 per role)
	// ---------------------------------------------------------------------------

	/** Role-specific challenges I solve */
	painPoints: RolePainPoint[];

	// ---------------------------------------------------------------------------
	// Service Alignment
	// ---------------------------------------------------------------------------

	/** Service tiers most relevant for this role */
	idealTiers: ServiceTier[];

	// ---------------------------------------------------------------------------
	// Social Proof
	// ---------------------------------------------------------------------------

	/** Proof metrics specific to this role's concerns */
	proofMetrics: string[];

	// ---------------------------------------------------------------------------
	// Long-form Content
	// ---------------------------------------------------------------------------

	/**
	 * How I position myself for this role.
	 * Must be 200+ words of substantive content.
	 */
	positioning: string;

	/**
	 * What to expect from working together.
	 * Timeline, communication, deliverables.
	 */
	timelineExpectations: string;

	// ---------------------------------------------------------------------------
	// Cross-linking
	// ---------------------------------------------------------------------------

	/** Related service page slugs */
	relatedServices: string[];

	// ---------------------------------------------------------------------------
	// FAQs (4+ per role)
	// ---------------------------------------------------------------------------

	/** Frequently asked questions for this role */
	faqs: RoleFaqItem[];

	// ---------------------------------------------------------------------------
	// SEO
	// ---------------------------------------------------------------------------

	/** SEO metadata */
	seo: RoleSeoMeta;

	// ---------------------------------------------------------------------------
	// Metadata
	// ---------------------------------------------------------------------------

	/** Whether this page is ready for publishing */
	published: boolean;

	/** When this page was last updated (optional) */
	lastUpdated?: Date;
}

// =============================================================================
// Utility Types
// =============================================================================

/**
 * Page data without computed fields (for content authoring)
 */
export type RolePageInput = Omit<RolePage, "slug" | "lastUpdated"> & {
	lastUpdated?: Date;
};

/**
 * Partial page data for updates
 */
export type RolePageUpdate = Partial<RolePageInput>;

/**
 * Page summary for listing
 */
export interface RolePageSummary {
	slug: string;
	role: Role;
	roleTitle: string;
	headline: string;
	published: boolean;
}
