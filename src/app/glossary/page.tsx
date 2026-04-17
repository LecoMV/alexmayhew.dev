import Link from "next/link";

import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { JsonLdScript, SCHEMA_CONTEXT, SITE_URL } from "@/components/seo/schema-utils";
import { getGlossaryEntry, glossary } from "@/data/glossary";

import type { GlossaryEntry } from "@/data/glossary";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Glossary | Alex Mayhew",
	description:
		"Definitions for terms coined across the alexmayhew.dev blog: Cognitive Debt, Generative Debt, METR Paradox, Lambda Tax, the 50% Rule, and more.",
	openGraph: {
		title: "Glossary | Alex Mayhew",
		description:
			"Definitions for original engineering-leadership and architecture terms from the alexmayhew.dev blog.",
		type: "website",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Alex Mayhew - Glossary",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Glossary | Alex Mayhew",
		description:
			"Definitions for original engineering-leadership and architecture terms from the alexmayhew.dev blog.",
		images: ["/og-image.png"],
	},
	alternates: {
		canonical: "/glossary",
	},
};

function DefinedTermSetJsonLd({ entries }: { entries: GlossaryEntry[] }) {
	const schema = {
		"@context": SCHEMA_CONTEXT,
		"@type": "DefinedTermSet",
		"@id": `${SITE_URL}/glossary`,
		name: "Alex Mayhew Engineering Glossary",
		description:
			"Original terms coined across the alexmayhew.dev blog covering engineering leadership, AI-assisted development, and SaaS architecture.",
		url: `${SITE_URL}/glossary`,
		hasDefinedTerm: entries.map((entry) => ({
			"@type": "DefinedTerm",
			"@id": `${SITE_URL}/glossary#${entry.slug}`,
			name: entry.term,
			termCode: entry.slug,
			description: entry.fullDefinition,
			inDefinedTermSet: `${SITE_URL}/glossary`,
			url: `${SITE_URL}/glossary#${entry.slug}`,
		})),
	};
	return <JsonLdScript data={schema} />;
}

function sortAlphabetically(entries: GlossaryEntry[]): GlossaryEntry[] {
	return [...entries].sort((a, b) =>
		a.term.replace(/^The\s+/i, "").localeCompare(b.term.replace(/^The\s+/i, ""))
	);
}

export default function GlossaryPage() {
	const entries = sortAlphabetically(glossary);

	return (
		<>
			<DefinedTermSetJsonLd entries={entries} />
			<BreadcrumbJsonLd
				items={[
					{ name: "Home", url: "/" },
					{ name: "Glossary", url: "/glossary" },
				]}
			/>

			<main className="text-mist-white mx-auto min-h-screen max-w-4xl px-6 py-24">
				<nav aria-label="Breadcrumb" className="text-slate-text mb-8 font-mono text-xs">
					<ol className="flex items-center gap-2">
						<li>
							<Link
								href="/"
								className="hover:text-cyber-lime focus:ring-cyber-lime focus:ring-2 focus:outline-none"
							>
								Home
							</Link>
						</li>
						<li aria-hidden="true">/</li>
						<li aria-current="page" className="text-mist-white">
							Glossary
						</li>
					</ol>
				</nav>

				<header className="mb-16 border-b border-white/10 pb-10">
					<p className="text-cyber-lime mb-4 font-mono text-xs tracking-widest uppercase">
						Reference
					</p>
					<h1 className="text-mist-white mb-6 font-mono text-4xl font-bold tracking-tight md:text-5xl">
						Glossary
					</h1>
					<p className="text-slate-text max-w-2xl text-lg leading-relaxed">
						Original terms coined across the alexmayhew.dev blog. Concepts that come up often enough
						in consulting calls and founder conversations to deserve their own entry. Each term
						links to the blog posts where it first appeared.
					</p>
				</header>

				<nav aria-label="Glossary terms index" className="mb-16">
					<p className="text-slate-text mb-3 font-mono text-xs tracking-widest uppercase">
						Jump to term
					</p>
					<ul className="flex flex-wrap gap-2 font-mono text-sm">
						{entries.map((entry) => (
							<li key={entry.slug}>
								<a
									href={`#${entry.slug}`}
									className="text-mist-white hover:border-cyber-lime hover:text-cyber-lime focus:border-cyber-lime focus:text-cyber-lime focus:ring-cyber-lime inline-block border border-white/10 px-3 py-1.5 transition-colors focus:ring-2 focus:outline-none"
								>
									{entry.term}
								</a>
							</li>
						))}
					</ul>
				</nav>

				<div className="space-y-20">
					{entries.map((entry) => (
						<article
							key={entry.slug}
							id={entry.slug}
							className="scroll-mt-24 border-t border-white/10 pt-10"
						>
							<h2 className="text-cyber-lime mb-3 font-mono text-2xl font-bold tracking-tight md:text-3xl">
								{entry.term}
							</h2>
							<p className="text-mist-white mb-6 font-mono text-sm leading-relaxed">
								{entry.oneLineDefinition}
							</p>

							<div className="border-cyber-lime/40 text-slate-text mb-6 border-l-2 pl-4 text-base leading-relaxed">
								<p>{entry.fullDefinition}</p>
							</div>

							<dl className="text-slate-text grid gap-4 font-mono text-xs md:grid-cols-2">
								<div>
									<dt className="text-mist-white mb-1 tracking-widest uppercase">First used</dt>
									<dd>
										<time dateTime={entry.firstUsed}>{entry.firstUsed}</time>
									</dd>
								</div>

								{entry.relatedTerms.length > 0 && (
									<div>
										<dt className="text-mist-white mb-1 tracking-widest uppercase">Related</dt>
										<dd>
											<ul className="flex flex-wrap gap-x-3 gap-y-1">
												{entry.relatedTerms.map((relatedSlug) => {
													const related = getGlossaryEntry(relatedSlug);
													if (!related) return null;
													return (
														<li key={relatedSlug}>
															<a
																href={`#${related.slug}`}
																className="text-mist-white hover:text-cyber-lime focus:ring-cyber-lime focus:ring-2 focus:outline-none"
															>
																{related.term}
															</a>
														</li>
													);
												})}
											</ul>
										</dd>
									</div>
								)}

								<div className="md:col-span-2">
									<dt className="text-mist-white mb-1 tracking-widest uppercase">Cited in</dt>
									<dd>
										<ul className="flex flex-wrap gap-x-3 gap-y-1">
											{entry.citedInPosts.map((postSlug) => (
												<li key={postSlug}>
													<Link
														href={`/blog/${postSlug}`}
														className="text-mist-white hover:text-cyber-lime hover:decoration-cyber-lime focus:ring-cyber-lime underline decoration-white/20 underline-offset-2 focus:ring-2 focus:outline-none"
													>
														/blog/{postSlug}
													</Link>
												</li>
											))}
										</ul>
									</dd>
								</div>
							</dl>
						</article>
					))}
				</div>

				<footer className="text-slate-text mt-24 border-t border-white/10 pt-10 text-sm">
					<p>
						Missing a term?{" "}
						<Link
							href="/contact"
							className="text-cyber-lime focus:ring-cyber-lime hover:underline focus:ring-2 focus:outline-none"
						>
							Tell me
						</Link>
						.
					</p>
				</footer>
			</main>
		</>
	);
}
