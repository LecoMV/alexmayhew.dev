import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LazyChatWidget } from "@/components/chat/lazy-chat-widget";

beforeEach(() => {
	global.fetch = vi.fn(() =>
		Promise.resolve({
			ok: true,
			json: () => Promise.resolve({ message: "ok" }),
		})
	) as unknown as typeof fetch;
	// JSDOM does not implement scrollIntoView; ChatWidget calls it once the
	// dialog is open (which happens immediately when autoOpen=true).
	if (!HTMLElement.prototype.scrollIntoView) {
		HTMLElement.prototype.scrollIntoView = vi.fn();
	}
});

describe("LazyChatWidget", () => {
	it("renders only a trigger button before interaction (no dialog mounted)", () => {
		render(<LazyChatWidget />);
		expect(screen.getByTestId("lazy-chat-trigger")).toBeTruthy();
		expect(screen.queryByRole("dialog")).toBeNull();
	});

	it("trigger button carries Open chat aria-label to match full widget closed state", () => {
		render(<LazyChatWidget />);
		const trigger = screen.getByTestId("lazy-chat-trigger");
		expect(trigger.getAttribute("aria-label")).toBe("Open chat");
	});

	it("mounts the full ChatWidget in the open state after trigger click", async () => {
		render(<LazyChatWidget />);
		fireEvent.click(screen.getByTestId("lazy-chat-trigger"));

		await waitFor(
			() => {
				expect(screen.getByRole("dialog")).toBeTruthy();
			},
			{ timeout: 2000 }
		);
	});

	it("loads the widget when a toggle-chat CustomEvent is dispatched", async () => {
		render(<LazyChatWidget />);
		expect(screen.queryByRole("dialog")).toBeNull();

		window.dispatchEvent(new CustomEvent("toggle-chat"));

		await waitFor(
			() => {
				expect(screen.getByRole("dialog")).toBeTruthy();
			},
			{ timeout: 2000 }
		);
	});
});
