import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FaqAccordion } from "@/components/pseo/faq-accordion";

const Q1 = "First question?";
const A1 = "First answer body.";
const Q2 = "Second question?";
const A2 = "Second answer body.";

const FAQS = [
	{ question: Q1, answer: A1 },
	{ question: Q2, answer: A2 },
];

describe("FaqAccordion", () => {
	it("renders all FAQ questions", () => {
		render(<FaqAccordion faqs={FAQS} heading="Integration_FAQs" />);
		expect(screen.getByText(Q1)).toBeDefined();
		expect(screen.getByText(Q2)).toBeDefined();
	});

	it("renders the provided heading", () => {
		render(<FaqAccordion faqs={FAQS} heading="Migration_FAQs" />);
		expect(screen.getByText(/Migration_FAQs/)).toBeDefined();
	});

	it("expands an FAQ when its button is clicked", () => {
		render(<FaqAccordion faqs={FAQS} heading="H" initialOpenIndex={null} />);
		expect(screen.queryByText(A1)).toBeNull();

		const firstButton = screen.getAllByRole("button")[0];
		fireEvent.click(firstButton);
		expect(screen.getByText(A1)).toBeDefined();
		expect(firstButton.getAttribute("aria-expanded")).toBe("true");
	});

	it("opens the initialOpenIndex FAQ on mount", () => {
		render(<FaqAccordion faqs={FAQS} heading="H" initialOpenIndex={0} />);
		expect(screen.getByText(A1)).toBeDefined();
		expect(screen.queryByText(A2)).toBeNull();
	});

	it("service variant renders questions as <h3> with text-mist-white styling", () => {
		render(<FaqAccordion faqs={FAQS} heading="FAQ" variant="service" />);
		const question = screen.getByText(Q1);
		expect(question.tagName.toLowerCase()).toBe("h3");
		expect(question.className).toContain("text-mist-white");
	});

	it("default variant (omitted prop) keeps questions as <span> for backward compatibility", () => {
		render(<FaqAccordion faqs={FAQS} heading="H" />);
		const question = screen.getByText(Q1);
		expect(question.tagName.toLowerCase()).toBe("span");
	});

	it("service variant supports toggle and respects initialOpenIndex", () => {
		render(<FaqAccordion faqs={FAQS} heading="H" variant="service" initialOpenIndex={1} />);
		// Second answer open on mount
		expect(screen.queryByText(A1)).toBeNull();
		expect(screen.getByText(A2)).toBeDefined();

		// Click first button toggles it open
		const buttons = screen.getAllByRole("button");
		fireEvent.click(buttons[0]);
		expect(screen.getByText(A1)).toBeDefined();
		expect(buttons[0].getAttribute("aria-expanded")).toBe("true");
	});
});
