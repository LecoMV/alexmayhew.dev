import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: "default" | "glass" | "solid";
	featured?: boolean;
	withCorners?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
	(
		{ className, variant = "default", featured = false, withCorners = true, children, ...props },
		ref
	) => {
		const variants = {
			default:
				"bg-gunmetal-glass/10 border border-white/10 backdrop-blur-sm hover:border-cyber-lime/50 transition-colors duration-300",
			glass: "bg-gunmetal-glass/20 border border-white/10 backdrop-blur-md",
			solid: "bg-gunmetal-glass border border-white/10",
		};

		return (
			<div
				ref={ref}
				className={cn(
					"group relative p-6",
					variants[variant],
					featured && "lg:col-span-2",
					className
				)}
				{...props}
			>
				{/* Corner accents */}
				{withCorners && (
					<>
						<div className="border-cyber-lime absolute top-0 right-0 h-4 w-4 border-t border-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
						<div className="border-cyber-lime absolute bottom-0 left-0 h-4 w-4 border-b border-l opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
					</>
				)}
				{children}
			</div>
		);
	}
);

Card.displayName = "Card";

// Card Header component
const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn("flex flex-col gap-1.5", className)} {...props} />
	)
);
CardHeader.displayName = "CardHeader";

// Card Title component
const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
	({ className, ...props }, ref) => (
		<h3
			ref={ref}
			className={cn("font-mono text-xl tracking-tight md:text-2xl", className)}
			{...props}
		/>
	)
);
CardTitle.displayName = "CardTitle";

// Card Description component
const CardDescription = forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<p
		ref={ref}
		className={cn("text-slate-text text-sm leading-relaxed md:text-base", className)}
		{...props}
	/>
));
CardDescription.displayName = "CardDescription";

// Card Content component
const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn("flex flex-col gap-4", className)} {...props} />
	)
);
CardContent.displayName = "CardContent";

// Card Footer component
const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn("mt-2 flex gap-4", className)} {...props} />
	)
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
