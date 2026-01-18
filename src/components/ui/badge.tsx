import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
	variant?: "default" | "outline" | "cyber" | "featured";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
	({ className, variant = "default", ...props }, ref) => {
		const variants = {
			default: "bg-white/5 text-white/60",
			outline: "border border-white/20 text-white/70",
			cyber: "border border-cyber-lime text-cyber-lime",
			featured: "border border-cyber-lime text-cyber-lime uppercase tracking-wider text-[10px]",
		};

		return (
			<span
				ref={ref}
				className={cn(
					"inline-flex items-center px-2 py-1 font-mono text-xs",
					variants[variant],
					className
				)}
				{...props}
			/>
		);
	}
);

Badge.displayName = "Badge";

export { Badge };
