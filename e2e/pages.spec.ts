import { expect, test } from "@playwright/test";

test.describe("Page Load", () => {
	test("home page loads correctly", async ({ page }) => {
		await page.goto("/");

		await expect(page).toHaveTitle(/Alex Mayhew/i);

		const main = page.locator("#main-content");
		await expect(main).toBeAttached();
	});

	test("work page loads and displays projects", async ({ page }) => {
		await page.goto("/work");

		await expect(page).toHaveTitle(/Work.*Alex Mayhew/i);
		await expect(page.locator("#main-content")).toBeAttached();
	});

	test("about page loads", async ({ page }) => {
		await page.goto("/about");

		await expect(page).toHaveTitle(/About.*Alex Mayhew/i);
	});

	test("contact page loads with form", async ({ page }) => {
		await page.goto("/contact");

		await expect(page).toHaveTitle(/Contact.*Alex Mayhew/i);
		await expect(page.locator("form").first()).toBeAttached();
	});

	test("blog page loads", async ({ page }) => {
		await page.goto("/blog");

		await expect(page).toHaveTitle(/Blog.*Alex Mayhew/i);
	});

	test("404 page for invalid routes", async ({ page }) => {
		const response = await page.goto("/non-existent-page-xyz-12345");
		expect(response?.status()).toBe(404);
	});
});

test.describe("Page Content", () => {
	test("footer is visible on all pages", async ({ page }) => {
		const pages = ["/", "/work", "/about", "/contact", "/blog"];

		for (const path of pages) {
			await page.goto(path);

			// Scroll to bottom to ensure footer is in view
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
			await expect(page.locator("footer")).toBeVisible();
		}
	});

	test("navigation is visible on all pages", async ({ page }) => {
		const pages = ["/", "/work", "/about", "/contact", "/blog"];

		for (const path of pages) {
			await page.goto(path);

			const nav = page.locator("nav").first();
			await expect(nav).toBeVisible();
		}
	});
});
