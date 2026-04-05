"use client";

import { m } from "framer-motion";
import { AlertCircle, CheckCircle, Clock, Mail, MapPin, Send } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import { type ContactFormState, submitContactAction } from "@/app/actions/contact";
import { trackEvent, trackLeadEvent } from "@/components/analytics";
import { Turnstile, type TurnstileRef } from "@/components/ui/turnstile";
import { springTransition } from "@/lib/motion-constants";
import { cn } from "@/lib/utils";

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

const initialState: ContactFormState = { success: false };

function ContactSubmitButton({ success }: { success: boolean }) {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			disabled={pending || success}
			className={cn(
				"group hover:border-cyber-lime relative flex w-full items-center justify-center gap-3 border border-white/20 px-6 py-4 transition-colors duration-300 md:w-auto",
				pending && "cursor-wait opacity-70",
				success && "border-cyber-lime cursor-default"
			)}
		>
			{!pending && !success && (
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
			{pending && (
				<>
					<span className="font-mono text-sm tracking-tight">TRANSMITTING...</span>
					<div className="bg-cyber-lime h-4 w-4 animate-pulse" />
				</>
			)}
			{success && (
				<>
					<span className="text-cyber-lime font-mono text-sm tracking-tight">
						TRANSMISSION_COMPLETE
					</span>
					<CheckCircle className="text-cyber-lime h-4 w-4" strokeWidth={1.5} />
				</>
			)}
			<m.div
				className="bg-cyber-lime/5 absolute inset-0"
				initial={{ opacity: 0 }}
				whileHover={{ opacity: 1 }}
				transition={{ duration: 0.3 }}
			/>
		</button>
	);
}

export function ContactPage() {
	const [state, formAction] = useActionState(submitContactAction, initialState);
	const turnstileRef = useRef<TurnstileRef>(null);
	const formStartTracked = useRef(false);
	const prevSuccess = useRef(false);

	// Track lead on success
	useEffect(() => {
		if (state.success && !prevSuccess.current) {
			prevSuccess.current = true;
			trackLeadEvent("generate_lead", {
				lead_source: "contact_form",
				project_type: "unknown",
				budget_range: "unknown",
				form_type: "consultation_request",
				referral_source: "not_specified",
			});
		}
	}, [state.success]);

	// Reset turnstile on error
	useEffect(() => {
		if (state.error) {
			turnstileRef.current?.reset();
		}
	}, [state.error]);

	const handleFormStart = () => {
		if (formStartTracked.current) return;
		formStartTracked.current = true;
		trackEvent("form_start", {
			form_id: "contact",
			form_name: "consultation_request",
		});
	};

	return (
		<section className="flex-1 px-6 pt-44 pb-24 sm:px-12 md:px-24">
			<div className="max-w-content mx-auto">
				{/* Header */}
				<m.div
					className="mb-16"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={springTransition}
				>
					<p className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
						<span className="mr-2 animate-pulse" aria-hidden="true">
							●
						</span>
						Contact
					</p>
					<h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
						Initialize
						<br />
						<span className="text-slate-text">Connection.</span>
					</h1>
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
						<form action={formAction} onFocus={handleFormStart} className="space-y-6">
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
										className="bg-gunmetal-glass/20 focus:border-cyber-lime focus-visible:ring-cyber-lime text-mist-white w-full border border-white/10 px-4 py-3 font-mono text-sm backdrop-blur-sm transition-colors duration-300 placeholder:text-white/30 focus:outline-none focus-visible:ring-2"
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
										className="bg-gunmetal-glass/20 focus:border-cyber-lime focus-visible:ring-cyber-lime text-mist-white w-full border border-white/10 px-4 py-3 font-mono text-sm backdrop-blur-sm transition-colors duration-300 placeholder:text-white/30 focus:outline-none focus-visible:ring-2"
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
										defaultValue=""
										className="bg-gunmetal-glass/20 focus:border-cyber-lime focus-visible:ring-cyber-lime text-mist-white w-full border border-white/10 px-4 py-3 font-mono text-sm backdrop-blur-sm transition-colors duration-300 focus:outline-none focus-visible:ring-2"
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
										defaultValue=""
										className="bg-gunmetal-glass/20 focus:border-cyber-lime focus-visible:ring-cyber-lime text-mist-white w-full border border-white/10 px-4 py-3 font-mono text-sm backdrop-blur-sm transition-colors duration-300 focus:outline-none focus-visible:ring-2"
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
										<option value="not-sure" className="bg-void-navy">
											Not sure yet
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
									How did you find me?
								</label>
								<select
									id="referralSource"
									name="referralSource"
									defaultValue=""
									className="bg-gunmetal-glass/20 focus:border-cyber-lime focus-visible:ring-cyber-lime text-mist-white w-full border border-white/10 px-4 py-3 font-mono text-sm backdrop-blur-sm transition-colors duration-300 focus:outline-none focus-visible:ring-2"
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
									className="bg-gunmetal-glass/20 focus:border-cyber-lime focus-visible:ring-cyber-lime text-mist-white w-full resize-none border border-white/10 px-4 py-3 font-mono text-sm backdrop-blur-sm transition-colors duration-300 placeholder:text-white/30 focus:outline-none focus-visible:ring-2"
									placeholder="Describe your project, goals, and timeline..."
								/>
							</div>

							{/* Turnstile Bot Protection ... token piped via hidden input */}
							<div>
								<Turnstile
									ref={turnstileRef}
									onSuccess={(token) => {
										const hidden = document.getElementById(
											"turnstileToken"
										) as HTMLInputElement | null;
										if (hidden) hidden.value = token;
									}}
									onError={() => {
										const hidden = document.getElementById(
											"turnstileToken"
										) as HTMLInputElement | null;
										if (hidden) hidden.value = "";
									}}
									onExpire={() => {
										const hidden = document.getElementById(
											"turnstileToken"
										) as HTMLInputElement | null;
										if (hidden) hidden.value = "";
									}}
								/>
								<input type="hidden" id="turnstileToken" name="turnstileToken" defaultValue="" />
							</div>

							{/* Submit Button */}
							<ContactSubmitButton success={state.success} />

							{/* Success Message */}
							{state.success && (
								<m.p
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									className="text-cyber-lime font-mono text-sm"
								>
									Message received. I&apos;ll respond within 24 hours.
								</m.p>
							)}

							{/* Error Message */}
							{state.error && (
								<m.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									className="flex items-center gap-4"
									role="alert"
								>
									<AlertCircle className="text-burnt-ember h-4 w-4 shrink-0" strokeWidth={1.5} />
									<p className="text-burnt-ember font-mono text-sm">{state.error}</p>
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
		</section>
	);
}
