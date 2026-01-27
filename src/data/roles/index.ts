/**
 * Role-Based Pages Data Schema
 *
 * Export all types, constants, and utilities for role-based page management.
 */

// =============================================================================
// Types
// =============================================================================

export type {
	// Core types
	Role,
	ServiceTier,
	// Supporting types
	RolePainPoint,
	RoleFaqItem,
	RoleSeoMeta,
	// Main page type
	RolePage,
	RolePageInput,
	RolePageUpdate,
	RolePageSummary,
} from "./types";

// =============================================================================
// Constants
// =============================================================================

export {
	// Role labels
	ROLE_TITLES,
	ROLE_LABELS,
	// Service tier labels
	SERVICE_TIER_LABELS,
	SERVICE_TIER_DESCRIPTIONS,
} from "./types";

// =============================================================================
// Page Data
// =============================================================================

export {
	// Page data
	rolePages,
	// Helper functions
	getPublishedRolePages,
	getRolePageBySlug,
	getAllRoleSlugs,
	getPublishedRoleSlugs,
} from "./pages";
