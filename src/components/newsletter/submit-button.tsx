"use client";

import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";

interface SubmitButtonProps {
	children: React.ReactNode;
	className?: string;
	pendingText?: string;
}

export function SubmitButton({ children, className, pendingText = "..." }: SubmitButtonProps) {
	const { pending } = useFormStatus();

	return (
		<button type="submit" disabled={pending} className={cn(className)}>
			{pending ? <span className="animate-pulse">{pendingText}</span> : children}
		</button>
	);
}
