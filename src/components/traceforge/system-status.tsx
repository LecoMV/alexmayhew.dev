"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import {
	Cpu,
	Zap,
	PenTool,
	Sparkles,
	Server,
	Power,
	ArrowRight,
	Loader2,
	Lock,
} from "lucide-react";
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
}

function StatusItem({ label, status, icon, detail }: StatusItemProps) {
	return (
		<div className="flex items-center justify-between py-2.5">
			<div className="flex items-center gap-3">
				<span
					className={cn(
						"transition-colors",
						status === "online" ? "text-cyber-lime" : "text-slate-text"
					)}
				>
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
							status === "online" && "bg-cyber-lime shadow-[0_0_8px_rgba(204,243,129,0.5)]",
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

interface SystemStatusProps {
	apiUrl?: string;
	onStatusChange?: (isOnline: boolean) => void;
}

export function SystemStatus({ apiUrl, onStatusChange }: SystemStatusProps) {
	const [status, setStatus] = useState<SystemStatusData | null>(null);
	const [isChecking, setIsChecking] = useState(true);
	const [lastChecked, setLastChecked] = useState<Date | null>(null);

	// GPU toggle inline state
	const [showPasswordInput, setShowPasswordInput] = useState(false);
	const [password, setPassword] = useState("");
	const [isToggling, setIsToggling] = useState(false);
	const [toggleError, setToggleError] = useState<string | null>(null);
	const passwordInputRef = useRef<HTMLInputElement>(null);

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

	// Focus password input when it appears
	useEffect(() => {
		if (showPasswordInput && passwordInputRef.current) {
			passwordInputRef.current.focus();
		}
	}, [showPasswordInput]);

	const handleGPUButtonClick = () => {
		setToggleError(null);
		setPassword("");
		setShowPasswordInput(true);
	};

	const handlePasswordCancel = () => {
		setShowPasswordInput(false);
		setPassword("");
		setToggleError(null);
	};

	const handleGPUSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const url = getApiUrl();
		if (!url || !password) return;

		// If offline or GPU not enabled, we want to enable. If online and enabled, disable.
		const action = isOnline && gpuEnabled ? "disable" : "enable";
		setIsToggling(true);
		setToggleError(null);

		try {
			const response = await fetch(`${url}/gpu/${action}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ password }),
				signal: AbortSignal.timeout(5000),
			});

			if (response.ok) {
				setShowPasswordInput(false);
				setPassword("");
				// Refresh status
				await checkStatus();
			} else {
				const data = await response.json().catch(() => ({}));
				setToggleError(data.detail || `Failed to ${action} GPU`);
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
					isOnline ? "border-cyber-lime" : "border-white/20"
				)}
			/>
			<div
				className={cn(
					"absolute top-0 right-0 h-4 w-4 border-t border-r transition-colors",
					isOnline ? "border-cyber-lime" : "border-white/20"
				)}
			/>
			<div
				className={cn(
					"absolute bottom-0 left-0 h-4 w-4 border-b border-l transition-colors",
					isOnline ? "border-cyber-lime" : "border-white/20"
				)}
			/>
			<div
				className={cn(
					"absolute right-0 bottom-0 h-4 w-4 border-r border-b transition-colors",
					isOnline ? "border-cyber-lime" : "border-white/20"
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
					status={isChecking ? "checking" : status?.api.online ? "online" : "offline"}
					icon={<Server className="h-4 w-4" strokeWidth={1.5} />}
					detail={status?.api.version}
				/>
				<StatusItem
					label="GPU Acceleration"
					status={isChecking ? "checking" : gpuAvailable && gpuEnabled ? "online" : "offline"}
					icon={<Zap className="h-4 w-4" strokeWidth={1.5} />}
					detail={gpuAvailable ? (gpuEnabled ? status?.gpu.name : "Disabled") : null}
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
			<div className="mt-4 border-t border-white/10 pt-4">
				<div
					className={cn(
						"flex items-center justify-center gap-2 font-mono text-xs tracking-wider uppercase",
						isOnline ? "text-cyber-lime" : "text-burnt-ember"
					)}
				>
					<span
						className={cn(
							"h-2 w-2 rounded-full",
							isOnline
								? "bg-cyber-lime shadow-[0_0_8px_rgba(204,243,129,0.5)]"
								: "bg-burnt-ember shadow-[0_0_8px_rgba(255,107,107,0.3)]"
						)}
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

			{/* GPU Control Section - Always visible for remote control */}
			<div className="mt-4 border-t border-white/10 pt-4">
				<AnimatePresence mode="wait">
					{!showPasswordInput ? (
						<m.button
							key="gpu-button"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0, x: -20 }}
							transition={{ type: "spring", stiffness: 200, damping: 25 }}
							onClick={handleGPUButtonClick}
							className={cn(
								"group relative w-full overflow-hidden border py-3 font-mono text-xs tracking-wider uppercase transition-all duration-300",
								isOnline && gpuEnabled
									? "border-burnt-ember/40 text-burnt-ember hover:border-burnt-ember hover:bg-burnt-ember/5"
									: "border-cyber-lime/40 text-cyber-lime hover:border-cyber-lime hover:bg-cyber-lime/5"
							)}
						>
							{/* Scan line effect */}
							<div
								className={cn(
									"absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
									isOnline && gpuEnabled ? "bg-burnt-ember/5" : "bg-cyber-lime/5"
								)}
							/>
							<div
								className={cn(
									"absolute top-0 left-0 h-full w-1 opacity-0 transition-all duration-300 group-hover:opacity-100",
									isOnline && gpuEnabled ? "bg-burnt-ember/50" : "bg-cyber-lime/50"
								)}
							/>

							<span className="relative flex items-center justify-center gap-2">
								<Lock className="h-3 w-3 opacity-60" strokeWidth={1.5} />
								<span className="text-[10px] opacity-60">Admin</span>
								<span className="mx-1 opacity-30">|</span>
								<Power className="h-3.5 w-3.5" strokeWidth={1.5} />
								{gpuEnabled ? "Disable GPU" : "Enable GPU"}
								<ArrowRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
							</span>
						</m.button>
					) : (
						<m.form
							key="password-form"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 20 }}
							transition={{ type: "spring", stiffness: 200, damping: 25 }}
							onSubmit={handleGPUSubmit}
							className="space-y-3"
						>
							<p className="text-slate-text font-mono text-[10px] tracking-wider uppercase">
								Admin authentication required
							</p>
							<div className="flex gap-2">
								<div className="relative flex-1">
									<input
										ref={passwordInputRef}
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="Admin password..."
										disabled={isToggling}
										className={cn(
											"w-full border bg-white/5 px-3 py-2.5 font-mono text-sm transition-colors",
											"text-mist-white placeholder:text-slate-text/50",
											"focus:outline-none",
											isOnline && gpuEnabled
												? "border-burnt-ember/30 focus:border-burnt-ember"
												: "border-cyber-lime/30 focus:border-cyber-lime"
										)}
										onKeyDown={(e) => {
											if (e.key === "Escape") handlePasswordCancel();
										}}
									/>
								</div>
								<button
									type="submit"
									disabled={isToggling || !password}
									className={cn(
										"border px-4 py-2.5 font-mono text-xs tracking-wider uppercase transition-all disabled:opacity-50",
										isOnline && gpuEnabled
											? "border-burnt-ember/50 text-burnt-ember hover:bg-burnt-ember/10 disabled:hover:bg-transparent"
											: "border-cyber-lime/50 text-cyber-lime hover:bg-cyber-lime/10 disabled:hover:bg-transparent"
									)}
								>
									{isToggling ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<ArrowRight className="h-4 w-4" />
									)}
								</button>
							</div>

							{toggleError && (
								<m.p
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									className="text-burnt-ember font-mono text-xs"
								>
									{toggleError}
								</m.p>
							)}

							<button
								type="button"
								onClick={handlePasswordCancel}
								disabled={isToggling}
								className="text-slate-text hover:text-mist-white w-full py-1 font-mono text-[10px] tracking-wider uppercase transition-colors"
							>
								Cancel
							</button>
						</m.form>
					)}
				</AnimatePresence>
			</div>
		</m.div>
	);
}
