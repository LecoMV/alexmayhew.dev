"use client";

import { useState, useRef } from "react";
import { m } from "framer-motion";
import { Send, Mail, MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitContactForm } from "@/app/actions/contact";
import { type ContactFormValues } from "@/lib/schemas/contact";
import { Turnstile, type TurnstileRef } from "@/components/ui/turnstile";
import { trackLeadEvent, trackEvent } from "@/components/analytics";

const springTransition = {
	type: "spring" as const,
	stiffness: 100,
	damping: 20,
	mass: 1,
};

const contactInfo = [
	{
		icon: Mail,
		label: "Email",
		value: "alex@alexmayhew.dev",
		href: "mailto:alex@alexmayhew.dev",
	},
	{
		icon: MapPin,
		label: "Location",
		value: "Remote / Worldwide",
	},
	{
		icon: Clock,
		label: "Response Time",
		value: "Within 24 hours",
	},
];

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactPage() {
	const [formStatus, setFormStatus] = useState<FormStatus>("idle");
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		projectType: "",
		budget: "",
		message: "",
		referralSource: "",
	});
	const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
	const turnstileRef = useRef<TurnstileRef>(null);
	const formStartTracked = useRef(false);

	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleFormStart = () => {
		if (formStartTracked.current) return;
		formStartTracked.current = true;
		trackEvent("form_start", {
			form_id: "contact",
			form_name: "consultation_request",
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!turnstileToken) {
			setFormStatus("error");
			setErrorMessage("Please complete the security check");
			return;
		}

		setFormStatus("submitting");
		setErrorMessage(null);

		const result = await submitContactForm({
			...formData,
			referralSource: formData.referralSource || undefined,
			turnstileToken,
		} as ContactFormValues);

		if (result.success) {
			setFormStatus("success");
			// Track lead generation using GA4 2026 best practices
			trackLeadEvent("generate_lead", {
				lead_source: "contact_form",
				project_type: formData.projectType,
				budget_range: formData.budget,
				form_type: "consultation_request",
				referral_source: formData.referralSource || "not_specified",
			});
		} else {
			setFormStatus("error");
			setErrorMessage(result.error || "Something went wrong");
			// Reset turnstile on error
			turnstileRef.current?.reset();
			setTurnstileToken(null);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	return (
		<main className="min-h-screen px-6 pt-44 pb-24 sm:px-12 md:px-24">
			<div className="mx-auto max-w-[1400px]">
				{/* Header */}
				<m.div
					className="mb-16"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={springTransition}
				>
					<h1 className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
						<span className="mr-2 animate-pulse" aria-hidden="true">
							●
						</span>
						Contact
					</h1>
					<h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
						Initialize
						<br />
						<span className="text-slate-text">Connection.</span>
					</h2>
					<p className="text-slate-text max-w-2xl text-lg">
						Ready to architect something exceptional? Initiate a transmission to discuss a potential
						partnership.
					</p>
				</m.div>

				<div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
					{/* Contact Form */}
					<m.div
						className="lg:col-span-7"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ ...springTransition, delay: 0.1 }}
					>
						<form onSubmit={handleSubmit} onFocus={handleFormStart} className="space-y-6">
							{/* Name & Email Row */}
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<div>
									<label
										htmlFor="name"
										className="text-slate-text mb-2 block font-mono text-xs tracking-wider uppercase"
									>
										Name
									</label>
									<input
										type="text"
										id="name"
										name="name"
										required
										value={formData.name}
										onChange={handleChange}
										className="bg-gunmetal-glass/20 focus:border-cyber-lime text-mist-white w-full border border-white/10 px-4 py-3 font-mono text-sm backdrop-blur-sm transition-colors duration-300 placeholder:text-white/30 focus:outline-none"
										placeholder="Your name"
									/>
								</div>
								<div>
									<label
										htmlFor="email"
										className="text-slate-text mb-2 block font-mono text-xs tracking-wider uppercase"
									>
										Email
									</label>
									<input
										type="email"
										id="email"
										name="email"
										required
										value={formData.email}
										onChange={handleChange}
										className="bg-gunmetal-glass/20 focus:border-cyber-lime text-mist-white w-full border border-white/10 px-4 py-3 font-mono text-sm backdrop-blur-sm transition-colors duration-300 placeholder:text-white/30 focus:outline-none"
										placeholder="your@email.com"
									/>
								</div>
							</div>

							{/* Project Type & Budget Row */}
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<div>
									<label
										htmlFor="projectType"
										className="text-slate-text mb-2 block font-mono text-xs tracking-wider uppercase"
									>
										Project Type
									</label>
									<select
										id="projectType"
										name="projectType"
										required
										value={formData.projectType}
										onChange={handleChange}
										className="bg-gunmetal-glass/20 focus:border-cyber-lime text-mist-white w-full border border-white/10 px-4 py-3 font-mono text-sm backdrop-blur-sm transition-colors duration-300 focus:outline-none"
									>
										<option value="" className="bg-void-navy">
											Select type...
										</option>
										<option value="web-app" className="bg-void-navy">
											Web Application
										</option>
										<option value="saas" className="bg-void-navy">
											SaaS Platform
										</option>
										<option value="ecommerce" className="bg-void-navy">
											E-Commerce
										</option>
										<option value="consulting" className="bg-void-navy">
											Technical Consulting
										</option>
										<option value="other" className="bg-void-navy">
											Other
										</option>
									</select>
								</div>
								<div>
									<label
										htmlFor="budget"
										className="text-slate-text mb-2 block font-mono text-xs tracking-wider uppercase"
									>
										Budget Range
									</label>
									<select
										id="budget"
										name="budget"
										required
										value={formData.budget}
										onChange={handleChange}
										className="bg-gunmetal-glass/20 focus:border-cyber-lime text-mist-white w-full border border-white/10 px-4 py-3 font-mono text-sm backdrop-blur-sm transition-colors duration-300 focus:outline-none"
									>
										<option value="" className="bg-void-navy">
											Select range...
										</option>
										<option value="5k-10k" className="bg-void-navy">
											$5,000 - $10,000
										</option>
										<option value="10k-25k" className="bg-void-navy">
											$10,000 - $25,000
										</option>
										<option value="25k-50k" className="bg-void-navy">
											$25,000 - $50,000
										</option>
										<option value="50k+" className="bg-void-navy">
											$50,000+
										</option>
									</select>
								</div>
							</div>

							{/* Referral Source */}
							<div>
								<label
									htmlFor="referralSource"
									className="text-slate-text mb-2 block font-mono text-xs tracking-wider uppercase"
								>
									How did you hear about us?
								</label>
								<select
									id="referralSource"
									name="referralSource"
									value={formData.referralSource}
									onChange={handleChange}
									className="bg-gunmetal-glass/20 focus:border-cyber-lime text-mist-white w-full border border-white/10 px-4 py-3 font-mono text-sm backdrop-blur-sm transition-colors duration-300 focus:outline-none"
								>
									<option value="" className="bg-void-navy">
										Select source...
									</option>
									<option value="google" className="bg-void-navy">
										Google Search
									</option>
									<option value="blog" className="bg-void-navy">
										Blog Post
									</option>
									<option value="linkedin" className="bg-void-navy">
										LinkedIn
									</option>
									<option value="x-twitter" className="bg-void-navy">
										X/Twitter
									</option>
									<option value="referral" className="bg-void-navy">
										Referral
									</option>
									<option value="devto" className="bg-void-navy">
										Dev.to
									</option>
									<option value="other" className="bg-void-navy">
										Other
									</option>
								</select>
							</div>

							{/* Message */}
							<div>
								<label
									htmlFor="message"
									className="text-slate-text mb-2 block font-mono text-xs tracking-wider uppercase"
								>
									Message
								</label>
								<textarea
									id="message"
									name="message"
									required
									rows={6}
									value={formData.message}
									onChange={handleChange}
									className="bg-gunmetal-glass/20 focus:border-cyber-lime text-mist-white w-full resize-none border border-white/10 px-4 py-3 font-mono text-sm backdrop-blur-sm transition-colors duration-300 placeholder:text-white/30 focus:outline-none"
									placeholder="Describe your project, goals, and timeline..."
								/>
							</div>

							{/* Turnstile Bot Protection */}
							<div>
								<Turnstile
									ref={turnstileRef}
									onSuccess={(token) => setTurnstileToken(token)}
									onError={() => {
										setTurnstileToken(null);
										setErrorMessage("Security check failed. Please try again.");
									}}
									onExpire={() => setTurnstileToken(null)}
								/>
							</div>

							{/* Submit Button */}
							<button
								type="submit"
								disabled={formStatus === "submitting" || formStatus === "success"}
								className={cn(
									"group hover:border-cyber-lime relative flex w-full items-center justify-center gap-3 border border-white/20 px-6 py-4 transition-colors duration-300 md:w-auto",
									formStatus === "submitting" && "cursor-wait opacity-70",
									formStatus === "success" && "border-cyber-lime cursor-default"
								)}
							>
								{formStatus === "idle" && (
									<>
										<span className="group-hover:text-cyber-lime font-mono text-sm tracking-tight transition-colors">
											TRANSMIT_MESSAGE()
										</span>
										<Send
											className="text-slate-text group-hover:text-cyber-lime h-4 w-4 transition-colors duration-300"
											strokeWidth={1.5}
										/>
									</>
								)}
								{formStatus === "submitting" && (
									<>
										<span className="font-mono text-sm tracking-tight">TRANSMITTING...</span>
										<div className="bg-cyber-lime h-4 w-4 animate-pulse" />
									</>
								)}
								{formStatus === "success" && (
									<>
										<span className="text-cyber-lime font-mono text-sm tracking-tight">
											TRANSMISSION_COMPLETE
										</span>
										<CheckCircle className="text-cyber-lime h-4 w-4" strokeWidth={1.5} />
									</>
								)}
								{formStatus === "error" && (
									<>
										<span className="text-burnt-ember font-mono text-sm tracking-tight">
											TRANSMISSION_FAILED
										</span>
										<AlertCircle className="text-burnt-ember h-4 w-4" strokeWidth={1.5} />
									</>
								)}
								<m.div
									className="bg-cyber-lime/5 absolute inset-0"
									initial={{ opacity: 0 }}
									whileHover={{ opacity: 1 }}
									transition={{ duration: 0.3 }}
								/>
							</button>

							{/* Success Message */}
							{formStatus === "success" && (
								<m.p
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									className="text-cyber-lime font-mono text-sm"
								>
									Message received. I&apos;ll respond within 24 hours.
								</m.p>
							)}

							{/* Error Message */}
							{formStatus === "error" && errorMessage && (
								<m.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									className="flex items-center gap-4"
									role="alert"
								>
									<p className="text-burnt-ember font-mono text-sm">{errorMessage}</p>
									<button
										type="button"
										onClick={() => setFormStatus("idle")}
										className="text-slate-text hover:text-cyber-lime font-mono text-xs underline transition-colors"
									>
										RETRY()
									</button>
								</m.div>
							)}
						</form>
					</m.div>

					{/* Contact Info Sidebar */}
					<m.div
						className="lg:col-span-5"
						initial={{ opacity: 0, x: 30 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ ...springTransition, delay: 0.2 }}
					>
						<div className="bg-gunmetal-glass/20 relative border border-white/10 p-6 backdrop-blur-sm">
							<div className="border-cyber-lime absolute top-0 right-0 h-4 w-4 border-t border-r" />
							<div className="border-cyber-lime absolute bottom-0 left-0 h-4 w-4 border-b border-l" />

							<h3 className="text-cyber-lime mb-6 font-mono text-xs tracking-wider uppercase">
								<span className="mr-2" aria-hidden="true">
									●
								</span>
								Direct Channels
							</h3>

							<div className="space-y-6">
								{contactInfo.map((info) => (
									<div key={info.label} className="flex items-start gap-4">
										<info.icon className="text-cyber-lime mt-0.5 h-5 w-5" strokeWidth={1.5} />
										<div>
											<p className="text-slate-text mb-1 font-mono text-xs uppercase">
												{info.label}
											</p>
											{info.href ? (
												<a
													href={info.href}
													className="hover:text-cyber-lime font-mono text-sm transition-colors duration-300"
												>
													{info.value}
												</a>
											) : (
												<p className="font-mono text-sm">{info.value}</p>
											)}
										</div>
									</div>
								))}
							</div>

							{/* Availability Status */}
							<div className="mt-8 border-t border-white/10 pt-6">
								<div className="flex items-center gap-3">
									<div className="bg-cyber-lime h-2 w-2 animate-pulse" aria-hidden="true" />
									<p className="text-slate-text font-mono text-xs">Accepting select engagements</p>
								</div>
							</div>
						</div>

						{/* Quick Response Promise */}
						<div className="bg-gunmetal-glass/10 mt-6 border border-white/10 p-6 backdrop-blur-sm">
							<p className="text-slate-text text-sm leading-relaxed">
								<span className="text-cyber-lime font-mono text-xs">Note:</span> For urgent
								inquiries or quick questions, feel free to reach out directly via email. I typically
								respond within a few hours during business days.
							</p>
						</div>
					</m.div>
				</div>
			</div>
		</main>
	);
}
