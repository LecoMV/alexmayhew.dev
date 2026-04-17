export default function ServicesLoading() {
	return (
		<section className="page-layout" aria-busy="true" aria-live="polite">
			<div className="max-w-content mx-auto">
				<div className="mb-8 h-4 w-48 animate-pulse bg-white/5" />
				<div className="mb-4 h-12 w-full max-w-2xl animate-pulse bg-white/5" />
				<div className="mb-12 h-6 w-full max-w-xl animate-pulse bg-white/5" />
				<div className="grid gap-6 md:grid-cols-2">
					{Array.from({ length: 4 }).map((_, i) => (
						<div
							key={i}
							className="bg-gunmetal-glass/20 h-48 animate-pulse border border-white/10"
						/>
					))}
				</div>
			</div>
		</section>
	);
}
