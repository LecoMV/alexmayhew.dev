import * as fs from "node:fs";
import * as path from "node:path";

import { parseFrontmatter, parseTags } from "../src/lib/frontmatter";

interface BlogEntry {
	title: string;
	description: string;
	slug: string;
	category: string;
	tags: string[];
	series?: string;
}

function main() {
	const blogDir = path.resolve(__dirname, "../content/blog");
	const outputPath = path.resolve(__dirname, "../src/data/blog-index.json");

	const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));
	const entries: BlogEntry[] = [];

	for (const file of files) {
		const content = fs.readFileSync(path.join(blogDir, file), "utf-8");
		const fm = parseFrontmatter(content);

		if (fm.draft === "true") continue;

		const slug = file.replace(/\.mdx$/, "");

		let tags: string[] = [];
		if (fm.tags) {
			if (fm.tags.startsWith("[")) {
				tags = parseTags(fm.tags);
			} else {
				// Multi-line tags were accumulated comma-separated
				tags = fm.tags.split(",").map((t) => t.trim().replace(/^["']|["']$/g, ""));
			}
		}

		entries.push({
			title: fm.title || slug,
			description: fm.description || "",
			slug,
			category: fm.category || "engineering",
			tags,
			...(fm.series ? { series: fm.series } : {}),
		});
	}

	entries.sort((a, b) => a.title.localeCompare(b.title));

	fs.mkdirSync(path.dirname(outputPath), { recursive: true });
	fs.writeFileSync(outputPath, JSON.stringify(entries, null, "\t") + "\n");

	console.log(`Generated blog index: ${entries.length} posts → ${outputPath}`);
}

main();
