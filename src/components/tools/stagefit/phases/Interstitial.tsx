"use client";

import { m } from "framer-motion";

import { fadeInUp, staggerContainer } from "@/lib/motion-constants";

interface InterstitialProps {
	revenueStage: string;
	customerType: string;
	triggerEvent: string;
	onContinue: () => void;
}

const STAGE_LABELS: Record<string, string> = {
	"0": "Pre-revenue",
	"1": "≤$10K MRR",
	"2": "$10K–$100K MRR",
	"3": "$100K MRR–$1M ARR",
	"4": "$1M–$10M ARR",
	"5": "$10M+ ARR",
};

export function Interstitial({ revenueStage, customerType, onContinue }: InterstitialProps) {
	const stageLabel = STAGE_LABELS[revenueStage] ?? revenueStage;
	return (
		<m.section
			variants={staggerContainer}
			initial="hidden"
			animate="visible"
			className="mx-auto max-w-2xl"
		>
			<m.div variants={fadeInUp} className="border border-white/10 p-6">
				<p className="text-cyber-lime mb-2 font-mono text-xs tracking-wider uppercase">
					Baseline Loaded
				</p>
				<p className="text-mist-white text-base leading-relaxed">
					Based on {stageLabel} + {customerType.replace(/-/g, " ")}, mapping your tech against the
					stage-appropriate baseline.
				</p>
			</m.div>

			<m.div variants={fadeInUp} className="mt-6">
				<button
					onClick={onContinue}
					className="border-cyber-lime bg-cyber-lime/10 text-cyber-lime hover:bg-cyber-lime/20 focus-visible:ring-cyber-lime border px-6 py-3 font-mono text-sm tracking-tight transition-colors focus:outline-none focus-visible:ring-2"
				>
					Continue to Tech Questions
				</button>
			</m.div>
		</m.section>
	);
}
