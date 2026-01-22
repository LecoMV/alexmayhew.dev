"use client";

import { m } from "framer-motion";
import { Sparkles, Zap, Palette, Pencil, Camera, Layers, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Generator } from "@/lib/hooks/use-vectorizer";

interface PresetOption {
	id: string;
	label: string;
	description: string;
	icon: React.ReactNode;
	recommended?: boolean;
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
		label: "Color Logo",
		description: "Multi-color logo optimization",
		icon: <Palette className="h-4 w-4" strokeWidth={1.5} />,
	},
];

const vtracerPresets: PresetOption[] = [
	{
		id: "logo",
		label: "Logo",
		description: "Optimized for logo vectorization",
		icon: <Layers className="h-4 w-4" strokeWidth={1.5} />,
		recommended: true,
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
		description: "Photo vectorization with color",
		icon: <Camera className="h-4 w-4" strokeWidth={1.5} />,
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
	const presets = generator === "potrace" ? potracePresets : vtracerPresets;

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
		</div>
	);
}
