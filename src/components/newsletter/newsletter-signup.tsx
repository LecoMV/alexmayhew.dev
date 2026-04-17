"use client";

import { m } from "framer-motion";
import { AlertCircle, ArrowRight, CheckCircle, Mail } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";

import { type NewsletterFormState, subscribeNewsletterAction } from "@/app/actions/newsletter";
import { trackNewsletterEvent, trackSignUp } from "@/components/analytics";
import { Turnstile, type TurnstileRef } from "@/components/ui/turnstile";
import { springTransition } from "@/lib/motion-constants";
import { cn } from "@/lib/utils";

import { SubmitButton } from "./submit-button";

interface NewsletterSignupProps {
	variant?: "inline" | "card" | "minimal";
	source?: string;
	className?: string;
	showDescription?: boolean;
}

const initialState: NewsletterFormState = { success: false };

// Stable token handler factory. Each form variant gets its own hidden input
// id so multiple instances on one page (footer + card) don't collide.
function tokenHandlers(hiddenInputId: string) {
	const set = (value: string) => {
		const hidden =
			typeof document !== "undefined"
				? (document.getElementById(hiddenInputId) as HTMLInputElement | null)
				: null;
		if (hidden) hidden.value = value;
	};
	return {
		onSuccess: (token: string) => set(token),
		onError: () => set(""),
		onExpire: () => set(""),
	};
}

interface SuccessPanelProps {
	variant: NonNullable<NewsletterSignupProps["variant"]>;
	className?: string;
}

