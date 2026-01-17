"use client";

import { Turnstile as TurnstileWidget, type TurnstileInstance } from "@marsidev/react-turnstile";
import { forwardRef, useImperativeHandle, useRef } from "react";

export interface TurnstileRef {
	reset: () => void;
	getResponse: () => string | undefined;
}

interface TurnstileProps {
	onSuccess: (token: string) => void;
	onError?: () => void;
	onExpire?: () => void;
}

export const Turnstile = forwardRef<TurnstileRef, TurnstileProps>(
	({ onSuccess, onError, onExpire }, ref) => {
		const widgetRef = useRef<TurnstileInstance>(null);

		useImperativeHandle(ref, () => ({
			reset: () => widgetRef.current?.reset(),
			getResponse: () => widgetRef.current?.getResponse(),
		}));

		const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

		if (!siteKey) {
			// In development without key, render placeholder
			if (process.env.NODE_ENV === "development") {
				return (
					<div className="bg-gunmetal-glass/20 text-slate-text border border-white/10 px-4 py-3 font-mono text-xs">
						[Turnstile: Set NEXT_PUBLIC_TURNSTILE_SITE_KEY]
					</div>
				);
			}
			return null;
		}

		return (
			<TurnstileWidget
				ref={widgetRef}
				siteKey={siteKey}
				onSuccess={onSuccess}
				onError={onError}
				onExpire={onExpire}
				options={{
					theme: "dark",
					size: "flexible",
				}}
			/>
		);
	}
);

Turnstile.displayName = "Turnstile";
