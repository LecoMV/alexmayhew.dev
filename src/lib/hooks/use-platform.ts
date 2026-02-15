"use client";

import { useEffect, useState } from "react";

export type Platform = "macos" | "windows" | "linux" | "unknown";

export interface PlatformInfo {
	platform: Platform;
	arch: "arm64" | "x64" | "unknown";
	label: string;
}

export function usePlatform(): PlatformInfo {
	const [info, setInfo] = useState<PlatformInfo>({
		platform: "unknown",
		arch: "unknown",
		label: "Download",
	});

	useEffect(() => {
		const userAgent = navigator.userAgent.toLowerCase();
		const platform = navigator.platform?.toLowerCase() || "";

		let detectedPlatform: Platform = "unknown";
		let arch: "arm64" | "x64" | "unknown" = "unknown";
		let label = "Download";

		// Detect platform
		if (userAgent.includes("mac") || platform.includes("mac")) {
			detectedPlatform = "macos";
			// Check for Apple Silicon
			if (userAgent.includes("arm") || platform.includes("arm")) {
				arch = "arm64";
				label = "Download for macOS (Apple Silicon)";
			} else {
				arch = "x64";
				label = "Download for macOS (Intel)";
			}
		} else if (userAgent.includes("win") || platform.includes("win")) {
			detectedPlatform = "windows";
			arch = "x64"; // Assume x64 for Windows
			label = "Download for Windows";
		} else if (userAgent.includes("linux") || platform.includes("linux")) {
			detectedPlatform = "linux";
			arch = "x64";
			label = "Download for Linux";
		}

		setInfo({ platform: detectedPlatform, arch, label });
	}, []);

	return info;
}

export function getPlatformDownloadUrl(
	platform: Platform,
	version: string = "0.2.0-alpha.1"
): string {
	const baseUrl = `https://github.com/alexmayhew/claude-pilot/releases/download/v${version}`;

	switch (platform) {
		case "macos":
			return `${baseUrl}/Claude-Pilot-${version}.dmg`;
		case "windows":
			return `${baseUrl}/Claude-Pilot-Setup-${version}.exe`;
		case "linux":
			return `${baseUrl}/Claude-Pilot-${version}.AppImage`;
		default:
			return `https://github.com/alexmayhew/claude-pilot/releases/latest`;
	}
}
