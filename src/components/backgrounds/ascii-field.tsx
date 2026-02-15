"use client";

import { m } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

interface AsciiFieldProps {
	className?: string;
	characters?: string;
	fontSize?: number;
	color?: string;
	bgColor?: string;
	noiseSpeed?: number;
	density?: number;
}

export function AsciiField({
	className = "",
	characters = " .:-=+*#%@",
	fontSize = 12,
	color = "#CCF381",
	bgColor = "#0B0E14",
	noiseSpeed = 0.0005,
	density = 1,
}: AsciiFieldProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationRef = useRef<number | undefined>(undefined);
	const timeRef = useRef(0);

	// Simple noise function
	const noise = useCallback((x: number, y: number, t: number): number => {
		const sin1 = Math.sin(x * 0.02 + t);
		const sin2 = Math.sin(y * 0.02 + t * 0.7);
		const sin3 = Math.sin((x + y) * 0.01 + t * 0.5);
		const sin4 = Math.sin(Math.sqrt(x * x + y * y) * 0.01 - t * 0.3);
		return ((sin1 + sin2 + sin3 + sin4) / 4) * 0.5 + 0.5;
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const resizeCanvas = () => {
			const rect = canvas.getBoundingClientRect();
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = rect.width * dpr;
			canvas.height = rect.height * dpr;
			ctx.scale(dpr, dpr);
		};

		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		const cols = Math.ceil(canvas.width / (fontSize * density));
		const rows = Math.ceil(canvas.height / (fontSize * density * 1.2));

		const animate = () => {
			timeRef.current += noiseSpeed;
			const t = timeRef.current;

			ctx.fillStyle = bgColor;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
			ctx.textBaseline = "top";

			for (let y = 0; y < rows; y++) {
				for (let x = 0; x < cols; x++) {
					const px = x * fontSize * density;
					const py = y * fontSize * density * 1.2;

					const n = noise(px, py, t);
					const charIndex = Math.floor(n * (characters.length - 1));
					const char = characters[charIndex];

					// Vary opacity based on noise
					const opacity = 0.1 + n * 0.4;
					ctx.fillStyle = color.replace(")", `, ${opacity})`).replace("rgb", "rgba");

					ctx.fillText(char, px, py);
				}
			}

			animationRef.current = requestAnimationFrame(animate);
		};

		// Check for reduced motion preference
		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (prefersReducedMotion) {
			// Static render
			ctx.fillStyle = bgColor;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
			ctx.textBaseline = "top";
			ctx.fillStyle = color.replace(")", ", 0.2)").replace("rgb", "rgba");

			for (let y = 0; y < rows; y++) {
				for (let x = 0; x < cols; x++) {
					const px = x * fontSize * density;
					const py = y * fontSize * density * 1.2;
					const n = noise(px, py, 0);
					const charIndex = Math.floor(n * (characters.length - 1));
					ctx.fillText(characters[charIndex], px, py);
				}
			}
		} else {
			animate();
		}

		return () => {
			window.removeEventListener("resize", resizeCanvas);
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [characters, fontSize, color, bgColor, noiseSpeed, density, noise]);

	return (
		<m.canvas
			ref={canvasRef}
			className={`pointer-events-none ${className}`}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 1.5 }}
			style={{ width: "100%", height: "100%" }}
		/>
	);
}

export default AsciiField;
