"use server";

import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { calculateStageFit } from "@/data/saas-stagefit/calculate";
import { stageFitInputSchema } from "@/data/saas-stagefit/schemas";

import type { StageFitInput } from "@/data/saas-stagefit/types";

interface SubmitStageFitLeadInput {
	email: string;
	answers: StageFitInput;
}

interface SubmitStageFitLeadResult {
	success: boolean;
	error?: string;
	existingSubscriber?: boolean;
}

export async function submitStageFitLead(
	input: SubmitStageFitLeadInput
): Promise<SubmitStageFitLeadResult> {
	const parsed = stageFitInputSchema.safeParse(input.answers);
	if (!parsed.success) {
		return { success: false, error: "Invalid quiz answers" };
	}

	const result = calculateStageFit(parsed.data as StageFitInput);

	const customFields: Record<string, string> = {
		stagefit_zone: result.zone,
		stagefit_severity: result.severity ?? "",
		stagefit_delta: String(result.delta),
		velocity_drag_band: result.velocityDragBand,
		reversibility_risk_count: String(result.reversibilityRiskCount),
		persona: input.answers.persona,
		customer_type: input.answers.customerType,
		revenue_stage: String(input.answers.revenueStage),
		trigger_event: input.answers.triggerEvent,
	};

	result.topMisalignedDimensions.forEach((dim, i) => {
		customFields[`top_misaligned_${i + 1}`] = dim;
	});

	return subscribeToNewsletter({
		email: input.email,
		source: "stage-fit-quiz-v2",
		customFields,
	});
}
