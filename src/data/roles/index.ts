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
	RoleFaqItem,
	// Main page type
	RolePage,
	RolePageInput,
	RolePageSummary,
	RolePageUpdate,
	// Supporting types
	RolePainPoint,
	RoleSeoMeta,
	ServiceTier,
} from "./types";

// =============================================================================
// Constants
// =============================================================================

export {
	ROLE_LABELS,
	// Role labels
	ROLE_TITLES,
	SERVICE_TIER_DESCRIPTIONS,
	// Service tier labels
	SERVICE_TIER_LABELS,
} from "./types";

// =============================================================================
// Page Data
// =============================================================================

export {
	getAllRoleSlugs,
	// Helper functions
	getPublishedRolePages,
	getPublishedRoleSlugs,
	getRolePageBySlug,
	// Page data
	rolePages,
} from "./pages";
