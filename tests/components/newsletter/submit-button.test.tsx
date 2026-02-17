import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-dom", async () => {
	const actual = await vi.importActual("react-dom");
	return {
		...actual,
		useFormStatus: vi.fn(() => ({ pending: false })),
	};
});

import { useFormStatus } from "react-dom";

import { SubmitButton } from "@/components/newsletter/submit-button";

describe("SubmitButton", () => {
	beforeEach(() => {
		vi.mocked(useFormStatus).mockReturnValue({
			pending: false,
			data: null,
			method: null,
			action: null,
		});
	});

	it("renders children when not pending", () => {
		render(<SubmitButton>Subscribe</SubmitButton>);
		expect(screen.getByText("Subscribe")).toBeDefined();
	});

	it("shows pendingText when pending", () => {
		vi.mocked(useFormStatus).mockReturnValue({
			pending: true,
			data: new FormData(),
			method: "POST",
			action: "/",
		});

		render(<SubmitButton pendingText="Loading...">Subscribe</SubmitButton>);
		expect(screen.getByText("Loading...")).toBeDefined();
		expect(screen.queryByText("Subscribe")).toBeNull();
	});

	it("has animate-pulse class on pending text", () => {
		vi.mocked(useFormStatus).mockReturnValue({
			pending: true,
			data: new FormData(),
			method: "POST",
			action: "/",
		});

		render(<SubmitButton pendingText="Loading...">Subscribe</SubmitButton>);
		const pendingSpan = screen.getByText("Loading...");
		expect(pendingSpan.className).toContain("animate-pulse");
	});

	it("disables button when pending", () => {
		vi.mocked(useFormStatus).mockReturnValue({
			pending: true,
			data: new FormData(),
			method: "POST",
			action: "/",
		});

		render(<SubmitButton pendingText="Loading...">Subscribe</SubmitButton>);
		const button = screen.getByRole("button");
		expect(button).toHaveProperty("disabled", true);
	});

	it("forwards className prop", () => {
		render(<SubmitButton className="custom-class">Subscribe</SubmitButton>);
		const button = screen.getByRole("button");
		expect(button.className).toContain("custom-class");
	});
});
