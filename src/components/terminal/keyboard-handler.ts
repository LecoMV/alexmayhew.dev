import { type KeyboardEvent } from "react";

const TAB_COMPLETABLE_COMMANDS = [
	"help",
	"whoami",
	"ls",
	"cat",
	"cd",
	"skills",
	"contact",
	"clear",
	"theme",
	"neofetch",
	"sudo",
] as const;

interface KeyboardHandlerParams {
	input: string;
	commandHistory: string[];
	historyIndex: number;
	onSubmit: () => void;
	onInputChange: (value: string) => void;
	onHistoryIndexChange: (index: number) => void;
	onClear: () => void;
}

export function handleTerminalKeyDown(
	e: KeyboardEvent<HTMLInputElement>,
	params: KeyboardHandlerParams
) {
	const {
		input,
		commandHistory,
		historyIndex,
		onSubmit,
		onInputChange,
		onHistoryIndexChange,
		onClear,
	} = params;

	switch (e.key) {
		case "Enter":
			onSubmit();
			break;

		case "ArrowUp": {
			e.preventDefault();
			if (commandHistory.length === 0) break;
			const upIndex =
				historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
			onHistoryIndexChange(upIndex);
			onInputChange(commandHistory[upIndex]);
			break;
		}

		case "ArrowDown": {
			e.preventDefault();
			if (historyIndex === -1) break;
			const downIndex = historyIndex + 1;
			if (downIndex >= commandHistory.length) {
				onHistoryIndexChange(-1);
				onInputChange("");
			} else {
				onHistoryIndexChange(downIndex);
				onInputChange(commandHistory[downIndex]);
			}
			break;
		}

		case "Tab": {
			e.preventDefault();
			const matches = TAB_COMPLETABLE_COMMANDS.filter((c) => c.startsWith(input.toLowerCase()));
			if (matches.length === 1) onInputChange(matches[0]);
			break;
		}

		default:
			if (e.ctrlKey && e.key === "l") {
				e.preventDefault();
				onClear();
			}
			break;
	}
}
