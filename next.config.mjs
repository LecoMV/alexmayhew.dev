import { execSync } from "child_process";
import { fileURLToPath } from "url";

import { withSentryConfig } from "@sentry/nextjs";
import { createMDX } from "fumadocs-mdx/next";

const __filename = fileURLToPath(import.meta.url);

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

const config = {
	reactStrictMode: true,
	poweredByHeader: false,

	// Environment variables for footer
	env: {
		NEXT_PUBLIC_SITE_VERSION: process.env.npm_package_version || "0.1.0",
		NEXT_PUBLIC_GIT_SHA: getGitSha(),
	},

	// Permanent redirects.
	// `/tools/voice-cloner` was a duplicate marketing page for the VoiceKeep
	// product, which lives at voicekeep.io. 301 carries any residual link
	// equity to the canonical product URL; the UTM tag distinguishes this
	// placement from the hub-card / case-study outbound paths in GA4.
	async redirects() {
		return [
			{
				source: "/tools/voice-cloner",
				destination:
					"https://voicekeep.io/?utm_source=alexmayhew.dev&utm_medium=referral&utm_campaign=voicekeep_crosspromo&utm_content=tools-redirect",
				permanent: true,
			},
		];
	},

	// Performance optimizations
	experimental: {
		// Enable CSS optimization for reduced CSS bundle size
		optimizeCss: true,
		// Tree-shake specific packages for smaller bundles
		optimizePackageImports: ["lucide-react", "framer-motion"],
		// React Compiler (stable in Next 15.5+). Auto-memoizes components so
		// most manual useMemo/useCallback/React.memo become unnecessary.
		// Enabled 2026-04-17 after all components passed strict-rule review.
		reactCompiler: true,
	},

	// Image optimization
	// AVIF is served first (smaller than WebP at same quality for most photos);
	// WebP is the universal fallback. next/image negotiates via Accept header.
	images: {
		formats: ["image/avif", "image/webp"],
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
};

const withMDX = createMDX();

export default withSentryConfig(withMDX(config), {
	silent: true,
	sourcemaps: { disable: true },
	autoInstrumentServerFunctions: false,
	autoInstrumentMiddleware: false,
	autoInstrumentAppDirectory: false,
});

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
// Only initialize in development mode to avoid proxy issues during production builds
// Skip during E2E tests (PLAYWRIGHT=1) or local-only dev (SKIP_CF_DEV=1)
// to avoid wrangler authentication requirements
if (process.env.NODE_ENV === "development" && !process.env.PLAYWRIGHT && !process.env.SKIP_CF_DEV) {
	import("@opennextjs/cloudflare").then(({ initOpenNextCloudflareForDev }) => {
		initOpenNextCloudflareForDev();
	});
}
