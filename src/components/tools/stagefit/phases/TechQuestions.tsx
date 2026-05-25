"use client";

import { useState } from "react";

import { QUIZ_QUESTIONS } from "@/data/saas-stagefit/questions";

import type { Persona, TechDimension, TechQuestion, TechScore } from "@/data/saas-stagefit/types";

const TECH_QS = QUIZ_QUESTIONS.filter((q): q is TechQuestion => q.kind === "tech");

interface TechQuestionsProps {
	persona: Persona;
	onComplete: (answers: Record<TechDimension, TechScore>) => void;
}

export function TechQuestions({ persona, onComplete }: TechQuestionsProps) {
	const [answers, setAnswers] = useState<Partial<Record<TechDimension, TechScore>>>({});

	function handleSelect(dim: TechDimension, score: TechScore) {
		const next = { ...answers, [dim]: score };
		setAnswers(next);
		if (Object.keys(next).length === TECH_QS.length) {
			onComplete(next as Record<TechDimension, TechScore>);
		}
	}

	const questionText = (q: TechQuestion) =>
		persona === "founder" ? q.questionFounder : q.questionCto;

	return (
		<section>
			{TECH_QS.map((q) => (
				<div key={q.id}>
					<span>{questionText(q)}</span>
					{q.options.map((opt) => (
						<button key={opt.score} onClick={() => handleSelect(q.dimension, opt.score)}>
							{opt.label}
						</button>
					))}
				</div>
			))}
		</section>
	);
}
