import { describe, expect, it } from "vitest";
import { z } from "zod";

import {
	filenameSchema,
	formatZodError,
	generatorSchema,
	processOptionsSchema,
	taskIdSchema,
	validateFile,
} from "@/lib/vectorizer/validation";

// =============================================================================
// taskIdSchema
// =============================================================================

describe("taskIdSchema", () => {
	it("accepts a valid UUID v4", () => {
		const result = taskIdSchema.safeParse("550e8400-e29b-41d4-a716-446655440000");
		expect(result.success).toBe(true);
	});

	it("rejects an invalid format", () => {
		const result = taskIdSchema.safeParse("not-a-uuid");
		expect(result.success).toBe(false);
	});

	it("rejects an empty string with required message", () => {
		const result = taskIdSchema.safeParse("");
		expect(result.success).toBe(false);
		if (!result.success) {
			const messages = result.error.issues.map((i) => i.message);
			expect(messages).toContain("Task ID is required");
		}
	});

	it("rejects a path traversal attempt", () => {
		const result = taskIdSchema.safeParse("../../etc/passwd");
		expect(result.success).toBe(false);
	});
});

// =============================================================================
// generatorSchema
// =============================================================================

describe("generatorSchema", () => {
	it('accepts "potrace"', () => {
		const result = generatorSchema.safeParse("potrace");
		expect(result.success).toBe(true);
	});

	it('accepts "vtracer"', () => {
		const result = generatorSchema.safeParse("vtracer");
		expect(result.success).toBe(true);
	});

	it('rejects "invalid"', () => {
		const result = generatorSchema.safeParse("invalid");
		expect(result.success).toBe(false);
	});
});

// =============================================================================
// processOptionsSchema
// =============================================================================

