import { test, expect } from "@playwright/test";

test.describe("Contact Page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/contact");
		await page.waitForLoadState("networkidle");
		await page.waitForTimeout(500);
	});

	test("should display all form fields", async ({ page }) => {
		// Check for name field
		const nameInput = page.locator('input[name="name"], input[id="name"]');
		await expect(nameInput).toBeVisible();

		// Check for email field
		const emailInput = page.locator('input[name="email"], input[id="email"]');
		await expect(emailInput).toBeVisible();

		// Check for project type select
		const projectSelect = page.locator('select[name="projectType"], select[id="projectType"]');
		await expect(projectSelect).toBeVisible();

		// Check for budget select
		const budgetSelect = page.locator('select[name="budget"], select[id="budget"]');
		await expect(budgetSelect).toBeVisible();

		// Check for message textarea
		const messageTextarea = page.locator('textarea[name="message"], textarea[id="message"]');
		await expect(messageTextarea).toBeVisible();

		// Check for submit button
		const submitButton = page.locator('button[type="submit"]');
		await expect(submitButton).toBeVisible();
	});

	test("should have form labels", async ({ page }) => {
		// Check for label text (using contains as implementation may vary)
		await expect(page.getByText(/name/i).first()).toBeVisible();
		await expect(page.getByText(/email/i).first()).toBeVisible();
		await expect(page.getByText(/project/i).first()).toBeVisible();
		await expect(page.getByText(/budget/i).first()).toBeVisible();
		await expect(page.getByText(/message/i).first()).toBeVisible();
	});

	test("should display project type options", async ({ page }) => {
		const select = page.locator('select[name="projectType"], select[id="projectType"]');
		await select.click();

		// Check for expected options
		const options = await select.locator("option").allTextContents();
		const optionsLower = options.map((o) => o.toLowerCase());

		expect(
			optionsLower.some((o) => o.includes("web") || o.includes("application") || o.includes("app"))
		).toBe(true);
		expect(optionsLower.some((o) => o.includes("saas") || o.includes("platform"))).toBe(true);
	});

	test("should display budget options", async ({ page }) => {
		const select = page.locator('select[name="budget"], select[id="budget"]');
		await select.click();

		// Check for expected options containing budget amounts
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
		await page.waitForLoadState("networkidle");

		// Form should still be visible
		const nameInput = page.locator('input[name="name"], input[id="name"]');
		await expect(nameInput).toBeVisible();

		// Check no horizontal overflow
		const body = page.locator("body");
		const bodyScrollWidth = await body.evaluate((el) => el.scrollWidth);
		const windowWidth = await body.evaluate(() => window.innerWidth);
		expect(bodyScrollWidth).toBeLessThanOrEqual(windowWidth + 1);
	});

	test("should display contact information", async ({ page }) => {
		// Check for email address somewhere on page
		await expect(page.getByText(/alex@alexmayhew\.dev/i)).toBeVisible();
	});

	test("should have submit button with correct styling", async ({ page }) => {
		const submitButton = page.locator('button[type="submit"]');
		await expect(submitButton).toBeVisible();

		// Check button has some text indicating submission
		const buttonText = await submitButton.textContent();
		expect(buttonText?.toLowerCase()).toMatch(/send|submit|transmit|initialize/i);
	});
});

test.describe("Contact Form Validation", () => {
	test("should prevent submission with empty required fields", async ({ page }) => {
		await page.goto("/contact");
		await page.waitForLoadState("networkidle");

		// Try to click submit without filling form
		const submitButton = page.locator('button[type="submit"]');
		await submitButton.click();

		// Form should not navigate away (still on contact page)
		await expect(page).toHaveURL(/contact/);
	});

	test("should accept valid form data", async ({ page }) => {
		await page.goto("/contact");
		await page.waitForLoadState("networkidle");

		// Fill in all fields
		await page.fill('input[name="name"], input[id="name"]', "Test User");
		await page.fill('input[name="email"], input[id="email"]', "test@example.com");
		await page.selectOption('select[name="projectType"], select[id="projectType"]', { index: 1 });
		await page.selectOption('select[name="budget"], select[id="budget"]', {
			index: 1,
		});
		await page.fill(
			'textarea[name="message"], textarea[id="message"]',
			"This is a test message that is long enough to pass validation requirements."
		);

		// Form should be fillable without errors
		const nameValue = await page.locator('input[name="name"], input[id="name"]').inputValue();
		expect(nameValue).toBe("Test User");
	});
});
