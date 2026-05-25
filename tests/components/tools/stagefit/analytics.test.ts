import { describe, expect, it, vi } from "vitest";

const mockTrackEvent = vi.fn();
vi.mock("@/components/analytics/google-analytics", () => ({
	trackEvent: (...args: unknown[]) => mockTrackEvent(...args),
}));

import {
	QUIZ_ID,
	STAGEFIT_EVENTS,
	trackStageFitEvent,
} from "@/components/tools/stagefit/analytics";

describe("stagefit analytics", () => {
	it("QUIZ_ID is saas-stagefit-v2", () => {
		expect(QUIZ_ID).toBe("saas-stagefit-v2");
	});

	it("defines all 12 expected event names", () => {
		const expectedEvents = [
			"stagefit_start",
			"stagefit_persona_selected",
			"stagefit_context_complete",
			"stagefit_interstitial_viewed",
			"stagefit_hot_truncate_viewed",
			"stagefit_question_answered",
			"stagefit_abandoned",
			"stagefit_complete",
			"stagefit_cta_click",
			"stagefit_lead_capture_attempt",
			"stagefit_lead_capture_success",
			"stagefit_lead_capture_failure",
		];
		for (const name of expectedEvents) {
			expect(name in STAGEFIT_EVENTS).toBe(true);
		}
	});

	it("trackStageFitEvent calls trackEvent with quiz_id prepended", () => {
		mockTrackEvent.mockClear();
		trackStageFitEvent("stagefit_start", { foo: "bar" });
		expect(mockTrackEvent).toHaveBeenCalledWith("stagefit_start", {
			quiz_id: "saas-stagefit-v2",
			foo: "bar",
		});
	});
});
