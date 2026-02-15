import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Privacy Policy",
	description:
		"Privacy Policy for alexmayhew.dev - How we handle your data and protect your privacy.",
};

export default function PrivacyPage() {
	return (
		<main className="min-h-dvh px-6 pt-44 pb-24 sm:px-12 md:px-24">
			<div className="mx-auto max-w-3xl">
				<h1 className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
					<span className="mr-2 animate-pulse">●</span>
					Legal
				</h1>
				<h2 className="mb-8 text-4xl font-bold tracking-tight md:text-5xl">Privacy Policy</h2>
				<p className="text-slate-text mb-12 text-sm">
					Last updated:{" "}
					{new Date().toLocaleDateString("en-US", {
						month: "long",
						day: "numeric",
						year: "numeric",
					})}
				</p>

				<div className="prose prose-invert max-w-none space-y-8">
					<section>
						<h3 className="text-cyber-lime mb-4 font-mono text-sm uppercase">Overview</h3>
						<p className="text-slate-text leading-relaxed">
							This Privacy Policy describes how alexmayhew.dev (&quot;we&quot;, &quot;us&quot;, or
							&quot;our&quot;) collects, uses, and protects your information when you visit our
							website. We are committed to protecting your privacy and being transparent about our
							data practices.
						</p>
					</section>

					<section>
						<h3 className="text-cyber-lime mb-4 font-mono text-sm uppercase">
							Information We Collect
						</h3>

						<h4 className="mt-6 mb-2 font-semibold">Contact Form Submissions</h4>
						<p className="text-slate-text mb-4 leading-relaxed">
							When you submit our contact form, we collect:
						</p>
						<ul className="text-slate-text mb-4 list-inside list-disc space-y-1">
							<li>Your name</li>
							<li>Email address</li>
							<li>Project type and budget range</li>
							<li>Your message content</li>
						</ul>
						<p className="text-slate-text leading-relaxed">
							This information is sent directly to our email and is used solely to respond to your
							inquiry. We do not store this data in any database or share it with third parties.
						</p>

						<h4 className="mt-6 mb-2 font-semibold">Analytics Data</h4>
						<p className="text-slate-text leading-relaxed">
							We use Cloudflare Web Analytics, a privacy-first analytics service that:
						</p>
						<ul className="text-slate-text mt-2 list-inside list-disc space-y-1">
							<li>Does not use cookies</li>
							<li>Does not track individual users</li>
							<li>Does not collect personal information</li>
							<li>Only collects aggregate, anonymous data (page views, referrers, browser type)</li>
						</ul>
					</section>

					<section>
						<h3 className="text-cyber-lime mb-4 font-mono text-sm uppercase">
							How We Use Your Information
						</h3>
						<ul className="text-slate-text list-inside list-disc space-y-2">
							<li>To respond to your contact form submissions</li>
							<li>
								To understand website traffic and improve user experience (via anonymous analytics)
							</li>
							<li>To protect our website from spam and abuse</li>
						</ul>
					</section>

					<section>
						<h3 className="text-cyber-lime mb-4 font-mono text-sm uppercase">
							Third-Party Services
						</h3>
						<p className="text-slate-text mb-4 leading-relaxed">
							We use the following third-party services:
						</p>
						<ul className="text-slate-text list-inside list-disc space-y-2">
							<li>
								<strong>Cloudflare:</strong> Website hosting, CDN, and analytics
							</li>
							<li>
								<strong>Resend:</strong> Email delivery for contact form submissions
							</li>
							<li>
								<strong>Cloudflare Turnstile:</strong> Bot protection (no tracking cookies)
							</li>
						</ul>
					</section>

					<section>
						<h3 className="text-cyber-lime mb-4 font-mono text-sm uppercase">Your Rights (GDPR)</h3>
						<p className="text-slate-text mb-4 leading-relaxed">
							If you are located in the European Economic Area (EEA), you have the right to:
						</p>
						<ul className="text-slate-text list-inside list-disc space-y-2">
							<li>Access the personal data we hold about you</li>
							<li>Request correction of inaccurate data</li>
							<li>Request deletion of your data</li>
							<li>Object to processing of your data</li>
							<li>Data portability</li>
						</ul>
						<p className="text-slate-text mt-4 leading-relaxed">
							To exercise these rights, please contact us at{" "}
							<a href="mailto:alex@alexmayhew.dev" className="text-cyber-lime hover:underline">
								alex@alexmayhew.dev
							</a>
						</p>
					</section>

					<section>
						<h3 className="text-cyber-lime mb-4 font-mono text-sm uppercase">Data Retention</h3>
						<p className="text-slate-text leading-relaxed">
							Contact form submissions are retained in our email for as long as necessary to respond
							to your inquiry and for our legitimate business purposes. We do not maintain a
							separate database of contact submissions.
						</p>
					</section>

					<section>
						<h3 className="text-cyber-lime mb-4 font-mono text-sm uppercase">Security</h3>
						<p className="text-slate-text leading-relaxed">
							We implement appropriate technical and organizational measures to protect your data,
							including:
						</p>
						<ul className="text-slate-text mt-2 list-inside list-disc space-y-1">
							<li>HTTPS encryption for all data transmission</li>
							<li>Bot protection to prevent abuse</li>
							<li>Rate limiting on form submissions</li>
							<li>Regular security headers and best practices</li>
						</ul>
					</section>

					<section>
						<h3 className="text-cyber-lime mb-4 font-mono text-sm uppercase">
							Changes to This Policy
						</h3>
						<p className="text-slate-text leading-relaxed">
							We may update this Privacy Policy from time to time. We will notify you of any changes
							by posting the new policy on this page and updating the &quot;Last updated&quot; date.
						</p>
					</section>

					<section>
						<h3 className="text-cyber-lime mb-4 font-mono text-sm uppercase">Contact</h3>
						<p className="text-slate-text leading-relaxed">
							If you have any questions about this Privacy Policy, please contact us at{" "}
							<a href="mailto:alex@alexmayhew.dev" className="text-cyber-lime hover:underline">
								alex@alexmayhew.dev
							</a>
						</p>
					</section>
				</div>

				<div className="mt-12 border-t border-white/10 pt-8">
					<Link
						href="/"
						className="text-slate-text hover:text-cyber-lime font-mono text-sm transition-colors"
					>
						← Back to Home
					</Link>
				</div>
			</div>
		</main>
	);
}
