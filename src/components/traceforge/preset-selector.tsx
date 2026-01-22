"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import {
	Sparkles,
	Zap,
	Palette,
	Pencil,
	Camera,
	Layers,
	Grid3X3,
	HelpCircle,
	ChevronDown,
	AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Generator } from "@/lib/hooks/use-vectorizer";

interface PresetOption {
	id: string;
	label: string;
	description: string;
	icon: React.ReactNode;
	recommended?: boolean;
	warning?: string;
}

interface PresetSelectorProps {
	generator: Generator;
	selectedPreset: string;
	onPresetChange: (preset: string) => void;
	onGeneratorChange: (generator: Generator) => void;
	disabled?: boolean;
}

const potracePresets: PresetOption[] = [
	{
		id: "logo_smooth",
		label: "Logo Smooth",
		description: "Maximum curve smoothness - best for most logos",
		icon: <Sparkles className="h-4 w-4" strokeWidth={1.5} />,
		recommended: true,
	},
	{
		id: "logo",
		label: "Logo",
		description: "Balanced curves for general logos",
		icon: <Layers className="h-4 w-4" strokeWidth={1.5} />,
	},
	{
		id: "logo_geometric",
		label: "Geometric",
		description: "Sharp corners for geometric designs",
		icon: <Grid3X3 className="h-4 w-4" strokeWidth={1.5} />,
	},
	{
		id: "line_art",
		label: "Line Art",
		description: "Optimized for sketches and line drawings",
		icon: <Pencil className="h-4 w-4" strokeWidth={1.5} />,
	},
	{
		id: "detailed",
		label: "Detailed",
		description: "Preserve maximum fine details",
		icon: <Zap className="h-4 w-4" strokeWidth={1.5} />,
	},
	{
		id: "color_logo",
		label: "Color Extract",
		description: "Better at extracting colored content (output is still single-color)",
		icon: <Palette className="h-4 w-4" strokeWidth={1.5} />,
		warning: "Potrace outputs single-color only. Use VTracer for multi-color SVGs.",
	},
];

const vtracerPresets: PresetOption[] = [
	{
		id: "icon",
		label: "Icon",
		description: "Perfect for icons with circles and smooth curves",
		icon: <Sparkles className="h-4 w-4" strokeWidth={1.5} />,
		recommended: true,
	},
	{
		id: "logo",
		label: "Logo",
		description: "Optimized for logo vectorization",
		icon: <Layers className="h-4 w-4" strokeWidth={1.5} />,
	},
	{
		id: "logo_smooth",
		label: "Smooth",
		description: "Smoother curves for logos",
		icon: <Sparkles className="h-4 w-4" strokeWidth={1.5} />,
	},
	{
		id: "photo",
		label: "Photo",
		description: "Creates stylized poster-art effect from photos",
		icon: <Camera className="h-4 w-4" strokeWidth={1.5} />,
		warning: "Creates posterization effect, not photorealistic output",
	},
	{
		id: "detailed",
		label: "Detailed",
		description: "Maximum detail preservation",
		icon: <Zap className="h-4 w-4" strokeWidth={1.5} />,
	},
	{
		id: "line_art",
		label: "Line Art",
		description: "Binary mode for line art",
		icon: <Pencil className="h-4 w-4" strokeWidth={1.5} />,
	},
	{
		id: "fast",
		label: "Fast",
		description: "Quick processing, good quality",
		icon: <Zap className="h-4 w-4" strokeWidth={1.5} />,
	},
];

