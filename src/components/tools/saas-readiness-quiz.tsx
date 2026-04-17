"use client";

import { m } from "framer-motion";
import { ArrowLeft, ArrowRight, BarChart3, CheckCircle2, Mail, Target } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { trackEvent } from "@/components/analytics/google-analytics";
import {
	calculateScore,
	getCategoryResults,
	getResultTier,
	getWeakestCategories,
	QUIZ_QUESTIONS,
} from "@/data/saas-readiness";
import { snappySpringTransition, springTransition } from "@/lib/motion-constants";

const QUIZ_ID = "saas-readiness";

type QuizPhase = "intro" | "questions" | "results";

export function SaasReadinessQuiz() {
	const [phase, setPhase] = useState<QuizPhase>("intro");
	const [currentIndex, setCurrentIndex] = useState(0);
	const [answers, setAnswers] = useState<Record<string, number>>({});

	// Timing refs — stable across renders, no re-trigger of effects
	const quizStartedAtRef = useRef<number | null>(null);
	const questionStartedAtRef = useRef<number>(Date.now());
	const completedRef = useRef<boolean>(false);

	const currentQuestion = QUIZ_QUESTIONS[currentIndex];

	// Fire quiz_start once on mount. The "intro" is the landing so users who bounce
	// before starting still count toward top-of-funnel. Firing on mount (not handleStart)
	// matches GA4's event_category semantics for impression-style starts.
	useEffect(() => {
		if (quizStartedAtRef.current !== null) return;
		quizStartedAtRef.current = Date.now();
		trackEvent("quiz_start", {
			quiz_id: QUIZ_ID,
			timestamp: quizStartedAtRef.current,
		});
	}, []);

	// Abandonment tracking — fires on unmount OR beforeunload if user did not complete.
	// completion_pct is computed from the LAST touched question (currentIndex), not answers.length,
	// because an abandon on question 3 still means they saw question 3.
	useEffect(() => {
		function fireAbandoned() {
			if (completedRef.current) return;
			// Only fire if they at least started answering (not just intro bounce)
			if (phase === "intro") return;
			const completionPct = Math.round((currentIndex / QUIZ_QUESTIONS.length) * 100);
			trackEvent("quiz_abandoned", {
				quiz_id: QUIZ_ID,
				last_question_index: currentIndex,
				completion_pct: completionPct,
			});
		}

		window.addEventListener("beforeunload", fireAbandoned);
		return () => {
			window.removeEventListener("beforeunload", fireAbandoned);
			fireAbandoned();
		};
	}, [phase, currentIndex]);

	const handleStart = useCallback(() => {
		setPhase("questions");
		questionStartedAtRef.current = Date.now();
	}, []);

	const handleAnswer = useCallback(
		(score: number, label: string) => {
			const now = Date.now();
			const timeOnQuestionMs = now - questionStartedAtRef.current;

			trackEvent("quiz_question_answered", {
				quiz_id: QUIZ_ID,
				question_index: currentIndex,
				question_id: currentQuestion.id,
				answer_value: score,
				answer_label: label,
				time_on_question_ms: timeOnQuestionMs,
			});

			const newAnswers = { ...answers, [currentQuestion.id]: score };
			setAnswers(newAnswers);

			if (currentIndex < QUIZ_QUESTIONS.length - 1) {
				setCurrentIndex(currentIndex + 1);
				questionStartedAtRef.current = now;
			} else {
				completedRef.current = true;
				const { percent } = calculateScore(newAnswers);
				const tier = getResultTier(percent);
				const totalMs = quizStartedAtRef.current ? now - quizStartedAtRef.current : 0;
				trackEvent("quiz_complete", {
					quiz_id: QUIZ_ID,
					score: percent,
					tier: tier.id,
					time_total_ms: totalMs,
				});
				setPhase("results");
			}
		},
		[answers, currentIndex, currentQuestion]
	);

	const handleRestart = useCallback(() => {
		setPhase("intro");
		setCurrentIndex(0);
		setAnswers({});
		completedRef.current = false;
		quizStartedAtRef.current = Date.now();
		questionStartedAtRef.current = Date.now();
	}, []);

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
					<span className="border-cyber-lime/50 text-cyber-lime text-micro border px-2 py-0.5 font-mono tracking-wider uppercase">
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
	onAnswer: (score: number, label: string) => void;
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
						onClick={() => onAnswer(option.score, option.label)}
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
												? "bg-signal-warn h-full"
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

			{/* Email capture — lead magnet */}
			<EmailCapture tier={tier.id} />

			{/* CTAs */}
			<div className="grid gap-4 sm:grid-cols-2">
				<Link
					href="/contact"
					onClick={() =>
						trackEvent("quiz_cta_click", {
							quiz_id: QUIZ_ID,
							cta_label: "Book a Strategy Call",
							cta_destination: "contact",
							tier: tier.id,
						})
					}
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
					onClick={() => {
						trackEvent("quiz_cta_click", {
							quiz_id: QUIZ_ID,
							cta_label: "Retake Assessment",
							cta_destination: "retake",
							tier: tier.id,
						});
						onRestart();
					}}
					className="text-slate-text hover:text-mist-white focus-visible:ring-cyber-lime border border-white/10 px-6 py-3 font-mono text-sm tracking-tight transition-colors hover:border-white/30 focus:outline-none focus-visible:ring-2"
				>
					<ArrowLeft className="mr-2 inline-block h-4 w-4" strokeWidth={1.5} />
					Retake Assessment
				</button>
			</div>
		</m.section>
	);
}

