import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IntroScreen } from "@/components/tools/stagefit/phases/IntroScreen";

describe("IntroScreen", () => {
	it("renders heading and start button", () => {
		render(<IntroScreen onStart={() => {}} />);
		expect(screen.getByRole("heading", { level: 2 })).toBeTruthy();
		expect(screen.getByRole("button", { name: /start/i })).toBeTruthy();
	});

	it("shows privacy note per R4", () => {
		render(<IntroScreen onStart={() => {}} />);
		expect(screen.getByText(/your answers are used only/i)).toBeTruthy();
	});
});
