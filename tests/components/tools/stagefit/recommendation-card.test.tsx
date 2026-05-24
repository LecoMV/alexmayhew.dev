import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RecommendationCard } from "@/components/tools/stagefit/RecommendationCard";

describe("RecommendationCard", () => {
	it("renders dimension title and hub link", () => {
		render(<RecommendationCard dimension="architecture" />);
		expect(screen.getByText(/architecture style/i)).toBeTruthy();
		expect(screen.getByRole("link")).toBeTruthy();
	});
});
