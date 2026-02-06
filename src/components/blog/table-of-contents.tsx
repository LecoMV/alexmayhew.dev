"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { useBlogTheme } from "@/lib/blog-themes";

// --- Data Model ---

interface TocChild {
	id: string;
	text: string;
	subIndex: number;
	parentId: string;
}

interface TocSection {
	id: string;
	text: string;
	sectionIndex: number;
	children: TocChild[];
}

// --- Terminal Color Palette ---

const SECTION_COLORS = [
	"#4ade80", // green — functions
	"#facc15", // yellow — types
	"#60a5fa", // blue — imports
	"#c084fc", // purple — exports
	"#22d3ee", // cyan — constants
];

function getSectionColor(index: number): string {
	return SECTION_COLORS[index % SECTION_COLORS.length];
}

// --- Hooks ---

function useHeadings(): TocSection[] {
	const [sections, setSections] = useState<TocSection[]>([]);

	useEffect(() => {
		const article = document.querySelector(".prose-void");
		if (!article) return;

		const elements = article.querySelectorAll("h2, h3");
		const result: TocSection[] = [];
		let currentSection: TocSection | null = null;

		elements.forEach((el) => {
			if (!el.id) return;
			const tag = el.tagName.toLowerCase();

			if (tag === "h2") {
				currentSection = {
					id: el.id,
					text: el.textContent || "",
					sectionIndex: result.length,
					children: [],
				};
				result.push(currentSection);
			} else if (tag === "h3" && currentSection) {
				currentSection.children.push({
					id: el.id,
					text: el.textContent || "",
					subIndex: currentSection.children.length + 1,
					parentId: currentSection.id,
				});
			}
		});

		setSections(result);
	}, []);

	return sections;
}

function useActiveHeading(sections: TocSection[]) {
	const [activeId, setActiveId] = useState("");
	const observerPausedRef = useRef(false);
	const observerRef = useRef<IntersectionObserver | null>(null);

	const allIds = useMemo(() => {
		const ids: string[] = [];
		for (const s of sections) {
			ids.push(s.id);
			for (const c of s.children) {
				ids.push(c.id);
			}
		}
		return ids;
	}, [sections]);

	useEffect(() => {
		if (allIds.length === 0) return;

		observerRef.current = new IntersectionObserver(
			(entries) => {
				if (observerPausedRef.current) return;

				// Find the topmost intersecting heading
				let topEntry: IntersectionObserverEntry | null = null;
				for (const entry of entries) {
					if (entry.isIntersecting) {
						if (!topEntry || entry.boundingClientRect.top < topEntry.boundingClientRect.top) {
							topEntry = entry;
						}
					}
				}
				if (topEntry) {
					setActiveId(topEntry.target.id);
				}
			},
			{ rootMargin: "-112px 0px -70% 0px", threshold: 0 }
		);

		allIds.forEach((id) => {
			const el = document.getElementById(id);
			if (el) observerRef.current?.observe(el);
		});

		return () => observerRef.current?.disconnect();
	}, [allIds]);

	const pauseObserver = useCallback(() => {
		observerPausedRef.current = true;
		setTimeout(() => {
			observerPausedRef.current = false;
		}, 500);
	}, []);

	return { activeId, setActiveId, pauseObserver };
}

function useReadSections(activeId: string, sections: TocSection[]) {
	const [readIds, setReadIds] = useState<Set<string>>(new Set());

	useEffect(() => {
		if (!activeId) return;

		// Find the index of the active heading in flat order
		const flatIds: string[] = [];
		for (const s of sections) {
			flatIds.push(s.id);
			for (const c of s.children) {
				flatIds.push(c.id);
			}
		}

		const activeIndex = flatIds.indexOf(activeId);
		if (activeIndex <= 0) return;

		// Mark everything before the active heading as read
		setReadIds((prev) => {
			const next = new Set(prev);
			for (let i = 0; i < activeIndex; i++) {
				next.add(flatIds[i]);
			}
			return next;
		});
	}, [activeId, sections]);

	return readIds;
}

function useReducedMotion(): boolean {
	const [reduced, setReduced] = useState(false);

	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		setReduced(mq.matches);
		const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, []);

	return reduced;
}

// --- Progress Indicator ---

function ProgressMarker({
	state,
	color,
	accentColor,
}: {
	state: "unread" | "active" | "read";
	color: string;
	accentColor: string;
}) {
	if (state === "active") {
		return (
			<span className="font-mono text-[10px]" style={{ color: accentColor }}>
				&#9654;
			</span>
		);
	}
	if (state === "read") {
		return (
			<span className="font-mono text-[10px]" style={{ color }}>
				&#10003;
			</span>
		);
	}
	return (
		<span className="font-mono text-[10px]" style={{ color, opacity: 0.4 }}>
			&#9675;
		</span>
	);
}

