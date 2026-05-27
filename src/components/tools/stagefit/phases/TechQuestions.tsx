"use client";

import { m } from "framer-motion";
import { useState } from "react";

import { QUIZ_QUESTIONS } from "@/data/saas-stagefit/questions";
import { fadeInUp, snappySpringTransition, staggerContainer } from "@/lib/motion-constants";

import { HotTruncate } from "./HotTruncate";

import type { TechBaseline } from "@/data/saas-stagefit/baseline-matrix";
import type {
	Persona,
	TechDimension,
	TechQuestion,
	TechScore,
	Zone,
} from "@/data/saas-stagefit/types";

const TECH_QS = QUIZ_QUESTIONS.filter((q): q is TechQuestion => q.kind === "tech");
const HOT_TRUNCATE_THRESHOLD = 3;

interface TechQuestionsProps {
	persona: Persona;
	onComplete: (answers: Record<TechDimension, TechScore>) => void;
	baseline?: TechBaseline;
}

export function TechQuestions({ persona, onComplete, baseline }: TechQuestionsProps) {
	const [index, setIndex] = useState(0);
	const [answers, setAnswers] = useState<Partial<Record<TechDimension, TechScore>>>({});
	const [hotTruncateDismissed, setHotTruncateDismissed] = useState(false);

	function handleSelect(dim: TechDimension, score: TechScore) {
		const next = { ...answers, [dim]: score };
		setAnswers(next);
		if (Object.keys(next).length === TECH_QS.length) {
			onComplete(next as Record<TechDimension, TechScore>);
			return;
		}
		if (index < TECH_QS.length - 1) {
			setIndex(index + 1);
		}
	}

	const question = TECH_QS[index];
	const questionText = persona === "founder" ? question.questionFounder : question.questionCto;

	const answeredCount = Object.keys(answers).length;
	const showHotTruncate =
		baseline && answeredCount >= HOT_TRUNCATE_THRESHOLD && !hotTruncateDismissed;

	let hotTruncateData: { misalignedCount: number; leaningZone: Zone } | null = null;
	if (showHotTruncate && baseline) {
		const dims = Object.entries(answers) as [TechDimension, TechScore][];
		const misaligned = dims.filter(([dim, score]) => Math.abs(score - baseline[dim]) >= 1);
		const totalDelta = dims.reduce((sum, [dim, score]) => sum + (score - baseline[dim]), 0);
		hotTruncateData = {
			misalignedCount: misaligned.length,
			leaningZone: totalDelta >= 0 ? "over-built" : "under-built",
		};
	}

	const CONTEXT_QUESTION_COUNT = 6;
	const totalQuestions = TECH_QS.length + CONTEXT_QUESTION_COUNT;
	const currentNumber = index + 1 + CONTEXT_QUESTION_COUNT;

	return (
		<section className="mx-auto max-w-2xl">
			<div className="mb-6 flex items-center justify-between">
				<span className="text-slate-text font-mono text-xs">
					{currentNumber} of {totalQuestions}
				</span>
				<span className="text-slate-text font-mono text-xs">{question.category}</span>
			</div>

			<m.div
				key={question.id}
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={snappySpringTransition}
			>
				<h3 className="text-mist-white mb-6 font-mono text-lg tracking-tight">{questionText}</h3>

				<m.div
					variants={staggerContainer}
					initial="hidden"
					animate="visible"
					className="flex flex-col gap-3"
				>
					{question.options.map((opt) => (
						<m.button
							key={opt.score}
							variants={fadeInUp}
							onClick={() => handleSelect(question.dimension, opt.score)}
							className="text-slate-text hover:text-mist-white hover:border-cyber-lime/40 focus-visible:ring-cyber-lime border border-white/10 px-5 py-3 text-left font-mono text-sm transition-colors focus:outline-none focus-visible:ring-2"
						>
							{opt.label}
						</m.button>
					))}
				</m.div>
			</m.div>

			{hotTruncateData && (
				<HotTruncate
					misalignedCount={hotTruncateData.misalignedCount}
					leaningZone={hotTruncateData.leaningZone}
					onContinue={() => setHotTruncateDismissed(true)}
				/>
			)}

			<div className="mt-8">
				<div className="h-1 w-full border border-white/5">
					<div
						className="bg-cyber-lime/40 h-full transition-all"
						style={{ width: `${(currentNumber / totalQuestions) * 100}%` }}
					/>
				</div>
			</div>
		</section>
	);
}
