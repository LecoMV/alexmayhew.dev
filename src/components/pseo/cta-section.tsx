"use client";

import { m } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { trackCTAClick } from "@/components/analytics";
import { NewsletterSignup } from "@/components/newsletter/newsletter-signup";
import { fadeInUp, staggerContainer } from "@/lib/motion-constants";

export interface CtaSectionProps {
	title: string;
	description: string;
	ctaLabel: string;
	/** Analytics event name passed to trackCTAClick. */
	ctaEventName: string;
	/** cta_location value for analytics payload. */
	ctaLocation: string;
	/** Optional small footnote below the CTA button. */
	footnote?: string;
}

/**
 * Shared bottom-of-page CTA for pSEO pages (comparisons, integrations, migrations).
 * Centered variant only — the /services/[slug] hero uses a bespoke split layout.
 */
export function CtaSection({
	title,
	description,
	ctaLabel,
	ctaEventName,
	ctaLocation,
	footnote,
}: CtaSectionProps) {
	return (
		<m.section
			className="mb-10"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-100px" }}
			variants={staggerContainer}
		>
			<m.div
				variants={fadeInUp}
				className="bg-gunmetal-glass/30 relative border border-white/10 p-8 text-center sm:p-12"
			>
				<div className="border-cyber-lime absolute top-0 right-0 h-4 w-4 border-t border-r" />
				<div className="border-cyber-lime absolute bottom-0 left-0 h-4 w-4 border-b border-l" />

				<h2 className="text-mist-white mb-4 font-mono text-2xl tracking-tight sm:text-3xl">
					{title}
				</h2>
				<p className="text-slate-text mx-auto mb-8 max-w-2xl">{description}</p>

				<Link
					href="/contact"
					onClick={() => trackCTAClick(ctaEventName, { cta_location: ctaLocation })}
					className="group hover:border-cyber-lime relative inline-flex items-center gap-2 border border-white/20 px-8 py-4 transition-colors duration-300"
				>
					<span className="group-hover:text-cyber-lime font-mono text-sm tracking-tight transition-colors">
						{ctaLabel}
					</span>
					<ArrowRight className="group-hover:text-cyber-lime h-4 w-4 transition-colors" />
					<div className="bg-cyber-lime/5 absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
				</Link>

				{footnote && <p className="text-slate-text mt-6 font-mono text-xs">{footnote}</p>}

				<div className="mt-8 border-t border-white/10 pt-8">
					<p className="text-slate-text mb-4 text-center font-mono text-xs tracking-wider uppercase">
						Not ready to talk? Stay in the loop.
					</p>
					<NewsletterSignup variant="minimal" />
				</div>
			</m.div>
		</m.section>
	);
}
