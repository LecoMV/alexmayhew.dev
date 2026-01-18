import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "default" | "ghost" | "outline" | "cyber";
	size?: "sm" | "md" | "lg";
	asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant = "default", size = "md", children, ...props }, ref) => {
		const baseStyles =
			"group relative font-mono tracking-tight transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyber-lime";

		const variants = {
			default: "border border-white/20 hover:border-cyber-lime",
			ghost: "hover:bg-white/5",
			outline: "border border-white/10 hover:border-white/30",
			cyber: "bg-cyber-lime text-void-navy hover:bg-cyber-lime/90",
		};

		const sizes = {
			sm: "px-3 py-1.5 text-xs",
			md: "px-4 py-2 text-sm",
			lg: "px-6 py-3 text-sm",
		};

		return (
			<button
				ref={ref}
				className={cn(baseStyles, variants[variant], sizes[size], className)}
				{...props}
			>
				{/* Hover glow effect for default variant */}
				{variant === "default" && (
					<div className="bg-cyber-lime/5 absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
				)}
				<span
					className={cn(
						"relative",
						variant === "default" && "group-hover:text-cyber-lime transition-colors"
					)}
				>
					{children}
				</span>
			</button>
		);
	}
);

Button.displayName = "Button";

export { Button };
