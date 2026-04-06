import { cn } from "@/lib/utils";

interface CornerBracketsProps {
	hover?: boolean;
}

export function CornerBrackets({ hover }: CornerBracketsProps) {
	const hoverClass = hover
		? "opacity-0 transition-opacity duration-300 group-hover:opacity-100"
		: "";
	return (
		<>
			<div
				className={cn(
					"border-cyber-lime absolute top-0 right-0 h-3 w-3 border-t border-r",
					hoverClass
				)}
			/>
			<div
				className={cn(
					"border-cyber-lime absolute bottom-0 left-0 h-3 w-3 border-b border-l",
					hoverClass
				)}
			/>
		</>
	);
}
