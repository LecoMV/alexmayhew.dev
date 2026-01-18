import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
		// Wait for page to be fully loaded
		await page.waitForLoadState("networkidle");
	});

	test("should load successfully", async ({ page }) => {
		await expect(page).toHaveTitle(/Alex Mayhew/i);
	});

	test("should have noise overlay", async ({ page }) => {
		// Wait a bit for client-side rendering
		await page.waitForTimeout(500);
		const noiseOverlay = page.locator('[data-testid="noise-overlay"]');
		await expect(noiseOverlay).toBeVisible();
	});

	test("should have smooth scroll enabled", async ({ page }) => {
		// Wait for Lenis to initialize
		await page.waitForTimeout(1000);
		const html = page.locator("html");
		await expect(html).toHaveClass(/lenis/);
	});

	test("should be responsive on mobile", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		// Check no horizontal overflow
		const body = page.locator("body");
		const bodyScrollWidth = await body.evaluate((el) => el.scrollWidth);
		const windowWidth = await body.evaluate(() => window.innerWidth);
		expect(bodyScrollWidth).toBeLessThanOrEqual(windowWidth + 1); // Allow 1px tolerance
	});

	test("should display hero content", async ({ page }) => {
		// Wait for animation to complete
		await page.waitForTimeout(500);

		// Check for main headline
		const headline = page.locator("h2").first();
		await expect(headline).toContainText(/Atmospheric/i);
	});

	test("should have working navigation links", async ({ page, viewport }) => {
		// On mobile, the nav links are hidden in mobile menu
		// Check that key CTAs/links exist and are reachable
		const isMobile = viewport && viewport.width < 768;

		if (isMobile) {
			// On mobile, scroll to make sure hero CTAs are visible
			await page.waitForTimeout(500);
		}

		// Check contact CTA button (in hero section - visible on all viewports)
		const contactLink = page.locator('main a[href="/contact"]').first();
		await expect(contactLink).toBeAttached();

		// Check work link (in hero section)
		const workLink = page.locator('main a[href="/work"]').first();
		await expect(workLink).toBeAttached();
	});

	test("should display services section", async ({ page }) => {
		// Scroll to services
		await page.locator("text=Services").first().scrollIntoViewIfNeeded();
		await page.waitForTimeout(300);

		// Check service cards are visible
		const serviceCards = page.locator("article");
		await expect(serviceCards.first()).toBeVisible();
	});
});
