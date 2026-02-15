"use client";

import { useEffect, useRef, useState } from "react";

import { useBlogTheme } from "@/lib/blog-themes";

// Giscus configuration — update repo and categoryId after enabling GitHub Discussions
const GISCUS_CONFIG = {
	repo: "alexmayhew/alexmayhew-dev" as `${string}/${string}`,
	repoId: "", // Set after enabling Discussions
	category: "Blog Comments",
	categoryId: "", // Set after creating the category
	mapping: "pathname" as const,
	reactionsEnabled: "1" as const,
	emitMetadata: "0" as const,
	inputPosition: "top" as const,
	lang: "en",
};

export function Comments() {
	const { theme } = useBlogTheme();
	const containerRef = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);

	// Only load Giscus when the section becomes visible (lazy load)
	useEffect(() => {
		if (!containerRef.current) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.disconnect();
				}
			},
			{ rootMargin: "200px" }
		);

		observer.observe(containerRef.current);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (!isVisible || !containerRef.current) return;
		if (!GISCUS_CONFIG.repoId || !GISCUS_CONFIG.categoryId) return;

		const script = document.createElement("script");
		script.src = "https://giscus.app/client.js";
		script.setAttribute("data-repo", GISCUS_CONFIG.repo);
		script.setAttribute("data-repo-id", GISCUS_CONFIG.repoId);
		script.setAttribute("data-category", GISCUS_CONFIG.category);
		script.setAttribute("data-category-id", GISCUS_CONFIG.categoryId);
		script.setAttribute("data-mapping", GISCUS_CONFIG.mapping);
		script.setAttribute("data-reactions-enabled", GISCUS_CONFIG.reactionsEnabled);
		script.setAttribute("data-emit-metadata", GISCUS_CONFIG.emitMetadata);
		script.setAttribute("data-input-position", GISCUS_CONFIG.inputPosition);
		script.setAttribute("data-theme", "dark_dimmed");
		script.setAttribute("data-lang", GISCUS_CONFIG.lang);
		script.setAttribute("crossorigin", "anonymous");
		script.async = true;

		containerRef.current.appendChild(script);
	}, [isVisible]);

	return (
		<section className="mt-12 border-t pt-12" style={{ borderColor: theme.colors.border }}>
			<h2
				className="mb-6 font-mono text-xs tracking-wider uppercase"
				style={{ color: theme.colors.textMuted }}
			>
				Discussion
			</h2>
			<div ref={containerRef} className="giscus min-h-[200px]" />
		</section>
	);
}
