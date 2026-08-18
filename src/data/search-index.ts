import { blog } from "@/../.source/server";
import { projects } from "@/data/projects";

export interface SearchItem {
	title: string;
	description: string;
	href: string;
	category: "Blog" | "Tool" | "Work" | "Page";
}

function getSlug(path: string): string {
	return path.replace(/^\//, "").replace(/\.mdx$/, "");
}

export function buildSearchIndex(): SearchItem[] {
	const items: SearchItem[] = [];

	// Blog posts (non-draft)
	for (const post of blog) {
		if (post.draft) continue;
		items.push({
			title: post.title,
			description: post.description || "",
			href: `/blog/${getSlug(post.info.path)}`,
			category: "Blog",
		});
	}

	// Case study projects
	for (const project of projects) {
		if (!project.caseStudy?.published) continue;
		items.push({
			title: project.title,
			description: project.caseStudy.subtitle,
			href: `/work/${project.id}`,
			category: "Work",
		});
	}

	// Static pages
	const staticPages: SearchItem[] = [
		{
			title: "Home",
			description: "Technology specialist ... web, SEO, automation, and applied AI",
			href: "/",
			category: "Page",
		},
		{
			title: "About",
			description: "Background, experience, and approach",
			href: "/about",
			category: "Page",
		},
		{
			title: "Resume",
			description: "Experience, skills, and work history",
			href: "/resume",
			category: "Page",
		},
		{
			title: "Contact",
			description: "Start a conversation about your project",
			href: "/contact",
			category: "Page",
		},
		{
			title: "Blog",
			description: "Technical articles on architecture, engineering, and web",
			href: "/blog",
			category: "Page",
		},
		{
			title: "Services",
			description: "Web development, automation, and applied-AI work",
			href: "/services",
			category: "Page",
		},
		{
			title: "Newsletter",
			description: "Occasional notes on software architecture",
			href: "/newsletter",
			category: "Page",
		},
		{
			title: "VoiceKeep",
			description: "AI voice platform, case study (archived)",
			href: "/work/voice-cloner",
			category: "Work",
		},
		{
			title: "TraceForge",
			description: "Raster to SVG vectorization",
			href: "/tools/traceforge",
			category: "Tool",
		},
		{
			title: "SaaS Readiness",
			description: "8-question architecture maturity assessment",
			href: "/tools/saas-readiness",
			category: "Tool",
		},
	];

	items.push(...staticPages);

	return items;
}
