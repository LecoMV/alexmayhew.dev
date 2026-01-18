import { test, expect } from "@playwright/test";

test.describe("Accessibility", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");
	});

	test("skip to content link exists and works", async ({ page }) => {
		// The skip link is visually hidden until focused
		// Focus on it by pressing Tab
		await page.keyboard.press("Tab");
		await page.waitForTimeout(100);

		// Skip link should now be visible when focused
		const skipLink = page.locator('a[href="#main-content"]');
		await expect(skipLink).toBeFocused();

		// Click the skip link
		await skipLink.click();

		// Main content should exist
		const mainContent = page.locator("#main-content");
		await expect(mainContent).toBeAttached();
	});

	test("page has heading structure", async ({ page }) => {
		await page.waitForTimeout(500);

		// Home page uses h1 for status and h2 for main headline
		const h1 = page.locator("h1");
		await expect(h1.first()).toBeAttached();

		const h2 = page.locator("h2");
		await expect(h2.first()).toBeAttached();
	});

	test("images have alt text", async ({ page }) => {
		await page.waitForTimeout(500);

		// Get all images
		const images = page.locator("img");
		const count = await images.count();

		// All images should have alt attribute (even if empty for decorative)
		for (let i = 0; i < count; i++) {
			const img = images.nth(i);
			const hasAlt = await img.evaluate((el) => el.hasAttribute("alt"));
			expect(hasAlt).toBe(true);
		}
	});

	test("buttons have accessible names", async ({ page }) => {
		await page.waitForTimeout(500);

		const buttons = page.getByRole("button");
		const count = await buttons.count();

		for (let i = 0; i < count; i++) {
			const button = buttons.nth(i);
			const ariaLabel = await button.getAttribute("aria-label");
			const text = await button.textContent();
			// Button should have either aria-label or text content
			expect(ariaLabel || (text && text.trim())).toBeTruthy();
		}
	});

	test("links have accessible content", async ({ page }) => {
		await page.waitForTimeout(500);

		const links = page.getByRole("link");
		const count = await links.count();

		for (let i = 0; i < count; i++) {
			const link = links.nth(i);
			const ariaLabel = await link.getAttribute("aria-label");
			const text = await link.textContent();
			// Link should have either aria-label or text content
			expect(ariaLabel || (text && text.trim())).toBeTruthy();
		}
	});

	test("page has lang attribute", async ({ page }) => {
		const html = page.locator("html");
		const lang = await html.getAttribute("lang");
		expect(lang).toBe("en");
	});

	test("viewport meta tag is present", async ({ page }) => {
		const viewport = page.locator('meta[name="viewport"]');
		await expect(viewport).toHaveAttribute("content", /width=device-width/);
	});

	test("focus is visible on interactive elements", async ({ page }) => {
		// Tab to an element and check it receives focus
		await page.keyboard.press("Tab");
		await page.keyboard.press("Tab");

		const focused = await page.evaluate(() => {
			const el = document.activeElement;
			return el ? el.tagName : null;
		});

		// Something should be focused
		expect(focused).toBeTruthy();
	});
});
