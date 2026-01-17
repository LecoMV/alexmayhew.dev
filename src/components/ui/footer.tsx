import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Mail } from "lucide-react";

// Custom X (formerly Twitter) icon since Lucide deprecated brand icons
function XIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
			<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
		</svg>
	);
}

// Bluesky icon
function BlueskyIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
			<path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" />
		</svg>
	);
}

const socialLinks = [
	{ href: "https://github.com/LecoMV", icon: Github, label: "GitHub" },
	{ href: "https://www.linkedin.com/in/alexmmayhew", icon: Linkedin, label: "LinkedIn" },
	{ href: "https://x.com/alexmayhewdev", icon: XIcon, label: "X" },
	{
		href: "https://bsky.app/profile/alexmayhewdev.bsky.social",
		icon: BlueskyIcon,
		label: "Bluesky",
	},
	{ href: "mailto:alex@alexmayhew.dev", icon: Mail, label: "Email" },
];

const footerLinks = [
	{ href: "/work", label: "Work" },
	{ href: "/blog", label: "Blog" },
	{ href: "/docs", label: "Docs" },
	{ href: "/about", label: "About" },
	{ href: "/contact", label: "Contact" },
];

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="relative border-t border-white/10">
			{/* Decorative corner accents */}
			<div className="border-cyber-lime absolute top-0 left-6 h-4 w-4 -translate-y-1/2 border-t border-l sm:left-12 md:left-24" />
			<div className="border-cyber-lime absolute top-0 right-6 h-4 w-4 -translate-y-1/2 border-t border-r sm:right-12 md:right-24" />

			<div className="mx-auto max-w-[1400px] px-6 py-12 sm:px-12 md:px-24">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-12">
					{/* Brand Section */}
					<div className="md:col-span-5">
						<Link href="/" className="group inline-flex items-center gap-3">
							<Image
								src="/favicon.svg"
								alt="Alex Mayhew"
								width={48}
								height={48}
								className="h-12 w-12"
							/>
							<span className="font-mono text-sm tracking-tight">
								<span className="text-cyber-lime">alex</span>
								<span className="text-mist-white">mayhew</span>
								<span className="text-slate-text">.dev</span>
							</span>
						</Link>
						<p className="text-slate-text mt-4 max-w-xs text-sm leading-relaxed">
							Atmospheric Engineering. High-precision digital instruments for the modern web.
						</p>
					</div>

					{/* Navigation Links */}
					<div className="md:col-span-3">
						<h4 className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
							<span className="mr-2 animate-pulse">●</span>
							Navigation
						</h4>
						<nav className="flex flex-col gap-2">
							{footerLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className="text-slate-text hover:text-cyber-lime w-fit font-mono text-sm transition-colors duration-300"
								>
									{link.label}
								</Link>
							))}
						</nav>
					</div>

					{/* Social Links */}
					<div className="md:col-span-4">
						<h4 className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
							<span className="mr-2 animate-pulse">●</span>
							Connect
						</h4>
						<div className="flex gap-3">
							{socialLinks.map((social) => (
								<a
									key={social.label}
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={social.label}
									className="group hover:border-cyber-lime border border-white/10 p-2.5 transition-colors duration-300"
								>
									<social.icon
										className="text-slate-text group-hover:text-cyber-lime h-4 w-4 transition-colors duration-300"
										strokeWidth={1.5}
									/>
								</a>
							))}
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
					<p className="text-slate-text font-mono text-xs">
						<span className="opacity-50">©</span> {currentYear} Alex Mayhew.{" "}
						<span className="opacity-50">All systems operational.</span>
					</p>
					<div className="flex items-center gap-4">
						<Link
							href="/privacy"
							className="text-slate-text hover:text-cyber-lime font-mono text-xs transition-colors"
						>
							Privacy
						</Link>
						<Link
							href="/terms"
							className="text-slate-text hover:text-cyber-lime font-mono text-xs transition-colors"
						>
							Terms
						</Link>
						<span className="text-slate-text font-mono text-xs opacity-50">
							Built with precision.
						</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
