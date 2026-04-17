import { readFileSync } from "fs";

import { describe, expect, it } from "vitest";

import { register } from "@/instrumentation";

describe("instrumentation", () => {
	it("register is an async function that resolves", async () => {
		await expect(register()).resolves.toBeUndefined();
	});

	it("loads the server config under the Node.js runtime", () => {
		const source = readFileSync("src/instrumentation.ts", "utf-8");
		expect(source).toMatch(/NEXT_RUNTIME === ['"]nodejs['"]/);
		expect(source).toMatch(/import\(['"]\.\.\/sentry\.server\.config['"]\)/);
	});

	it("loads the edge config under the Edge runtime", () => {
		const source = readFileSync("src/instrumentation.ts", "utf-8");
		expect(source).toMatch(/NEXT_RUNTIME === ['"]edge['"]/);
		expect(source).toMatch(/import\(['"]\.\.\/sentry\.edge\.config['"]\)/);
	});

	it("re-exports onRequestError from @sentry/nextjs", () => {
		const source = readFileSync("src/instrumentation.ts", "utf-8");
		expect(source).toMatch(/captureRequestError as onRequestError.*@sentry\/nextjs/s);
	});
});