type EmailCaptureState = "idle" | "submitting" | "success" | "error";

function EmailCapture({ tier }: { tier: string }) {
	const [email, setEmail] = useState("");
	const [state, setState] = useState<EmailCaptureState>("idle");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (state === "submitting") return;

		setState("submitting");
		setErrorMessage(null);

		// Track the capture intent before the network call — we care about lead quality,
		// not just successful Listmonk inserts. A rate-limited submit is still a lead signal.
		trackEvent("lead_magnet_email_capture", {
			source: "saas-readiness-quiz",
			tier,
		});

		try {
			const result = await subscribeToNewsletter({
				email,
				source: "quiz-results",
			});

			if (result.success) {
				setState("success");
			} else {
				setState("error");
				setErrorMessage(result.error ?? "Unable to send results. Please try again.");
			}
		} catch {
			setState("error");
			setErrorMessage("An unexpected error occurred. Please try again.");
		}
	}

	if (state === "success") {
		return (
			<div
				role="status"
				className="border-cyber-lime/40 bg-cyber-lime/5 mb-6 border p-6"
				aria-live="polite"
			>
				<div className="mb-2 flex items-center gap-3">
					<CheckCircle2 className="text-cyber-lime h-5 w-5" strokeWidth={1.5} />
					<span className="text-cyber-lime font-mono text-xs tracking-wider uppercase">
						Check Your Inbox
					</span>
				</div>
				<p className="text-slate-text text-sm leading-relaxed">
					We sent your results and a confirmation link to{" "}
					<span className="text-mist-white">{email}</span>. Confirm to receive the Architects Brief
					with scaling playbooks.
				</p>
			</div>
		);
	}

	return (
		<div className="mb-6 border border-white/10 p-6">
			<div className="mb-3 flex items-center gap-3">
				<Mail className="text-cyber-lime h-5 w-5" strokeWidth={1.5} />
				<span className="text-cyber-lime font-mono text-xs tracking-wider uppercase">
					Email My Results
				</span>
			</div>
			<p className="text-slate-text mb-4 text-sm leading-relaxed">
				Get a detailed PDF of your scores plus monthly scaling playbooks in the Architects Brief.
			</p>
			<form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
				<label htmlFor="quiz-email" className="sr-only">
					Email address
				</label>
				<input
					id="quiz-email"
					type="email"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="you@company.com"
					disabled={state === "submitting"}
					className="text-mist-white placeholder:text-slate-text/60 focus-visible:border-cyber-lime focus-visible:ring-cyber-lime flex-1 border border-white/10 bg-transparent px-4 py-3 font-mono text-sm focus:outline-none focus-visible:ring-2 disabled:opacity-50"
					aria-invalid={state === "error"}
					aria-describedby={errorMessage ? "quiz-email-error" : undefined}
				/>
				<button
					type="submit"
					disabled={state === "submitting"}
					className="group border-cyber-lime bg-cyber-lime/10 text-cyber-lime hover:bg-cyber-lime/20 focus-visible:ring-cyber-lime border px-6 py-3 font-mono text-sm tracking-tight transition-colors focus:outline-none focus-visible:ring-2 disabled:opacity-50"
				>
					{state === "submitting" ? "Sending..." : "Send My Results"}
				</button>
			</form>
			{errorMessage && (
				<p id="quiz-email-error" role="alert" className="text-burnt-ember mt-3 font-mono text-xs">
					{errorMessage}
				</p>
			)}
		</div>
	);
}
