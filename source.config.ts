import { defineDocs, defineCollections, defineConfig } from "fumadocs-mdx/config";
import { z } from "zod";

// Documentation collection (Fumadocs native)
export const { docs, meta } = defineDocs({
	dir: "content/docs",
});

// Blog collection (custom)
export const blog = defineCollections({
	type: "doc",
	dir: "content/blog",
	schema: z.object({
		title: z.string(),
		description: z.string(),
		publishedAt: z.string().transform((s) => new Date(s)),
		category: z.enum(["engineering", "architecture", "devops", "ai-ml"]),
		tags: z.array(z.string()).default([]),
		draft: z.boolean().default(false),
	}),
});

export default defineConfig();
