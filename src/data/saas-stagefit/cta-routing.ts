import type {
	CtaBucket,
	CustomerType,
	Severity,
	StageFitInput,
	StageFitResult,
	TriggerEvent,
	Zone,
} from "./types";

export function computeCtaBucket(
	zone: Zone,
	severity: Severity,
	triggerEvent: TriggerEvent,
	_customerType: CustomerType
): CtaBucket {
	if (zone === "over-built") {
		return severity === "acute" ? "fractional-cto" : "architecture-review";
	}
	if (zone === "under-built") {
		if (severity === "today" && (triggerEvent === "series-a" || triggerEvent === "due-diligence")) {
			return "technical-due-diligence";
		}
		if (severity === "today") return "strategic-implementation";
		return "advisory-retainer";
	}
	return "newsletter-only";
}

export function serializeResultForUrl(
	input: StageFitInput,
	result: StageFitResult
): URLSearchParams {
	return new URLSearchParams({
		source: "stagefit",
		z: result.zone,
		sev: result.severity ?? "",
		s: String(input.revenueStage),
		t: input.triggerEvent,
		cust: input.customerType,
		w: result.topMisalignedDimensions.join(","),
	});
}
