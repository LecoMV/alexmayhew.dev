import { expect, test } from "@playwright/test";

test.describe("Chat Widget", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
		await expect(page.locator('button[aria-label="Open chat"]')).toBeVisible();
	});

	test("chat toggle button is visible", async ({ page }) => {
		const chatButton = page.locator('button[aria-label="Open chat"]');
		await expect(chatButton).toBeVisible();
	});

	test("chat widget can be opened and closed", async ({ page }) => {
		await page.locator('button[aria-label="Open chat"]').click();
		await expect(page.locator('button[aria-label="Close chat"]')).toBeVisible();

		await page.locator('button[aria-label="Close chat"]').click();
		await expect(page.locator('button[aria-label="Open chat"]')).toBeVisible();
	});

	test("chat input is functional", async ({ page }) => {
		await page.locator('button[aria-label="Open chat"]').click();
		await expect(page.locator('input[placeholder="Ask me anything..."]')).toBeVisible();

		const input = page.locator('input[placeholder="Ask me anything..."]');
		await input.fill("Hello");

		// Send button should be enabled
		const sendButton = page.locator('button[aria-label="Send message"]');
		await expect(sendButton).toBeEnabled();
	});
});
