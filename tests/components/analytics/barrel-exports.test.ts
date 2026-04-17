import { describe, expect, it } from "vitest";

import * as analytics from "@/components/analytics";

describe("@/components/analytics barrel", () => {
	it("re-exports trackSignUp + trackSocialClick", () => {
		expect(analytics.trackSignUp).toBeTypeOf("function");
		expect(analytics.trackSocialClick).toBeTypeOf("function");
	});
});
