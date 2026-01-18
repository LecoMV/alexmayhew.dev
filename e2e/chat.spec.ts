import { test, expect } from "@playwright/test";

test.describe("Chat Widget", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");
		// Wait for chat widget to render
		await page.waitForTimeout(500);
	});

	test("chat toggle button is visible", async ({ page }) => {
		// Chat button has aria-label "Open chat" when closed
		const chatButton = page.locator('button[aria-label="Open chat"]');
		await expect(chatButton).toBeVisible();
	});

	test("chat widget can be opened", async ({ page }) => {
		// Click to open chat
		const openButton = page.locator('button[aria-label="Open chat"]');
		await openButton.click();

		// Wait for animation
		await page.waitForTimeout(300);

		// Chat window should be visible
		const chatInput = page.locator('input[placeholder="Ask me anything..."]');
		await expect(chatInput).toBeVisible();
	});

	test("chat widget can be closed", async ({ page }) => {
		// Open chat
		await page.locator('button[aria-label="Open chat"]').click();
		await page.waitForTimeout(300);

		// Close chat
		await page.locator('button[aria-label="Close chat"]').click();
		await page.waitForTimeout(300);

		// Open button should be visible again
		await expect(page.locator('button[aria-label="Open chat"]')).toBeVisible();
	});

	test("chat has welcome message", async ({ page }) => {
		// Open chat
		await page.locator('button[aria-label="Open chat"]').click();
		await page.waitForTimeout(300);

		// Welcome message should be visible
		const welcomeMessage = page.locator("text=/Alex.*AI assistant/i");
		await expect(welcomeMessage).toBeVisible();
	});

	test("chat input is functional", async ({ page }) => {
		// Open chat
		await page.locator('button[aria-label="Open chat"]').click();
		await page.waitForTimeout(300);

		// Type in input
		const input = page.locator('input[placeholder="Ask me anything..."]');
		await input.fill("Hello");

		// Send button should be enabled
		const sendButton = page.locator('button[aria-label="Send message"]');
		await expect(sendButton).toBeEnabled();
	});

	test("chat is accessible on mobile", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto("/");
		await page.waitForLoadState("networkidle");
		await page.waitForTimeout(500);

		// Chat button should still be visible
		const chatButton = page.locator('button[aria-label="Open chat"]');
		await expect(chatButton).toBeVisible();
	});
});
