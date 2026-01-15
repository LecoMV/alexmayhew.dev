import Link from "next/link";

export default function NotFound() {
	return (
		<main className="flex min-h-[60vh] flex-col items-center justify-center px-6">
			<div className="text-center">
				<h1 className="text-cyber-lime mb-4 font-mono text-6xl font-bold">404</h1>
				<p className="text-mist-white mb-2 font-mono text-xl">Page not found</p>
				<p className="text-slate-text mb-8 max-w-md">
					The page you&apos;re looking for doesn&apos;t exist or has been moved.
				</p>
				<Link
					href="/"
					className="border-cyber-lime text-cyber-lime hover:bg-cyber-lime/10 inline-block border px-6 py-3 font-mono text-sm transition-colors"
				>
					Return Home
				</Link>
			</div>
		</main>
	);
}
