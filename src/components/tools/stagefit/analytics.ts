import { trackEvent } from "@/components/analytics/google-analytics";

export const QUIZ_ID = "saas-stagefit-v2";

export const STAGEFIT_EVENTS = {
	stagefit_start: true,
	stagefit_persona_selected: true,
	stagefit_context_complete: true,
	stagefit_interstitial_viewed: true,
	stagefit_hot_truncate_viewed: true,
	stagefit_question_answered: true,
	stagefit_abandoned: true,
	stagefit_complete: true,
	stagefit_cta_click: true,
	stagefit_lead_capture_attempt: true,
	stagefit_lead_capture_success: true,
	stagefit_lead_capture_failure: true,
} as const;

export function trackStageFitEvent(
	name: keyof typeof STAGEFIT_EVENTS,
	payload: Record<string, string | number | boolean>
) {
	trackEvent(name, { quiz_id: QUIZ_ID, ...payload });
}
