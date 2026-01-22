"use client";

import { useState, useEffect, useCallback } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Cpu, Zap, PenTool, Sparkles, Server, Power, X, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SystemStatusData {
	api: { online: boolean; version?: string };
	gpu: { available: boolean; enabled?: boolean; name?: string | null };
	potrace: { available: boolean };
	vtracer: { available: boolean };
	worker: { online: boolean };
}

interface StatusItemProps {
	label: string;
	status: "online" | "offline" | "checking";
	icon: React.ReactNode;
	detail?: string | null;
	action?: React.ReactNode;
}

function StatusItem({ label, status, icon, detail, action }: StatusItemProps) {
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
				{action}
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

interface GPUToggleModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (password: string) => Promise<void>;
	action: "enable" | "disable";
	isLoading: boolean;
	error: string | null;
}

function GPUToggleModal({
	isOpen,
	onClose,
	onSubmit,
	action,
	isLoading,
	error,
}: GPUToggleModalProps) {
	const [password, setPassword] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await onSubmit(password);
		setPassword("");
	};

	if (!isOpen) return null;

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					{/* Backdrop */}
					<m.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="bg-void-navy/80 absolute inset-0 backdrop-blur-sm"
						onClick={onClose}
					/>

					{/* Modal */}
					<m.div
						initial={{ opacity: 0, scale: 0.95, y: 10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 10 }}
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
						className="bg-gunmetal-glass relative z-10 w-full max-w-sm border border-white/10 p-6"
					>
						{/* Close button */}
						<button
							onClick={onClose}
							className="text-slate-text hover:text-mist-white absolute top-4 right-4 transition-colors"
						>
							<X className="h-4 w-4" />
						</button>

						{/* Header */}
						<div className="mb-6 flex items-center gap-3">
							<div className="text-cyber-lime">
								<Lock className="h-5 w-5" strokeWidth={1.5} />
							</div>
							<div>
								<h3 className="text-mist-white font-mono text-sm">
									{action === "enable" ? "Enable" : "Disable"} GPU Processing
								</h3>
								<p className="text-slate-text text-xs">Enter admin password to continue</p>
							</div>
						</div>

						{/* Form */}
						<form onSubmit={handleSubmit}>
							<div className="mb-4">
								<input
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Password"
									className="text-mist-white placeholder:text-slate-text/50 focus:border-cyber-lime w-full border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm focus:outline-none"
									autoFocus
									disabled={isLoading}
								/>
							</div>

							{error && <p className="text-burnt-ember mb-4 font-mono text-xs">{error}</p>}

							<div className="flex gap-3">
								<button
									type="button"
									onClick={onClose}
									className="text-slate-text hover:text-mist-white flex-1 border border-white/10 py-2 font-mono text-xs transition-colors hover:border-white/30"
									disabled={isLoading}
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={isLoading || !password}
									className={cn(
										"flex-1 border py-2 font-mono text-xs transition-colors disabled:opacity-50",
										action === "enable"
											? "border-cyber-lime/50 text-cyber-lime hover:bg-cyber-lime/10"
											: "border-burnt-ember/50 text-burnt-ember hover:bg-burnt-ember/10"
									)}
								>
									{isLoading ? "..." : action === "enable" ? "Enable GPU" : "Disable GPU"}
								</button>
							</div>
						</form>
					</m.div>
				</div>
			)}
		</AnimatePresence>
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

	// GPU toggle modal state
	const [showGPUModal, setShowGPUModal] = useState(false);
	const [gpuAction, setGpuAction] = useState<"enable" | "disable">("enable");
	const [isToggling, setIsToggling] = useState(false);
	const [toggleError, setToggleError] = useState<string | null>(null);

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

	const handleGPUToggle = (action: "enable" | "disable") => {
		setGpuAction(action);
		setToggleError(null);
		setShowGPUModal(true);
	};

	const handleGPUSubmit = async (password: string) => {
		const url = getApiUrl();
		if (!url) return;

		setIsToggling(true);
		setToggleError(null);

		try {
			const response = await fetch(`${url}/gpu/${gpuAction}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ password }),
				signal: AbortSignal.timeout(5000),
			});

			if (response.ok) {
				setShowGPUModal(false);
				// Refresh status
				await checkStatus();
			} else {
				const data = await response.json().catch(() => ({}));
				setToggleError(data.detail || `Failed to ${gpuAction} GPU`);
			}
		} catch {
			setToggleError("Connection failed");
		} finally {
			setIsToggling(false);
		}
	};

	const isOnline = status?.api.online && status?.worker.online;
	const gpuAvailable = status?.gpu.available;
	const gpuEnabled = status?.gpu.enabled;

	return (
		<>
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
						status={isChecking ? "checking" : gpuAvailable && gpuEnabled ? "online" : "offline"}
						icon={<Zap className="h-4 w-4" strokeWidth={1.5} />}
						detail={gpuAvailable ? (gpuEnabled ? status?.gpu.name : "Disabled") : null}
						action={
							isOnline && gpuAvailable ? (
								<button
									onClick={() => handleGPUToggle(gpuEnabled ? "disable" : "enable")}
									className={cn(
										"mr-2 border p-1 transition-colors",
										gpuEnabled
											? "border-cyber-lime/30 text-cyber-lime hover:bg-cyber-lime/10"
											: "border-burnt-ember/30 text-burnt-ember hover:bg-burnt-ember/10"
									)}
									title={gpuEnabled ? "Disable GPU" : "Enable GPU"}
								>
									<Power className="h-3 w-3" strokeWidth={1.5} />
								</button>
							) : null
						}
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
						<p className="text-slate-text mt-2 text-center text-[10px]">
							Demo mode: UI preview only
						</p>
					)}
				</div>
			</m.div>

			{/* GPU Toggle Modal */}
			<GPUToggleModal
				isOpen={showGPUModal}
				onClose={() => setShowGPUModal(false)}
				onSubmit={handleGPUSubmit}
				action={gpuAction}
				isLoading={isToggling}
				error={toggleError}
			/>
		</>
	);
}
