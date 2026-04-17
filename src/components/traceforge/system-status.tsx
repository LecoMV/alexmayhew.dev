"use client";

import { m } from "framer-motion";
import { Cpu, PenTool, Server, Sparkles, Zap } from "lucide-react";

import { cn } from "@/lib/utils";

import { GpuControl } from "./gpu-control";
import { useSystemStatus } from "./use-system-status";

function statusColorClass(isActive: boolean): string {
	return isActive ? "text-cyber-lime" : "text-slate-text";
}

interface StatusItemProps {
	label: string;
	status: "online" | "offline" | "checking";
	icon: React.ReactNode;
	detail?: string | null;
}

function StatusItem({ label, status, icon, detail }: StatusItemProps) {
	return (
		<div className="flex items-center justify-between py-2.5">
			<div className="flex items-center gap-3">
				<span className={cn("transition-colors", statusColorClass(status === "online"))}>
					{icon}
				</span>
				<span className="text-mist-white font-mono text-sm">{label}</span>
			</div>
			<div className="flex items-center gap-3">
				{detail && (
					<span className="text-slate-text hidden font-mono text-xs sm:inline">{detail}</span>
				)}
				<div className="flex min-w-[72px] items-center justify-end gap-2">
					<span
						className={cn(
							"h-2 w-2 rounded-full transition-colors",
							status === "online" && "bg-cyber-lime",
							status === "offline" && "bg-burnt-ember",
							status === "checking" && "bg-slate-text animate-pulse"
						)}
					/>
					<span
						className={cn(
							"font-mono text-[11px] tracking-wider uppercase transition-colors",
							status === "online" && "text-cyber-lime",
							status === "offline" && "text-burnt-ember",
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

function resolveItemStatus(
	isChecking: boolean,
	available?: boolean
): "online" | "offline" | "checking" {
	if (isChecking) return "checking";
	return available ? "online" : "offline";
}

interface SystemStatusProps {
	apiUrl?: string;
	onStatusChange?: (isOnline: boolean) => void;
}

export function SystemStatus({ apiUrl, onStatusChange }: SystemStatusProps) {
	const { status, isChecking, lastChecked, isOnline, checkStatus, url } = useSystemStatus(
		apiUrl,
		onStatusChange
	);

	const gpuAvailable = status?.gpu.available;
	const gpuEnabled = status?.gpu.enabled;
	const cornerColor = isOnline ? "border-cyber-lime" : "border-white/20";

	return (
		<m.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ type: "spring", stiffness: 100, damping: 20 }}
			className={cn(
				"bg-gunmetal-glass/40 relative border p-5",
				isOnline ? "border-cyber-lime/30" : "border-white/10"
			)}
		>
			{/* Corner accents */}
			<div
				className={cn(
					"absolute top-0 left-0 h-4 w-4 border-t border-l transition-colors",
					cornerColor
				)}
			/>
			<div
				className={cn(
					"absolute top-0 right-0 h-4 w-4 border-t border-r transition-colors",
					cornerColor
				)}
			/>
			<div
				className={cn(
					"absolute bottom-0 left-0 h-4 w-4 border-b border-l transition-colors",
					cornerColor
				)}
			/>
			<div
				className={cn(
					"absolute right-0 bottom-0 h-4 w-4 border-r border-b transition-colors",
					cornerColor
				)}
			/>

			{/* Header */}
			<div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
				<h3
					className={cn(
						"flex items-center gap-2 font-mono text-xs tracking-wider uppercase transition-colors",
						isOnline ? "text-cyber-lime" : "text-slate-text"
					)}
				>
					<span className={cn(isOnline ? "text-cyber-lime animate-pulse" : "text-burnt-ember")}>
						●
					</span>
					System Status
				</h3>
				<div className="flex items-center gap-3">
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
						<Server className="h-3.5 w-3.5" />
					</button>
				</div>
			</div>

			{/* Status Items */}
			<div className="divide-y divide-white/5">
				<StatusItem
					label="API Backend"
					status={resolveItemStatus(isChecking, status?.api.online)}
					icon={<Server className="h-4 w-4" strokeWidth={1.5} />}
					detail={status?.api.version}
				/>
				<StatusItem
					label="GPU Acceleration"
					status={resolveItemStatus(isChecking, gpuAvailable && gpuEnabled)}
					icon={<Zap className="h-4 w-4" strokeWidth={1.5} />}
					detail={gpuAvailable ? (gpuEnabled ? status?.gpu.name : "Disabled") : null}
				/>
				<StatusItem
					label="Potrace Engine"
					status={resolveItemStatus(isChecking, status?.potrace.available)}
					icon={<PenTool className="h-4 w-4" strokeWidth={1.5} />}
				/>
				<StatusItem
					label="VTracer Engine"
					status={resolveItemStatus(isChecking, status?.vtracer.available)}
					icon={<Sparkles className="h-4 w-4" strokeWidth={1.5} />}
				/>
				<StatusItem
					label="Task Worker"
					status={resolveItemStatus(isChecking, status?.worker.online)}
					icon={<Cpu className="h-4 w-4" strokeWidth={1.5} />}
				/>
			</div>

			{/* Overall Status Footer */}
			<div className="mt-4 border-t border-white/10 pt-4">
				<div
					className={cn(
						"flex items-center justify-center gap-2 font-mono text-xs tracking-wider uppercase",
						isOnline ? "text-cyber-lime" : "text-burnt-ember"
					)}
				>
					<span
						className={cn("h-2 w-2 rounded-full", isOnline ? "bg-cyber-lime" : "bg-burnt-ember")}
					/>
					{isChecking
						? "Checking systems..."
						: isOnline
							? "All Systems Operational"
							: "Backend Offline"}
				</div>
				{!isChecking && (
					<p className="text-slate-text mt-2 text-center font-mono text-[10px] tracking-wide">
						GPU not required for vectorization
					</p>
				)}
			</div>

			{/* GPU Control */}
			<GpuControl
				apiUrl={url}
				isOnline={isOnline}
				gpuEnabled={Boolean(gpuEnabled)}
				onToggleComplete={checkStatus}
			/>
		</m.div>
	);
}
