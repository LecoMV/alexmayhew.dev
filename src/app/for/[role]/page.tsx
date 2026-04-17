import { notFound } from "next/navigation";

import { RoleJsonLd } from "@/components/seo/role-json-ld";
import { getPublishedRoleSlugs, ROLE_LABELS } from "@/data/roles";
import { getRoleBySlug } from "@/lib/cached-data";

import { RolePageContent } from "./role-page-content";

import type { Metadata } from "next";

const siteUrl = "https://alexmayhew.dev";

interface PageProps {
	params: Promise<{ role: string }>;
}

export const dynamicParams = false;

/**
 * Generate static params for all published role pages.
 */
export function generateStaticParams() {
	return getPublishedRoleSlugs().map((role) => ({
		role,
	}));
}

/**
 * Generate metadata for each role page.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { role } = await params;
	const page = getRoleBySlug(role);

	if (!page || !page.published) {
		return {};
	}

	const roleLabel = ROLE_LABELS[page.role];
	const pageUrl = `${siteUrl}/for/${role}`;
	const ogImage = `/og?title=${encodeURIComponent(page.seo.title)}&description=${encodeURIComponent(page.seo.description)}&category=${encodeURIComponent("Advisory")}`;

	return {
		title: page.seo.title,
		description: page.seo.description,
		keywords: page.seo.keywords,
		authors: [{ name: "Alex Mayhew", url: siteUrl }],
		openGraph: {
			title: page.seo.ogTitle || `${page.seo.title} | Alex Mayhew`,
			description: page.seo.ogDescription || page.seo.description,
			type: "website",
			url: pageUrl,
			siteName: "Alex Mayhew",
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
					alt: `Technical Advisor for ${roleLabel}`,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: page.seo.title,
			description: page.seo.description,
			images: [ogImage],
			creator: "@alexmayhewdev",
		},
		alternates: {
			canonical: pageUrl,
		},
	};
}

/**
 * Role page for executive/founder personas.
 */
export default async function RolePage({ params }: PageProps) {
	const { role } = await params;
	const page = getRoleBySlug(role);

	if (!page || !page.published) {
		notFound();
	}

	return (
		<>
			<RoleJsonLd page={page} />
			<RolePageContent page={page} />
		</>
	);
}
