"use client";

import { AnimatePresence, m } from "framer-motion";
import { ArrowRight, Loader2, Lock, Power } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface GpuControlProps {
	apiUrl: string;
	isOnline: boolean;
	gpuEnabled: boolean;
	onToggleComplete: () => void;
}

export function GpuControl({ apiUrl, isOnline, gpuEnabled, onToggleComplete }: GpuControlProps) {
	const [showPasswordInput, setShowPasswordInput] = useState(false);
	const [password, setPassword] = useState("");
	const [isToggling, setIsToggling] = useState(false);
	const [toggleError, setToggleError] = useState<string | null>(null);
	const passwordInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (showPasswordInput) passwordInputRef.current?.focus();
	}, [showPasswordInput]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!password) return;

		const action = isOnline && gpuEnabled ? "disable" : "enable";
		setIsToggling(true);
		setToggleError(null);

		try {
			const response = await fetch(`${apiUrl}/gpu/${action}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ password }),
				signal: AbortSignal.timeout(5000),
			});

			if (response.ok) {
				setShowPasswordInput(false);
				setPassword("");
				onToggleComplete();
			} else {
				const data = (await response.json().catch(() => ({}))) as { detail?: string };
				setToggleError(data.detail || `Failed to ${action} GPU`);
			}
		} catch {
			setToggleError("Connection failed");
		} finally {
			setIsToggling(false);
		}
	};

	const handleCancel = () => {
		setShowPasswordInput(false);
		setPassword("");
		setToggleError(null);
	};

	const destructive = isOnline && gpuEnabled;
	const colorClass = destructive ? "burnt-ember" : "cyber-lime";

	return (
		<div className="mt-4 border-t border-white/10 pt-4">
			<AnimatePresence mode="wait">
				{!showPasswordInput ? (
					<m.button
						key="gpu-button"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0, x: -20 }}
						transition={{ type: "spring", stiffness: 200, damping: 25 }}
						onClick={() => {
							setToggleError(null);
							setPassword("");
							setShowPasswordInput(true);
						}}
						className={cn(
							"group relative w-full overflow-hidden border py-3 font-mono text-xs tracking-wider uppercase transition-all duration-300",
							destructive
								? "border-burnt-ember/40 text-burnt-ember hover:border-burnt-ember hover:bg-burnt-ember/5"
								: "border-cyber-lime/40 text-cyber-lime hover:border-cyber-lime hover:bg-cyber-lime/5"
						)}
					>
						<div
							className={cn(
								"absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
								`bg-${colorClass}/5`
							)}
						/>
						<div
							className={cn(
								"absolute top-0 left-0 h-full w-1 opacity-0 transition-all duration-300 group-hover:opacity-100",
								`bg-${colorClass}/50`
							)}
						/>
						<span className="relative flex items-center justify-center gap-2">
							<Lock className="h-3 w-3 opacity-60" strokeWidth={1.5} />
							<span className="text-micro opacity-60">Admin</span>
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
						onSubmit={handleSubmit}
						className="space-y-3"
					>
						<p className="text-slate-text text-micro font-mono tracking-wider uppercase">
							Admin authentication required
						</p>
						<div className="flex gap-2">
							<input
								ref={passwordInputRef}
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Admin password..."
								disabled={isToggling}
								className={cn(
									"w-full flex-1 border bg-white/5 px-3 py-2.5 font-mono text-sm transition-colors",
									"text-mist-white placeholder:text-slate-text/50 focus-visible:ring-cyber-lime focus:outline-none focus-visible:ring-2",
									destructive
										? "border-burnt-ember/30 focus:border-burnt-ember"
										: "border-cyber-lime/30 focus:border-cyber-lime"
								)}
								onKeyDown={(e) => {
									if (e.key === "Escape") handleCancel();
								}}
							/>
							<button
								type="submit"
								disabled={isToggling || !password}
								className={cn(
									"border px-4 py-2.5 font-mono text-xs tracking-wider uppercase transition-all disabled:opacity-50",
									destructive
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
							onClick={handleCancel}
							disabled={isToggling}
							className="text-slate-text hover:text-mist-white text-micro w-full py-1 font-mono tracking-wider uppercase transition-colors"
						>
							Cancel
						</button>
					</m.form>
				)}
			</AnimatePresence>
		</div>
	);
}
