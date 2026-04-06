import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { SaasReadinessQuiz } from "@/components/tools/saas-readiness-quiz";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "SaaS Scaling Readiness Assessment",
	description:
		"Evaluate your SaaS architecture maturity across 8 dimensions: architecture, database, CI/CD, observability, security, team, performance, and data. Get actionable recommendations in under 3 minutes.",
	keywords: [
		"SaaS readiness assessment",
		"scaling readiness",
		"architecture maturity",
		"technical due diligence",
		"SaaS scaling",
		"infrastructure assessment",
		"CTO checklist",
		"engineering maturity",
	],
	openGraph: {
		title: "SaaS Scaling Readiness Assessment | Alex Mayhew",
		description:
			"8 questions. Under 3 minutes. Find out where your SaaS architecture stands and what to fix first.",
		type: "website",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "SaaS Scaling Readiness Assessment",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "SaaS Scaling Readiness Assessment",
		description:
			"8 questions. Under 3 minutes. Find out where your SaaS architecture stands and what to fix first.",
		images: ["/og-image.png"],
	},
	alternates: {
		canonical: "/tools/saas-readiness",
	},
};

export default function SaasReadinessPage() {
	return (
		<section className="flex-1 px-6 pt-32 pb-24 sm:px-12 md:px-24">
			<div className="max-w-content mx-auto">
				{/* Breadcrumb */}
				<nav className="mb-8">
					<Link
						href="/tools"
						className="text-slate-text hover:text-cyber-lime inline-flex items-center gap-2 font-mono text-xs transition-colors"
					>
						<ArrowLeft className="h-3 w-3" strokeWidth={1.5} />
						<span>Back to Tools</span>
					</Link>
				</nav>

				{/* Quiz */}
				<SaasReadinessQuiz />
			</div>
		</section>
	);
}
