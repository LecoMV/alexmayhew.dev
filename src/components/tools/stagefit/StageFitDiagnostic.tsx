"use client";

import { useState } from "react";

import { calculateStageFit } from "@/data/saas-stagefit/calculate";

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
		return (
			<TechQuestions
				persona={persona}
				onComplete={(techAnswers: Record<TechDimension, TechScore>) => {
					const stageFitInput: StageFitInput = {
						persona,
						customerType: (contextAnswers["q2-customer-type"] ??
							"b2b-smb") as StageFitInput["customerType"],
						revenueStage: Number(
							contextAnswers["q3-revenue"] ?? "0"
						) as StageFitInput["revenueStage"],
						triggerEvent: (contextAnswers["q4-trigger"] ?? "none") as StageFitInput["triggerEvent"],
						compliance: [
							(contextAnswers["q5-compliance"] ?? "none") as StageFitInput["compliance"][0],
						],
						teamSize: Number(contextAnswers["q6-team-size"] ?? "0") as StageFitInput["teamSize"],
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
		return <DiagnosisScreen input={input} result={result} />;
	}

	return null;
}
