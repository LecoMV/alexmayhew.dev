import type { Project } from "@/data/projects";

const siteUrl = "https://alexmayhew.dev";

interface CaseStudyJsonLdProps {
	project: Project;
}

export function CaseStudyJsonLd({ project }: CaseStudyJsonLdProps) {
	const pageUrl = `${siteUrl}/work/${project.id}`;

	const creativeWorkSchema = {
		"@context": "https://schema.org",
		"@type": "CreativeWork",
		name: `${project.title} — Case Study`,
		description: project.description,
		url: pageUrl,
		author: {
			"@type": "Person",
			name: "Alex Mayhew",
			url: siteUrl,
			jobTitle: "Technical Advisor",
			sameAs: [
				"https://linkedin.com/in/alexmayhewdev",
				"https://github.com/alexmayhew",
				"https://x.com/alexmayhewdev",
			],
		},
		datePublished: `${project.year}-01-01`,
		keywords: project.tech.join(", "),
		about: {
			"@type": "SoftwareApplication",
			name: project.title,
			applicationCategory: project.category,
			operatingSystem: "Web",
		},
	};

	const breadcrumbSchema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: siteUrl,
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Work",
				item: `${siteUrl}/work`,
			},
			{
				"@type": "ListItem",
				position: 3,
				name: project.title,
				item: pageUrl,
			},
		],
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
			/>
		</>
	);
}
