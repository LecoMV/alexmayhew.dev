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

const requirements = {
	macos: {
		os: "macOS 12.0 (Monterey) or later",
		arch: "Apple Silicon or Intel",
		disk: "150 MB",
	},
	windows: {
		os: "Windows 10 (64-bit) or later",
		arch: "x64",
		disk: "200 MB",
	},
	linux: {
		os: "Ubuntu 20.04, Fedora 36, or equivalent",
		arch: "x64",
		disk: "180 MB",
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
						<div key={platform} className="border border-white/10 p-4">
							<h4 className="text-cyber-lime mb-3 font-mono text-sm capitalize">{platform}</h4>
							<ul className="space-y-2 text-xs">
								<li className="flex justify-between gap-2">
									<span className="text-slate-text">OS</span>
									<span className="text-mist-white text-right">{reqs.os}</span>
								</li>
								<li className="flex justify-between gap-2">
									<span className="text-slate-text">Architecture</span>
									<span className="text-mist-white">{reqs.arch}</span>
								</li>
								<li className="flex justify-between gap-2">
									<span className="text-slate-text">Disk Space</span>
									<span className="text-mist-white">{reqs.disk}</span>
								</li>
							</ul>
						</div>
					))}
				</div>
			</div>
		</m.div>
	);
}
