"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { AnimatePresence, m } from "framer-motion";
import { FileText, Briefcase, Cpu, Layers, Globe } from "lucide-react";
import type { SearchItem } from "@/data/search-index";

const categoryIcons: Record<SearchItem["category"], React.ReactNode> = {
	Blog: <FileText className="h-4 w-4" strokeWidth={1.5} />,
	Service: <Briefcase className="h-4 w-4" strokeWidth={1.5} />,
	Technology: <Cpu className="h-4 w-4" strokeWidth={1.5} />,
	Tool: <Layers className="h-4 w-4" strokeWidth={1.5} />,
	Work: <Briefcase className="h-4 w-4" strokeWidth={1.5} />,
	Page: <Globe className="h-4 w-4" strokeWidth={1.5} />,
};

const categoryOrder: SearchItem["category"][] = [
	"Page",
	"Blog",
	"Work",
	"Service",
	"Technology",
	"Tool",
];

interface CommandPaletteProps {
	items: SearchItem[];
}

export function CommandPalette({ items }: CommandPaletteProps) {
	const [open, setOpen] = useState(false);
	const router = useRouter();

	const toggle = useCallback(() => setOpen((prev) => !prev), []);

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				toggle();
			}
		}

		function handleCustomEvent() {
			toggle();
		}

		document.addEventListener("keydown", handleKeyDown);
		window.addEventListener("toggle-command-palette", handleCustomEvent);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("toggle-command-palette", handleCustomEvent);
		};
	}, [toggle]);

	const grouped = categoryOrder
		.map((cat) => ({
			category: cat,
			items: items.filter((item) => item.category === cat),
		}))
		.filter((group) => group.items.length > 0);

	return (
		<AnimatePresence>
			{open && (
				<m.div
					className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.15 }}
				>
					{/* Backdrop */}
					<div
						className="absolute inset-0 bg-black/60 backdrop-blur-sm"
						onClick={() => setOpen(false)}
					/>

					{/* Dialog */}
					<m.div
						className="bg-gunmetal-glass relative z-10 w-full max-w-lg overflow-hidden rounded-md border border-white/10"
						initial={{ opacity: 0, scale: 0.96, y: -10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.96, y: -10 }}
						transition={{ duration: 0.15 }}
					>
						<Command label="Search" shouldFilter={true}>
							<div className="flex items-center border-b border-white/10 px-4">
								<span className="text-slate-text mr-2 font-mono text-sm">/</span>
								<Command.Input
									placeholder="Search pages, articles, services..."
									className="text-mist-white placeholder:text-slate-text w-full bg-transparent py-4 font-mono text-sm outline-none"
									autoFocus
								/>
								<kbd className="text-slate-text border border-white/10 px-1.5 py-0.5 font-mono text-[10px]">
									ESC
								</kbd>
							</div>

							<Command.List className="max-h-[300px] overflow-y-auto p-2">
								<Command.Empty className="text-slate-text px-4 py-8 text-center font-mono text-sm">
									No results found.
								</Command.Empty>

								{grouped.map((group) => (
									<Command.Group
										key={group.category}
										heading={group.category}
										className="[&_[cmdk-group-heading]]:text-slate-text [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:uppercase"
									>
										{group.items.map((item) => (
											<Command.Item
												key={item.href}
												value={`${item.title} ${item.description}`}
												onSelect={() => {
													router.push(item.href);
													setOpen(false);
												}}
												className="data-[selected=true]:text-cyber-lime flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-white/5 data-[selected=true]:bg-white/10"
											>
												<span className="text-slate-text shrink-0">
													{categoryIcons[item.category]}
												</span>
												<div className="min-w-0 flex-1">
													<div className="text-mist-white truncate font-mono text-sm">
														{item.title}
													</div>
													{item.description && (
														<div className="text-slate-text truncate text-xs">
															{item.description.length > 80
																? item.description.slice(0, 80) + "..."
																: item.description}
														</div>
													)}
												</div>
											</Command.Item>
										))}
									</Command.Group>
								))}
							</Command.List>

							<div className="border-t border-white/10 px-4 py-2">
								<div className="text-slate-text flex items-center justify-between font-mono text-[10px]">
									<span>{items.length} items</span>
									<span>
										<kbd className="mr-1 border border-white/10 px-1 py-0.5">↑↓</kbd>
										navigate
										<kbd className="mx-1 border border-white/10 px-1 py-0.5">↵</kbd>
										open
									</span>
								</div>
							</div>
						</Command>
					</m.div>
				</m.div>
			)}
		</AnimatePresence>
	);
}
