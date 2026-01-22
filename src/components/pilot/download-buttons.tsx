"use client";

import { m } from "framer-motion";
import { Download, Apple, Monitor, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlatform, getPlatformDownloadUrl, type Platform } from "@/lib/hooks/use-platform";

const VERSION = "0.2.0-alpha.1";

interface DownloadOption {
	platform: Platform;
	label: string;
	icon: React.ReactNode;
	filename: string;
}

const downloads: DownloadOption[] = [
	{
		platform: "macos",
		label: "macOS",
		icon: <Apple className="h-5 w-5" strokeWidth={1.5} />,
		filename: `Claude-Pilot-${VERSION}.dmg`,
	},
	{
		platform: "windows",
		label: "Windows",
		icon: <Monitor className="h-5 w-5" strokeWidth={1.5} />,
		filename: `Claude-Pilot-Setup-${VERSION}.exe`,
	},
	{
		platform: "linux",
		label: "Linux",
		icon: <Terminal className="h-5 w-5" strokeWidth={1.5} />,
		filename: `Claude-Pilot-${VERSION}.AppImage`,
	},
];

export function DownloadButtons() {
	const { platform: detectedPlatform, label: autoLabel } = usePlatform();

	return (
		<div className="space-y-4">
			{/* Primary download button - auto-detected platform */}
			{detectedPlatform !== "unknown" && (
				<m.a
					href={getPlatformDownloadUrl(detectedPlatform, VERSION)}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					className="bg-cyber-lime text-void-navy hover:bg-cyber-lime/90 group flex items-center justify-center gap-3 px-8 py-4 font-mono text-sm font-bold transition-colors"
				>
					<Download className="h-5 w-5" strokeWidth={2} />
					<span>{autoLabel}</span>
				</m.a>
			)}

			{/* Secondary options - all platforms */}
			<div className="flex flex-wrap gap-2">
				{downloads.map((option) => (
					<a
						key={option.platform}
						href={getPlatformDownloadUrl(option.platform, VERSION)}
						className={cn(
							"flex items-center gap-2 border px-4 py-2 font-mono text-xs transition-all",
							option.platform === detectedPlatform
								? "border-cyber-lime/50 text-cyber-lime bg-cyber-lime/5"
								: "text-slate-text hover:text-mist-white border-white/10 hover:border-white/30"
						)}
					>
						{option.icon}
						<span>{option.label}</span>
					</a>
				))}
			</div>

			{/* Version and source */}
			<div className="flex items-center gap-4 text-xs">
				<span className="text-slate-text border border-white/10 px-2 py-1 font-mono">
					v{VERSION}
				</span>
				<a
					href="https://github.com/alexmayhew/claude-pilot"
					target="_blank"
					rel="noopener noreferrer"
					className="text-slate-text hover:text-cyber-lime transition-colors"
				>
					View on GitHub →
				</a>
			</div>
		</div>
	);
}
