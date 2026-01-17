"use client";

import { useEffect, useRef } from "react";
import { m } from "framer-motion";

interface CodeRainProps {
	className?: string;
	fontSize?: number;
	color?: string;
	speed?: number;
	density?: number;
}

// Tech-themed words and symbols instead of random characters
const techTerms = [
	"async",
	"await",
	"const",
	"type",
	"interface",
	"export",
	"import",
	"function",
	"return",
	"class",
	"extends",
	"implements",
	"null",
	"undefined",
	"boolean",
	"string",
	"number",
	"void",
	"never",
	"Promise",
	"Array",
	"Object",
	"Map",
	"Set",
	"Record",
	"Partial",
	"readonly",
	"static",
	"private",
	"public",
	"protected",
	"abstract",
	"=>",
	"??",
	"?.",
	"...",
	"===",
	"!==",
	"&&",
	"||",
	"<>",
	"/>",
	"React",
	"Next",
	"Node",
	"Deno",
	"Bun",
	"Edge",
	"API",
	"REST",
	"GraphQL",
	"WebSocket",
	"HTTP",
	"HTTPS",
	"TCP",
	"UDP",
	"DNS",
	"0x00",
	"0xFF",
	"true",
	"false",
	"NaN",
	"Infinity",
	"Symbol",
	"useEffect",
	"useState",
	"useRef",
	"useMemo",
	"useCallback",
	"render()",
	"build()",
	"deploy()",
	"fetch()",
	"parse()",
	"exec()",
];

export function CodeRain({
	className = "",
	fontSize = 14,
	color = "#CCF381",
	speed = 0.3,
	density = 0.03,
}: CodeRainProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationRef = useRef<number | undefined>(undefined);

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

		interface Drop {
			x: number;
			y: number;
			speed: number;
			term: string;
			opacity: number;
			fadeSpeed: number;
		}

		const drops: Drop[] = [];
		const width = canvas.width / (window.devicePixelRatio || 1);
		const height = canvas.height / (window.devicePixelRatio || 1);

		// Initialize drops
		const maxDrops = Math.floor((width * height * density) / 1000);

		const createDrop = (): Drop => ({
			x: Math.random() * width,
			y: Math.random() * height - height,
			speed: speed * (0.5 + Math.random() * 0.5),
			term: techTerms[Math.floor(Math.random() * techTerms.length)],
			opacity: 0.1 + Math.random() * 0.3,
			fadeSpeed: 0.001 + Math.random() * 0.002,
		});

		for (let i = 0; i < maxDrops; i++) {
			const drop = createDrop();
			drop.y = Math.random() * height; // Spread initial positions
			drops.push(drop);
		}

		const animate = () => {
			// Semi-transparent clear for trail effect
			ctx.fillStyle = "rgba(11, 14, 20, 0.05)";
			ctx.fillRect(0, 0, width, height);

			ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
			ctx.textBaseline = "top";

			drops.forEach((drop) => {
				// Calculate color with opacity
				const r = parseInt(color.slice(1, 3), 16);
				const g = parseInt(color.slice(3, 5), 16);
				const b = parseInt(color.slice(5, 7), 16);

				ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${drop.opacity})`;
				ctx.fillText(drop.term, drop.x, drop.y);

				// Update position
				drop.y += drop.speed;
				drop.opacity -= drop.fadeSpeed;

				// Reset if off screen or faded
				if (drop.y > height || drop.opacity <= 0) {
					drop.y = -fontSize * 2;
					drop.x = Math.random() * width;
					drop.term = techTerms[Math.floor(Math.random() * techTerms.length)];
					drop.opacity = 0.1 + Math.random() * 0.3;
					drop.speed = speed * (0.5 + Math.random() * 0.5);
				}
			});

			animationRef.current = requestAnimationFrame(animate);
		};

		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (prefersReducedMotion) {
			// Static render
			ctx.fillStyle = "rgba(11, 14, 20, 1)";
			ctx.fillRect(0, 0, width, height);
			ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

			drops.forEach((drop) => {
				drop.y = Math.random() * height;
				const r = parseInt(color.slice(1, 3), 16);
				const g = parseInt(color.slice(3, 5), 16);
				const b = parseInt(color.slice(5, 7), 16);
				ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${drop.opacity * 0.5})`;
				ctx.fillText(drop.term, drop.x, drop.y);
			});
		} else {
			// Initial clear
			ctx.fillStyle = "rgba(11, 14, 20, 1)";
			ctx.fillRect(0, 0, width, height);
			animate();
		}

		window.addEventListener("resize", resizeCanvas);

		return () => {
			window.removeEventListener("resize", resizeCanvas);
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [fontSize, color, speed, density]);

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

export default CodeRain;
