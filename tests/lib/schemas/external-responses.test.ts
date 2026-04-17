import { describe, expect, it } from "vitest";

import {
	CloudflareAIResponseSchema,
	GeoIpApiResponseSchema,
	ListmonkSubscribeResponseSchema,
	ResendSendResponseSchema,
	VectorizerBackendResponseSchema,
	VectorizerGeneratorsResponseSchema,
	VectorizerProcessResponseSchema,
	VectorizerStatusResponseSchema,
	VectorizerUploadResponseSchema,
} from "@/lib/schemas/external-responses";

describe("external response schemas", () => {
	describe("ListmonkSubscribeResponseSchema", () => {
		it("accepts a well-formed subscribe response", () => {
			const result = ListmonkSubscribeResponseSchema.safeParse({
				data: { id: 42, email: "alex@example.com", status: "enabled" },
			});
			expect(result.success).toBe(true);
		});

		it("rejects responses missing data.id", () => {
			const result = ListmonkSubscribeResponseSchema.safeParse({ data: {} });
			expect(result.success).toBe(false);
		});
	});

	describe("ResendSendResponseSchema", () => {
		it("accepts a response with an id", () => {
			const result = ResendSendResponseSchema.safeParse({ id: "abc-123" });
			expect(result.success).toBe(true);
		});

		it("rejects empty id", () => {
			const result = ResendSendResponseSchema.safeParse({ id: "" });
			expect(result.success).toBe(false);
		});
	});

	describe("CloudflareAIResponseSchema", () => {
		it("accepts responses with a response string", () => {
			const result = CloudflareAIResponseSchema.safeParse({ response: "hello" });
			expect(result.success).toBe(true);
		});

		it("tolerates unknown extra fields", () => {
			const result = CloudflareAIResponseSchema.safeParse({
				response: "hi",
				usage: { total_tokens: 12 },
			});
			expect(result.success).toBe(true);
		});

		it("rejects missing response field", () => {
			const result = CloudflareAIResponseSchema.safeParse({});
			expect(result.success).toBe(false);
		});
	});

	describe("Vectorizer schemas", () => {
		it("upload schema requires task_id", () => {
			expect(VectorizerUploadResponseSchema.safeParse({ task_id: "x" }).success).toBe(true);
			expect(VectorizerUploadResponseSchema.safeParse({}).success).toBe(false);
		});

		it("status schema requires task_id and status", () => {
			expect(
				VectorizerStatusResponseSchema.safeParse({ task_id: "x", status: "queued" }).success
			).toBe(true);
			expect(VectorizerStatusResponseSchema.safeParse({ task_id: "x" }).success).toBe(false);
		});

		it("process schema requires task_id", () => {
			expect(VectorizerProcessResponseSchema.safeParse({ task_id: "x" }).success).toBe(true);
		});

		it("generators schema requires generators map", () => {
			expect(
				VectorizerGeneratorsResponseSchema.safeParse({
					generators: { potrace: {} },
				}).success
			).toBe(true);
			expect(VectorizerGeneratorsResponseSchema.safeParse({}).success).toBe(false);
		});

		it("union accepts any valid backend response shape", () => {
			expect(VectorizerBackendResponseSchema.safeParse({ task_id: "x" }).success).toBe(true);
			expect(VectorizerBackendResponseSchema.safeParse({ generators: { a: {} } }).success).toBe(
				true
			);
		});
	});

	describe("GeoIpApiResponseSchema", () => {
		it("accepts an empty object (all fields optional)", () => {
			expect(GeoIpApiResponseSchema.safeParse({}).success).toBe(true);
		});

		it("accepts a populated response", () => {
			const result = GeoIpApiResponseSchema.safeParse({
				country: "United States",
				country_code: "US",
				city: "Brooklyn",
				timezone: "America/New_York",
			});
			expect(result.success).toBe(true);
		});

		it("rejects wrong types", () => {
			const result = GeoIpApiResponseSchema.safeParse({ country_code: 42 });
			expect(result.success).toBe(false);
		});
	});
});
