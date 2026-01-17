"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { m } from "framer-motion";

interface Node {
	id: number;
	x: number;
	y: number;
	vx: number;
	vy: number;
	label: string;
	size: number;
	connections: number[];
}

interface DataFlowProps {
	className?: string;
	nodeCount?: number;
	nodeColor?: string;
	lineColor?: string;
	accentColor?: string;
	labels?: string[];
}

const defaultLabels = [
	"React",
	"Next.js",
	"TypeScript",
	"Node.js",
	"PostgreSQL",
	"GraphQL",
	"Redis",
	"Docker",
	"AWS",
	"Cloudflare",
	"Prisma",
	"Tailwind",
	"Framer",
	"WebGL",
	"API",
];

export function DataFlow({
	className = "",
	nodeCount = 20,
	nodeColor = "rgba(148, 163, 184, 0.6)",
	lineColor = "rgba(148, 163, 184, 0.1)",
	accentColor = "#CCF381",
	labels = defaultLabels,
}: DataFlowProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const nodesRef = useRef<Node[]>([]);
	const animationRef = useRef<number | undefined>(undefined);
	const pulseRef = useRef<{ nodeId: number; progress: number; targetId: number }[]>([]);

	const handleMouseMove = useCallback((e: MouseEvent) => {
		if (canvasRef.current) {
			const rect = canvasRef.current.getBoundingClientRect();
			setMousePos({
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
			});
		}
	}, []);

	// Initialize nodes
	useEffect(() => {
		if (dimensions.width === 0) return;

		const nodes: Node[] = [];
		for (let i = 0; i < nodeCount; i++) {
			nodes.push({
				id: i,
				x: Math.random() * dimensions.width,
				y: Math.random() * dimensions.height,
				vx: (Math.random() - 0.5) * 0.3,
				vy: (Math.random() - 0.5) * 0.3,
				label: labels[i % labels.length],
				size: 3 + Math.random() * 4,
				connections: [],
			});
		}

		// Create connections (each node connects to 2-4 nearest)
		nodes.forEach((node, i) => {
			const distances = nodes
				.map((other, j) => ({
					index: j,
					dist: Math.sqrt((node.x - other.x) ** 2 + (node.y - other.y) ** 2),
				}))
				.filter((d) => d.index !== i)
				.sort((a, b) => a.dist - b.dist);

			const connectionCount = 2 + Math.floor(Math.random() * 3);
			node.connections = distances.slice(0, connectionCount).map((d) => d.index);
		});

		nodesRef.current = nodes;
	}, [dimensions, nodeCount, labels]);

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

	// Animation
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || dimensions.width === 0) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const dpr = Math.min(window.devicePixelRatio || 1, 2);

		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.save();
			ctx.scale(dpr, dpr);

			const nodes = nodesRef.current;

			// Update node positions
			nodes.forEach((node) => {
				node.x += node.vx;
				node.y += node.vy;

				// Bounce off edges
				if (node.x < 0 || node.x > dimensions.width) node.vx *= -1;
				if (node.y < 0 || node.y > dimensions.height) node.vy *= -1;

				// Clamp
				node.x = Math.max(0, Math.min(dimensions.width, node.x));
				node.y = Math.max(0, Math.min(dimensions.height, node.y));

				// Mouse repulsion
				const mouseDist = Math.sqrt((node.x - mousePos.x) ** 2 + (node.y - mousePos.y) ** 2);
				if (mouseDist < 100 && mouseDist > 0) {
					const force = ((100 - mouseDist) / 100) * 0.5;
					node.vx += ((node.x - mousePos.x) / mouseDist) * force;
					node.vy += ((node.y - mousePos.y) / mouseDist) * force;
				}

				// Damping
				node.vx *= 0.99;
				node.vy *= 0.99;
			});

			// Draw connections
			nodes.forEach((node) => {
				node.connections.forEach((targetId) => {
					const target = nodes[targetId];
					const dist = Math.sqrt((node.x - target.x) ** 2 + (node.y - target.y) ** 2);

					if (dist < 200) {
						const opacity = (1 - dist / 200) * 0.3;
						ctx.strokeStyle = lineColor.replace(/[\d.]+\)$/, `${opacity})`);
						ctx.lineWidth = 1;
						ctx.beginPath();
						ctx.moveTo(node.x, node.y);
						ctx.lineTo(target.x, target.y);
						ctx.stroke();
					}
				});
			});

			// Random data pulses
			if (Math.random() < 0.02 && pulseRef.current.length < 5) {
				const sourceNode = nodes[Math.floor(Math.random() * nodes.length)];
				if (sourceNode.connections.length > 0) {
					pulseRef.current.push({
						nodeId: sourceNode.id,
						targetId:
							sourceNode.connections[Math.floor(Math.random() * sourceNode.connections.length)],
						progress: 0,
					});
				}
			}

			// Draw and update pulses
			pulseRef.current = pulseRef.current.filter((pulse) => {
				const source = nodes[pulse.nodeId];
				const target = nodes[pulse.targetId];

				const x = source.x + (target.x - source.x) * pulse.progress;
				const y = source.y + (target.y - source.y) * pulse.progress;

				ctx.beginPath();
				ctx.arc(x, y, 3, 0, Math.PI * 2);
				ctx.fillStyle = accentColor;
				ctx.shadowColor = accentColor;
				ctx.shadowBlur = 10;
				ctx.fill();
				ctx.shadowBlur = 0;

				pulse.progress += 0.02;
				return pulse.progress < 1;
			});

			// Draw nodes
			nodes.forEach((node) => {
				const mouseDist = Math.sqrt((node.x - mousePos.x) ** 2 + (node.y - mousePos.y) ** 2);
				const isNear = mouseDist < 100;

				// Node circle
				ctx.beginPath();
				ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
				ctx.fillStyle = isNear ? accentColor : nodeColor;
				if (isNear) {
					ctx.shadowColor = accentColor;
					ctx.shadowBlur = 15;
				}
				ctx.fill();
				ctx.shadowBlur = 0;

				// Label for nearby nodes
				if (isNear) {
					ctx.font = "10px 'JetBrains Mono', monospace";
					ctx.fillStyle = accentColor;
					ctx.fillText(node.label, node.x + node.size + 5, node.y + 3);
				}
			});

			ctx.restore();
			animationRef.current = requestAnimationFrame(animate);
		};

		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (prefersReducedMotion) {
			// Static render
			ctx.save();
			ctx.scale(dpr, dpr);

			nodesRef.current.forEach((node) => {
				node.connections.forEach((targetId) => {
					const target = nodesRef.current[targetId];
					ctx.strokeStyle = lineColor;
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.moveTo(node.x, node.y);
					ctx.lineTo(target.x, target.y);
					ctx.stroke();
				});
			});

			nodesRef.current.forEach((node) => {
				ctx.beginPath();
				ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
				ctx.fillStyle = nodeColor;
				ctx.fill();
			});

			ctx.restore();
		} else {
			animate();
		}

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [dimensions, mousePos, nodeColor, lineColor, accentColor]);

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

export default DataFlow;
