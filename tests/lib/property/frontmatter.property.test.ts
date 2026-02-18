import { fc, test } from "@fast-check/vitest";
import { describe } from "vitest";

import { parseFrontmatter, parseTags } from "@/lib/frontmatter";

describe("parseTags properties", () => {
	test.prop([fc.string()])("always returns an array", (raw) => {
		return Array.isArray(parseTags(raw));
	});

	// Tags in frontmatter are single-line, no quotes/commas/brackets
	const tagArb = fc.array(
		fc.stringMatching(/^[a-zA-Z0-9 _.#+-]{1,20}$/).filter((s) => s === s.trim() && s.length > 0),
		{ minLength: 1, maxLength: 8 }
	);

	test.prop([tagArb])("inline format round-trips", (tags) => {
		const raw = `["${tags.join('","')}"]`;
		const result = parseTags(raw);
		return result.length === tags.length;
	});

	test.prop([tagArb])("parsed tags are trimmed", (tags) => {
		const raw = `["${tags.join('","')}"]`;
		return parseTags(raw).every((t) => t === t.trim());
	});

	test.prop([fc.string().filter((s) => !s.startsWith("[") || !s.endsWith("]"))])(
		"non-bracket input returns empty array",
		(raw) => {
			return parseTags(raw).length === 0;
		}
	);
});

describe("parseFrontmatter properties", () => {
	test.prop([fc.string().filter((s) => !s.startsWith("---\n"))])(
		"no frontmatter returns empty object",
		(content) => {
			const result = parseFrontmatter(content);
			return Object.keys(result).length === 0;
		}
	);

	const PROTO_KEYS = new Set(["__proto__", "constructor", "prototype"]);
	const keyArb = fc
		.string({ unit: "grapheme", minLength: 1, maxLength: 15 })
		.filter((s) => /^\w[\w-]*$/.test(s) && !PROTO_KEYS.has(s));

	const valueArb = fc
		.string({ unit: "grapheme", minLength: 1, maxLength: 50 })
		.filter(
			(s) =>
				!s.includes("\n") &&
				!s.startsWith('"') &&
				!s.endsWith('"') &&
				!s.startsWith("'") &&
				!s.endsWith("'")
		);

	test.prop([keyArb, valueArb])("key-value pairs are parsed", (key, value) => {
		const content = `---\n${key}: ${value}\n---\n\nBody`;
		const result = parseFrontmatter(content);
		return key in result;
	});

	test.prop([keyArb, valueArb])("values are trimmed", (key, value) => {
		const content = `---\n${key}:   ${value}   \n---\n\nBody`;
		const result = parseFrontmatter(content);
		return result[key] === result[key]?.trim();
	});

	test.prop([
		keyArb,
		fc
			.string({ minLength: 1, maxLength: 30 })
			.filter((s) => !s.includes("\n") && !s.includes('"') && !s.includes("'")),
	])("surrounding quotes are stripped", (key, inner) => {
		const content = `---\n${key}: "${inner}"\n---\n\nBody`;
		const result = parseFrontmatter(content);
		return result[key] !== undefined && !result[key].startsWith('"') && !result[key].endsWith('"');
	});
});
