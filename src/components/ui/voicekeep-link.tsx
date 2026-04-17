"use client";

import { trackEvent } from "@/components/analytics";

const VOICEKEEP_BASE_URL = "https://voicekeep.io/";

/**
 * Outbound link to voicekeep.io with UTM attribution and a
 * `voicekeep_click` GA4 event. Use at every cross-domain surface so
 * we can attribute the exit to its placement (tools-card, work-case-study,
 * tools-redirect, etc).
 *
 * target="_blank" means gtag's beacon transport completes independently
 * of navigation -- no sequencing risk.
 */
interface VoicekeepLinkProps {
	placement: string;
	className?: string;
	children: React.ReactNode;
}

function buildVoicekeepUrl(placement: string): string {
	const params = new URLSearchParams({
		utm_source: "alexmayhew.dev",
		utm_medium: "referral",
		utm_campaign: "voicekeep_crosspromo",
		utm_content: placement,
	});
	return `${VOICEKEEP_BASE_URL}?${params.toString()}`;
}

export function VoicekeepLink({ placement, className, children }: VoicekeepLinkProps) {
	return (
		<a
			href={buildVoicekeepUrl(placement)}
			target="_blank"
			rel="noopener noreferrer"
			className={className}
			onClick={() =>
				trackEvent("voicekeep_click", {
					placement,
					destination: VOICEKEEP_BASE_URL,
				})
			}
		>
			{children}
		</a>
	);
}
