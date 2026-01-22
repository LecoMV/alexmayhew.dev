"use client";

import { m } from "framer-motion";

const springTransition = {
	type: "spring" as const,
	stiffness: 100,
	damping: 20,
	mass: 1,
};

interface Spec {
	label: string;
	value: string;
}

const specs: Spec[] = [
	{ label: "Framework", value: "Electron 40" },
	{ label: "Frontend", value: "React 19 + TypeScript" },
	{ label: "IPC Layer", value: "tRPC + Zod validation" },
	{ label: "Controllers", value: "25 controllers, 201 handlers" },
	{ label: "Test Coverage", value: "80% (4,442 tests)" },
	{ label: "Architecture", value: "Type-safe, sandboxed" },
];

interface PlatformRequirements {
	os: string;
	arch: string;
	disk: string;
	status?: "available" | "coming-soon";
	note?: string;
}

const requirements: Record<string, PlatformRequirements> = {
	macos: {
		os: "macOS 12.0 (Monterey) or later",
		arch: "Apple Silicon or Intel",
		disk: "150 MB",
		status: "available",
	},
	linux: {
		os: "Ubuntu 20.04, Fedora 36, or equivalent",
		arch: "x64",
		disk: "180 MB",
		status: "available",
	},
	windows: {
		os: "Windows 10/11 via WSL2",
		arch: "x64",
		disk: "200 MB",
		status: "coming-soon",
		note: "Native Windows + WSL2 integration in development",
	},
};

export function TechSpecs() {
	return (
		<m.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ ...springTransition, delay: 0.2 }}
			className="space-y-8"
		>
			{/* Tech stack */}
			<div>
				<h3 className="text-mist-white mb-4 font-mono text-sm tracking-wider uppercase">
					Built With
				</h3>
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
					{specs.map((spec) => (
						<div key={spec.label} className="border border-white/10 bg-white/5 px-3 py-2">
							<span className="text-slate-text block font-mono text-[10px] uppercase">
								{spec.label}
							</span>
							<span className="text-mist-white font-mono text-sm">{spec.value}</span>
						</div>
					))}
				</div>
			</div>

			{/* System requirements */}
			<div>
				<h3 className="text-mist-white mb-4 font-mono text-sm tracking-wider uppercase">
					System Requirements
				</h3>
				<div className="grid gap-4 lg:grid-cols-3">
					{Object.entries(requirements).map(([platform, reqs]) => (
						<div
							key={platform}
							className={`border p-4 ${
								reqs.status === "coming-soon" ? "border-white/5 bg-white/[0.02]" : "border-white/10"
							}`}
						>
							<div className="mb-3 flex items-center justify-between">
								<h4
									className={`font-mono text-sm capitalize ${
										reqs.status === "coming-soon" ? "text-slate-text" : "text-cyber-lime"
									}`}
								>
									{platform}
								</h4>
								{reqs.status === "coming-soon" && (
									<span className="border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 font-mono text-[10px] text-amber-400">
										Coming Soon
									</span>
								)}
							</div>
							<ul className="space-y-2 text-xs">
								<li className="flex justify-between gap-2">
									<span className="text-slate-text">OS</span>
									<span
										className={
											reqs.status === "coming-soon"
												? "text-slate-text/70 text-right"
												: "text-mist-white text-right"
										}
									>
										{reqs.os}
									</span>
								</li>
								<li className="flex justify-between gap-2">
									<span className="text-slate-text">Architecture</span>
									<span
										className={
											reqs.status === "coming-soon" ? "text-slate-text/70" : "text-mist-white"
										}
									>
										{reqs.arch}
									</span>
								</li>
								<li className="flex justify-between gap-2">
									<span className="text-slate-text">Disk Space</span>
									<span
										className={
											reqs.status === "coming-soon" ? "text-slate-text/70" : "text-mist-white"
										}
									>
										{reqs.disk}
									</span>
								</li>
							</ul>
							{reqs.note && (
								<p className="text-slate-text/60 mt-3 border-t border-white/5 pt-3 text-[11px] italic">
									{reqs.note}
								</p>
							)}
						</div>
					))}
				</div>
			</div>
		</m.div>
	);
}
