import { NextResponse } from "next/server";

import { publicEnv } from "@/lib/env";

async function checkResend(): Promise<"reachable" | "unreachable"> {
	try {
		const res = await fetch("https://api.resend.com", {
			method: "HEAD",
			signal: AbortSignal.timeout(3000),
		});
		// 401 is expected without auth -- proves API is up
		return res.ok || res.status === 401 ? "reachable" : "unreachable";
	} catch {
		return "unreachable";
	}
}

/**
 * Health check endpoint for deployment validation
 * Used by GitHub Actions to verify successful deployments
 */
export async function GET() {
	const buildInfo = {
		sha: publicEnv.NEXT_PUBLIC_GIT_SHA,
		buildTime: publicEnv.NEXT_PUBLIC_BUILD_TIME ?? new Date().toISOString(),
		version: publicEnv.NEXT_PUBLIC_SITE_VERSION,
	};

	const resendStatus = await checkResend();
	const dependencies = { resend: resendStatus };
	const allReachable = Object.values(dependencies).every((s) => s === "reachable");

	return NextResponse.json(
		{
			status: allReachable ? "ok" : "degraded",
			timestamp: new Date().toISOString(),
			deployment: buildInfo,
			dependencies,
		},
		{
			status: 200,
			headers: {
				"Cache-Control": "no-store, no-cache, must-revalidate",
			},
		}
	);
}