describe("processOptionsSchema", () => {
	it("accepts valid potrace options with defaults applied", () => {
		const result = processOptionsSchema.safeParse({
			generator: "potrace",
			preset: "logo",
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.remove_background).toBe(false);
			expect(result.data.calculate_quality).toBe(true);
		}
	});

	it("accepts valid vtracer options", () => {
		const result = processOptionsSchema.safeParse({
			generator: "vtracer",
			preset: "default",
		});
		expect(result.success).toBe(true);
	});

	it("rejects invalid preset for potrace generator", () => {
		const result = processOptionsSchema.safeParse({
			generator: "potrace",
			preset: "default",
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			const messages = result.error.issues.map((i) => i.message);
			expect(messages).toContain("Invalid preset for selected generator");
		}
	});

	it("rejects invalid preset for vtracer generator", () => {
		const result = processOptionsSchema.safeParse({
			generator: "vtracer",
			preset: "logo_geometric",
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			const messages = result.error.issues.map((i) => i.message);
			expect(messages).toContain("Invalid preset for selected generator");
		}
	});

	it("accepts all valid potrace presets", () => {
		const presets = [
			"logo_smooth",
			"logo",
			"logo_geometric",
			"color_logo",
			"photo",
			"illustration",
			"detailed",
			"smooth",
			"line_art",
			"highres",
			"icon",
		];
		for (const preset of presets) {
			const result = processOptionsSchema.safeParse({ generator: "potrace", preset });
			expect(result.success).toBe(true);
		}
	});

	it("accepts all valid vtracer presets", () => {
		const presets = [
			"default",
			"logo",
			"logo_smooth",
			"photo",
			"line_art",
			"detailed",
			"fast",
			"icon",
		];
		for (const preset of presets) {
			const result = processOptionsSchema.safeParse({ generator: "vtracer", preset });
			expect(result.success).toBe(true);
		}
	});

	it("accepts explicit boolean overrides", () => {
		const result = processOptionsSchema.safeParse({
			generator: "potrace",
			preset: "logo",
			remove_background: true,
			calculate_quality: false,
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.remove_background).toBe(true);
			expect(result.data.calculate_quality).toBe(false);
		}
	});
});

// =============================================================================
// filenameSchema
// =============================================================================

describe("filenameSchema", () => {
	it("accepts a normal filename", () => {
		const result = filenameSchema.safeParse("image.png");
		expect(result.success).toBe(true);
	});

	it('rejects a filename containing ".."', () => {
		const result = filenameSchema.safeParse("../image.png");
		expect(result.success).toBe(false);
		if (!result.success) {
			const messages = result.error.issues.map((i) => i.message);
			expect(messages).toContain("Path traversal not allowed");
		}
	});

	it('rejects a filename containing "/"', () => {
		const result = filenameSchema.safeParse("path/image.png");
		expect(result.success).toBe(false);
		if (!result.success) {
			const messages = result.error.issues.map((i) => i.message);
			expect(messages).toContain("Path separator not allowed");
		}
	});

	it('rejects a filename containing "\\"', () => {
		const result = filenameSchema.safeParse("path\\image.png");
		expect(result.success).toBe(false);
		if (!result.success) {
			const messages = result.error.issues.map((i) => i.message);
			expect(messages).toContain("Path separator not allowed");
		}
	});

	it('rejects a filename containing null byte "\\0"', () => {
		const result = filenameSchema.safeParse("image\0.png");
		expect(result.success).toBe(false);
		if (!result.success) {
			const messages = result.error.issues.map((i) => i.message);
			expect(messages).toContain("Invalid characters in filename");
		}
	});

	it('rejects a filename containing newline "\\n"', () => {
		const result = filenameSchema.safeParse("image\n.png");
		expect(result.success).toBe(false);
		if (!result.success) {
			const messages = result.error.issues.map((i) => i.message);
			expect(messages).toContain("Invalid characters in filename");
		}
	});

	it("rejects a filename exceeding 255 characters", () => {
		const longName = "a".repeat(256);
		const result = filenameSchema.safeParse(longName);
		expect(result.success).toBe(false);
		if (!result.success) {
			const messages = result.error.issues.map((i) => i.message);
			expect(messages).toContain("Filename too long");
		}
	});

	it("rejects an empty string", () => {
		const result = filenameSchema.safeParse("");
		expect(result.success).toBe(false);
		if (!result.success) {
			const messages = result.error.issues.map((i) => i.message);
			expect(messages).toContain("Filename is required");
		}
	});

	it("accepts a filename at exactly 255 characters", () => {
		const maxName = "a".repeat(251) + ".png";
		const result = filenameSchema.safeParse(maxName);
		expect(result.success).toBe(true);
	});
});

// =============================================================================
// validateFile
// =============================================================================

describe("validateFile", () => {
	it("returns valid for a supported image file", () => {
		const file = new File(["data"], "test.png", { type: "image/png" });
		const result = validateFile(file);
		expect(result).toEqual({ valid: true });
	});

	it("returns error for an unsupported file type", () => {
		const file = new File(["data"], "test.txt", { type: "text/plain" });
		const result = validateFile(file);
		expect(result.valid).toBe(false);
		if (!result.valid) {
			expect(result.error).toContain("Invalid file type");
		}
	});

	it("returns error for an oversized file", () => {
		const file = new File(["data"], "big.png", { type: "image/png" });
		Object.defineProperty(file, "size", { value: 25 * 1024 * 1024 });
		const result = validateFile(file);
		expect(result.valid).toBe(false);
		if (!result.valid) {
			expect(result.error).toContain("File too large");
		}
	});

	it("returns error for null file", () => {
		const result = validateFile(null as unknown as File);
		expect(result.valid).toBe(false);
		if (!result.valid) {
			expect(result.error).toBe("No file provided");
		}
	});

	it("returns error for undefined file", () => {
		const result = validateFile(undefined as unknown as File);
		expect(result.valid).toBe(false);
		if (!result.valid) {
			expect(result.error).toBe("No file provided");
		}
	});

	it("accepts all allowed image types", () => {
		const types = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif", "image/bmp"];
		for (const type of types) {
			const file = new File(["data"], "test", { type });
			expect(validateFile(file)).toEqual({ valid: true });
		}
	});

	it("accepts a file at exactly the size limit", () => {
		const file = new File(["data"], "exact.png", { type: "image/png" });
		Object.defineProperty(file, "size", { value: 20 * 1024 * 1024 });
		const result = validateFile(file);
		expect(result).toEqual({ valid: true });
	});
});

// =============================================================================
// formatZodError
// =============================================================================

describe("formatZodError", () => {
	it("formats a single field error", () => {
		const schema = z.object({ name: z.string().min(1, "Name required") });
		const result = schema.safeParse({ name: "" });
		if (!result.success) {
			const formatted = formatZodError(result.error);
			expect(formatted).toBe("name: Name required");
		}
	});

	it("formats multiple field errors joined by comma-space", () => {
		const schema = z.object({
			name: z.string().min(1, "Name required"),
			age: z.number().min(0, "Age must be positive"),
		});
		const result = schema.safeParse({ name: "", age: -1 });
		if (!result.success) {
			const formatted = formatZodError(result.error);
			expect(formatted).toContain("name: Name required");
			expect(formatted).toContain("age: Age must be positive");
			expect(formatted).toContain(", ");
		}
	});
});
