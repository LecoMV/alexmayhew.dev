import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ChatWidget } from "@/components/chat/chat-widget";

beforeEach(() => {
	global.fetch = vi.fn(() =>
		Promise.resolve({
			ok: true,
			json: () => Promise.resolve({ message: "ok" }),
		})
	) as unknown as typeof fetch;
});

describe("ChatWidget a11y", () => {
	it("renders a dialog with aria-modal and aria-labelledby once open", () => {
		render(<ChatWidget />);
		fireEvent.click(screen.getByLabelText("Open chat"));

		const dialog = screen.getByRole("dialog");
		expect(dialog.getAttribute("aria-modal")).toBe("true");
		const labelledBy = dialog.getAttribute("aria-labelledby");
		expect(labelledBy).toBeTruthy();
		expect(document.getElementById(labelledBy!)).toBeTruthy();
	});

	it("has an aria-live polite region for new messages", () => {
		render(<ChatWidget />);
		fireEvent.click(screen.getByLabelText("Open chat"));
		const live = document.querySelector('[aria-live="polite"]');
		expect(live).toBeTruthy();
	});

	it("has a visible close button inside the dialog", () => {
		render(<ChatWidget />);
		fireEvent.click(screen.getByLabelText("Open chat"));

		const dialog = screen.getByRole("dialog");
		const closeInDialog = dialog.querySelector('[aria-label="Close chat"]');
		expect(closeInDialog).toBeTruthy();
	});

	it("provides a visible or sr-only label for the chat input", () => {
		render(<ChatWidget />);
		fireEvent.click(screen.getByLabelText("Open chat"));

		const input = screen.getByLabelText(/your message|chat message/i);
		expect((input as HTMLInputElement).tagName).toBe("INPUT");
	});

	it("closes the widget when Escape is pressed", async () => {
		render(<ChatWidget />);
		fireEvent.click(screen.getByLabelText("Open chat"));
		expect(screen.getByRole("dialog")).toBeTruthy();

		fireEvent.keyDown(document, { key: "Escape" });

		await waitFor(
			() => {
				expect(screen.queryByRole("dialog")).toBeNull();
			},
			{ timeout: 500 }
		);
	}, 2000);
});
