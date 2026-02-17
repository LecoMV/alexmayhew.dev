import { type KeyboardEvent } from "react";
import { describe, expect, it, vi } from "vitest";

import { handleTerminalKeyDown } from "@/components/terminal/keyboard-handler";

function createKeyEvent(
	key: string,
	opts: { ctrlKey?: boolean } = {}
): KeyboardEvent<HTMLInputElement> {
	return {
		key,
		ctrlKey: opts.ctrlKey ?? false,
		preventDefault: vi.fn(),
	} as unknown as KeyboardEvent<HTMLInputElement>;
}

function createParams(overrides: Partial<Parameters<typeof handleTerminalKeyDown>[1]> = {}) {
	return {
		input: "",
		commandHistory: [] as string[],
		historyIndex: -1,
		onSubmit: vi.fn(),
		onInputChange: vi.fn(),
		onHistoryIndexChange: vi.fn(),
		onClear: vi.fn(),
		...overrides,
	};
}

describe("handleTerminalKeyDown", () => {
	describe("Enter key", () => {
		it("calls onSubmit when Enter is pressed", () => {
			const params = createParams();
			const e = createKeyEvent("Enter");
			handleTerminalKeyDown(e, params);
			expect(params.onSubmit).toHaveBeenCalledOnce();
		});
	});

	describe("ArrowUp key", () => {
		it("does nothing when command history is empty", () => {
			const params = createParams({ commandHistory: [] });
			const e = createKeyEvent("ArrowUp");
			handleTerminalKeyDown(e, params);
			expect(params.onHistoryIndexChange).not.toHaveBeenCalled();
			expect(params.onInputChange).not.toHaveBeenCalled();
		});

		it("navigates to last command on first press (historyIndex -1)", () => {
			const history = ["ls", "whoami", "help"];
			const params = createParams({ commandHistory: history, historyIndex: -1 });
			const e = createKeyEvent("ArrowUp");
			handleTerminalKeyDown(e, params);
			expect(params.onHistoryIndexChange).toHaveBeenCalledWith(2);
			expect(params.onInputChange).toHaveBeenCalledWith("help");
		});

		it("stays at index 0 when already at the beginning", () => {
			const history = ["ls", "whoami"];
			const params = createParams({ commandHistory: history, historyIndex: 0 });
			const e = createKeyEvent("ArrowUp");
			handleTerminalKeyDown(e, params);
			expect(params.onHistoryIndexChange).toHaveBeenCalledWith(0);
			expect(params.onInputChange).toHaveBeenCalledWith("ls");
		});

		it("decrements index when mid-history", () => {
			const history = ["a", "b", "c", "d", "e"];
			const params = createParams({ commandHistory: history, historyIndex: 2 });
			const e = createKeyEvent("ArrowUp");
			handleTerminalKeyDown(e, params);
			expect(params.onHistoryIndexChange).toHaveBeenCalledWith(1);
			expect(params.onInputChange).toHaveBeenCalledWith("b");
		});

		it("calls preventDefault", () => {
			const params = createParams({ commandHistory: ["ls"] });
			const e = createKeyEvent("ArrowUp");
			handleTerminalKeyDown(e, params);
			expect(e.preventDefault).toHaveBeenCalled();
		});
	});

	describe("ArrowDown key", () => {
		it("does nothing when historyIndex is -1", () => {
			const params = createParams({ historyIndex: -1 });
			const e = createKeyEvent("ArrowDown");
			handleTerminalKeyDown(e, params);
			expect(params.onHistoryIndexChange).not.toHaveBeenCalled();
			expect(params.onInputChange).not.toHaveBeenCalled();
		});

		it("advances index when mid-history", () => {
			const history = ["ls", "whoami", "help"];
			const params = createParams({ commandHistory: history, historyIndex: 0 });
			const e = createKeyEvent("ArrowDown");
			handleTerminalKeyDown(e, params);
			expect(params.onHistoryIndexChange).toHaveBeenCalledWith(1);
			expect(params.onInputChange).toHaveBeenCalledWith("whoami");
		});

		it("resets to -1 and clears input at end of history", () => {
			const history = ["ls", "whoami"];
			const params = createParams({ commandHistory: history, historyIndex: 1 });
			const e = createKeyEvent("ArrowDown");
			handleTerminalKeyDown(e, params);
			expect(params.onHistoryIndexChange).toHaveBeenCalledWith(-1);
			expect(params.onInputChange).toHaveBeenCalledWith("");
		});
	});

	describe("Tab key", () => {
		it("completes a single matching command", () => {
			const params = createParams({ input: "he" });
			const e = createKeyEvent("Tab");
			handleTerminalKeyDown(e, params);
			expect(params.onInputChange).toHaveBeenCalledWith("help");
		});

		it("does not complete when multiple commands match", () => {
			const params = createParams({ input: "c" });
			const e = createKeyEvent("Tab");
			handleTerminalKeyDown(e, params);
			expect(params.onInputChange).not.toHaveBeenCalled();
		});

		it("does not complete when no commands match", () => {
			const params = createParams({ input: "xyz" });
			const e = createKeyEvent("Tab");
			handleTerminalKeyDown(e, params);
			expect(params.onInputChange).not.toHaveBeenCalled();
		});

		it("completes case-insensitively", () => {
			const params = createParams({ input: "HE" });
			const e = createKeyEvent("Tab");
			handleTerminalKeyDown(e, params);
			expect(params.onInputChange).toHaveBeenCalledWith("help");
		});

		it("calls preventDefault", () => {
			const params = createParams({ input: "he" });
			const e = createKeyEvent("Tab");
			handleTerminalKeyDown(e, params);
			expect(e.preventDefault).toHaveBeenCalled();
		});
	});

	describe("Ctrl+L", () => {
		it("calls onClear and preventDefault", () => {
			const params = createParams();
			const e = createKeyEvent("l", { ctrlKey: true });
			handleTerminalKeyDown(e, params);
			expect(params.onClear).toHaveBeenCalledOnce();
			expect(e.preventDefault).toHaveBeenCalled();
		});
	});

	describe("Regular keys", () => {
		it("does not trigger any handler for a regular key", () => {
			const params = createParams();
			const e = createKeyEvent("a");
			handleTerminalKeyDown(e, params);
			expect(params.onSubmit).not.toHaveBeenCalled();
			expect(params.onInputChange).not.toHaveBeenCalled();
			expect(params.onHistoryIndexChange).not.toHaveBeenCalled();
			expect(params.onClear).not.toHaveBeenCalled();
		});
	});
});
