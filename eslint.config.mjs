import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import deslop from "eslint-plugin-deslop";
import perfectionist from "eslint-plugin-perfectionist";
import sonarjs from "eslint-plugin-sonarjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	{
		ignores: [
			".next/**",
			".next.*/**",
			"node_modules/**",
			"coverage/**",
			"*.d.ts",
			".source/**",
			".open-next/**",
			".claude-flow/**",
			".wrangler/**",
		],
	},
	...compat.extends("next/core-web-vitals", "next/typescript"),
	{
		rules: {
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
					destructuredArrayIgnorePattern: "^_",
				},
			],
		},
	},
	{
		plugins: {
			perfectionist,
		},
		rules: {
			"perfectionist/sort-imports": [
				"warn",
				{
					type: "natural",
					groups: ["builtin", "external", "internal", ["parent", "sibling", "index"], "type"],
					newlinesBetween: 1,
					internalPattern: ["^@/.*"],
				},
			],
			"perfectionist/sort-named-imports": ["warn", { type: "natural" }],
			"perfectionist/sort-named-exports": ["warn", { type: "natural" }],
		},
	},
	{
		plugins: {
			sonarjs,
		},
		rules: {
			"sonarjs/cognitive-complexity": ["warn", 15],
			"sonarjs/no-duplicate-string": ["warn", { threshold: 4 }],
			"sonarjs/no-identical-functions": "warn",
		},
	},
	{
		plugins: { deslop },
		rules: {
			"deslop/no-excessive-comments": ["warn", { maxDensity: 0.5 }],
			"deslop/no-obvious-comments": ["warn", { checkVariableNames: true }],
		},
	},
];

export default eslintConfig;
