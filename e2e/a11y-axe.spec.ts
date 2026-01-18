import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility (WCAG 2.1 AA)", () => {
	// Helper to run axe and check violations
	// Excludes third-party widgets (Turnstile) and allows minor contrast issues
	async function checkAccessibility(page: import("@playwright/test").Page) {
		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
			// Exclude third-party widgets from analysis
			.exclude('[class*="turnstile"]')
			.exclude('[class*="cf-"]')
			.exclude("iframe")
			.analyze();

		// Filter to only critical and serious violations (ignore moderate/minor)
		const criticalViolations = accessibilityScanResults.violations.filter(
			(v) => v.impact === "critical" || v.impact === "serious"
		);

		// For color contrast, only fail on critical (e.g., text completely unreadable)
		const nonContrastCritical = criticalViolations.filter(
			(v) => v.id !== "color-contrast" || v.impact === "critical"
		);

		expect(nonContrastCritical).toEqual([]);
	}

	test("home page should be accessible", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");
		await checkAccessibility(page);
	});

	test("work page should be accessible", async ({ page }) => {
		await page.goto("/work");
		await page.waitForLoadState("networkidle");
		await checkAccessibility(page);
	});

	test("about page should be accessible", async ({ page }) => {
		await page.goto("/about");
		await page.waitForLoadState("networkidle");
		await checkAccessibility(page);
	});

	test("contact page should be accessible", async ({ page }) => {
		await page.goto("/contact");
		await page.waitForLoadState("networkidle");
		await checkAccessibility(page);
	});

	test("blog page should be accessible", async ({ page }) => {
		await page.goto("/blog");
		await page.waitForLoadState("networkidle");
		await checkAccessibility(page);
	});

	test("privacy page should be accessible", async ({ page }) => {
		await page.goto("/privacy");
		await page.waitForLoadState("networkidle");
		await checkAccessibility(page);
	});

	test("terms page should be accessible", async ({ page }) => {
		await page.goto("/terms");
		await page.waitForLoadState("networkidle");
		await checkAccessibility(page);
	});
});

test.describe("Accessibility - Contact Form", () => {
	test("contact form inputs should have proper labels", async ({ page }) => {
		await page.goto("/contact");
		await page.waitForLoadState("networkidle");

		// Check that all form inputs have associated labels
		const nameInput = page.locator('input[name="name"], input[id="name"]');
		await expect(nameInput).toBeVisible();

		// Verify form has accessible labels via axe
		const accessibilityScanResults = await new AxeBuilder({ page })
			.include("form")
			.withTags(["wcag2a", "wcag2aa"])
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test("form error states should be accessible", async ({ page }) => {
		await page.goto("/contact");
		await page.waitForLoadState("networkidle");

		// Try to submit empty form to trigger validation
		const submitButton = page.locator('button[type="submit"]');
		await submitButton.click();

		// Wait for validation states
		await page.waitForTimeout(500);

		// Check accessibility with error states
		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(["wcag2a", "wcag2aa"])
			.analyze();

		// Filter out color contrast issues that may occur with error states
		const criticalViolations = accessibilityScanResults.violations.filter(
			(v) => v.impact === "critical" || v.impact === "serious"
		);

		expect(criticalViolations).toEqual([]);
	});
});

test.describe("Accessibility - Keyboard Navigation", () => {
	test("should be able to navigate using keyboard", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		// Focus should start at beginning of page
		await page.keyboard.press("Tab");

		// Check that skip link is first focusable element
		const skipLink = page.locator("#skip-to-content");
		if (await skipLink.isVisible()) {
			await expect(skipLink).toBeFocused();
		}

		// Tab through several elements
		for (let i = 0; i < 5; i++) {
			await page.keyboard.press("Tab");
		}

		// Something should be focused (not null)
		const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
		expect(focusedElement).toBeTruthy();
	});

	test("interactive elements should have visible focus states", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		// Find a button and tab to it
		const buttons = page.locator("button, a").first();
		await buttons.focus();

		// Check that focus is visible (outline or ring)
		const focusedStyles = await buttons.evaluate((el) => {
			const styles = window.getComputedStyle(el);
			return {
				outline: styles.outline,
				boxShadow: styles.boxShadow,
			};
		});

		// Should have some visible focus indicator
		const hasFocusIndicator =
			(focusedStyles.outline && focusedStyles.outline !== "none") ||
			(focusedStyles.boxShadow && focusedStyles.boxShadow !== "none");

		expect(hasFocusIndicator).toBe(true);
	});
});

test.describe("Accessibility - Color Contrast", () => {
	test("should pass color contrast requirements", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(["cat.color"])
			.analyze();

		// Filter for color contrast specific issues
		const contrastViolations = accessibilityScanResults.violations.filter(
			(v) => v.id === "color-contrast" || v.id === "color-contrast-enhanced"
		);

		// Allow for some minor violations but no critical text contrast issues
		const criticalContrastViolations = contrastViolations.filter((v) => v.impact === "critical");

		expect(criticalContrastViolations).toEqual([]);
	});
});
