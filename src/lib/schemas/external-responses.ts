/**
 * External API response schemas
 *
 * Runtime validation for responses from external services. Parsing untrusted
 * JSON with an explicit schema prevents malformed/poisoned upstream payloads
 * from propagating into the app and surfaces breaking API changes loudly
 * instead of silently corrupting data.
 */

import { z } from "zod";

/**
 * Listmonk `POST /api/subscribers` — returns the created/merged subscriber.
 * See: https://listmonk.app/docs/apis/subscribers/
 */
export const ListmonkSubscribeResponseSchema = z.object({
	data: z
		.object({
			id: z.number().int().nonnegative(),
			email: z.string().email().optional(),
			status: z.string().optional(),
		})
		.passthrough(),
});
export type ListmonkSubscribeResponse = z.infer<typeof ListmonkSubscribeResponseSchema>;

/**
 * Resend `POST /emails` — returns the created message id.
 * See: https://resend.com/docs/api-reference/emails/send-email
 */
export const ResendSendResponseSchema = z.object({
	id: z.string().min(1),
});
export type ResendSendResponse = z.infer<typeof ResendSendResponseSchema>;

/**
 * Cloudflare Workers AI chat/LLM response.
 *
 * Shape varies slightly per model. All chat-style models return a string
 * `response`; some models also echo tool calls or usage stats which we
 * tolerate but don't require.
 */
export const CloudflareAIResponseSchema = z
	.object({
		response: z.string(),
	})
	.passthrough();
export type CloudflareAIResponse = z.infer<typeof CloudflareAIResponseSchema>;

/**
 * Vectorizer backend responses. The upstream API returns different shapes
 * per endpoint; this union covers the three we consume: upload, status,
 * process start, and generator listing.
 */
const VectorizerUploadResponseSchema = z
	.object({
		task_id: z.string().min(1),
	})
	.passthrough();

const VectorizerStatusResponseSchema = z
	.object({
		task_id: z.string().min(1),
		status: z.string().min(1),
	})
	.passthrough();

const VectorizerProcessResponseSchema = z
	.object({
		task_id: z.string().min(1),
	})
	.passthrough();

const VectorizerGeneratorsResponseSchema = z
	.object({
		generators: z.record(z.string(), z.unknown()),
	})
	.passthrough();

export const VectorizerBackendResponseSchema = z.union([
	VectorizerUploadResponseSchema,
	VectorizerStatusResponseSchema,
	VectorizerProcessResponseSchema,
	VectorizerGeneratorsResponseSchema,
]);
export type VectorizerBackendResponse = z.infer<typeof VectorizerBackendResponseSchema>;

export {
	VectorizerGeneratorsResponseSchema,
	VectorizerProcessResponseSchema,
	VectorizerStatusResponseSchema,
	VectorizerUploadResponseSchema,
};

/**
 * Fallback geo-IP API shape (used when Cloudflare CF-* headers are absent,
 * e.g. local dev). Matches common public providers like ipapi.co / ip-api.com
 * in their normalized JSON form.
 */
export const GeoIpApiResponseSchema = z
	.object({
		country: z.string().nullable().optional(),
		country_code: z.string().nullable().optional(),
		city: z.string().nullable().optional(),
		region: z.string().nullable().optional(),
		timezone: z.string().nullable().optional(),
	})
	.passthrough();
export type GeoIpApiResponse = z.infer<typeof GeoIpApiResponseSchema>;

/**
 * Standard 502 body returned when an upstream response fails validation.
 * Consumers can rely on { error, upstream } for consistent error UX.
 */
export interface UpstreamValidationFailure {
	error: "Upstream validation failed";
	upstream: string;
}
