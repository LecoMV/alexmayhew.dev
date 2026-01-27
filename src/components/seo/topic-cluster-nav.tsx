"use client";

import Link from "next/link";
import { Layers, ArrowRight } from "lucide-react";
import { m } from "framer-motion";
import { getPageClusters, getClusterRelatedPages } from "@/data/pseo/types";

interface TopicClusterNavProps {
	currentSlug: string;
	basePath?: string; // e.g., "/services" or "/services/migrations"
}

const springTransition = {
	type: "spring" as const,
	stiffness: 100,
	damping: 20,
	mass: 1,
};

/**
 * Topic cluster navigation component for pSEO pages.
 * Displays related pages within the same topic clusters for internal linking.
 */
export function TopicClusterNav({ currentSlug, basePath = "/services" }: TopicClusterNavProps) {
	const clusters = getPageClusters(currentSlug);
	const relatedPages = getClusterRelatedPages(currentSlug);

	if (clusters.length === 0) {
		return null;
	}

	return (
		<m.section
			className="mt-16 border-t border-white/10 pt-12"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ ...springTransition, delay: 0.2 }}
		>
			<div className="mb-8">
				<h3 className="text-cyber-lime mb-2 flex items-center gap-2 font-mono text-xs tracking-wider uppercase">
					<Layers className="h-4 w-4" strokeWidth={1.5} />
					Related Topics
				</h3>
				<p className="text-slate-text text-sm">
					Explore related services in {clusters.map((c) => c.name).join(" and ")}
				</p>
			</div>

			{/* Cluster Tags */}
			<div className="mb-6 flex flex-wrap gap-2">
				{clusters.map((cluster) => (
					<span
						key={cluster.id}
						className="bg-cyber-lime/10 border-cyber-lime/30 text-cyber-lime border px-3 py-1 font-mono text-xs"
					>
						{cluster.name}
					</span>
				))}
			</div>

			{/* Related Pages Grid */}
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{relatedPages.slice(0, 6).map((slug) => (
					<Link
						key={slug}
						href={`${basePath}/${slug}`}
						className="group bg-gunmetal-glass/20 hover:border-cyber-lime/50 flex items-center justify-between border border-white/10 p-4 transition-colors duration-300"
					>
						<span className="text-mist-white group-hover:text-cyber-lime font-mono text-sm transition-colors duration-300">
							{formatSlugForDisplay(slug)}
						</span>
						<ArrowRight
							className="text-slate-text group-hover:text-cyber-lime h-4 w-4 transition-all duration-300 group-hover:translate-x-1"
							strokeWidth={1.5}
						/>
					</Link>
				))}
			</div>

			{/* Hub Page CTA */}
			{clusters.length > 0 && clusters[0].hubSlug !== currentSlug && (
				<div className="mt-6">
					<Link
						href={`${basePath}/${clusters[0].hubSlug}`}
						className="group text-slate-text hover:text-cyber-lime inline-flex items-center gap-2 font-mono text-xs transition-colors duration-300"
					>
						<span>View all {clusters[0].name} services</span>
						<ArrowRight
							className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
							strokeWidth={1.5}
						/>
					</Link>
				</div>
			)}
		</m.section>
	);
}

/**
 * Format a slug for display (e.g., "nextjs-developer-for-saas" -> "Next.js for SaaS")
 */
function formatSlugForDisplay(slug: string): string {
	// Simple transformation - could be enhanced with TECHNOLOGY_LABELS lookup
	return slug
		.split("-")
		.map((word) => {
			if (word === "nextjs") return "Next.js";
			if (word === "nodejs") return "Node.js";
			if (word === "postgresql") return "PostgreSQL";
			if (word === "saas") return "SaaS";
			if (word === "for") return "for";
			if (word === "cto") return "CTO";
			if (word === "ai") return "AI";
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(" ");
}
