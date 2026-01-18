import { test, expect } from "@playwright/test";

test.describe("SEO", () => {
	test("home page has proper meta tags", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		// Title
		await expect(page).toHaveTitle(/Alex Mayhew/i);

		// Meta description
		const description = page.locator('meta[name="description"]');
		await expect(description).toHaveAttribute("content", /.+/);

		// Open Graph tags
		const ogTitle = page.locator('meta[property="og:title"]');
		await expect(ogTitle).toHaveAttribute("content", /.+/);

		const ogDescription = page.locator('meta[property="og:description"]');
		await expect(ogDescription).toHaveAttribute("content", /.+/);

		const ogImage = page.locator('meta[property="og:image"]');
		await expect(ogImage).toHaveAttribute("content", /.+/);

		// Twitter tags
		const twitterCard = page.locator('meta[name="twitter:card"]');
		await expect(twitterCard).toHaveAttribute("content", "summary_large_image");
	});

	test("canonical URL is set", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		const canonical = page.locator('link[rel="canonical"]');
		await expect(canonical).toHaveAttribute("href", /alexmayhew\.dev/);
	});

	test("robots meta allows indexing", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		// Either no robots meta (default allows) or explicit follow/index
		const robots = page.locator('meta[name="robots"]');
		const exists = (await robots.count()) > 0;

		if (exists) {
			const content = await robots.getAttribute("content");
			expect(content).not.toContain("noindex");
		}
		// If no robots meta, indexing is allowed by default
	});

	test("sitemap is accessible", async ({ page }) => {
		const response = await page.goto("/sitemap.xml");
		expect(response?.status()).toBe(200);
	});

	test("robots.txt is accessible", async ({ page }) => {
		const response = await page.goto("/robots.txt");
		expect(response?.status()).toBe(200);
	});

	test("JSON-LD structured data is present", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		const jsonLd = page.locator('script[type="application/ld+json"]');
		await expect(jsonLd.first()).toBeAttached();

		// Parse and validate JSON-LD
		const content = await jsonLd.first().textContent();
		expect(content).toBeTruthy();

		// Should be valid JSON
		const data = JSON.parse(content!);
		expect(data["@context"]).toBeTruthy();
	});

	test("pages have unique titles", async ({ page }) => {
		const titles: string[] = [];
		const pages = ["/", "/work", "/about", "/contact", "/blog"];

		for (const path of pages) {
			await page.goto(path);
			await page.waitForLoadState("networkidle");
			const title = await page.title();
			titles.push(title);
		}

		// All titles should be unique
		const uniqueTitles = new Set(titles);
		expect(uniqueTitles.size).toBe(pages.length);
	});

	test("meta description exists on main pages", async ({ page }) => {
		const pages = ["/", "/work", "/about", "/contact", "/blog"];

		for (const path of pages) {
			await page.goto(path);
			await page.waitForLoadState("networkidle");

			const description = page.locator('meta[name="description"]');
			await expect(description).toHaveAttribute("content", /.+/);
		}
	});
});
