import { test, expect } from "@playwright/test";

test.describe("Visual Regression", () => {
	// Common viewport for consistency
	test.use({ viewport: { width: 1280, height: 720 } });

	test("home page visual", async ({ page }) => {
		await page.goto("/");
		// Wait for animations or fonts
		await page.waitForLoadState("networkidle");
		await page.waitForTimeout(1000); // Give a bit of time for noise/animations to settle if any
		await expect(page).toHaveScreenshot("home-page.png", {
			maxDiffPixelRatio: 0.05, // Allow small noise diffs
		});
	});

	test("work page visual", async ({ page }) => {
		await page.goto("/work");
		await page.waitForLoadState("networkidle");
		await expect(page).toHaveScreenshot("work-page.png", {
			maxDiffPixelRatio: 0.05,
		});
	});

	test("blog page visual", async ({ page }) => {
		await page.goto("/blog");
		await page.waitForLoadState("networkidle");
		await expect(page).toHaveScreenshot("blog-page.png", {
			maxDiffPixelRatio: 0.05,
		});
	});

	test("about page visual", async ({ page }) => {
		await page.goto("/about");
		await page.waitForLoadState("networkidle");
		await expect(page).toHaveScreenshot("about-page.png", {
			maxDiffPixelRatio: 0.05,
		});
	});
});
