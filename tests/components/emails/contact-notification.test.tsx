import { render } from "@react-email/render";
import { describe, expect, it } from "vitest";

import { ContactNotification } from "@/components/emails/contact-notification";

describe("ContactNotification email", () => {
	it("renders with all fields including referral source", async () => {
		const html = await render(
			ContactNotification({
				name: "Jane Doe",
				email: "jane@example.com",
				projectType: "saas",
				budget: "25k-50k",
				message: "I need help building a SaaS platform.",
				referralSource: "linkedin",
				timestamp: "Sat, Apr 5, 2026, 10:30 AM EST",
			})
		);

		expect(html).toContain("Jane Doe");
		expect(html).toContain("jane@example.com");
		expect(html).toContain("SaaS Platform");
		expect(html).toContain("$25,000 - $50,000");
		expect(html).toContain("LinkedIn");
		expect(html).toContain("REFERRAL_SOURCE");
	});

	it("renders without referral source when omitted", async () => {
		const html = await render(
			ContactNotification({
				name: "John Smith",
				email: "john@example.com",
				projectType: "web-app",
				budget: "10k-25k",
				message: "I need a web application built.",
				timestamp: "Mon, Apr 7, 2026, 2:00 PM EST",
			})
		);

		expect(html).toContain("John Smith");
		expect(html).toContain("Web Application");
		expect(html).toContain("$10,000 - $25,000");
		expect(html).not.toContain("REFERRAL_SOURCE");
	});

	it("renders unknown referral source as-is", async () => {
		const html = await render(
			ContactNotification({
				name: "Test",
				email: "t@t.com",
				projectType: "other",
				budget: "50k+",
				message: "Testing unknown referral.",
				referralSource: "podcast",
				timestamp: "test",
			})
		);

		expect(html).toContain("podcast");
		expect(html).toContain("Other");
		expect(html).toContain("$50,000+");
	});
});
