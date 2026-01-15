import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";
import { source } from "@/lib/source";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<RootProvider
			theme={{
				enabled: false, // Use site theme
			}}
		>
			<div className="pt-44">
				<DocsLayout
					tree={source.pageTree}
					nav={{ enabled: false }} // Use existing navigation
					sidebar={{
						banner: (
							<div className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
								<span className="mr-2 animate-pulse">●</span>
								Documentation
							</div>
						),
					}}
				>
					{children}
				</DocsLayout>
			</div>
		</RootProvider>
	);
}
