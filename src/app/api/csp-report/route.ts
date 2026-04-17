import { logger } from "@/lib/logger";

/**
 * Endpoint for Content-Security-Policy violation reports. Browsers POST
 * here via `report-uri` (legacy) and `report-to` (Reporting API) when a
 * resource violates the policy. We log to Workers Logs where structured
 * JSON makes filtering by blocked-uri and violated-directive trivial.
 *
 * The body content-type is either:
 *  - `application/csp-report` (legacy format, { "csp-report": {...} })
 *  - `application/reports+json` (Reporting API, an array of {type, body})
 *
 * We accept both, flatten into a consistent shape, and 204 back. We do
 * NOT echo the payload to the client, so there's no XSS surface.
 */

interface LegacyCspReport {
	"csp-report"?: {
		"document-uri"?: string;
		referrer?: string;
		"violated-directive"?: string;
		"effective-directive"?: string;
		"blocked-uri"?: string;
		"status-code"?: number;
		"line-number"?: number;
		"column-number"?: number;
		"source-file"?: string;
	};
}

interface ReportApiEntry {
	type?: string;
	age?: number;
	url?: string;
	user_agent?: string;
	body?: {
		documentURL?: string;
		effectiveDirective?: string;
		violatedDirective?: string;
		blockedURL?: string;
		disposition?: string;
		statusCode?: number;
		lineNumber?: number;
		columnNumber?: number;
		sourceFile?: string;
	};
}

export async function POST(request: Request): Promise<Response> {
	try {
		const text = await request.text();
		if (!text) return new Response(null, { status: 204 });

		const contentType = request.headers.get("content-type") ?? "";
		const parsed = JSON.parse(text) as LegacyCspReport | ReportApiEntry[];

		if (Array.isArray(parsed)) {
			for (const entry of parsed) {
				if (entry.type !== "csp-violation" || !entry.body) continue;
				logger.warn("csp-violation", {
					route: "/api/csp-report",
					format: "reports-api",
					documentURL: entry.body.documentURL,
					violatedDirective: entry.body.violatedDirective,
					effectiveDirective: entry.body.effectiveDirective,
					blockedURL: entry.body.blockedURL,
					disposition: entry.body.disposition,
					statusCode: entry.body.statusCode,
					lineNumber: entry.body.lineNumber,
					sourceFile: entry.body.sourceFile,
				});
			}
		} else if (parsed["csp-report"]) {
			const r = parsed["csp-report"];
			logger.warn("csp-violation", {
				route: "/api/csp-report",
				format: "legacy",
				contentType,
				documentURL: r["document-uri"],
				referrer: r.referrer,
				violatedDirective: r["violated-directive"] ?? r["effective-directive"],
				blockedURL: r["blocked-uri"],
				statusCode: r["status-code"],
				lineNumber: r["line-number"],
				sourceFile: r["source-file"],
			});
		}

		return new Response(null, { status: 204 });
	} catch (err) {
		logger.error("csp-report parse error", {
			route: "/api/csp-report",
			error: String(err),
		});
		return new Response(null, { status: 204 });
	}
}
