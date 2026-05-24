import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { HotTruncate } from "@/components/tools/stagefit/phases/HotTruncate";

describe("HotTruncate", () => {
	it("displays misaligned count and leaning zone", () => {
		render(<HotTruncate misalignedCount={3} leaningZone="over-built" onContinue={() => {}} />);
		expect(screen.getByText(/3 dimensions misaligned/i)).toBeTruthy();
	});

	it("calls onContinue when continue is clicked", () => {
		const onContinue = vi.fn();
		render(<HotTruncate misalignedCount={2} leaningZone="under-built" onContinue={onContinue} />);
		fireEvent.click(screen.getByRole("button", { name: /continue/i }));
		expect(onContinue).toHaveBeenCalledTimes(1);
	});
});
