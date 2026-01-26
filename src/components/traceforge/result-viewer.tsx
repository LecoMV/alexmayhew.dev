"use client";

import { useState, useEffect, useMemo } from "react";
import { m } from "framer-motion";
import { Download, Copy, Check, ZoomIn, ZoomOut, RotateCcw, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { sanitizeSvg } from "@/lib/vectorizer/sanitize";
import type { ProcessingResult } from "@/lib/hooks/use-vectorizer";

interface ResultViewerProps {
	result: ProcessingResult | null;
	svgContent: string | null;
	originalPreview: string | null;
	onDownload: () => void;
	onGetPreview: () => Promise<string | null>;
}

type ViewMode = "svg" | "original" | "compare";

export function ResultViewer({
	result,
	svgContent,
	originalPreview,
	onDownload,
	onGetPreview,
}: ResultViewerProps) {
	const [viewMode, setViewMode] = useState<ViewMode>("svg");
	const [zoom, setZoom] = useState(1);
	const [copied, setCopied] = useState(false);
	const [loadedSvg, setLoadedSvg] = useState<string | null>(svgContent);

	useEffect(() => {
		if (!svgContent && result?.success) {
			onGetPreview().then(setLoadedSvg);
		} else {
			setLoadedSvg(svgContent);
		}
	}, [svgContent, result, onGetPreview]);

	// Memoize sanitized SVG to prevent re-sanitization on every render
	// This is critical for security - SVG content is sanitized before rendering
	const sanitizedSvg = useMemo(() => {
		if (!loadedSvg) return null;
		return sanitizeSvg(loadedSvg);
	}, [loadedSvg]);

	const handleCopy = async () => {
		if (loadedSvg) {
			await navigator.clipboard.writeText(loadedSvg);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
	const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.25));
	const handleResetZoom = () => setZoom(1);

	if (!result?.success) return null;

	return (
		<m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
			{/* Quality metrics */}
			{result.quality && (
				<div className="flex flex-wrap items-center gap-4">
					<div className="flex items-center gap-2">
						<span className="text-slate-text font-mono text-xs">Quality:</span>
						<span
							className={cn(
								"font-mono text-sm font-bold",
								result.quality.tier === "excellent" && "text-green-400",
								result.quality.tier === "good" && "text-cyber-lime",
								result.quality.tier === "fair" && "text-yellow-400",
								result.quality.tier === "poor" && "text-burnt-ember"
							)}
						>
							{Math.round(result.quality.dino_score * 100)}%
						</span>
						<span
							className={cn(
								"border px-1.5 py-0.5 font-mono text-[9px] tracking-wider uppercase",
								result.quality.tier === "excellent" && "border-green-400/50 text-green-400",
								result.quality.tier === "good" && "border-cyber-lime/50 text-cyber-lime",
								result.quality.tier === "fair" && "border-yellow-400/50 text-yellow-400",
								result.quality.tier === "poor" && "border-burnt-ember/50 text-burnt-ember"
							)}
						>
							{result.quality.tier}
						</span>
					</div>
					{result.total_duration && (
						<div className="flex items-center gap-2">
							<span className="text-slate-text font-mono text-xs">Time:</span>
							<span className="text-mist-white font-mono text-sm">
								{result.total_duration.toFixed(1)}s
							</span>
						</div>
					)}
				</div>
			)}

			{/* View controls */}
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex border border-white/10">
					<button
						onClick={() => setViewMode("svg")}
						className={cn(
							"px-3 py-1.5 font-mono text-xs transition-colors",
							viewMode === "svg"
								? "bg-cyber-lime/10 text-cyber-lime"
								: "text-slate-text hover:text-mist-white hover:bg-white/5"
						)}
					>
						SVG
					</button>
					<button
						onClick={() => setViewMode("original")}
						className={cn(
							"border-l border-white/10 px-3 py-1.5 font-mono text-xs transition-colors",
							viewMode === "original"
								? "bg-cyber-lime/10 text-cyber-lime"
								: "text-slate-text hover:text-mist-white hover:bg-white/5"
						)}
					>
						Original
					</button>
					<button
						onClick={() => setViewMode("compare")}
						className={cn(
							"border-l border-white/10 px-3 py-1.5 font-mono text-xs transition-colors",
							viewMode === "compare"
								? "bg-cyber-lime/10 text-cyber-lime"
								: "text-slate-text hover:text-mist-white hover:bg-white/5"
						)}
					>
						<Eye className="h-3 w-3" strokeWidth={1.5} />
					</button>
				</div>

				<div className="flex items-center gap-2">
					{/* Zoom controls */}
					<div className="flex border border-white/10">
						<button
							onClick={handleZoomOut}
							className="text-slate-text hover:text-mist-white p-1.5 transition-colors hover:bg-white/5"
							aria-label="Zoom out"
						>
							<ZoomOut className="h-3 w-3" strokeWidth={1.5} />
						</button>
						<button
							onClick={handleResetZoom}
							className="text-slate-text hover:text-mist-white border-x border-white/10 px-2 py-1.5 font-mono text-[10px] transition-colors hover:bg-white/5"
						>
							{Math.round(zoom * 100)}%
						</button>
						<button
							onClick={handleZoomIn}
							className="text-slate-text hover:text-mist-white p-1.5 transition-colors hover:bg-white/5"
							aria-label="Zoom in"
						>
							<ZoomIn className="h-3 w-3" strokeWidth={1.5} />
						</button>
						<button
							onClick={handleResetZoom}
							className="text-slate-text hover:text-mist-white border-l border-white/10 p-1.5 transition-colors hover:bg-white/5"
							aria-label="Reset zoom"
						>
							<RotateCcw className="h-3 w-3" strokeWidth={1.5} />
						</button>
					</div>

					{/* Action buttons */}
					<button
						onClick={handleCopy}
						disabled={!loadedSvg}
						className="text-slate-text hover:text-mist-white flex items-center gap-1.5 border border-white/10 px-3 py-1.5 font-mono text-xs transition-colors hover:bg-white/5"
					>
						{copied ? (
							<>
								<Check className="h-3 w-3 text-green-400" strokeWidth={1.5} />
								<span>Copied</span>
							</>
						) : (
							<>
								<Copy className="h-3 w-3" strokeWidth={1.5} />
								<span>Copy SVG</span>
							</>
						)}
					</button>
					<button
						onClick={onDownload}
						className="bg-cyber-lime text-void-navy hover:bg-cyber-lime/90 flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs font-bold transition-colors"
					>
						<Download className="h-3 w-3" strokeWidth={2} />
						<span>Download</span>
					</button>
				</div>
			</div>

			{/* Preview area */}
			<div className="relative aspect-video overflow-hidden border border-white/10 bg-white/5">
				{/* Checkerboard background for transparency */}
				<div
					className="absolute inset-0"
					style={{
						backgroundImage: `linear-gradient(45deg, #1e293b 25%, transparent 25%),
                        linear-gradient(-45deg, #1e293b 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, #1e293b 75%),
                        linear-gradient(-45deg, transparent 75%, #1e293b 75%)`,
						backgroundSize: "20px 20px",
						backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
					}}
				/>

				<div className="absolute inset-0 flex items-center justify-center overflow-auto p-4">
					<div
						style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
						className="transition-transform duration-200"
					>
						{viewMode === "compare" ? (
							<div className="flex gap-4">
								{originalPreview && (
									/* eslint-disable-next-line @next/next/no-img-element */
									<img
										src={originalPreview}
										alt="Original"
										className="max-h-[300px] max-w-[200px] object-contain"
									/>
								)}
								{sanitizedSvg && (
									<div
										className="max-h-[300px] max-w-[200px] object-contain"
										// SVG is sanitized via DOMPurify to prevent XSS
										dangerouslySetInnerHTML={{ __html: sanitizedSvg }}
									/>
								)}
							</div>
						) : viewMode === "original" && originalPreview ? (
							/* eslint-disable-next-line @next/next/no-img-element */
							<img
								src={originalPreview}
								alt="Original"
								className="max-h-full max-w-full object-contain"
							/>
						) : sanitizedSvg ? (
							<div
								className="max-h-full max-w-full [&>svg]:max-h-full [&>svg]:max-w-full"
								// SVG is sanitized via DOMPurify to prevent XSS
								dangerouslySetInnerHTML={{ __html: sanitizedSvg }}
							/>
						) : (
							<div className="text-slate-text font-mono text-sm">Loading preview...</div>
						)}
					</div>
				</div>
			</div>
		</m.div>
	);
}
