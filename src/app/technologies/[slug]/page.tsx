import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTechnology, getTechnologyIds } from "@/data/pseo/technologies";
import { TechnologyJsonLd } from "@/components/seo/technology-json-ld";
import { TechnologyPageContent } from "./technology-page-content";

type PageProps = {
	params: Promise<{ slug: string }>;
};

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
					url: "/og-image.png",
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
			images: ["/og-image.png"],
			creator: "@alexmayhew",
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