function SuccessPanel({ variant, className }: SuccessPanelProps) {
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

export function NewsletterSignup({
	variant = "card",
	source = "website",
	className,
	showDescription = true,
}: NewsletterSignupProps) {
	const [state, formAction] = useActionState(subscribeNewsletterAction, initialState);
	const formRef = useRef<HTMLFormElement>(null);
	const turnstileRef = useRef<TurnstileRef>(null);
	const prevSuccess = useRef(false);

	const hiddenTokenId = `newsletter-turnstile-${variant}`;
	const handlers = tokenHandlers(hiddenTokenId);

	// Track analytics on success
	useEffect(() => {
		if (state.success && !prevSuccess.current) {
			prevSuccess.current = true;
			formRef.current?.reset();
			turnstileRef.current?.reset();
			trackNewsletterEvent("newsletter_subscribe", {
				method: "email",
				source: source,
				location: variant,
			});
			// Also fire GA4's native sign_up so the conversion catalog picks it up.
			trackSignUp("newsletter", {
				source: source ?? "website",
				location: variant,
			});
		}
	}, [state.success, source, variant]);

	if (state.success) {
		return <SuccessPanel variant={variant} className={className} />;
	}

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

				<form ref={formRef} action={formAction} className="space-y-3">
					<input type="hidden" name="source" value={source} />
					<input type="hidden" id={hiddenTokenId} name="turnstileToken" defaultValue="" />
					<div className="relative">
						<label htmlFor="newsletter-email-card" className="sr-only">
							Email address
						</label>
						<input
							id="newsletter-email-card"
							type="email"
							name="email"
							required
							placeholder="you@company.com"
							aria-invalid={state.error ? true : undefined}
							aria-describedby={state.error ? "newsletter-error-card" : undefined}
							className={cn(
								"w-full border bg-transparent px-4 py-3 font-mono text-sm transition-colors",
								"placeholder:text-slate-text/50",
								"focus:border-cyber-lime focus-visible:ring-cyber-lime focus:outline-none focus-visible:ring-2",
								state.error ? "border-burnt-ember" : "border-white/20"
							)}
						/>
					</div>

					<Turnstile
						ref={turnstileRef}
						onSuccess={handlers.onSuccess}
						onError={handlers.onError}
						onExpire={handlers.onExpire}
					/>

					{state.error && (
						<div
							id="newsletter-error-card"
							role="alert"
							className="text-burnt-ember flex items-center gap-2 text-sm"
						>
							<AlertCircle className="h-4 w-4 shrink-0" />
							<span>{state.error}</span>
						</div>
					)}

					<SubmitButton
						className={cn(
							"group flex w-full items-center justify-center gap-2 border px-4 py-3 font-mono text-sm transition-colors",
							"hover:border-cyber-lime hover:text-cyber-lime border-white/20",
							"disabled:cursor-not-allowed disabled:opacity-50"
						)}
						pendingText="Subscribing..."
					>
						<span>Subscribe</span>
						<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
					</SubmitButton>
				</form>

				<p className="text-slate-text/80 mt-3 text-xs">
					One actionable architecture decision every week. No fluff.
				</p>
			</div>
		);
	}

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
								Join The Architect&apos;s Brief ... one actionable insight every Tuesday.
							</p>
						)}
					</div>

					<form ref={formRef} action={formAction} className="flex flex-col gap-2">
						<input type="hidden" name="source" value={source} />
						<input type="hidden" id={hiddenTokenId} name="turnstileToken" defaultValue="" />
						<div className="flex gap-2">
							<label htmlFor="newsletter-email-inline" className="sr-only">
								Email address
							</label>
							<input
								id="newsletter-email-inline"
								type="email"
								name="email"
								required
								placeholder="you@company.com"
								aria-invalid={state.error ? true : undefined}
								aria-describedby={state.error ? "newsletter-error-inline" : undefined}
								className={cn(
									"w-full border bg-transparent px-4 py-2 font-mono text-sm md:w-64",
									"placeholder:text-slate-text/50",
									"focus:border-cyber-lime focus-visible:ring-cyber-lime focus:outline-none focus-visible:ring-2",
									state.error ? "border-burnt-ember" : "border-white/20"
								)}
							/>
							<SubmitButton
								className={cn(
									"shrink-0 border px-4 py-2 font-mono text-sm transition-colors",
									"hover:border-cyber-lime hover:text-cyber-lime border-white/20",
									"disabled:cursor-not-allowed disabled:opacity-50"
								)}
								pendingText="..."
							>
								Subscribe
							</SubmitButton>
						</div>
						<Turnstile
							ref={turnstileRef}
							onSuccess={handlers.onSuccess}
							onError={handlers.onError}
							onExpire={handlers.onExpire}
						/>
					</form>
				</div>

				{state.error && (
					<div
						id="newsletter-error-inline"
						role="alert"
						className="text-burnt-ember mt-2 flex items-center gap-2 text-sm"
					>
						<AlertCircle className="h-4 w-4 shrink-0" />
						<span>{state.error}</span>
					</div>
				)}
			</div>
		);
	}

	// Minimal variant (for footer)
	return (
		<form ref={formRef} action={formAction} className={cn("flex flex-col gap-2", className)}>
			<input type="hidden" name="source" value={source} />
			<input type="hidden" id={hiddenTokenId} name="turnstileToken" defaultValue="" />
			<div className="flex gap-2">
				<label htmlFor="newsletter-email-minimal" className="sr-only">
					Email address
				</label>
				<input
					id="newsletter-email-minimal"
					type="email"
					name="email"
					required
					placeholder="you@company.com"
					aria-invalid={state.error ? true : undefined}
					className={cn(
						"w-full border bg-transparent px-3 py-2 font-mono text-sm",
						"placeholder:text-slate-text/50",
						"focus:border-cyber-lime focus-visible:ring-cyber-lime focus:outline-none focus-visible:ring-2",
						state.error ? "border-burnt-ember" : "border-white/20"
					)}
				/>
				<SubmitButton
					className={cn(
						"shrink-0 border px-3 py-2 font-mono text-xs transition-colors",
						"hover:border-cyber-lime hover:text-cyber-lime border-white/20",
						"disabled:cursor-not-allowed disabled:opacity-50"
					)}
					pendingText="..."
				>
					Join
				</SubmitButton>
			</div>
			<Turnstile
				ref={turnstileRef}
				onSuccess={handlers.onSuccess}
				onError={handlers.onError}
				onExpire={handlers.onExpire}
			/>
		</form>
	);
}
