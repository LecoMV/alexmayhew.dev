"use client";

import { useEffect, useRef } from "react";
import { m } from "framer-motion";

interface CRTEffectProps {
	className?: string;
	scanlineOpacity?: number;
	scanlineSize?: number;
	flickerIntensity?: number;
	vignetteIntensity?: number;
	glowColor?: string;
	children?: React.ReactNode;
}

export function CRTEffect({
	className = "",
	scanlineOpacity = 0.08,
	scanlineSize = 2,
	flickerIntensity = 0.02,
	vignetteIntensity = 0.3,
	glowColor = "rgba(204, 243, 129, 0.03)",
	children,
}: CRTEffectProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const overlayRef = useRef<HTMLCanvasElement>(null);
	const animationRef = useRef<number | undefined>(undefined);

	useEffect(() => {
		const canvas = overlayRef.current;
		const container = containerRef.current;
		if (!canvas || !container) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const resizeCanvas = () => {
			const rect = container.getBoundingClientRect();
			canvas.width = rect.width;
			canvas.height = rect.height;
		};

		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		let time = 0;

		const animate = () => {
			time += 0.016; // ~60fps
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Scanlines
			ctx.fillStyle = `rgba(0, 0, 0, ${scanlineOpacity})`;
			for (let y = 0; y < canvas.height; y += scanlineSize * 2) {
				ctx.fillRect(0, y, canvas.width, scanlineSize);
			}

			// Vignette
			const gradient = ctx.createRadialGradient(
				canvas.width / 2,
				canvas.height / 2,
				0,
				canvas.width / 2,
				canvas.height / 2,
				Math.max(canvas.width, canvas.height) * 0.7
			);
			gradient.addColorStop(0, "transparent");
			gradient.addColorStop(0.5, "transparent");
			gradient.addColorStop(1, `rgba(0, 0, 0, ${vignetteIntensity})`);
			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Subtle flicker
			const flicker = 1 - Math.random() * flickerIntensity;
			ctx.fillStyle = `rgba(0, 0, 0, ${(1 - flicker) * 0.1})`;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Phosphor glow (subtle)
			const glowGradient = ctx.createRadialGradient(
				canvas.width / 2,
				canvas.height / 2,
				0,
				canvas.width / 2,
				canvas.height / 2,
				canvas.width * 0.5
			);
			glowGradient.addColorStop(0, glowColor);
			glowGradient.addColorStop(1, "transparent");
			ctx.fillStyle = glowGradient;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Rolling scan line (subtle)
			const scanY = ((time * 50) % (canvas.height + 100)) - 50;
			const scanGradient = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50);
			scanGradient.addColorStop(0, "transparent");
			scanGradient.addColorStop(0.5, "rgba(204, 243, 129, 0.02)");
			scanGradient.addColorStop(1, "transparent");
			ctx.fillStyle = scanGradient;
			ctx.fillRect(0, scanY - 50, canvas.width, 100);

			animationRef.current = requestAnimationFrame(animate);
		};

		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (prefersReducedMotion) {
			// Static render without animation
			ctx.fillStyle = `rgba(0, 0, 0, ${scanlineOpacity})`;
			for (let y = 0; y < canvas.height; y += scanlineSize * 2) {
				ctx.fillRect(0, y, canvas.width, scanlineSize);
			}

			const gradient = ctx.createRadialGradient(
				canvas.width / 2,
				canvas.height / 2,
				0,
				canvas.width / 2,
				canvas.height / 2,
				Math.max(canvas.width, canvas.height) * 0.7
			);
			gradient.addColorStop(0, "transparent");
			gradient.addColorStop(1, `rgba(0, 0, 0, ${vignetteIntensity})`);
			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		} else {
			animate();
		}

		return () => {
			window.removeEventListener("resize", resizeCanvas);
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [scanlineOpacity, scanlineSize, flickerIntensity, vignetteIntensity, glowColor]);

	return (
		<m.div
			ref={containerRef}
			className={`relative overflow-hidden ${className}`}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
		>
			{children}
			<canvas
				ref={overlayRef}
				className="pointer-events-none absolute inset-0"
				style={{ mixBlendMode: "multiply" }}
			/>
		</m.div>
	);
}

export default CRTEffect;
