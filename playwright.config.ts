import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [["html", { open: "never" }], ["list"]],
	use: {
		baseURL: "http://localhost:3001",
		trace: "on-first-retry",
		screenshot: "only-on-failure",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: "mobile-chrome",
			use: { ...devices["Pixel 5"] },
		},
	],
	webServer: {
		// Use 'next start' in CI (serves built app), 'next dev' without OpenNext locally
		// PLAYWRIGHT=1 disables OpenNext Cloudflare integration to avoid wrangler auth
		command: process.env.CI
			? "npm run start -- --port 3001"
			: "PLAYWRIGHT=1 npx next dev --turbopack --port 3001",
		url: "http://localhost:3001",
		reuseExistingServer: true, // Always reuse if server is already running
		timeout: 120000,
	},
});
