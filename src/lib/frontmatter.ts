/**
 * Frontmatter parsing utilities extracted from blog index generator.
 * Pure functions for parsing MDX frontmatter and inline tag arrays.
 */

export function parseTags(raw: string): string[] {
	const inlineMatch = raw.match(/^\[(.+)\]$/);
	if (inlineMatch) {
		return inlineMatch[1].split(",").map((t) => t.trim().replace(/^["']|["']$/g, ""));
	}
	return [];
}

export function parseFrontmatter(content: string): Record<string, string> {
	const match = content.match(/^---\n([\s\S]*?)\n---/);
	if (!match) return {};

	const fields: Record<string, string> = {};
	const lines = match[1].split("\n");
	let currentKey = "";

	for (const line of lines) {
		const arrayItemMatch = line.match(/^\s+-\s+(.+)/);
		if (arrayItemMatch && currentKey) {
			const existing = fields[currentKey];
			if (existing) {
				fields[currentKey] = existing + "," + arrayItemMatch[1].trim();
			} else {
				fields[currentKey] = arrayItemMatch[1].trim();
			}
			continue;
		}

		const kvMatch = line.match(/^(\w[\w-]*)\s*:\s*(.*)/);
		if (kvMatch) {
			currentKey = kvMatch[1];
			const value = kvMatch[2].trim().replace(/^["']|["']$/g, "");
			fields[currentKey] = value;
		}
	}

	return fields;
}
