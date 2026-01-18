import { test, expect } from "@playwright/test";

test.describe("Footer", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");
		// Scroll to footer
		await page.locator("footer").scrollIntoViewIfNeeded();
		await page.waitForTimeout(300);
	});

	test("footer is visible", async ({ page }) => {
		const footer = page.locator("footer");
		await expect(footer).toBeVisible();
	});

	test("footer has brand section", async ({ page }) => {
		const footer = page.locator("footer");
		// Brand link with alexmayhew.dev text
		const brand = footer.locator('a[href="/"]').first();
		await expect(brand).toBeVisible();
	});

	test("footer has social links", async ({ page }) => {
		const footer = page.locator("footer");

		// GitHub link
		const githubLink = footer.locator('a[href*="github.com"]');
		await expect(githubLink).toBeVisible();

		// LinkedIn link
		const linkedinLink = footer.locator('a[href*="linkedin.com"]');
		await expect(linkedinLink).toBeVisible();
	});

	test("footer has legal links", async ({ page }) => {
		const footer = page.locator("footer");

		const privacyLink = footer.locator('a[href="/privacy"]');
		await expect(privacyLink).toBeVisible();

		const termsLink = footer.locator('a[href="/terms"]');
		await expect(termsLink).toBeVisible();
	});

	test("footer displays local time", async ({ page }) => {
		const footer = page.locator("footer");

		// LocalTime component renders time in format like "10:30 PM"
		const timePattern = /\d{1,2}:\d{2}\s*(AM|PM)?/i;
		const footerText = await footer.textContent();
		expect(footerText).toMatch(timePattern);
	});

	test("footer displays status indicator", async ({ page }) => {
		const footer = page.locator("footer");

		// Status text
		const statusText = footer.locator("text=/operational/i");
		await expect(statusText).toBeVisible();
	});

	test("footer navigation links work", async ({ page }) => {
		const footer = page.locator("footer");

		// Click work link in footer
		const workLink = footer.locator('a[href="/work"]');
		await workLink.click();
		await expect(page).toHaveURL("/work");
	});
});
