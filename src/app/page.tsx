export default function Home() {
	return (
		<main className="flex min-h-screen flex-col justify-center px-6 py-24 sm:px-12 md:px-24">
			<div className="mx-auto grid w-full max-w-[1400px] grid-cols-12 gap-6">
				{/* Text Content: Columns 2-8 */}
				<section className="col-span-12 flex flex-col justify-center gap-8 md:col-span-7 md:col-start-2 lg:col-span-6">
					<div className="flex flex-col gap-2">
						<h1 className="text-cyber-lime mb-2 font-mono text-xs tracking-wider uppercase sm:text-sm">
							<span className="mr-2 animate-pulse">●</span>
							System Status: Online
						</h1>
						<h2 className="text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
							Atmospheric
							<br />
							<span className="text-slate-text">Engineering.</span>
						</h2>
					</div>

					<div className="my-4 h-px w-full bg-white/10" />

					<p className="text-slate-text max-w-xl text-lg leading-relaxed font-normal sm:text-xl">
						Crafting high-precision digital instruments for the web. Rejecting the generic.
						Embracing the tactile, the heavy, and the responsive.
					</p>

					<div className="mt-4 flex items-center gap-6">
						<button className="group hover:border-cyber-lime relative border border-white/20 px-6 py-3 transition-colors duration-300">
							<span className="group-hover:text-cyber-lime font-mono text-sm tracking-tight transition-colors">
								INITIALIZE_PROJECT()
							</span>
							<div className="bg-cyber-lime/5 absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
						</button>
						<span className="hidden font-mono text-xs text-white/30 sm:inline-block">
							{`// v2.0.24`}
						</span>
					</div>
				</section>

				{/* Visual/Code Element: Columns 9-12 (on desktop) */}
				<div className="relative col-span-4 col-start-9 hidden flex-col justify-center md:flex">
					<div className="bg-gunmetal-glass/20 relative aspect-square w-full border-t border-b border-l border-white/10 p-6 backdrop-blur-sm">
						<div className="border-cyber-lime absolute top-0 right-0 h-3 w-3 border-t border-r" />
						<div className="border-cyber-lime absolute bottom-0 left-0 h-3 w-3 border-b border-l" />

						<div className="space-y-2 font-mono text-xs leading-5 text-white/40 select-none">
							<p>
								<span className="text-cyber-lime">const</span>{" "}
								<span className="text-white">philosophy</span> ={" "}
								<span className="text-burnt-ember">{`{`}</span>
							</p>
							<p className="pl-4">
								core: <span className="text-green-300">&quot;Atmosphere&quot;</span>,
							</p>
							<p className="pl-4">
								precision: <span className="text-purple-400">0.9999</span>,
							</p>
							<p className="pl-4">
								style: <span className="text-blue-300">&quot;Void&quot;</span>,
							</p>
							<p className="pl-4">
								user: <span className="text-white">null</span>,
							</p>
							<p>
								<span className="text-burnt-ember">{`}`}</span>;
							</p>
							<br />
							<p className="text-white/20">{`// Awaiting input sequence...`}</p>
							<div className="bg-cyber-lime mt-1 h-4 w-2 animate-pulse" />
						</div>
					</div>

					<div className="absolute right-0 -bottom-12 origin-right translate-x-full rotate-90 transform font-mono text-[10px] tracking-[0.2em] text-white/10 uppercase">
						Sector 09 / Visual
					</div>
				</div>
			</div>
		</main>
	);
}
