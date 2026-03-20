import { notFound } from "next/navigation";

import { TechnologyJsonLd } from "@/components/seo/technology-json-ld";
import { getTechnology, getTechnologyIds } from "@/data/pseo/technologies";

import { TechnologyPageContent } from "./technology-page-content";

import type { Metadata } from "next";

type PageProps = {
	params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
	return getTechnologyIds().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const technology = getTechnology(slug);

	if (!technology) {
		return {
			title: "Technology Not Found",
		};
	}

	const siteUrl = "https://alexmayhew.dev";
	const title = `${technology.displayName} Developer | Technical Advisor`;
	const description = `Expert ${technology.displayName} development and consulting. ${technology.expertiseLevel.slice(0, 120)}...`;
	const ogImage = `/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&category=${encodeURIComponent("Technology")}`;

	return {
		title,
		description,
		keywords: technology.targetKeywords,
		openGraph: {
			type: "website",
			locale: "en_US",
			url: `${siteUrl}/technologies/${slug}`,
			siteName: "Alex Mayhew",
			title,
			description,
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
					alt: `${technology.displayName} Development`,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [ogImage],
			creator: "@alexmayhewdev",
		},
		alternates: {
			canonical: `${siteUrl}/technologies/${slug}`,
		},
	};
}

export default async function TechnologyPage({ params }: PageProps) {
	const { slug } = await params;
	const technology = getTechnology(slug);

	if (!technology) {
		notFound();
	}

	return (
		<>
			<TechnologyJsonLd technology={technology} />
			<TechnologyPageContent technology={technology} />
		</>
	);
}
