"use client";

import { useState, useEffect, useCallback } from "react";
import { m } from "framer-motion";
import { Cpu, Zap, PenTool, Sparkles, Server } from "lucide-react";
import { cn } from "@/lib/utils";

interface SystemStatusData {
	api: { online: boolean; version?: string };
	gpu: { available: boolean; name?: string | null };
	potrace: { available: boolean };
	vtracer: { available: boolean };
	worker: { online: boolean };
}

interface StatusItemProps {
	label: string;
	status: "online" | "offline" | "checking";
	icon: React.ReactNode;
	detail?: string | null;
}

function StatusItem({ label, status, icon, detail }: StatusItemProps) {
	return (
		<div className="flex items-center justify-between py-2">
			<div className="flex items-center gap-3">
				<span className="text-cyber-lime">{icon}</span>
				<span className="text-mist-white font-mono text-sm">{label}</span>
			</div>
			<div className="flex items-center gap-2">
				{detail && (
					<span className="text-slate-text hidden font-mono text-xs sm:inline">{detail}</span>
				)}
				<div className="flex items-center gap-2">
					<span
						className={cn(
							"h-2 w-2 rounded-full",
							status === "online" && "bg-cyber-lime animate-pulse",
							status === "offline" && "bg-burnt-ember/70",
							status === "checking" && "bg-slate-text animate-pulse"
						)}
					/>
					<span
						className={cn(
							"font-mono text-xs tracking-wider uppercase",
							status === "online" && "text-cyber-lime",
							status === "offline" && "text-burnt-ember/70",
							status === "checking" && "text-slate-text"
						)}
					>
						{status === "checking" ? "..." : status}
					</span>
				</div>
			</div>
		</div>
	);
}

interface SystemStatusProps {
	apiUrl?: string;
	onStatusChange?: (isOnline: boolean) => void;
}

export function SystemStatus({ apiUrl, onStatusChange }: SystemStatusProps) {
	const [status, setStatus] = useState<SystemStatusData | null>(null);
	const [isChecking, setIsChecking] = useState(true);
	const [lastChecked, setLastChecked] = useState<Date | null>(null);

	// Determine API URL - use localhost if on localhost, otherwise use provided URL
	const getApiUrl = useCallback(() => {
		if (apiUrl) return apiUrl;
		if (typeof window !== "undefined") {
			const isLocalhost =
				window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
			if (isLocalhost) {
				return "http://localhost:8000";
			}
		}
		// Production URL - can be configured later
		return null;
	}, [apiUrl]);

	const checkStatus = useCallback(async () => {
		const url = getApiUrl();
		if (!url) {
			setStatus(null);
			setIsChecking(false);
			onStatusChange?.(false);
			return;
		}

		setIsChecking(true);
		try {
			const response = await fetch(`${url}/system-status`, {
				method: "GET",
				signal: AbortSignal.timeout(3000),
			});

			if (response.ok) {
				const data: SystemStatusData = await response.json();
				setStatus(data);
				onStatusChange?.(data.api.online && data.worker.online);
			} else {
				setStatus(null);
				onStatusChange?.(false);
			}
		} catch {
			setStatus(null);
			onStatusChange?.(false);
		} finally {
			setIsChecking(false);
			setLastChecked(new Date());
		}
	}, [getApiUrl, onStatusChange]);

	// Initial check and polling
	useEffect(() => {
		checkStatus();

		// Poll every 30 seconds
		const interval = setInterval(checkStatus, 30000);
		return () => clearInterval(interval);
	}, [checkStatus]);

	const isOnline = status?.api.online && status?.worker.online;

	return (
		<m.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ type: "spring", stiffness: 100, damping: 20 }}
			className="bg-gunmetal-glass/30 border border-white/10 p-4"
		>
			{/* Header */}
			<div className="mb-3 flex items-center justify-between border-b border-white/5 pb-3">
				<h3 className="text-cyber-lime flex items-center gap-2 font-mono text-xs tracking-wider uppercase">
					<span className="animate-pulse">●</span>
					System Status
				</h3>
				<div className="flex items-center gap-2">
					{isChecking ? (
						<span className="text-slate-text font-mono text-[10px]">checking...</span>
					) : lastChecked ? (
						<span className="text-slate-text font-mono text-[10px]">
							{lastChecked.toLocaleTimeString()}
						</span>
					) : null}
					<button
						onClick={checkStatus}
						disabled={isChecking}
						className="text-slate-text hover:text-cyber-lime transition-colors disabled:opacity-50"
						title="Refresh status"
					>
						<Server className="h-3 w-3" />
					</button>
				</div>
			</div>

			{/* Status Items */}
			<div className="divide-y divide-white/5">
				<StatusItem
					label="API Backend"
					status={isChecking ? "checking" : status?.api.online ? "online" : "offline"}
					icon={<Server className="h-4 w-4" strokeWidth={1.5} />}
					detail={status?.api.version}
				/>
				<StatusItem
					label="GPU Acceleration"
					status={isChecking ? "checking" : status?.gpu.available ? "online" : "offline"}
					icon={<Zap className="h-4 w-4" strokeWidth={1.5} />}
					detail={status?.gpu.name}
				/>
				<StatusItem
					label="Potrace Engine"
					status={isChecking ? "checking" : status?.potrace.available ? "online" : "offline"}
					icon={<PenTool className="h-4 w-4" strokeWidth={1.5} />}
				/>
				<StatusItem
					label="VTracer Engine"
					status={isChecking ? "checking" : status?.vtracer.available ? "online" : "offline"}
					icon={<Sparkles className="h-4 w-4" strokeWidth={1.5} />}
				/>
				<StatusItem
					label="Task Worker"
					status={isChecking ? "checking" : status?.worker.online ? "online" : "offline"}
					icon={<Cpu className="h-4 w-4" strokeWidth={1.5} />}
				/>
			</div>

			{/* Overall Status Footer */}
			<div className="mt-3 border-t border-white/5 pt-3">
				<div
					className={cn(
						"flex items-center justify-center gap-2 font-mono text-xs tracking-wider uppercase",
						isOnline ? "text-cyber-lime" : "text-slate-text"
					)}
				>
					<span
						className={cn(
							"h-2 w-2 rounded-full",
							isOnline ? "bg-cyber-lime animate-pulse" : "bg-slate-text"
						)}
					/>
					{isChecking
						? "Checking systems..."
						: isOnline
							? "All Systems Operational"
							: "Backend Offline"}
				</div>
				{!isOnline && !isChecking && (
					<p className="text-slate-text mt-2 text-center text-[10px]">Demo mode: UI preview only</p>
				)}
			</div>
		</m.div>
	);
}
