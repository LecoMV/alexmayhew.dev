import { readFileSync } from "fs";

import { describe, expect, it } from "vitest";

import { register } from "@/instrumentation";

describe("instrumentation", () => {
	it("register is a function that does not throw", () => {
		expect(() => register()).not.toThrow();
	});

	it("is a no-op on OpenNext-Cloudflare to avoid @sentry/nextjs Node-only imports", () => {
		const source = readFileSync("src/instrumentation.ts", "utf-8");
		expect(source).not.toMatch(/from ['"]@sentry\/nextjs['"]/);
		expect(source).not.toMatch(/import\(['"]\.\.\/sentry\.(server|edge)\.config['"]\)/);
	});

	it("documents why it is a no-op (prevents future regressions)", () => {
		const source = readFileSync("src/instrumentation.ts", "utf-8");
		expect(source).toMatch(/custom-worker\.ts|@sentry\/cloudflare|Workers runtime/i);
	});
});
