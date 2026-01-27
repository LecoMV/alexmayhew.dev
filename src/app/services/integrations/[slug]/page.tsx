import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getIntegrationPageBySlug, getAllIntegrationSlugs } from "@/data/pseo";
import { IntegrationJsonLd } from "@/components/seo/integration-json-ld";
import { HowToJsonLd, generateIntegrationHowToSteps } from "@/components/seo/howto-json-ld";
import { IntegrationPageContent } from "./integration-page-content";

const siteUrl = "https://alexmayhew.dev";

interface PageProps {
	params: Promise<{ slug: string }>;
}

/**
 * Generate static params for all published integration pages.
 */
export function generateStaticParams() {
	return getAllIntegrationSlugs().map((slug) => ({
		slug,
	}));
}

/**
 * Generate metadata for each integration page.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const page = getIntegrationPageBySlug(slug);

	if (!page || !page.published) {
		return {};
	}

	const pageUrl = `${siteUrl}/services/integrations/${slug}`;

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
					alt: `${page.saasA.name} + ${page.saasB.name} Integration`,
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
 * Integration page for SaaS A ↔ SaaS B integration solutions.
 */
export default async function IntegrationPage({ params }: PageProps) {
	const { slug } = await params;
	const page = getIntegrationPageBySlug(slug);

	if (!page || !page.published) {
		notFound();
	}

	const howToSteps = generateIntegrationHowToSteps(page.saasA.name, page.saasB.name);

	// Calculate total weeks from integration timeline phases
	const totalWeeks =
		page.timeline.discoveryWeeks + page.timeline.mvpWeeks + page.timeline.productionWeeks;

	return (
		<>
			<IntegrationJsonLd page={page} />
			<HowToJsonLd
				name={`How to Integrate ${page.saasA.name} with ${page.saasB.name}`}
				description={`Enterprise-grade integration guide for connecting ${page.saasA.name} and ${page.saasB.name}. Covers API setup, data mapping, middleware architecture, and compliance requirements.`}
				steps={howToSteps}
				totalTime={`P${totalWeeks}W`}
				estimatedCost={{
					currency: "USD",
					minValue: page.budgetGuidance.mvpMin,
					maxValue: page.budgetGuidance.fullMax,
				}}
				tool={["API Documentation", "Middleware Platform", "Monitoring Tools", "Testing Framework"]}
			/>
			<IntegrationPageContent page={page} />
		</>
	);
}
