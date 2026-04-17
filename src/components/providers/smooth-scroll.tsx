"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Routes where Lenis must NOT run:
// - /tools, /keystatic, /demo: need native scroll (CMS, interactive tools)
// - /blog: has its own scroll-progress bar that conflicts with Lenis rAF loop
const LENIS_BLOCKED_PREFIXES = ["/tools", "/keystatic", "/demo", "/blog"] as const;

export function SmoothScroll({ children }: { children: React.ReactNode }) {
	const lenisRef = useRef<Lenis | null>(null);
	const pathname = usePathname();

	useEffect(() => {
		const skip = pathname
			? LENIS_BLOCKED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
			: false;
		if (skip) return;

		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		if (prefersReducedMotion) return;

		const lenis = new Lenis({
			duration: 0.8,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			orientation: "vertical",
			gestureOrientation: "vertical",
			smoothWheel: true,
			wheelMultiplier: 1.2,
			touchMultiplier: 1.5,
		});

		lenisRef.current = lenis;

		function raf(time: number) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		return () => {
			lenis.destroy();
		};
	}, [pathname]);

	return <div className="smooth-scroll-wrapper">{children}</div>;
}
