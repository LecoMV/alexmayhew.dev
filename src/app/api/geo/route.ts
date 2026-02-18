import { NextResponse } from "next/server";

import { getGeoDataForClient } from "@/lib/geo";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
	const requestId = crypto.randomUUID();
	const start = Date.now();
	try {
		const geoData = getGeoDataForClient(new Headers(request.headers));
		return NextResponse.json(geoData, {
			headers: {
				"Cache-Control": "private, max-age=3600",
				"x-request-id": requestId,
			},
		});
	} catch (error) {
		logger.error("Geo API error", {
			requestId,
			route: "/api/geo",
			method: "GET",
			status: 500,
			durationMs: Date.now() - start,
			error: error instanceof Error ? error.message : String(error),
		});
		return NextResponse.json(
			{ error: "Failed to determine location" },
			{ status: 500, headers: { "x-request-id": requestId } }
		);
	}
}
