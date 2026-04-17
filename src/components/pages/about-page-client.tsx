"use client";

import { m } from "framer-motion";

import { springTransition } from "@/lib/motion-constants";

import type { ReactNode } from "react";

interface MotionWrapperProps {
	children: ReactNode;
	className?: string;
	delay?: number;
}

/**
 * Animated <section> wrapper used by the /about page for whileInView reveals.
 * Mirrors the existing inline motion.section blocks so the static Server
 * Component shell can compose animated regions without pulling framer-motion
 * into the route bundle itself.
 */
export function MotionSection({ children, className, delay = 0 }: MotionWrapperProps) {
	return (
		<m.section
			className={className}
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-100px" }}
			transition={{ ...springTransition, delay }}
		>
			{children}
		</m.section>
	);
}

/**
 * Card-grid child with whileInView + per-card delay. Used inside
 * MotionSection grids (differentiators, skills, timeline) where each
 * card staggers in after the section heading reveals.
 */
export function MotionCard({ children, className, delay = 0 }: MotionWrapperProps) {
	return (
		<m.div
			className={className}
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ ...springTransition, delay }}
		>
			{children}
		</m.div>
	);
}

interface MotionDivProps extends MotionWrapperProps {
	/** If provided, uses x-axis slide instead of default y-axis. */
	fromX?: number;
}

/**
 * Above-the-fold animated <div> wrapper. Uses `animate` (not `whileInView`)
 * so the hero/intro blocks reveal immediately on mount rather than waiting
 * for scroll.
 */
export function MotionDiv({ children, className, delay = 0, fromX }: MotionDivProps) {
	const initial = fromX !== undefined ? { opacity: 0, x: fromX } : { opacity: 0, y: 20 };
	const target = fromX !== undefined ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 };
	return (
		<m.div
			className={className}
			initial={initial}
			animate={target}
			transition={{ ...springTransition, delay }}
		>
			{children}
		</m.div>
	);
}