export function PresetSelector({
	generator,
	selectedPreset,
	onPresetChange,
	onGeneratorChange,
	disabled,
}: PresetSelectorProps) {
	const [showGuide, setShowGuide] = useState(false);
	const presets = generator === "potrace" ? potracePresets : vtracerPresets;
	const selectedPresetData = presets.find((p) => p.id === selectedPreset);

	return (
		<div className="space-y-4">
			{/* Generator Toggle */}
			<div className="flex items-center gap-2">
				<span className="text-slate-text font-mono text-xs tracking-wider uppercase">Engine:</span>
				<div className="flex border border-white/10">
					<button
						onClick={() => onGeneratorChange("potrace")}
						disabled={disabled}
						className={cn(
							"px-3 py-1.5 font-mono text-xs transition-colors",
							generator === "potrace"
								? "bg-cyber-lime/10 text-cyber-lime"
								: "text-slate-text hover:text-mist-white hover:bg-white/5",
							disabled && "cursor-not-allowed opacity-50"
						)}
					>
						Potrace
					</button>
					<button
						onClick={() => onGeneratorChange("vtracer")}
						disabled={disabled}
						className={cn(
							"border-l border-white/10 px-3 py-1.5 font-mono text-xs transition-colors",
							generator === "vtracer"
								? "bg-cyber-lime/10 text-cyber-lime"
								: "text-slate-text hover:text-mist-white hover:bg-white/5",
							disabled && "cursor-not-allowed opacity-50"
						)}
					>
						VTracer
					</button>
				</div>
			</div>

			{/* Preset Grid */}
			<div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
				{presets.map((preset, index) => (
					<m.button
						key={preset.id}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.05 }}
						onClick={() => onPresetChange(preset.id)}
						disabled={disabled}
						className={cn(
							"group relative flex flex-col items-start gap-1 border p-3 text-left transition-all duration-200",
							selectedPreset === preset.id
								? "border-cyber-lime bg-cyber-lime/5"
								: "border-white/10 hover:border-white/30 hover:bg-white/5",
							disabled && "cursor-not-allowed opacity-50"
						)}
					>
						{preset.recommended && (
							<span className="bg-cyber-lime text-void-navy absolute -top-2 right-2 px-1.5 py-0.5 font-mono text-[8px] tracking-wider uppercase">
								Best
							</span>
						)}
						<div className="flex items-center gap-2">
							<span
								className={cn(
									"transition-colors",
									selectedPreset === preset.id ? "text-cyber-lime" : "text-slate-text"
								)}
							>
								{preset.icon}
							</span>
							<span
								className={cn(
									"font-mono text-sm",
									selectedPreset === preset.id ? "text-cyber-lime" : "text-mist-white"
								)}
							>
								{preset.label}
							</span>
						</div>
						<span className="text-slate-text line-clamp-2 text-[10px] leading-tight">
							{preset.description}
						</span>
					</m.button>
				))}
			</div>

			{/* Warning for selected preset */}
			<AnimatePresence>
				{selectedPresetData?.warning && (
					<m.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="overflow-hidden"
					>
						<div className="flex items-start gap-2 border border-amber-400/30 bg-amber-400/5 p-3">
							<AlertTriangle
								className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400"
								strokeWidth={1.5}
							/>
							<p className="text-xs leading-relaxed text-amber-400">{selectedPresetData.warning}</p>
						</div>
					</m.div>
				)}
			</AnimatePresence>

			{/* Preset Guide Toggle */}
			<button
				onClick={() => setShowGuide(!showGuide)}
				className="text-slate-text hover:text-mist-white flex w-full items-center justify-between border-t border-white/10 pt-3 text-left font-mono text-xs transition-colors"
			>
				<span className="flex items-center gap-2">
					<HelpCircle className="h-3 w-3" strokeWidth={1.5} />
					Preset Guide
				</span>
				<ChevronDown
					className={cn("h-3 w-3 transition-transform", showGuide && "rotate-180")}
					strokeWidth={1.5}
				/>
			</button>

			{/* Preset Guide Content */}
			<AnimatePresence>
				{showGuide && (
					<m.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="overflow-hidden"
					>
						<div className="space-y-4 border border-white/10 bg-white/5 p-4">
							<div>
								<h4 className="text-cyber-lime mb-2 font-mono text-xs">When to use Potrace</h4>
								<p className="text-slate-text/70 mb-1 text-[10px] italic">
									Single-color output only
								</p>
								<ul className="text-slate-text space-y-1 text-[10px]">
									<li>• Single-color logos with sharp edges</li>
									<li>• Line art and sketches</li>
									<li>• Black & white images</li>
									<li>• Text and typography</li>
								</ul>
							</div>
							<div>
								<h4 className="text-cyber-lime mb-2 font-mono text-xs">When to use VTracer</h4>
								<p className="text-slate-text/70 mb-1 text-[10px] italic">
									Multi-color output supported
								</p>
								<ul className="text-slate-text space-y-1 text-[10px]">
									<li>
										• <span className="text-mist-white">Icons with circles or smooth curves</span>{" "}
										(recommended)
									</li>
									<li>• Multi-color graphics and logos</li>
									<li>• When you need colors preserved in output</li>
								</ul>
							</div>
							<div className="border-t border-white/10 pt-3">
								<h4 className="mb-2 font-mono text-xs text-amber-400">Important Notes</h4>
								<ul className="text-slate-text space-y-1 text-[10px]">
									<li>
										• <span className="text-amber-400/80">Circles:</span> Use VTracer Icon preset
										for perfect bezier curves without flat edges
									</li>
									<li>
										• <span className="text-amber-400/80">VTracer Photo</span> creates a stylized
										poster-art effect, not photorealistic vectors
									</li>
									<li>• For best results, use high-contrast images with clean edges</li>
								</ul>
							</div>
						</div>
					</m.div>
				)}
			</AnimatePresence>
		</div>
	);
}
