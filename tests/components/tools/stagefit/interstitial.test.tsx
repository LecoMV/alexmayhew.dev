import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Interstitial } from "@/components/tools/stagefit/phases/Interstitial";

describe("Interstitial", () => {
	it("displays loaded baseline message with revenue stage", () => {
		render(
			<Interstitial
				revenueStage="2"
				customerType="b2b-smb"
				triggerEvent="none"
				onContinue={() => {}}
			/>
		);
		expect(screen.getByText(/mapping your tech/i)).toBeTruthy();
	});

	it("displays the stage label for the selected revenue stage", () => {
		render(
			<Interstitial
				revenueStage="2"
				customerType="b2b-smb"
				triggerEvent="none"
				onContinue={() => {}}
			/>
		);
		expect(screen.getByText(/\$10K/)).toBeTruthy();
	});

	it("calls onContinue when continue button is clicked", () => {
		const onContinue = vi.fn();
		render(
			<Interstitial
				revenueStage="2"
				customerType="b2b-smb"
				triggerEvent="none"
				onContinue={onContinue}
			/>
		);
		fireEvent.click(screen.getByRole("button", { name: /continue/i }));
		expect(onContinue).toHaveBeenCalledTimes(1);
	});
});
