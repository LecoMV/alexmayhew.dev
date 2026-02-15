"use client";

import { WifiOff } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
	return (
		<main className="flex min-h-[60vh] flex-col items-center justify-center px-6">
			<div className="text-center">
				<WifiOff className="text-cyber-lime mx-auto mb-6 h-16 w-16" strokeWidth={1} />
				<h1 className="mb-4 font-mono text-4xl font-bold">CONNECTION_LOST</h1>
				<p className="text-slate-text mb-2 text-xl">You appear to be offline</p>
				<p className="text-slate-text mb-8 max-w-md">
					Please check your internet connection and try again. Some pages may still be available
					from cache.
				</p>
				<div className="flex justify-center gap-4">
					<button
						onClick={() => window.location.reload()}
						className="group hover:border-cyber-lime relative border border-white/20 px-6 py-3 transition-colors duration-300"
					>
						<span className="group-hover:text-cyber-lime font-mono text-sm tracking-tight transition-colors">
							RETRY_CONNECTION()
						</span>
					</button>
					<Link
						href="/"
						className="group hover:border-cyber-lime relative border border-white/20 px-6 py-3 transition-colors duration-300"
					>
						<span className="group-hover:text-cyber-lime font-mono text-sm tracking-tight transition-colors">
							HOME
						</span>
					</Link>
				</div>
			</div>
		</main>
	);
}
