import Link from "next/link";

import { JsonLdScript, PERSON_REF, SCHEMA_CONTEXT, SITE_URL } from "@/components/seo/schema-utils";
import {
	resumeEducation,
	resumeMeta,
	resumeRoles,
	resumeSkills,
	resumeSummary,
} from "@/data/resume";
import { publicEnv } from "@/lib/env";

import type { Metadata } from "next";

const PAGE_DESCRIPTION =
	"Resume of Alex Mayhew, technology specialist: web development, SEO, automation, applied AI, and solar PV design. Nine years running technology for a Massachusetts solar company; now building products and available for remote work.";

export const metadata: Metadata = {
	title: "Resume",
	description: PAGE_DESCRIPTION,
	openGraph: {
		title: "Resume | Alex Mayhew",
		description: PAGE_DESCRIPTION,
		type: "profile",
		images: [{ url: "/og-image-2026.png", width: 1200, height: 630, alt: "Alex Mayhew resume" }],
	},
	twitter: {
		card: "summary_large_image",
		title: "Resume | Alex Mayhew",
		description: PAGE_DESCRIPTION,
		images: ["/og-image-2026.png"],
	},
	alternates: { canonical: "/resume" },
};

function ResumeProfileJsonLd() {
	const modified =
		publicEnv.NEXT_PUBLIC_BUILD_TIME?.split("T")[0] || new Date().toISOString().split("T")[0];
	const schema = {
		"@context": SCHEMA_CONTEXT,
		"@type": "ProfilePage",
		"@id": `${SITE_URL}/resume`,
		url: `${SITE_URL}/resume`,
		name: "Alex Mayhew — Resume",
		description: PAGE_DESCRIPTION,
		mainEntity: PERSON_REF,
		dateModified: modified,
	};
	return <JsonLdScript data={schema} />;
}

export default function Page() {
	return (
		<>
			<ResumeProfileJsonLd />
			<main className="page-layout">
				<div className="mx-auto max-w-3xl">
					<header className="mb-10 border-b border-white/10 pb-8">
						<p className="text-cyber-lime mb-3 font-mono text-xs tracking-wider uppercase">
							<span className="mr-2 animate-pulse" aria-hidden="true">
								●
							</span>
							Resume
						</p>
						<h1 className="mb-2 text-4xl font-bold tracking-tight md:text-5xl">
							{resumeMeta.name}
						</h1>
						<p className="text-slate-text font-mono text-sm md:text-base">{resumeMeta.headline}</p>
						<p className="text-slate-text mt-4 font-mono text-xs md:text-sm">
							{resumeMeta.location} · {resumeMeta.remote} · {resumeMeta.email}
						</p>
						<p className="text-cyber-lime mt-3 text-sm">{resumeMeta.availability}</p>
						<div className="mt-6 flex flex-wrap gap-4">
							<a
								href={resumeMeta.pdfPath}
								className="group hover:border-cyber-lime border border-white/20 px-5 py-2.5 font-mono text-sm transition-colors"
							>
								<span className="group-hover:text-cyber-lime transition-colors">
									Download PDF →
								</span>
							</a>
							<Link
								href="/contact"
								className="text-slate-text hover:text-cyber-lime font-mono text-sm underline-offset-4 hover:underline"
							>
								Get in touch
							</Link>
						</div>
					</header>

					<section className="mb-10">
						<p className="text-mist-white text-lg leading-relaxed">{resumeSummary}</p>
					</section>

					<section className="mb-10">
						<h2 className="text-cyber-lime mb-6 font-mono text-xs tracking-wider uppercase">
							Experience
						</h2>
						<div className="space-y-8">
							{resumeRoles.map((role) => (
								<article key={role.org}>
									<h3 className="text-mist-white text-lg font-bold">{role.title}</h3>
									<p className="text-slate-text font-mono text-sm">
										{role.org} · {role.location}
									</p>
									<p className="text-slate-text mb-3 font-mono text-xs">
										{role.start} – {role.end}
									</p>
									<ul className="space-y-2">
										{role.bullets.map((bullet, index) => (
											<li
												key={index}
												className="text-slate-text flex gap-2 text-sm leading-relaxed"
											>
												<span className="text-cyber-lime mt-1 shrink-0" aria-hidden="true">
													▹
												</span>
												<span>{bullet}</span>
											</li>
										))}
									</ul>
								</article>
							))}
						</div>
					</section>

					<section className="mb-10">
						<h2 className="text-cyber-lime mb-6 font-mono text-xs tracking-wider uppercase">
							Skills
						</h2>
						<dl className="space-y-3">
							{resumeSkills.map((group) => (
								<div key={group.label} className="grid grid-cols-1 gap-1 md:grid-cols-4">
									<dt className="text-mist-white font-mono text-sm md:col-span-1">{group.label}</dt>
									<dd className="text-slate-text text-sm md:col-span-3">{group.items}</dd>
								</div>
							))}
						</dl>
					</section>

					<section>
						<h2 className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
							Education
						</h2>
						<p className="text-slate-text text-sm leading-relaxed">{resumeEducation}</p>
					</section>
				</div>
			</main>
		</>
	);
}
