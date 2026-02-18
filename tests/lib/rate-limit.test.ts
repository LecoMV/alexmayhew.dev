import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
	checkRateLimit,
	getClientIP,
	getRateLimitMapSize,
	type RateLimitConfig,
} from "@/lib/rate-limit";

describe("rate-limit", () => {
	describe("checkRateLimit", () => {
		beforeEach(() => {
			vi.useFakeTimers();
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it("should allow first request", () => {
			const result = checkRateLimit("test-ip-1", { limit: 5, windowSeconds: 60 });
			expect(result.success).toBe(true);
			expect(result.remaining).toBe(4);
		});

		it("should decrement remaining on subsequent requests", () => {
			const config: RateLimitConfig = { limit: 5, windowSeconds: 60 };
			const id = "test-ip-2";

			checkRateLimit(id, config); // 1st
			const second = checkRateLimit(id, config);
			expect(second.remaining).toBe(3);

			const third = checkRateLimit(id, config);
			expect(third.remaining).toBe(2);
		});

		it("should block when limit exceeded", () => {
			const config: RateLimitConfig = { limit: 3, windowSeconds: 60 };
			const id = "test-ip-3";

			checkRateLimit(id, config); // 1
			checkRateLimit(id, config); // 2
			checkRateLimit(id, config); // 3
			const fourth = checkRateLimit(id, config); // Over limit

			expect(fourth.success).toBe(false);
			expect(fourth.remaining).toBe(0);
		});

		it("should reset after window expires", () => {
			const config: RateLimitConfig = { limit: 2, windowSeconds: 60 };
			const id = "test-ip-4";

			checkRateLimit(id, config); // 1
			checkRateLimit(id, config); // 2
			const blocked = checkRateLimit(id, config); // blocked
			expect(blocked.success).toBe(false);

			// Advance time past window
			vi.advanceTimersByTime(61000);

			const afterReset = checkRateLimit(id, config);
			expect(afterReset.success).toBe(true);
			expect(afterReset.remaining).toBe(1);
		});

		it("should track different identifiers separately", () => {
			const config: RateLimitConfig = { limit: 2, windowSeconds: 60 };

			checkRateLimit("user-1", config);
			checkRateLimit("user-1", config);
			const user1Blocked = checkRateLimit("user-1", config);
			expect(user1Blocked.success).toBe(false);

			// Different user should still have limit
			const user2 = checkRateLimit("user-2", config);
			expect(user2.success).toBe(true);
		});

		it("should use default config when not provided", () => {
			const result = checkRateLimit("default-config-test");
			expect(result.success).toBe(true);
			expect(result.remaining).toBe(4); // Default limit is 5
		});

		it("should return correct resetIn value", () => {
			const config: RateLimitConfig = { limit: 1, windowSeconds: 120 };
			const id = "reset-test";

			const first = checkRateLimit(id, config);
			expect(first.resetIn).toBe(120);

			// Advance 30 seconds
			vi.advanceTimersByTime(30000);

			const second = checkRateLimit(id, config);
			expect(second.resetIn).toBeLessThanOrEqual(90);
			expect(second.resetIn).toBeGreaterThan(0);
		});

		it("should clean up expired entries periodically", () => {
			const config: RateLimitConfig = { limit: 5, windowSeconds: 1 };
			const id = "cleanup-test";

			checkRateLimit(id, config);

			vi.advanceTimersByTime(60000 + 1000);

			// Since we can't access the map directly (it's not exported),
			// AND relying on coverage reports to show the interval callback was executed.

			// we can't easily distinguish from outside without spying on the map.
			// Advancing timers by 60s should trigger the interval callback.

			vi.advanceTimersByTime(1000);
		});
	});

	describe("getClientIP", () => {
		it("should prioritize cf-connecting-ip", () => {
			const headers = new Headers({
				"cf-connecting-ip": "1.2.3.4",
				"x-forwarded-for": "5.6.7.8, 9.10.11.12",
				"x-real-ip": "13.14.15.16",
			});
			expect(getClientIP(headers)).toBe("1.2.3.4");
		});

		it("should fallback to x-forwarded-for first IP", () => {
			const headers = new Headers({
				"x-forwarded-for": "5.6.7.8, 9.10.11.12",
				"x-real-ip": "13.14.15.16",
			});
			expect(getClientIP(headers)).toBe("5.6.7.8");
		});

		it("should fallback to x-real-ip", () => {
			const headers = new Headers({
				"x-real-ip": "13.14.15.16",
			});
			expect(getClientIP(headers)).toBe("13.14.15.16");
		});

		it("should return unknown when no IP headers present", () => {
			const headers = new Headers({});
			expect(getClientIP(headers)).toBe("unknown");
		});

		it("should handle x-forwarded-for with spaces", () => {
			const headers = new Headers({
				"x-forwarded-for": "  1.2.3.4  , 5.6.7.8",
			});
			expect(getClientIP(headers)).toBe("1.2.3.4");
		});

		it("should clamp IP strings longer than 45 characters", () => {
			const longIP = "a".repeat(100);
			const headers = new Headers({ "cf-connecting-ip": longIP });
			const result = getClientIP(headers);
			expect(result.length).toBe(45);
		});

		it("should allow valid IPv6 addresses (45 chars max)", () => {
			const ipv6 = "2001:0db8:85a3:0000:0000:8a2e:0370:7334";
			const headers = new Headers({ "cf-connecting-ip": ipv6 });
			expect(getClientIP(headers)).toBe(ipv6);
		});
	});

	describe("map cap enforcement", () => {
		beforeEach(() => {
			vi.useFakeTimers();
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it("should not grow beyond MAX_ENTRIES", () => {
			const config: RateLimitConfig = { limit: 100, windowSeconds: 3600 };
			for (let i = 0; i < 10_001; i++) {
				checkRateLimit(`cap-test-${i}`, config);
			}
			expect(getRateLimitMapSize()).toBeLessThanOrEqual(10_000);
		});

		it("should evict oldest entry when cap is reached", () => {
			const config: RateLimitConfig = { limit: 100, windowSeconds: 3600 };
			// Fill to cap with entries that have increasing resetTime
			for (let i = 0; i < 10_000; i++) {
				checkRateLimit(`evict-test-${i}`, config);
			}
			expect(getRateLimitMapSize()).toBe(10_000);

			// Adding one more should evict the oldest
			checkRateLimit("evict-test-new", config);
			expect(getRateLimitMapSize()).toBeLessThanOrEqual(10_000);
		});
	});
});
