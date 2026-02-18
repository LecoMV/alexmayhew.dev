/**
 * Structured logger for Cloudflare Workers edge runtime.
 * Outputs plain objects via console.log/console.error — Workers Logs auto-indexes JSON fields.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogFields {
	requestId?: string;
	route?: string;
	method?: string;
	status?: number;
	durationMs?: number;
	[key: string]: unknown;
}

function log(level: LogLevel, message: string, fields?: LogFields): void {
	const entry = {
		level,
		message,
		ts: Date.now(),
		...fields,
	};

	if (level === "error" || level === "warn") {
		console.error(entry);
	} else {
		console.log(entry);
	}
}

export const logger = {
	debug: (message: string, fields?: LogFields) => log("debug", message, fields),
	info: (message: string, fields?: LogFields) => log("info", message, fields),
	warn: (message: string, fields?: LogFields) => log("warn", message, fields),
	error: (message: string, fields?: LogFields) => log("error", message, fields),
};

export type { LogFields, LogLevel };
