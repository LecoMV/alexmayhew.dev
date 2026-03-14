import { makeRouteHandler } from "@keystatic/next/route-handler";

import config, { showAdminUI } from "../../../../../keystatic.config";

const notFoundResponse = () => new Response(null, { status: 404 });

export const { POST, GET } = showAdminUI
	? makeRouteHandler({ config })
	: { GET: notFoundResponse, POST: notFoundResponse };
