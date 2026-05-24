"use client";

import { m } from "framer-motion";
import { useState } from "react";

import { QUIZ_QUESTIONS } from "@/data/saas-stagefit/questions";
import { fadeInUp, snappySpringTransition, staggerContainer } from "@/lib/motion-constants";

import type { ContextQuestion } from "@/data/saas-stagefit/types";

const CONTEXT_QS = QUIZ_QUESTIONS.filter((q): q is ContextQuestion => q.kind === "context");

interface ContextQuestionsProps {
	onComplete: (answers: Record<string, string>) => void;
}

export function ContextQuestions({ onComplete }: ContextQuestionsProps) {
	const [index, setIndex] = useState(0);
	const [answers, setAnswers] = useState<Record<string, string>>({});

	const question = CONTEXT_QS[index];

	function handleSelect(value: string) {
		const next = { ...answers, [question.id]: value };
		setAnswers(next);

		if (index < CONTEXT_QS.length - 1) {
			setIndex(index + 1);
		} else {
			onComplete(next);
		}
	}

	return (
		<section className="mx-auto max-w-2xl">
			<div className="mb-6 flex items-center justify-between">
				<span className="text-slate-text font-mono text-xs">
					{index + 1} of {CONTEXT_QS.length}
				</span>
				<span className="text-slate-text font-mono text-xs">{question.category}</span>
			</div>

			<m.div
				key={question.id}
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={snappySpringTransition}
			>
				<h3 className="text-mist-white mb-6 font-mono text-lg tracking-tight">
					{question.questionCto}
				</h3>

				<m.div
					variants={staggerContainer}
					initial="hidden"
					animate="visible"
					className="flex flex-col gap-3"
				>
					{question.options.map((opt) => (
						<m.button
							key={opt.value}
							variants={fadeInUp}
							onClick={() => handleSelect(opt.value)}
							className="text-slate-text hover:text-mist-white hover:border-cyber-lime/40 focus-visible:ring-cyber-lime border border-white/10 px-5 py-3 text-left font-mono text-sm transition-colors focus:outline-none focus-visible:ring-2"
						>
							{opt.label}
						</m.button>
					))}
				</m.div>
			</m.div>

			<div className="mt-8">
				<div className="h-1 w-full border border-white/5">
					<div
						className="bg-cyber-lime/40 h-full transition-all"
						style={{ width: `${((index + 1) / CONTEXT_QS.length) * 100}%` }}
					/>
				</div>
			</div>
		</section>
	);
}
