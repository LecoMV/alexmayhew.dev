import { describe, expect, it } from "vitest";

import { register } from "@/instrumentation";

describe("instrumentation", () => {
	it("register is an async function that resolves", async () => {
		await expect(register()).resolves.toBeUndefined();
	});
});
