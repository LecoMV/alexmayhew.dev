import { expect, test } from "@playwright/test";

test.describe("Navigation", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
		await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
	});

	test("navigation links work correctly", async ({ page, viewport }) => {
		const isMobile = viewport && viewport.width < 1024;
		if (isMobile) {
			test.skip();
			return;
		}

		const desktopNav = page.locator("nav > div > div.hidden.lg\\:flex");

		// Verify expected nav links are present and visible
		// /tools is a dropdown button, not a direct <a> link
		for (const href of [
			"/work",
			"/services",
			"/technologies",
			"/blog",
			"/newsletter",
			"/about",
			"/contact",
		]) {
			await expect(desktopNav.locator(`a[href="${href}"]`)).toBeVisible();
		}
		// Tools dropdown button is visible
		await expect(desktopNav.locator("button").filter({ hasText: "Tools" })).toBeVisible();

		// Test one click navigation to verify client-side routing works.
		// We use page.evaluate to click the link directly, bypassing Lenis
		// smooth scroll which intercepts pointer events at the <html> level.
		await page.evaluate(() => {
			const link = document.querySelector('nav a[href="/work"]') as HTMLAnchorElement;
			link?.click();
		});
		await expect(page).toHaveURL("/work");
	});

	test("mobile menu opens and closes", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto("/");
		await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();

		const menuButton = page.getByRole("button", { name: /open menu/i });
		await expect(menuButton).toBeVisible();

		await menuButton.click();

		const closeButton = page.getByRole("button", { name: /close menu/i });
		await expect(closeButton).toBeVisible();

		await closeButton.click();

		await expect(page.getByRole("button", { name: /open menu/i })).toBeVisible();
	});

	test("mobile menu navigation works", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto("/");
		await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();

		const menuButton = page.getByRole("button", { name: /open menu/i });
		await menuButton.click();

		const mobileMenu = page.locator("nav div.lg\\:hidden");
		await expect(mobileMenu).toBeVisible();

		await mobileMenu.locator('a[href="/work"]').click();
		await expect(page).toHaveURL("/work");
	});

	test("active link is highlighted", async ({ page, viewport }) => {
		const isMobile = viewport && viewport.width < 1024;
		if (isMobile) {
			test.skip();
			return;
		}

		await page.goto("/work");
		await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();

		const desktopNav = page.locator("nav > div > div.hidden.lg\\:flex");
		const workLink = desktopNav.locator('a[href="/work"]');
		await expect(workLink).toHaveClass(/text-cyber-lime/);
	});

	test("logo links to home", async ({ page }) => {
		await page.goto("/work");
		await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();

		const logoLink = page.locator('header a[href="/"]').first();
		await logoLink.click();
		await expect(page).toHaveURL("/");
	});
});
