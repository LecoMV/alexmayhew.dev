import { blog } from "@/../.source/server";
import { projects } from "@/data/projects";
import {
	getAllComparisonPages,
	getAllIntegrationPages,
	getAllMigrationPages,
	getPublishedPages,
} from "@/data/pseo";
import { getTechnologyIds, technologies } from "@/data/pseo/technologies";

export interface SearchItem {
	title: string;
	description: string;
	href: string;
	category: "Blog" | "Service" | "Technology" | "Tool" | "Work" | "Page";
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

	// pSEO service pages
	for (const page of getPublishedPages()) {
		items.push({
			title: page.seo.title.split("|")[0].trim(),
			description: page.seo.description,
			href: `/services/${page.slug}`,
			category: "Service",
		});
	}

	// Migration pages
	for (const page of getAllMigrationPages()) {
		items.push({
			title: page.seo.title.split("|")[0].trim(),
			description: page.seo.description,
			href: `/services/migrations/${page.slug}`,
			category: "Service",
		});
	}

	// Integration pages
	for (const page of getAllIntegrationPages()) {
		items.push({
			title: page.seo.title.split("|")[0].trim(),
			description: page.seo.description,
			href: `/services/integrations/${page.slug}`,
			category: "Service",
		});
	}

	// Comparison pages
	for (const page of getAllComparisonPages()) {
		items.push({
			title: page.seo.title.split("|")[0].trim(),
			description: page.seo.description,
			href: `/services/comparisons/${page.slug}`,
			category: "Service",
		});
	}

	// Technology pages
	for (const id of getTechnologyIds()) {
		const tech = technologies[id];
		if (!tech) continue;
		items.push({
			title: tech.displayName,
			description: tech.realWorldExample || "",
			href: `/technologies/${id}`,
			category: "Technology",
		});
	}

	// Static pages
	const staticPages: SearchItem[] = [
		{
			title: "Home",
			description: "Technical Advisor & Systems Architect",
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
			title: "Contact",
			description: "Start a conversation about your project",
			href: "/contact",
			category: "Page",
		},
		{
			title: "Blog",
			description: "Technical articles on architecture, engineering, and leadership",
			href: "/blog",
			category: "Page",
		},
		{
			title: "Services",
			description: "Technical advisory and development services",
			href: "/services",
			category: "Page",
		},
		{
			title: "Technologies",
			description: "Technology expertise and recommendations",
			href: "/technologies",
			category: "Page",
		},
		{
			title: "Newsletter",
			description: "Weekly insights on software architecture",
			href: "/newsletter",
			category: "Page",
		},
		{
			title: "Voice Cloner",
			description: "AI text-to-speech with voice cloning",
			href: "/tools/voice-cloner",
			category: "Tool",
		},
		{
			title: "TraceForge",
			description: "Raster to SVG vectorization",
			href: "/tools/traceforge",
			category: "Tool",
		},
		{
			title: "Claude Pilot",
			description: "All-in-one session & MCP manager",
			href: "/tools/pilot",
			category: "Tool",
		},
	];

	items.push(...staticPages);

	return items;
}
