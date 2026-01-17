"use client";

import { useEffect, useRef } from "react";

interface AMLogoProps {
	size?: number;
	className?: string;
}

// ASCII art representation of "AM" - each row is a line
const AM_ASCII = [
	"  ▄▄▄      ███▄ ▄███▓",
	" ▐█  ▀█   ▓██▒▀█▀ ██▒",
	" ▄█▀▀██   ▓██    ▓██░",
	"▐█▄ ▄██▄  ▒██    ▒██ ",
	" ▀▀▀▀▀▀▀  ▒██▒   ░██▒",
];

export function AMLogo({ size = 48, className = "" }: AMLogoProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationRef = useRef<number>(0);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// High DPI support
		const dpr = window.devicePixelRatio || 1;
		canvas.width = size * dpr;
		canvas.height = size * dpr;
		ctx.scale(dpr, dpr);

		let time = 0;

		const animate = () => {
			time += 0.02;
			ctx.clearRect(0, 0, size, size);

			// Calculate font size to fit ASCII art
			const fontSize = Math.floor(size / 7);
			ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
			ctx.textBaseline = "top";

			// Draw each line of ASCII art
			AM_ASCII.forEach((line, rowIndex) => {
				const y = rowIndex * (fontSize * 1.1) + fontSize * 0.5;

				// Draw each character with chrome effect
				[...line].forEach((char, colIndex) => {
					if (char === " ") return;

					const x = colIndex * (fontSize * 0.55) + 2;

					// Chrome/liquid metal gradient effect
					// Shift the gradient based on position and time for liquid effect
					const gradientOffset = (colIndex + rowIndex) * 0.1 + time;
					const shimmer = Math.sin(gradientOffset) * 0.5 + 0.5;

					// Primary color with shimmer (metallic cyber-lime palette)
					const r = Math.floor(180 + shimmer * 75);
					const g = Math.floor(220 + shimmer * 35);
					const b = Math.floor(100 + shimmer * 50);

					// Add subtle glow
					ctx.shadowColor = `rgba(204, 243, 129, ${0.3 + shimmer * 0.4})`;
					ctx.shadowBlur = 2 + shimmer * 3;

					// Draw character with chrome effect
					ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
					ctx.fillText(char, x, y);
				});
			});

			// Add scan line effect (subtle)
			const scanY = (time * 30) % size;
			ctx.fillStyle = "rgba(204, 243, 129, 0.1)";
			ctx.fillRect(0, scanY, size, 2);

			animationRef.current = requestAnimationFrame(animate);
		};

		// Check for reduced motion preference
		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		if (prefersReducedMotion) {
			// Static render
			time = 0;
			ctx.clearRect(0, 0, size, size);
			const fontSize = Math.floor(size / 7);
			ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
			ctx.textBaseline = "top";
			ctx.fillStyle = "#CCF381";
			ctx.shadowColor = "rgba(204, 243, 129, 0.5)";
			ctx.shadowBlur = 4;

			AM_ASCII.forEach((line, rowIndex) => {
				const y = rowIndex * (fontSize * 1.1) + fontSize * 0.5;
				ctx.fillText(line, 2, y);
			});
		} else {
			animate();
		}

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [size]);

	return (
		<canvas
			ref={canvasRef}
			width={size}
			height={size}
			className={className}
			style={{ width: size, height: size }}
			aria-label="AM Logo"
		/>
	);
}

export default AMLogo;
