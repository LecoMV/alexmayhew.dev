import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMigrationPageBySlug, getAllMigrationSlugs } from "@/data/pseo";
import { MigrationJsonLd } from "@/components/seo/migration-json-ld";
import { MigrationPageContent } from "./migration-page-content";

const siteUrl = "https://alexmayhew.dev";

interface PageProps {
	params: Promise<{ slug: string }>;
}

/**
 * Generate static params for all published migration pages.
 */
export function generateStaticParams() {
	return getAllMigrationSlugs().map((slug) => ({
		slug,
	}));
}

/**
 * Generate metadata for each migration page.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const page = getMigrationPageBySlug(slug);

	if (!page || !page.published) {
		return {};
	}

	const pageUrl = `${siteUrl}/services/migrations/${slug}`;

	return {
		title: page.seo.title,
		description: page.seo.description,
		keywords: page.seo.keywords,
		authors: [{ name: "Alex Mayhew", url: siteUrl }],
		openGraph: {
			title: page.seo.title,
			description: page.seo.description,
			type: "website",
			url: pageUrl,
			siteName: "Alex Mayhew",
			images: [
				{
					url: `${siteUrl}/og-image.png`,
					width: 1200,
					height: 630,
					alt: `${page.legacyTech.name} to ${page.modernTech.name} Migration`,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: page.seo.title,
			description: page.seo.description,
			images: [`${siteUrl}/og-image.png`],
			creator: "@alexmayhewdev",
		},
		alternates: {
			canonical: pageUrl,
		},
	};
}

/**
 * Migration page for legacy → modern tech transitions.
 */
export default async function MigrationPage({ params }: PageProps) {
	const { slug } = await params;
	const page = getMigrationPageBySlug(slug);

	if (!page || !page.published) {
		notFound();
	}

	return (
		<>
			<MigrationJsonLd page={page} />
			<MigrationPageContent page={page} />
		</>
	);
}
