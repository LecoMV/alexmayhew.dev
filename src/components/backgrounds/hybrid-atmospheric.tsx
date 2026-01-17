"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { m } from "framer-motion";

interface HybridAtmosphericProps {
	className?: string;
	asciiOpacity?: number;
	circuitOpacity?: number;
	scanlineOpacity?: number;
	primaryColor?: string;
	secondaryColor?: string;
}

export function HybridAtmospheric({
	className = "",
	asciiOpacity = 0.15,
	circuitOpacity = 0.2,
	scanlineOpacity = 0.05,
	primaryColor = "#CCF381",
}: HybridAtmosphericProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const animationRef = useRef<number | undefined>(undefined);
	const timeRef = useRef(0);
	const circuitsRef = useRef<
		{ points: { x: number; y: number }[]; progress: number; speed: number }[]
	>([]);

	const handleMouseMove = useCallback((e: MouseEvent) => {
		if (canvasRef.current) {
			const rect = canvasRef.current.getBoundingClientRect();
			setMousePos({
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
			});
		}
	}, []);

	// Noise function for ASCII
	const noise = useCallback((x: number, y: number, t: number): number => {
		const sin1 = Math.sin(x * 0.015 + t);
		const sin2 = Math.sin(y * 0.015 + t * 0.7);
		const sin3 = Math.sin((x + y) * 0.008 + t * 0.5);
		const sin4 = Math.sin(Math.sqrt(x * x + y * y) * 0.008 - t * 0.3);
		return ((sin1 + sin2 + sin3 + sin4) / 4) * 0.5 + 0.5;
	}, []);

	// Initialize circuits
	useEffect(() => {
		if (dimensions.width === 0) return;

		const gridSize = 30;
		const cols = Math.ceil(dimensions.width / gridSize);
		const rows = Math.ceil(dimensions.height / gridSize);
		const circuits: typeof circuitsRef.current = [];

		for (let i = 0; i < 12; i++) {
			const startCol = Math.floor(Math.random() * cols);
			const startRow = Math.floor(Math.random() * rows);
			const points: { x: number; y: number }[] = [
				{ x: startCol * gridSize, y: startRow * gridSize },
			];

			let currentCol = startCol;
			let currentRow = startRow;
			const pathLength = 4 + Math.floor(Math.random() * 6);

			for (let j = 0; j < pathLength; j++) {
				const direction = Math.floor(Math.random() * 4);
				const distance = 2 + Math.floor(Math.random() * 4);

				switch (direction) {
					case 0:
						currentCol += distance;
						break;
					case 1:
						currentCol -= distance;
						break;
					case 2:
						currentRow += distance;
						break;
					case 3:
						currentRow -= distance;
						break;
				}

				currentCol = Math.max(0, Math.min(cols, currentCol));
				currentRow = Math.max(0, Math.min(rows, currentRow));

				points.push({ x: currentCol * gridSize, y: currentRow * gridSize });
			}

			circuits.push({
				points,
				progress: Math.random(),
				speed: 0.001 + Math.random() * 0.002,
			});
		}

		circuitsRef.current = circuits;
	}, [dimensions]);

	// Handle resize
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const resizeCanvas = () => {
			const rect = canvas.getBoundingClientRect();
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = rect.width * dpr;
			canvas.height = rect.height * dpr;
			setDimensions({ width: rect.width, height: rect.height });
		};

		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);
		window.addEventListener("mousemove", handleMouseMove);

		return () => {
			window.removeEventListener("resize", resizeCanvas);
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, [handleMouseMove]);

	// Main animation
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || dimensions.width === 0) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		const characters = " .·:;=+*#%@";
		const fontSize = 10;
		const cols = Math.ceil(dimensions.width / fontSize);
		const rows = Math.ceil(dimensions.height / (fontSize * 1.4));

		const animate = () => {
			timeRef.current += 0.008;
			const t = timeRef.current;

			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.save();
			ctx.scale(dpr, dpr);

			// Layer 1: ASCII noise field
			ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
			ctx.textBaseline = "top";

			for (let row = 0; row < rows; row++) {
				for (let col = 0; col < cols; col++) {
					const x = col * fontSize;
					const y = row * fontSize * 1.4;

					// Add mouse influence
					const mouseDist = Math.sqrt((x - mousePos.x) ** 2 + (y - mousePos.y) ** 2);
					const mouseInfluence = mouseDist < 150 ? (1 - mouseDist / 150) * 0.3 : 0;

					const n = noise(x, y, t) + mouseInfluence;
					const charIndex = Math.floor(Math.min(n, 0.99) * characters.length);
					const char = characters[charIndex];

					const opacity = asciiOpacity * (0.5 + n * 0.5);

					if (mouseDist < 150) {
						ctx.fillStyle =
							primaryColor.replace(")", "").replace("rgb(", "rgba(") + `, ${opacity * 2})`;
					} else {
						ctx.fillStyle = `rgba(148, 163, 184, ${opacity})`;
					}

					ctx.fillText(char, x, y);
				}
			}

			// Layer 2: Circuit traces
			circuitsRef.current.forEach((circuit) => {
				if (circuit.points.length < 2) return;

				circuit.progress = (circuit.progress + circuit.speed) % 1;

				const totalLength = circuit.points.reduce((acc, point, i) => {
					if (i === 0) return 0;
					const prev = circuit.points[i - 1];
					return acc + Math.abs(point.x - prev.x) + Math.abs(point.y - prev.y);
				}, 0);

				const drawnLength = totalLength * circuit.progress;
				let lengthSoFar = 0;

				// Draw base trace
				ctx.beginPath();
				ctx.strokeStyle = `rgba(148, 163, 184, ${circuitOpacity * 0.5})`;
				ctx.lineWidth = 1;
				ctx.moveTo(circuit.points[0].x, circuit.points[0].y);
				circuit.points.forEach((point) => ctx.lineTo(point.x, point.y));
				ctx.stroke();

				// Draw animated portion
				ctx.beginPath();
				ctx.strokeStyle = primaryColor;
				ctx.lineWidth = 1.5;
				ctx.shadowColor = primaryColor;
				ctx.shadowBlur = 8;
				ctx.moveTo(circuit.points[0].x, circuit.points[0].y);

				let pulseX = circuit.points[0].x;
				let pulseY = circuit.points[0].y;

				for (let i = 1; i < circuit.points.length; i++) {
					const prev = circuit.points[i - 1];
					const curr = circuit.points[i];
					const segmentLength = Math.abs(curr.x - prev.x) + Math.abs(curr.y - prev.y);

					if (lengthSoFar + segmentLength <= drawnLength) {
						ctx.lineTo(curr.x, curr.y);
						lengthSoFar += segmentLength;
						pulseX = curr.x;
						pulseY = curr.y;
					} else {
						const remaining = drawnLength - lengthSoFar;
						const ratio = remaining / segmentLength;
						pulseX = prev.x + (curr.x - prev.x) * ratio;
						pulseY = prev.y + (curr.y - prev.y) * ratio;
						ctx.lineTo(pulseX, pulseY);
						break;
					}
				}

				ctx.stroke();
				ctx.shadowBlur = 0;

				// Draw pulse point
				ctx.beginPath();
				ctx.arc(pulseX, pulseY, 4, 0, Math.PI * 2);
				ctx.fillStyle = primaryColor;
				ctx.shadowColor = primaryColor;
				ctx.shadowBlur = 15;
				ctx.fill();
				ctx.shadowBlur = 0;

				// Draw nodes
				circuit.points.forEach((point) => {
					ctx.beginPath();
					ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
					ctx.fillStyle = `rgba(148, 163, 184, ${circuitOpacity})`;
					ctx.fill();
				});
			});

			// Layer 3: Scanlines (CRT effect)
			ctx.fillStyle = `rgba(0, 0, 0, ${scanlineOpacity})`;
			for (let y = 0; y < dimensions.height; y += 3) {
				ctx.fillRect(0, y, dimensions.width, 1);
			}

			// Layer 4: Subtle vignette
			const gradient = ctx.createRadialGradient(
				dimensions.width / 2,
				dimensions.height / 2,
				0,
				dimensions.width / 2,
				dimensions.height / 2,
				Math.max(dimensions.width, dimensions.height) * 0.6
			);
			gradient.addColorStop(0, "transparent");
			gradient.addColorStop(1, "rgba(0, 0, 0, 0.3)");
			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, dimensions.width, dimensions.height);

			// Layer 5: Rolling scan (subtle phosphor refresh)
			const scanY = ((t * 30) % (dimensions.height + 60)) - 30;
			const scanGradient = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
			scanGradient.addColorStop(0, "transparent");
			scanGradient.addColorStop(0.5, `rgba(204, 243, 129, 0.015)`);
			scanGradient.addColorStop(1, "transparent");
			ctx.fillStyle = scanGradient;
			ctx.fillRect(0, scanY - 30, dimensions.width, 60);

			ctx.restore();
			animationRef.current = requestAnimationFrame(animate);
		};

		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (!prefersReducedMotion) {
			animate();
		} else {
			// Static render
			ctx.save();
			ctx.scale(dpr, dpr);

			// ASCII only
			ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
			ctx.textBaseline = "top";

			for (let row = 0; row < rows; row++) {
				for (let col = 0; col < cols; col++) {
					const x = col * fontSize;
					const y = row * fontSize * 1.4;
					const n = noise(x, y, 0);
					const charIndex = Math.floor(n * (characters.length - 1));
					ctx.fillStyle = `rgba(148, 163, 184, ${asciiOpacity * 0.5})`;
					ctx.fillText(characters[charIndex], x, y);
				}
			}

			// Static circuits
			circuitsRef.current.forEach((circuit) => {
				ctx.beginPath();
				ctx.strokeStyle = `rgba(148, 163, 184, ${circuitOpacity})`;
				ctx.lineWidth = 1;
				ctx.moveTo(circuit.points[0].x, circuit.points[0].y);
				circuit.points.forEach((point) => ctx.lineTo(point.x, point.y));
				ctx.stroke();
			});

			ctx.restore();
		}

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [dimensions, mousePos, asciiOpacity, circuitOpacity, scanlineOpacity, primaryColor, noise]);

	return (
		<m.canvas
			ref={canvasRef}
			className={`pointer-events-none ${className}`}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 2 }}
			style={{ width: "100%", height: "100%" }}
		/>
	);
}

export default HybridAtmospheric;
