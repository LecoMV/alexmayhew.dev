// Unified skills data - single source of truth
// Used by: terminal commands, about page, future features

export interface SkillCategory {
	name: string;
	skills: string[];
}

export const skills: Record<string, string[]> = {
	frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
	backend: ["Node.js", "Python", "Go", "PostgreSQL", "Redis"],
	infrastructure: ["AWS", "Cloudflare", "Docker", "Kubernetes", "Terraform"],
	data: ["PostgreSQL", "MongoDB", "GraphQL", "Prisma", "Drizzle"],
};

// Helper: get all skill categories
export function getSkillCategories(): string[] {
	return Object.keys(skills);
}

// Helper: get skills for a category
export function getSkillsForCategory(category: string): string[] {
	return skills[category] || [];
}

// Helper: get all skills as flat array
export function getAllSkills(): string[] {
	return Object.values(skills).flat();
}

// Blog posts for terminal
export const blogPosts = [
	{ slug: "saas-authentication-patterns", title: "SaaS Authentication Patterns for 2025" },
	{ slug: "cloudflare-workers-edge", title: "Building at the Edge with Cloudflare Workers" },
	{ slug: "typescript-strict-mode", title: "Why TypeScript Strict Mode is Non-Negotiable" },
];
