"use client";

import { trackSocialClick } from "@/components/analytics";

interface SocialLinkProps {
	href: string;
	label: string;
	network: string;
	location: string;
	className?: string;
	children: React.ReactNode;
}

/**
 * Outbound anchor that fires a GA4 `social_click` event on activation so
 * distribution attribution works on keyboard + mouse + middle-click.
 * Target="_blank" + rel="noopener noreferrer" preserved from the plain <a>.
 */
export function SocialLink({
	href,
	label,
	network,
	location,
	className,
	children,
}: SocialLinkProps) {
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			aria-label={label}
			className={className}
			onClick={() => trackSocialClick(network, { location, url: href })}
		>
			{children}
		</a>
	);
}
