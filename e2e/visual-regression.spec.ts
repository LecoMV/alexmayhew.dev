import { test, expect } from "@playwright/test";

test.describe("Visual Regression", () => {
	// Common viewport for consistency
	test.use({ viewport: { width: 1280, height: 720 } });

	// Helper to prepare page for stable screenshots
	async function prepareForScreenshot(page: import("@playwright/test").Page) {
		// Hide noise overlay to prevent flaky diffs
		await page.addStyleTag({
			content: `
				[data-testid="noise-overlay"],
				.noise-overlay,
				[class*="noise"] {
					display: none !important;
				}
				/* Disable all animations and transitions */
				*, *::before, *::after {
					animation-duration: 0s !important;
					animation-delay: 0s !important;
					transition-duration: 0s !important;
					transition-delay: 0s !important;
				}
			`,
		});
		// Wait for styles to apply
		await page.waitForTimeout(100);
	}

	test("home page visual", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");
		await prepareForScreenshot(page);
		await expect(page).toHaveScreenshot("home-page.png", {
			maxDiffPixelRatio: 0.01,
		});
	});

	test("work page visual", async ({ page }) => {
		await page.goto("/work");
		await page.waitForLoadState("networkidle");
		await prepareForScreenshot(page);
		await expect(page).toHaveScreenshot("work-page.png", {
			maxDiffPixelRatio: 0.01,
		});
	});

	test("blog page visual", async ({ page }) => {
		await page.goto("/blog");
		await page.waitForLoadState("networkidle");
		await prepareForScreenshot(page);
		await expect(page).toHaveScreenshot("blog-page.png", {
			maxDiffPixelRatio: 0.01,
		});
	});

	test("about page visual", async ({ page }) => {
		await page.goto("/about");
		await page.waitForLoadState("networkidle");
		await prepareForScreenshot(page);
		await expect(page).toHaveScreenshot("about-page.png", {
			maxDiffPixelRatio: 0.01,
		});
	});

	test("contact page visual", async ({ page }) => {
		await page.goto("/contact");
		await page.waitForLoadState("networkidle");
		await prepareForScreenshot(page);
		await expect(page).toHaveScreenshot("contact-page.png", {
			maxDiffPixelRatio: 0.01,
		});
	});
});

test.describe("Visual Regression - Mobile", () => {
	test.use({ viewport: { width: 375, height: 667 } });

	async function prepareForScreenshot(page: import("@playwright/test").Page) {
		await page.addStyleTag({
			content: `
				[data-testid="noise-overlay"],
				.noise-overlay,
				[class*="noise"] {
					display: none !important;
				}
				*, *::before, *::after {
					animation-duration: 0s !important;
					animation-delay: 0s !important;
					transition-duration: 0s !important;
					transition-delay: 0s !important;
				}
			`,
		});
		await page.waitForTimeout(100);
	}

	test("home page mobile visual", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");
		await prepareForScreenshot(page);
		await expect(page).toHaveScreenshot("home-page-mobile.png", {
			maxDiffPixelRatio: 0.01,
		});
	});

	test("contact page mobile visual", async ({ page }) => {
		await page.goto("/contact");
		await page.waitForLoadState("networkidle");
		await prepareForScreenshot(page);
		await expect(page).toHaveScreenshot("contact-page-mobile.png", {
			maxDiffPixelRatio: 0.01,
		});
	});
});

test.describe("Visual Regression - Tablet", () => {
	test.use({ viewport: { width: 768, height: 1024 } });

	async function prepareForScreenshot(page: import("@playwright/test").Page) {
		await page.addStyleTag({
			content: `
				[data-testid="noise-overlay"],
				.noise-overlay,
				[class*="noise"] {
					display: none !important;
				}
				*, *::before, *::after {
					animation-duration: 0s !important;
					animation-delay: 0s !important;
					transition-duration: 0s !important;
					transition-delay: 0s !important;
				}
			`,
		});
		await page.waitForTimeout(200);
	}

	test("home page tablet visual", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");
		await prepareForScreenshot(page);
		await expect(page).toHaveScreenshot("home-page-tablet.png", {
			maxDiffPixelRatio: 0.02, // Slightly more lenient for tablet
		});
	});
});
