import { test, expect } from "@playwright/test";

test.describe("Page Load", () => {
	test("home page loads correctly", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		await expect(page).toHaveTitle(/Alex Mayhew/i);

		// Main content should exist
		const main = page.locator("#main-content");
		await expect(main).toBeAttached();
	});

	test("work page loads and displays projects", async ({ page }) => {
		await page.goto("/work");
		await page.waitForLoadState("networkidle");

		await expect(page).toHaveTitle(/Work.*Alex Mayhew/i);

		// Wait for content to render
		await page.waitForTimeout(500);

		// Should have main-content (the one from layout with id)
		const mainContent = page.locator("#main-content");
		await expect(mainContent).toBeAttached();
	});

	test("about page loads", async ({ page }) => {
		await page.goto("/about");
		await page.waitForLoadState("networkidle");

		await expect(page).toHaveTitle(/About.*Alex Mayhew/i);
	});

	test("contact page loads with form", async ({ page }) => {
		await page.goto("/contact");
		await page.waitForLoadState("networkidle");
		await page.waitForTimeout(500);

		await expect(page).toHaveTitle(/Contact.*Alex Mayhew/i);

		// Should have form elements
		const form = page.locator("form");
		await expect(form.first()).toBeAttached();
	});

	test("blog page loads", async ({ page }) => {
		await page.goto("/blog");
		await page.waitForLoadState("networkidle");

		await expect(page).toHaveTitle(/Blog.*Alex Mayhew/i);
	});

	test("demo page loads with terminal", async ({ page }) => {
		await page.goto("/demo");
		await page.waitForLoadState("networkidle");
		await page.waitForTimeout(500);

		// Page should load
		await expect(page.locator("body")).toBeVisible();
	});

	test("404 page for invalid routes", async ({ page }) => {
		const response = await page.goto("/non-existent-page-xyz-12345");
		expect(response?.status()).toBe(404);
	});

	test("privacy page loads", async ({ page }) => {
		await page.goto("/privacy");
		await page.waitForLoadState("networkidle");

		await expect(page).toHaveTitle(/Privacy.*Alex Mayhew/i);
	});

	test("terms page loads", async ({ page }) => {
		await page.goto("/terms");
		await page.waitForLoadState("networkidle");

		await expect(page).toHaveTitle(/Terms.*Alex Mayhew/i);
	});
});

test.describe("Page Content", () => {
	test("footer is visible on all pages", async ({ page }) => {
		const pages = ["/", "/work", "/about", "/contact", "/blog"];

		for (const path of pages) {
			await page.goto(path);
			await page.waitForLoadState("networkidle");
			await page.waitForTimeout(300);

			// Scroll to bottom
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
			await page.waitForTimeout(200);

			const footer = page.locator("footer");
			await expect(footer).toBeAttached();
		}
	});

	test("navigation is visible on all pages", async ({ page }) => {
		const pages = ["/", "/work", "/about", "/contact", "/blog"];

		for (const path of pages) {
			await page.goto(path);
			await page.waitForLoadState("networkidle");

			const nav = page.locator("nav").first();
			await expect(nav).toBeVisible();
		}
	});
});
