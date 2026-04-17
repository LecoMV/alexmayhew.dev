"use client";

import { AnimatePresence, m } from "framer-motion";
import { Bot, Loader2, MessageSquare, Send, User, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { trackEvent } from "@/components/analytics/google-analytics";
import { microSpring, snappySpringTransition as springTransition } from "@/lib/motion-constants";
import { cn } from "@/lib/utils";

import { ChatMarkdown } from "./chat-markdown";

interface Message {
	id: string;
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
}

interface ChatApiResponse {
	message?: string;
	model?: string;
	error?: string;
}

interface ChatWidgetProps {
	/**
	 * When true, the widget opens as soon as it mounts. Used by the lazy
	 * wrapper so that the click that triggered the dynamic import also opens
	 * the widget (rather than requiring a second click after load).
	 */
	autoOpen?: boolean;
}

export function ChatWidget({ autoOpen = false }: ChatWidgetProps = {}) {
	const [isOpen, setIsOpen] = useState(autoOpen);
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "welcome",
			role: "assistant",
			content:
				"Hey! I'm Alex's AI assistant. Ask me about his work, tech stack, or how to get in touch.",
			timestamp: new Date(),
		},
	]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const dialogRef = useRef<HTMLDivElement>(null);
	const toggleButtonRef = useRef<HTMLButtonElement>(null);

	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [messages, scrollToBottom]);

	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isOpen]);

	// Fire funnel events on open/close transitions rather than in the click
	// handler, so the lazy-mount autoOpen case also gets tracked.
	const hasTrackedOpenRef = useRef(false);
	useEffect(() => {
		if (isOpen && !hasTrackedOpenRef.current) {
			hasTrackedOpenRef.current = true;
			trackEvent("chat_widget_opened");
		} else if (!isOpen && hasTrackedOpenRef.current) {
			hasTrackedOpenRef.current = false;
			trackEvent("chat_widget_closed");
		}
	}, [isOpen]);

	// Escape key closes the widget, focus trap keeps Tab inside the dialog
	useEffect(() => {
		if (!isOpen) return;

		const handleGlobalKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				e.preventDefault();
				setIsOpen(false);
				toggleButtonRef.current?.focus();
				return;
			}
			if (e.key !== "Tab" || !dialogRef.current) return;

			const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
				'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
			);
			if (focusable.length === 0) return;
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			const active = document.activeElement as HTMLElement | null;

			if (e.shiftKey && active === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && active === last) {
				e.preventDefault();
				first.focus();
			}
		};

		document.addEventListener("keydown", handleGlobalKeyDown);
		return () => document.removeEventListener("keydown", handleGlobalKeyDown);
	}, [isOpen]);

	const sendMessage = async () => {
		if (!input.trim() || isLoading) return;

		const trimmed = input.trim();
		const userMessage: Message = {
			id: `user-${Date.now()}`,
			role: "user",
			content: trimmed,
			timestamp: new Date(),
		};

		// history_length reflects conversation turns before THIS message, so
		// funnel analysis can correlate drop-off with depth.
		trackEvent("chat_message_sent", {
			char_count: trimmed.length,
			history_length: messages.filter((m) => m.id !== "welcome").length,
		});

		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsLoading(true);

		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				signal: AbortSignal.timeout(15_000),
				body: JSON.stringify({
					messages: [...messages, userMessage]
						.filter((m) => m.id !== "welcome")
						.map((m) => ({
							role: m.role,
							content: m.content,
						})),
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to get response");
			}

			const data = (await response.json()) as ChatApiResponse;

			const assistantMessage: Message = {
				id: `assistant-${Date.now()}`,
				role: "assistant",
				content: data.message ?? "Sorry, I couldn't process that request.",
				timestamp: new Date(),
			};

			trackEvent("chat_response_received", {
				char_count: assistantMessage.content.length,
				model: data.model ?? "unknown",
			});

			setMessages((prev) => [...prev, assistantMessage]);
		} catch {
			const errorMessage: Message = {
				id: `error-${Date.now()}`,
				role: "assistant",
				content: "Connection error. Please try again or use the contact form.",
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	return (
		<>
			{/* Chat Toggle Button */}
			<m.button
				onClick={() => setIsOpen(!isOpen)}
				className={cn(
					"fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center border transition-colors duration-300",
					isOpen
						? "border-cyber-lime bg-cyber-lime/10"
						: "bg-gunmetal-glass/80 hover:border-cyber-lime border-white/20 backdrop-blur-md"
				)}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				transition={springTransition}
				aria-label={isOpen ? "Close chat" : "Open chat"}
			>
				<AnimatePresence mode="wait">
					{isOpen ? (
						<m.div
							key="close"
							initial={{ rotate: -90, opacity: 0 }}
							animate={{ rotate: 0, opacity: 1 }}
							exit={{ rotate: 90, opacity: 0 }}
							transition={microSpring}
						>
							<X className="text-cyber-lime h-6 w-6" strokeWidth={1.5} />
						</m.div>
					) : (
						<m.div
							key="open"
							initial={{ rotate: 90, opacity: 0 }}
							animate={{ rotate: 0, opacity: 1 }}
							exit={{ rotate: -90, opacity: 0 }}
							transition={microSpring}
						>
							<MessageSquare className="text-mist-white h-6 w-6" strokeWidth={1.5} />
						</m.div>
					)}
				</AnimatePresence>

				{/* Notification dot */}
				{!isOpen && messages.length === 1 && (
					<span className="bg-cyber-lime absolute -top-1 -right-1 h-3 w-3 animate-pulse" />
				)}
			</m.button>

			{/* Chat Window */}
			<AnimatePresence>
				{isOpen && (
					<m.div
						initial={{ opacity: 0, y: 20, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 20, scale: 0.95 }}
						transition={springTransition}
						role="dialog"
						aria-modal="true"
						aria-labelledby="chat-widget-heading"
						aria-label="Chat with AI assistant"
						className="bg-void-navy/95 fixed right-6 bottom-24 z-50 flex h-[500px] w-[380px] flex-col border border-white/10 backdrop-blur-xl"
					>
						{/* Header */}
						<div className="border-b border-white/10 p-4">
							<div className="flex items-center gap-3">
								<div className="bg-gunmetal-glass flex h-10 w-10 items-center justify-center border border-white/10">
									<Bot className="text-cyber-lime h-5 w-5" strokeWidth={1.5} />
								</div>
								<div className="flex-1">
									<h3 id="chat-widget-heading" className="font-mono text-sm font-medium">
										AI_Assistant
									</h3>
									<p className="text-slate-text flex items-center gap-2 text-xs">
										<span className="bg-cyber-lime inline-block h-1.5 w-1.5 animate-pulse" />
										Online • Powered by Qwen 32B
									</p>
								</div>
								<button
									type="button"
									onClick={() => setIsOpen(false)}
									aria-label="Close chat"
									className="hover:border-cyber-lime focus-visible:ring-cyber-lime flex h-8 w-8 items-center justify-center border border-white/20 transition-colors focus:outline-none focus-visible:ring-2"
								>
									<X className="text-mist-white h-4 w-4" strokeWidth={1.5} />
								</button>
							</div>
						</div>

						{/* Messages */}
						<div
							className="flex-1 space-y-4 overflow-y-auto p-4"
							aria-live="polite"
							aria-atomic="false"
						>
							{messages.map((message) => (
								<m.div
									key={message.id}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={microSpring}
									className={cn("flex gap-3", message.role === "user" && "flex-row-reverse")}
								>
									<div
										className={cn(
											"flex h-8 w-8 shrink-0 items-center justify-center border",
											message.role === "assistant"
												? "border-cyber-lime/50 bg-cyber-lime/10"
												: "border-white/20 bg-white/5"
										)}
									>
										{message.role === "assistant" ? (
											<Bot className="text-cyber-lime h-4 w-4" strokeWidth={1.5} />
										) : (
											<User className="text-mist-white h-4 w-4" strokeWidth={1.5} />
										)}
									</div>
									<div
										className={cn(
											"max-w-[260px] overflow-x-auto border p-3",
											message.role === "assistant"
												? "bg-gunmetal-glass/30 border-white/10"
												: "border-cyber-lime/30 bg-cyber-lime/5"
										)}
									>
										{message.role === "assistant" ? (
											<ChatMarkdown content={message.content} />
										) : (
											<p className="text-sm leading-relaxed whitespace-pre-wrap">
												{message.content}
											</p>
										)}
									</div>
								</m.div>
							))}

							{/* Loading indicator */}
							{isLoading && (
								<m.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									className="flex gap-3"
								>
									<div className="border-cyber-lime/50 bg-cyber-lime/10 flex h-8 w-8 items-center justify-center border">
										<Bot className="text-cyber-lime h-4 w-4" strokeWidth={1.5} />
									</div>
									<div className="bg-gunmetal-glass/30 flex items-center gap-2 border border-white/10 px-4 py-3">
										<Loader2 className="text-cyber-lime h-4 w-4 animate-spin" />
										<span className="text-slate-text text-xs">Processing...</span>
									</div>
								</m.div>
							)}

							<div ref={messagesEndRef} />
						</div>

						{/* Input */}
						<div className="border-t border-white/10 p-4">
							<div className="flex gap-2">
								<label htmlFor="chat-widget-input" className="sr-only">
									Your message
								</label>
								<input
									id="chat-widget-input"
									ref={inputRef}
									type="text"
									value={input}
									onChange={(e) => setInput(e.target.value)}
									onKeyDown={handleKeyDown}
									placeholder="Ask me anything..."
									disabled={isLoading}
									className="bg-gunmetal-glass/30 focus:border-cyber-lime text-mist-white focus-visible:ring-cyber-lime placeholder:text-slate-text flex-1 border border-white/10 px-4 py-2.5 font-mono text-sm transition-colors focus:outline-none focus-visible:ring-2 disabled:opacity-50"
								/>
								<button
									onClick={sendMessage}
									disabled={!input.trim() || isLoading}
									className="hover:border-cyber-lime hover:bg-cyber-lime/10 flex h-10 w-10 items-center justify-center border border-white/20 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
									aria-label="Send message"
								>
									<Send className="text-mist-white h-4 w-4" strokeWidth={1.5} />
								</button>
							</div>
							<p className="text-slate-text text-micro mt-2 text-center">
								Press Enter to send • Powered by Workers AI
							</p>
						</div>
					</m.div>
				)}
			</AnimatePresence>
		</>
	);
}
