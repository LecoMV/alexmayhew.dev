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
	schema: z
		.object({
			title: z.string(),
			description: z.string(),
			// Accept both 'date' and 'publishedAt' by using union with preprocessing
			date: z.string().optional(),
			publishedAt: z.string().optional(),
			updatedAt: z.string().optional(),
			category: z.enum(["engineering", "architecture", "business", "frontend", "infrastructure"]),
			tags: z.array(z.string()).default([]),
			image: z.string().optional(),
			readingTime: z.string().optional(),
			draft: z.boolean().default(false),
			// Hub and series fields for content clusters
			isHub: z.boolean().default(false),
			series: z.string().optional(),
		})
		.transform((data) => ({
			...data,
			// Normalize to publishedAt
			publishedAt: new Date(data.publishedAt || data.date || ""),
			// updatedAt falls back to publishedAt for dateModified signals
			updatedAt: data.updatedAt
				? new Date(data.updatedAt)
				: new Date(data.publishedAt || data.date || ""),
		})),
});

// Newsletter collection
export const newsletter = defineCollections({
	type: "doc",
	dir: "content/newsletter/issues",
	schema: z
		.object({
			issue: z.number(),
			title: z.string(),
			subject: z.string(),
			sendDate: z.string(),
			status: z.enum(["draft", "reviewed", "scheduled", "sent"]).default("draft"),
			pillar: z.string().optional(),
		})
		.transform((data) => ({
			...data,
			publishedAt: new Date(data.sendDate),
		})),
});

export default defineConfig({
	mdxOptions: {
		rehypeCodeOptions: {
			themes: {
				light: "github-dark",
				dark: "github-dark",
			},
		},
	},
});
