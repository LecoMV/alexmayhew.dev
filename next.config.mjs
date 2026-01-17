import { createMDX } from "fumadocs-mdx/next";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,

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

export default withMDX(config);

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
// Only initialize in development mode to avoid proxy issues during production builds
if (process.env.NODE_ENV === "development") {
	import("@opennextjs/cloudflare").then(({ initOpenNextCloudflareForDev }) => {
		initOpenNextCloudflareForDev();
	});
}
