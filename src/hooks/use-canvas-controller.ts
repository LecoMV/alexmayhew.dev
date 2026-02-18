import { type MutableRefObject, type RefObject, useEffect, useRef } from "react";

interface NavigatorConnection {
	saveData?: boolean;
}

interface CanvasControllerResult {
	isActiveRef: MutableRefObject<boolean>;
	fidelityRef: MutableRefObject<number>;
}

export function useCanvasController(
	canvasRef: RefObject<HTMLCanvasElement | null>
): CanvasControllerResult {
	const isActiveRef = useRef(false);
	const fidelityRef = useRef(1);
	const isIntersectingRef = useRef(false);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
		if (reducedMotion.matches) {
			fidelityRef.current = 0;
			return;
		}

		const connection = (navigator as Navigator & { connection?: NavigatorConnection }).connection;
		if (connection?.saveData) {
			fidelityRef.current = 0.5;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				isIntersectingRef.current = entry.isIntersecting;
				isActiveRef.current = entry.isIntersecting && document.visibilityState === "visible";
			},
			{ rootMargin: "50px" }
		);

		observer.observe(canvas);

		const handleVisibility = () => {
			if (document.visibilityState === "visible") {
				isActiveRef.current = isIntersectingRef.current;
			} else {
				isActiveRef.current = false;
			}
		};

		document.addEventListener("visibilitychange", handleVisibility);

		return () => {
			observer.disconnect();
			document.removeEventListener("visibilitychange", handleVisibility);
		};
	}, [canvasRef]);

	return { isActiveRef, fidelityRef };
}
