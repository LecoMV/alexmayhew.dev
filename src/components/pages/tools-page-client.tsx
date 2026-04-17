"use client";

import { m } from "framer-motion";

import { springTransition } from "@/lib/motion-constants";

import type { ReactNode } from "react";

interface MotionWrapperProps {
	children: ReactNode;
	className?: string;
	delay?: number;
}

export function FadeInUp({ children, className, delay = 0 }: MotionWrapperProps) {
	return (
		<m.div
			className={className}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ ...springTransition, delay }}
		>
			{children}
		</m.div>
	);
}