// --- Numbering ---

function formatSectionNum(index: number): string {
	return String(index + 1).padStart(2, "0");
}

function formatSubNum(sectionIndex: number, subIndex: number): string {
	return `${formatSectionNum(sectionIndex)}.${subIndex}`;
}

// --- Hash Management ---

function updateHash(id: string, replace: boolean) {
	if (replace) {
		history.replaceState(null, "", "#" + id);
	} else {
		history.pushState(null, "", "#" + id);
	}
}

// --- Component ---

export function TableOfContents({ variant = "mobile" }: { variant?: "mobile" | "desktop" }) {
	const { theme } = useBlogTheme();
	const sections = useHeadings();
	const { activeId, setActiveId, pauseObserver } = useActiveHeading(sections);
	const readIds = useReadSections(activeId, sections);
	const reducedMotion = useReducedMotion();
	const [open, setOpen] = useState(false);

	// Determine which H2 section is active (for expansion)
	const activeSectionId = useMemo(() => {
		for (const s of sections) {
			if (s.id === activeId) return s.id;
			for (const c of s.children) {
				if (c.id === activeId) return s.id;
			}
		}
		return "";
	}, [activeId, sections]);

	// Update hash on scroll-based active changes
	const prevActiveRef = useRef(activeId);
	useEffect(() => {
		if (activeId && activeId !== prevActiveRef.current) {
			prevActiveRef.current = activeId;
			updateHash(activeId, true);
		}
	}, [activeId]);

	const handleClick = useCallback(
		(id: string) => {
			const el = document.getElementById(id);
			if (el) {
				pauseObserver();
				setActiveId(id);
				el.scrollIntoView({
					behavior: reducedMotion ? "auto" : "smooth",
					block: "start",
				});
				updateHash(id, false);
			}
		},
		[pauseObserver, setActiveId, reducedMotion]
	);

	const flatCount = useMemo(() => {
		let count = 0;
		for (const s of sections) {
			count += 1 + s.children.length;
		}
		return count;
	}, [sections]);

	if (flatCount < 3) return null;

	// Helper: determine state for a heading
	function getState(id: string): "unread" | "active" | "read" {
		if (id === activeId) return "active";
		if (readIds.has(id)) return "read";
		return "unread";
	}

	// Helper: get color for a heading
	function getItemColor(id: string, sectionColor: string): string {
		if (id === activeId) return theme.colors.accent;
		if (readIds.has(id)) return sectionColor;
		return sectionColor;
	}

	// Helper: get opacity for a heading
	function getItemOpacity(id: string): number {
		if (id === activeId) return 1;
		if (readIds.has(id)) return 1;
		return 0.6;
	}

	// --- Desktop ---
	if (variant === "desktop") {
		return (
			<nav
				className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto"
				aria-label="Table of contents"
			>
				<p
					className="mb-3 font-mono text-xs tracking-wider"
					style={{ color: theme.colors.textMuted, opacity: 0.6 }}
				>
					{"// TABLE OF CONTENTS"}
				</p>
				<ul className="space-y-0.5">
					{sections.map((section) => {
						const sectionColor = getSectionColor(section.sectionIndex);
						const isExpanded = activeSectionId === section.id;
						const sectionState = getState(section.id);

						return (
							<li key={section.id}>
								{/* H2 entry */}
								<button
									onClick={() => handleClick(section.id)}
									className="group flex w-full cursor-pointer items-center gap-2 border-l-2 py-1 pr-1 pl-2.5 text-left font-mono text-xs leading-snug transition-all duration-150"
									style={{
										borderColor: sectionState === "active" ? theme.colors.accent : "transparent",
										backgroundColor:
											sectionState === "active" ? "rgba(204, 243, 129, 0.05)" : "transparent",
										color: getItemColor(section.id, sectionColor),
										opacity: getItemOpacity(section.id),
									}}
									aria-current={sectionState === "active" ? "location" : undefined}
									aria-expanded={section.children.length > 0 ? isExpanded : undefined}
								>
									<span className="inline-flex w-4 shrink-0 justify-center">
										<ProgressMarker
											state={sectionState}
											color={sectionColor}
											accentColor={theme.colors.accent}
										/>
									</span>
									<span className="w-5 shrink-0 text-[10px]" style={{ opacity: 0.5 }}>
										{formatSectionNum(section.sectionIndex)}
									</span>
									<span className="truncate">{section.text}</span>
								</button>

								{/* H3 children — expand active section, collapse others */}
								{section.children.length > 0 && (
									<AnimatePresence initial={false}>
										{isExpanded && (
											<m.ul
												initial={reducedMotion ? false : { height: 0, opacity: 0 }}
												animate={{ height: "auto", opacity: 1 }}
												exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
												transition={
													reducedMotion
														? { duration: 0 }
														: { type: "spring", stiffness: 500, damping: 35, mass: 0.8 }
												}
												className="overflow-hidden"
											>
												{section.children.map((child) => {
													const childState = getState(child.id);
													return (
														<li key={child.id}>
															<button
																onClick={() => handleClick(child.id)}
																className="group flex w-full cursor-pointer items-center gap-2 border-l-2 py-0.5 pr-1 pl-2.5 text-left font-mono text-[11px] leading-snug transition-all duration-150"
																style={{
																	borderColor:
																		childState === "active" ? theme.colors.accent : "transparent",
																	backgroundColor:
																		childState === "active"
																			? "rgba(204, 243, 129, 0.05)"
																			: "transparent",
																	color: getItemColor(child.id, sectionColor),
																	opacity: getItemOpacity(child.id),
																}}
																aria-current={childState === "active" ? "location" : undefined}
															>
																<span className="inline-flex w-4 shrink-0 justify-center">
																	<ProgressMarker
																		state={childState}
																		color={sectionColor}
																		accentColor={theme.colors.accent}
																	/>
																</span>
																<span className="w-5 shrink-0 text-[10px]" style={{ opacity: 0.5 }}>
																	{formatSubNum(section.sectionIndex, child.subIndex)}
																</span>
																<span className="truncate">{child.text}</span>
															</button>
														</li>
													);
												})}
											</m.ul>
										)}
									</AnimatePresence>
								)}
							</li>
						);
					})}
				</ul>
			</nav>
		);
	}

	// --- Mobile ---

	// Active section label for collapsed preview
	const activeSection = sections.find((s) => s.id === activeSectionId);
	const collapsedLabel = activeSection
		? `Table of Contents — §${formatSectionNum(activeSection.sectionIndex)} ${activeSection.text}`
		: "Table of Contents";

	return (
		<div className="mb-8 border xl:hidden" style={{ borderColor: theme.colors.border }}>
			<button
				onClick={() => setOpen(!open)}
				className="flex w-full items-center justify-between px-4 py-3 font-mono text-xs tracking-wider uppercase"
				style={{ color: theme.colors.textMuted }}
			>
				<span className="truncate pr-2">{open ? "Table of Contents" : collapsedLabel}</span>
				<ChevronDown
					className="h-4 w-4 shrink-0 transition-transform"
					style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
					strokeWidth={1.5}
				/>
			</button>
			<AnimatePresence>
				{open && (
					<m.ul
						className="space-y-0.5 border-t px-4 py-3"
						style={{ borderColor: theme.colors.border }}
						initial={reducedMotion ? false : { height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
						transition={reducedMotion ? { duration: 0 } : { duration: 0.2 }}
					>
						{sections.map((section) => {
							const sectionColor = getSectionColor(section.sectionIndex);
							const sectionState = getState(section.id);

							return (
								<li key={section.id}>
									<button
										onClick={() => {
											handleClick(section.id);
											setOpen(false);
										}}
										className="flex w-full cursor-pointer items-center gap-2 py-1 text-left font-mono text-xs transition-colors"
										style={{
											color: getItemColor(section.id, sectionColor),
											opacity: getItemOpacity(section.id),
										}}
										aria-current={sectionState === "active" ? "location" : undefined}
									>
										<span className="inline-flex w-4 shrink-0 justify-center">
											<ProgressMarker
												state={sectionState}
												color={sectionColor}
												accentColor={theme.colors.accent}
											/>
										</span>
										<span className="w-5 shrink-0 text-[10px]" style={{ opacity: 0.5 }}>
											{formatSectionNum(section.sectionIndex)}
										</span>
										<span className="truncate">{section.text}</span>
									</button>

									{/* Show H3 children inline in mobile */}
									{section.children.map((child) => {
										const childState = getState(child.id);
										return (
											<button
												key={child.id}
												onClick={() => {
													handleClick(child.id);
													setOpen(false);
												}}
												className="flex w-full cursor-pointer items-center gap-2 py-0.5 pl-6 text-left font-mono text-[11px] transition-colors"
												style={{
													color: getItemColor(child.id, sectionColor),
													opacity: getItemOpacity(child.id),
												}}
												aria-current={childState === "active" ? "location" : undefined}
											>
												<span className="inline-flex w-4 shrink-0 justify-center">
													<ProgressMarker
														state={childState}
														color={sectionColor}
														accentColor={theme.colors.accent}
													/>
												</span>
												<span className="w-5 shrink-0 text-[10px]" style={{ opacity: 0.5 }}>
													{formatSubNum(section.sectionIndex, child.subIndex)}
												</span>
												<span className="truncate">{child.text}</span>
											</button>
										);
									})}
								</li>
							);
						})}
					</m.ul>
				)}
			</AnimatePresence>
		</div>
	);
}
