import type { StageFitResult, Zone } from "@/data/saas-stagefit/types";

interface LeadCaptureProps {
	zone: Zone;
	result: StageFitResult;
	onSuccess: () => void;
}

export function LeadCapture({ zone: _z, result: _r, onSuccess: _s }: LeadCaptureProps) {
	return (
		<div className="border border-white/10 p-6">
			<label htmlFor="stagefit-email" className="sr-only">
				Email address
			</label>
			<div className="flex flex-col gap-3 sm:flex-row">
				<input
					id="stagefit-email"
					type="email"
					placeholder="you@company.com"
					className="text-mist-white placeholder:text-slate-text/60 focus-visible:border-cyber-lime focus-visible:ring-cyber-lime flex-1 border border-white/10 bg-transparent px-4 py-3 font-mono text-sm focus:outline-none focus-visible:ring-2"
				/>
				<button
					type="submit"
					className="border-cyber-lime bg-cyber-lime/10 text-cyber-lime hover:bg-cyber-lime/20 focus-visible:ring-cyber-lime border px-6 py-3 font-mono text-sm tracking-tight transition-colors focus:outline-none focus-visible:ring-2"
				>
					Unlock Remediation Plan
				</button>
			</div>
		</div>
	);
}
