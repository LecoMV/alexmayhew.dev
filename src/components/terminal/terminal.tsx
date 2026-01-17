"use client";

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Square, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { executeCommand, type CommandResult } from "./commands";

interface HistoryEntry {
	id: number;
	command: string;
	output: string | React.ReactNode;
	isError?: boolean;
}

interface TerminalProps {
	className?: string;
	initialMinimized?: boolean;
	onClose?: () => void;
	onMinimize?: () => void;
}

const springTransition = {
	type: "spring" as const,
	stiffness: 300,
	damping: 25,
};

const WELCOME_MESSAGE = `Last login: ${new Date().toDateString()}
Type 'help' to see available commands.
`;

export function Terminal({
	className = "",
	initialMinimized = false,
	onClose,
	onMinimize,
}: TerminalProps) {
	const router = useRouter();
	const [input, setInput] = useState("");
	const [history, setHistory] = useState<HistoryEntry[]>([
		{ id: 0, command: "", output: WELCOME_MESSAGE },
	]);
	const [commandHistory, setCommandHistory] = useState<string[]>([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const [currentPath, setCurrentPath] = useState("/");
	const [isMinimized, setIsMinimized] = useState(initialMinimized);
	const [isFocused, setIsFocused] = useState(false);

	const inputRef = useRef<HTMLInputElement>(null);
	const terminalRef = useRef<HTMLDivElement>(null);
	const outputRef = useRef<HTMLDivElement>(null);

	// Auto-scroll to bottom
	useEffect(() => {
		if (outputRef.current) {
			outputRef.current.scrollTop = outputRef.current.scrollHeight;
		}
	}, [history]);

	// Focus input on terminal click
	const focusInput = useCallback(() => {
		inputRef.current?.focus();
		setIsFocused(true);
	}, []);

	// Handle command execution
	const handleSubmit = useCallback(() => {
		if (!input.trim()) {
			setHistory((prev) => [...prev, { id: Date.now(), command: "", output: "" }]);
			return;
		}

		const result: CommandResult = executeCommand(input, {
			currentPath,
			setCurrentPath,
			addOutput: (res) => {
				setHistory((prev) => [
					...prev,
					{ id: Date.now(), command: "", output: res.output, isError: res.isError },
				]);
			},
		});

		// Handle clear command
		if (result.shouldClear) {
			setHistory([{ id: Date.now(), command: "", output: WELCOME_MESSAGE }]);
		} else {
			setHistory((prev) => [
				...prev,
				{ id: Date.now(), command: input, output: result.output, isError: result.isError },
			]);
		}

		// Handle navigation
		if (result.redirect) {
			setTimeout(() => {
				router.push(result.redirect!);
			}, 500);
		}

		// Update command history
		setCommandHistory((prev) => [...prev, input]);
		setHistoryIndex(-1);
		setInput("");
	}, [input, currentPath, router]);

	// Handle keyboard navigation
	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter") {
				handleSubmit();
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				if (commandHistory.length > 0) {
					const newIndex =
						historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
					setHistoryIndex(newIndex);
					setInput(commandHistory[newIndex]);
				}
			} else if (e.key === "ArrowDown") {
				e.preventDefault();
				if (historyIndex !== -1) {
					const newIndex = historyIndex + 1;
					if (newIndex >= commandHistory.length) {
						setHistoryIndex(-1);
						setInput("");
					} else {
						setHistoryIndex(newIndex);
						setInput(commandHistory[newIndex]);
					}
				}
			} else if (e.key === "Tab") {
				e.preventDefault();
				// Basic tab completion
				const cmds = [
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
				];
				const matches = cmds.filter((c) => c.startsWith(input.toLowerCase()));
				if (matches.length === 1) {
					setInput(matches[0]);
				}
			} else if (e.ctrlKey && e.key === "l") {
				e.preventDefault();
				setHistory([{ id: Date.now(), command: "", output: WELCOME_MESSAGE }]);
			}
		},
		[handleSubmit, commandHistory, historyIndex, input]
	);

	const handleMinimize = () => {
		setIsMinimized(true);
		onMinimize?.();
	};

	const handleRestore = () => {
		setIsMinimized(false);
		focusInput();
	};

	const handleClose = () => {
		onClose?.();
	};

	// Minimized state
	if (isMinimized) {
		return (
			<motion.button
				onClick={handleRestore}
				className="bg-gunmetal-glass/90 hover:border-cyber-lime fixed right-6 bottom-6 z-50 flex items-center gap-2 border border-white/20 px-4 py-2 font-mono text-xs backdrop-blur-sm transition-colors"
				initial={{ y: 100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				exit={{ y: 100, opacity: 0 }}
				transition={springTransition}
			>
				<span className="text-cyber-lime animate-pulse">●</span>
				ALEX_OS Terminal
			</motion.button>
		);
	}

	return (
		<motion.div
			ref={terminalRef}
			className={`bg-void-navy/95 flex w-full max-w-3xl flex-col overflow-hidden border border-white/20 shadow-2xl backdrop-blur-md ${className}`}
			initial={{ opacity: 0, y: 20, scale: 0.95 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, y: 20, scale: 0.95 }}
			transition={springTransition}
			onClick={focusInput}
		>
			{/* Window Title Bar */}
			<div className="bg-gunmetal-glass/50 flex items-center justify-between border-b border-white/10 px-4 py-2">
				<div className="flex items-center gap-3">
					<span className="text-cyber-lime animate-pulse text-xs">●</span>
					<span className="text-mist-white font-mono text-xs tracking-wider">
						ALEX_OS v1.0.0 — bash
					</span>
				</div>
				<div className="flex items-center gap-1">
					<button
						onClick={(e) => {
							e.stopPropagation();
							handleMinimize();
						}}
						className="text-slate-text hover:text-mist-white p-1.5 transition-colors"
						aria-label="Minimize terminal"
					>
						<Minus className="h-3 w-3" strokeWidth={1.5} />
					</button>
					<button
						onClick={(e) => e.stopPropagation()}
						className="text-slate-text hover:text-mist-white p-1.5 transition-colors"
						aria-label="Maximize terminal"
					>
						<Square className="h-3 w-3" strokeWidth={1.5} />
					</button>
					{onClose && (
						<button
							onClick={(e) => {
								e.stopPropagation();
								handleClose();
							}}
							className="text-slate-text hover:text-burnt-ember p-1.5 transition-colors"
							aria-label="Close terminal"
						>
							<X className="h-3 w-3" strokeWidth={1.5} />
						</button>
					)}
				</div>
			</div>

			{/* Terminal Output */}
			<div
				ref={outputRef}
				className="h-80 overflow-y-auto p-4 font-mono text-sm"
				style={{
					scrollbarWidth: "thin",
					scrollbarColor: "var(--color-gunmetal-glass) var(--color-void-navy)",
				}}
			>
				<AnimatePresence>
					{history.map((entry) => (
						<motion.div
							key={entry.id}
							initial={{ opacity: 0, y: 5 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.15 }}
							className="mb-2"
						>
							{entry.command && (
								<div className="flex items-start gap-2">
									<span className="text-cyber-lime">visitor@alexmayhew.dev</span>
									<span className="text-slate-text">:</span>
									<span className="text-blue-400">{currentPath}</span>
									<span className="text-slate-text">$</span>
									<span className="text-mist-white">{entry.command}</span>
								</div>
							)}
							{entry.output && (
								<pre
									className={`mt-1 whitespace-pre-wrap ${
										entry.isError ? "text-burnt-ember" : "text-slate-text"
									}`}
								>
									{entry.output}
								</pre>
							)}
						</motion.div>
					))}
				</AnimatePresence>

				{/* Current Input Line */}
				<div className="flex items-start gap-2">
					<span className="text-cyber-lime">visitor@alexmayhew.dev</span>
					<span className="text-slate-text">:</span>
					<span className="text-blue-400">{currentPath}</span>
					<span className="text-slate-text">$</span>
					<div className="relative flex-1">
						<input
							ref={inputRef}
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={handleKeyDown}
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
							className="text-mist-white w-full bg-transparent outline-none"
							autoFocus
							spellCheck={false}
							autoComplete="off"
							autoCapitalize="off"
							aria-label="Terminal input"
						/>
						{/* Blinking cursor */}
						{isFocused && (
							<motion.span
								className="bg-cyber-lime absolute -bottom-0.5 h-4 w-2"
								style={{ left: `${input.length * 0.6}em` }}
								animate={{ opacity: [1, 0] }}
								transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
							/>
						)}
					</div>
				</div>
			</div>

			{/* Status Bar */}
			<div className="bg-gunmetal-glass/30 flex items-center justify-between border-t border-white/10 px-4 py-1.5">
				<span className="text-slate-text font-mono text-xs">
					↑↓ History | Tab Complete | Ctrl+L Clear
				</span>
				<span className="text-cyber-lime font-mono text-xs">● Ready</span>
			</div>
		</motion.div>
	);
}

export default Terminal;
