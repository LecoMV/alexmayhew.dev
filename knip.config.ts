import type { KnipConfig } from "knip";

const config: KnipConfig = {
	entry: [
		"src/app/**/page.tsx",
		"src/app/**/layout.tsx",
		"src/app/**/route.ts",
		"src/app/**/error.tsx",
		"src/app/**/not-found.tsx",
		"source.config.ts",
		"sentry.*.config.ts",
	],
	project: ["src/**/*.{ts,tsx}"],
	ignore: [
		".source/**",
		".open-next/**",
		".next/**",
		"cloudflare-env.d.ts",
		"src/app/api/keystatic/**",
	],
	ignoreDependencies: [
		"critters",
		"@lhci/cli",
		"@types/testing-library__jest-dom",
		"lint-staged",
		"husky",
		"wrangler",
		"ts-morph",
	],
	next: {
		entry: ["src/app/**/page.tsx", "src/app/**/layout.tsx", "src/app/**/route.ts"],
	},
};

export default config;
