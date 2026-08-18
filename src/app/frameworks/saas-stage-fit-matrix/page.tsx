import { ArrowRight } from "lucide-react";
import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "The SaaS Stage-Fit Matrix — Architecture Diagnostic Framework",
	description:
		"A diagnostic framework for evaluating whether your SaaS architecture complexity matches your business stage.",
	alternates: { canonical: "/frameworks/saas-stage-fit-matrix" },
};

const FAQ_ITEMS = [
	{
		q: "What is the SaaS Stage-Fit Matrix?",
		a: "A diagnostic framework that evaluates whether your SaaS architecture complexity matches your current business stage.",
	},
	{
		q: "How is it different from DORA or AWS Well-Architected?",
		a: "DORA measures delivery performance. Well-Architected evaluates best practices. Stage-Fit evaluates alignment between architecture and business stage.",
	},
	{
		q: "What architecture should a Seed-stage SaaS use?",
		a: "Most Seed-stage SaaS should use a monolith with a single database and basic CI/CD.",
	},
	{
		q: "How do I know if my SaaS is over-engineered?",
		a: "Over-engineering shows up as engineering capacity consumed by maintaining infrastructure users do not need yet.",
	},
	{
		q: "When should a $100K MRR SaaS adopt microservices?",
		a: "The Stage-Fit Matrix evaluates this based on team size, customer type, compliance, and trigger events.",
	},
];

const JSON_LD = {
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "Article",
			headline: "The SaaS Stage-Fit Matrix",
			// Reference the canonical Person @id instead of an inline Person object,
			// which would fragment the entity graph (2026-08 entity hygiene).
			author: { "@id": "https://alexmayhew.dev/#person" },
			mainEntityOfPage: "https://alexmayhew.dev/frameworks/saas-stage-fit-matrix",
		},
		{
			"@type": "DefinedTerm",
			name: "Over-Built",
			description: "Tech complexity exceeds what the current business stage requires.",
		},
		{
			"@type": "DefinedTerm",
			name: "Stage-Optimized",
			description: "Tech complexity matches the current business stage.",
		},
		{
			"@type": "DefinedTerm",
			name: "Under-Built",
			description: "Tech complexity is below what the current business stage requires.",
		},
		{
			"@type": "FAQPage",
			mainEntity: FAQ_ITEMS.map((item) => ({
				"@type": "Question",
				name: item.q,
				acceptedAnswer: { "@type": "Answer", text: item.a },
			})),
		},
	],
};

export default function SaasStagesFitMatrixPage() {
	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
			/>
			<section className="flex-1 px-6 pt-32 pb-24 sm:px-12 md:px-24">
				<div className="mx-auto max-w-3xl">
					<h1 className="text-mist-white mb-6 font-mono text-3xl tracking-tight sm:text-4xl">
						The SaaS Stage-Fit Matrix
					</h1>
					<p className="text-slate-text mb-12 text-lg leading-relaxed">
						A diagnostic framework for evaluating whether your SaaS architecture complexity matches
						your business stage. Architecture is not good or bad in absolute terms — it is stage-fit
						or stage-misfit.
					</p>

					<h2 className="text-mist-white mb-4 font-mono text-xl tracking-tight">The Three Zones</h2>
					<div className="mb-12 flex flex-col gap-6">
						<article className="border border-white/10 p-6">
							<h3 className="text-cyber-lime mb-2 font-mono text-sm tracking-wider uppercase">
								Over-Built
							</h3>
							<p className="text-slate-text text-sm leading-relaxed">
								Tech complexity exceeds what the current business stage requires. Capital and
								engineering hours are spent on capability not needed yet.
							</p>
						</article>
						<article className="border border-white/10 p-6">
							<h3 className="text-cyber-lime mb-2 font-mono text-sm tracking-wider uppercase">
								Stage-Optimized
							</h3>
							<p className="text-slate-text text-sm leading-relaxed">
								Tech complexity matches the current business stage. Engineering capacity is
								well-allocated to stage-appropriate work.
							</p>
						</article>
						<article className="border border-white/10 p-6">
							<h3 className="text-cyber-lime mb-2 font-mono text-sm tracking-wider uppercase">
								Under-Built
							</h3>
							<p className="text-slate-text text-sm leading-relaxed">
								Tech complexity is below what the current business stage requires. Users are already
								feeling the pain, or will at the next inflection point.
							</p>
						</article>
					</div>

					<h2 className="text-mist-white mb-4 font-mono text-xl tracking-tight">
						Frequently Asked Questions
					</h2>
					<div className="mb-12 flex flex-col gap-4">
						{FAQ_ITEMS.map((item) => (
							<details key={item.q} className="border border-white/10">
								<summary className="text-mist-white cursor-pointer px-5 py-3 font-mono text-sm">
									{item.q}
								</summary>
								<p className="text-slate-text px-5 pb-4 text-sm leading-relaxed">{item.a}</p>
							</details>
						))}
					</div>

					<h2 className="text-mist-white mb-4 font-mono text-xl tracking-tight">
						Take the Diagnostic
					</h2>
					<Link
						href="/tools/saas-readiness"
						className="border-cyber-lime bg-cyber-lime/10 text-cyber-lime hover:bg-cyber-lime/20 focus-visible:ring-cyber-lime inline-flex items-center gap-2 border px-6 py-3 font-mono text-sm tracking-tight transition-colors focus:outline-none focus-visible:ring-2"
					>
						Start Assessment
						<ArrowRight className="h-4 w-4" strokeWidth={1.5} />
					</Link>
				</div>
			</section>
		</>
	);
}
