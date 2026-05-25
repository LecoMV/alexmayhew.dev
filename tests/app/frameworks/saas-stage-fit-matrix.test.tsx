import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SaasStagesFitMatrixPage from "@/app/frameworks/saas-stage-fit-matrix/page";

describe("SaaS Stage-Fit Matrix page", () => {
	it("renders the h1 heading", () => {
		render(<SaasStagesFitMatrixPage />);
		const h1 = screen.getByRole("heading", { level: 1 });
		expect(h1).toBeTruthy();
		expect(h1.textContent).toMatch(/saas stage-fit matrix/i);
	});

	it("renders the three zone definitions", () => {
		render(<SaasStagesFitMatrixPage />);
		expect(screen.getByText(/over-built/i)).toBeTruthy();
		expect(screen.getByText(/stage-optimized/i)).toBeTruthy();
		expect(screen.getByText(/under-built/i)).toBeTruthy();
	});

	it("renders JSON-LD with Article and DefinedTerm types", () => {
		const { container } = render(<SaasStagesFitMatrixPage />);
		const jsonLdScript = container.querySelector('script[type="application/ld+json"]');
		expect(jsonLdScript).toBeTruthy();
		const data = JSON.parse(jsonLdScript!.textContent!) as { "@graph": Array<{ "@type": string }> };
		const types = data["@graph"].map((item) => item["@type"]);
		expect(types).toContain("Article");
		expect(types).toContain("DefinedTerm");
		expect(types).toContain("FAQPage");
	});
});
