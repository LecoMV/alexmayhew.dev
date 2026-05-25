import { createHmac, timingSafeEqual } from "crypto";

import type { StageFitResult } from "@/data/saas-stagefit/types";

function canonicalize(result: StageFitResult): string {
	return JSON.stringify(result, Object.keys(result).sort());
}

function hmac(data: string, secret: string): string {
	return createHmac("sha256", secret).update(data).digest("base64url");
}

export function signResult(result: StageFitResult, secret: string): string {
	const payload = Buffer.from(canonicalize(result)).toString("base64url");
	const sig = hmac(payload, secret);
	return `${payload}.${sig}`;
}

export function verifyResult(token: string, secret: string): StageFitResult | null {
	const dotIndex = token.lastIndexOf(".");
	if (dotIndex === -1) return null;

	const payload = token.slice(0, dotIndex);
	const sig = token.slice(dotIndex + 1);

	const expected = hmac(payload, secret);
	const sigBuf = Buffer.from(sig);
	const expectedBuf = Buffer.from(expected);
	if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
		return null;
	}

	try {
		return JSON.parse(Buffer.from(payload, "base64url").toString()) as StageFitResult;
	} catch {
		return null;
	}
}
