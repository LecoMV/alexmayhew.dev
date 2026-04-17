import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MotionDiv, MotionSection } from "@/components/pages/about-page-client";

describe("about-page-client motion wrappers", () => {
	it("MotionSection renders its children inside a <section>", () => {
		render(
			<MotionSection>
				<h2>About heading</h2>
			</MotionSection>
		);
		expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("About heading");
	});

	it("MotionDiv renders its children (used for above-the-fold animated blocks)", () => {
		render(
			<MotionDiv>
				<p>Intro paragraph</p>
			</MotionDiv>
		);
		expect(screen.getByText("Intro paragraph")).toBeDefined();
	});

	it("MotionCard renders its children (used for staggered card grids)", async () => {
		const { MotionCard } = await import("@/components/pages/about-page-client");
		render(
			<MotionCard delay={0.1}>
				<article>Card body</article>
			</MotionCard>
		);
		expect(screen.getByText("Card body")).toBeDefined();
	});
});
