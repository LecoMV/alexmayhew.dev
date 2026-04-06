"use client";

import { m } from "framer-motion";
import { ArrowLeft, ArrowRight, BarChart3, CheckCircle2, Target } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import {
	calculateScore,
	getCategoryResults,
	getResultTier,
	getWeakestCategories,
	QUIZ_QUESTIONS,
} from "@/data/saas-readiness";
import { snappySpringTransition, springTransition } from "@/lib/motion-constants";

type QuizPhase = "intro" | "questions" | "results";

export function SaasReadinessQuiz() {
	const [phase, setPhase] = useState<QuizPhase>("intro");
	const [currentIndex, setCurrentIndex] = useState(0);
	const [answers, setAnswers] = useState<Record<string, number>>({});

	const currentQuestion = QUIZ_QUESTIONS[currentIndex];

	function handleStart() {
		setPhase("questions");
	}

	function handleAnswer(score: number) {
		const newAnswers = { ...answers, [currentQuestion.id]: score };
		setAnswers(newAnswers);

		if (currentIndex < QUIZ_QUESTIONS.length - 1) {
			setCurrentIndex(currentIndex + 1);
		} else {
			setPhase("results");
		}
	}

	function handleRestart() {
		setPhase("intro");
		setCurrentIndex(0);
		setAnswers({});
	}

	if (phase === "intro") {
		return <IntroScreen onStart={handleStart} />;
	}

	if (phase === "questions") {
		return (
			<QuestionScreen
				question={currentQuestion}
				currentIndex={currentIndex}
				totalQuestions={QUIZ_QUESTIONS.length}
				onAnswer={handleAnswer}
			/>
		);
	}

	return <ResultsScreen answers={answers} onRestart={handleRestart} />;
}

function IntroScreen({ onStart }: { onStart: () => void }) {
	return (
		<m.section
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={springTransition}
			className="mx-auto max-w-2xl"
		>
			<div className="border border-white/10 p-8 md:p-12">
				{/* Corner accents */}
				<div className="border-cyber-lime/40 absolute top-0 left-0 h-6 w-6 border-t-2 border-l-2" />
				<div className="border-cyber-lime/40 absolute top-0 right-0 h-6 w-6 border-t-2 border-r-2" />
				<div className="border-cyber-lime/40 absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2" />
				<div className="border-cyber-lime/40 absolute right-0 bottom-0 h-6 w-6 border-r-2 border-b-2" />

				<div className="mb-6 flex items-center gap-3">
					<Target className="text-cyber-lime h-6 w-6" strokeWidth={1.5} />
					<span className="border-cyber-lime/50 text-cyber-lime border px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase">
						Diagnostic Tool
					</span>
				</div>

				<h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
					SaaS Scaling Readiness Assessment
				</h1>

				<p className="text-slate-text mb-6 text-sm leading-relaxed md:text-base">
					8 questions across architecture, infrastructure, security, and team maturity. Takes under
					3 minutes. No email required.
				</p>

				<div className="mb-8 space-y-3">
					{[
						"Architecture & Database",
						"CI/CD & Observability",
						"Security & Team",
						"Performance & Data",
					].map((item) => (
						<div key={item} className="text-slate-text flex items-center gap-2">
							<CheckCircle2 className="text-cyber-lime/60 h-4 w-4" strokeWidth={1.5} />
							<span className="font-mono text-xs">{item}</span>
						</div>
					))}
				</div>

				<button
					type="button"
					onClick={onStart}
					className="group border-cyber-lime bg-cyber-lime/10 text-cyber-lime hover:bg-cyber-lime/20 focus-visible:ring-cyber-lime relative w-full border px-6 py-3 font-mono text-sm tracking-tight transition-colors focus:outline-none focus-visible:ring-2"
				>
					Start Assessment
					<ArrowRight
						className="ml-2 inline-block h-4 w-4 transition-transform group-hover:translate-x-1"
						strokeWidth={1.5}
					/>
				</button>
			</div>
		</m.section>
	);
}

function QuestionScreen({
	question,
	currentIndex,
	totalQuestions,
	onAnswer,
}: {
	question: (typeof QUIZ_QUESTIONS)[number];
	currentIndex: number;
	totalQuestions: number;
	onAnswer: (score: number) => void;
}) {
	const progress = (currentIndex / totalQuestions) * 100;

	return (
		<m.section
			initial={{ opacity: 0, x: 40 }}
			animate={{ opacity: 1, x: 0 }}
			transition={snappySpringTransition}
			className="mx-auto max-w-2xl"
		>
			{/* Progress bar */}
			<div className="mb-8">
				<div className="mb-2 flex items-center justify-between">
					<span className="text-slate-text font-mono text-xs">
						{currentIndex + 1} of {totalQuestions}
					</span>
					<span className="text-slate-text font-mono text-xs">{question.category}</span>
				</div>
				<div className="h-1 w-full bg-white/5">
					<m.div
						className="bg-cyber-lime h-full"
						initial={{ width: 0 }}
						animate={{ width: `${progress}%` }}
						transition={snappySpringTransition}
					/>
				</div>
			</div>

			{/* Question */}
			<div className="mb-8">
				<h2 className="text-cyber-lime mb-2 font-mono text-xs tracking-wider uppercase">
					{question.category}
				</h2>
				<p className="text-xl font-bold tracking-tight md:text-2xl">{question.question}</p>
			</div>

			{/* Options */}
			<div role="group" aria-label="Answer options" className="space-y-3">
				{question.options.map((option) => (
					<button
						key={option.score}
						type="button"
						onClick={() => onAnswer(option.score)}
						className="group hover:border-cyber-lime/50 hover:bg-cyber-lime/5 focus-visible:ring-cyber-lime w-full border border-white/10 p-4 text-left font-mono text-sm transition-all focus:outline-none focus-visible:ring-2"
					>
						<span className="text-slate-text group-hover:text-mist-white transition-colors">
							{option.label}
						</span>
					</button>
				))}
			</div>
		</m.section>
	);
}

