import { expect, test } from "@playwright/test";

const OPEN_CHAT_BUTTON = 'button[aria-label="Open chat"]';
const CLOSE_CHAT_BUTTON = 'button[aria-label="Close chat"]';

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

		const dialog = page.locator('dialog, [role="dialog"], [aria-label*="Assistant"]');
		await expect(dialog).toBeVisible({ timeout: 10_000 });

		const headerClose = dialog.locator('button[aria-label="Close chat"]');
		await headerClose.click();
		await expect(dialog).not.toBeVisible();
	});

	test("chat input is functional", async ({ page }) => {
		await page.locator(OPEN_CHAT_BUTTON).click();

		const input = page.locator('input[placeholder="Ask me anything..."]');
		await expect(input).toBeVisible({ timeout: 10_000 });
		await input.fill("Hello");

		const sendButton = page.locator('button[aria-label="Send message"]');
		await expect(sendButton).toBeEnabled();
	});
});
