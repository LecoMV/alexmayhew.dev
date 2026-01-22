"use client";

import { useState, useCallback } from "react";
import { m } from "framer-motion";
import { ArrowRight, RefreshCw, Layers, Zap, Shield, Code, Eraser } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVectorizer, type Generator } from "@/lib/hooks/use-vectorizer";
import { UploadZone } from "./upload-zone";
import { PresetSelector } from "./preset-selector";
import { ProgressLog } from "./progress-log";
import { ResultViewer } from "./result-viewer";

const springTransition = {
	type: "spring" as const,
	stiffness: 100,
	damping: 20,
	mass: 1,
};

const features = [
	{
		icon: <Layers className="h-5 w-5" strokeWidth={1.5} />,
		title: "10+ Presets",
		description: "Optimized for logos, icons, and illustrations",
	},
	{
		icon: <Zap className="h-5 w-5" strokeWidth={1.5} />,
		title: "Dual Engines",
		description: "Potrace + VTracer for any vectorization need",
	},
	{
		icon: <Shield className="h-5 w-5" strokeWidth={1.5} />,
		title: "Open Source",
		description: "Full source code available on GitHub",
	},
	{
		icon: <Code className="h-5 w-5" strokeWidth={1.5} />,
		title: "Clean Output",
		description: "SVGO-optimized, production-ready SVGs",
	},
];

