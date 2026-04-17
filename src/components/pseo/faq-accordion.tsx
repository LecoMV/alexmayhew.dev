"use client";

import { m } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";

import { fadeInUp, springTransition, staggerContainer } from "@/lib/motion-constants";
import { cn } from "@/lib/utils";

import type { FaqItem } from "@/data/pseo";

export type FaqAccordionVariant = "default" | "service";

export interface FaqAccordionProps {
	faqs: FaqItem[];
	heading: string;
	/** Index to open on mount. Pass null to start fully collapsed. Defaults to null. */
	initialOpenIndex?: number | null;
	/**
	 * Visual variant. `default` preserves behavior for comparison/integration/migration
	 * consumers. `service` applies the bespoke /services/[slug] styling (space-y-3,
	 * bg-gunmetal-glass/10, <h3> questions in text-mist-white, per-item stagger).
	 */
	variant?: FaqAccordionVariant;
}

export function FaqAccordion({
	faqs,
	heading,
	initialOpenIndex = null,
	variant = "default",
}: FaqAccordionProps) {
	const [openIndex, setOpenIndex] = useState<number | null>(initialOpenIndex);

	if (variant === "service") {
		return (
			<m.section
				className="mb-20"
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: "-100px" }}
				transition={springTransition}
			>
				<h2 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
					<span className="mr-2 animate-pulse" aria-hidden="true">
						●
					</span>
					{heading}
				</h2>

				<div className="space-y-3">
					{faqs.map((faq, index) => (
						<m.div
							key={index}
							className="bg-gunmetal-glass/10 border border-white/10"
							initial={{ opacity: 0, y: 10 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ ...springTransition, delay: index * 0.05 }}
						>
							<button
								onClick={() => setOpenIndex(openIndex === index ? null : index)}
								className="flex w-full items-center justify-between p-5 text-left"
								aria-expanded={openIndex === index}
							>
								<div className="flex items-start gap-3">
									<HelpCircle
										className="text-cyber-lime mt-0.5 h-5 w-5 shrink-0"
										strokeWidth={1.5}
									/>
									<h3 className="text-mist-white pr-4 text-sm font-medium">{faq.question}</h3>
								</div>
								<ChevronDown
									className={cn(
										"text-slate-text h-5 w-5 shrink-0 transition-transform duration-200",
										openIndex === index && "rotate-180"
									)}
									strokeWidth={1.5}
								/>
							</button>

							{openIndex === index && (
								<m.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									className="border-t border-white/10 px-5 pt-4 pb-5 pl-13"
								>
									<p className="text-slate-text text-sm leading-relaxed">{faq.answer}</p>
								</m.div>
							)}
						</m.div>
					))}
				</div>
			</m.section>
		);
	}

	return (
		<m.section
			className="mb-20"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-100px" }}
			variants={staggerContainer}
		>
			<m.h2
				variants={fadeInUp}
				className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase"
			>
				<span className="mr-2 animate-pulse" aria-hidden="true">
					●
				</span>
				{heading}
			</m.h2>

			<m.div variants={fadeInUp} className="space-y-4">
				{faqs.map((faq, index) => (
					<div key={index} className="bg-gunmetal-glass/20 overflow-hidden border border-white/10">
						<button
							onClick={() => setOpenIndex(openIndex === index ? null : index)}
							className="flex w-full items-center justify-between p-6 text-left"
							aria-expanded={openIndex === index}
						>
							<div className="flex items-center gap-4">
								<HelpCircle className="text-cyber-lime h-5 w-5 flex-shrink-0" />
								<span className="text-mist-white font-mono text-sm">{faq.question}</span>
							</div>
							<ChevronDown
								className={cn(
									"text-slate-text h-5 w-5 flex-shrink-0 transition-transform duration-300",
									openIndex === index && "rotate-180"
								)}
							/>
						</button>

						{openIndex === index && (
							<m.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: "auto", opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={springTransition}
								className="border-t border-white/10 px-6 py-4"
							>
								<p className="text-slate-text pl-9 text-sm leading-relaxed">{faq.answer}</p>
							</m.div>
						)}
					</div>
				))}
			</m.div>
		</m.section>
	);
}
