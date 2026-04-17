"use client";

import { m } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import { useCanvasController } from "@/hooks/use-canvas-controller";
import { springTransition } from "@/lib/motion-constants";

interface BlueprintGridProps {
	className?: string;
	gridSize?: number;
	color?: string;
	accentColor?: string;
	showDiagonals?: boolean;
	animate?: boolean;
}

interface GridDimensions {
	width: number;
	height: number;
}

function drawGrid(
	ctx: CanvasRenderingContext2D,
	dims: GridDimensions,
	gridSize: number,
	color: string
) {
	const cols = Math.ceil(dims.width / gridSize) + 1;
	const rows = Math.ceil(dims.height / gridSize) + 1;

	ctx.strokeStyle = color;
	ctx.lineWidth = 0.5;

	for (let i = 0; i <= cols; i++) {
		const x = i * gridSize;
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, dims.height);
		ctx.stroke();
	}

	for (let i = 0; i <= rows; i++) {
		const y = i * gridSize;
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(dims.width, y);
		ctx.stroke();
	}
}

function drawDiagonals(
	ctx: CanvasRenderingContext2D,
	dims: GridDimensions,
	gridSize: number,
	color: string
) {
	const cols = Math.ceil(dims.width / gridSize) + 1;
	const rows = Math.ceil(dims.height / gridSize) + 1;

	ctx.strokeStyle = color;
	ctx.lineWidth = 0.3;

	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			const hash = (col * 7 + row * 13) % 17;
			if (hash >= 3) continue;

			const x = col * gridSize;
			const y = row * gridSize;

			if (hash === 0) {
				ctx.beginPath();
				ctx.moveTo(x, y);
				ctx.lineTo(x + gridSize, y + gridSize);
				ctx.stroke();
			} else if (hash === 1) {
				ctx.beginPath();
				ctx.moveTo(x + gridSize, y);
				ctx.lineTo(x, y + gridSize);
				ctx.stroke();
			} else {
				ctx.beginPath();
				ctx.moveTo(x + gridSize / 2, y + 5);
				ctx.lineTo(x + gridSize / 2, y + gridSize - 5);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(x + 5, y + gridSize / 2);
				ctx.lineTo(x + gridSize - 5, y + gridSize / 2);
				ctx.stroke();
			}
		}
	}
}

function drawProximityMarkers(
	ctx: CanvasRenderingContext2D,
	dims: GridDimensions,
	gridSize: number,
	mousePos: { x: number; y: number },
	accentColor: string
) {
	const cols = Math.ceil(dims.width / gridSize) + 1;
	const rows = Math.ceil(dims.height / gridSize) + 1;
	const proximityRadius = 150;

	ctx.fillStyle = accentColor;

	for (let row = 0; row <= rows; row++) {
		for (let col = 0; col <= cols; col++) {
			const x = col * gridSize;
			const y = row * gridSize;
			const dist = Math.sqrt((x - mousePos.x) ** 2 + (y - mousePos.y) ** 2);

			if (dist >= proximityRadius) continue;

			const intensity = 1 - dist / proximityRadius;
			const size = 2 + intensity * 4;

			ctx.globalAlpha = intensity * 0.8;
			ctx.beginPath();
			ctx.arc(x, y, size, 0, Math.PI * 2);
			ctx.fill();

			if (intensity > 0.5) {
				ctx.globalAlpha = intensity * 0.6;
				ctx.font = "8px 'JetBrains Mono', monospace";
				ctx.fillStyle = accentColor;
				ctx.fillText(`${col},${row}`, x + 5, y - 5);
			}
		}
	}

	ctx.globalAlpha = 1;
}

function drawAnimatedLines(
	ctx: CanvasRenderingContext2D,
	dims: GridDimensions,
	gridSize: number,
	time: number,
	accentColor: string
) {
	const cols = Math.ceil(dims.width / gridSize) + 1;
	const rows = Math.ceil(dims.height / gridSize) + 1;
	const animatedRow = Math.floor((time * 2) % rows);
	const animatedCol = Math.floor((time * 1.5) % cols);

	ctx.strokeStyle = accentColor;
	ctx.lineWidth = 1;
	ctx.setLineDash([5, 5]);

	ctx.beginPath();
	ctx.moveTo(0, animatedRow * gridSize);
	ctx.lineTo(dims.width, animatedRow * gridSize);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(animatedCol * gridSize, 0);
	ctx.lineTo(animatedCol * gridSize, dims.height);
	ctx.stroke();

	ctx.setLineDash([]);
}

export function BlueprintGrid({
	className = "",
	gridSize = 40,
	color = "rgba(148, 163, 184, 0.1)",
	accentColor = "rgba(204, 243, 129, 0.2)",
	showDiagonals = true,
	animate = true,
}: BlueprintGridProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const mousePosRef = useRef({ x: -1000, y: -1000 });
	const [dimensions, setDimensions] = useState<GridDimensions>({ width: 0, height: 0 });
	const animationRef = useRef<number | undefined>(undefined);
	const timeRef = useRef(0);
	const { isActiveRef } = useCanvasController(canvasRef);

	const handleMouseMove = useCallback((e: MouseEvent) => {
		if (canvasRef.current) {
			const rect = canvasRef.current.getBoundingClientRect();
			mousePosRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
		}
	}, []);

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

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || dimensions.width === 0) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const dpr = Math.min(window.devicePixelRatio || 1, 2);

		const draw = () => {
			if (animate) {
				animationRef.current = requestAnimationFrame(draw);
			}

			if (!isActiveRef.current) return;

			timeRef.current += 0.01;

			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.save();
			ctx.scale(dpr, dpr);

			drawGrid(ctx, dimensions, gridSize, color);
			if (showDiagonals) drawDiagonals(ctx, dimensions, gridSize, color);
			drawProximityMarkers(ctx, dimensions, gridSize, mousePosRef.current, accentColor);
			if (animate) drawAnimatedLines(ctx, dimensions, gridSize, timeRef.current, accentColor);

			ctx.restore();
		};

		draw();

		return () => {
			if (animationRef.current) cancelAnimationFrame(animationRef.current);
		};
	}, [dimensions, gridSize, color, accentColor, showDiagonals, animate, isActiveRef]);

	return (
		<m.canvas
			ref={canvasRef}
			className={`pointer-events-none ${className}`}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={springTransition}
			style={{ width: "100%", height: "100%" }}
		/>
	);
}
