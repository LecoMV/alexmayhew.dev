import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

/**
 * OpenNext Cloudflare Configuration
 *
 * R2 Incremental Cache:
 * - Stores ISR/cache data in R2 for persistence across deployments
 * - Reduces TTFB by serving cached content from edge
 * - Requires R2 bucket binding "NEXT_INC_CACHE_R2_BUCKET" in wrangler.jsonc
 *
 * Regional Cache:
 * - Cache is distributed across Cloudflare's global network
 * - First request to each region is cold, subsequent requests are cached
 * - Combined with stale-while-revalidate for optimal performance
 *
 * See: https://opennext.js.org/cloudflare/caching
 */
export default defineCloudflareConfig({
	// Enable R2 incremental cache for persistent caching across deployments
	incrementalCache: r2IncrementalCache,
});