function ResultsScreen({
	answers,
	onRestart,
}: {
	answers: Record<string, number>;
	onRestart: () => void;
}) {
	const { percent } = calculateScore(answers);
	const tier = getResultTier(percent);
	const categoryResults = getCategoryResults(answers);
	const weakest = getWeakestCategories(categoryResults);

	return (
		<m.section
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={springTransition}
			className="mx-auto max-w-2xl"
		>
			{/* Score header */}
			<div className="mb-6 border border-white/10 p-8">
				<div className="mb-4 flex items-center gap-3">
					<BarChart3 className="text-cyber-lime h-6 w-6" strokeWidth={1.5} />
					<span className="text-slate-text font-mono text-xs tracking-wider uppercase">
						Assessment Complete
					</span>
				</div>

				<h2 className="mb-1 text-3xl font-bold tracking-tight">Your Results</h2>

				<div className="mb-4 flex items-baseline gap-3">
					<span className="text-cyber-lime font-mono text-5xl font-bold">{percent}%</span>
					<span className="text-mist-white text-xl font-bold">{tier.label}</span>
				</div>

				{/* Score bar */}
				<div className="mb-4 h-2 w-full bg-white/5">
					<m.div
						className="bg-cyber-lime h-full"
						initial={{ width: 0 }}
						animate={{ width: `${percent}%` }}
						transition={{ ...springTransition, delay: 0.2 }}
					/>
				</div>

				<p className="text-slate-text text-sm leading-relaxed">{tier.summary}</p>
			</div>

			{/* Category breakdown */}
			<div className="mb-6 border border-white/10 p-8">
				<h3 className="text-cyber-lime mb-6 font-mono text-xs tracking-wider uppercase">
					Category Breakdown
				</h3>
				<div className="space-y-4">
					{categoryResults.map((cat) => (
						<div key={cat.category}>
							<div className="mb-1 flex items-center justify-between">
								<span className="text-mist-white font-mono text-xs">{cat.category}</span>
								<span className="text-slate-text font-mono text-xs">{cat.percent}%</span>
							</div>
							<div className="h-1.5 w-full bg-white/5">
								<m.div
									className={
										cat.percent >= 75
											? "bg-cyber-lime h-full"
											: cat.percent >= 50
												? "h-full bg-amber-400"
												: "bg-burnt-ember h-full"
									}
									initial={{ width: 0 }}
									animate={{ width: `${cat.percent}%` }}
									transition={{ ...springTransition, delay: 0.1 }}
								/>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Recommendations */}
			<div className="mb-6 border border-white/10 p-8">
				<h3 className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
					Priority Recommendations
				</h3>
				{weakest.length > 0 && weakest[0].percent < 100 && (
					<p className="text-slate-text mb-4 font-mono text-xs">
						Based on your weakest areas: {weakest.map((w) => w.category).join(", ")}
					</p>
				)}
				<ul className="space-y-3">
					{tier.recommendations.map((rec, i) => (
						<li key={i} className="text-slate-text flex gap-3 text-sm leading-relaxed">
							<span className="text-cyber-lime mt-0.5 shrink-0 font-mono text-xs">
								{String(i + 1).padStart(2, "0")}
							</span>
							{rec}
						</li>
					))}
				</ul>
			</div>

			{/* CTAs */}
			<div className="grid gap-4 sm:grid-cols-2">
				<Link
					href="/contact"
					className="group border-cyber-lime bg-cyber-lime/10 text-cyber-lime hover:bg-cyber-lime/20 focus-visible:ring-cyber-lime border px-6 py-3 text-center font-mono text-sm tracking-tight transition-colors focus:outline-none focus-visible:ring-2"
				>
					Book a Strategy Call
					<ArrowRight
						className="ml-2 inline-block h-4 w-4 transition-transform group-hover:translate-x-1"
						strokeWidth={1.5}
					/>
				</Link>
				<button
					type="button"
					onClick={onRestart}
					className="text-slate-text hover:text-mist-white focus-visible:ring-cyber-lime border border-white/10 px-6 py-3 font-mono text-sm tracking-tight transition-colors hover:border-white/30 focus:outline-none focus-visible:ring-2"
				>
					<ArrowLeft className="mr-2 inline-block h-4 w-4" strokeWidth={1.5} />
					Retake Assessment
				</button>
			</div>
		</m.section>
	);
}
