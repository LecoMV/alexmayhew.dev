import { NextResponse } from "next/server";

export const runtime = "edge";

/**
 * Health check endpoint for deployment validation
 * Used by GitHub Actions to verify successful deployments
 */
export async function GET() {
	const buildInfo = {
		sha: process.env.NEXT_PUBLIC_GIT_SHA || "development",
		buildTime: process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString(),
		version: process.env.NEXT_PUBLIC_SITE_VERSION || "0.0.0",
	};

	return NextResponse.json(
		{
			status: "ok",
			timestamp: new Date().toISOString(),
			deployment: buildInfo,
		},
		{
			status: 200,
			headers: {
				"Cache-Control": "no-store, no-cache, must-revalidate",
			},
		}
	);
}
