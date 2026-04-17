import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { getPlatformDownloadUrl, usePlatform } from "@/lib/hooks/use-platform";

describe("usePlatform", () => {
	const originalNavigator = window.navigator;

	function mockNavigator(userAgent: string, platform: string) {
		Object.defineProperty(window, "navigator", {
			value: { userAgent, platform },
			writable: true,
			configurable: true,
		});
	}

	afterEach(() => {
		Object.defineProperty(window, "navigator", {
			value: originalNavigator,
			writable: true,
			configurable: true,
		});
	});

	it("returns unknown platform and 'Download' label before useEffect fires", () => {
		// renderHook returns the initial state before useEffect runs in the same tick
		// but with jsdom, useEffect fires synchronously during renderHook
		// so we test the final state
		mockNavigator("", "");
		const { result } = renderHook(() => usePlatform());
		expect(result.current.platform).toBe("unknown");
		expect(result.current.label).toBe("Download");
	});

	describe("macOS detection", () => {
		it("detects macOS with Intel architecture from userAgent", () => {
			mockNavigator("mozilla/5.0 (macintosh; intel mac os x 10_15_7)", "MacIntel");
			const { result } = renderHook(() => usePlatform());

			expect(result.current.platform).toBe("macos");
			expect(result.current.arch).toBe("x64");
			expect(result.current.label).toBe("Download for macOS (Intel)");
		});

		it("detects macOS with Apple Silicon from userAgent containing 'arm'", () => {
			mockNavigator("mozilla/5.0 (macintosh; arm mac os x)", "MacArm");
			const { result } = renderHook(() => usePlatform());

			expect(result.current.platform).toBe("macos");
			expect(result.current.arch).toBe("arm64");
			expect(result.current.label).toBe("Download for macOS (Apple Silicon)");
		});

		it("detects macOS from platform string when userAgent lacks 'mac'", () => {
			mockNavigator("generic browser", "MacIntel");
			const { result } = renderHook(() => usePlatform());

			expect(result.current.platform).toBe("macos");
		});
	});

	describe("Windows detection", () => {
		it("detects Windows from userAgent", () => {
			mockNavigator("mozilla/5.0 (windows nt 10.0; win64; x64) applewebkit/537.36", "Win32");
			const { result } = renderHook(() => usePlatform());

			expect(result.current.platform).toBe("windows");
			expect(result.current.arch).toBe("x64");
			expect(result.current.label).toBe("Download for Windows");
		});

		it("detects Windows from platform string", () => {
			mockNavigator("generic browser", "Win32");
			const { result } = renderHook(() => usePlatform());

			expect(result.current.platform).toBe("windows");
		});
	});

	describe("Linux detection", () => {
		it("detects Linux from userAgent", () => {
			mockNavigator("mozilla/5.0 (x11; linux x86_64) applewebkit/537.36", "Linux x86_64");
			const { result } = renderHook(() => usePlatform());

			expect(result.current.platform).toBe("linux");
			expect(result.current.arch).toBe("x64");
			expect(result.current.label).toBe("Download for Linux");
		});

		it("detects Linux from platform string", () => {
			mockNavigator("generic browser", "Linux x86_64");
			const { result } = renderHook(() => usePlatform());

			expect(result.current.platform).toBe("linux");
		});
	});

	describe("unknown platform", () => {
		it("returns unknown when no platform matches", () => {
			mockNavigator("some unknown browser", "");
			const { result } = renderHook(() => usePlatform());

			expect(result.current.platform).toBe("unknown");
			expect(result.current.arch).toBe("unknown");
			expect(result.current.label).toBe("Download");
		});

		it("handles undefined navigator.platform gracefully", () => {
			Object.defineProperty(window, "navigator", {
				value: { userAgent: "some browser", platform: undefined },
				writable: true,
				configurable: true,
			});
			const { result } = renderHook(() => usePlatform());

			expect(result.current.platform).toBe("unknown");
		});
	});
});

describe("getPlatformDownloadUrl", () => {
	it("returns macOS .dmg URL", () => {
		const url = getPlatformDownloadUrl("macos", "1.0.0");
		expect(url).toBe(
			"https://github.com/alexmayhew/claude-pilot/releases/download/v1.0.0/Claude-Pilot-1.0.0.dmg"
		);
	});

	it("returns Windows .exe URL", () => {
		const url = getPlatformDownloadUrl("windows", "1.0.0");
		expect(url).toBe(
			"https://github.com/alexmayhew/claude-pilot/releases/download/v1.0.0/Claude-Pilot-Setup-1.0.0.exe"
		);
	});

	it("returns Linux .AppImage URL", () => {
		const url = getPlatformDownloadUrl("linux", "1.0.0");
		expect(url).toBe(
			"https://github.com/alexmayhew/claude-pilot/releases/download/v1.0.0/Claude-Pilot-1.0.0.AppImage"
		);
	});

	it("returns latest releases URL for unknown platform", () => {
		const url = getPlatformDownloadUrl("unknown");
		expect(url).toBe("https://github.com/alexmayhew/claude-pilot/releases/latest");
	});

	it("uses default version when not specified", () => {
		const url = getPlatformDownloadUrl("macos");
		expect(url).toContain("0.2.0-alpha.1");
	});
});
