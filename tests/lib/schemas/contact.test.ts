import { describe, it, expect } from "vitest";
import { contactFormSchema, type ContactFormValues } from "@/lib/schemas/contact";

describe("contactFormSchema", () => {
	const validData: ContactFormValues = {
		name: "John Doe",
		email: "john@example.com",
		projectType: "web-app",
		budget: "10k-25k",
		message: "I need a website for my business. Please contact me soon.",
	};

	describe("name field", () => {
		it("should accept valid name", () => {
			const result = contactFormSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it("should reject name under 2 characters", () => {
			const result = contactFormSchema.safeParse({ ...validData, name: "A" });
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toContain("at least 2 characters");
			}
		});

		it("should reject name over 100 characters", () => {
			const result = contactFormSchema.safeParse({
				...validData,
				name: "a".repeat(101),
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toContain("too long");
			}
		});
	});

	describe("email field", () => {
		it("should accept valid email", () => {
			const result = contactFormSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it("should reject invalid email format", () => {
			const result = contactFormSchema.safeParse({
				...validData,
				email: "not-an-email",
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toContain("valid email");
			}
		});

		it("should reject email over 254 characters", () => {
			const longEmail = "a".repeat(250) + "@test.com";
			const result = contactFormSchema.safeParse({
				...validData,
				email: longEmail,
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toContain("too long");
			}
		});
	});

	describe("projectType field", () => {
		const validTypes = ["web-app", "saas", "ecommerce", "consulting", "other"];

		validTypes.forEach((type) => {
			it(`should accept "${type}"`, () => {
				const result = contactFormSchema.safeParse({
					...validData,
					projectType: type,
				});
				expect(result.success).toBe(true);
			});
		});

		it("should reject invalid project type", () => {
			const result = contactFormSchema.safeParse({
				...validData,
				projectType: "invalid-type",
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				// Zod enum validation returns either custom message or "Invalid option"
				// We expect our custom message from the errorMap
				const message = result.error.issues[0].message;
				expect(message).toBe("Please select a valid project type");
			}
		});
	});

	describe("budget field", () => {
		const validBudgets = ["5k-10k", "10k-25k", "25k-50k", "50k+"];

		validBudgets.forEach((budget) => {
			it(`should accept "${budget}"`, () => {
				const result = contactFormSchema.safeParse({ ...validData, budget });
				expect(result.success).toBe(true);
			});
		});

		it("should reject invalid budget", () => {
			const result = contactFormSchema.safeParse({
				...validData,
				budget: "1k",
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				// Zod enum validation returns either custom message or "Invalid option"
				// We expect our custom message from the errorMap
				const message = result.error.issues[0].message;
				expect(message).toBe("Please select a valid budget range");
			}
		});
	});

	describe("message field", () => {
		it("should accept valid message", () => {
			const result = contactFormSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it("should reject message under 10 characters", () => {
			const result = contactFormSchema.safeParse({ ...validData, message: "Hi" });
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toContain("at least 10 characters");
			}
		});

		it("should reject message over 5000 characters", () => {
			const result = contactFormSchema.safeParse({
				...validData,
				message: "a".repeat(5001),
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toContain("too long");
			}
		});
	});

	describe("turnstileToken field", () => {
		it("should be optional", () => {
			const result = contactFormSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it("should accept token when provided", () => {
			const result = contactFormSchema.safeParse({
				...validData,
				turnstileToken: "abc123",
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.turnstileToken).toBe("abc123");
			}
		});
	});

	describe("full validation", () => {
		it("should return all field errors when multiple fields are invalid", () => {
			const result = contactFormSchema.safeParse({
				name: "A",
				email: "invalid",
				projectType: "bad",
				budget: "1k",
				message: "Hi",
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				const fieldNames = result.error.issues.map((i) => i.path[0]);
				expect(fieldNames).toContain("name");
				expect(fieldNames).toContain("email");
				expect(fieldNames).toContain("projectType");
				expect(fieldNames).toContain("budget");
				expect(fieldNames).toContain("message");
			}
		});
	});
});
