"use client";

import { useEffect, useState } from "react";

export function LocalTime() {
	const [time, setTime] = useState<string | null>(null);

	useEffect(() => {
		// Set initial time
		const updateTime = () => {
			setTime(
				new Date().toLocaleTimeString("en-US", {
					hour: "2-digit",
					minute: "2-digit",
					hour12: false,
				})
			);
		};

		updateTime();

		// Update every minute
		const interval = setInterval(updateTime, 60000);

		return () => clearInterval(interval);
	}, []);

	// SSR: render nothing, hydrate with actual time
	if (!time) return null;

	return (
		<span className="text-slate-text font-mono text-xs">
			<span className="opacity-50">Local:</span> {time}
		</span>
	);
}
