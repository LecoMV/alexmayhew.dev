/**
 * TraceForge Input Validation Schemas
 * Using Zod for enterprise-grade validation
 */

import { z } from "zod";
import { POTRACE_PRESETS, VTRACER_PRESETS, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from "./config";

/**
 * UUID v4 regex pattern for task ID validation
 * Prevents path traversal and injection attacks
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Task ID validation schema
 * Ensures taskId is a valid UUID v4 format
 */
export const taskIdSchema = z
	.string()
	.min(1, "Task ID is required")
	.regex(UUID_REGEX, "Invalid task ID format");

/**
 * Generator validation schema
 */
export const generatorSchema = z.enum(["potrace", "vtracer"]);

/**
 * Process options validation schema
 * Validates generator and preset combinations
 */
export const processOptionsSchema = z
	.object({
		generator: generatorSchema.default("potrace"),
		preset: z.string().min(1),
		remove_background: z.boolean().default(false),
		calculate_quality: z.boolean().default(true),
	})
	.refine(
		(data) => {
			const validPresets = data.generator === "potrace" ? POTRACE_PRESETS : VTRACER_PRESETS;
			return (validPresets as readonly string[]).includes(data.preset);
		},
		{
			message: "Invalid preset for selected generator",
			path: ["preset"],
		}
	);

/**
 * Filename validation schema
 * Prevents path traversal and header injection
 */
export const filenameSchema = z
	.string()
	.min(1, "Filename is required")
	.max(255, "Filename too long")
	.refine((val) => !val.includes(".."), "Path traversal not allowed")
	.refine((val) => !val.includes("/"), "Path separator not allowed")
	.refine((val) => !val.includes("\\"), "Path separator not allowed")
	.refine((val) => !val.includes("\r"), "Invalid characters in filename")
	.refine((val) => !val.includes("\n"), "Invalid characters in filename")
	.refine((val) => !val.includes("\0"), "Invalid characters in filename");

/**
 * File validation for uploads
 */
export function validateFile(file: File): { valid: true } | { valid: false; error: string } {
	if (!file) {
		return { valid: false, error: "No file provided" };
	}

	if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
		return {
			valid: false,
			error: `Invalid file type. Allowed: ${ALLOWED_IMAGE_TYPES.map((t) => t.split("/")[1].toUpperCase()).join(", ")}`,
		};
	}

	if (file.size > MAX_FILE_SIZE) {
		return {
			valid: false,
			error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
		};
	}

	return { valid: true };
}

/**
 * Type exports for use in components
 */
export type TaskId = z.infer<typeof taskIdSchema>;
export type ProcessOptions = z.infer<typeof processOptionsSchema>;

/**
 * Validation result type helper
 */
export type ValidationResult<T> = { success: true; data: T } | { success: false; error: string };

/**
 * Helper to format Zod errors for API responses
 */
export function formatZodError(error: z.ZodError<unknown>): string {
	return error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
}
