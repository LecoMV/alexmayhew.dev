import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LocalBusinessJsonLd } from "@/components/seo/local-business-json-ld";

describe("LocalBusinessJsonLd deprecation", () => {
	const originalNodeEnv = process.env.NODE_ENV;
	let warnSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
	});

	afterEach(() => {
		warnSpy.mockRestore();
		(process.env as Record<string, string>).NODE_ENV = originalNodeEnv;
	});

	it("warns when rendered in development (is a deprecated stub)", () => {
		(process.env as Record<string, string>).NODE_ENV = "development";
		render(<LocalBusinessJsonLd />);
		expect(warnSpy).toHaveBeenCalled();
		const message = warnSpy.mock.calls[0]?.[0] as string;
		expect(message).toMatch(/deprecated/i);
	});
});
