import { NextResponse } from "next/server";
import { getGeoDataForClient } from "@/lib/geo";

export async function GET(request: Request) {
	const geoData = getGeoDataForClient(new Headers(request.headers));

	return NextResponse.json(geoData, {
		headers: {
			"Cache-Control": "private, max-age=3600",
		},
	});
}
