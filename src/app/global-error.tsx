"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Global error:", error);
		Sentry.captureException(error);
	}, [error]);
	return (
		<html lang="en">
			<body className="bg-void-navy min-h-dvh">
				<main className="flex min-h-dvh flex-col items-center justify-center px-6">
					<div className="text-center">
						<h1 className="text-burnt-ember mb-4 font-mono text-6xl font-bold">500</h1>
						<p className="text-mist-white mb-2 font-mono text-xl">Internal Server Error</p>
						<p className="text-slate-text mb-8 max-w-md">
							Something went wrong on our end. Please try again later.
						</p>
						<button
							onClick={() => reset()}
							className="hover:border-cyber-lime border border-white/20 px-6 py-3 transition-colors duration-300"
						>
							<span className="text-mist-white hover:text-cyber-lime font-mono text-sm tracking-tight">
								Try again
							</span>
						</button>
					</div>
				</main>
			</body>
		</html>
	);
}
