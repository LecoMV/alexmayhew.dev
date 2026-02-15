import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

export default function ServiceNotFound() {
	return (
		<main className="flex min-h-dvh flex-col items-center justify-center px-6 py-24">
			<div className="text-center">
				<h1 className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
					<span className="mr-2 animate-pulse">●</span>
					404 / Service Not Found
				</h1>

				<h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">Service unavailable</h2>

				<p className="text-slate-text mx-auto mb-8 max-w-md text-lg">
					The service page you&apos;re looking for doesn&apos;t exist or hasn&apos;t been published
					yet.
				</p>

				<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
					<Link
						href="/services"
						className="group hover:border-cyber-lime flex items-center gap-2 border border-white/20 px-6 py-3 transition-colors duration-300"
					>
						<Search className="group-hover:text-cyber-lime h-4 w-4" strokeWidth={1.5} />
						<span className="group-hover:text-cyber-lime font-mono text-sm tracking-tight transition-colors">
							Browse Services
						</span>
					</Link>

					<Link
						href="/"
						className="text-slate-text hover:text-cyber-lime flex items-center gap-2 font-mono text-sm transition-colors duration-300"
					>
						<ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
						Back to Home
					</Link>
				</div>
			</div>
		</main>
	);
}
