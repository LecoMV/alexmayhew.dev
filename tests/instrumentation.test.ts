import { describe, expect, it, vi } from "vitest";

describe("instrumentation", () => {
	it("register function exists and does not import sentry server configs", async () => {
		vi.stubEnv("NEXT_RUNTIME", "edge");
		vi.resetModules();

		const edgeMock = vi.fn();
		const serverMock = vi.fn();
		vi.doMock("../sentry.edge.config", () => {
			edgeMock();
			return {};
		});
		vi.doMock("../sentry.server.config", () => {
			serverMock();
			return {};
		});

		const { register } = await import("../src/instrumentation");
		await register();

		// Server-side Sentry imports are disabled on Cloudflare Workers
		// (AsyncLocalStorage bound functions crash the runtime).
		// Server-side tracking handled by @sentry/cloudflare in custom-worker.ts.
		expect(edgeMock).not.toHaveBeenCalled();
		expect(serverMock).not.toHaveBeenCalled();

		vi.unstubAllEnvs();
		vi.restoreAllMocks();
	});
});
