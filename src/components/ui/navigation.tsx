"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Menu, X, ChevronDown, Layers, Terminal, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
	href: string;
	label: string;
	code: string;
	hasDropdown?: boolean;
}

interface ToolItem {
	href: string;
	label: string;
	description: string;
	icon: React.ReactNode;
	badge: string;
	badgeColor: "lime" | "blue";
}

const navItems: NavItem[] = [
	{ href: "/", label: "Home", code: "00" },
	{ href: "/work", label: "Work", code: "01" },
	{ href: "/tools", label: "Tools", code: "02", hasDropdown: true },
	{ href: "/blog", label: "Blog", code: "03" },
	{ href: "/docs", label: "Docs", code: "04" },
	{ href: "/about", label: "About", code: "05" },
	{ href: "/contact", label: "Contact", code: "06" },
];

const toolsDropdown: ToolItem[] = [
	{
		href: "/tools/voice-cloner",
		label: "Voice Cloner",
		description: "AI text-to-speech with voice cloning",
		icon: <Mic className="h-4 w-4" strokeWidth={1.5} />,
		badge: "Live",
		badgeColor: "lime",
	},
	{
		href: "/tools/traceforge",
		label: "TraceForge",
		description: "Raster to SVG vectorization",
		icon: <Layers className="h-4 w-4" strokeWidth={1.5} />,
		badge: "Demo",
		badgeColor: "lime",
	},
	{
		href: "/tools/pilot",
		label: "Claude Pilot",
		description: "All-in-one session & MCP manager",
		icon: <Terminal className="h-4 w-4" strokeWidth={1.5} />,
		badge: "Download",
		badgeColor: "blue",
	},
];

const springTransition = {
	type: "spring" as const,
	stiffness: 100,
	damping: 20,
	mass: 1,
};

