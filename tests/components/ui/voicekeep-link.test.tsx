import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { VoicekeepLink } from "@/components/ui/voicekeep-link";

vi.mock("@/components/analytics", () => ({
	trackEvent: vi.fn(),
}));

describe("VoicekeepLink", () => {
	it("fires a voicekeep_click GA4 event with placement on click", async () => {
		const { trackEvent } = await import("@/components/analytics");
		const spy = trackEvent as ReturnType<typeof vi.fn>;
		render(<VoicekeepLink placement="work-case-study">Try VoiceKeep</VoicekeepLink>);
		fireEvent.click(screen.getByRole("link"));
		expect(spy).toHaveBeenCalledWith(
			"voicekeep_click",
			expect.objectContaining({ placement: "work-case-study" })
		);
	});
});
