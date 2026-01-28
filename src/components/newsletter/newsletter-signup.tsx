"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { Mail, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { trackNewsletterEvent } from "@/components/analytics";

const springTransition = {
	type: "spring" as const,
	stiffness: 100,
	damping: 20,
	mass: 1,
};

type FormStatus = "idle" | "submitting" | "success" | "error";

interface NewsletterSignupProps {
	/** Visual variant */
	variant?: "inline" | "card" | "minimal";
	/** Source for analytics tracking */
	source?: string;
	/** Custom className */
	className?: string;
	/** Show description text */
	showDescription?: boolean;
}

export function NewsletterSignup({
	variant = "card",
	source = "website",
	className,
	showDescription = true,
}: NewsletterSignupProps) {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<FormStatus>("idle");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email || !email.includes("@")) {
			setStatus("error");
			setErrorMessage("Please enter a valid email address");
			return;
		}

		setStatus("submitting");
		setErrorMessage(null);

		try {
			const result = await subscribeToNewsletter({ email, source });

			if (result.success) {
				setStatus("success");
				setEmail("");
				// Track newsletter signup for GA4 lead generation reports
				trackNewsletterEvent("newsletter_subscribe", {
					method: "email",
					source: source,
					location: variant,
				});
			} else {
				setStatus("error");
				setErrorMessage(result.error || "Something went wrong. Please try again.");
			}
		} catch {
			setStatus("error");
			setErrorMessage("Something went wrong. Please try again.");
		}
	};

	// Success state
	if (status === "success") {
		return (
			<m.div
				className={cn(
					"flex items-center gap-3 p-4",
					variant === "card" && "bg-gunmetal-glass/20 border-cyber-lime/20 border",
					className
				)}
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={springTransition}
			>
				<CheckCircle className="text-cyber-lime h-5 w-5 shrink-0" />
				<div>
					<p className="font-medium">You&apos;re in!</p>
					<p className="text-slate-text text-sm">Check your inbox to confirm your subscription.</p>
				</div>
			</m.div>
		);
	}

	// Card variant (for sidebar, footer)
	if (variant === "card") {
		return (
			<div
				className={cn(
					"bg-gunmetal-glass/20 border border-white/10 p-6 backdrop-blur-sm",
					className
				)}
			>
				<div className="mb-4 flex items-center gap-2">
					<Mail className="text-cyber-lime h-4 w-4" />
					<h3 className="font-mono text-sm tracking-tight">The Architect&apos;s Brief</h3>
				</div>

				{showDescription && (
					<p className="text-slate-text mb-4 text-sm leading-relaxed">
						One actionable technical insight every Tuesday. No fluff, just substance.
					</p>
				)}

				<form onSubmit={handleSubmit} className="space-y-3">
					<div className="relative">
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@company.com"
							disabled={status === "submitting"}
							className={cn(
								"w-full border bg-transparent px-4 py-3 font-mono text-sm transition-colors",
								"placeholder:text-slate-text/50",
								"focus:border-cyber-lime focus:outline-none",
								status === "error" ? "border-burnt-ember" : "border-white/20"
							)}
						/>
					</div>

					{status === "error" && errorMessage && (
						<div className="text-burnt-ember flex items-center gap-2 text-sm">
							<AlertCircle className="h-4 w-4 shrink-0" />
							<span>{errorMessage}</span>
						</div>
					)}

					<button
						type="submit"
						disabled={status === "submitting"}
						className={cn(
							"group flex w-full items-center justify-center gap-2 border px-4 py-3 font-mono text-sm transition-colors",
							"hover:border-cyber-lime hover:text-cyber-lime border-white/20",
							"disabled:cursor-not-allowed disabled:opacity-50"
						)}
					>
						{status === "submitting" ? (
							<span className="animate-pulse">Subscribing...</span>
						) : (
							<>
								<span>Subscribe</span>
								<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
							</>
						)}
					</button>
				</form>

				<p className="text-slate-text/60 mt-3 text-xs">Join 1,000+ CTOs and engineering leaders.</p>
			</div>
		);
	}

	// Inline variant (for blog posts)
	if (variant === "inline") {
		return (
			<div className={cn("my-8 border-y border-white/10 py-8", className)}>
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div>
						<h3 className="mb-1 font-mono text-sm tracking-tight">
							<Mail className="text-cyber-lime mr-2 inline h-4 w-4" />
							Get insights like this weekly
						</h3>
						{showDescription && (
							<p className="text-slate-text text-sm">
								Join The Architect&apos;s Brief — one actionable insight every Tuesday.
							</p>
						)}
					</div>

					<form onSubmit={handleSubmit} className="flex gap-2">
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@company.com"
							disabled={status === "submitting"}
							className={cn(
								"w-full border bg-transparent px-4 py-2 font-mono text-sm md:w-64",
								"placeholder:text-slate-text/50",
								"focus:border-cyber-lime focus:outline-none",
								status === "error" ? "border-burnt-ember" : "border-white/20"
							)}
						/>
						<button
							type="submit"
							disabled={status === "submitting"}
							className={cn(
								"shrink-0 border px-4 py-2 font-mono text-sm transition-colors",
								"hover:border-cyber-lime hover:text-cyber-lime border-white/20",
								"disabled:cursor-not-allowed disabled:opacity-50"
							)}
						>
							{status === "submitting" ? "..." : "Subscribe"}
						</button>
					</form>
				</div>

				{status === "error" && errorMessage && (
					<div className="text-burnt-ember mt-2 flex items-center gap-2 text-sm">
						<AlertCircle className="h-4 w-4 shrink-0" />
						<span>{errorMessage}</span>
					</div>
				)}
			</div>
		);
	}

	// Minimal variant (for footer)
	return (
		<form onSubmit={handleSubmit} className={cn("flex gap-2", className)}>
			<input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="you@company.com"
				disabled={status === "submitting"}
				className={cn(
					"w-full border bg-transparent px-3 py-2 font-mono text-sm",
					"placeholder:text-slate-text/50",
					"focus:border-cyber-lime focus:outline-none",
					status === "error" ? "border-burnt-ember" : "border-white/20"
				)}
			/>
			<button
				type="submit"
				disabled={status === "submitting"}
				className={cn(
					"shrink-0 border px-3 py-2 font-mono text-xs transition-colors",
					"hover:border-cyber-lime hover:text-cyber-lime border-white/20",
					"disabled:cursor-not-allowed disabled:opacity-50"
				)}
			>
				{status === "submitting" ? "..." : "Join"}
			</button>
		</form>
	);
}
