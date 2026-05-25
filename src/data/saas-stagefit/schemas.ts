import { z } from "zod";

export const personaSchema = z.enum(["founder", "cto", "other"]);
export const customerTypeSchema = z.enum(["b2b-enterprise", "b2b-smb", "b2c", "marketplace"]);
export const revenueStageSchema = z.union([
	z.literal(0),
	z.literal(1),
	z.literal(2),
	z.literal(3),
	z.literal(4),
	z.literal(5),
]);
export const triggerEventSchema = z.enum([
	"series-a",
	"upmarket",
	"10x-users",
	"hire-10",
	"due-diligence",
	"none",
]);
export const complianceSchema = z.enum(["soc2", "hipaa", "pci", "gdpr", "other", "none"]);
export const teamSizeSchema = z.union([
	z.literal(0),
	z.literal(1),
	z.literal(2),
	z.literal(3),
	z.literal(4),
]);
export const techScoreSchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]);
export const techDimensionSchema = z.enum([
	"architecture",
	"database",
	"cicd",
	"observability",
	"security",
	"team",
	"performance",
	"data",
]);

export const stageFitInputSchema = z.object({
	persona: personaSchema,
	customerType: customerTypeSchema,
	revenueStage: revenueStageSchema,
	triggerEvent: triggerEventSchema,
	compliance: z.array(complianceSchema).min(1),
	teamSize: teamSizeSchema,
	techAnswers: z.record(techDimensionSchema, techScoreSchema),
});

export const zoneSchema = z.enum(["over-built", "stage-optimized", "under-built"]);
export const severitySchema = z.enum(["mild", "acute", "today", "tomorrow"]).nullable();
export const velocityDragBandSchema = z.enum(["low", "moderate", "high", "critical"]);
export const ctaBucketSchema = z.enum([
	"architecture-review",
	"advisory-retainer",
	"strategic-implementation",
	"technical-due-diligence",
	"fractional-cto",
	"newsletter-only",
]);

export const stageFitResultSchema = z.object({
	zone: zoneSchema,
	severity: severitySchema,
	delta: z.number(),
	velocityDragBand: velocityDragBandSchema,
	reversibilityRiskCount: z.number().int().nonnegative(),
	topMisalignedDimensions: z.array(techDimensionSchema),
	ctaBucket: ctaBucketSchema,
});
