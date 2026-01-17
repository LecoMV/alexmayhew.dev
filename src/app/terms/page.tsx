import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Terms of Service",
	description:
		"Terms of Service for alexmayhew.dev - Terms and conditions for using our website and services.",
};

export default function TermsPage() {
	return (
		<main className="min-h-screen px-6 pt-44 pb-24 sm:px-12 md:px-24">
			<div className="mx-auto max-w-3xl">
				<h1 className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
					<span className="mr-2 animate-pulse">●</span>
					Legal
				</h1>
				<h2 className="mb-8 text-4xl font-bold tracking-tight md:text-5xl">Terms of Service</h2>
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
						<h3 className="text-cyber-lime mb-4 font-mono text-sm uppercase">Agreement to Terms</h3>
						<p className="text-slate-text leading-relaxed">
							By accessing or using alexmayhew.dev, you agree to be bound by these Terms of Service.
							If you disagree with any part of these terms, you may not access the website.
						</p>
					</section>

					<section>
						<h3 className="text-cyber-lime mb-4 font-mono text-sm uppercase">
							Intellectual Property
						</h3>
						<p className="text-slate-text leading-relaxed">
							The content on this website, including text, graphics, logos, and code examples in
							blog posts, is the property of Alex Mayhew unless otherwise stated. You may not
							reproduce, distribute, or create derivative works without explicit permission.
						</p>
						<p className="text-slate-text mt-4 leading-relaxed">
							Code snippets shared in blog posts and documentation are provided under the MIT
							License unless otherwise specified, and may be used freely in your own projects.
						</p>
					</section>

					<section>
						<h3 className="text-cyber-lime mb-4 font-mono text-sm uppercase">Use of Website</h3>
						<p className="text-slate-text mb-4 leading-relaxed">You agree not to:</p>
						<ul className="text-slate-text list-inside list-disc space-y-2">
							<li>Use the website for any unlawful purpose</li>
							<li>Attempt to gain unauthorized access to any part of the website</li>
							<li>Submit false or misleading information through the contact form</li>
							<li>Use automated systems to scrape or collect data from the website</li>
							<li>Interfere with the proper functioning of the website</li>
						</ul>
					</section>

					<section>
						<h3 className="text-cyber-lime mb-4 font-mono text-sm uppercase">Freelance Services</h3>
						<p className="text-slate-text leading-relaxed">
							Any freelance development services engaged through this website will be subject to a
							separate agreement. The contact form is for inquiries only and does not constitute a
							binding contract.
						</p>
						<p className="text-slate-text mt-4 leading-relaxed">
							Project quotes, timelines, and deliverables will be formalized in a written contract
							before work begins.
						</p>
					</section>

					<section>
						<h3 className="text-cyber-lime mb-4 font-mono text-sm uppercase">Disclaimer</h3>
						<p className="text-slate-text leading-relaxed">
							This website is provided &quot;as is&quot; without any warranties, expressed or
							implied. We do not guarantee that the website will be available at all times or that
							it will be free of errors.
						</p>
						<p className="text-slate-text mt-4 leading-relaxed">
							Blog posts, tutorials, and code examples are provided for educational purposes. We are
							not responsible for any damages resulting from the use of information or code found on
							this website.
						</p>
					</section>

					<section>
						<h3 className="text-cyber-lime mb-4 font-mono text-sm uppercase">
							Limitation of Liability
						</h3>
						<p className="text-slate-text leading-relaxed">
							To the maximum extent permitted by law, Alex Mayhew shall not be liable for any
							indirect, incidental, special, consequential, or punitive damages resulting from your
							use of this website.
						</p>
					</section>

					<section>
						<h3 className="text-cyber-lime mb-4 font-mono text-sm uppercase">External Links</h3>
						<p className="text-slate-text leading-relaxed">
							This website may contain links to external websites. We are not responsible for the
							content or privacy practices of these external sites.
						</p>
					</section>

					<section>
						<h3 className="text-cyber-lime mb-4 font-mono text-sm uppercase">Changes to Terms</h3>
						<p className="text-slate-text leading-relaxed">
							We reserve the right to modify these terms at any time. Changes will be effective
							immediately upon posting to this page. Your continued use of the website after changes
							constitutes acceptance of the new terms.
						</p>
					</section>

					<section>
						<h3 className="text-cyber-lime mb-4 font-mono text-sm uppercase">Governing Law</h3>
						<p className="text-slate-text leading-relaxed">
							These terms shall be governed by and construed in accordance with applicable laws,
							without regard to conflict of law principles.
						</p>
					</section>

					<section>
						<h3 className="text-cyber-lime mb-4 font-mono text-sm uppercase">Contact</h3>
						<p className="text-slate-text leading-relaxed">
							If you have any questions about these Terms of Service, please contact us at{" "}
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
