import { getRecommendation } from "@/data/saas-stagefit/recommendations";

import type { TechDimension } from "@/data/saas-stagefit/types";

interface RecommendationCardProps {
	dimension: TechDimension;
}

export function RecommendationCard({ dimension }: RecommendationCardProps) {
	const rec = getRecommendation(dimension);
	return (
		<article className="border border-white/10 p-4">
			<h4 className="text-mist-white mb-1 font-mono text-sm">{rec.title}</h4>
			<p className="text-slate-text mb-2 text-xs leading-relaxed">{rec.description}</p>
			<a
				href={rec.hubLink}
				className="text-cyber-lime font-mono text-xs underline decoration-white/20 underline-offset-4"
			>
				Read the playbook
			</a>
		</article>
	);
}
