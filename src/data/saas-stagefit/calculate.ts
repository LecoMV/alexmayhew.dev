import { applyModifiers, getStageBaseline } from "./baseline-matrix";
import { computeCtaBucket } from "./cta-routing";
import { DIMENSIONS, REVERSIBILITY } from "./dimensions";

import type { StageFitInput, StageFitResult, TechDimension, Zone } from "./types";

export function calculateStageFit(input: StageFitInput): StageFitResult {
	const baseline = getStageBaseline(input.revenueStage);
	const modified = applyModifiers(
		baseline,
		input.customerType,
		input.compliance,
		input.teamSize,
		input.triggerEvent
	);

	const dimDeltas = DIMENSIONS.map((dim) => ({
		dim,
		delta: input.techAnswers[dim] - modified[dim],
		irreversible: REVERSIBILITY[dim] === "irreversible",
	}));

	const totalDelta = dimDeltas.reduce((sum, d) => sum + d.delta, 0);

	let zone: Zone;
	let severity: StageFitResult["severity"];

	if (totalDelta >= 4) {
		zone = "over-built";
		severity = totalDelta >= 10 ? "acute" : "mild";
	} else if (totalDelta <= -4) {
		zone = "under-built";
		severity = input.triggerEvent !== "none" && totalDelta <= -8 ? "today" : "tomorrow";
	} else {
		zone = "stage-optimized";
		severity = null;
	}

	const reversibilityRiskCount = dimDeltas.filter(
		(d) => d.irreversible && Math.abs(d.delta) >= 1
	).length;

	const misalignedCount = dimDeltas.filter((d) => Math.abs(d.delta) >= 1).length;
	const velocityDragBand =
		misalignedCount <= 1
			? "low"
			: misalignedCount <= 3
				? "moderate"
				: misalignedCount <= 5
					? "high"
					: "critical";

	const topMisalignedDimensions: TechDimension[] = [...dimDeltas]
		.filter((d) => Math.abs(d.delta) >= 1)
		.sort((a, b) => {
			const absDiff = Math.abs(b.delta) - Math.abs(a.delta);
			if (absDiff !== 0) return absDiff;
			if (a.irreversible !== b.irreversible) return a.irreversible ? -1 : 1;
			return DIMENSIONS.indexOf(a.dim) - DIMENSIONS.indexOf(b.dim);
		})
		.slice(0, 3)
		.map((d) => d.dim);

	return {
		zone,
		severity,
		delta: totalDelta,
		velocityDragBand,
		reversibilityRiskCount,
		topMisalignedDimensions,
		ctaBucket: computeCtaBucket(zone, severity, input.triggerEvent, input.customerType),
	};
}
