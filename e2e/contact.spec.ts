import { expect, type Page, test } from "@playwright/test";

const NAME_INPUT = 'input[name="name"]';

/**
 * Scope all field locators to the contact form to avoid collisions
 * with the footer newsletter signup (which also has name="email").
 */
function contactForm(page: Page) {
	return page.locator("form", { has: page.locator('textarea[name="message"]') });
}

test.describe("Contact Page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/contact");
		await expect(contactForm(page)).toBeVisible();
	});

	test("should display all form fields", async ({ page }) => {
		const form = contactForm(page);

		await expect(form.locator(NAME_INPUT)).toBeVisible();
		await expect(form.locator('input[name="email"]')).toBeVisible();
		await expect(form.locator('select[name="projectType"]')).toBeVisible();
		await expect(form.locator('select[name="budget"]')).toBeVisible();
		await expect(form.locator('textarea[name="message"]')).toBeVisible();

		const submitButton = form.locator('button[type="submit"]');
		await submitButton.scrollIntoViewIfNeeded();
		await expect(submitButton).toBeVisible();
	});

	test("should display project type options", async ({ page }) => {
		const select = contactForm(page).locator('select[name="projectType"]');
		await select.click();

		const options = await select.locator("option").allTextContents();
		const optionsLower = options.map((o) => o.toLowerCase());

		expect(
			optionsLower.some((o) => o.includes("web") || o.includes("application") || o.includes("app"))
		).toBe(true);
		expect(optionsLower.some((o) => o.includes("saas") || o.includes("platform"))).toBe(true);
	});

	test("should display budget options", async ({ page }) => {
		const select = contactForm(page).locator('select[name="budget"]');
		await select.click();

		const options = await select.locator("option").allTextContents();
		const optionsText = options.join(" ");

		expect(optionsText).toMatch(/5[,.]?000|5k/i);
		expect(optionsText).toMatch(/10[,.]?000|10k/i);
		expect(optionsText).toMatch(/25[,.]?000|25k/i);
		expect(optionsText).toMatch(/50[,.]?000|50k/i);
	});

	test("should be responsive on mobile", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto("/contact");

		await expect(contactForm(page).locator(NAME_INPUT)).toBeVisible();

		const body = page.locator("body");
		const bodyScrollWidth = await body.evaluate((el) => el.scrollWidth);
		const windowWidth = await body.evaluate(() => window.innerWidth);
		expect(bodyScrollWidth).toBeLessThanOrEqual(windowWidth + 16);
	});
});

test.describe("Contact Form Validation", () => {
	test("should prevent submission with empty required fields", async ({ page }) => {
		await page.goto("/contact");

		const form = contactForm(page);
		const submitButton = form.locator('button[type="submit"]');
		await submitButton.scrollIntoViewIfNeeded();
		await submitButton.click();

		await expect(page).toHaveURL(/contact/);
	});

	test("should accept valid form data", async ({ page }) => {
		await page.goto("/contact");

		const form = contactForm(page);

		await form.locator(NAME_INPUT).fill("Test User");
		await form.locator('input[name="email"]').fill("test@example.com");
		await form.locator('select[name="projectType"]').selectOption({ index: 1 });
		await form.locator('select[name="budget"]').selectOption({ index: 1 });
		await form
			.locator('textarea[name="message"]')
			.fill("This is a test message that is long enough to pass validation requirements.");

		const nameValue = await form.locator(NAME_INPUT).inputValue();
		expect(nameValue).toBe("Test User");
	});
});
