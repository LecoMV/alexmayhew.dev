"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";

export default function TraceForgeError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("[TraceForge]", error);
		Sentry.captureException(error);
	}, [error]);

	return (
		<main className="flex min-h-[60vh] flex-col items-center justify-center px-6">
			<div className="text-center">
				<h1 className="text-burnt-ember mb-4 font-mono text-6xl font-bold">Error</h1>
				<p className="text-mist-white mb-2 font-mono text-xl">TraceForge crashed</p>
				<p className="text-slate-text mb-8 max-w-md">
					The vectorizer encountered an unexpected error. Please try again.
				</p>
				<div className="flex justify-center gap-4">
					<button
						onClick={() => reset()}
						className="group hover:border-cyber-lime relative border border-white/20 px-6 py-3 transition-colors duration-300"
					>
						<span className="group-hover:text-cyber-lime font-mono text-sm tracking-tight transition-colors">
							Try again
						</span>
					</button>
					<Link
						href="/tools"
						className="group hover:border-cyber-lime relative border border-white/20 px-6 py-3 transition-colors duration-300"
					>
						<span className="group-hover:text-cyber-lime font-mono text-sm tracking-tight transition-colors">
							Back to tools
						</span>
					</Link>
				</div>
			</div>
		</main>
	);
}
