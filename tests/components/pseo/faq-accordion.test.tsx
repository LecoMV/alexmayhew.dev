import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FaqAccordion } from "@/components/pseo/faq-accordion";

const FAQS = [
	{ question: "First question?", answer: "First answer body." },
	{ question: "Second question?", answer: "Second answer body." },
];

describe("FaqAccordion", () => {
	it("renders all FAQ questions", () => {
		render(<FaqAccordion faqs={FAQS} heading="Integration_FAQs" />);
		expect(screen.getByText("First question?")).toBeDefined();
		expect(screen.getByText("Second question?")).toBeDefined();
	});

	it("renders the provided heading", () => {
		render(<FaqAccordion faqs={FAQS} heading="Migration_FAQs" />);
		expect(screen.getByText(/Migration_FAQs/)).toBeDefined();
	});

	it("expands an FAQ when its button is clicked", () => {
		render(<FaqAccordion faqs={FAQS} heading="H" initialOpenIndex={null} />);
		expect(screen.queryByText("First answer body.")).toBeNull();

		const firstButton = screen.getAllByRole("button")[0];
		fireEvent.click(firstButton);
		expect(screen.getByText("First answer body.")).toBeDefined();
		expect(firstButton.getAttribute("aria-expanded")).toBe("true");
	});

	it("opens the initialOpenIndex FAQ on mount", () => {
		render(<FaqAccordion faqs={FAQS} heading="H" initialOpenIndex={0} />);
		expect(screen.getByText("First answer body.")).toBeDefined();
		expect(screen.queryByText("Second answer body.")).toBeNull();
	});

	it("service variant renders questions as <h3> with text-mist-white styling", () => {
		render(<FaqAccordion faqs={FAQS} heading="FAQ" variant="service" />);
		const question = screen.getByText("First question?");
		expect(question.tagName.toLowerCase()).toBe("h3");
		expect(question.className).toContain("text-mist-white");
	});

	it("default variant (omitted prop) keeps questions as <span> for backward compatibility", () => {
		render(<FaqAccordion faqs={FAQS} heading="H" />);
		const question = screen.getByText("First question?");
		expect(question.tagName.toLowerCase()).toBe("span");
	});

	it("service variant supports toggle and respects initialOpenIndex", () => {
		render(<FaqAccordion faqs={FAQS} heading="H" variant="service" initialOpenIndex={1} />);
		// Second answer open on mount
		expect(screen.queryByText("First answer body.")).toBeNull();
		expect(screen.getByText("Second answer body.")).toBeDefined();

		// Click first button toggles it open
		const buttons = screen.getAllByRole("button");
		fireEvent.click(buttons[0]);
		expect(screen.getByText("First answer body.")).toBeDefined();
		expect(buttons[0].getAttribute("aria-expanded")).toBe("true");
	});
});
