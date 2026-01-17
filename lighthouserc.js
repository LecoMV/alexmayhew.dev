/**
 * Lighthouse CI Configuration
 * Run with: npx lhci autorun
 *
 * Performance budgets and assertions for CI/CD
 */

module.exports = {
	ci: {
		collect: {
			// URLs to test
			url: [
				"http://localhost:3000/",
				"http://localhost:3000/work",
				"http://localhost:3000/about",
				"http://localhost:3000/contact",
				"http://localhost:3000/blog",
			],
			// Number of runs per URL
			numberOfRuns: 3,
			// Start command
			startServerCommand: "npm run start",
			startServerReadyPattern: "Ready in",
			startServerReadyTimeout: 30000,
		},
		assert: {
			// Performance budgets
			assertions: {
				// Core Web Vitals
				"first-contentful-paint": ["warn", { maxNumericValue: 1800 }],
				"largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
				"cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
				"total-blocking-time": ["warn", { maxNumericValue: 300 }],
				interactive: ["warn", { maxNumericValue: 3800 }],

				// Category scores (0-1)
				"categories:performance": ["warn", { minScore: 0.9 }],
				"categories:accessibility": ["error", { minScore: 0.95 }],
				"categories:best-practices": ["warn", { minScore: 0.9 }],
				"categories:seo": ["error", { minScore: 0.95 }],

				// Specific audits
				"uses-responsive-images": "warn",
				"uses-optimized-images": "warn",
				"uses-text-compression": "error",
				"render-blocking-resources": "warn",
				"unused-css-rules": "warn",
				"unused-javascript": "warn",
			},
		},
		upload: {
			// Upload results to temporary public storage
			target: "temporary-public-storage",
		},
	},
};
