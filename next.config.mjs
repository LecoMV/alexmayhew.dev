import { createMDX } from "fumadocs-mdx/next";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);

// Get git SHA for version display
function getGitSha() {
	try {
		// Use Cloudflare Pages env if available, otherwise get from git
		return (
			process.env.CF_PAGES_COMMIT_SHA ||
			execSync("git rev-parse --short HEAD", { encoding: "utf-8" }).trim()
		);
	} catch {
		return "unknown";
	}
}

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,

	// Environment variables for footer
	env: {
		NEXT_PUBLIC_SITE_VERSION: process.env.npm_package_version || "0.1.0",
		NEXT_PUBLIC_GIT_SHA: getGitSha(),
	},

	// Performance optimizations
	experimental: {
		// Enable CSS optimization for reduced CSS bundle size
		optimizeCss: true,
		// Tree-shake specific packages for smaller bundles
		optimizePackageImports: ["lucide-react", "framer-motion"],
	},

	// Remove console logs in production for smaller bundle
	compiler: {
		removeConsole: process.env.NODE_ENV === "production",
	},

	// Webpack cache configuration to prevent corruption
	webpack: (config, { dev, isServer }) => {
		// In development, clear managedPaths to detect node_modules changes
		if (dev) {
			config.snapshot = config.snapshot || {};
			config.snapshot.managedPaths = [];
		}

		// Configure cache with build dependencies for proper invalidation
		if (config.cache && typeof config.cache === "object") {
			config.cache = {
				...config.cache,
				buildDependencies: {
					...config.cache.buildDependencies,
					config: [__filename],
				},
				// Cache version tied to package version - update triggers invalidation
				version: `${process.env.npm_package_version || "0.1.0"}-${isServer ? "server" : "client"}`,
			};
		}

		return config;
	},

	// Fail-safe security headers for static assets
	headers: async () => {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
				],
			},
		];
	},
};

const withMDX = createMDX();

export default withMDX(config);

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
// Only initialize in development mode to avoid proxy issues during production builds
// Skip during E2E tests (PLAYWRIGHT=1) to avoid wrangler authentication requirements
if (process.env.NODE_ENV === "development" && !process.env.PLAYWRIGHT) {
	import("@opennextjs/cloudflare").then(({ initOpenNextCloudflareForDev }) => {
		initOpenNextCloudflareForDev();
	});
}
