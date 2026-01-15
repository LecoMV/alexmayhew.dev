import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

const socialLinks = [
	{ href: "https://github.com/LecoMV", icon: Github, label: "GitHub" },
	{ href: "https://www.linkedin.com/in/alexmmayhew", icon: Linkedin, label: "LinkedIn" },
	{ href: "https://x.com/alexmayhewdev", icon: Twitter, label: "X (Twitter)" },
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
					<p className="text-slate-text font-mono text-xs opacity-50">
						Built with precision. Deployed on the edge.
					</p>
				</div>
			</div>
		</footer>
	);
}
