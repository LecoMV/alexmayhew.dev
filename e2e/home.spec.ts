import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
	test("should load successfully", async ({ page }) => {
		await page.goto("/");
		await expect(page).toHaveTitle(/Alex Mayhew/i);
	});

	test("should have noise overlay", async ({ page }) => {
		await page.goto("/");
		const noiseOverlay = page.locator('[data-testid="noise-overlay"]');
		await expect(noiseOverlay).toBeVisible();
	});

	test("should have smooth scroll enabled", async ({ page }) => {
		await page.goto("/");
		// Lenis adds a class to html element
		const html = page.locator("html");
		await expect(html).toHaveClass(/lenis/);
	});

	test("should be responsive on mobile", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto("/");
		// Check no horizontal overflow
		const body = page.locator("body");
		const bodyWidth = await body.evaluate((el) => el.scrollWidth);
		expect(bodyWidth).toBeLessThanOrEqual(375);
	});
});