export function Navigation() {
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setToolsDropdownOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleDropdownEnter = () => {
		if (dropdownTimeoutRef.current) {
			clearTimeout(dropdownTimeoutRef.current);
		}
		setToolsDropdownOpen(true);
	};

	const handleDropdownLeave = () => {
		dropdownTimeoutRef.current = setTimeout(() => {
			setToolsDropdownOpen(false);
		}, 150);
	};

	const isToolsActive = pathname.startsWith("/tools");

	return (
		<header className="fixed top-0 right-0 left-0 z-40">
			{/* Skip to content link - visible on focus for keyboard users */}
			<a
				href="#main-content"
				className="bg-cyber-lime text-void-navy absolute left-4 z-50 -translate-y-full px-4 py-2 font-mono text-sm transition-transform focus:translate-y-4"
			>
				Skip to content
			</a>
			<nav className="max-w-fd-container mx-auto px-6 py-4 sm:px-12 md:px-24">
				<div className="bg-gunmetal-glass/20 flex items-center justify-between gap-2 border border-white/10 px-4 py-3 backdrop-blur-md md:gap-3 md:px-5 md:py-4 lg:gap-4 lg:px-6">
					{/* Logo / Brand */}
					<Link href="/" className="group flex shrink-0 items-center gap-2 md:gap-3 lg:gap-4">
						<Image
							src="/am-icon-optimized_sized.svg"
							alt="AM"
							width={52}
							height={32}
							className="h-6 w-auto transition-opacity duration-300 group-hover:opacity-80 md:h-7 lg:h-8"
							priority
						/>
						<span className="font-mono text-sm tracking-tight md:text-base lg:text-lg">
							<span className="text-cyber-lime">alex</span>
							<span className="text-mist-white">mayhew</span>
							<span className="text-slate-text">.dev</span>
						</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden items-center gap-0 md:flex lg:gap-0.5 xl:gap-1">
						{navItems.map((item) => {
							const isActive = item.hasDropdown ? isToolsActive : pathname === item.href;

							if (item.hasDropdown) {
								return (
									<div
										key={item.href}
										ref={dropdownRef}
										className="relative"
										onMouseEnter={handleDropdownEnter}
										onMouseLeave={handleDropdownLeave}
									>
										<button
											onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
											className={cn(
												"group relative flex items-center gap-1 px-1.5 py-2 font-mono text-[10px] tracking-wider uppercase transition-colors duration-300 lg:px-2.5 lg:py-2.5 lg:text-[11px] xl:px-3.5 xl:py-3 xl:text-xs",
												isActive ? "text-cyber-lime" : "text-slate-text hover:text-mist-white"
											)}
											aria-expanded={toolsDropdownOpen}
											aria-haspopup="true"
										>
											<span className="mr-1.5 hidden opacity-40 xl:inline" aria-hidden="true">
												{item.code}
											</span>
											{item.label}
											<ChevronDown
												className={cn(
													"h-3 w-3 transition-transform duration-200",
													toolsDropdownOpen && "rotate-180"
												)}
												strokeWidth={1.5}
											/>
											{isActive && (
												<div className="bg-cyber-lime absolute right-2 bottom-1 left-2 h-px" />
											)}
											{!isActive && (
												<div className="bg-cyber-lime absolute right-2 bottom-1 left-2 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
											)}
										</button>

										{/* Dropdown Menu */}
										<AnimatePresence>
											{toolsDropdownOpen && (
												<m.div
													initial={{ opacity: 0, y: -10 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: -10 }}
													transition={{ duration: 0.15 }}
													className="bg-gunmetal-glass/95 absolute top-full left-0 mt-2 min-w-[280px] border border-white/10 p-2 backdrop-blur-md"
												>
													{toolsDropdown.map((tool) => (
														<Link
															key={tool.href}
															href={tool.href}
															onClick={() => setToolsDropdownOpen(false)}
															className="group/item flex items-start gap-3 p-3 transition-colors hover:bg-white/5"
														>
															<div className="text-cyber-lime mt-0.5">{tool.icon}</div>
															<div className="flex-grow">
																<div className="flex items-center gap-2">
																	<span className="text-mist-white font-mono text-sm">
																		{tool.label}
																	</span>
																	<span
																		className={cn(
																			"border px-1.5 py-0.5 font-mono text-[9px] tracking-wider uppercase",
																			tool.badgeColor === "lime"
																				? "border-cyber-lime/50 text-cyber-lime"
																				: "border-blue-400/50 text-blue-400"
																		)}
																	>
																		{tool.badge}
																	</span>
																</div>
																<p className="text-slate-text mt-0.5 text-xs">{tool.description}</p>
															</div>
														</Link>
													))}
													<div className="mt-2 border-t border-white/10 pt-2">
														<Link
															href="/tools"
															onClick={() => setToolsDropdownOpen(false)}
															className="text-slate-text hover:text-cyber-lime flex items-center gap-2 p-2 font-mono text-xs transition-colors"
														>
															View all tools
															<span className="text-[10px] opacity-50">→</span>
														</Link>
													</div>
												</m.div>
											)}
										</AnimatePresence>
									</div>
								);
							}

							return (
								<Link
									key={item.href}
									href={item.href}
									className={cn(
										"group relative px-1.5 py-2 font-mono text-[10px] tracking-wider uppercase transition-colors duration-300 lg:px-2.5 lg:py-2.5 lg:text-[11px] xl:px-3.5 xl:py-3 xl:text-xs",
										isActive ? "text-cyber-lime" : "text-slate-text hover:text-mist-white"
									)}
								>
									<span className="mr-1.5 hidden opacity-40 xl:inline" aria-hidden="true">
										{item.code}
									</span>
									{item.label}
									{isActive && (
										<div className="bg-cyber-lime absolute right-2 bottom-1 left-2 h-px" />
									)}
									{!isActive && (
										<div className="bg-cyber-lime absolute right-2 bottom-1 left-2 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
									)}
								</Link>
							);
						})}
					</div>

					{/* Mobile Menu Button */}
					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className="hover:border-cyber-lime border border-white/20 p-3 transition-colors duration-300 md:hidden"
						aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
					>
						{mobileMenuOpen ? (
							<X className="text-cyber-lime h-6 w-6" strokeWidth={1.5} />
						) : (
							<Menu className="text-mist-white h-6 w-6" strokeWidth={1.5} />
						)}
					</button>
				</div>

				{/* Mobile Menu */}
				<AnimatePresence>
					{mobileMenuOpen && (
						<m.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={springTransition}
							className="overflow-hidden md:hidden"
						>
							<div className="bg-gunmetal-glass/40 mt-2 border border-white/10 p-4 backdrop-blur-md">
								{navItems.map((item, index) => {
									const isActive = item.hasDropdown ? isToolsActive : pathname === item.href;

									if (item.hasDropdown) {
										return (
											<m.div
												key={item.href}
												initial={{ opacity: 0, x: -20 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ ...springTransition, delay: index * 0.1 }}
											>
												<div className="border-b border-white/5 py-2">
													<Link
														href={item.href}
														onClick={() => setMobileMenuOpen(false)}
														className={cn(
															"flex items-center gap-4 py-2 font-mono text-sm tracking-wider uppercase transition-colors duration-300",
															isActive ? "text-cyber-lime" : "text-slate-text hover:text-mist-white"
														)}
													>
														<span className="text-xs opacity-40" aria-hidden="true">
															{item.code}
														</span>
														{item.label}
														{isActive && (
															<span className="bg-cyber-lime ml-auto h-2 w-2 animate-pulse" />
														)}
													</Link>
													{/* Mobile Tools Sub-menu */}
													<div className="mt-2 ml-8 space-y-2">
														{toolsDropdown.map((tool) => (
															<Link
																key={tool.href}
																href={tool.href}
																onClick={() => setMobileMenuOpen(false)}
																className="flex items-center gap-2 py-1 text-xs"
															>
																<span className="text-cyber-lime">{tool.icon}</span>
																<span className="text-slate-text hover:text-mist-white">
																	{tool.label}
																</span>
																<span
																	className={cn(
																		"border px-1 py-0.5 font-mono text-[8px] tracking-wider uppercase",
																		tool.badgeColor === "lime"
																			? "border-cyber-lime/50 text-cyber-lime"
																			: "border-blue-400/50 text-blue-400"
																	)}
																>
																	{tool.badge}
																</span>
															</Link>
														))}
													</div>
												</div>
											</m.div>
										);
									}

									return (
										<m.div
											key={item.href}
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ ...springTransition, delay: index * 0.1 }}
										>
											<Link
												href={item.href}
												onClick={() => setMobileMenuOpen(false)}
												className={cn(
													"flex items-center gap-4 border-b border-white/5 py-4 font-mono text-sm tracking-wider uppercase transition-colors duration-300",
													isActive ? "text-cyber-lime" : "text-slate-text hover:text-mist-white"
												)}
											>
												<span className="text-xs opacity-40" aria-hidden="true">
													{item.code}
												</span>
												{item.label}
												{isActive && (
													<span className="bg-cyber-lime ml-auto h-2 w-2 animate-pulse" />
												)}
											</Link>
										</m.div>
									);
								})}
							</div>
						</m.div>
					)}
				</AnimatePresence>
			</nav>
		</header>
	);
}