export function TraceForgeApp() {
	const {
		status,
		taskId,
		progress,
		result,
		error,
		previewUrl,
		svgContent,
		upload,
		process,
		reset,
		downloadSvg,
		getSvgPreview,
	} = useVectorizer();

	const [generator, setGenerator] = useState<Generator>("potrace");
	const [preset, setPreset] = useState("logo_smooth");
	const [removeBackground, setRemoveBackground] = useState(false);

	const handleFileSelect = useCallback(
		async (file: File) => {
			await upload(file);
		},
		[upload]
	);

	const handleProcess = useCallback(async () => {
		if (!taskId) return;
		await process(taskId, {
			generator,
			preset,
			remove_background: removeBackground,
			calculate_quality: true,
		});
	}, [taskId, generator, preset, removeBackground, process]);

	const handleGeneratorChange = useCallback((newGenerator: Generator) => {
		setGenerator(newGenerator);
		// Reset to default preset for the new generator
		setPreset(newGenerator === "potrace" ? "logo_smooth" : "logo");
	}, []);

	const isProcessing = status === "uploading" || status === "processing";
	const canProcess = status === "uploaded" && taskId;
	const showResult = status === "completed" && result?.success;

	return (
		<div className="space-y-12">
			{/* Features grid */}
			<m.div
				className="grid grid-cols-2 gap-4 lg:grid-cols-4"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ ...springTransition, delay: 0.1 }}
			>
				{features.map((feature, index) => (
					<m.div
						key={feature.title}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ ...springTransition, delay: 0.1 + index * 0.05 }}
						className="border border-white/10 p-4"
					>
						<div className="text-cyber-lime mb-2">{feature.icon}</div>
						<h3 className="text-mist-white font-mono text-sm">{feature.title}</h3>
						<p className="text-slate-text mt-1 text-xs">{feature.description}</p>
					</m.div>
				))}
			</m.div>

			{/* Main app interface */}
			<div className="grid gap-8 lg:grid-cols-2">
				{/* Left column - Upload and Preview */}
				<m.div
					className="space-y-6"
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ ...springTransition, delay: 0.2 }}
				>
					<div>
						<h2 className="text-mist-white mb-4 font-mono text-lg">
							<span className="text-cyber-lime mr-2">01</span>
							Upload Image
						</h2>
						<UploadZone
							onFileSelect={handleFileSelect}
							previewUrl={previewUrl}
							onClear={reset}
							disabled={isProcessing}
						/>
					</div>

					{/* Progress Log - show when there's activity */}
					{progress.length > 0 && <ProgressLog logs={progress} status={status} />}

					{/* Error display */}
					{error && (
						<m.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className="border-burnt-ember/50 bg-burnt-ember/10 border p-4"
						>
							<p className="text-burnt-ember font-mono text-sm">{error}</p>
						</m.div>
					)}
				</m.div>

				{/* Right column - Settings and Controls */}
				<m.div
					className="space-y-6"
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ ...springTransition, delay: 0.3 }}
				>
					<div>
						<h2 className="text-mist-white mb-4 font-mono text-lg">
							<span className="text-cyber-lime mr-2">02</span>
							Choose Preset
						</h2>
						<PresetSelector
							generator={generator}
							selectedPreset={preset}
							onPresetChange={setPreset}
							onGeneratorChange={handleGeneratorChange}
							disabled={isProcessing}
						/>
					</div>

					{/* Pre-processing options */}
					<div className="border border-white/10 p-4">
						<h3 className="text-slate-text mb-3 font-mono text-xs tracking-wider uppercase">
							Pre-processing
						</h3>
						<label
							className={cn(
								"flex cursor-pointer items-center gap-3 transition-opacity",
								isProcessing && "cursor-not-allowed opacity-50"
							)}
						>
							<button
								type="button"
								role="switch"
								aria-checked={removeBackground}
								onClick={() => !isProcessing && setRemoveBackground(!removeBackground)}
								disabled={isProcessing}
								className={cn(
									"relative h-6 w-11 rounded-sm transition-colors duration-200",
									removeBackground ? "bg-cyber-lime" : "bg-white/20"
								)}
							>
								<span
									className={cn(
										"bg-void-navy absolute top-1 left-1 h-4 w-4 rounded-sm transition-transform duration-200",
										removeBackground && "translate-x-5"
									)}
								/>
							</button>
							<div className="flex items-center gap-2">
								<Eraser className="text-slate-text h-4 w-4" strokeWidth={1.5} />
								<span className="text-mist-white font-mono text-sm">Remove Background</span>
							</div>
						</label>
						<p className="text-slate-text mt-2 text-[10px] leading-relaxed">
							Uses AI (rembg) to remove backgrounds before vectorization. Recommended for images
							with white or colored backgrounds.
						</p>
					</div>

					{/* Action buttons */}
					<div className="flex gap-3">
						<button
							onClick={handleProcess}
							disabled={!canProcess || isProcessing}
							className={cn(
								"group flex flex-1 items-center justify-center gap-2 py-4 font-mono text-sm font-bold transition-all duration-300",
								canProcess && !isProcessing
									? "bg-cyber-lime text-void-navy hover:bg-cyber-lime/90"
									: "text-slate-text cursor-not-allowed bg-white/10"
							)}
						>
							{isProcessing ? (
								<>
									<RefreshCw className="h-4 w-4 animate-spin" strokeWidth={2} />
									<span>Processing...</span>
								</>
							) : (
								<>
									<span>Vectorize</span>
									<ArrowRight
										className="h-4 w-4 transition-transform group-hover:translate-x-1"
										strokeWidth={2}
									/>
								</>
							)}
						</button>

						{(previewUrl || status !== "idle") && (
							<button
								onClick={reset}
								disabled={isProcessing}
								className="text-slate-text hover:text-mist-white hover:border-cyber-lime/50 border border-white/10 px-6 py-4 font-mono text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
							>
								<RefreshCw className="h-4 w-4" strokeWidth={1.5} />
							</button>
						)}
					</div>
				</m.div>
			</div>

			{/* Result viewer */}
			{showResult && (
				<m.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={springTransition}
				>
					<h2 className="text-mist-white mb-4 font-mono text-lg">
						<span className="text-cyber-lime mr-2">03</span>
						Result
					</h2>
					<ResultViewer
						result={result}
						svgContent={svgContent}
						originalPreview={previewUrl}
						onDownload={downloadSvg}
						onGetPreview={getSvgPreview}
					/>
				</m.div>
			)}

			{/* Tips section */}
			<m.div
				className="border-t border-white/10 pt-8"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ ...springTransition, delay: 0.4 }}
			>
				<h3 className="text-slate-text mb-4 font-mono text-xs tracking-wider uppercase">
					Tips for Best Results
				</h3>
				<ul className="text-slate-text grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
					<li className="flex items-start gap-2">
						<span className="text-cyber-lime">•</span>
						<span>Use high-contrast images with clean edges</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-cyber-lime">•</span>
						<span>
							Enable &ldquo;Remove Background&rdquo; for images with white/colored backgrounds
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-cyber-lime">•</span>
						<span>Try &ldquo;Logo Smooth&rdquo; preset for most logos</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-cyber-lime">•</span>
						<span>Use &ldquo;Geometric&rdquo; for sharp-cornered designs</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-cyber-lime">•</span>
						<span>VTracer works better for multi-color images</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-cyber-lime">•</span>
						<span>Higher resolution input = better quality output</span>
					</li>
				</ul>
			</m.div>
		</div>
	);
}
