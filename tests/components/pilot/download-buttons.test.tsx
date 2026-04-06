import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DownloadButtons } from "@/components/pilot/download-buttons";

vi.mock("@/lib/hooks/use-platform", () => ({
	usePlatform: () => ({ platform: "linux" as const, label: "Download for Linux" }),
	getPlatformDownloadUrl: (platform: string) =>
		"https://github.com/example/releases/download/v0.2.0-alpha.1/" + platform,
}));

describe("DownloadButtons", () => {
	it("renders platform download options", () => {
		render(<DownloadButtons />);
		expect(screen.getByText("macOS")).toBeTruthy();
		expect(screen.getByText("Linux")).toBeTruthy();
		expect(screen.getByText("Windows")).toBeTruthy();
	});

	it("renders version badge", () => {
		render(<DownloadButtons />);
		expect(screen.getByText(/v0\.2\.0/)).toBeTruthy();
	});

	it("renders GitHub link", () => {
		render(<DownloadButtons />);
		expect(screen.getByText(/View on GitHub/)).toBeTruthy();
	});

	it("renders primary download button for detected platform", () => {
		render(<DownloadButtons />);
		expect(screen.getByText("Download for Linux")).toBeTruthy();
	});
});
