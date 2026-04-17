import fs from "fs";
import path from "path";

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { NewsletterSignup } from "@/components/newsletter/newsletter-signup";
import { ContactPage } from "@/components/pages/contact-page";

const FOCUS_RING_WIDTH = "focus-visible:ring-2";
const FOCUS_RING_COLOR = "focus-visible:ring-cyber-lime";

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
				FOCUS_RING_WIDTH
			);
			expect(
				classes,
				`Missing focus-visible:ring-cyber-lime on ${field.tagName}#${field.id}`
			).toContain(FOCUS_RING_COLOR);
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
				FOCUS_RING_WIDTH
			);
			expect(classes, "Missing focus-visible:ring-cyber-lime on newsletter email input").toContain(
				FOCUS_RING_COLOR
			);
		}
	});
});

describe("Focus ring — ChatWidget input (source-level)", () => {
	it("chat input className includes focus-visible:ring-2 and focus-visible:ring-cyber-lime", () => {
		const filePath = path.resolve(__dirname, "../../src/components/chat/chat-widget.tsx");
		const source = fs.readFileSync(filePath, "utf-8");

		// The chat input is the <input> with placeholder "Ask me anything..."
		const inputMatch = source.match(
			/placeholder="Ask me anything\.\.\."[\s\S]*?className="([^"]+)"/
		);
		expect(inputMatch, "Could not find chat input className").toBeTruthy();

		const className = inputMatch![1];
		expect(className, "Missing focus-visible:ring-2 on chat input").toContain(FOCUS_RING_WIDTH);
		expect(className, "Missing focus-visible:ring-cyber-lime on chat input").toContain(
			FOCUS_RING_COLOR
		);
	});
});

describe("Focus ring — GpuControl password input (source-level)", () => {
	it("GPU password input cn() call includes focus-visible:ring-2 and focus-visible:ring-cyber-lime", () => {
		const filePath = path.resolve(__dirname, "../../src/components/traceforge/gpu-control.tsx");
		const source = fs.readFileSync(filePath, "utf-8");

		// The password input uses cn() with multiple string args; find the block
		const inputBlock = source.match(
			/placeholder="Admin password\.\.\."[\s\S]*?className=\{cn\(([\s\S]*?)\)\}/
		);
		expect(inputBlock, "Could not find GPU password input cn() block").toBeTruthy();

		const cnArgs = inputBlock![1];
		expect(cnArgs, "Missing focus-visible:ring-2 on GPU password input").toContain(
			FOCUS_RING_WIDTH
		);
		expect(cnArgs, "Missing focus-visible:ring-cyber-lime on GPU password input").toContain(
			FOCUS_RING_COLOR
		);
	});
});
