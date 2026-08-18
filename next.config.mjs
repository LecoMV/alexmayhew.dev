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

	// Force blocking (in-<head>) metadata for every user agent.
	//
	// Next 15.2+ streams metadata for any UA not matching `htmlLimitedBots`,
	// emitting <title>, <meta name="description">, og:*, twitter:* and
	// rel=canonical late in <body> rather than in <head>. Next's default regex
	// matches neither Googlebot nor any AI crawler (verified against
	// node_modules/next/dist/shared/lib/router/utils/html-bots.js). Measured on
	// production 2026-07-28: </head> closed at byte 10270 while <title> appeared
	// at byte 55562 for Googlebot, OAI-SearchBot, PerplexityBot, ClaudeBot and
	// ordinary browsers; only facebookexternalhit received a correct <head>.
	//
	// The tags did exist, so this was not a "titleless page" — Googlebot renders
	// JS and Next documents that it interprets streamed metadata. The defensible
	// problem is portability: body-placed metadata cannot be relied on for
	// HTML-limited crawlers that parse without executing JavaScript, and the
	// AI-answer-engine crawlers this site depends on are undocumented in that
	// respect. Head placement is the safe default.
	//
	// Matching everything disables streaming wholesale rather than allowlisting
	// UAs, because an allowlist silently rots as new crawlers ship. Cost is a
	// possible TTFB/LCP increase: Next streams the shell before generateMetadata
	// resolves. Acceptable here because every generateMetadata only awaits params
	// and reads local imported data. Revisit if any route's metadata ever needs a
	// database or network call, which would become a global TTFB dependency.
	htmlLimitedBots: /.*/,

	// Environment variables for footer
	env: {
		NEXT_PUBLIC_SITE_VERSION: process.env.npm_package_version || "0.1.0",
		NEXT_PUBLIC_GIT_SHA: getGitSha(),
	},

	// Permanent redirects.
	// `/tools/voice-cloner` was a duplicate marketing page for VoiceKeep. The
	// hosted product (voicekeep.io) has been retired, so this now points at the
	// internal case study, which keeps the URL alive and the link equity on-site.
	async redirects() {
		return [
			{
				source: "/tools/voice-cloner",
				destination: "/work/voice-cloner",
				permanent: true,
			},
			// The /for/[role] funnel marketed fractional-CTO / advisory engagements
			// Alex never held. Retired in the 2026-08 reposition. 301 the hub and
			// every role page to /services (the surviving consulting surface) so old
			// links keep their equity instead of 404ing.
			{
				source: "/for",
				destination: "/services",
				permanent: true,
			},
			{
				source: "/for/:role*",
				destination: "/services",
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
