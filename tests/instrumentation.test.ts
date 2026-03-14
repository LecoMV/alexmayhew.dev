import { describe, expect, it, vi } from "vitest";

describe("instrumentation", () => {
	it("should import sentry edge config when NEXT_RUNTIME is edge", async () => {
		vi.stubEnv("NEXT_RUNTIME", "edge");
		vi.resetModules();

		const edgeMock = vi.fn();
		vi.doMock("../sentry.edge.config", () => {
			edgeMock();
			return {};
		});
		vi.doMock("../sentry.server.config", () => ({}));

		const { register } = await import("../src/instrumentation");
		await register();

		expect(edgeMock).toHaveBeenCalled();

		vi.unstubAllEnvs();
		vi.restoreAllMocks();
	});
});
