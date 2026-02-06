"use client";

import { useEffect, useState, useRef } from "react";
import { useBlogTheme } from "@/lib/blog-themes";

export function ReadingProgress() {
	const { theme } = useBlogTheme();
	const [progress, setProgress] = useState(0);
	const rafRef = useRef<number>(0);

	useEffect(() => {
		function updateProgress() {
			const scrollTop = window.scrollY;
			const docHeight = document.documentElement.scrollHeight - window.innerHeight;
			if (docHeight > 0) {
				setProgress(Math.min(100, (scrollTop / docHeight) * 100));
			}
			rafRef.current = requestAnimationFrame(updateProgress);
		}

		rafRef.current = requestAnimationFrame(updateProgress);
		return () => cancelAnimationFrame(rafRef.current);
	}, []);

	if (progress <= 0) return null;

	return (
		<div
			className="fixed top-0 right-0 left-0 z-50 h-0.5"
			role="progressbar"
			aria-valuenow={Math.round(progress)}
		>
			<div
				className="h-full transition-[width] duration-100 ease-out"
				style={{
					width: `${progress}%`,
					backgroundColor: theme.colors.accent,
				}}
			/>
		</div>
	);
}
