import { expect, test } from "@playwright/test";

test.describe("Navigation", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
		// Use domcontentloaded instead of networkidle — Next.js 15 prefetching
		// keeps the network active indefinitely, causing networkidle to never settle
		await page.waitForLoadState("domcontentloaded");
		await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
	});

	test("navigation links work correctly", async ({ page, viewport }) => {
		const isMobile = viewport && viewport.width < 1024;
		if (isMobile) {
			test.skip();
			return;
		}

		const desktopNav = page.locator("nav > div > div.hidden.lg\\:flex");

		// Use force:true to bypass Lenis smooth scroll intercepting pointer events.
		// Lenis attaches to <html> and intercepts clicks during scroll animations,
		// causing Playwright's actionability check to time out waiting for the
		// overlay to clear.
		await desktopNav.locator('a[href="/work"]').click({ force: true });
		await expect(page).toHaveURL("/work");

		await desktopNav.locator('a[href="/about"]').click({ force: true });
		await expect(page).toHaveURL("/about");

		await desktopNav.locator('a[href="/contact"]').click({ force: true });
		await expect(page).toHaveURL("/contact");

		await desktopNav.locator('a[href="/blog"]').click({ force: true });
		await expect(page).toHaveURL("/blog");

		await page.locator('header a[href="/"]').first().click({ force: true });
		await expect(page).toHaveURL("/");
	});

	test("mobile menu opens and closes", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto("/");
		await page.waitForLoadState("domcontentloaded");

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
		await page.waitForLoadState("domcontentloaded");

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
		await page.waitForLoadState("domcontentloaded");

		const desktopNav = page.locator("nav > div > div.hidden.lg\\:flex");
		const workLink = desktopNav.locator('a[href="/work"]');
		await expect(workLink).toHaveClass(/text-cyber-lime/);
	});

	test("logo links to home", async ({ page }) => {
		await page.goto("/work");
		await page.waitForLoadState("domcontentloaded");

		const logoLink = page.locator('header a[href="/"]').first();
		await logoLink.click();
		await expect(page).toHaveURL("/");
	});
});
