import { describe, expect, it } from "vitest";

import { contactFormSchema, type ContactFormValues } from "@/lib/schemas/contact";

describe("contactFormSchema", () => {
	// After CRO change: only email + message are required.
	const minimalValid = {
		email: "john@example.com",
		message: "I need a website for my business. Please contact me soon.",
	};

	const fullValid: ContactFormValues = {
		name: "John Doe",
		email: "john@example.com",
		projectType: "web-app",
		budget: "10k-25k",
		message: "I need a website for my business. Please contact me soon.",
		referralSource: "google",
	};

	describe("required surface", () => {
		it("should accept minimal payload with only email + message", () => {
			const result = contactFormSchema.safeParse(minimalValid);
			expect(result.success).toBe(true);
		});

		it("should accept full payload with all optional fields", () => {
			const result = contactFormSchema.safeParse(fullValid);
			expect(result.success).toBe(true);
		});

		it("should fail when email is missing", () => {
			const { email: _email, ...noEmail } = minimalValid;
			const result = contactFormSchema.safeParse(noEmail);
			expect(result.success).toBe(false);
		});

		it("should fail when message is missing", () => {
			const { message: _message, ...noMessage } = minimalValid;
			const result = contactFormSchema.safeParse(noMessage);
			expect(result.success).toBe(false);
		});
	});

	describe("name field (optional)", () => {
		it("should accept valid name when provided", () => {
			const result = contactFormSchema.safeParse(fullValid);
			expect(result.success).toBe(true);
		});

		it("should accept undefined name", () => {
			const result = contactFormSchema.safeParse(minimalValid);
			expect(result.success).toBe(true);
		});

		it("should accept empty string name", () => {
			const result = contactFormSchema.safeParse({ ...minimalValid, name: "" });
			expect(result.success).toBe(true);
		});

		it("should reject name under 2 characters (when non-empty)", () => {
			const result = contactFormSchema.safeParse({ ...minimalValid, name: "A" });
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toContain("at least 2 characters");
			}
		});

		it("should reject name over 100 characters", () => {
			const result = contactFormSchema.safeParse({
				...minimalValid,
				name: "a".repeat(101),
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toContain("too long");
			}
		});
	});

	describe("email field (required)", () => {
		it("should accept valid email", () => {
			const result = contactFormSchema.safeParse(minimalValid);
			expect(result.success).toBe(true);
		});

		it("should reject invalid email format", () => {
			const result = contactFormSchema.safeParse({
				...minimalValid,
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
				...minimalValid,
				email: longEmail,
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toContain("too long");
			}
		});
	});

	describe("projectType field (optional)", () => {
		const validTypes = ["web-app", "saas", "ecommerce", "consulting", "other"];

		validTypes.forEach((type) => {
			it(`should accept "${type}"`, () => {
				const result = contactFormSchema.safeParse({
					...minimalValid,
					projectType: type,
				});
				expect(result.success).toBe(true);
			});
		});

		it("should accept empty string (progressive disclosure default)", () => {
			const result = contactFormSchema.safeParse({ ...minimalValid, projectType: "" });
			expect(result.success).toBe(true);
		});

		it("should accept undefined", () => {
			const result = contactFormSchema.safeParse(minimalValid);
			expect(result.success).toBe(true);
		});

		it("should reject invalid non-empty project type", () => {
			const result = contactFormSchema.safeParse({
				...minimalValid,
				projectType: "invalid-type",
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				const message = result.error.issues[0].message;
				expect(message).toBe("Please select a valid project type");
			}
		});
	});

	describe("budget field (optional)", () => {
		const validBudgets = ["5k-10k", "10k-25k", "25k-50k", "50k+"];

		validBudgets.forEach((budget) => {
			it(`should accept "${budget}"`, () => {
				const result = contactFormSchema.safeParse({ ...minimalValid, budget });
				expect(result.success).toBe(true);
			});
		});

		it("should accept empty string", () => {
			const result = contactFormSchema.safeParse({ ...minimalValid, budget: "" });
			expect(result.success).toBe(true);
		});

		it("should accept undefined", () => {
			const result = contactFormSchema.safeParse(minimalValid);
			expect(result.success).toBe(true);
		});

		it("should reject invalid non-empty budget", () => {
			const result = contactFormSchema.safeParse({
				...minimalValid,
				budget: "1k",
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				const message = result.error.issues[0].message;
				expect(message).toBe("Please select a valid budget range");
			}
		});
	});

	describe("message field (required)", () => {
		it("should accept valid message", () => {
			const result = contactFormSchema.safeParse(minimalValid);
			expect(result.success).toBe(true);
		});

		it("should reject message under 10 characters", () => {
			const result = contactFormSchema.safeParse({ ...minimalValid, message: "Hi" });
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toContain("at least 10 characters");
			}
		});

		it("should reject message over 5000 characters", () => {
			const result = contactFormSchema.safeParse({
				...minimalValid,
				message: "a".repeat(5001),
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toContain("too long");
			}
		});
	});

	describe("referralSource field (optional)", () => {
		it("should accept empty string", () => {
			const result = contactFormSchema.safeParse({ ...minimalValid, referralSource: "" });
			expect(result.success).toBe(true);
		});

		it("should accept undefined", () => {
			const result = contactFormSchema.safeParse(minimalValid);
			expect(result.success).toBe(true);
		});

		it("should accept valid enum value", () => {
			const result = contactFormSchema.safeParse({ ...minimalValid, referralSource: "linkedin" });
			expect(result.success).toBe(true);
		});
	});

	describe("turnstileToken field", () => {
		it("should be optional", () => {
			const result = contactFormSchema.safeParse(minimalValid);
			expect(result.success).toBe(true);
		});

		it("should accept token when provided", () => {
			const result = contactFormSchema.safeParse({
				...minimalValid,
				turnstileToken: "abc123",
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.turnstileToken).toBe("abc123");
			}
		});
	});

	describe("transforms", () => {
		it("should coerce undefined optional fields to empty string", () => {
			const result = contactFormSchema.safeParse(minimalValid);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.name).toBe("");
				expect(result.data.projectType).toBe("");
				expect(result.data.budget).toBe("");
				expect(result.data.referralSource).toBe("");
			}
		});
	});
});
