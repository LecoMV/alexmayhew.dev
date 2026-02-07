import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectById, getCaseStudyProjects, projects } from "@/data/projects";
import { CaseStudyJsonLd } from "@/components/seo/case-study-json-ld";
import { CaseStudyPage } from "@/components/pages/case-study-page";

const siteUrl = "https://alexmayhew.dev";

interface PageProps {
	params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
	return getCaseStudyProjects().map((project) => ({
		slug: project.id,
	}));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const project = getProjectById(slug);

	if (!project?.caseStudy?.published) {
		return {};
	}

	const pageUrl = `${siteUrl}/work/${slug}`;
	const title = `${project.title} Case Study — Alex Mayhew`;
	const description = project.caseStudy.subtitle;

	return {
		title,
		description,
		keywords: [...project.tech, "case study", project.category.toLowerCase()],
		authors: [{ name: "Alex Mayhew", url: siteUrl }],
		openGraph: {
			title,
			description,
			type: "article",
			url: pageUrl,
			siteName: "Alex Mayhew",
			images: [
				{
					url: `${siteUrl}/og-image.png`,
					width: 1200,
					height: 630,
					alt: `${project.title} Case Study`,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [`${siteUrl}/og-image.png`],
			creator: "@alexmayhewdev",
		},
		alternates: {
			canonical: pageUrl,
		},
	};
}

export default async function WorkCaseStudyPage({ params }: PageProps) {
	const { slug } = await params;
	const project = getProjectById(slug);

	if (!project?.caseStudy?.published) {
		notFound();
	}

	const relatedProjects = projects
		.filter((p) => p.featured && p.id !== project.id && p.caseStudy?.published)
		.slice(0, 4);

	return (
		<>
			<CaseStudyJsonLd project={project} />
			<CaseStudyPage project={project} relatedProjects={relatedProjects} />
		</>
	);
}
