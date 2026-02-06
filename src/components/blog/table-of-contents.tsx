"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { useBlogTheme } from "@/lib/blog-themes";

interface TocItem {
	id: string;
	text: string;
	level: number;
}

function useHeadings() {
	const [headings, setHeadings] = useState<TocItem[]>([]);

	useEffect(() => {
		const article = document.querySelector(".prose-void");
		if (!article) return;

		const elements = article.querySelectorAll("h2, h3");
		const items: TocItem[] = [];
		elements.forEach((el) => {
			if (el.id) {
				items.push({
					id: el.id,
					text: el.textContent || "",
					level: Number(el.tagName[1]),
				});
			}
		});
		setHeadings(items);
	}, []);

	return headings;
}

function useActiveHeading(headingIds: string[]) {
	const [activeId, setActiveId] = useState("");
	const observerRef = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		if (headingIds.length === 0) return;

		observerRef.current = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id);
						break;
					}
				}
			},
			{ rootMargin: "-80px 0px -60% 0px", threshold: 0 }
		);

		headingIds.forEach((id) => {
			const el = document.getElementById(id);
			if (el) observerRef.current?.observe(el);
		});

		return () => observerRef.current?.disconnect();
	}, [headingIds]);

	return activeId;
}

export function TableOfContents({ variant = "mobile" }: { variant?: "mobile" | "desktop" }) {
	const { theme } = useBlogTheme();
	const headings = useHeadings();
	const activeId = useActiveHeading(headings.map((h) => h.id));
	const [open, setOpen] = useState(false);

	const handleClick = useCallback((id: string) => {
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	}, []);

	if (headings.length < 3) return null;

	if (variant === "desktop") {
		return (
			<nav
				className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto"
				aria-label="Table of contents"
			>
				<p
					className="mb-3 font-mono text-xs tracking-wider uppercase"
					style={{ color: theme.colors.textMuted }}
				>
					On this page
				</p>
				<ul className="space-y-1.5">
					{headings.map((heading) => (
						<li key={heading.id}>
							<button
								onClick={() => handleClick(heading.id)}
								className="block w-full cursor-pointer border-l-2 py-0.5 text-left font-mono text-xs leading-snug transition-colors"
								style={{
									paddingLeft: heading.level === 3 ? "1.25rem" : "0.75rem",
									color: activeId === heading.id ? theme.colors.accent : theme.colors.textMuted,
									borderColor: activeId === heading.id ? theme.colors.accent : "transparent",
								}}
							>
								{heading.text}
							</button>
						</li>
					))}
				</ul>
			</nav>
		);
	}

	return (
		<div className="mb-8 border xl:hidden" style={{ borderColor: theme.colors.border }}>
			<button
				onClick={() => setOpen(!open)}
				className="flex w-full items-center justify-between px-4 py-3 font-mono text-xs tracking-wider uppercase"
				style={{ color: theme.colors.textMuted }}
			>
				<span>Table of Contents</span>
				<ChevronDown
					className="h-4 w-4 transition-transform"
					style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
					strokeWidth={1.5}
				/>
			</button>
			<AnimatePresence>
				{open && (
					<m.ul
						className="space-y-1 border-t px-4 py-3"
						style={{ borderColor: theme.colors.border }}
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.2 }}
					>
						{headings.map((heading) => (
							<li key={heading.id}>
								<button
									onClick={() => {
										handleClick(heading.id);
									}}
									className="block w-full cursor-pointer py-1 text-left font-mono text-xs transition-colors"
									style={{
										paddingLeft: heading.level === 3 ? "1rem" : "0",
										color: activeId === heading.id ? theme.colors.accent : theme.colors.textMuted,
									}}
								>
									{heading.text}
								</button>
							</li>
						))}
					</m.ul>
				)}
			</AnimatePresence>
		</div>
	);
}
