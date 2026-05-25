"use client";

import { m } from "framer-motion";
import { ArrowRight, BarChart3 } from "lucide-react";
import Link from "next/link";

import { fadeInUp, staggerContainer } from "@/lib/motion-constants";

interface IntroScreenProps {
	onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
	return (
		<m.section
			variants={staggerContainer}
			initial="hidden"
			animate="visible"
			className="mx-auto max-w-2xl"
		>
			<m.div variants={fadeInUp} className="mb-8 flex items-center gap-3">
				<BarChart3 className="text-cyber-lime h-6 w-6" strokeWidth={1.5} />
				<span className="text-cyber-lime font-mono text-xs tracking-wider uppercase">
					Architecture Diagnostic
				</span>
			</m.div>

			<m.h2
				variants={fadeInUp}
				className="text-mist-white mb-4 font-mono text-2xl tracking-tight sm:text-3xl"
			>
				SaaS Stage-Fit Matrix
			</m.h2>

			<m.p variants={fadeInUp} className="text-slate-text mb-6 text-base leading-relaxed">
				Architecture is not good or bad in absolute terms — it is stage-fit or stage-misfit. The
				same stack that is over-engineered at Seed is under-built at Series B. This diagnostic maps
				your tech complexity against your business stage to find the misalignment.
			</m.p>

			<m.div variants={fadeInUp} className="mb-8 border border-white/10 p-5">
				<p className="text-slate-text text-sm leading-relaxed">
					<span className="text-mist-white font-mono text-xs">14 questions</span>
					{" · "}
					<span className="text-mist-white font-mono text-xs">~5 minutes</span>
					{" · "}
					<span className="text-mist-white font-mono text-xs">free diagnostic</span>
				</p>
				<p className="text-slate-text mt-2 text-xs">
					Your answers are used only to compute your Stage-Fit position. We do not sell or share
					your data.
				</p>
			</m.div>

			<m.div variants={fadeInUp} className="flex flex-col gap-4 sm:flex-row sm:items-center">
				<button
					onClick={onStart}
					className="border-cyber-lime bg-cyber-lime/10 text-cyber-lime hover:bg-cyber-lime/20 focus-visible:ring-cyber-lime inline-flex items-center gap-2 border px-6 py-3 font-mono text-sm tracking-tight transition-colors focus:outline-none focus-visible:ring-2"
				>
					Start Assessment
					<ArrowRight className="h-4 w-4" strokeWidth={1.5} />
				</button>
				<Link
					href="/frameworks/saas-stage-fit-matrix"
					className="text-slate-text hover:text-mist-white font-mono text-xs underline decoration-white/20 underline-offset-4 transition-colors"
				>
					What is the Stage-Fit Matrix?
				</Link>
			</m.div>
		</m.section>
	);
}
