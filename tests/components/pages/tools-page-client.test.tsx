import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FadeInUp } from "@/components/pages/tools-page-client";

describe("tools-page-client FadeInUp", () => {
	it("renders its children", () => {
		render(
			<FadeInUp>
				<h1>Hello</h1>
			</FadeInUp>
		);
		expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Hello");
	});
});
