"use client";

import { m } from "framer-motion";
import { Apple, Download, Monitor, Terminal } from "lucide-react";

import { getPlatformDownloadUrl, type Platform, usePlatform } from "@/lib/hooks/use-platform";
import { cn } from "@/lib/utils";

const VERSION = "0.2.0-alpha.1";

interface DownloadOption {
	platform: Platform;
	label: string;
	icon: React.ReactNode;
	filename: string;
	available: boolean;
}

const downloads: DownloadOption[] = [
	{
		platform: "macos",
		label: "macOS",
		icon: <Apple className="h-5 w-5" strokeWidth={1.5} />,
		filename: `Claude-Pilot-${VERSION}.dmg`,
		available: true,
	},
	{
		platform: "linux",
		label: "Linux",
		icon: <Terminal className="h-5 w-5" strokeWidth={1.5} />,
		filename: `Claude-Pilot-${VERSION}.AppImage`,
		available: true,
	},
	{
		platform: "windows",
		label: "Windows",
		icon: <Monitor className="h-5 w-5" strokeWidth={1.5} />,
		filename: `Claude-Pilot-Setup-${VERSION}.exe`,
		available: false,
	},
];

export function DownloadButtons() {
	const { platform: detectedPlatform, label: autoLabel } = usePlatform();

	// Check if detected platform is available for download
	const detectedOption = downloads.find((d) => d.platform === detectedPlatform);
	const canAutoDownload = detectedOption?.available ?? false;

	return (
		<div className="space-y-4">
			{/* Primary download button - auto-detected platform (only if available) */}
			{detectedPlatform !== "unknown" && canAutoDownload && (
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

			{/* Windows detected but not available */}
			{detectedPlatform === "windows" && !canAutoDownload && (
				<m.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					className="flex items-center gap-3 border border-amber-400/30 bg-amber-400/5 px-6 py-4"
				>
					<Monitor className="h-5 w-5 text-amber-400" strokeWidth={1.5} />
					<div>
						<p className="font-mono text-sm text-amber-400">Windows Support Coming Soon</p>
						<p className="text-slate-text text-xs">
							Native Windows with WSL2 integration is in active development.
						</p>
					</div>
				</m.div>
			)}

			{/* Secondary options - all platforms */}
			<div className="flex flex-wrap gap-2">
				{downloads.map((option) =>
					option.available ? (
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
					) : (
						<span
							key={option.platform}
							className="text-slate-text/50 flex cursor-not-allowed items-center gap-2 border border-white/5 bg-white/[0.02] px-4 py-2 font-mono text-xs"
							title="Coming soon"
						>
							{option.icon}
							<span>{option.label}</span>
							<span className="text-[10px] text-amber-400/70">Soon</span>
						</span>
					)
				)}
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
