"use client";

import { useState } from "react";

import { submitStageFitLead } from "@/app/actions/stagefit-lead";
import { applyModifiers, getStageBaseline } from "@/data/saas-stagefit/baseline-matrix";
import { calculateStageFit } from "@/data/saas-stagefit/calculate";

import { LeadCapture } from "./LeadCapture";
import { ContextQuestions } from "./phases/ContextQuestions";
import { DiagnosisScreen } from "./phases/DiagnosisScreen";
import { Interstitial } from "./phases/Interstitial";
import { IntroScreen } from "./phases/IntroScreen";
import { TechQuestions } from "./phases/TechQuestions";

import type {
	Persona,
	StageFitInput,
	StageFitResult,
	TechDimension,
	TechScore,
} from "@/data/saas-stagefit/types";

type Phase = "intro" | "context" | "interstitial" | "tech" | "diagnosis";

export function StageFitDiagnostic() {
	const [phase, setPhase] = useState<Phase>("intro");
	const [contextAnswers, setContextAnswers] = useState<Record<string, string>>({});
	const [result, setResult] = useState<StageFitResult | null>(null);
	const [input, setInput] = useState<StageFitInput | null>(null);
	const [leadCaptured, setLeadCaptured] = useState(false);

	if (phase === "intro") {
		return <IntroScreen onStart={() => setPhase("context")} />;
	}

	if (phase === "context") {
		return (
			<ContextQuestions
				onComplete={(answers) => {
					setContextAnswers(answers);
					setPhase("interstitial");
				}}
			/>
		);
	}

	const persona = (contextAnswers["q1-role"] ?? "cto") as Persona;
	const revenueStage = Number(contextAnswers["q3-revenue"] ?? "0") as StageFitInput["revenueStage"];
	const customerType = (contextAnswers["q2-customer-type"] ??
		"b2b-smb") as StageFitInput["customerType"];
	const triggerEvent = (contextAnswers["q4-trigger"] ?? "none") as StageFitInput["triggerEvent"];
	const compliance = [
		(contextAnswers["q5-compliance"] ?? "none") as StageFitInput["compliance"][0],
	];
	const teamSize = Number(contextAnswers["q6-team-size"] ?? "0") as StageFitInput["teamSize"];

	if (phase === "interstitial") {
		return (
			<Interstitial
				revenueStage={contextAnswers["q3-revenue"] ?? "0"}
				customerType={contextAnswers["q2-customer-type"] ?? "b2b-smb"}
				triggerEvent={contextAnswers["q4-trigger"] ?? "none"}
				onContinue={() => setPhase("tech")}
			/>
		);
	}

	if (phase === "tech") {
		const baseline = applyModifiers(
			getStageBaseline(revenueStage),
			customerType,
			compliance,
			teamSize,
			triggerEvent
		);

		return (
			<TechQuestions
				persona={persona}
				baseline={baseline}
				onComplete={(techAnswers: Record<TechDimension, TechScore>) => {
					const stageFitInput: StageFitInput = {
						persona,
						customerType,
						revenueStage,
						triggerEvent,
						compliance,
						teamSize,
						techAnswers,
					};
					setInput(stageFitInput);
					setResult(calculateStageFit(stageFitInput));
					setPhase("diagnosis");
				}}
			/>
		);
	}

	if (phase === "diagnosis" && result && input) {
		return (
			<>
				<DiagnosisScreen input={input} result={result} />
				{!leadCaptured ? (
					<LeadCapture
						zone={result.zone}
						result={result}
						onSuccess={() => setLeadCaptured(true)}
						onSubmitEmail={async (email) => submitStageFitLead({ email, answers: input })}
					/>
				) : (
					<p className="text-cyber-lime mt-4 font-mono text-sm">
						Check your inbox for your personalized remediation plan.
					</p>
				)}
			</>
		);
	}

	return null;
}
