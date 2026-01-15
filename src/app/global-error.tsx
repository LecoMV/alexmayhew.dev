"use client";

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
	}, [error]);
	return (
		<html lang="en">
			<body className="bg-void-navy min-h-screen">
				<main className="flex min-h-screen flex-col items-center justify-center px-6">
					<div className="text-center">
						<h1 className="text-burnt-ember mb-4 font-mono text-6xl font-bold">500</h1>
						<p className="text-mist-white mb-2 font-mono text-xl">Internal Server Error</p>
						<p className="text-slate-text mb-8 max-w-md">
							Something went wrong on our end. Please try again later.
						</p>
						<button
							onClick={() => reset()}
							className="border border-white/20 px-6 py-3 transition-colors duration-300 hover:border-[#ccf381]"
						>
							<span className="font-mono text-sm tracking-tight text-[#e2e8f0] hover:text-[#ccf381]">
								Try again
							</span>
						</button>
					</div>
				</main>
			</body>
		</html>
	);
}
