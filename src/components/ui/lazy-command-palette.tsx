"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import type { SearchItem } from "@/data/search-index";

const CommandPalette = dynamic(() => import("./command-palette").then((m) => m.CommandPalette), {
	ssr: false,
});

export function LazyCommandPalette({ items }: { items: SearchItem[] }) {
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const onToggle = () => setLoaded(true);
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") setLoaded(true);
		};
		window.addEventListener("toggle-command-palette", onToggle);
		window.addEventListener("keydown", onKey);
		return () => {
			window.removeEventListener("toggle-command-palette", onToggle);
			window.removeEventListener("keydown", onKey);
		};
	}, []);

	if (!loaded) return null;
	return <CommandPalette items={items} />;
}
