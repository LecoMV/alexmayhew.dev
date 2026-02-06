"use client";

import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import Link from "next/link";

const CONSENT_KEY = "cookie-consent";
const CONSENT_VERSION = "1"; // Bump this to re-show consent after policy changes

interface ConsentState {
	analytics: boolean;
	version: string;
	timestamp: number;
}

interface GeoResponse {
	country: string | null;
	isEU: boolean;
	requiresCookieConsent: boolean;
}

const springTransition = {
	type: "spring" as const,
	stiffness: 100,
	damping: 20,
	mass: 1,
};

export function CookieConsent() {
	const [showBanner, setShowBanner] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Check existing consent
		const stored = localStorage.getItem(CONSENT_KEY);
		if (stored) {
			try {
				const consent: ConsentState = JSON.parse(stored);
				// If consent version matches, don't show banner
				if (consent.version === CONSENT_VERSION) {
					setIsLoading(false);
					return;
				}
			} catch {
				// Invalid stored consent, continue to check
			}
		}

		// Check if user is from EU/GDPR region
		fetch("/api/geo")
			.then((res) => res.json() as Promise<GeoResponse>)
			.then((data) => {
				// Only show banner to EU users who haven't consented
				if (data.requiresCookieConsent) {
					setShowBanner(true);
				}
			})
			.catch(() => {
				// On error, default to showing banner (safer for GDPR)
				setShowBanner(true);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

	const handleAccept = () => {
		const consent: ConsentState = {
			analytics: true,
			version: CONSENT_VERSION,
			timestamp: Date.now(),
		};
		localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
		setShowBanner(false);

		// Update GA4 Consent Mode v2
		if (typeof window !== "undefined" && window.gtag) {
			window.gtag("consent", "update", {
				analytics_storage: "granted",
			});
		}
	};

	const handleDecline = () => {
		const consent: ConsentState = {
			analytics: false,
			version: CONSENT_VERSION,
			timestamp: Date.now(),
		};
		localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
		setShowBanner(false);

		// Explicitly deny GA4 analytics storage
		if (typeof window !== "undefined" && window.gtag) {
			window.gtag("consent", "update", {
				analytics_storage: "denied",
			});
		}
	};

	// Don't render anything during loading or if not EU
	if (isLoading || !showBanner) return null;

	return (
		<AnimatePresence>
			{showBanner && (
				<m.div
					initial={{ opacity: 0, y: 100 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 100 }}
					transition={springTransition}
					className="fixed right-0 bottom-0 left-0 z-50 p-4 sm:p-6"
				>
					<div className="bg-gunmetal-glass/95 mx-auto max-w-2xl border border-white/10 p-6 backdrop-blur-md">
						<div className="flex items-start gap-4">
							<Cookie className="text-cyber-lime mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.5} />
							<div className="flex-1">
								<h3 className="mb-2 font-mono text-sm font-medium">Cookie Notice</h3>
								<p className="text-slate-text mb-4 text-sm leading-relaxed">
									We use analytics to understand how visitors interact with this site. If you
									accept, Google Analytics will collect anonymous usage data. We also use Cloudflare
									Web Analytics (privacy-friendly, no cookies) and Sentry for error monitoring.{" "}
									<Link href="/privacy" className="text-cyber-lime hover:underline">
										Learn more
									</Link>
								</p>
								<div className="flex flex-wrap gap-3">
									<button
										onClick={handleAccept}
										className="bg-cyber-lime hover:bg-cyber-lime/90 text-void-navy px-4 py-2 font-mono text-xs transition-colors"
									>
										ACCEPT
									</button>
									<button
										onClick={handleDecline}
										className="hover:border-cyber-lime hover:text-cyber-lime border border-white/20 px-4 py-2 font-mono text-xs transition-colors"
									>
										DECLINE
									</button>
								</div>
							</div>
							<button
								onClick={handleDecline}
								className="text-slate-text hover:text-mist-white transition-colors"
								aria-label="Close"
							>
								<X className="h-5 w-5" strokeWidth={1.5} />
							</button>
						</div>
					</div>
				</m.div>
			)}
		</AnimatePresence>
	);
}
