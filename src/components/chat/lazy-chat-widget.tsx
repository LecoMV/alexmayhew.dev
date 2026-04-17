"use client";

import { MessageSquare } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const ChatWidget = dynamic(() => import("./chat-widget").then((m) => m.ChatWidget), {
	ssr: false,
	loading: () => null,
});

const TOGGLE_EVENT = "toggle-chat";

export function LazyChatWidget() {
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		if (loaded) return;
		const handler = () => setLoaded(true);
		window.addEventListener(TOGGLE_EVENT, handler);
		return () => window.removeEventListener(TOGGLE_EVENT, handler);
	}, [loaded]);

	if (loaded) {
		return <ChatWidget autoOpen />;
	}

	return (
		<button
			type="button"
			onClick={() => setLoaded(true)}
			className={cn(
				"bg-gunmetal-glass/80 hover:border-cyber-lime fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center border border-white/20 backdrop-blur-md transition-colors duration-300",
				"focus-visible:ring-cyber-lime focus:outline-none focus-visible:ring-2"
			)}
			aria-label="Open chat"
			data-testid="lazy-chat-trigger"
		>
			<MessageSquare className="text-mist-white h-6 w-6" strokeWidth={1.5} />
			<span className="bg-cyber-lime absolute -top-1 -right-1 h-3 w-3 animate-pulse" />
		</button>
	);
}
