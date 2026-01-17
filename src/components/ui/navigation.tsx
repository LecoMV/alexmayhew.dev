"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
	{ href: "/", label: "Home", code: "00" },
	{ href: "/work", label: "Work", code: "01" },
	{ href: "/blog", label: "Blog", code: "02" },
	{ href: "/docs", label: "Docs", code: "03" },
	{ href: "/about", label: "About", code: "04" },
	{ href: "/contact", label: "Contact", code: "05" },
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

	return (
		<header className="fixed top-0 right-0 left-0 z-40">
			<nav className="max-w-fd-container mx-auto px-6 py-4 sm:px-12 md:px-24">
				<div className="bg-gunmetal-glass/20 flex items-center justify-between gap-4 border border-white/10 px-6 py-4 backdrop-blur-md">
					{/* Logo / Brand */}
					<Link href="/" className="group flex shrink-0 items-center gap-3">
						<Image
							src="/am-icon-optimized_sized.svg"
							alt="AM"
							width={48}
							height={30}
							className="transition-opacity duration-300 group-hover:opacity-80"
							priority
						/>
						<span className="font-mono text-lg tracking-tight">
							<span className="text-cyber-lime">alex</span>
							<span className="text-mist-white">mayhew</span>
							<span className="text-slate-text">.dev</span>
						</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden items-center gap-1 md:flex lg:gap-2">
						{navItems.map((item) => {
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.href}
									href={item.href}
									className={cn(
										"group relative px-3 py-2 font-mono text-xs tracking-wider uppercase transition-colors duration-300 lg:px-4 lg:py-3 lg:text-sm",
										isActive ? "text-cyber-lime" : "text-slate-text hover:text-mist-white"
									)}
								>
									<span className="mr-2 opacity-40" aria-hidden="true">
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
									const isActive = pathname === item.href;
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
