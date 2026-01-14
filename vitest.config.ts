import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./tests/setup.ts"],
		include: ["./tests/**/*.{test,spec}.{ts,tsx}", "./src/**/*.{test,spec}.{ts,tsx}"],
		exclude: ["node_modules", ".next", "e2e"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html", "lcov", "cobertura"],
			reportsDirectory: "./coverage",
			exclude: [
				"node_modules/",
				".next/",
				"tests/",
				"e2e/",
				"**/*.d.ts",
				"**/*.config.*",
				"**/types/**",
				"src/app/layout.tsx",
				"src/app/fonts.ts",
			],
			thresholds: {
				global: {
					branches: 80,
					functions: 80,
					lines: 80,
					statements: 80,
				},
			},
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
