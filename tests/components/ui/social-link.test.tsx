import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SocialLink } from "@/components/ui/social-link";

vi.mock("@/components/analytics", () => ({
	trackSocialClick: vi.fn(),
}));

describe("SocialLink", () => {
	it("fires trackSocialClick with network + location on click", async () => {
		const { trackSocialClick } = await import("@/components/analytics");
		const spy = trackSocialClick as ReturnType<typeof vi.fn>;
		render(
			<SocialLink
				href="https://linkedin.com/in/x"
				label="LinkedIn"
				network="linkedin"
				location="footer"
			>
				icon
			</SocialLink>
		);
		fireEvent.click(screen.getByRole("link"));
		expect(spy).toHaveBeenCalledWith(
			"linkedin",
			expect.objectContaining({ location: "footer", url: "https://linkedin.com/in/x" })
		);
	});
});
