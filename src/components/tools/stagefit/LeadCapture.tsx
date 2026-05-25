"use client";

import { useState } from "react";

import type { StageFitResult, Zone } from "@/data/saas-stagefit/types";

interface LeadCaptureProps {
	zone: Zone;
	result: StageFitResult;
	onSuccess: () => void;
	onSubmitEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
}

export function LeadCapture({ onSuccess, onSubmitEmail }: LeadCaptureProps) {
	const [email, setEmail] = useState("");

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		await onSubmitEmail(email);
		onSuccess();
	}

	return (
		<div className="border border-white/10 p-6">
			<form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
				<label htmlFor="stagefit-email" className="sr-only">
					Email address
				</label>
				<input
					id="stagefit-email"
					type="email"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="you@company.com"
					className="text-mist-white placeholder:text-slate-text/60 focus-visible:border-cyber-lime focus-visible:ring-cyber-lime flex-1 border border-white/10 bg-transparent px-4 py-3 font-mono text-sm focus:outline-none focus-visible:ring-2"
				/>
				<button
					type="submit"
					className="border-cyber-lime bg-cyber-lime/10 text-cyber-lime hover:bg-cyber-lime/20 focus-visible:ring-cyber-lime border px-6 py-3 font-mono text-sm tracking-tight transition-colors focus:outline-none focus-visible:ring-2"
				>
					Unlock Remediation Plan
				</button>
			</form>
		</div>
	);
}
