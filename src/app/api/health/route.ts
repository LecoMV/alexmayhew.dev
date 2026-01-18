import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

interface HealthStatus {
	status: "healthy" | "degraded" | "unhealthy";
	timestamp: string;
	services: {
		ai: { available: boolean };
		cache: { available: boolean };
	};
	version: string;
}

export async function GET() {
	const { env } = await getCloudflareContext();

	const health: HealthStatus = {
		status: "healthy",
		timestamp: new Date().toISOString(),
		services: {
			ai: { available: !!env?.AI },
			cache: { available: !!env?.NEXT_CACHE },
		},
		version: process.env.npm_package_version || "1.0.0",
	};

	// Determine overall status
	if (!health.services.ai.available && !health.services.cache.available) {
		health.status = "unhealthy";
	} else if (!health.services.ai.available) {
		health.status = "degraded";
	}

	const statusCode = health.status === "unhealthy" ? 503 : 200;

	return NextResponse.json(health, {
		status: statusCode,
		headers: {
			"Cache-Control": "no-store, max-age=0",
		},
	});
}
