"use client";

import { useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Terminal, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VectorizerStatus } from "@/lib/hooks/use-vectorizer";

interface ProgressLogProps {
	logs: string[];
	status: VectorizerStatus;
}

export function ProgressLog({ logs, status }: ProgressLogProps) {
	const scrollRef = useRef<HTMLDivElement>(null);

	// Auto-scroll to bottom when new logs arrive
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [logs]);

	const isProcessing = status === "uploading" || status === "processing";
	const isCompleted = status === "completed";
	const isError = status === "error";

	return (
		<div className="bg-void-navy/50 border border-white/10">
			{/* Header */}
			<div className="flex items-center gap-2 border-b border-white/10 px-4 py-2">
				<Terminal className="text-cyber-lime h-4 w-4" strokeWidth={1.5} />
				<span className="text-mist-white font-mono text-xs tracking-wider uppercase">
					Process Log
				</span>
				<div className="ml-auto flex items-center gap-2">
					{isProcessing && (
						<Loader2 className="text-cyber-lime h-3 w-3 animate-spin" strokeWidth={1.5} />
					)}
					{isCompleted && <CheckCircle className="h-3 w-3 text-green-400" strokeWidth={1.5} />}
					{isError && <AlertCircle className="text-burnt-ember h-3 w-3" strokeWidth={1.5} />}
					<span
						className={cn(
							"font-mono text-[10px] uppercase",
							isProcessing && "text-cyber-lime",
							isCompleted && "text-green-400",
							isError && "text-burnt-ember"
						)}
					>
						{status === "idle" && "Ready"}
						{status === "uploading" && "Uploading..."}
						{status === "uploaded" && "Uploaded"}
						{status === "processing" && "Processing..."}
						{status === "completed" && "Complete"}
						{status === "error" && "Error"}
					</span>
				</div>
			</div>

			{/* Log content */}
			<div ref={scrollRef} className="h-40 overflow-y-auto p-4 font-mono text-xs">
				<AnimatePresence initial={false}>
					{logs.length === 0 ? (
						<p className="text-slate-text">Waiting for input...</p>
					) : (
						logs.map((log, index) => (
							<m.div
								key={index}
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.15 }}
								className={cn(
									"flex items-start gap-2 py-0.5",
									log.startsWith("Error:") ? "text-burnt-ember" : "text-slate-text"
								)}
							>
								<span className="text-cyber-lime shrink-0 select-none">›</span>
								<span className="break-all">{log}</span>
							</m.div>
						))
					)}
				</AnimatePresence>

				{/* Processing cursor */}
				{isProcessing && (
					<m.span
						initial={{ opacity: 0 }}
						animate={{ opacity: [0, 1, 0] }}
						transition={{ repeat: Infinity, duration: 1 }}
						className="text-cyber-lime inline-block"
					>
						▋
					</m.span>
				)}
			</div>
		</div>
	);
}
