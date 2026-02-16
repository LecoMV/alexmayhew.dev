"use client";

import { useCallback, useEffect, useState } from "react";

export interface SystemStatusData {
	api: { online: boolean; version?: string };
	gpu: { available: boolean; enabled?: boolean; name?: string | null };
	potrace: { available: boolean };
	vtracer: { available: boolean };
	worker: { online: boolean };
}

export function resolveApiUrl(apiUrl?: string): string {
	if (apiUrl) return apiUrl;
	if (typeof window !== "undefined") {
		const { hostname } = window.location;
		if (hostname === "localhost" || hostname === "127.0.0.1") {
			return "http://localhost:8000";
		}
	}
	return "https://api.alexmayhew.dev";
}

export function useSystemStatus(apiUrl?: string, onStatusChange?: (online: boolean) => void) {
	const [status, setStatus] = useState<SystemStatusData | null>(null);
	const [isChecking, setIsChecking] = useState(true);
	const [lastChecked, setLastChecked] = useState<Date | null>(null);

	const url = resolveApiUrl(apiUrl);

	const checkStatus = useCallback(async () => {
		setIsChecking(true);
		try {
			const response = await fetch(`${url}/system-status`, {
				method: "GET",
				signal: AbortSignal.timeout(3000),
			});

			if (response.ok) {
				const data: SystemStatusData = await response.json();
				setStatus(data);
				onStatusChange?.(data.api.online && data.worker.online);
			} else {
				onStatusChange?.(false);
			}
		} catch {
			onStatusChange?.(false);
		} finally {
			setIsChecking(false);
			setLastChecked(new Date());
		}
	}, [url, onStatusChange]);

	useEffect(() => {
		checkStatus();
		const interval = setInterval(checkStatus, 30000);
		return () => clearInterval(interval);
	}, [checkStatus]);

	const isOnline = Boolean(status?.api.online && status?.worker.online);

	return { status, isChecking, lastChecked, isOnline, checkStatus, url };
}
