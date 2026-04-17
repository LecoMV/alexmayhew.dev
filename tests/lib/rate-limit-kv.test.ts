import { beforeEach, describe, expect, it, vi } from "vitest";

import { checkRateLimit } from "@/lib/rate-limit";

type KvStub = {
	get: ReturnType<typeof vi.fn>;
	put: ReturnType<typeof vi.fn>;
};

function makeKvStub(): KvStub {
	const store = new Map<string, string>();
	return {
		get: vi.fn(async (key: string) => store.get(key) ?? null),
		put: vi.fn(async (key: string, value: string) => {
			store.set(key, value);
		}),
	};
}

describe("checkRateLimit (KV-based)", () => {
	let kv: KvStub;

	beforeEach(() => {
		kv = makeKvStub();
	});

	it("returns success true below limit", async () => {
		const result = await checkRateLimit({
			kv: kv as unknown as KVNamespace,
			key: "contact:1.2.3.4",
			limit: 5,
		});
		expect(result.success).toBe(true);
	});

	it("fails open when no KV binding is available", async () => {
		const result = await checkRateLimit({
			kv: null,
			key: "contact:1.2.3.4",
			limit: 5,
		});
		expect(result.success).toBe(true);
	});

	it("fails open when KV.get throws", async () => {
		const broken = {
			get: vi.fn().mockRejectedValue(new Error("KV outage")),
			put: vi.fn(),
		};
		const result = await checkRateLimit({
			kv: broken as unknown as KVNamespace,
			key: "contact:1.2.3.4",
			limit: 5,
		});
		expect(result.success).toBe(true);
	});

	it("tracks different keys independently", async () => {
		for (let i = 0; i < 5; i++) {
			await checkRateLimit({
				kv: kv as unknown as KVNamespace,
				key: "contact:1.2.3.4",
				limit: 5,
			});
		}
		const otherIp = await checkRateLimit({
			kv: kv as unknown as KVNamespace,
			key: "contact:9.8.7.6",
			limit: 5,
		});
		expect(otherIp.success).toBe(true);
	});

	it("writes KV entries with expirationTtl so stale counters auto-expire", async () => {
		await checkRateLimit({
			kv: kv as unknown as KVNamespace,
			key: "contact:1.2.3.4",
			limit: 5,
		});
		expect(kv.put).toHaveBeenCalledWith(
			expect.stringContaining("ratelimit:contact:1.2.3.4:"),
			expect.any(String),
			expect.objectContaining({ expirationTtl: expect.any(Number) })
		);
	});

	it("returns success false once limit reached", async () => {
		for (let i = 0; i < 5; i++) {
			await checkRateLimit({
				kv: kv as unknown as KVNamespace,
				key: "contact:1.2.3.4",
				limit: 5,
			});
		}
		const blocked = await checkRateLimit({
			kv: kv as unknown as KVNamespace,
			key: "contact:1.2.3.4",
			limit: 5,
		});
		expect(blocked.success).toBe(false);
	});
});
