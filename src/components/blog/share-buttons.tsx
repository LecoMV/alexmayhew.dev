"use client";

import { AnimatePresence, m } from "framer-motion";
import { Check, ExternalLink, Link2, Share2 } from "lucide-react";
import { useState } from "react";

import { trackEvent } from "@/components/analytics";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
	title: string;
	url: string;
	description?: string;
	className?: string;
}

const springTransition = {
	type: "spring" as const,
	stiffness: 300,
	damping: 25,
};

interface SharePlatform {
	name: string;
	label: string;
	getUrl: (title: string, url: string) => string;
	icon?: React.ReactNode;
}

const platforms: SharePlatform[] = [
	{
		name: "twitter",
		label: "X",
		getUrl: (title, url) =>
			`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&via=alexmayhewdev`,
	},
	{
		name: "linkedin",
		label: "LINKEDIN",
		getUrl: (title, url) =>
			`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
	},
	{
		name: "bluesky",
		label: "BSKY",
		getUrl: (title, url) =>
			`https://bsky.app/intent/compose?text=${encodeURIComponent(`${title}\n\n${url}`)}`,
	},
	{
		name: "hackernews",
		label: "HN",
		getUrl: (title, url) =>
			`https://news.ycombinator.com/submitlink?u=${encodeURIComponent(url)}&t=${encodeURIComponent(title)}`,
	},
];

export function ShareButtons({ title, url, description, className }: ShareButtonsProps) {
	const [copied, setCopied] = useState(false);
	const [isNativeShareSupported] = useState(typeof navigator !== "undefined" && !!navigator.share);

	const handleCopyLink = async () => {
		trackEvent("share", { method: "copy_link", content_type: "article", item_id: url });
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// Fallback for older browsers
			const textArea = document.createElement("textarea");
			textArea.value = url;
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand("copy");
			document.body.removeChild(textArea);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const handleNativeShare = async () => {
		if (isNativeShareSupported) {
			trackEvent("share", { method: "native_share", content_type: "article", item_id: url });
			try {
				await navigator.share({
					title,
					text: description || title,
					url,
				});
			} catch (err) {
				// User cancelled or error - silently handle
				if ((err as Error).name !== "AbortError") {
					console.error("Share failed:", err);
				}
			}
		}
	};

	const handlePlatformShare = (platform: SharePlatform) => {
		trackEvent("share", { method: platform.name, content_type: "article", item_id: url });
		const shareUrl = platform.getUrl(title, url);
		const w = 600;
		const h = 600;
		const left = Math.round(window.screenX + (window.outerWidth - w) / 2);
		const top = Math.round(window.screenY + (window.outerHeight - h) / 2);
		window.open(
			shareUrl,
			"_blank",
			`noopener,noreferrer,width=${w},height=${h},left=${left},top=${top}`
		);
	};

	return (
		<aside
			className={cn("bg-gunmetal-glass/20 border border-white/10 p-4 backdrop-blur-sm", className)}
		>
			{/* Header */}
			<div className="mb-4 flex items-center gap-2">
				<span className="text-cyber-lime text-xs">$</span>
				<span className="text-cyber-lime font-mono text-xs tracking-wider">share --article</span>
			</div>

			{/* Share Buttons Grid */}
			<div className="flex flex-wrap gap-2">
				{/* Native Share (if supported) */}
				{isNativeShareSupported && (
					<m.button
						onClick={handleNativeShare}
						className="group hover:border-cyber-lime flex items-center gap-2 border border-white/20 px-3 py-2 transition-colors"
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						transition={springTransition}
						aria-label="Share using device share menu"
					>
						<Share2
							className="text-slate-text group-hover:text-cyber-lime h-3.5 w-3.5 transition-colors"
							strokeWidth={1.5}
						/>
						<span className="text-slate-text group-hover:text-cyber-lime font-mono text-xs transition-colors">
							SHARE()
						</span>
					</m.button>
				)}

				{/* Copy Link */}
				<m.button
					onClick={handleCopyLink}
					className={cn(
						"group flex items-center gap-2 border px-3 py-2 transition-colors",
						copied ? "border-cyber-lime" : "hover:border-cyber-lime border-white/20"
					)}
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					transition={springTransition}
					aria-label={copied ? "Link copied" : "Copy link to clipboard"}
				>
					<AnimatePresence mode="wait">
						{copied ? (
							<m.div
								key="check"
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								exit={{ scale: 0 }}
								transition={springTransition}
							>
								<Check className="text-cyber-lime h-3.5 w-3.5" strokeWidth={1.5} />
							</m.div>
						) : (
							<m.div
								key="link"
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								exit={{ scale: 0 }}
								transition={springTransition}
							>
								<Link2
									className="text-slate-text group-hover:text-cyber-lime h-3.5 w-3.5 transition-colors"
									strokeWidth={1.5}
								/>
							</m.div>
						)}
					</AnimatePresence>
					<span
						className={cn(
							"font-mono text-xs transition-colors",
							copied ? "text-cyber-lime" : "text-slate-text group-hover:text-cyber-lime"
						)}
					>
						{copied ? "COPIED!" : "COPY_LINK()"}
					</span>
				</m.button>

				{/* Platform Buttons */}
				{platforms.map((platform) => (
					<m.button
						key={platform.name}
						onClick={() => handlePlatformShare(platform)}
						className="group hover:border-cyber-lime flex items-center gap-2 border border-white/20 px-3 py-2 transition-colors"
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						transition={springTransition}
						aria-label={`Share on ${platform.label}`}
					>
						<ExternalLink
							className="text-slate-text group-hover:text-cyber-lime h-3.5 w-3.5 transition-colors"
							strokeWidth={1.5}
						/>
						<span className="text-slate-text group-hover:text-cyber-lime font-mono text-xs transition-colors">
							{platform.label}
						</span>
					</m.button>
				))}
			</div>

			{/* Output feedback */}
			<AnimatePresence>
				{copied && (
					<m.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={springTransition}
						className="mt-3 font-mono text-xs"
					>
						<span className="text-slate-text">{">"} Link copied to clipboard</span>
					</m.div>
				)}
			</AnimatePresence>
		</aside>
	);
}

export default ShareButtons;
