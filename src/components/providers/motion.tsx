"use client";

import { LazyMotion, domMax } from "framer-motion";

interface MotionProviderProps {
	children: React.ReactNode;
}

/**
 * LazyMotion Provider
 * Reduces Framer Motion bundle from ~34KB to ~5KB by:
 * - Loading animation features lazily
 * - Using domMax for full feature set
 * - Tree-shaking unused animation code
 *
 * All animated components must use `m` instead of `motion` prefix
 */
export function MotionProvider({ children }: MotionProviderProps) {
	return (
		<LazyMotion features={domMax} strict>
			{children}
		</LazyMotion>
	);
}
