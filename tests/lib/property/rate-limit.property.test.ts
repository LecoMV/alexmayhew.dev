import { fc, test } from "@fast-check/vitest";
import { afterEach, beforeEach, describe, vi } from "vitest";

import { checkRateLimit } from "@/lib/rate-limit";

describe("checkRateLimit properties", () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	const configArb = fc.record({
		limit: fc.integer({ min: 1, max: 20 }),
		windowSeconds: fc.integer({ min: 1, max: 3600 }),
	});

	test.prop([fc.uuid(), configArb])("first request always succeeds", (id, config) => {
		const result = checkRateLimit(`prop-${id}`, config);
		return result.success === true;
	});

	test.prop([fc.uuid(), configArb])("remaining never goes below zero", (id, config) => {
		const key = `prop-rem-${id}`;
		for (let i = 0; i < config.limit + 5; i++) {
			checkRateLimit(key, config);
		}
		const result = checkRateLimit(key, config);
		return result.remaining >= 0;
	});

	test.prop([fc.uuid(), configArb])("resetIn is always positive", (id, config) => {
		const result = checkRateLimit(`prop-reset-${id}`, config);
		return result.resetIn > 0;
	});

	test.prop([fc.uuid(), fc.uuid(), configArb])(
		"different identifiers are independent",
		(id1, id2, config) => {
			fc.pre(id1 !== id2);
			const key1 = `prop-indep1-${id1}`;
			const key2 = `prop-indep2-${id2}`;
			// Exhaust id1
			for (let i = 0; i <= config.limit; i++) {
				checkRateLimit(key1, config);
			}
			// id2 should still succeed
			const result = checkRateLimit(key2, config);
			return result.success === true;
		}
	);
});
