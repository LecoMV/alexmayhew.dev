import type { Zone } from "@/data/saas-stagefit/types";

interface HotTruncateProps {
	misalignedCount: number;
	leaningZone: Zone;
	onContinue: () => void;
}

export function HotTruncate({ misalignedCount, leaningZone, onContinue }: HotTruncateProps) {
	return (
		<aside className="mx-auto max-w-2xl border border-white/10 p-6">
			<p className="text-cyber-lime mb-2 font-mono text-xs tracking-wider uppercase">
				Early Signal
			</p>
			<p className="text-mist-white text-sm leading-relaxed">
				Current signal: {misalignedCount} dimensions misaligned, leaning{" "}
				<span className="text-cyber-lime">{leaningZone.replace("-", " ")}</span> — finish 5 more
				questions to lock the zone.
			</p>
			<button
				onClick={onContinue}
				className="border-cyber-lime bg-cyber-lime/10 text-cyber-lime hover:bg-cyber-lime/20 focus-visible:ring-cyber-lime mt-4 border px-6 py-2 font-mono text-sm tracking-tight transition-colors focus:outline-none focus-visible:ring-2"
			>
				Continue
			</button>
		</aside>
	);
}
