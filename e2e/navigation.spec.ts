import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");
	});

	test("navigation links work correctly", async ({ page, viewport }) => {
		// Skip this test on mobile viewports - mobile nav is tested separately
		const isMobile = viewport && viewport.width < 768;
		if (isMobile) {
			test.skip();
			return;
		}

		// Use desktop viewport - target visible desktop nav links
		// Desktop nav is in a div that's hidden on mobile (hidden md:flex)
		const desktopNav = page.locator("nav > div > div.hidden.md\\:flex");

		// Navigate to Work page
		await desktopNav.locator('a[href="/work"]').click();
		await page.waitForLoadState("networkidle");
		await expect(page).toHaveURL("/work");

		// Navigate to About page
		await desktopNav.locator('a[href="/about"]').click();
		await page.waitForLoadState("networkidle");
		await expect(page).toHaveURL("/about");

		// Navigate to Contact page
		await desktopNav.locator('a[href="/contact"]').click();
		await page.waitForLoadState("networkidle");
		await expect(page).toHaveURL("/contact");

		// Navigate to Blog page
		await desktopNav.locator('a[href="/blog"]').click();
		await page.waitForLoadState("networkidle");
		await expect(page).toHaveURL("/blog");

		// Navigate back to Home via logo
		await page.click('header a[href="/"]');
		await page.waitForLoadState("networkidle");
		await expect(page).toHaveURL("/");
	});

	test("mobile menu opens and closes", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		// Menu button should be visible on mobile
		const menuButton = page.getByRole("button", { name: /open menu/i });
		await expect(menuButton).toBeVisible();

		// Open menu
		await menuButton.click();
		await page.waitForTimeout(500); // Wait for animation

		// Close button should now be visible
		const closeButton = page.getByRole("button", { name: /close menu/i });
		await expect(closeButton).toBeVisible();

		// Click close button
		await closeButton.click();
		await page.waitForTimeout(500); // Wait for animation

		// Menu button should be visible again
		await expect(page.getByRole("button", { name: /open menu/i })).toBeVisible();
	});

	test("mobile menu navigation works", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		// Open menu
		const menuButton = page.getByRole("button", { name: /open menu/i });
		await menuButton.click();
		await page.waitForTimeout(500); // Wait for animation to complete

		// Mobile menu should now be visible
		const mobileMenu = page.locator("nav div.md\\:hidden");
		await expect(mobileMenu).toBeVisible();

		// Click work link in mobile menu (use visible: true to only match visible elements)
		await mobileMenu.locator('a[href="/work"]').click();
		await page.waitForLoadState("networkidle");

		await expect(page).toHaveURL("/work");
	});

	test("active link is highlighted", async ({ page, viewport }) => {
		// Skip on mobile - desktop nav tests
		const isMobile = viewport && viewport.width < 768;
		if (isMobile) {
			test.skip();
			return;
		}

		await page.goto("/work");
		await page.waitForLoadState("networkidle");

		// Desktop nav - work link should have active styling (cyber-lime color)
		const desktopNav = page.locator("nav > div > div.hidden.md\\:flex");
		const workLink = desktopNav.locator('a[href="/work"]');
		await expect(workLink).toHaveClass(/text-cyber-lime/);
	});

	test("logo links to home", async ({ page }) => {
		await page.goto("/work");
		await page.waitForLoadState("networkidle");

		// Click logo/brand link (first link in header with href="/")
		const logoLink = page.locator('header a[href="/"]').first();
		await logoLink.click();
		await page.waitForLoadState("networkidle");

		await expect(page).toHaveURL("/");
	});
});
