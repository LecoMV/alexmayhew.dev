import { expect, test } from "@playwright/test";

const OPEN_CHAT_BUTTON = 'button[aria-label="Open chat"]';

test.describe("Chat Widget", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
		await expect(page.locator(OPEN_CHAT_BUTTON)).toBeVisible();
	});

	test("chat toggle button is visible", async ({ page }) => {
		const chatButton = page.locator(OPEN_CHAT_BUTTON);
		await expect(chatButton).toBeVisible();
	});

	test("chat widget can be opened and closed", async ({ page }) => {
		await page.locator(OPEN_CHAT_BUTTON).click();
		await expect(page.locator('button[aria-label="Close chat"]')).toBeVisible();

		await page.locator('button[aria-label="Close chat"]').click();
		await expect(page.locator(OPEN_CHAT_BUTTON)).toBeVisible();
	});

	test("chat input is functional", async ({ page }) => {
		await page.locator(OPEN_CHAT_BUTTON).click();
		await expect(page.locator('input[placeholder="Ask me anything..."]')).toBeVisible();

		const input = page.locator('input[placeholder="Ask me anything..."]');
		await input.fill("Hello");

		// Send button should be enabled
		const sendButton = page.locator('button[aria-label="Send message"]');
		await expect(sendButton).toBeEnabled();
	});
});
