"use client";

import { useEffect, useRef, useState } from "react";
import { m } from "framer-motion";

interface Point {
	x: number;
	y: number;
}

interface Trace {
	id: number;
	points: Point[];
	progress: number;
	speed: number;
	opacity: number;
}

interface CircuitTracesProps {
	className?: string;
	density?: number;
	color?: string;
	glowColor?: string;
	animated?: boolean;
}

export function CircuitTraces({
	className = "",
	density = 15,
	color = "rgba(204, 243, 129, 0.15)",
	glowColor = "rgba(204, 243, 129, 0.4)",
	animated = true,
}: CircuitTracesProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [traces, setTraces] = useState<Trace[]>([]);
	const animationRef = useRef<number | undefined>(undefined);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

	// Generate circuit traces
	useEffect(() => {
		const generateTraces = () => {
			const newTraces: Trace[] = [];
			const gridSize = 40;
			const cols = Math.ceil(dimensions.width / gridSize);
			const rows = Math.ceil(dimensions.height / gridSize);

			for (let i = 0; i < density; i++) {
				const startCol = Math.floor(Math.random() * cols);
				const startRow = Math.floor(Math.random() * rows);
				const points: Point[] = [{ x: startCol * gridSize, y: startRow * gridSize }];

				// Generate path with 90-degree turns
				let currentCol = startCol;
				let currentRow = startRow;
				const pathLength = 3 + Math.floor(Math.random() * 8);

				for (let j = 0; j < pathLength; j++) {
					const direction = Math.floor(Math.random() * 4);
					const distance = 1 + Math.floor(Math.random() * 4);

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

					// Clamp to bounds
					currentCol = Math.max(0, Math.min(cols, currentCol));
					currentRow = Math.max(0, Math.min(rows, currentRow));

					points.push({ x: currentCol * gridSize, y: currentRow * gridSize });
				}

				newTraces.push({
					id: i,
					points,
					progress: animated ? Math.random() : 1,
					speed: 0.002 + Math.random() * 0.003,
					opacity: 0.3 + Math.random() * 0.7,
				});
			}

			setTraces(newTraces);
		};

		if (dimensions.width > 0) {
			generateTraces();
		}
	}, [dimensions, density, animated]);

	// Handle resize
	useEffect(() => {
		const updateDimensions = () => {
			if (canvasRef.current) {
				const rect = canvasRef.current.getBoundingClientRect();
				setDimensions({ width: rect.width, height: rect.height });
			}
		};

		updateDimensions();
		window.addEventListener("resize", updateDimensions);
		return () => window.removeEventListener("resize", updateDimensions);
	}, []);

	// Animation loop
	useEffect(() => {
		if (!animated || !canvasRef.current) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			setTraces((prev) =>
				prev.map((trace) => ({
					...trace,
					progress: trace.progress >= 1 ? 0 : trace.progress + trace.speed,
				}))
			);

			traces.forEach((trace) => {
				if (trace.points.length < 2) return;

				const totalLength = trace.points.reduce((acc, point, i) => {
					if (i === 0) return 0;
					const prev = trace.points[i - 1];
					return acc + Math.abs(point.x - prev.x) + Math.abs(point.y - prev.y);
				}, 0);

				const drawnLength = totalLength * trace.progress;
				let lengthSoFar = 0;

				ctx.beginPath();
				ctx.strokeStyle = color;
				ctx.lineWidth = 1;
				ctx.moveTo(trace.points[0].x, trace.points[0].y);

				for (let i = 1; i < trace.points.length; i++) {
					const prev = trace.points[i - 1];
					const curr = trace.points[i];
					const segmentLength = Math.abs(curr.x - prev.x) + Math.abs(curr.y - prev.y);

					if (lengthSoFar + segmentLength <= drawnLength) {
						ctx.lineTo(curr.x, curr.y);
						lengthSoFar += segmentLength;
					} else {
						const remaining = drawnLength - lengthSoFar;
						const ratio = remaining / segmentLength;
						const x = prev.x + (curr.x - prev.x) * ratio;
						const y = prev.y + (curr.y - prev.y) * ratio;
						ctx.lineTo(x, y);

						// Draw glowing endpoint
						ctx.stroke();
						ctx.beginPath();
						ctx.arc(x, y, 3, 0, Math.PI * 2);
						ctx.fillStyle = glowColor;
						ctx.shadowColor = glowColor;
						ctx.shadowBlur = 10;
						ctx.fill();
						ctx.shadowBlur = 0;
						break;
					}
				}

				ctx.stroke();

				// Draw connection nodes
				trace.points.forEach((point, i) => {
					if (i > 0 && lengthSoFar > 0) {
						ctx.beginPath();
						ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
						ctx.fillStyle = color;
						ctx.fill();
					}
				});
			});

			animationRef.current = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [traces, animated, color, glowColor]);

	// Static render
	useEffect(() => {
		if (animated || !canvasRef.current || traces.length === 0) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		traces.forEach((trace) => {
			if (trace.points.length < 2) return;

			ctx.beginPath();
			ctx.strokeStyle = color;
			ctx.lineWidth = 1;
			ctx.moveTo(trace.points[0].x, trace.points[0].y);

			trace.points.forEach((point) => {
				ctx.lineTo(point.x, point.y);
			});

			ctx.stroke();

			// Draw nodes
			trace.points.forEach((point) => {
				ctx.beginPath();
				ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
				ctx.fillStyle = color;
				ctx.fill();
			});
		});
	}, [traces, animated, color]);

	return (
		<m.canvas
			ref={canvasRef}
			width={dimensions.width}
			height={dimensions.height}
			className={`pointer-events-none ${className}`}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 1 }}
			style={{ width: "100%", height: "100%" }}
		/>
	);
}

export default CircuitTraces;
