import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockFormAction = vi.fn();
let mockState: { success: boolean; error?: string } = { success: false };

vi.mock("react", async () => {
	const actual = await vi.importActual("react");
	return {
		...actual,
		useActionState: vi.fn(() => [mockState, mockFormAction, false]),
		useRef: () => ({ current: null }),
		useEffect: () => {},
	};
});

vi.mock("framer-motion", () => ({
	m: new Proxy(
		{},
		{
			get: (_, tag) => {
				if (typeof tag === "string") {
					// eslint-disable-next-line react/display-name
					return ({
						initial: _i,
						animate: _a,
						transition: _t,
						whileHover: _wh,
						whileTap: _wt,
						...rest
					}: Record<string, unknown>) => {
						const Tag = tag as keyof React.JSX.IntrinsicElements;
						return React.createElement(Tag, rest as React.HTMLAttributes<HTMLElement>);
					};
				}
				return undefined;
			},
		}
	),
}));

vi.mock("@/components/analytics", () => ({
	trackNewsletterEvent: vi.fn(),
}));

vi.mock("@/lib/motion-constants", () => ({
	springTransition: { type: "spring", stiffness: 100, damping: 20 },
}));

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
	}) => React.createElement("button", { type: "submit", className }, children),
}));

vi.mock("lucide-react", () => ({
	AlertCircle: (props: Record<string, unknown>) =>
		React.createElement("svg", { ...props, "data-testid": "alert-circle" }),
	ArrowRight: (props: Record<string, unknown>) =>
		React.createElement("svg", { ...props, "data-testid": "arrow-right" }),
	CheckCircle: (props: Record<string, unknown>) =>
		React.createElement("svg", { ...props, "data-testid": "check-circle" }),
	Mail: (props: Record<string, unknown>) =>
		React.createElement("svg", { ...props, "data-testid": "mail-icon" }),
}));

import { useActionState } from "react";

import { NewsletterSignup } from "@/components/newsletter/newsletter-signup";

describe("NewsletterSignup", () => {
	beforeEach(() => {
		mockState = { success: false };
		vi.mocked(useActionState).mockReturnValue([mockState, mockFormAction, false]);
	});

	describe("card variant (default)", () => {
		it("renders 'The Architect's Brief' heading", () => {
			render(<NewsletterSignup />);
			expect(screen.getByText(/The Architect.s Brief/)).toBeDefined();
		});

		it("renders email input with placeholder", () => {
			render(<NewsletterSignup />);
			expect(screen.getByPlaceholderText("you@company.com")).toBeDefined();
		});

		it("renders Subscribe button", () => {
			render(<NewsletterSignup />);
			expect(screen.getByRole("button", { name: /subscribe/i })).toBeDefined();
		});
	});

	describe("inline variant", () => {
		it("renders 'Get insights like this weekly' text", () => {
			render(<NewsletterSignup variant="inline" />);
			expect(screen.getByText(/Get insights like this weekly/)).toBeDefined();
		});
	});

	describe("minimal variant", () => {
		it("renders Join button text", () => {
			render(<NewsletterSignup variant="minimal" />);
			expect(screen.getByRole("button", { name: /join/i })).toBeDefined();
		});

		it("has email input", () => {
			render(<NewsletterSignup variant="minimal" />);
			expect(screen.getByPlaceholderText("you@company.com")).toBeDefined();
		});
	});

	describe("error state", () => {
		beforeEach(() => {
			mockState = { success: false, error: "Invalid email address" };
			vi.mocked(useActionState).mockReturnValue([mockState, mockFormAction, false]);
		});

		it("shows role='alert' element", () => {
			render(<NewsletterSignup />);
			expect(screen.getByRole("alert")).toBeDefined();
		});

		it("shows error text", () => {
			render(<NewsletterSignup />);
			expect(screen.getByText("Invalid email address")).toBeDefined();
		});
	});

	describe("success state", () => {
		beforeEach(() => {
			mockState = { success: true };
			vi.mocked(useActionState).mockReturnValue([mockState, mockFormAction, false]);
		});

		it("shows 'You're in!' text", () => {
			render(<NewsletterSignup />);
			expect(screen.getByText(/You.re in!/)).toBeDefined();
		});
	});

	describe("accessibility", () => {
		it("has sr-only email label", () => {
			render(<NewsletterSignup />);
			expect(screen.getByLabelText("Email address")).toBeDefined();
		});

		it("sets aria-invalid when error is present", () => {
			mockState = { success: false, error: "Bad email" };
			vi.mocked(useActionState).mockReturnValue([mockState, mockFormAction, false]);
			render(<NewsletterSignup />);
			const emailInput = screen.getByPlaceholderText("you@company.com");
			expect(emailInput.getAttribute("aria-invalid")).toBe("true");
		});
	});
});
