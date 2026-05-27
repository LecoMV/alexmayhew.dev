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
		<section className="mx-auto max-w-2xl">
			<p className="text-cyber-lime mb-2 font-mono text-xs tracking-wider uppercase">Diagnosis</p>
			<h2 className="text-mist-white mb-4 font-mono text-2xl tracking-tight">{copy.diagnosis}</h2>
			<p className="text-slate-text mb-4 text-base leading-relaxed">{copy.symptoms}</p>
			<p className="text-slate-text mb-6 text-base leading-relaxed">{copy.prognosisVelocity}</p>
			<a
				href={ctaHref}
				className="border-cyber-lime bg-cyber-lime/10 text-cyber-lime hover:bg-cyber-lime/20 focus-visible:ring-cyber-lime inline-block border px-6 py-3 font-mono text-sm tracking-tight transition-colors focus:outline-none focus-visible:ring-2"
			>
				{copy.prescriptionCta}
			</a>
		</section>
	);
}
