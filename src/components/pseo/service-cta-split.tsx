"use client";

import { m } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { trackCTAClick } from "@/components/analytics";
import { NewsletterSignup } from "@/components/newsletter/newsletter-signup";
import { gentleSpring, springTransition } from "@/lib/motion-constants";

export interface ServiceCtaSplitProps {
	title: string;
	description: string;
	ctaLabel: string;
	/** Analytics event name passed to trackCTAClick. */
	ctaEventName: string;
	/** cta_location value for analytics payload. */
	ctaLocation: string;
	/** Caption above the newsletter signup. Defaults to the standard copy. */
	newsletterCaption?: string;
}

/**
 * Bottom-of-page CTA for /services/[slug] pages.
 *
 * Split horizontal layout (headline + description LEFT, button RIGHT on md+).
 * Intentionally distinct from the centered `CtaSection` used by comparison/
 * integration/migration pages — those read as terminal statements, whereas the
 * service page pairs the CTA with a secondary newsletter capture to reduce
 * abandonment cost when the visitor isn't ready to book.
 */
export function ServiceCtaSplit({
	title,
	description,
	ctaLabel,
	ctaEventName,
	ctaLocation,
	newsletterCaption = "Not ready to talk? Stay in the loop.",
}: ServiceCtaSplitProps) {
	return (
		<m.section
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-100px" }}
			transition={springTransition}
		>
			<div className="bg-gunmetal-glass/20 relative border border-white/10 p-8 backdrop-blur-sm md:p-12">
				<div className="border-cyber-lime absolute top-0 right-0 h-6 w-6 border-t border-r" />
				<div className="border-cyber-lime absolute bottom-0 left-0 h-6 w-6 border-b border-l" />

				<div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
					<div>
						<h2 className="mb-2 font-mono text-2xl tracking-tight md:text-3xl">{title}</h2>
						<p className="text-slate-text max-w-xl">{description}</p>
					</div>

					<Link
						href="/contact"
						onClick={() => trackCTAClick(ctaEventName, { cta_location: ctaLocation })}
						className="group hover:border-cyber-lime relative flex shrink-0 items-center gap-3 border border-white/20 px-6 py-4 transition-colors duration-300"
					>
						<span className="group-hover:text-cyber-lime font-mono text-sm tracking-tight transition-colors">
							{ctaLabel}
						</span>
						<ArrowRight
							className="text-slate-text group-hover:text-cyber-lime h-4 w-4 transition-all duration-300 group-hover:translate-x-1"
							strokeWidth={1.5}
						/>
						<m.div
							className="bg-cyber-lime/5 absolute inset-0"
							initial={{ opacity: 0 }}
							whileHover={{ opacity: 1 }}
							transition={gentleSpring}
						/>
					</Link>
				</div>

				<div className="mt-8 border-t border-white/10 pt-8">
					<p className="text-slate-text mb-4 text-center font-mono text-xs tracking-wider uppercase">
						{newsletterCaption}
					</p>
					<NewsletterSignup variant="minimal" />
				</div>
			</div>
		</m.section>
	);
}
