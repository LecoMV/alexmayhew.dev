import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { NewsletterSignup } from "@/components/newsletter/newsletter-signup";
import { ContactPage } from "@/components/pages/contact-page";

vi.mock("next/link", () => ({
	default: ({
		children,
		href,
		...props
	}: {
		children: React.ReactNode;
		href: string;
		[key: string]: unknown;
	}) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}));

vi.mock("@/app/actions/contact", () => ({
	submitContactAction: vi.fn(),
}));

vi.mock("@/components/analytics", () => ({
	trackEvent: vi.fn(),
	trackLeadEvent: vi.fn(),
}));

vi.mock("@/components/ui/turnstile", () => ({
	Turnstile: vi.fn(() => null),
}));

vi.mock("react-dom", async () => {
	const actual = await vi.importActual("react-dom");
	return {
		...actual,
		useFormStatus: () => ({ pending: false }),
	};
});

vi.mock("@/app/actions/newsletter", () => ({
	subscribeNewsletterAction: vi.fn(),
}));

vi.mock("@/components/newsletter/submit-button", () => ({
	SubmitButton: ({
		children,
		className,
	}: {
		children: React.ReactNode;
		className?: string;
		pendingText?: string;
	}) => (
		<button type="submit" className={className}>
			{children}
		</button>
	),
}));

describe("Focus ring — ContactPage form inputs", () => {
	it("all text inputs, selects, and textarea have focus-visible:ring-2 and focus-visible:ring-cyber-lime", () => {
		const { container } = render(<ContactPage />);

		const inputs = container.querySelectorAll("input:not([type='hidden'])");
		const selects = container.querySelectorAll("select");
		const textareas = container.querySelectorAll("textarea");

		const allFormFields = [...inputs, ...selects, ...textareas];
		expect(allFormFields.length).toBeGreaterThan(0);

		for (const field of allFormFields) {
			const classes = field.className;
			expect(classes, `Missing focus-visible:ring-2 on ${field.tagName}#${field.id}`).toContain(
				"focus-visible:ring-2"
			);
			expect(
				classes,
				`Missing focus-visible:ring-cyber-lime on ${field.tagName}#${field.id}`
			).toContain("focus-visible:ring-cyber-lime");
		}
	});
});

describe("Focus ring — NewsletterSignup form inputs", () => {
	it("email input in card variant has focus-visible:ring-2 and focus-visible:ring-cyber-lime", () => {
		const { container } = render(<NewsletterSignup variant="card" />);

		const inputs = container.querySelectorAll("input[type='email']");
		expect(inputs.length).toBeGreaterThan(0);

		for (const input of inputs) {
			const classes = input.className;
			expect(classes, "Missing focus-visible:ring-2 on newsletter email input").toContain(
				"focus-visible:ring-2"
			);
			expect(classes, "Missing focus-visible:ring-cyber-lime on newsletter email input").toContain(
				"focus-visible:ring-cyber-lime"
			);
		}
	});
});
