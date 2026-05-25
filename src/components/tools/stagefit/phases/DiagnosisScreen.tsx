import { getZoneCopy } from "@/data/saas-stagefit/copy";
import { serializeResultForUrl } from "@/data/saas-stagefit/cta-routing";

import type { StageFitInput, StageFitResult } from "@/data/saas-stagefit/types";

interface DiagnosisScreenProps {
	input: StageFitInput;
	result: StageFitResult;
}

export function DiagnosisScreen({ input, result }: DiagnosisScreenProps) {
	const copy = getZoneCopy(result.zone, result.severity, input.persona);
	const ctaParams = serializeResultForUrl(input, result);
	const ctaHref = `/contact?${ctaParams.toString()}`;

	return (
		<section>
			<h2>{copy.diagnosis}</h2>
			<p>{copy.symptoms}</p>
			<p>{copy.prognosisVelocity}</p>
			<a href={ctaHref}>{copy.prescriptionCta}</a>
		</section>
	);
}
